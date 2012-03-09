// DETAIL VIEW
(function(DetailView) {

    // module references
    var User = tmz.module('user');
    var Utilities = tmz.module('utilities');
    var ListModel = tmz.module('list');
    var SearchView = tmz.module('searchView');
    var ItemView = tmz.module('itemView');
    var ItemData = tmz.module('itemData');
	var Amazon = tmz.module('amazon');
	var ItemLinker = tmz.module('itemLinker');
	var Metacritic = tmz.module('metacritic');
	var GiantBomb = tmz.module('giantbomb');
	var Wikipedia = tmz.module('wikipedia');

	// constants
	TAB_IDS = ['#amazonTab', '#giantBombTab'];
	GAME_STATUS = {0: 'None', 1: 'Own', 2: 'Sold', 3: 'Wanted'};
	PLAY_STATUS = {0: 'Not Started', 1: 'Playing', 2: 'Finished'};
	ITEM_TYPES = {'new': 0, 'existing': 1};

    // properties
    var currentProvider = null;
    var saveInProgress = false;
    var currentTab = TAB_IDS[0];
    var currentID = null;
    var itemType = ITEM_TYPES['new'];

    // data
	var initialItemTags = {};	// state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
	var currentItemTags = {};	// current selected tags, key = tagID, value = true
	var userSetTags = {};		// tags set by user for adding new items to list
	var firstItem = {};			// current item data (first)
	var secondItem = {};		// current item data (second)
	var itemAttributes = {};	// current item attributes

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
    var $saveAttributesContainer = $('#saveAttributesContainer');
    var $saveAttributesButton = $('#saveAttributes_btn');

    // node cache: data fields
    var $itemAttributes = $('#itemAttributes');
    var $platform = $('#platform');
    var $releaseDate = $('#releaseDate');
    var $wikipediaPage = $('#wikipediaPage');
    var $giantBombPage = $('#giantBombPage');
    var $metacriticPage = $('#metacriticPage');

    var $amazonPriceHeader = $('#amazonPriceHeader');
    var $amazonPriceNew = $('#amazonPriceNew');
    var $amazonPriceUsed = $('#amazonPriceUsed');

    // node cache: custom attributes
    var $gameStatus = $('#gameStatus');
    var $playStatus = $('#playStatus');
    var $userRating = $('#userRating');
    var $ratingCaption = $('#ratingCaption');

    // templates
    var modalTemplate = _.template($('#description-modal-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.init = function() {

		// create event handlers
		DetailView.createEventHandlers();

		// hide save button
		$saveItemButton.hide();

		// hide detail panel attributes
		$itemAttributes.hide();
		hideAsynchronousDetailAttributes();

		// intialize star rating plugin
		$userRating.stars({
			split: 2,
			captionEl: $ratingCaption,
			callback: function(ui, type, value) {

				// set userRating attribute
				firstItem.userRating = value;

				if (isAttributesDirty()) {
					$saveAttributesContainer.fadeIn();
				} else {
					$saveAttributesContainer.fadeOut();
				}
			}
		});
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
		$saveItemButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
		});

		// addItem_btn: click
		$addItemButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
		});

		// saveAttributes_btn: click
		$saveAttributesButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
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

		// gameStatus: select
		$gameStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set gameStatus attribute
			firstItem.gameStatus = $(this).attr('data-content');
			$gameStatus.find('.currentSelection').text(GAME_STATUS[firstItem.gameStatus]);

			// show save button if attributes changed
			if (isAttributesDirty()) {
				$saveAttributesContainer.fadeIn();
			} else {
				$saveAttributesContainer.fadeOut();
			}
		});
		// playStatus: select
		$playStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set playStatus attribute
			firstItem.playStatus = $(this).attr('data-content');
			$playStatus.find('.currentSelection').text(PLAY_STATUS[firstItem.playStatus]);

			// show save button if attributes changed
			if (isAttributesDirty()) {
				$saveAttributesContainer.fadeIn();
			} else {
				$saveAttributesContainer.fadeOut();
			}
		});
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewFirstSearchItemDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.viewFirstSearchItemDetail = function(searchItem) {

		// only view item detail if new item or platform for item has changed
		if (searchItem.id !== firstItem.id || searchItem.platform !== firstItem.platform) {

			// hide information until update query returns
			hideAsynchronousDetailAttributes();

			// clone object as firstItem
			firstItem = jQuery.extend(true, {}, searchItem);

			// figure out search provider for current item
			currentProvider = getItemProvider(firstItem.asin, firstItem.gbombID);

			// add first provider to item data
			firstItem.initialProvider = currentProvider;

			// add standard name propery
			firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

			// get item attributes data
			itemAttributes = ItemData.getItemByThirdPartyID(firstItem.gbombID, firstItem.asin);

			// set current viewing id
			currentID = firstItem.id;

			// clear secondItem model
			clearSecondItemModel(currentProvider);

			// show detail tab for initial provider
			showTab(currentProvider);

			// find item on alernate provider and view item as second search item
			ItemLinker.findItemOnAlternateProvider(firstItem, currentProvider, function(id) {

				return function(item) {
					viewSecondSearchItemDetail(item, id);
				};
			}(currentID));

			// display tags
			loadAndDisplayTags(firstItem, itemAttributes);

			// load user attributes
			loadAndDisplayUserAttributes(firstItem, itemAttributes);

			// get wikipedia page
			Wikipedia.getWikipediaPage(firstItem.standardName, firstItem, displayWikipediaAttribute);

			// call main view detail method
			viewSearchDetail(firstItem, currentProvider);
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(item) {

		// hide information until update query returns
		hideAsynchronousDetailAttributes();

		// reset initial tags
		initialItemTags = {};

		// existing item - list add button renamed to ITEM_TYPES['existing']
		setItemType(ITEM_TYPES['existing']);

		// clone object as firstItem
		firstItem = jQuery.extend(true, {}, item);

		// add standard name propery
		firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

		// get first provider for item
		// convert to  integer for comparison to provider constants
		currentProvider = parseInt(firstItem.initialProvider, 10);

		// get item attributes data
		itemAttributes = ItemData.getItemByItemID(firstItem.itemID);

		// clear secondItem model
		clearSecondItemModel(currentProvider);

		// show detail tab for initial provider
		showTab(currentProvider);

		// start download of linked item data
		ItemLinker.getLinkedItemData(firstItem, currentProvider, DetailView.viewSecondItemDetail);

		// load tags
		selectTagsFromDirectory(itemAttributes.tags);

		// display attributes
		loadAndDisplayUserAttributes(firstItem, itemAttributes);

		// get wikipedia page
		Wikipedia.getWikipediaPage(firstItem.standardName, firstItem, displayWikipediaAttribute);

		// finish tasks for viewing items
		completeViewItemDetail(firstItem, currentProvider);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSecondItemDetail = function(item) {

		// clone object as secondItem
		secondItem = jQuery.extend(true, {}, item);
		var provider = null;

		// make sure that the second item matches the first
		// fast clicking of view items can cause a desync of item rendering
		if (firstItem.asin == secondItem.asin || firstItem.gbombID == secondItem.gbombID) {
			// figure out provider for current item
			provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// finish tasks for viewing items
			completeViewItemDetail(secondItem, provider);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* removeTagForItemID - if tags for item removed outside, call to update currently viewing item
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.removeTagForItemID = function(itemID, tagID) {

		// check if tagID applies for currently viewing item
		if (itemID === firstItem.itemID) {

			delete initialItemTags[tagID];

			// remove selected attribute from option
			$addList.find('option[value="' + tagID + '"]').removeAttr('selected');

			$addList.trigger("liszt:updated");
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondSearchItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSecondSearchItemDetail = function(searchItem, linkedID) {

		// clone object as secondItem
		secondItem = jQuery.extend(true, {}, searchItem);
		// console.info(currentID, linkedID);

		if (currentID === linkedID) {

			// figure out search provider for current item
			var provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// extend firstItem with second provider 3rd party id
			switch (provider) {
				case Utilities.getProviders().Amazon:
					firstItem.asin = secondItem.asin;
					break;

				case Utilities.getProviders().GiantBomb:
					firstItem.gbombID = secondItem.gbombID;
					break;
			}

			// console.info(firstItem, secondItem);

			// call main view detail method
			viewSearchDetail(secondItem, provider);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSearchDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSearchDetail = function(item, provider) {

		// console.info("VIEW SEARCH DETAIL");
		// console.info(item);

		// update model item for provider
		renderDetail(provider, item);

		// get metascore page
		getMetascore(firstItem.standardName, firstItem);

		// update data panel
		updateDataPanel(item);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderTabDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderTabDetail = function(itemData, $tab) {

		// render detail
		$tab.find('.itemDetailTitle h3').text(itemData.name);
		$tab.find('.itemDetailThumbnail img').attr('src', itemData.largeImage);

		// clear metascore class
		$tab.find('.metascore').removeClass().addClass('metascore');
    };


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateDataPanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateDataPanel = function(item) {

		if (!$itemAttributes.is(':visible')) {
			$itemAttributes.fadeIn();
		}

		// update platform
		if (item.platform !== 'n/a') {
			$platform.find('.data').text(item.platform);
		}

		// use best releaseDate
		if (item.releaseDate !== '1900-01-01') {
			// update release dates for primary item
			firstItem.releaseDate = item.releaseDate;
			firstItem.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
			$releaseDate.find('.data').text(firstItem.calendarDate);

		// set date display as unknown
		} else if (firstItem.releaseDate === '1900-01-01') {
			$releaseDate.find('.data').text('unknown');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderDetail - render to corresponding tab based on provider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var renderDetail = function(provider, item) {

		switch (provider) {
			case Utilities.getProviders().Amazon:

				renderTabDetail(item, $amazonTab);
				break;

			case Utilities.getProviders().GiantBomb:

				renderTabDetail(item, $giantBombTab);
				break;
		}
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * clearDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var clearDetail = function($tab) {

		// clear detail
		$tab.find('.itemDetailTitle h3').text('');
		$tab.find('.itemDetailThumbnail img').attr('src', '');
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* completeViewItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var completeViewItemDetail = function(item, provider) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(firstItem);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);

		// get metascore
		getMetascore(item.standardName, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(title, sourceItem) {

		var metascoreSelector = '';

		// fetch metascore
		Metacritic.getMetascore(title, sourceItem, function(item) {

			// show metascore on each tab
			for (var i = 0, len = TAB_IDS.length; i < len; i++) {

				metascoreSelector = TAB_IDS[i] + ' .metascore';

				// add metascore info to item detail
				Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);

				// show page in detail attributes
				$metacriticPage.fadeIn();
				$metacriticPage.find('a').attr('href', 'http://www.metacritic.com' + item.metascorePage);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayWikipediaAttribute -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayWikipediaAttribute = function(wikipediaURL) {

		$wikipediaPage.fadeIn();
		$wikipediaPage.find('a').attr('href', wikipediaURL);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getProviderSpecificItemDetails -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getProviderSpecificItemDetails = function(provider, item) {

		switch (provider) {
			// amazon price details
			case Utilities.getProviders().Amazon:
				Amazon.getAmazonItemOffers(item.asin, item, amazonItemOffers_result);
				break;

			// giantbomb detail
			case Utilities.getProviders().GiantBomb:
				GiantBomb.getGiantBombItemData(item.gbombID, giantBombItemData_result);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonItemOffers_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonItemOffers_result = function(item) {

		// get formatted offer data
		var formattedOfferData = Amazon.formatOfferData(item.offers);

		// update data panel information
		$amazonPriceHeader.fadeIn();
		$amazonPriceNew.fadeIn();
		$amazonPriceUsed.fadeIn();

		$amazonPriceNew.find('a').attr('href', formattedOfferData.productURL);
		$amazonPriceNew.find('.data').text(formattedOfferData.buyNowPrice);
		$amazonPriceUsed.find('a').attr('href', formattedOfferData.offersURLUsed);
		$amazonPriceUsed.find('.data').text(formattedOfferData.lowestUsedPrice);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* giantBombItemData_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var giantBombItemData_result = function(itemDetail) {

		// update giantbomb page url
		$giantBombPage.fadeIn();
		$giantBombPage.find('a').attr('href', itemDetail.site_detail_url);
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
	* hideAsynchronousDetailAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideAsynchronousDetailAttributes = function() {

		$wikipediaPage.hide();
		$giantBombPage.hide();
		$metacriticPage.hide();

		$amazonPriceHeader.hide();
		$amazonPriceNew.hide();
		$amazonPriceUsed.hide();

		// hide save item button
		$saveAttributesContainer.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearSecondItemModel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearSecondItemModel = function(provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				clearDetail($giantBombTab);
				break;

			case Utilities.getProviders().GiantBomb:
				clearDetail($amazonTab);
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
	* setItemType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setItemType = function(type) {

		// item exists with tags
		if (type === ITEM_TYPES['existing']) {

			itemType = ITEM_TYPES['existing'];
			$saveItemButton.show();
			$addItemButton.hide();

		// new item with no current tags
		} else if (type === ITEM_TYPES['new']) {

			itemType = ITEM_TYPES['new'];
			$saveItemButton.hide();
			$addItemButton.show();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayTags - find and display tags in select list for search items
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayTags = function(sourceItem, itemData) {

		// reset initial tags, set initial provider
		initialItemTags = {};

		// exisiting item with tags
		if (itemData && itemData.tagCount > 0) {

			setItemType(ITEM_TYPES['existing']);

			// update itemID
			sourceItem.itemID = itemData.itemID;

			// load tags
			selectTagsFromDirectory(itemData.tags);

		// new item - set user tags
		} else {

			setItemType(ITEM_TYPES['new']);

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
			option = $addList.find('option[value="' + tagID + '"]');

			// // console.info(option);

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
				option = $addList.find('option[value="' + tagList[i] + '"]');

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
	* loadAndDisplayUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayUserAttributes = function(sourceItem, itemData) {

		// set item attributes into firstItem
		if (itemData) {
			// console.info('load existing attributes');
			sourceItem.gameStatus = itemData.gameStatus;
			sourceItem.playStatus = itemData.playStatus;
			sourceItem.userRating = itemData.userRating;

		// set default attributes
		} else {
			// console.info('default attributes');
			sourceItem.gameStatus = '0';
			sourceItem.playStatus = '0';
			sourceItem.userRating = '0';
		}

		// display attributes
		displayAttributes(sourceItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayAttributes = function(item) {

		// set attribute fields
		$gameStatus.find('.currentSelection').text(GAME_STATUS[item.gameStatus]);
		$playStatus.find('.currentSelection').text(PLAY_STATUS[item.playStatus]);

		// select star rating
		$userRating.stars("select", item.userRating);
		$ratingCaption.text(item.userRating / 2);

		// set initial data setting for dirty check
		$gameStatus.find('.currentSelection').attr('data-initial', item.gameStatus);
		$playStatus.find('.currentSelection').attr('data-initial', item.playStatus);
		$userRating.attr('data-initial', item.userRating);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveItemChanges - change tags for item: delete or add
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveItemChanges = function(item) {

		// console.info('save item changes -----------------');
		// console.info(item);

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
			ItemData.addItemToTags(tagsToAdd, item, addItemToTags_result);
		}

		// check for tags to delete
		if (idsToDelete.length > 0) {
			// // // console.info(idsToDelete);
			ItemData.deleteTagsForItem(idsToDelete, item, deleteTagsForItem_result);
		}

		// 1 or more attributes changed - only change for existing items
		// for new items, attributes are added through add item method
		if (isAttributesDirty && itemType === ITEM_TYPES['existing']) {

			// update item
			ItemData.updateItem(item, updateItem_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItem_result = function(item, data) {

		// check if success
		if (data.status === 'success') {

			// reset initial attribute status
			displayAttributes(item);

			// hide save button
			$saveAttributesContainer.fadeOut();
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

		setItemType(ITEM_TYPES['existing']);

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
	* isAttributesDirty -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var isAttributesDirty = function() {

		var initialGameStatus = $gameStatus.find('.currentSelection').attr('data-initial');
		var initialPlayStatus = $playStatus.find('.currentSelection').attr('data-initial');
		var initialRating = $userRating.attr('data-initial');

		// console.info(firstItem);
		// console.info(initialGameStatus, initialPlayStatus, initialRating);

		// 1 or more attributes changed
		if (initialGameStatus !== firstItem.gameStatus ||
			initialPlayStatus !== firstItem.playStatus ||
			initialRating !== firstItem.userRating) {

			return true;
		}

		return false;
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
