// DETAIL VIEW
(function(DetailView) {

    // constants

    // modules references
    var User = tmz.module('user');
    var Utilities = tmz.module('utilities');

    var ListModel = tmz.module('list');

    var SearchView = tmz.module('searchView');
    var ItemView = tmz.module('itemView');

    var ItemData = tmz.module('itemData');
	var SearchData = tmz.module('searchData');

    // properties
    var currentProvider = null;
    var saveInProgress = false;
    var currentTab = '#amazonTab';

    // data
	var initialItemTags = {};	// state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
	var currentItemTags = {};	// current selected tags, key = tagID, value = true
	var userSetTags = {};		// tags set by user for adding new items to list
	var firstItem = {};			// current item data (first)
	var secondItem = {};		// current item data (second)

    // node cache
    var $amazonDescriptionModal = $('#amazonDescription-modal');
    var $giantBombDescriptionModal = $('#giantBombDescription-modal');

    var $amazonTab = $('#amazonTab');
    var $giantBombTab = $('#giantBombTab');
    var $amazonTabLink = $('#amazonTabLink');
    var $giantBombTabLink = $('#giantBombTabLink');

    var $addList = $('#addList');
    var $saveItemContainer = $('#saveItemContainer');
    var $addItemContainer = $('#addItemContainer');

    // templates
    var modalTemplate = _.template($('#description-modal-template').html());
    var detailsTemplate = _.template($('#item-details-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.Model = Backbone.Model.extend({

		defaults: {
            giantBombItem: {},
            amazonItem: {}
        },

        initialize: function() {

        }
	});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: View
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.View = Backbone.View.extend({

		amazonTabElement: $amazonTab,
		giantBombTabElement: $giantBombTab,

		amazonModal: $amazonDescriptionModal,
		giantBombModal: $giantBombDescriptionModal,

		modalTemplate: modalTemplate,
		detailsTemplate: detailsTemplate,

        initialize: function() {

            // sortedItems: changed
            this.model.bind('change:giantBombItem', this.render, this);
            this.model.bind('change:amazonItem', this.render, this);
        },

		render: function() {

			var amazonItem = this.model.get('amazonItem');
			var giantBombItem = this.model.get('giantBombItem');

			var itemData = null;

			// render amazon item
			if (amazonItem.id && !amazonItem.rendered) {

				console.info('render amazon item');
				itemData = {'itemData': this.model.toJSON().amazonItem};

				// set status as rendered
				amazonItem.rendered = true;

				// set detail tab and modal
				$(this.amazonTabElement).html(this.detailsTemplate(itemData));
				$(this.amazonModal).html(this.modalTemplate(itemData));

			// clear view
			} else if (!amazonItem.id) {
				itemData = {'itemData': {}};
				$(this.amazonTabElement).html(this.detailsTemplate(itemData));
				$(this.amazonModal).html(this.modalTemplate(itemData));
			}

			// render giantbomb item
			if (giantBombItem.id && !giantBombItem.rendered) {

				console.info('render giant bomb item');
				itemData = {'itemData': this.model.toJSON().giantBombItem};

				// set status as rendered
				giantBombItem.rendered = true;

				// set detail tab and modal
				$(this.giantBombTabElement).html(this.detailsTemplate(itemData));
				$(this.giantBombModal).html(this.modalTemplate(itemData));

			// clear view
			} else if (!giantBombItem.id) {
				itemData = {'itemData': {}};
				$(this.giantBombTabElement).html(this.detailsTemplate(itemData));
				$(this.giantBombModal).html(this.modalTemplate(itemData));
			}


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

		// hide save button
		$($saveItemContainer).hide();
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

		// saveItem_btn: click
		$('#saveItem_btn').click(function() {
			saveItemChanges();
		});

		// addItem_btn: click
		$('#addItem_btn').click(function() {
			saveItemChanges();
		});

		// viewDescription: click
		$('#viewDescription_btn').click(function() {
			viewDescriptionForTab(currentTab);
		});

		// tabs: shown
		$('#detailTab a[data-toggle="tab"]').on('shown', function (e) {
			currentTab = $(e.target).attr('href');
			console.info(currentTab);
		});

		// addList: change
		$addList.chosen().change(addListChanged);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewFirstSearchItemDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.viewFirstSearchItemDetail = function(searchItem) {

		// clone object as firstItem
		firstItem = jQuery.extend(true, {}, searchItem);

		// figure out search provider for current item
		currentProvider = getItemProvider(firstItem.asin, firstItem.gbombID);

		// clear secondItem model
		clearSecondItemModel(currentProvider);

		// show detail tab for initial provider
		showTab(currentProvider);

		// start download of item data from alternate search providers
		findItemOnAlternateProvider(firstItem, currentProvider);

		// call main view detail method
		viewSearchDetail(firstItem);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondSearchItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSecondSearchItemDetail = function(searchItem) {

		// clone object as secondItem
		secondItem = jQuery.extend(true, {}, searchItem);

		// figure out search provider for current item
		currentProvider = getItemProvider(secondItem.asin, secondItem.gbombID);

		// extend firstItem with second provider 3rd party id
		switch (currentProvider) {
			case Utilities.getProviders().Amazon:
				firstItem.asin = secondItem.asin;
				break;

			case Utilities.getProviders().GiantBomb:
				firstItem.gbombID = secondItem.gbombID;
				break;
		}

		// call main view detail method
		viewSearchDetail(secondItem);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(itemData) {

		// reset initial tags
		initialItemTags = {};

		changeSubmitButtonStyle('save');

		// clone object as firstItem
		firstItem = jQuery.extend(true, {}, itemData);

		// get item tags
		var tagList = ItemData.getItemTagsFromDirectory(firstItem.itemID);

		// load tags
		loadTagsFromDirectory(tagList);

		console.info("VIEW ITEM DETAIL");
		console.info(firstItem);

		details.set({'giantBombItem': firstItem});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* removeTagForItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.removeTagForItemID = function(itemID, tagID) {
		console.info('remove tag for item ID');

		console.info(itemID);
		console.info(firstItem.itemID);

		// check if tagID applies for currently viewing item
		if (itemID === firstItem.itemID) {

			console.info('remove tag');
			console.info($('#' + tagID));

			delete initialItemTags[tagID];

			// remove selected attribute from option
			$('#' + tagID).removeAttr('selected');

			$addList.trigger("liszt:updated");
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSearchDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSearchDetail = function(item) {

		console.info("VIEW SEARCH DETAIL");
		console.info(item);

		// reset initial tags, set initial provider
		initialItemTags = {};

		// get itemID by searching directory of 3rd party IDs
		var itemID = getItemIDByThirdPartyID(item.gbombID, item.asin);
		var tagCount = ItemData.getItemTagCountFromDirectory(itemID);

		// exisiting item with tags
		if (tagCount > 0) {

			changeSubmitButtonStyle('save');

			// update itemID
			item.itemID = itemID;

			var tagList = ItemData.getItemTagsFromDirectory(itemID);

			// load tags
			loadTagsFromDirectory(tagList);

		// new item - set user tags
		} else {

			changeSubmitButtonStyle('add');

			// set user saved tags for new items
			resetTags();
			setTags(userSetTags);

			$addList.trigger("liszt:updated");
		}

		console.info('##### CURRENT ITEM #####');
		console.info(firstItem);

		// update model item for provider
		updateModelDataForProvider(currentProvider, item);

		// start download of item description
		getDescriptionForTab(currentProvider);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateModelDataForProvider -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateModelDataForProvider = function(provider, item) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				console.info('update amazon');
				details.set({'amazonItem': item});
				break;

			case Utilities.getProviders().GiantBomb:
				console.info('update gb');
				details.set({'giantBombItem': item});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getDescriptionForTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getDescriptionForTab = function(provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				break;

			case Utilities.getProviders().GiantBomb:
				SearchData.getGiantBombItemDetail(details.get('giantBombItem').gbombID, function(data) {
					loadDescriptionForProvider(provider, data);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadDescriptionForProvider -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadDescriptionForProvider = function(provider, data) {

		var description = data.results.description;

		var itemData = {
			description: description
		};

		// set modal html
		switch (provider) {

			// load amazon description
			case Utilities.getProviders().Amazon:

				// get amazon item and set description data
				var amazonItem = details.get('amazonItem');
				amazonItem.description = description;

				// add item name for description template
				itemData.name = amazonItem.name;

				$amazonDescriptionModal.html(modalTemplate({'itemData': itemData}));

				break;

			// load giant bomb description
			case Utilities.getProviders().GiantBomb:

				// get giantbomb item and set description data
				var giantBombItem = details.get('giantBombItem');
				giantBombItem.description = description;

				// add item name for description template
				itemData.name = giantBombItem.name;

				$giantBombDescriptionModal.html(modalTemplate({'itemData': itemData}));

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewDescriptionForTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewDescriptionForTab = function(currentTab) {

		// for current tab load its description modal
		if (currentTab === '#amazonTab') {
			$amazonDescriptionModal.modal('show');

		} else if (currentTab === '#giantBombTab') {
			$giantBombDescriptionModal.modal('show');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showTab = function(provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				$amazonTabLink.tab('show');
				break;

			case Utilities.getProviders().GiantBomb:
				$giantBombTabLink.tab('show');
				break;
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearSecondItemModel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearSecondItemModel = function(provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				details.set({'giantBombItem': {}});
				break;

			case Utilities.getProviders().GiantBomb:
				details.set({'amazonItem': {}});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemProvider -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemProvider = function(asin, gbombID) {

		var provider = null;

		// amazon data found
		if (asin !== 0) {
			provider = Utilities.getProviders().Amazon;

		// giantbomb data found
		} else if(gbombID !== 0) {
			provider = Utilities.getProviders().GiantBomb;
		}

		return provider;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findItemOnAlternateProvider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findItemOnAlternateProvider = function(item, provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				console.info('alt search giantbomb');
				// run search for giantbomb
				SearchData.searchGiantBomb(item.name, searchGiantBombAlternate_result);
				break;

			case Utilities.getProviders().GiantBomb:
				console.info('alt search amazon');
				// run search for amazon
				SearchData.searchAmazon(item.name, searchAmazonAlternate_result);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazonAlternate_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchAmazonAlternate_result = function(data) {

		var filtered = false;

		// number of items found
		var resultLength = ($('Item', data).length);
		// current number of items parsed
		var count = 0;
		var found = false;

		console.info('**************** RESULTS FOUND: ' + resultLength + ' *******************');

		// iterate results
		$('Item', data).each(function() {

			// collect attributes into searchItem object
			var searchItem = {};
			count++;

			// parse item and return if filtered by rules set in searchData
			filtered = SearchData.parseAmazonResultItem($(this), searchItem);

			console.info(count, resultLength, searchItem.name);

			// found exact title match
			if (!filtered && firstItem.name === searchItem.name) {

				console.info('################ VIEW SECOND AMAZON ITEM: ' + searchItem.name);
				found = true;
				// exact match found - view second item
				DetailView.viewSecondSearchItemDetail(searchItem);

			// last item - multiple results returned
			} else if (!found && count === resultLength && resultLength > 1) {
				console.info('DISPLAY LIST OF ALL CHOICES');

			// last item - one result returned
			} else if (!found && count === resultLength && resultLength === 1) {

				console.info('################ DISPLAY LAST AND ONLY ITEM: ' + searchItem.name);
				// display last item anyway
				DetailView.viewSecondSearchItemDetail(searchItem);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBombAlternate_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchGiantBombAlternate_result = function(data) {

		var results = data.results;

		console.info('**************** RESULTS FOUND: ' + results.length + ' *******************');

		// iterate results
		for (var i = 0, len = results.length; i < len; i++) {

			// collect attributes into searchItem object
			searchItem = {};

			// parse result item and add to searchItem
			SearchData.parseGiantBombResultItem(results[i], searchItem);

			// check if item name is exact match with initial item name
			if(firstItem.name === searchItem.name) {

				console.info('################ VIEW SECOND GIANT BOMB ITEM: ' + searchItem.name);
				// exact match found - view second item
				DetailView.viewSecondSearchItemDetail(searchItem);

			// last item
			} else if (i === len - 1) {
				SearchData.parseGiantBombResultItem(results[0], searchItem);
				DetailView.viewSecondSearchItemDetail(searchItem);
			}
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeSubmitButtonStyle
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeSubmitButtonStyle = function(style) {

		if (style === 'save') {
			$saveItemContainer.show();
			$addItemContainer.hide();

		} else if (style === 'add') {
			$saveItemContainer.hide();
			$addItemContainer.show();
		}

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemIDByThirdPartyID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemIDByThirdPartyID = function(gbombID, asin) {

		// itemID from directory
		var itemID = null;

		// select appropriate 3rd party item directory
		if (gbombID !== 0) {
			var giantBombDirectory =  ItemData.getGiantBombDirectory();
			itemID = giantBombDirectory[gbombID];
			console.error(itemID);
		}

		if (asin !== 0) {
			var amazonDirectory =  ItemData.getAmazonDirectory();
			itemID = amazonDirectory[asin];
			console.error(itemID);
		}

		return itemID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadTagsFromDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadTagsFromDirectory = function(tagList) {

		var option = null;

		// clear selected attributes from all options
		resetTags();

		_.each(tagList, function(id, tagID) {

			// get option node
			option = $addList.find('#' + tagID);

			// select option
			$(option).attr('selected', '');

			// create associate of tags with item ids
			initialItemTags[tagID] = id;
		});

		$addList.trigger("liszt:updated");
		console.info(initialItemTags);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadTags = function(tagList) {

		// properties
		var option = null;
		var tag = null;

		// clear selected attributes from all options
		resetTags();

		// iterate tags and add to select list
		for (var i = 0, len = tagList.length; i < len; i++) {
			tag = tagList[i];

			// get option node
			option = $addList.find('#' + tag.tagID);

			// select option
			$(option).attr('selected', '');

			// create associate of tags with item ids
			initialItemTags[tag.tagID] = tag.id;
		}

		$addList.trigger("liszt:updated");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setTags = function(tagList) {

		if (tagList) {

			for (var i = 0, len = tagList.length; i < len; i++) {

				// get option node
				option = $addList.find('#' + tagList[i]);

				// select option
				$(option).attr('selected', '');
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetTags = function() {

		// reset tags
		$addList.find('option').each(function() {
			// remove selected attribute
			$(this).removeAttr('selected');
		});
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
			ItemData.addItemToTags(tagsToAdd, firstItem, addItemToTags_result);
		}

		// check for tags to delete
		if (idsToDelete.length > 0) {
			console.info(idsToDelete);
			ItemData.deleteTagsForItem(idsToDelete, firstItem, deleteTagsForItem_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem_result = function(data) {

		// update list view model
		ItemView.updateListDeletions(data.itemsDeleted);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags_result = function(item, data) {

		changeSubmitButtonStyle('save');

		// update item object with returned ID
		item.id = data.id;
		item.itemID = data.itemID;

		// update firstItem with returned data
		firstItem.id = data.id;
		firstItem.itemID = data.itemID;

		// update initial tags with ids
		for (var i = 0, len = data.idsAdded.length; i < len; i++) {
			initialItemTags[data.tagIDsAdded[i]] = data.idsAdded[i];
		}

		// update list view model with new item
		ItemView.updateListAdditions(item, data.idsAdded, data.tagIDsAdded);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAddListIDs
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getAddListIDs = function() {
		return $addList.val();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addListChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addListChanged = function(e) {

		// save userSetTags
		userSetTags = $addList.val();
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
