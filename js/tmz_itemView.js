// ITEM VIEW
(function(ItemView) {

    // modules references
    var User = tmz.module('user');
    var ListModel = tmz.module('list');
    var Utilities = tmz.module('utilities');
    var DetailView = tmz.module('detailView');

    // constants
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1};

    // component references

    // private variables
	var selectedTagID = 0;
    var displayType = DISPLAY_TYPE.Icons;

    // node cache
    var viewItemsContainer = $('#viewItemsContainer');
    var itemResultsNode = $('#itemResults');
    var itemResultsDisplayGroup = $('#itemResultsDisplayGroup');
    var viewList = $('#viewList');

    // templates

	// timeout
	var addListAutofillTimeout = null;

	// jquery objects
	var currentHoverItem = null;

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

		el: itemResultsNode,
		resultsTemplates: [	_.template($('#item-results-list-template').html()),
							_.template($('#item-results-icon-template').html()),
							_.template($('#item-results-cover-template').html())],

        initialize: function() {

            // sortedItems: changed
            this.model.bind('change:sortedItems', this.render, this);
        },

		render: function() {

			// sort results
			this.model.get('sortedItems').sort(sortItemsByDate);

			// output JSON search model to results container
			// select template based on displayType
			$(this.el).html(this.resultsTemplates[displayType](this.model.toJSON()));

			// create popover
			$(itemResultsNode).find('tr').popover({
				trigger: "hover",
				placement: "right",
				offset: 10,
				html: true,
				animate: false
			});
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
		$(viewItemsContainer).on('click', '#itemResults tr', function() {

			// show item detail page
			DetailView.viewItemDetail(ItemView.getItem($(this).attr('id')));
		});

		// viewList: change
		$(viewList).chosen().change(viewListChanged);

		// delete-item-btn: click
		$(itemResultsNode).on('click', '.delete-item-btn', onDeleteBtn_click);

		// delete-item-btn: click
		$(viewItemsContainer).on('click', '#delete-list-btn', deleteList);

		// displayType toggle
		$(itemResultsDisplayGroup).find('button').click(function(e){
			e.preventDefault();
			displayTypeChanged(this);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAdditions
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAdditions = function(itemData, itemIDs, listIDs) {

		var i = 0;
		var length = listIDs.length;

		// clone itemData as new item object
		var item = jQuery.extend(true, {}, itemData);

		for (i; i < length; i++) {
			if (listIDs[i] == selectedTagID) {

				console.info('update items at: ' + listIDs[i]);

				// update item with related id for listID needing update
				item.id = itemIDs[i];

				// get model data
				var tempSortedItems = items.get('sortedItems');
				var tempItems = items.get('items');

				tempSortedItems.push(item);
				tempItems[item.id] = tempSortedItems.length - 1;

				// set items model data
				items.set({'items': tempItems});
				items.set({'sortedItems': tempSortedItems});

				// trigger change manually since updating an existing sortedItems array does not trigger update
				items.trigger("change:sortedItems");
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
				deleteItem(itemsDeleted[i].id);
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
		console.info(items.get('sortedItems'));

		var index = items.get('items')[id];

		return items.get('sortedItems')[index];
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewListChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewListChanged = function() {

		// save listID
		selectedTagID = $(viewList).val();

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

		// get items
		items.fetch({data: postData, type: 'POST'});

		// clear items - if not cleared some cases result in items not updating
		items.set({'sortedItems': []});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseItemResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseItemResults = function(itemResults) {

		console.info('parseItemResults');
		console.info(itemResults);

		// temp item data
		var tempSortedItems = [];
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
			item.name = itemResults.items[i].itemName;
			item.description = '';
			item.platform = itemResults.items[i].itemPlatform;
			item.releaseDate = itemResults.items[i].itemReleaseDate;
			item.smallImage = itemResults.items[i].itemSmallImage;
			item.thumbnailImage = itemResults.items[i].itemThumbnailImage;
			item.largeImage = itemResults.items[i].itemLargeImage;

			// add to lists objects
			tempSortedItems.push(item);
			tempItems[item.id] = tempSortedItems.length - 1;
		}

		// set list model data
		items.set({'items': tempItems});
		items.set({'sortedItems': tempSortedItems});
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
	* onDeleteBtn_click -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var onDeleteBtn_click = function(e) {

		e.preventDefault();
		e.stopPropagation();

		// get id from delete button attribute
		var id = $(this).attr('data-content');

		// trigger mouse out to remove any popovers
		$(e.target).trigger('mouseout');

		// make ajax request
		deleteItem_request(id);

		// delete from data model
		deleteItem(id);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_request -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_request = function(id) {

		var userData = User.getUserData();
		var restURL = tmz.api + 'item/delete';

		// delete item
		var postData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			id: id
		};

		// ajax request
		$.ajax({
			url: restURL,
			type: 'POST',
			datatype: 'json',
			data: postData,
			success: deleteItemResult
		});

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem = function(id) {

		console.info('delete item');

		// data
		var tempSortedItems = items.get('sortedItems');
		var tempItems = items.get('items');
		var index = tempItems[id];

		console.info(index);
		// check if item found
		if (index !== null) {

			console.info('item found to delete');

			var itemID = tempSortedItems[index].itemID;

			// remove tag from detail view
			DetailView.removeTagForItemID(itemID, selectedTagID);

			// remove item
			tempSortedItems.splice(index, 1);
			delete tempItems[id];

			// set new list model data
			items.set({'sortedItems': tempSortedItems});
			items.set({'items': tempItems});

			// trigger change manually since updating an existing sortedItems array does not trigger update
			items.trigger("change:sortedItems");
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItemResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItemResult = function(data) {

		// delete item from sortedItems

		console.info(data);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteList = function(e) {

		e.preventDefault();

		var userData = User.getUserData();
		var restURL = tmz.api + 'list/delete';

		// delete list
		var postData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			id: selectedTagID
		};

		// ajax request
		$.ajax({
			url: restURL,
			type: 'POST',
			datatype: 'json',
			data: postData,
			success: deleteListResult
		});

		// trigger mouse out to remove any popovers

		// clear current list model data
		items.set({'sortedItems': []});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteListResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteListResult = function(data) {

		console.info(data);

		// update listModel
		ListModel.getList();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayTypeChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayTypeChanged = function(toggleButton) {

		var currentDisplayType = $(toggleButton).attr('data-content');

		console.info(currentDisplayType);
		// set new display type if changed
		if (displayType !== currentDisplayType) {
			displayType = currentDisplayType;

			// change display type for current results
			changeDisplayType();
		}

		console.info(displayType);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function() {

		// hide current popover
		$(currentHoverItem).popover('hide');
		// reset currentHoverItem
		currentHoverItem = null;


		// trigger change on sortedResults to re-render template for new dislayType
		items.trigger("change:sortedItems");
	};

})(tmz.module('itemView'));
