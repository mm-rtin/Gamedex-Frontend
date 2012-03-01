// ITEM VIEW
(function(ItemView) {

    // modules references
    var User = tmz.module('user');
    var ListModel = tmz.module('list');
    var Utilities = tmz.module('utilities');
    var DetailView = tmz.module('detailView');
    var ItemData = tmz.module('itemData');
    var ListData = tmz.module('listData');
    var SearchData = tmz.module('searchData');
    var Metascore = tmz.module('metascore');
    var AmazonPrice = tmz.module('amazonPrice');
    var ItemLinker = tmz.module('itemLinker');

    // constants
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1};
    var PANEL_HEIGHT_OFFSET = 200;
    var PANEL_HEIGHT_PADDING = 40;

    // list
    var itemList = null;
	var listOptions = {
		valueNames: ['itemName', 'metascore', 'calendarDate', 'platform'],
		item: 'list-item'
	};

	// data cache
	amazonOffersCache = {};

    // properties
	var selectedTagID = 0;
    var displayType = DISPLAY_TYPE.Icons;
    var currentSortIndex = 0;
    var filterHasBeenApplied = false;

    // node cache
    var $viewItemsContainer = $('#viewItemsContainer');
    var $itemResultsContainer = $('#itemResultsContainer');
    var $itemResults = $('#itemResults');
    var $displayOptions = $viewItemsContainer.find('.displayOptions');
    var $sortOptions = $viewItemsContainer.find('.sortOptions');
    var $viewList = $('#viewList');

	// jquery objects
	var currentHoverItem = null;

	// templates
	var priceMenuTemplate = _.template($('#price-menu-template').html());
	var itemResultsTemplate = _.template($('#item-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.Model = Backbone.Model.extend({

		defaults: {
			items: {}
        },

        initialize: function() {

        },

        // override parse method
		parse : function(response) {
			parseItemResults(response);
		},

        // get items
		url: function () {
			return tmz.api + 'item/';
		}

	});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: View
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.View = Backbone.View.extend({

		el: $itemResults,
		resultsTemplate: itemResultsTemplate,

        initialize: function() {

            // items: changed
            this.model.bind('change:items', this.render, this);
        },

		render: function() {

			// get model data
			var templateData = this.model.toJSON();

			// add displayType to templateData
			templateData.displayType = displayType;

			// render model data to template
			$(this.el).html(this.resultsTemplate(templateData));

			// load extra information for each item
			_.each(this.model.get('items'), function(item, key) {
				getExtraItemInfo(item);
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

			return this;
		}
	});

    // backbone model
	var items = new ItemView.Model();
    // backbone view
    var itemPanel = new ItemView.View({model: items});


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
		$('#listFilters_btn').click(function(e) {
			e.preventDefault();

			$('#filters-modal').modal('show');
		});

		// applyFilters_btn: click
		$('#applyFilters_btn').click(function(e) {
			e.preventDefault();
			// console.info('apply filters');

			applyFilters();
		});

		// viewList: keypress
		$(viewlistContainer).find('input').live({
			// keypress event
			keydown: function(e){
				// // console.info('viewlist');
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

		// window, itemResults: resized
		$itemResults.resize(ItemView.resizePanel);
		$(window).resize(ItemView.resizePanel);
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

			if (listIDs[i] == selectedTagID) {

				// // console.info('update items at: ' + listIDs[i]);

				// update item with related id for listID needing update
				item.id = itemIDs[i];

				// add custom formated properties
				addCustomProperties(item);

				// get model data
				var tempItems = items.get('items');

				tempItems[item.id] = item;

				// set items model data
				items.set({'items': tempItems});

				// trigger change manually since updating an existing items array does not trigger update
				items.trigger("change:items");
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListDeletions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListDeletions = function(itemsDeleted) {

		// // console.info(itemsDeleted, selectedTagID);

		for (var i = 0, len = itemsDeleted.length; i < len; i++) {
			if (itemsDeleted[i].tagID == selectedTagID) {

				// delete item from model
				deleteClientItem(itemsDeleted[i].id);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.getItem = function(id) {

		// // console.info('get item:');
		// // console.info(id);
		// // console.info(items.get('items'));

		return items.get('items')[id];
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
	* viewListChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewListChanged = function() {

		// save listID
		selectedTagID = $viewList.val();

		// load items
		getItems(selectedTagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(listID) {

		// clear current item list
		$('#itemResults').empty();

		var userData = User.getUserData();

		// submit item
		var postData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			list_id: listID
		};

		// clear items - if not cleared some cases result in items not updating
		items.set({'items': {}});

		// get items
		items.fetch({data: postData, type: 'POST'});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseItemResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseItemResults = function(itemResults) {

		// // console.info('parseItemResults');
		// // console.info(itemResults);

		// temp item data
		var tempItems = {};
		var item = {};

		var itemLength = 0;
		var calendarDate = null;
		var i = 0;

		listLength = itemResults.items.length;

		// iterate itemResults
		for (i; i < listLength; i++) {

			item = {};

			// get attributes
			item.id = itemResults.items[i].id;
			item.itemID = itemResults.items[i].itemID;
			item.asin = itemResults.items[i].itemAsin;
			item.gbombID = itemResults.items[i].itemGBombID;
			item.initialProvider = itemResults.items[i].item_initialProvider;
			item.name = itemResults.items[i].itemName;
			item.description = '';
			item.platform = itemResults.items[i].itemPlatform;
			item.releaseDate = itemResults.items[i].itemReleaseDate;
			item.smallImage = itemResults.items[i].itemSmallImage;
			item.thumbnailImage = itemResults.items[i].itemThumbnailImage;
			item.largeImage = itemResults.items[i].itemLargeImage;

			// add custom formated properties
			addCustomProperties(item);

			// add to lists objects
			tempItems[item.id] = item;
		}

		// set list model data
		items.set({'items': tempItems});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addCustomProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addCustomProperties = function(item) {

		// add formatted calendarDate
		item.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();

		// add standard name propery
		item.standardName = ItemLinker.standardizeTitle(item.name);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getExtraItemInfo - loads and displays specialized item detail and populates new data into item model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getExtraItemInfo = function(item) {

		// get amazon price data
		AmazonPrice.getAmazonItemOffers(item.asin, item, amazonPrice_result);

		// get metascore
		Metascore.getMetascore(item.standardName, item, metascore_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonPrice_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonPrice_result = function(item) {

		// display price
		var priceSelector = '#' + item.id + ' .priceDetails';
		var formattedOfferData = AmazonPrice.formatOfferData(item.offers);

		// attach to existing item result
		$(priceSelector).html(priceMenuTemplate(formattedOfferData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascore_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascore_result = function(item) {

		// display score
		var metascoreSelector = '#' + item.id + ' .metascore';
		Metascore.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);
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
		ItemData.deleteSingleItem(id, items.get('items')[id].itemID, deleteItem_result);

		// delete from client data model and interface
		deleteClientItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteClientItem = function(id) {

		// data
		var tempItems = items.get('items');
		var item = tempItems[id];

		// check if item faund
		if (item !== null) {

			// remove tag from detail view
			DetailView.removeTagForItemID(item.itemID, selectedTagID);

			// remove item
			delete tempItems[id];

			// set new model data
			items.set({'items': tempItems});

			// remove element from html
			$('#' + id).remove();
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_result = function(data) {

		// delete
		// // console.info(data);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* onDeleteListBtn_click -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var onDeleteListBtn_click = function(e) {

		e.preventDefault();

		// delete database data
		ListData.deleteList(selectedTagID, deleteList_result);

		// clear current list model data
		items.set({'items': []});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteList_result = function(data) {

		// // console.info(data);

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

		// iterate platform filter options
		platformFilters = $('#platformFilterList').val() || [];

		for (var i = 0, len = platformFilters.length; i < len; i++) {
			platformFilters[i] = SearchData.getStandardPlatform(platformFilters[i]);
		}

		// apply  filters
		itemList.filter(function(itemValues) {

			var releaseDateStatus = releaseDateFilter(itemValues, releaseDateFilters);
			var metascoreStatus = metascoreFilter(itemValues, metascoreFilters);
			var platformStatus = platformFilter(itemValues, platformFilters);

			// not filtered
			if (releaseDateStatus && metascoreStatus && platformStatus) {
				return true;
			}

			// filtered out
			return false;
		});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		// // console.info(items.get('items'));

		// // console.info(sortType);
		currentSortIndex = parseInt(sortType, 10);

		switch (currentSortIndex) {

			// alphabetical
			case 0:
				// set sort status
				$sortOptions.find('.currentSort').text('Alphabetical');
				// sort new list
				itemList.sort('itemName', { asc: true });

				// sorting breaks tooltip
				$itemResults.find('.metascore').tooltip();
				break;

			// review scores
			case 1:
				$sortOptions.find('.currentSort').text('Review Score');
				itemList.sort('scoreDetails', {sortFunction: metascoreSort});

				$itemResults.find('.metascore').tooltip();
				break;

			// release date
			case 2:
				$sortOptions.find('.currentSort').text('Release Date');
				itemList.sort('calendarDate', {sortFunction: releaseDateSort});

				$itemResults.find('.metascore').tooltip();
				break;

			// platform
			case 3:
				$sortOptions.find('.currentSort').text('Platform');
				itemList.sort('platform', { asc: true });

				$itemResults.find('.metascore').tooltip();
				break;

			// price
			case 4:
				$sortOptions.find('.currentSort').text('Price');
				itemList.sort('priceDetails', {sortFunction: priceSort});

				$itemResults.find('.metascore').tooltip();
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

		$element1 = $(firstItem.elm).find('.calendarDate');
		$element2 = $(secondItem.elm).find('.calendarDate');

		var date1 = Date.parse($element1.attr('data-content'));
		var date2 = Date.parse($element2.attr('data-content'));

		return date2 - date1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateFilter = function(itemValues, filterList) {

		// filter config (1: unreleased, 2: released)
		var unreleasedFilter = filterList[0];
		var releasedFilter = filterList[1];

		var releaseDate = moment(itemValues.calendarDate, "MMMM DD, YYYY");
		var currentDate = moment();

		var diff = releaseDate.diff(currentDate, 'days');

		// all filters active - ignore filter
		if (unreleasedFilter && releasedFilter) {
			return true;
		// no filters selected - ignore filter
		} else if (!unreleasedFilter && !releasedFilter) {
			// console.info('ignore filter');
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
	* metascoreFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreFilter = function(itemValues, filterList) {

		// filter config (1: unreleased, 2: released)
		var _90sFilter = filterList[0];
		var _80sFilter = filterList[1];
		var _70sFilter = filterList[2];
		var _60sFilter = filterList[3];
		var _50sFilter = filterList[4];
		var _25to49Filter = filterList[5];
		var _0to24Filter = filterList[6];

		var score = parseInt(itemValues.metascore, 10);

		// no filters selected - ignore filter
		if (!_90sFilter && !_80sFilter && !_70sFilter && !_60sFilter && !_50sFilter && !_25to49Filter && !_0to24Filter) {
			// console.info('ignore filter');
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
