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

    // constants
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1};

    // component references

    // list
    var itemList = null;
	var listOptions = {
		valueNames: ['item-name'],
		item: 'list-item'
	};

	// data
	var amazonOffers = {};

    // properties
	var selectedTagID = 0;
    var displayType = DISPLAY_TYPE.Icons;

    // node cache
    var $viewItemsContainer = $('#viewItemsContainer');
    var $itemResults = $('#itemResults');
    var $displayOptions = $('#viewItemsContainer .displayOptions');
    var $sortOptions = $('#viewItemsContainer .sortOptions');
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
			items: {},
			sortedItems: []
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

            // sortedItems: changed
            this.model.bind('change:items', this.render, this);
        },

		render: function() {

			var sortedItems = [];

			// generate sorted items array
			_.each(this.model.get('items'), function(item, key) {
				sortedItems.push(item);
			});

			// sort results
			sortedItems.sort(sortItemsByDate);
			this.model.set({'sortedItems': sortedItems});

			// get model data
			var templateData = this.model.toJSON();

			console.info(templateData);

			// add displayType to templateData
			templateData.displayType = displayType;

			// render model data to template
			$(this.el).html(this.resultsTemplate(templateData));

			// create popover
			$itemResults.find('li').popover({
				trigger: "hover",
				placement: "right",
				offset: 10,
				html: true,
				animate: false
			});

			// initialize list.js for item list
			itemList = new List('itemResultsContainer', listOptions);
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

		// viewList: keypress
		$(viewlistContainer).find('input').live({
			// keypress event
			keydown: function(e){
				console.info('viewlist');
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

				console.info('update items at: ' + listIDs[i]);

				// update item with related id for listID needing update
				item.id = itemIDs[i];

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

		console.info('get item:');
		console.info(id);
		console.info(items.get('items'));

		return items.get('items')[id];
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

		// hide current popover
		$(currentHoverItem).popover('hide');

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

		console.info('parseItemResults');
		console.info(itemResults);

		// temp item data
		var tempItems = {};
		var item = {};

		var itemLength = 0;
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

			// add to lists objects
			tempItems[item.id] = item;

			// load detailed information
			getItemDetail(item.id, item.asin, item.gbombID);
		}

		// set list model data
		items.set({'items': tempItems});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemDetail = function(id, asin, gbombID) {

		// get amazon price
		SearchData.getAmazonItemOffers(asin, function(data) {
			parseAmazonOffers(id, asin, data);
		});

		// get reviews

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOffers = function(id, asin, data) {

		var offerItem = {};
		var item = null;

		// iterate xml results, construct offers
		$('Item', data).each(function() {

			// collect attributes into offerItem object
			offerItem = {};

			// parse amazon result item, add data to offerItem
			SearchData.parseAmazonOfferItem($(this), offerItem);

			// add to offers object
			amazonOffers[asin] = offerItem;
		});

		// add offerItem to item model
		item = items.get('items')[id];
		item.offers = offerItem;

		// add price menu to item results
		addPriceMenu(id, offerItem);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addPriceMenu -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addPriceMenu = function(id, offerItem) {

		var buyNowPrice = null;

		// iterate offers
		for (var i = 0, len = offerItem.offers.length; i < len; i++) {
			if (offerItem.offers[i].avalability === 'now') {
				buyNowPrice = offerItem.offers[i].price;
			}
		}

		buyNowPrice = buyNowPrice || offerItem.lowestNewPrice;

		var templateData = {'buyNowPrice': buyNowPrice, 'lowestNewPrice': offerItem.lowestNewPrice, 'lowestUsedPrice': offerItem.lowestUsedPrice, 'totalNew': offerItem.totalNew, 'totalUsed': offerItem.totalUsed};

		// attach to existing item result
		$('#' + id).find('.item-details').html(priceMenuTemplate(templateData));
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortItemsByDate -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortItemsByDate = function(a, b) {

		var date1 = Date.parse(a.releaseDate);
		var date2 = Date.parse(b.releaseDate);

		return date2 - date1;
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

		// trigger mouse out to remove any popovers
		$(e.target).trigger('mouseout');

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

		// check if item found
		if (item !== null) {

			// remove tag from detail view
			DetailView.removeTagForItemID(item.itemID, selectedTagID);

			// remove item
			delete tempItems[id];

			// set new model data
			items.set({'items': tempItems});

			// trigger change manually since updating an existing items array does not trigger update
			items.trigger("change:items");
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_result = function(data) {

		// delete
		console.info(data);
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

		console.info(data);

		// update listModel
		ListModel.getList();
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		console.info(sortType);
		var sortIndex = parseInt(sortType, 10);

		switch (sortIndex) {

			// alphabetical
			case 0:
				itemList.sort('item-name', { asc: true });
				break;

			// review scores
			case 1:

				break;

			// price
			case 2:

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(toggleButton) {

		var currentDisplayType = $(toggleButton).attr('data-content');

		// set new display type if changed
		if (displayType !== currentDisplayType) {
			displayType = currentDisplayType;

			// hide current popover
			$(currentHoverItem).popover('hide');
			// reset currentHoverItem
			currentHoverItem = null;

			// change #itemResults tbody class
			$itemResults.find('tbody').removeClass().addClass('display-' + displayType);
		}
	};

})(tmz.module('itemView'));
