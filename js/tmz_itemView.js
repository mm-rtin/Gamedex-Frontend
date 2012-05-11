// ITEM VIEW
(function(ItemView, tmz, $, _, ListJS) {
	"use strict";

    // modules references
    var User = tmz.module('user'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),
		DetailView = tmz.module('detailView'),
		GridView = tmz.module('gridView'),
		ItemData = tmz.module('itemData'),
		ItemCache = tmz.module('itemCache'),
		TagData = tmz.module('tagData'),
		Amazon = tmz.module('amazon'),
		Metacritic = tmz.module('metacritic'),
		ItemLinker = tmz.module('itemLinker'),
		FilterPanel = tmz.module('filterPanel'),

		// constants
		DISPLAY_TYPE = {'List': 0, 'Icons': 1},
		SORT_TYPES = {'alphabetical': 0, 'metascore': 1, 'releaseDate': 2, 'platform': 3, 'price': 4},
		PANEL_HEIGHT_OFFSET = 200,
		PANEL_HEIGHT_PADDING = 40,
		VIEW_ALL_TAG_ID = '0',
		VIEW_ALL_TAG_NAME = 'View All',

		// list
		itemList = null,
		listOptions = {
		valueNames: ['itemName', 'metascore', 'releaseDate', 'platform', 'gameStatus', 'playStatus', 'userRating'],
		item: 'list-item'
		},

		// properties
		currentViewTagID = VIEW_ALL_TAG_ID,
		displayType = DISPLAY_TYPE.Icons,
		currentSortIndex = 0,
		filterHasBeenApplied = false,
		queueDisplayRefresh = false,
		filterType = null,
		itemMenuOpen = false,

		// element cache
		$itemResults = $('#itemResults'),
		$viewItemsContainer = $('#viewItemsContainer'),
		$itemResultsContainer = $('#itemResultsContainer'),
		$displayOptions = $viewItemsContainer.find('.displayOptions'),

		$viewList = $('#viewList'),
		$viewName = $viewList.find('.viewName'),

		$itemViewMenu = $('#itemViewMenu'),
		$editMenu = $('#editMenu'),

		// sort elements
		$sortOptions = $viewItemsContainer.find('.sortOptions'),
		$sortTypeField = $sortOptions.find('.sortType'),

		// filter elements
		$filterOptions = $viewItemsContainer.find('.filterOptions'),
		$clearFiltersBtn = $filterOptions.find('.clearFilters_btn'),
		$filterDropDownBtn = $filterOptions.find('.filterDropDown_btn'),
		$filterTypeField = $filterOptions.find('.filterType'),
		$applyFiltersButton = $('#applyFilters_btn'),

		// delete list modal
		$deleteListConfirmModal = $('#deleteListConfirm-modal'),
		$deleteListConfirmBtn = $('#deleteListConfirm_btn'),
		$deleteListBtn = $('#deleteList_btn'),
		$deleteListName = $deleteListBtn.find('.listName'),

		// update list modal
		$updateListModal = $('#updateList-modal'),
		$tagNameField = $('#tagNameField'),
		$updateListBtn = $('#updateListConfirm_btn'),
		$editListBtn = $('#editList_btn'),

		// jquery objects
		currentHoverItem = null,

		// templates
		priceMenuTemplate = _.template($('#price-menu-template').html()),
		itemResultsTemplate = _.template($('#item-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.init = function() {

		ItemView.createEventHandlers();

		// init tooltips
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}});
		$displayOptions.find('button').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}});
		});

		// update nano scroller sizes periodically
		setInterval(function() {
			$itemResultsContainer.nanoScroller();
		}, 1500);

		// set initial filtered status
		setClearFiltersButton(false);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    ItemView.createEventHandlers = function() {

		// itemViewMenu .dropdown: hover
		$itemViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$itemViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// viewList: click
		$viewList.find('ul').on('click', 'a', function(e) {
			e.preventDefault();
			changeViewList($(this).attr('data-content'));
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();

			// show clear filters button
			setClearFiltersButton(true);
			applyFilters();
		});

		// clearFiltersBtn: click
		$clearFiltersBtn.click(function(e) {
			e.preventDefault();

			// hide clear filters button
			setClearFiltersButton(false);
			$filterTypeField.text('None');
			// clear filters
			FilterPanel.resetFilters();
			applyFilters();
		});

		// item record: click
		$viewItemsContainer.on('click', '#itemResults tr', function(e) {
			// view item
			viewItem($(this).attr('id'));
		});

		// deleteItem_btn: click
		$itemResults.on('click', '.deleteItem_btn', function(e) {
			e.preventDefault();

			// get id from delete button attribute
			var id = $(this).attr('data-content');
			deleteItem(id);
		});

		// quickAttributes: click
		$itemResults.on('click', '.quickAttributes a', function(e) {
			e.preventDefault();
			e.stopPropagation();

			// get attribute id
			var attributeID = parseInt($(this).attr('data-content'), 10);
			var id = $(this).parent().parent().attr('data-content');

			// set quick attribute
			setQuickAttribute($(this), id, attributeID);
		});

		// deleteList_btn: click
		$deleteListBtn.click(function(e) {
			e.preventDefault();
			$deleteListConfirmModal.modal('show');
		});

		// deleteListConfirm_btn: click
		$deleteListConfirmBtn.click(function(e) {
			// delete currently viewing list
			deleteTag(currentViewTagID);
			$deleteListConfirmModal.modal('hide');
		});

		// updateListModal: form submit
		$updateListModal.find('form').submit(function(e) {
			e.preventDefault();
			// update tag name
			updateTag(currentViewTagID, $tagNameField.val());
			$updateListModal.modal('hide');
		});

		// updateListBtn: click
		$updateListBtn.click(function(e) {

			// update tag name
			updateTag(currentViewTagID, $tagNameField.val());
			$updateListModal.modal('hide');
		});

		// editListBtn: click
		$editListBtn.click(function(e) {
			e.preventDefault();

			var currentListName = TagView.getListName(currentViewTagID);

			// set field name
			$tagNameField.val(currentListName);

			$updateListModal.modal('show');

			// select field text
			$tagNameField.focus().select();
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

			// custom filter
			filterType = parseInt($(this).attr('data-content'), 10);
			if (filterType === 0) {
				FilterPanel.showFilterPanel();

			// quick filter
			} else {

				// show clear filters button
				setClearFiltersButton(true);

				// set filterType field
				$filterTypeField.text($(this).text());

				quickFilter(filterType);
			}

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

		// item length
		var length = 0;
		// add user attributes to model
		_.each(items, function(item, key) {
			addUserAttributes(item);
			length++;
		});

		// get model data
		var templateData = {'items': items, 'length': length};

		// add displayType/currentViewTagID to templateData
		templateData.displayType = displayType;
		templateData.currentViewTagID = currentViewTagID;

		// render model data to template
		$itemResults.html(itemResultsTemplate(templateData));

		if (length > 0) {
			// activate tooltips for quickAttributes bar
			$itemResults.find('.quickAttributes a').each(function(key, button) {
				$(button).tooltip({delay: {show: 750, hide: 1}, placement: 'bottom'});
			});

			// load preliminary data (for filtering, sorting)
			_.each(items, function(item, key) {
				loadPreliminaryMetascore(item);
			});

			// load latest/extra information for each item
			_.each(items, function(item, key) {
				loadThirdPartyData(item);
			});

			// update list.js for item list
			itemList = new ListJS('itemResultsContainer', listOptions);

			// sort using current sort method
			sortList(currentSortIndex);

			// apply filters
			applyFilters();

			// reset filters - allow filter index to be recreated after dynamic data loaded
			filterHasBeenApplied = false;
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.getItem = function(id) {

		return ItemData.getItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearItemView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.clearItemView = function() {

		render({});
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
	* initializeUserItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.initializeUserItems = function(onSuccess, onFail) {

		// save tagID
		currentViewTagID = VIEW_ALL_TAG_ID;

		// load item data for tagID
		return ItemData.getItems(VIEW_ALL_TAG_ID, onSuccess, onFail);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeUserItems_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.initializeUserItems_result = function(items) {

		if (!$.isEmptyObject(items)) {

			// ItemData items result
			ItemData.itemsAndDirectoryLoaded(items);

			// render view with returned items data
			render(items);

			// view random item
			viewRandomItem();

		} else {
			DetailView.resetDetail();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListDeletions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListDeletions = function(itemID, deletedTagIDs) {

		var tagCount = null;

		// remove items deleted from view
		for (var i = 0, len = deletedTagIDs.length; i < len; i++) {

			// remove element from html
			// except when in 'view all' list (id: 0) and itemDeleted is the last tag for itemID
			if (currentViewTagID === VIEW_ALL_TAG_ID) {

				// get item by id
				tagCount = ItemData.getDirectoryItemByItemID(itemID).tagCount;

				if (tagCount === 0) {

					// remove item by itemID
					$('#' + itemID).remove();
				}

			// not viewing 'all items' remove item
			} else if (currentViewTagID === deletedTagIDs[i]) {
				$('#' + itemID).remove();
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAdditions
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAdditions = function(data, addedItems) {

		var renderCurrentList = false;

		// update view list
		TagView.updateViewList(data.tagIDsAdded, currentViewTagID);

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
		} else if (ItemData.getDirectoryItemByItemID(data.itemID).tagCount >= 1) {
			renderCurrentList = true;
		}

		if (renderCurrentList) {

			// get and render items
			changeViewList(currentViewTagID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAttributesChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAttributesChanged = function(item) {

		queueDisplayRefresh = true;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showGridView = function() {

		// show grid for current tag
		GridView.showGridView(currentViewTagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeViewList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeViewList = function(tagID) {

		var tagName = '';

		// show edit menu
		if (tagID !== VIEW_ALL_TAG_ID) {

			tagName = TagView.getListName(tagID);

			// change edit menu delete list name
			$deleteListName.text(tagName);

			// show edit menu
			$editMenu.show();

		// hide edit menu
		} else {

			tagName = VIEW_ALL_TAG_NAME;
			$editMenu.hide();
		}

		// set view name
		$viewName.text(tagName);

		// load items
		getItems(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(tagID, onSuccess) {

		// save tagID
		currentViewTagID = tagID;

		// load item data for tagID
		ItemData.getItems(tagID,

			// success - render items
			function(items) {

				render(items);

				if (onSuccess) {
					onSuccess();
				}
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
		var itemData = ItemData.getDirectoryItemByItemID(item.itemID);

		if (itemData) {
			// add attributes to model item
			item.gameStatus = itemData.gameStatus;
			item.playStatus = itemData.playStatus;
			item.userRating = itemData.userRating;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonPrice_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonPrice_result = function(id, offers) {

		// render if offers available
		if (typeof offers.productURL !== 'undefined') {
			// display price
			var priceSelector = '#' + id + ' .priceDetails';

			// attach to existing item result
			$(priceSelector).html(priceMenuTemplate(offers));
		}
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
	* viewRandomItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewRandomItem = function() {

		// get random id and view item for id
		var id = ItemData.getRandomItemID();
		viewItem(id);
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
	* deleteTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTag = function(tagID) {

		// delete database data
		TagData.deleteTag(tagID, function() {
			deleteList_result(tagID);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteList_result = function(tagID) {

		// iterate cached tag items
		var tagItems = ItemCache.getCachedItemsByTag(tagID);

		// iterate itemIDs and delete tag from item data directory
		_.each(tagItems, function(item, key) {

			ItemData.deleteTagFromDirectory(key, tagID);
		});

		// delete cached tag
		ItemCache.deleteCachedTag(tagID);

		// update List
		TagView.getTags(function(data) {

			TagView.getTags_result(data);
		});

		// default back to 'view all' list
		changeViewList(VIEW_ALL_TAG_ID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateTag = function(tagID, tagName) {


		// delete database data
		TagData.updateTag(tagName, tagID, function(data) {
		});

		// update List
		TagView.getTags(function(data) {

			TagView.getTags_result(data);
		});

		// update list name
		updateListName(tagName, tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListName -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateListName = function(tagName, tagID) {

		// update update tag input field and current viewing tag name
		$viewName.text(tagName);
		$tagNameField.val(tagName);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setQuickAttribute -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setQuickAttribute = function($button, id, attributeID) {

		// get item by id
		var item = ItemView.getItem(id);

		// flag for item refresh
		queueDisplayRefresh = true;

		switch (attributeID) {

			// playing
			case 0:
				if (item.playStatus === '1') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '1');
					$button.parent().removeClass().addClass('playStatus-1');
					item.playStatus = '1';
				}
				break;
			// played
			case 1:
				if (item.playStatus === '2') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '2');
					$button.parent().removeClass().addClass('playStatus-2');
					item.playStatus = '2';
				}
				break;
			// finished
			case 2:
				if (item.playStatus === '3') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '3');
					$button.parent().removeClass().addClass('playStatus-3');
					item.playStatus = '3';
				}
				break;
			// favorite
			case 3:
				if (item.userRating === '10') {
					$button.parent().removeClass('rating-10');
					item.userRating = '0';
				} else {
					$button.parent().removeClass().addClass('rating-10');
					item.userRating = '10';
				}
				break;
			// owned
			case 4:
				if (item.gameStatus === '1') {
					$button.parent().removeClass().addClass('gameStatus-0');
					item.gameStatus = '0';
				} else {
					$button.parent().removeClass().addClass('gameStatus-1');
					item.gameStatus = '1';
				}
				break;
		}

		// update remote data
		ItemData.updateItem(item, function(item, data) {
			// update item detail view
			DetailView.viewItemDetail(item);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetPlayStatusQuickAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetPlayStatusQuickAttributes = function($button, status) {

		// find all quick attribute buttons with class playStatus-x
		$button.parent().parent().find('span[class*="playStatus"]').each(function() {
			$(this).removeClass().addClass('playStatus-' + status);
		});

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		var quickFilter = filterType;

		// reset filters
		FilterPanel.resetFilters();

		switch (quickFilter) {

			// upcoming
			case 1:
				// sort and apply filter
				sortList(SORT_TYPES.releaseDate);
				// set current filter text on filters button
				// set filter panel option
				FilterPanel.upcomingQuickFilter(itemList);
				break;

			// new releases
			case 2:
				sortList(SORT_TYPES.releaseDate);
				FilterPanel.newReleasesQuickFilter(itemList);
				break;

			// never played
			case 3:
				sortList(SORT_TYPES.metascore);
				FilterPanel.neverPlayedQuickFilter(itemList);
				break;

			// games playing
			case 4:
				sortList(SORT_TYPES.metascore);
				FilterPanel.gamesPlayingQuickFilter(itemList);
				break;

			// games played
			case 5:
				sortList(SORT_TYPES.metascore);
				FilterPanel.gamesPlayedQuickFilter(itemList);
				break;

			// finished games
			case 6:
				sortList(SORT_TYPES.metascore);
				FilterPanel.finishedGamesQuickFilter(itemList);
				break;

			// owned games
			case 7:
				sortList(SORT_TYPES.metascore);
				FilterPanel.ownedGamesQuickFilter(itemList);
				break;

			// wanted games
			case 8:
				sortList(SORT_TYPES.metascore);
				FilterPanel.wantedGamesQuickFilter(itemList);
				break;
		}

		// apply filters and toggle filter status
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		// check if custom filter type
		if (filterType === 0) {
			// set filterType field
			$filterTypeField.text('Custom');
		}

		// refresh item display first - then filter
		if (queueDisplayRefresh) {

			queueDisplayRefresh = false;

			// refresh item html for updated filtering
			changeViewList(currentViewTagID, function() {

				// apply filters to itemList
				var filtered = FilterPanel.applyListJSFiltering(itemList);
			});

		// filter immediately
		} else {
			// apply filters to itemList
			var filtered = FilterPanel.applyListJSFiltering(itemList);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setClearFiltersButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setClearFiltersButton = function(filtered) {

		// check if filtered - show clearFiltersBtn button
		if (filtered) {
			$clearFiltersBtn.show();
			$clearFiltersBtn.next().show();
		} else {
			$clearFiltersBtn.hide();
			$clearFiltersBtn.next().hide();
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
				$sortTypeField.text('Alphabetical');
				// sort new list
				itemList.sort('itemName', { asc: true });

				break;

			// metascores
			case SORT_TYPES.metascore:
				$sortTypeField.text('Review Score');
				itemList.sort('scoreDetails', {sortFunction: metascoreSort});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortTypeField.text('Release Date');
				itemList.sort('releaseDate', {sortFunction: releaseDateSort});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortTypeField.text('Platform');
				itemList.sort('platform', { asc: true });

				break;

			// price
			case SORT_TYPES.price:
				$sortTypeField.text('Price');
				itemList.sort('priceDetails', {sortFunction: priceSort});

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.metascore');
		var $element2 = $(secondItem.elm).find('.metascore');

		var score1 = parseInt($element1.attr('data-score'), 10);
		var score2 = parseInt($element2.attr('data-score'), 10);

		if (score1 < score2) {
			return 1;
		}
		return -1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.priceDetails .lowestNew');
		var $element2 = $(secondItem.elm).find('.priceDetails .lowestNew');

		var price1 = 0;
		var price2 = 0;

		if ($element1.length > 0 ) {
			price1 = parseFloat($element1.attr('data-price'));
		}

		if ($element2.length > 0) {
			price2 = parseFloat($element2.attr('data-price'));
		}



		if (price1 < price2) {
			return -1;
		}
		return 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

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

})(tmz.module('itemView'), tmz, jQuery, _, List);
