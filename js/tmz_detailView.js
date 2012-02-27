// DETAIL VIEW
(function(DetailView) {

    // module references
    var User = tmz.module('user');
    var Utilities = tmz.module('utilities');
    var ListModel = tmz.module('list');
    var SearchView = tmz.module('searchView');
    var ItemView = tmz.module('itemView');
    var ItemData = tmz.module('itemData');
	var SearchData = tmz.module('searchData');
	var ItemLinker = tmz.module('itemLinker');
	var Metascore = tmz.module('metascore');

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

    var $detailTabContent = $('#detailTabContent');
    var $amazonTab = $('#amazonTab');
    var $giantBombTab = $('#giantBombTab');
    var $amazonTabLink = $('#amazonTabLink');
    var $giantBombTabLink = $('#giantBombTabLink');

    var $addList = $('#addList');
    var $saveItemButton = $('#saveItem_btn');
    var $addItemButton = $('#addItem_btn');

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

			/* render amazon item
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			if (amazonItem.id && !amazonItem.rendered) {

				// console.info('render amazon item');
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

			/* render giantbomb item
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			if (giantBombItem.id && !giantBombItem.rendered) {

				// console.info('render giant bomb item');
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
		$($saveItemButton).hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.createEventHandlers = function() {

		var addListContainer = $('#addListContainer');

		// addToList: keypress
		$(addListContainer).find('input').live({
			// keypress event
			keydown: function(event){
				Utilities.handleInputKeyDown(event, addListContainer, ListModel);
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
		$detailTabContent.on('click', '.viewDescription_btn', function() {
			viewDescriptionForTab(currentTab);
		});

		// tabs: shown
		$('#detailTab a[data-toggle="tab"]').on('shown', function (e) {
			currentTab = $(e.target).attr('href');
		});

		// addList: change
		$addList.chosen().change(addListChanged);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewFirstSearchItemDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.viewFirstSearchItemDetail = function(searchItem) {

		// only view item detail if new item or platform for item has changed
		if (searchItem.id !== firstItem.id || searchItem.platform !== firstItem.platform) {

			// clone object as firstItem
			firstItem = jQuery.extend(true, {}, searchItem);

			// figure out search provider for current item
			currentProvider = getItemProvider(firstItem.asin, firstItem.gbombID);

			// add first provider to item data
			firstItem.initialProvider = currentProvider;

			// add standard name propery
			firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

			// clear secondItem model
			clearSecondItemModel(currentProvider);

			// show detail tab for initial provider
			showTab(currentProvider);

			// find item on alernate provider and view item as second search item
			ItemLinker.findItemOnAlternateProvider(firstItem, currentProvider, DetailView.viewSecondSearchItemDetail);

			// get metascore page
			getMetascore(firstItem.standardName);

			// display tags
			loadAndDisplayTags(firstItem);

			// call main view detail method
			viewSearchDetail(firstItem);
		}
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
	* viewSearchDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSearchDetail = function(item) {

		// console.info("VIEW SEARCH DETAIL");
		// console.info(item);

		// update model item for provider
		updateModelDataForProvider(currentProvider, item);

		// start download of item description
		getDescriptionForTab(currentProvider);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(item) {

		// reset initial tags
		initialItemTags = {};

		changeSubmitButtonStyle('save');

		// clone object as firstItem
		firstItem = jQuery.extend(true, {}, item);
		// add standard name propery
		firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

		// get first provider for item
		// convert to  integer for comparison to provider constants
		currentProvider = parseInt(firstItem.initialProvider, 10);

		// clear secondItem model
		clearSecondItemModel(currentProvider);

		// get metascore page
		getMetascore(firstItem.standardName);

		// show detail tab for initial provider
		showTab(currentProvider);

		// start download of linked item data
		ItemLinker.getLinkedItemData(firstItem, currentProvider, DetailView.viewSecondItemDetail);

		// get item tags
		var tagList = ItemData.getItemTagsFromDirectory(firstItem.itemID);

		// load tags
		selectTagsFromDirectory(tagList);

		// update model item for provider
		updateModelDataForProvider(currentProvider, firstItem);

		// start download of item description
		getDescriptionForTab(currentProvider);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSecondItemDetail = function(item) {

		// clone object as secondItem
		secondItem = jQuery.extend(true, {}, item);

		// console.error(firstItem.asin, secondItem.asin);
		// console.error(firstItem.gbombID, secondItem.gbombID);

		// make sure that the second item matches the first
		// fast clicking of view items can cause a desync of item rendering
		if (firstItem.asin == secondItem.asin || firstItem.gbombID == secondItem.gbombID) {
			// figure out provider for current item
			currentProvider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// update model item for provider
			updateModelDataForProvider(currentProvider, secondItem);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* removeTagForItemID - if tags for item removed outside, call to update currently viewing item
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.removeTagForItemID = function(itemID, tagID) {
		// console.info('remove tag for item ID');

		// console.info(itemID);
		// console.info(firstItem.itemID);

		// check if tagID applies for currently viewing item
		if (itemID === firstItem.itemID) {

			// console.info('remove tag');
			// console.info($('#' + tagID));

			delete initialItemTags[tagID];

			// remove selected attribute from option
			$('#' + tagID).removeAttr('selected');

			$addList.trigger("liszt:updated");
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateModelDataForProvider - set corresponding model object based on provider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateModelDataForProvider = function(provider, item) {

		// console.info(provider, Utilities.getProviders().Amazon, Utilities.getProviders().GiantBomb);

		switch (provider) {
			case Utilities.getProviders().Amazon:
				// console.info('update amazon');
				details.set({'amazonItem': item});
				break;

			case Utilities.getProviders().GiantBomb:
				// console.info('update gb');
				details.set({'giantBombItem': item});
				break;
		}

		// console.info(details.get('giantBombItem'));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getDescriptionForTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getDescriptionForTab = function(provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				break;

			case Utilities.getProviders().GiantBomb:
				SearchData.getGiantBombItemDescription(details.get('giantBombItem').gbombID, function(data) {
					loadGiantBombDescription(data);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadGiantBombDescription -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadGiantBombDescription = function(data) {

		var description = data.results.description;

		var itemData = {
			description: description
		};

		// get giantbomb item and set description data
		var giantBombItem = details.get('giantBombItem');
		giantBombItem.description = description;

		// add item name for description template
		itemData.name = giantBombItem.name;

		$giantBombDescriptionModal.html(modalTemplate({'itemData': itemData}));
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
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(title) {

		Metascore.getMetascore(title, firstItem, metascore_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascore_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascore_result = function(item) {

		var metascoreSelector = currentTab + ' .metascore';

		// add metascore info to item detail
		Metascore.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeSubmitButtonStyle
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeSubmitButtonStyle = function(style) {

		if (style === 'save') {
			$saveItemButton.show();
			$addItemButton.hide();

		} else if (style === 'add') {
			$saveItemButton.hide();
			$addItemButton.show();
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
			// console.error(itemID);
		}

		if (asin !== 0) {
			var amazonDirectory =  ItemData.getAmazonDirectory();
			itemID = amazonDirectory[asin];
			// console.error(itemID);
		}

		return itemID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayTags - find and display tags in select list for search items
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayTags = function(item) {

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
			selectTagsFromDirectory(tagList);

		// new item - set user tags
		} else {

			changeSubmitButtonStyle('add');

			// set user saved tags for new items
			resetTags();
			setUserTags(userSetTags);

			$addList.trigger("liszt:updated");
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectTagsFromDirectory - set tags in tagList as selected in addList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var selectTagsFromDirectory = function(tagList) {

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
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setUserTags - tags user defined for adding new items to tag(s)
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setUserTags = function(tagList) {

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
	* resetTags - clear all selected attributes
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetTags = function() {

		// reset tags
		$addList.find('option').each(function() {
			// remove selected attribute
			$(this).removeAttr('selected');
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveItemChanges - change tags for item: delete or add
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
			// console.info(idsToDelete);
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

})(tmz.module('detailView'));
