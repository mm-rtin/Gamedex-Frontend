// DETAIL VIEW
(function(DetailView, tmz, $, _, moment) {

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
		currentItemHasVideo = false,
		itemType = ITEM_TYPES['new'],

		// timeout
		itemDetailInfoTimeOut = null,

		// data
		firstItem = {},			// current item data (first)
		secondItem = {},		// current item data (second)
		itemAttributes = {},	// current item attributes

		// node cache
		$detailTabContent = $('#detailTabContent'),
		$amazonTab = $('#amazonTab'),
		$giantBombTab = $('#giantBombTab'),
		$amazonTabLink = $('#amazonTabLink'),
		$giantBombTabLink = $('#giantBombTabLink'),
		$amazonItemDetailThumbnail = $amazonTab.find('.itemDetailThumbnail'),
		$giantbombItemDetailThumbnail = $giantBombTab.find('.itemDetailThumbnail'),
		$amazonItemDetailInfo = $amazonItemDetailThumbnail.find('.itemDetailInfo'),
		$giantbombItemDetailInfo = $giantbombItemDetailThumbnail.find('.itemDetailInfo'),
		$showVideoButton = $detailTabContent.find('.showVideo_btn'),
		$showDiscussionButton = $detailTabContent.find('.showDiscussion_btn'),

		$detailContainer = $('#detailContainer'),

		$addListContainer = $('#addListContainer'),
		$addList = $('#addList'),
		$saveItemButton = $('#saveItem_btn'),
		$addItemButton = $('#addItem_btn'),

		// node cache: data fields
		$itemAttributes = $('#itemAttributes'),
		$platform = $('#platform'),
		$releaseDate = $('#releaseDate'),
		$wikipediaPage = $('#wikipediaPage'),
		$giantBombPage = $('#giantBombPage'),
		$metacriticPage = $('#metacriticPage'),

		$amazonPriceHeader = $itemAttributes.find('#amazonPriceHeader'),
		$amazonPriceNew = $itemAttributes.find('#amazonPriceNew'),
		$amazonPriceUsed = $itemAttributes.find('#amazonPriceUsed'),

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
				saveAttributes(firstItem);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.createEventHandlers = function() {

		// amazonTabLink: click
		$amazonTabLink.click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			showTab(Utilities.getProviders().Amazon);
		});

		// giantBombTabLink: click
		$giantBombTabLink.click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			showTab(Utilities.getProviders().GiantBomb);
		});

		// showVideoButton: click
		$showVideoButton.click(function(e) {
			e.preventDefault();

			if (currentItemHasVideo) {
				VideoPanel.showVideoPanel();

			// show no video message
			} else {

			}
		});

		// showDiscussionButton: click
		$showDiscussionButton.click(function(e) {
			e.preventDefault();

			// load disqus for item
			showDiscussion();
		});

		// amazonItemDetailThumbnail: click
		$amazonItemDetailThumbnail.click(function(e) {

		});

		// giantbombItemDetailThumbnail: click
		$giantbombItemDetailThumbnail.click(function(e) {

		});

		// amazonItemDetailThumbnail: mouseover
		$amazonItemDetailThumbnail.mouseenter(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			itemDetailInfoTimeOut = setTimeout(function() {
				$amazonItemDetailInfo.stop().fadeIn();
			}, 250);
		});

		// amazonItemDetailThumbnail: mouseout
		$amazonItemDetailThumbnail.mouseleave(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			$amazonItemDetailInfo.stop().fadeOut();
		});

		// giantbombItemDetailThumbnail: mouseover
		$giantbombItemDetailThumbnail.mouseenter(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			itemDetailInfoTimeOut = setTimeout(function() {
				$giantbombItemDetailInfo.stop().fadeIn();
			}, 250);
		});

		// giantbombItemDetailThumbnail: mouseout
		$giantbombItemDetailThumbnail.mouseleave(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			$giantbombItemDetailInfo.stop().fadeOut();
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

		// gameStatus: select
		$gameStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set gameStatus attribute
			firstItem.gameStatus = $(this).attr('data-content');
			$gameStatus.find('.currentSelection').text(GAME_STATUS[firstItem.gameStatus]);

			// save changes
			saveAttributes(firstItem);
		});

		// playStatus: select
		$playStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set playStatus attribute
			firstItem.playStatus = $(this).attr('data-content');
			$playStatus.find('.currentSelection').text(PLAY_STATUS[firstItem.playStatus]);

			// save changes
			saveAttributes(firstItem);
		});

		// tabs: shown
		$('#detailTab a[data-toggle="tab"]').on('shown', function (e) {
			currentTab = $(e.target).attr('href');
		});

		// addList: change
		$addList.change(addListChanged);
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
			getMetascore(firstItem.standardName, firstItem, true);

			// call main view detail method
			viewSearchDetail(firstItem, currentProvider, 0);
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(item) {

		// hide information until update query returns
		hideAsynchronousDetailAttributes();

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
		TagView.selectTagsFromDirectory(itemAttributes.tags);

		// display attributes
		loadAndDisplayUserAttributes(firstItem, itemAttributes);

		// get wikipedia / metacritic data
		Wikipedia.getWikipediaPage(firstItem.standardName, firstItem, displayWikipediaAttribute);
		getMetascore(firstItem.standardName, firstItem, false);

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
	* resetDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.resetDetail = function(item) {

		// reset add list
		TagView.resetAddList();

		setItemType(ITEM_TYPES['new']);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getViewingItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.getViewingItemID = function() {

		return firstItem.id;
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
		$tab.find('img').attr('src', itemData.largeImage);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showDiscussion -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showDiscussion = function() {

		// change item panel view mode to discussion
		ItemView.viewDiscussion();

		var identifier = firstItem.standardName;

		DISQUS.reset({
			reload: true,
			config: function () {
			this.page.identifier = identifier;
			this.page.url = 'http://www.gamedex.net/#!' + identifier;
			}
		});
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
		$tab.find('img').attr('src', 'http://static.t-minuszero.com/images/no_selection_placeholder.png');
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(title, item, fromSearch) {

		var metascoreSelector = '';

		// hide old metascore on each tab
		for (var i = 0, len = TAB_IDS.length; i < len; i++) {

			metascoreSelector = TAB_IDS[i] + ' .metascore';
			$(metascoreSelector).hide();
		}

		// fetch metascore
		Metacritic.getMetascore(title, item, fromSearch, function(item) {

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

		// video config
		configureVideos(itemDetail.videos);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* configureVideos -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var configureVideos = function(giantbombVideos) {

		// has giantbombVideos
		if (giantbombVideos.length !== 0) {
			// render video results
			VideoPanel.renderVideoModal(giantbombVideos);

			currentItemHasVideo = true;
			$showVideoButton.removeClass('noVideos');
			$showVideoButton.find('span').text('Show Videos');

		// no giantbombVideos
		} else {
			currentItemHasVideo = false;
			$showVideoButton.addClass('noVideos');
			$showVideoButton.find('span').text('No Videos');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showTab = function(provider) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				// attach detailContainer to item detail info
				$amazonItemDetailInfo.append($detailContainer);
				$amazonTabLink.tab('show');
				break;

			case Utilities.getProviders().GiantBomb:
				// attach detailContainer to item detail info
				$giantbombItemDetailInfo.append($detailContainer);
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

		// exisiting item with tags
		if (itemData && itemData.tagCount > 0) {

			setItemType(ITEM_TYPES['existing']);

			// update itemID
			sourceItem.itemID = itemData.itemID;

			// load tags
			TagView.selectTagsFromDirectory(itemData.tags);

		// new item - set user tags
		} else {
			setItemType(ITEM_TYPES['new']);

			// set user saved tags for new items
			TagView.selectUserTags();
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

		// find tags to add
		var tagsToAdd = TagView.getTagsToAdd();

		// find tags to delete
		var idsTagsToDelete = TagView.getTagsToDelete();
		var idsToDelete = idsTagsToDelete.idsToDelete;
		var tagsToDelete = idsTagsToDelete.tagsToDelete;

		// add tags
		if (tagsToAdd.length > 0) {
			ItemData.addItemToTags(tagsToAdd, item, addItemToTags_result);
		}

		// delete tags
		if (idsToDelete.length > 0) {
			ItemData.deleteTagsForItem(idsToDelete, tagsToDelete, item, deleteTagsForItem_result);
		}

		// update save item button
		updateSaveItemButton();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveAttributes = function(item) {

		// if attributes changed: update user item
		if (isAttributesDirty() && itemType === ITEM_TYPES['existing']) {
			ItemData.updateUserItem(item, updateItem_result);
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

			// update list view
			ItemView.updateListAttributesChanged(item);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags_result = function(data, addedItems) {

		// update tagView initialItemTags
		var initialItemTags = TagView.updateInitialItemTags(data.tagIDsAdded, data.idsAdded);

		// if new item - set to existing item
		if (itemType !== ITEM_TYPES['existing']) {
			setItemType(ITEM_TYPES['existing']);
		}

		// update firstItem with returned data
		firstItem.id = data.itemID;
		firstItem.itemID = data.itemID;

		// update list view model with new item
		ItemView.updateListAdditions(data, addedItems);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem_result = function(itemID, deletedTagIDs) {

		// update list view model
		ItemView.updateListDeletions(itemID, deletedTagIDs);
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
	* addListChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addListChanged = function(e) {

		// do not check for changes if event triggered from "reset" list
		if (hasRendered && !e.reset) {

			// save userSetTags
			if (itemType === ITEM_TYPES['new']) {

				// populate user set tags from current tag selection
				TagView.populateUserTags();
			}

			// update button
			updateSaveItemButton();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateSaveItemButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateSaveItemButton = function() {

		// if addList changed and existing item
		if (itemType === ITEM_TYPES.existing && TagView.isAddListChanged()) {
			$saveItemButton.fadeIn();
		} else {
			$saveItemButton.fadeOut();
		}
	};

})(tmz.module('detailView'), tmz, jQuery, _, moment);
