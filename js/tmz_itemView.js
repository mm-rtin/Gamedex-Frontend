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
    var SORT_TYPES = {'alphabetical': 0, 'metascore': 1, 'releaseDate': 2, 'platform': 3, 'price': 4};
    var PANEL_HEIGHT_OFFSET = 200;
    var PANEL_HEIGHT_PADDING = 40;
    var VIEW_ALL_TAG_ID = '0';

    // list
    var itemList = null;
	var listOptions = {
		valueNames: ['itemName', 'metascore', 'releaseDate', 'platform', 'gameStatus', 'playStatus', 'userRating'],
		item: 'list-item'
	};

    // properties
	var currentViewTagID = VIEW_ALL_TAG_ID;
    var displayType = DISPLAY_TYPE.Icons;
    var currentSortIndex = 0;
    var filterHasBeenApplied = false;

    // node cache
    var $itemResults = $('#itemResults');
    var $viewlistContainer = $('#viewListContainer');
    var $viewItemsContainer = $('#viewItemsContainer');
    var $itemResultsContainer = $('#itemResultsContainer');
    var $displayOptions = $viewItemsContainer.find('.displayOptions');
    var $sortOptions = $viewItemsContainer.find('.sortOptions');
    var $filterOptions = $viewItemsContainer.find('.filterOptions');
    var $viewList = $('#viewList');

    // filter nodes
    var $filterStatus = $viewItemsContainer.find('.filterStatus');
    var $filterDropDownBtn = $viewItemsContainer.find('.filterDropDown_btn');
    var $listFiltersButton = $viewItemsContainer.find('.listFilters_btn');
    var $applyFiltersButton = $('#applyFilters_btn');
    var $filtersModal = $('#filters-modal');

    var $releaseDateFilter = $('#releaseDate_filter');
    var $gameStatusFilter = $('#gameStatus_filter');
    var $playStatusFilter = $('#playStatus_filter');
    var $metascoreFilter = $('#metascore_filter');
    var $platformFilter = $('#platformFilterList');

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

		// init tooltips
		$filterStatus.tooltip();
		$filterDropDownBtn.tooltip();
		$displayOptions.find('button').each(function(key, button) {
			$(button).tooltip();
		});

		// update nano scroller sizes periodically
		setInterval(function() {
			$itemResultsContainer.nanoScroller();
		}, 1500);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    ItemView.createEventHandlers = function() {

		// filter buttons
        $filtersModal.on('click', '.btn-group button', function(e) {
            e.preventDefault();
        });

		// listFilters_btn: click
		$listFiltersButton.click(function(e) {
			e.preventDefault();

			$filtersModal.modal('show');
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();
			// apply filters
			applyFilters();
		});

		// filterStatus: click
		$filterStatus.click(function(e) {
			e.preventDefault();
			// clear filters
			resetFilters();
			applyFilters();
		});

		// viewList: keypress
		$viewlistContainer.find('input').live({
			// keypress event
			keydown: function(e){
				Utilities.handleInputKeyDown(e, $viewlistContainer, ListModel);
			}
		});

		// item record: click
		$viewItemsContainer.on('click', '#itemResults tr', function() {
			viewItem($(this).attr('id'));
		});

		// viewList: change
		$viewList.chosen().change(viewListChanged);

		// deleteItem_btn: click
		$itemResults.on('click', '.deleteItem_btn', function(e) {

			// get id from delete button attribute
			var id = $(this).attr('data-content');
			deleteItem(id);
		});

		// deleteList_btn: click
		$viewItemsContainer.on('click', '#deleteList_btn', function() {

			// delete currently viewing list
			deleteList(currentViewTagID);
		});

		// displayType toggle
		$displayOptions.find('button').click(function(e) {
			e.preventDefault();
			changeDisplayType(this);
		});

		// sortOptions select
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList(parseInt($(this).attr('data-content'), 10));
		});

		// filterOptions select
		$filterOptions.find('li a').click(function(e) {
			e.preventDefault();
			quickFilter(parseInt($(this).attr('data-content'), 10));
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

		// add displayType/currentViewTagID to templateData
		templateData.displayType = displayType;
		templateData.currentViewTagID = currentViewTagID;

		// render model data to template
		$itemResults.html(itemResultsTemplate(templateData));

		// load preliminary data (for filtering, sorting)
		_.each(items, function(item, key) {
			displayMetascore(item);
		});

		// load latest/extra information for each item
		_.each(items, function(item, key) {
			loadThirdPartyData(item);
		});

		// update list.js for item list
		itemList = new List('itemResultsContainer', listOptions);

		// sort using current sort method
		sortList(currentSortIndex);

		// apply filters
		applyFilters();

		// reset filters - allow filter index to be recreated after dynamic data loaded
		filterHasBeenApplied = false;
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
		getItems(VIEW_ALL_TAG_ID, render);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListDeletions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListDeletions = function(itemID, itemsDeleted) {

		var tagCount = null;

		// remove items deleted from view
		for (var i = 0, len = itemsDeleted.length; i < len; i++) {

			// remove element from html
			// except when in 'view all' list (id: 0) and itemDeleted is the last tag for itemID
			if (currentViewTagID === VIEW_ALL_TAG_ID) {

				// get item by id
				tagCount = ItemData.getDirectoryItemByItemID(itemID).tagCount;

				if (tagCount === 0) {

					// remove item by itemID
					$itemResults.find('tr[data-content="' + itemID + '"]').remove();
				}

			// not viewing 'all items' remove item
			} else {
				$('#' + itemsDeleted[i].id).remove();
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAdditions
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAdditions = function(data, addedItems) {

		var renderCurrentList = false;

		// viewing user list
		if (currentViewTagID !== VIEW_ALL_TAG_ID) {

			// iterate added listIDs - render if viewing list where item was added
			for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

				if (data.tagIDsAdded[i] == currentViewTagID) {
					renderCurrentList = true;
				}
			}

		// viewing 'all list' view
		// don't re-render item already displayed in 'view all' list
		} else if (ItemData.getDirectoryItemByItemID(data.itemID).tagCount === 1) {
			renderCurrentList = true;
		}

		if (renderCurrentList) {
			console.info('render');
			// get and render items
			ItemData.getItems(currentViewTagID, function(items) {
				render(items);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAttributesChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAttributesChanged = function(item) {

		// get and render items
		ItemData.getItems(currentViewTagID, function(items) {
			render(items);
		});

		// get item element in view list
		// var $item = $('#' + item.id);

		// // update item html directly
		// $item.find('.gameStatus').html(item.gameStatus);
		// $item.find('.playStatus').html(item.playStatus);
		// $item.find('.userRating').html(item.userRating);

		// update list
		//itemList = new List('itemResultsContainer', listOptions);
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
		Amazon.getAmazonItemOffers(item.asin, item, function(offers) {
			amazonPrice_result(item.id, offers);
		});

		// get metascore
		Metacritic.getMetascore(item.standardName, item, displayMetascore);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addUserAttributes = function(item) {

		// find directory item by itemID
		itemData = ItemData.getDirectoryItemByItemID(item.itemID);

		// add attributes to model item
		item.gameStatus = itemData.gameStatus;
		item.playStatus = itemData.playStatus;
		item.userRating = itemData.userRating;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonPrice_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonPrice_result = function(id, offers) {

		// display price
		var priceSelector = '#' + id + ' .priceDetails';

		// attach to existing item result
		$(priceSelector).html(priceMenuTemplate(offers));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayMetascore = function(item) {

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
	* deleteItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem = function(id) {

		// delete item from server
		var itemID = ItemData.deleteSingleTagForItem(id, currentViewTagID, deleteItem_result);

		// remove tag from detail view
		DetailView.removeTagForItemID(itemID, currentViewTagID);

		// remove element from html
		$('#' + id).remove();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_result = function(data) {

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteList = function(tagID) {

		// delete database data
		ListData.deleteList(tagID, deleteList_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteList_result = function(data) {

		// update listModel
		ListModel.getList();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		var quickFilter = filterType;

		// reset filters
		resetFilters();

		switch (quickFilter) {

			// upcoming
			case 0:
				// unreleased, released
				upcomingQuickFilter();
				break;

			// new releases
			case 1:
				newReleasesQuickFilter();
				break;

			// never played
			case 2:
				neverPlayedQuickFilter();
				break;

			// games playing
			case 3:
				gamesPlayingQuickFilter();
				break;

			// finished games
			case 4:
				finishedGamesQuickFilter();
				break;

			// owned games
			case 5:
				ownedGamesQuickFilter();
				break;

			// wanted games
			case 6:
				wantedGamesQuickFilter();
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* upcomingQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var upcomingQuickFilter = function() {

		// activate filter panel option
		$releaseDateFilter.find('button[data-content="0"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.releaseDate);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* newReleasesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var newReleasesQuickFilter = function() {

		// activate filter panel option
		$releaseDateFilter.find('button[data-content="1"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.releaseDate);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* neverPlayedQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var neverPlayedQuickFilter = function() {

		// activate filter panel option
		$playStatusFilter.find('button[data-content="0"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.metascore);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gamesPlayingQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gamesPlayingQuickFilter = function() {

		// activate filter panel option
		$playStatusFilter.find('button[data-content="1"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.metascore);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finishedGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finishedGamesQuickFilter = function() {

		// activate filter panel option
		$playStatusFilter.find('button[data-content="2"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.metascore);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* ownedGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var ownedGamesQuickFilter = function() {

		// activate filter panel option
		$gameStatusFilter.find('button[data-content="1"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.metascore);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* wantedGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var wantedGamesQuickFilter = function() {

		// activate filter panel option
		$gameStatusFilter.find('button[data-content="3"]').addClass('active');

		// sort and apply filter
		sortList(SORT_TYPES.metascore);
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		console.info('apply filter');

		// re-initialize list if first run of filter
		if (filterHasBeenApplied === false) {
			//itemList = new List('itemResultsContainer', listOptions);
			filterHasBeenApplied = true;
		}

		var filtered = false;
		var releaseDateFilters = [];
		var metascoreFilters = [];
		var platformFilters = [];
		var gameStatusFilters = [];
		var playStatusFilters = [];

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				releaseDateFilters.push(true);
			} else {
				releaseDateFilters.push(false);
			}
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				metascoreFilters.push(true);
			} else {
				metascoreFilters.push(false);
			}
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				gameStatusFilters.push(true);
			} else {
				gameStatusFilters.push(false);
			}
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				playStatusFilters.push(true);
			} else {
				playStatusFilters.push(false);
			}
		});

		// iterate platform filter options
		platformFilters = $platformFilter.val() || [];

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
			filtered = true;
			return false;
		});

		// check if filtered - show filterStatus button
		if (filtered) {
			console.info('filtered');
			$filterStatus.show();
		} else {
			console.info('no filters');
			$filterStatus.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetFilters = function(item) {

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all platform options, deselect
		$platformFilter.find('option').each(function(key, item) {
			$(this).removeAttr('selected');
		});
		$platformFilter.trigger("liszt:updated");
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		currentSortIndex = sortType;

		switch (currentSortIndex) {

			// alphabetical
			case SORT_TYPES.alphabetical:
				// set sort status
				$sortOptions.find('.currentSort').text('Alphabetical');
				// sort new list
				itemList.sort('itemName', { asc: true });

				break;

			// metascores
			case SORT_TYPES.metascore:
				$sortOptions.find('.currentSort').text('Review Score');
				itemList.sort('scoreDetails', {sortFunction: metascoreSort});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortOptions.find('.currentSort').text('Release Date');
				itemList.sort('releaseDate', {sortFunction: releaseDateSort});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortOptions.find('.currentSort').text('Platform');
				itemList.sort('platform', { asc: true });

				break;

			// price
			case SORT_TYPES.price:
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
