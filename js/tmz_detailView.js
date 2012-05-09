// DETAIL VIEW
(function(DetailView, tmz, $, _, moment) {
	"use strict";

    // module references
    var User = tmz.module('user'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),
		SearchView = tmz.module('searchView'),
		ItemView = tmz.module('itemView'),
		ItemData = tmz.module('itemData'),
		Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		Metacritic = tmz.module('metacritic'),
		GiantBomb = tmz.module('giantbomb'),
		Wikipedia = tmz.module('wikipedia'),
		VideoPanel = tmz.module('videoPanel'),

		// constants
		TAB_IDS = ['#amazonTab', '#giantBombTab'],
		GAME_STATUS = {0: 'None', 1: 'Own', 2: 'Sold', 3: 'Wanted'},
		PLAY_STATUS = {0: 'Not Started', 1: 'Playing', 2: 'Played', 3: 'Finished'},
		ITEM_TYPES = {'new': 0, 'existing': 1},

		// properties
		hasRendered = false,
		currentProvider = null,
		saveInProgress = false,
		currentTab = TAB_IDS[0],
		currentID = null,
		itemType = ITEM_TYPES['new'],

		// timeout
		autoFillTimeOut = null,

		// data
		initialItemTags = {},	// state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
		currentItemTags = {},	// current selected tags, key = tagID, value = true
		userSetTags = {},		// tags set by user for adding new items to list
		firstItem = {},			// current item data (first)
		secondItem = {},		// current item data (second)
		itemAttributes = {},	// current item attributes

		// node cache
		$amazonDescriptionModal = $('#amazonDescription-modal'),
		$giantBombDescriptionModal = $('#giantBombDescription-modal'),

		$detailTabContent = $('#detailTabContent'),
		$amazonTab = $('#amazonTab'),
		$giantBombTab = $('#giantBombTab'),
		$amazonTabLink = $('#amazonTabLink'),
		$giantBombTabLink = $('#giantBombTabLink'),
		$itemDetailThumbnail = $detailTabContent.find('.itemDetailThumbnail'),

		$addListContainer = $('#addListContainer'),
		$addList = $('#addList'),
		$saveItemButton = $('#saveItem_btn'),
		$addItemButton = $('#addItem_btn'),
		$saveAttributesContainer = $('#saveAttributesContainer'),
		$saveAttributesButton = $('#saveAttributes_btn'),

		// node cache: data fields
		$itemAttributes = $('#itemAttributes'),
		$platform = $('#platform'),
		$releaseDate = $('#releaseDate'),
		$wikipediaPage = $('#wikipediaPage'),
		$giantBombPage = $('#giantBombPage'),
		$metacriticPage = $('#metacriticPage'),

		$amazonPriceHeader = $('#amazonPriceHeader'),
		$amazonPriceNew = $('#amazonPriceNew'),
		$amazonPriceUsed = $('#amazonPriceUsed'),

		// node cache: custom attributes
		$gameStatus = $('#gameStatus'),
		$playStatus = $('#playStatus'),
		$userRating = $('#userRating'),
		$ratingCaption = $('#ratingCaption'),

		// templates
		modalTemplate = _.template($('#description-modal-template').html());

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

				// save changes
				saveItemChanges(firstItem);

/*				if (isAttributesDirty()) {
					$saveAttributesContainer.fadeIn();
				} else {
					$saveAttributesContainer.fadeOut();
				}*/
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.createEventHandlers = function() {

		// addToList: keypress
		$addListContainer.find('input').live({
			// keypress event
			keydown: function(event){
				addList_keydown(event);
			}
		});

		// itemDetailThumbnail: click
		$itemDetailThumbnail.click(function(e) {

			VideoPanel.showVideoPanel();
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

			// save changes
			saveItemChanges(firstItem);

			// show save button if attributes changed
/*			if (isAttributesDirty()) {
				$saveAttributesContainer.fadeIn();
			} else {
				$saveAttributesContainer.fadeOut();
			}*/
		});
		// playStatus: select
		$playStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set playStatus attribute
			firstItem.playStatus = $(this).attr('data-content');
			$playStatus.find('.currentSelection').text(PLAY_STATUS[firstItem.playStatus]);

			// save changes
			saveItemChanges(firstItem);

			// show save button if attributes changed
/*			if (isAttributesDirty()) {
				$saveAttributesContainer.fadeIn();
			} else {
				$saveAttributesContainer.fadeOut();
			}*/
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
			firstItem = $.extend(true, {}, searchItem);

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

			// get wikipedia / metacritic data
			Wikipedia.getWikipediaPage(firstItem.standardName, firstItem, displayWikipediaAttribute);
			getMetascore(firstItem.standardName, firstItem);

			// call main view detail method
			viewSearchDetail(firstItem, currentProvider, 0);
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(item) {

		console.info('viewitemDetail');

		// hide information until update query returns
		hideAsynchronousDetailAttributes();

		// reset initial tags
		initialItemTags = {};

		// existing item - list add button renamed to ITEM_TYPES['existing']
		setItemType(ITEM_TYPES['existing']);

		// clone object as firstItem
		firstItem = $.extend(true, {}, item);

		// add standard name propery
		firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

		// get first provider for item
		// convert to  integer for comparison to provider constants
		currentProvider = parseInt(firstItem.initialProvider, 10);

		// get item attributes data
		itemAttributes = ItemData.getDirectoryItemByItemID(firstItem.itemID);

		// set current viewing id
		currentID = firstItem.id;

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

		// get wikipedia / metacritic data
		Wikipedia.getWikipediaPage(firstItem.standardName, firstItem, displayWikipediaAttribute);
		getMetascore(firstItem.standardName, firstItem, item);

		// finish tasks for viewing items
		completeViewItemDetail(firstItem, currentProvider, 0, item);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSecondItemDetail = function(item) {

		// clone object as secondItem
		secondItem = $.extend(true, {}, item);
		var provider = null;

		// make sure that the second item matches the first
		// fast clicking of view items can cause a desync of item rendering
		if (firstItem.asin == secondItem.asin || firstItem.gbombID == secondItem.gbombID) {
			// figure out provider for current item
			provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// finish tasks for viewing items
			completeViewItemDetail(secondItem, provider, 1);
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
	* resetDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.resetDetail = function(item) {

		initialItemTags = {};
		currentItemTags = {};
		userSetTags = {};
		firstItem = {};
		secondItem = {};
		itemAttributes = {};

		$('#dataTab').hide();
		$('.detailTitleBar').hide();
		hasRendered = false;

		clearDetail($giantBombTab);
		clearDetail($amazonTab);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondSearchItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSecondSearchItemDetail = function(searchItem, linkedID) {

		// clone object as secondItem
		var secondItem = $.extend(true, {}, searchItem);


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

			// call main view detail method
			viewSearchDetail(secondItem, provider, 1);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSearchDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSearchDetail = function(item, provider, detailPhase) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(item, detailPhase);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* completeViewItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var completeViewItemDetail = function(item, provider, detailPhase, sourceItem) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(firstItem, detailPhase);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderTabDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderTabDetail = function(itemData, $tab) {

		// render detail
		$tab.find('.itemDetailTitle h3').text(itemData.name);
		$itemDetailThumbnail.find('img').attr('src', itemData.largeImage);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateDataPanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateDataPanel = function(item, detailPhase) {

		if (!$itemAttributes.is(':visible')) {
			$itemAttributes.fadeIn();
		}

		// update platform for first phase only
		if (item.platform !== 'n/a' || detailPhase === 0) {
			$platform.find('.data').text(item.platform);
		}

		// use best releaseDate
		if (item.releaseDate !== '1900-01-01') {

			// always render first phase, after that, only update if first release date is not available
			if (detailPhase === 0 || firstItem.releaseDate === '1900-01-01') {

				// update release dates for primary item
				firstItem.releaseDate = item.releaseDate;
				firstItem.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
				$releaseDate.find('.data').text(firstItem.calendarDate);
			}

		// set date display as unknown
		} else if (firstItem.releaseDate === '1900-01-01') {
			$releaseDate.find('.data').text('unknown');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderDetail - render to corresponding tab based on provider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var renderDetail = function(provider, item) {

		// show hidden elements for first rendering
		if (!hasRendered) {
			$('#dataTab').show();
			$('.detailTitleBar').show();
			hasRendered = true;
		}

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
		$tab.find('.itemDetailTitle h3').text('No Match found');
		$itemDetailThumbnail.find('img').attr('src', 'http://static.t-minuszero.com/images/no_selection_placeholder.png');
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(title, item, sourceItem) {

		var metascoreSelector = '';

		// hide old metascore on each tab
		for (var i = 0, len = TAB_IDS.length; i < len; i++) {

			metascoreSelector = TAB_IDS[i] + ' .metascore';
			$(metascoreSelector).hide();
		}

		// fetch metascore
		Metacritic.getMetascore(title, item, function(item) {

			// ignore results which do not match currently viewing item
			if (currentID === item.id) {

				// show metascore on each tab
				for (var i = 0, len = TAB_IDS.length; i < len; i++) {

					metascoreSelector = TAB_IDS[i] + ' .metascore';

					// add metascore info to item detail
					Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);

					// show page in detail attributes
					$metacriticPage.show();
					$metacriticPage.find('a').attr('href', 'http://www.metacritic.com' + item.metascorePage);
				}
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayWikipediaAttribute -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayWikipediaAttribute = function(wikipediaURL) {

		$wikipediaPage.show();
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
	var amazonItemOffers_result = function(offers) {

		// update data panel information
		if (offers.buyNowPrice !== '' || offers.lowestUsedPrice !== '') {
			$amazonPriceHeader.show();
		}

		// new price
		if (offers.buyNowPrice !== '') {
			$amazonPriceNew.find('a').attr('href', offers.productURL);
			$amazonPriceNew.find('.data').text(offers.buyNowPrice);
			$amazonPriceNew.show();
		} else {
			$amazonPriceNew.hide();
		}

		// used price
		if (offers.lowestUsedPrice !== '') {
			$amazonPriceUsed.find('.data').text(offers.lowestUsedPrice);
			$amazonPriceUsed.find('a').attr('href', offers.offersURLUsed);
			$amazonPriceUsed.show();
		} else {
			$amazonPriceUsed.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* giantBombItemData_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var giantBombItemData_result = function(itemDetail) {

		// update giantbomb page url
		$giantBombPage.show();
		$giantBombPage.find('a').attr('href', itemDetail.site_detail_url);

		// render video results
		VideoPanel.renderVideoModal(itemDetail.videos);
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
		} else if (gbombID !== 0) {
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
			$addItemButton.hide();
			$saveItemButton.hide();

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
			TagView.resetAddList();
			setUserTags(userSetTags);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectTagsFromDirectory - set tags in tagList as selected in addList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var selectTagsFromDirectory = function(tagList) {

		var option = null;

		// clear selected attributes from all options
		TagView.resetAddList();

		_.each(tagList, function(id, tagID) {

			// select addList tag
			TagView.selectAddListTag(tagID);

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

				// select addList tag
				TagView.selectAddListTag(tagList[i]);
			}

			$addList.trigger("liszt:updated");
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayUserAttributes = function(sourceItem, itemData) {

		// set item attributes into firstItem
		if (itemData) {

			sourceItem.gameStatus = itemData.gameStatus;
			sourceItem.playStatus = itemData.playStatus;
			sourceItem.userRating = itemData.userRating;

		// set default attributes
		} else {

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

		// reset current item tags
		currentItemTags = {};

		// data
		var tagsToAdd = [];
		var idsToDelete = [];
		var tagsToDelete = [];
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
		$.each(initialItemTags, function(key, id){

			if (!currentItemTags[key]) {

				// remove tag from initial state
				delete initialItemTags[key];

				// add item/tag keys to lists for batch delete
				idsToDelete.push(id);
				tagsToDelete.push(key);
			}
		});

		// check for tags to add - then run delete tags in serial
		if (tagsToAdd.length > 0) {
			ItemData.addItemToTags(tagsToAdd, item, function(data) {

				addItemToTags_result(data);

				deleteTagsForItem();
			});

		// no tags to add - check tags to delete
		} else {
			deleteTagsForItem();
		}

		function deleteTagsForItem() {
			// check for tags to delete
			if (idsToDelete.length > 0) {
				ItemData.deleteTagsForItem(idsToDelete, tagsToDelete, item, deleteTagsForItem_result);
			}
		}

		// 1 or more attributes changed - only change for existing items
		// for new items, attributes are added through add item method
		if (isAttributesDirty() && itemType === ITEM_TYPES['existing']) {

			// update item
			ItemData.updateItem(item, updateItem_result);
		}

		// update save item button
		updateSaveItemButton();
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

			// update list view
			ItemView.updateListAttributesChanged(item);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem_result = function(itemID, deletedTagIDs) {

		// update list view model
		ItemView.updateListDeletions(itemID, deletedTagIDs);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags_result = function(data, addedItems) {

		if (itemType !== ITEM_TYPES['existing']) {
			setItemType(ITEM_TYPES['existing']);
		}

		// update firstItem with returned data
		firstItem.itemID = data.itemID;

		// update initial tags with ids
		for (var i = 0, len = data.idsAdded.length; i < len; i++) {
			initialItemTags[data.tagIDsAdded[i]] = data.idsAdded[i];
		}

		// update list view model with new item
		ItemView.updateListAdditions(data, addedItems);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* isAttributesDirty -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var isAttributesDirty = function() {

		var initialGameStatus = $gameStatus.find('.currentSelection').attr('data-initial');
		var initialPlayStatus = $playStatus.find('.currentSelection').attr('data-initial');
		var initialRating = $userRating.attr('data-initial');

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

		if (hasRendered) {

			// save userSetTags
			if (itemType === ITEM_TYPES['new']) {
				userSetTags = $addList.val();
			}

			updateSaveItemButton();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateSaveItemButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateSaveItemButton = function(item) {

		// if addList changed and existing item
		if (itemType === ITEM_TYPES.existing && isAddListChanged()) {
			$saveItemButton.fadeIn();
		} else {
			$saveItemButton.fadeOut();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* isAddListChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var isAddListChanged = function() {

		var userTags = {};
		var addListChanged = false;
		var currentTags = $addList.val();

		// iterate currentTags
		_.each(currentTags, function(item) {

			userTags[item] = true;

			// match with initial tags
			if (typeof initialItemTags[item] === 'undefined') {
				addListChanged = true;
			}
		});

		// iterate initialItemTags
		_.each(initialItemTags, function(item, key) {

			// match with user userSetTags
			if (typeof userTags[key] === 'undefined') {
				addListChanged = true;
			}
		});

		return addListChanged;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addList_keydown
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addList_keydown = function(event, container){

		if (autoFillTimeOut) {
			clearTimeout(autoFillTimeOut);
		}

		// enter key
		if (event.which == 13) {

			// get input value
			var listName = $.trim($addListContainer.find('input').val().toLowerCase());

			// create new list if not empty string
			if (listName !== '') {
				TagView.addTag(listName);
			}

		// entering text event, exclude backspace so text may be erased without autofilling
		} else if (event.which != 8 && event.which != 38 && event.which != 40 && event.which != 37 && event.which != 39) {

			// autofill input box with active-result highlighted
			// wait until chosen has a chance to update css classes
			autoFillTimeOut = setTimeout(function(){
				Utilities.autofillHighlightedElements($addListContainer, autoFillTimeOut);
			}, 250);
		}
	};

})(tmz.module('detailView'), tmz, jQuery, _, moment);
