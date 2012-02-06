// DETAIL VIEW
(function(DetailView) {

    // constants

    // modules references
    var User = tmz.module('user');
    var SearchView = tmz.module('searchView');
    var ItemView = tmz.module('itemView');
    var ListModel = tmz.module('list');
    var Utilities = tmz.module('utilities');

    // properties
    var saveInProgress = false;

    // data
	var initialItemTags = {};	// state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
	var currentItemTags = {};	// current selected tags, key = tagID, value = true
	var currentItem = {};		// selected item data

    // node cache
    var descriptionModalNode = $('#description-modal');
    var itemDetailsNode = $('#itemDetails');
    var addList = $('#addList');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.Model = Backbone.Model.extend({

		defaults: {
            itemInformation: {}
        },

        initialize: function() {

        }
	});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: View
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.View = Backbone.View.extend({

		modalElement: descriptionModalNode,
		detailsElement: itemDetailsNode,

		modalTemplate: _.template($('#description-modal-template').html()),
		detailsTemplate: _.template($('#item-details-template').html()),

        initialize: function() {

            // sortedItems: changed
            this.model.bind('change:itemInformation', this.render, this);
        },

		render: function() {

			console.info('render');
			console.info(this.model.toJSON());

			// output JSON item model to results container
			$(this.modalElement).html(this.modalTemplate(this.model.toJSON()));
			$(this.detailsElement).html(this.detailsTemplate(this.model.toJSON()));

			return this;
		}

	});

    // backbone model
	var details = new DetailView.Model();
    // backbone view
    var detailPanel = new DetailView.View({model: details});


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.init = function() {

		DetailView.createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.createEventHandlers = function() {

		var addTolistContainer = $('#addTolistContainer');

		// addToList: keypress
		$(addTolistContainer).find('input').live({
			// keypress event
			keydown: function(event){
				Utilities.handleInputKeyDown(event, addTolistContainer, ListModel);
			}
		});

		// saveItemChanges: click
		$('#saveItemChanges_btn').click(function() {
			saveItemChanges();
		});

		// viewDescription: click
		$('#viewDescription_btn').click(function() {
			console.info('desc clicked');
			$('#description-modal').modal('show');
		});
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSearchDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSearchDetail = function(searchData) {

		// clone object as currentItem
		currentItem = jQuery.extend(true, {}, searchData);

		// found in searchResults cache
		console.info("VIEW SEARCH DETAIL");
		console.info(currentItem);

		details.set({'itemInformation': currentItem});
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(itemData) {

		// clone object as currentItem
		currentItem = jQuery.extend(true, {}, itemData);

		// get item tags
		getTagsByItemID(itemData.itemID);

		console.info("VIEW ITEM DETAIL");
		console.info(currentItem);

		details.set({'itemInformation': currentItem});

	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.getAmazonItemDetail = function(itemData) {

		console.info("GET ITEM DETAIL");
		// method/searchIndex/browseNode/keywords/ResponseGroup/Page
		var restURL = tmz.api + 'itemlookup_asin/' + encodeURIComponent(asin) + '/Medium';

		// retrieve item details
		$.ajax({
			url: restURL,
			dataType: 'xml',
			cache: false,
			success: itemlookupResults
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* removeTagForItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.removeTagForItemID = function(itemID, tagID) {
		console.info('remove tag for item ID');

		console.info(itemID);
		console.info(currentItem.itemID);

		// check if tagID applies for currently viewing item
		if (itemID === currentItem.itemID) {

			console.info('remove tag');
			console.info($('#' + tagID));

			delete initialItemTags[tagID];

			// remove selected attribute from option
			$('#' + tagID).removeAttr('selected');

			$(addList).trigger("liszt:updated");
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTagsByItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getTagsByItemID = function(itemID) {

			var restURL = tmz.api + 'item/tags';
			var userData = User.getUserData();

			// submit item to list
			var postData = {
				user_id: userData.user_id,
				secret_key: userData.secret_key,
				item_id: itemID
			};

			// retrieve item tags
			$.post(restURL, postData, function(data) {
				if (data !== false) {
					loadTags(data.itemTags);
				}
			}, "json");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadTags = function(tagList) {

		// properties
		var option = null;
		var tag = null;

		// reset initial tags
		initialItemTags = {};

		// reset tags
		$(addList).find('option').each(function() {
			// remove selected attribute
			$(this).removeAttr('selected');
		});

		// iterate tags and add to select list
		for (var i = 0, len = tagList.length; i < len; i++) {
			tag = tagList[i];

			console.info(tag);

			// get option node
			option = $(addList).find('#' + tag.tagID);

			// select option
			$(option).attr('selected', '');

			// create associate of tags with item ids
			initialItemTags[tag.tagID] = tag.id;

			console.info(option);
		}

		$(addList).trigger("liszt:updated");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveItemChanges
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveItemChanges = function() {

		// reset current item tags
		currentItemTags = {};

		// data
		var tagsToAdd = [];
		var idsToDelete = [];
		var currentTags = getAddListIDs() || [];
		var tagID = '';

		// iterate current tags - find tags to add
		for (var i = 0, len = currentTags.length; i < len; i++) {

			tagID = currentTags[i];
			// save current tag into currentItemTags object for quick reference by loop to find tags to delete
			currentItemTags[tagID] = true;

			// current tags NOT in initial
			if (!initialItemTags[tagID]) {

				// set new initial state with placeholder
				initialItemTags[tagID] = 1;

				// add to list for batch insert
				tagsToAdd.push(tagID);
			}
		}

		// iterate initial tags - find tags to delete
		$.each(initialItemTags, function(key, value){

			if (!currentItemTags[key]) {

				// remove tag from initial state
				delete initialItemTags[key];

				// add item/tag key to list for batch delete
				idsToDelete.push(value);
			}
		});

		// check for tags to add
		if (tagsToAdd.length > 0) {
			addItemToTags(tagsToAdd, currentItem);
		}

		// check for tags to delete
		if (idsToDelete.length > 0) {
			console.info(idsToDelete);
			deleteTagsForItem(idsToDelete);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags = function(listIDs, currentItem) {

		var userData = User.getUserData();

		// clone currentItem as new object
		var item = jQuery.extend(true, {}, currentItem);

		// submit item to list
		var postData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			list_ids: listIDs,
			item_name: item.name,
			item_releasedate: item.releaseDate,
			item_asin:  item.asin,
			item_gbombID: item.gbombID,
			item_platform: item.platform,
			item_smallImage: item.smallImage,
			item_thumbnailImage: item.thumbnailImage,
			item_largeImage: item.largeImage
		};

		var restURL = tmz.api + 'item/add';

		// 'itemID': item.pk, 'itemAsin': item.item_asin, 'itemGBombID': item.item_gbombID, 'itemName': item.item_name, 'itemReleaseDate': str(item.item_releasedate), 'itemPlatform': item.item_platform
		$.post(restURL, postData, function(data) {
			if (data !== false) {

				// update item object with returned ID
				item.id = data.id;
				item.itemID = data.itemID;

				// update currentItem with returned data
				currentItem.id = data.id;
				currentItem.itemID = data.itemID;

				// update initial tags with ids
				for (var i = 0, len = data.idsAdded.length; i < len; i++) {
					initialItemTags[data.tagIDsAdded[i]] = data.idsAdded[i];
				}

				// update list view model with new item
				ItemView.updateListAdditions(item, data.idsAdded, data.tagIDsAdded);
			}
		}, "json");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem = function(listIDs) {

		var userData = User.getUserData();

		// submit item to list
		var postData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			ids: listIDs
		};

		var restURL = tmz.api + 'item/batch-delete';

		$.post(restURL, postData, function(data) {
			if (data !== false) {

				console.info(data.itemsDeleted);

				// update list view model for deleted items
				ItemView.updateListDeletions(data.itemsDeleted);
			}
		}, "json");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAddListIDs
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getAddListIDs = function() {
		return $(addList).val();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addListChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addListChanged = function(e) {



	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemlookupResults
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemlookupResults = function(data) {

		// iterate xml results
		var itemDetail = {};
		itemDetail.asin = $(data).find('ASIN').text();
		itemDetail.name = $(data).find('Title').text();
		itemDetail.platform = $(data).find('Platform').text();
		itemDetail.releaseDate = $(data).find('ReleaseDate').text();
		itemDetail.thumbnailLocation = $(data).find('MediumImage > URL').text();

		// save item in search results cache under ASIN key
		searchResults[itemDetail.asin] = itemDetail;

		populateItemDetailPanel(itemDetail);
	};


})(tmz.module('detailView'));
