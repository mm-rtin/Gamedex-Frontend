// ITEM VIEW
(function(ItemView) {

    // modules references
    var User = tmz.module('user');
    var ListModel = tmz.module('list');
    var Utilities = tmz.module('utilities');
    var DetailView = tmz.module('detailView');
    var GridView = tmz.module('gridView');
    var ItemData = tmz.module('itemData');
    var ListData = tmz.module('listData');
    var Amazon = tmz.module('amazon');
    var Metacritic = tmz.module('metacritic');
    var ItemLinker = tmz.module('itemLinker');

    // constants
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1};
    var PANEL_HEIGHT_OFFSET = 200;
    var PANEL_HEIGHT_PADDING = 40;

    // list
    var itemList = null;
	var listOptions = {
		valueNames: ['itemName', 'metascore', 'releaseDate', 'platform', 'gameStatus', 'playStatus', 'userRating'],
		item: 'list-item'
	};

    // properties
	var currentViewTagID = 0;
    var displayType = DISPLAY_TYPE.Icons;
    var currentSortIndex = 0;
    var filterHasBeenApplied = false;

    // node cache
    var $itemResults = $('#itemResults');
    var $viewItemsContainer = $('#viewItemsContainer');
    var $itemResultsContainer = $('#itemResultsContainer');
    var $displayOptions = $viewItemsContainer.find('.displayOptions');
    var $sortOptions = $viewItemsContainer.find('.sortOptions');
    var $filterOptions = $viewItemsContainer.find('.filterOptions');
    var $viewList = $('#viewList');

	// jquery objects
	var currentHoverItem = null;

	// templates
	var priceMenuTemplate = _.template($('#price-menu-template').html());
	var itemResultsTemplate = _.template($('#item-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.init = function() {

		ItemView.createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    ItemView.createEventHandlers = function() {

		var viewlistContainer = $('#viewListContainer');

		// filter buttons
        $('#filters-modal').on('click', '.btn-group button', function(e) {
            e.preventDefault();
        });

		// listFilters_btn: click
		$('.listFilters_btn').click(function(e) {
			e.preventDefault();

			$('#filters-modal').modal('show');
		});

		// applyFilters_btn: click
		$('#applyFilters_btn').click(function(e) {
			e.preventDefault();
			applyFilters();
		});

		// viewList: keypress
		$(viewlistContainer).find('input').live({
			// keypress event
			keydown: function(e){
				Utilities.handleInputKeyDown(e, viewlistContainer, ListModel);
			}
		});

		// item record: click
		$viewItemsContainer.on('click', '#itemResults tr', function() {
			viewItem($(this).attr('id'));
		});

		// viewList: change
		$viewList.chosen().change(viewListChanged);

		// deleteItem_btn: click
		$itemResults.on('click', '.deleteItem_btn', onDeleteBtn_click);

		// deleteList_btn: click
		$viewItemsContainer.on('click', '#deleteList_btn', onDeleteListBtn_click);

		// displayType toggle
		$displayOptions.find('button').click(function(e) {
			e.preventDefault();
			changeDisplayType(this);
		});

		// sortOptions select
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList($(this).attr('data-content'));
		});

		// filterOptions select
		$filterOptions.find('li a').click(function(e) {
			e.preventDefault();
			quickFilter($(this).attr('data-content'));
		});

		// show grid view button: click
		$('#gridView_btn').click(function(e) {
			e.preventDefault();
			showGridView();
		});

		// window, itemResults: resized
		$itemResults.resize(ItemView.resizePanel);
		$(window).resize(ItemView.resizePanel);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* render -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var render = function(items) {

		// add user attributes to model
		_.each(items, function(item, key) {
			addUserAttributes(item);
		});

		// get model data
		var templateData = {'items': items};

		// add displayType to templateData
		templateData.displayType = displayType;

		// render model data to template
		$itemResults.html(itemResultsTemplate(templateData));

		// load extra information for each item
		_.each(items, function(item, key) {
			loadThirdPartyData(item);
		});

		// initialize list.js for item list
		itemList = new List('itemResultsContainer', listOptions);

		// reset filters
		filterHasBeenApplied = false;

		// sort using current sort method
		sortList(currentSortIndex);

		// set nanoscroll
		setTimeout(function() {
			$itemResultsContainer.nanoScroller();
		}, 500);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.getItem = function(id) {

		return ItemData.getItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.resizePanel = function() {

		var windowHeight = $(window).height();
		var resultsHeight = $itemResults.height();

		if (resultsHeight < windowHeight - PANEL_HEIGHT_OFFSET) {
			$itemResultsContainer.css({'height': resultsHeight + PANEL_HEIGHT_PADDING});
		} else {
			$itemResultsContainer.css({'height': windowHeight - PANEL_HEIGHT_OFFSET});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* userLoggedIn -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.userLoggedIn = function(item) {

		// start with all items viewing
		getItems('0', render);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListDeletions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListDeletions = function(itemsDeleted) {

		for (var i = 0, len = itemsDeleted.length; i < len; i++) {
			if (itemsDeleted[i].tagID == currentViewTagID) {

				// delete item from model
				ItemData.deleteClientItem(itemsDeleted[i].id);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAdditions
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAdditions = function(itemData, itemIDs, listIDs) {

		var length = listIDs.length;

		// clone itemData as new item object
		var item = jQuery.extend(true, {}, itemData);

		// remove rendered flag
		delete item.rendered;

		// iterate listIDs
		for (var i = 0, len = listIDs.length; i < len; i++) {

			// item added to currently viewing tag - update list view display
			if (listIDs[i] == currentViewTagID) {

				// update item with related id for listID needing update
				item.id = itemIDs[i];

				// add item to model
				ItemData.addClientItem(item);
			}
		}

		// get items and render
		ItemData.getItems(currentViewTagID, function(items) {

			// render items
			render(items);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showGridView = function() {

		// show grid for current tag
		GridView.showGridView(currentViewTagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewListChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewListChanged = function() {

		// load items
		getItems($viewList.val(), render);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(tagID, onSuccess) {

		// save tagID
		currentViewTagID = tagID;

		// load item data for tagID
		ItemData.getItems(tagID, function(items) {

			onSuccess(items);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadThirdPartyData - loads and displays specialized item detail and populates new data into item model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadThirdPartyData = function(item) {

		// get amazon price data
		Amazon.getAmazonItemOffers(item.asin, item, amazonPrice_result);

		// get metascore
		Metacritic.getMetascore(item.standardName, item, metascore_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addUserAttributes = function(item) {

		// find item by itemID in directory
		itemData = ItemData.getItemByItemID(item.itemID);

		// add attributes to model item
		item.gameStatus = itemData.gameStatus;
		item.playStatus = itemData.playStatus;
		item.userRating = itemData.userRating;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonPrice_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonPrice_result = function(item) {

		// display price
		var priceSelector = '#' + item.id + ' .priceDetails';
		var formattedOfferData = Amazon.formatOfferData(item.offers);

		// attach to existing item result
		$(priceSelector).html(priceMenuTemplate(formattedOfferData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascore_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascore_result = function(item) {

		// display score
		var metascoreSelector = '#' + item.id + ' .metascore';
		Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewItem = function(id) {

		// get item
		var item = ItemView.getItem(id);

		// show item detail page
		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* onDeleteBtn_click -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var onDeleteBtn_click = function(e) {

		e.preventDefault();
		e.stopPropagation();

		// get id from delete button attribute
		var id = $(this).attr('data-content');

		// delete item from server
		ItemData.deleteServerItem(id, deleteItem_result);

		// delete from client data model
		var deletedItem = ItemData.deleteClientItem(id);

		console.info(deletedItem);
		// remove tag from detail view
		DetailView.removeTagForItemID(deletedItem.itemID, currentViewTagID);

		// remove element from html
		$('#' + deletedItem.id).remove();
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_result = function(data) {

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* onDeleteListBtn_click -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var onDeleteListBtn_click = function(e) {

		e.preventDefault();

		// delete database data
		ListData.deleteList(currentViewTagID, deleteList_result);

		// clear current list model data
		items.set({'items': []});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteList_result = function(data) {

		// update listModel
		ListModel.getList();
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		// re-initialize list if first run of filter
		if (filterHasBeenApplied === false) {
			itemList = new List('itemResultsContainer', listOptions);
			filterHasBeenApplied = true;
		}

		var releaseDateFilters = [];
		var metascoreFilters = [];
		var platformFilters = [];
		var gameStatusFilters = [];
		var playStatusFilters = [];

		// iterate all release date filter options
		$('#releaseDate_filter').find('button').each(function() {

			if ($(this).hasClass('active')) {
				releaseDateFilters.push(true);
			} else {
				releaseDateFilters.push(false);
			}
		});

		// iterate all metascore filter options
		$('#metascore_filter').find('button').each(function() {

			if ($(this).hasClass('active')) {
				metascoreFilters.push(true);
			} else {
				metascoreFilters.push(false);
			}
		});

		// iterate all gamestauts filter options
		$('#gameStatus_filter').find('button').each(function() {

			if ($(this).hasClass('active')) {
				gameStatusFilters.push(true);
			} else {
				gameStatusFilters.push(false);
			}
		});

		// iterate all playstatus filter options
		$('#playStatus_filter').find('button').each(function() {

			if ($(this).hasClass('active')) {
				playStatusFilters.push(true);
			} else {
				playStatusFilters.push(false);
			}
		});

		// iterate platform filter options
		platformFilters = $('#platformFilterList').val() || [];

		for (var i = 0, len = platformFilters.length; i < len; i++) {
			platformFilters[i] = Utilities.getStandardPlatform(platformFilters[i]);
		}

		// apply  filters
		itemList.filter(function(itemValues) {

			var releaseDateStatus = releaseDateFilter(itemValues, releaseDateFilters);
			var metascoreStatus = metascoreFilter(itemValues, metascoreFilters);
			var platformStatus = platformFilter(itemValues, platformFilters);
			var gameStatus = gameStatusFilter(itemValues, gameStatusFilters);
			var playStatus = playStatusFilter(itemValues, playStatusFilters);

			// not filtered
			if (releaseDateStatus && metascoreStatus && platformStatus && playStatus && gameStatus) {
				return true;
			}

			// filtered out
			return false;
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		var quickFilter = parseInt(filterType, 10);

		switch (quickFilter) {

			// upcoming
			case 0:
				// unreleased, released
				releaseDatesQuickFilter([true, false]);
				break;

			// new releases
			case 1:
				// unreleased, released
				releaseDatesQuickFilter([false, true]);
				break;

			// best unplayed
			case 2:
				// not started, playing, finished
				bestPendingGamesQuickFilter([true, false, false]);
				break;

			// best unfinished
			case 3:
				// not started, playing, finished
				bestPendingGamesQuickFilter([false, true, false]);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDatesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDatesQuickFilter = function(filterList) {

		var applyFilterAndSort = function() {

			// filter
			itemList.filter(function(itemValues) {
				if (releaseDateFilter(itemValues, filterList)) {
					return true;
				}
				return false;
			});

			// sort
			$sortOptions.find('.currentSort').text('Release Date');
			itemList.sort('releaseDate', {sortFunction: releaseDateSort});
		};

		// already viewing all items: apply filter
		if (currentViewTagID === '0') {
			applyFilterAndSort();

		// view all: then apply filter
		} else {
			getItems('0', function(items) {

				render(items);
				applyFilterAndSort();
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* bestPendingGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var bestPendingGamesQuickFilter = function(filterList) {

		var applyFilterAndSort = function() {

			// filter
			itemList.filter(function(itemValues) {
				if (playStatusFilter(itemValues, filterList)) {
					return true;
				}
				return false;
			});

			// sort
			$sortOptions.find('.currentSort').text('Review Score');
			itemList.sort('scoreDetails', {sortFunction: metascoreSort});
		};

		// already viewing all items: apply filter
		if (currentViewTagID === '0') {
			applyFilterAndSort();

		// view all: then apply filter
		} else {
			ItemData.getItems('0', function(items) {

				render(items);
				applyFilterAndSort();
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		currentSortIndex = parseInt(sortType, 10);

		switch (currentSortIndex) {

			// alphabetical
			case 0:
				// set sort status
				$sortOptions.find('.currentSort').text('Alphabetical');
				// sort new list
				itemList.sort('itemName', { asc: true });

				break;

			// review scores
			case 1:
				$sortOptions.find('.currentSort').text('Review Score');
				itemList.sort('scoreDetails', {sortFunction: metascoreSort});

				break;

			// release date
			case 2:
				$sortOptions.find('.currentSort').text('Release Date');
				itemList.sort('releaseDate', {sortFunction: releaseDateSort});

				break;

			// platform
			case 3:
				$sortOptions.find('.currentSort').text('Platform');
				itemList.sort('platform', { asc: true });

				break;

			// price
			case 4:
				$sortOptions.find('.currentSort').text('Price');
				itemList.sort('priceDetails', {sortFunction: priceSort});

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreSort = function(firstItem, secondItem) {

		$element1 = $(firstItem.elm).find('.metascore');
		$element2 = $(secondItem.elm).find('.metascore');

		score1 = parseInt($element1.attr('data-score'), 10);
		score2 = parseInt($element2.attr('data-score'), 10);

		if (score1 < score2) {
			return 1;
		}
		return -1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function(firstItem, secondItem) {

		$element1 = $(firstItem.elm).find('.priceDetails .lowestNew');
		$element2 = $(secondItem.elm).find('.priceDetails .lowestNew');

		price1 = parseInt($element1.attr('data-price'), 10);
		price2 = parseInt($element2.attr('data-price'), 10);

		if (price1 < price2) {
			return -1;
		}
		return 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function(firstItem, secondItem) {

		$element1 = $(firstItem.elm).find('.releaseDate');
		$element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date2 - date1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateFilter = function(itemValues, filterList) {

		// filter config (1: unreleased, 2: released)
		var unreleasedFilter = filterList[0];
		var releasedFilter = filterList[1];

		var releaseDate = moment(itemValues.releaseDate, 'YYYY-MM-DD');
		var currentDate = moment();

		var diff = releaseDate.diff(currentDate, 'seconds');

		// all filters active - ignore filter
		if (unreleasedFilter && releasedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!unreleasedFilter && !releasedFilter) {
			return true;

		// specific filter
		} else if (unreleasedFilter && diff > 0) {
			return true;
		} else if (releasedFilter && diff < 0) {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gameStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gameStatusFilter = function(itemValues, filterList) {

		var noneFilter = filterList[0];
		var ownFilter = filterList[1];
		var soldFilter = filterList[2];
		var wantedFilter = filterList[3];

		var gameStatus = itemValues.gameStatus;

		// all filters active - ignore filter
		if (noneFilter && ownFilter && soldFilter && wantedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!noneFilter && !ownFilter && !soldFilter && !wantedFilter) {
			return true;

		// specific filters
		} else if (noneFilter && gameStatus === '0') {
			return true;
		} else if (ownFilter && gameStatus === '1') {
			return true;
		} else if (soldFilter && gameStatus === '2') {
			return true;
		} else if (wantedFilter && gameStatus === '3') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playStatusFilter = function(itemValues, filterList) {

		var notPlayingFilter = filterList[0];
		var playingFilter = filterList[1];
		var finishedFilter = filterList[2];

		var playStatus = itemValues.playStatus;

		// all filters active - ignore filter
		if (notPlayingFilter && playingFilter && finishedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!notPlayingFilter && !playingFilter && !finishedFilter) {
			return true;

		// specific filters
		} else if (notPlayingFilter && playStatus === '0') {
			return true;
		} else if (playingFilter && playStatus === '1') {
			return true;
		} else if (finishedFilter && playStatus === '2') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreFilter = function(itemValues, filterList) {

		var _90sFilter = filterList[0];
		var _80sFilter = filterList[1];
		var _70sFilter = filterList[2];
		var _60sFilter = filterList[3];
		var _50sFilter = filterList[4];
		var _25to49Filter = filterList[5];
		var _0to24Filter = filterList[6];

		var score = parseInt(itemValues.metascore, 10);

		// all filters selected - ignore filter
		if (_90sFilter && _80sFilter && _70sFilter && _60sFilter && _50sFilter && _25to49Filter && _0to24Filter) {
			return true;

		// no filters selected - ignore filter
		} else if (!_90sFilter && !_80sFilter && !_70sFilter && !_60sFilter && !_50sFilter && !_25to49Filter && !_0to24Filter) {
			return true;

		// specifc filter
		} else if (_90sFilter && score >= 90) {
			return true;
		} else if (_80sFilter && score >= 80 && score < 90) {
			return true;
		} else if (_70sFilter && score >= 70 && score < 80) {
			return true;
		} else if (_60sFilter && score >= 60 && score < 70) {
			return true;
		} else if (_50sFilter && score >= 50 && score < 60) {
			return true;
		} else if (_25to49Filter && score >= 25 && score < 50) {
			return true;
		} else if (_0to24Filter && score >= 0 && score < 25) {
			return true;
		}

		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var platformFilter = function(itemValues, filterList) {

		// platform filter list empty - no filter
		if (filterList.length === 0) {
			return true;
		}

		// iterate platform list
		var platform = itemValues.platform;
		for (var i = 0, len = filterList.length; i < len; i++) {

			if (filterList[i].name === platform) {
				return true;
			}
		}

		return false;
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(toggleButton) {

		var currentDisplayType = $(toggleButton).attr('data-content');

		// set new display type if changed
		if (displayType !== currentDisplayType) {
			displayType = currentDisplayType;

			// change #itemResults tbody class
			$itemResults.find('tbody').removeClass().addClass('display-' + displayType);

			// set nanoscroll
			$itemResultsContainer.nanoScroller();
		}
	};

})(tmz.module('itemView'));
