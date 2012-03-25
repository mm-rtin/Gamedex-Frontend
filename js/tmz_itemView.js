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
    var FilterPanel = tmz.module('filterPanel');

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
    var $viewList = $('#viewList');

    // filter nodes
    var $filterOptions = $viewItemsContainer.find('.filterOptions');
    var $filterStatus = $filterOptions.find('.filterStatus');
    var $filterDropDownBtn = $filterOptions.find('.filterDropDown_btn');
    var $listFiltersButton = $filterOptions.find('.listFilters_btn');
    var $applyFiltersButton = $('#applyFilters_btn');

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
		$filterStatus.tooltip({delay: {show: 500, hide: 50}});
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}});
		$displayOptions.find('button').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}});
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

		// listFilters_btn: click
		$listFiltersButton.click(function(e) {
			e.preventDefault();

			FilterPanel.showFilterPanel();
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
			$listFiltersButton.find('.filterName').text(' Filters');
			FilterPanel.resetFilters();
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
			loadPreliminaryMetascore(item);
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
		getItems(VIEW_ALL_TAG_ID);
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

		// update view list
		ListModel.updateViewList(data.tagIDsAdded, currentViewTagID);

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

			// get and render items
			getItems(currentViewTagID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAttributesChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAttributesChanged = function(item) {

		// get and render items
		getItems(currentViewTagID);
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
		getItems($viewList.val());
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(tagID) {

		// save tagID
		currentViewTagID = tagID;

		// load item data for tagID
		ItemData.getItems(tagID,

			// success - render items
			function(items) {
				render(items);
			},

			// error - empty view
			function() {
				render({});
			}
		);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadThirdPartyData - loads and displays specialized item detail and populates new data into item model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadThirdPartyData = function(item) {

		// get amazon price data
		Amazon.getAmazonItemOffers(item.asin, item, function(offers) {
			amazonPrice_result(item.id, offers);
		});

		// get updated metascore
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
	* load -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadPreliminaryMetascore = function(item) {

		// set displayMetascore and metascorePage preliminary data attributes
		if (item.metascore === -1) {
			item.displayMetascore = 'n/a';
		} else {
			item.displayMetascore = item.metascore;
		}
		item.metascorePage = '';

		displayMetascore(item);
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

		// default back to 'view all' list
		getItems(VIEW_ALL_TAG_ID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		var quickFilter = filterType;

		// reset filters
		$listFiltersButton.find('.filterName').text(' Filters');
		FilterPanel.resetFilters();

		switch (quickFilter) {

			// upcoming
			case 0:
				// sort and apply filter
				sortList(SORT_TYPES.releaseDate);
				// set current filter text on filters button
				$listFiltersButton.find('.filterName').text(' Upcoming');
				// set filter panel option
				FilterPanel.upcomingQuickFilter(itemList);
				break;

			// new releases
			case 1:
				sortList(SORT_TYPES.releaseDate);
				$listFiltersButton.find('.filterName').text(' New Releases');
				FilterPanel.newReleasesQuickFilter(itemList);
				break;

			// never played
			case 2:
				sortList(SORT_TYPES.metascore);
				$listFiltersButton.find('.filterName').text(' Never Played');
				FilterPanel.neverPlayedQuickFilter(itemList);
				break;

			// games playing
			case 3:
				sortList(SORT_TYPES.metascore);
				$listFiltersButton.find('.filterName').text(' Playing');
				FilterPanel.gamesPlayingQuickFilter(itemList);
				break;

			// finished games
			case 4:
				sortList(SORT_TYPES.metascore);
				$listFiltersButton.find('.filterName').text(' Finished');
				FilterPanel.finishedGamesQuickFilter(itemList);
				break;

			// owned games
			case 5:
				sortList(SORT_TYPES.metascore);
				$listFiltersButton.find('.filterName').text(' Owned');
				FilterPanel.ownedGamesQuickFilter(itemList);
				break;

			// wanted games
			case 6:
				sortList(SORT_TYPES.metascore);
				$listFiltersButton.find('.filterName').text(' Wanted');
				FilterPanel.wantedGamesQuickFilter(itemList);
				break;
		}

		// apply filters and toggle filter status
		toggleFilterStatus(FilterPanel.applyListJSFiltering(itemList));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		// apply filters to itemList
		var filtered = FilterPanel.applyListJSFiltering(itemList);
		// set filtered Status icon
		toggleFilterStatus(filtered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* toggleFilterStatus -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var toggleFilterStatus = function(filtered) {

		// check if filtered - show filterStatus button
		if (filtered) {
			$filterStatus.show();
		} else {
			$filterStatus.hide();
		}
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
