// DETAIL VIEW
(function(DetailView, gamedex, $, _, moment) {

    // module references
    var User = gamedex.module('user'),
        TagView = gamedex.module('tagView'),
        Utilities = gamedex.module('utilities'),
        SearchView = gamedex.module('searchView'),
        ItemView = gamedex.module('itemView'),
        ItemData = gamedex.module('itemData'),
        Amazon = gamedex.module('amazon'),
        ItemLinker = gamedex.module('itemLinker'),
        Metacritic = gamedex.module('metacritic'),
        GiantBomb = gamedex.module('giantbomb'),
        Wikipedia = gamedex.module('wikipedia'),
        GameTrailers = gamedex.module('gameTrailers'),
        Steam = gamedex.module('steam'),
        VideoPanel = gamedex.module('videoPanel'),

        // constants
        TAB_IDS = ['#amazonTab', '#giantBombTab'],
        GAME_STATUS = {0: 'None', 1: 'Own', 2: 'Sold', 3: 'Wanted'},
        PLAY_STATUS = {0: 'Not Started', 1: 'Playing', 2: 'Played', 3: 'Finished'},
        ITEM_TYPES = {'NEW': 0, 'EXISTING': 1},

        // properties
        hasRendered = false,
        currentProvider = null,
        viewingProvider = null,
        currentTab = TAB_IDS[0],
        currentID = null,
        currentItemHasVideo = false,
        itemType = ITEM_TYPES.NEW,

        // timeout
        itemDetailInfoTimeOut = null,

        // data
        firstItem = {},         // current item data (first)
        secondItem = {},        // current item data (second)
        itemAttributes = {},    // current item attributes

        // ajax requests
        metascoreRequest = null,
        addItemToTagRequest = null,

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
        $gametrailersPage = $('#gametrailersPage'),
        $giantBombPage = $('#giantBombPage'),
        $metacriticPage = $('#metacriticPage'),

        $priceHeader = $itemAttributes.find('#priceHeader'),
        $amazonPriceNew = $itemAttributes.find('#amazonPriceNew'),
        $amazonPriceUsed = $itemAttributes.find('#amazonPriceUsed'),
        $steamPrice = $itemAttributes.find('#steamPrice'),

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

        $platform.click(function(e) {
            e.preventDefault();
        });
        $releaseDate.click(function(e) {
            e.preventDefault();
        });

        // amazonTabLink: click
        $amazonTabLink.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            showTab(Utilities.SEARCH_PROVIDERS.Amazon);
        });

        // giantBombTabLink: click
        $giantBombTabLink.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            showTab(Utilities.SEARCH_PROVIDERS.GiantBomb);
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

            // reset videos
            resetVideos();

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
            ItemLinker.findItemOnAlternateProvider(firstItem, currentProvider, true, function(id) {
                return function(item) {
                    viewSecondSearchItemDetail(item, id);
                };
            }(currentID), function() {

                // no match found
            });

            // display tags
            loadAndDisplayTags(firstItem, itemAttributes);

            // load user attributes
            loadAndDisplayUserAttributes(firstItem, itemAttributes);

            // load third party data
            loadThirdPartyData(firstItem, true);

            // call main view detail method
            completeSearchItemDetail(firstItem, currentProvider, 0);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewItemDetail
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.viewItemDetail = function(item) {

        // reset videos
        resetVideos();

        // hide information until update query returns
        hideAsynchronousDetailAttributes();

        // existing item - list add button renamed to ITEM_TYPES.EXISTING
        setItemType(ITEM_TYPES.EXISTING);

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

        // load third party data
        loadThirdPartyData(firstItem, false);

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

        setItemType(ITEM_TYPES.NEW);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getViewingItemID -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.getViewingItemID = function() {

        return firstItem.id;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * loadThirdPartyData -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var loadThirdPartyData = function(item, fromSearch) {

        // get wikipedia page
        Wikipedia.getWikipediaPage(item.standardName, item, displayWikipediaPage);

        // get metascore
        getMetascore(item.standardName, item, fromSearch);

        // get gametrailers page
        GameTrailers.getGametrailersPage(item.standardName, item, displayGametrailersPage);

        // get steam page and price
        Steam.getSteamGame(item.standardName, item, displaySteamInformation);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewSecondSearchItemDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var viewSecondSearchItemDetail = function(searchItem, linkedID) {

        // clone object as secondItem
        secondItem = $.extend(true, {}, searchItem);


        if (currentID === linkedID) {

            // figure out search provider for current item
            var provider = getItemProvider(secondItem.asin, secondItem.gbombID);

            // extend firstItem with second provider 3rd party id
            switch (provider) {
                case Utilities.SEARCH_PROVIDERS.Amazon:
                    firstItem.asin = secondItem.asin;
                    break;

                case Utilities.SEARCH_PROVIDERS.GiantBomb:
                    firstItem.gbombID = secondItem.gbombID;
                    break;
            }

            // call main view detail method
            completeSearchItemDetail(secondItem, provider, 1);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * completeSearchItemDetail
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var completeSearchItemDetail = function(item, provider, detailPhase) {

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

        // render tab based on current provider
        switch (provider) {
            case Utilities.SEARCH_PROVIDERS.Amazon:
                renderTabDetail(item, $amazonTab);
                break;

            case Utilities.SEARCH_PROVIDERS.GiantBomb:
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
        $tab.find('img').attr('src', 'http://d2sifwlm28j6up.cloudfront.net/no_selection_placeholder.png');
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
        metascoreRequest = Metacritic.getMetascore(title, item, fromSearch, getMetascore_result);

        // get metascore result
        function getMetascore_result(item) {

            // ignore results which do not match currently viewing item
            if (currentID === item.id || currentID === item.asin || currentID === item.gbombID) {

                // show metascore on each tab
                for (var i = 0, len = TAB_IDS.length; i < len; i++) {

                    metascoreSelector = TAB_IDS[i] + ' .metascore';

                    // add metascore info to item detail
                    Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);

                    if (item.metascorePage !== '') {

                        // show page in detail attributes
                        $metacriticPage.show();
                        $metacriticPage.find('a').attr('href', 'http://www.metacritic.com' + item.metascorePage);
                    }
                }
            }
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * displayWikipediaPage -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var displayWikipediaPage = function(wikipediaURL) {

        if (wikipediaURL) {
            $wikipediaPage.show();
            $wikipediaPage.find('a').attr('href', wikipediaURL);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * displayGametrailersPage -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var displayGametrailersPage = function(gametrailersURL) {

        if (gametrailersURL) {
            $gametrailersPage.show();
            $gametrailersPage.find('a').attr('href', gametrailersURL);
        }

    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * displaySteamInformation -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var displaySteamInformation = function(steamItem) {

        if (steamItem.steamPrice !== '') {
            $priceHeader.show();
            $steamPrice.find('.data').text(steamItem.steamPrice);
            $steamPrice.find('a').attr('href', steamItem.steamPage);
            $steamPrice.show();
        } else {
            $steamPrice.hide();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getProviderSpecificItemDetails -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getProviderSpecificItemDetails = function(provider, item) {

        switch (provider) {
            // amazon price details
            case Utilities.SEARCH_PROVIDERS.Amazon:
                Amazon.getAmazonItemOffers(item.asin, item, amazonItemOffers_result);
                break;

            // giantbomb detail
            case Utilities.SEARCH_PROVIDERS.GiantBomb:
                GiantBomb.getGiantBombItemData(item.gbombID, giantBombItemData_result);
                break;
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * amazonItemOffers_result -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var amazonItemOffers_result = function(offers) {

        // update data panel information
        if ((_.has(offers, 'buyNowPrice') && offers.buyNowPrice !== '') || (_.has(offers, 'lowestUsedPrice') && offers.lowestUsedPrice !== '')) {
            $priceHeader.show();
        }

        // new price
        if (_.has(offers, 'buyNowPrice') && offers.buyNowPrice !== '') {
            $amazonPriceNew.find('a').attr('href', offers.productURL);
            $amazonPriceNew.find('.data').text(offers.buyNowPrice);
            $amazonPriceNew.show();
        } else {
            $amazonPriceNew.hide();
        }

        // used price
        if (_.has(offers, 'lowestUsedPrice') && offers.lowestUsedPrice !== '') {
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
        configureVideos(itemDetail.videos, firstItem.name);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * configureVideos -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var configureVideos = function(giantbombVideos, itemName) {

        // has giantbombVideos
        if (giantbombVideos.length !== 0) {

            // load video details
            VideoPanel.initializeVideoPanel(giantbombVideos, itemName);

            currentItemHasVideo = true;
            $showVideoButton.removeClass('noVideos');
            $showVideoButton.find('span').text('Show Videos');
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetVideos -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetVideos = function(item) {

        currentItemHasVideo = false;
        $showVideoButton.addClass('noVideos');
        $showVideoButton.find('span').text('No Videos');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showTab -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showTab = function(provider) {

        switch (provider) {
            case Utilities.SEARCH_PROVIDERS.Amazon:

                viewingProvider = provider;
                // attach detailContainer to item detail info
                $amazonItemDetailInfo.append($detailContainer);
                $amazonTabLink.tab('show');
                break;

            case Utilities.SEARCH_PROVIDERS.GiantBomb:

                viewingProvider = provider;
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
        $gametrailersPage.hide();
        $metacriticPage.hide();

        $priceHeader.hide();
        $amazonPriceNew.hide();
        $amazonPriceUsed.hide();
        $steamPrice.hide();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * clearSecondItemModel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var clearSecondItemModel = function(provider) {

        switch (provider) {
            case Utilities.SEARCH_PROVIDERS.Amazon:
                clearDetail($giantBombTab);
                break;

            case Utilities.SEARCH_PROVIDERS.GiantBomb:
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
            provider = Utilities.SEARCH_PROVIDERS.Amazon;

        // giantbomb data found
        } else if (gbombID !== 0) {
            provider = Utilities.SEARCH_PROVIDERS.GiantBomb;
        }

        return provider;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * setItemType
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var setItemType = function(type) {

        // item exists with tags
        if (type === ITEM_TYPES.EXISTING) {

            itemType = ITEM_TYPES.EXISTING;
            $addItemButton.hide();
            $saveItemButton.hide();

        // new item with no current tags
        } else if (type === ITEM_TYPES.NEW) {

            itemType = ITEM_TYPES.NEW;
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

            setItemType(ITEM_TYPES.EXISTING);

            // update itemID
            sourceItem.itemID = itemData.itemID;

            // load tags
            TagView.selectTagsFromDirectory(itemData.tags);

        // new item - set user tags
        } else {
            setItemType(ITEM_TYPES.NEW);

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

            // if initialProvider !== current
            if (viewingProvider !== currentProvider) {

                // make sure the viewing provider has content
                if ((viewingProvider == Utilities.SEARCH_PROVIDERS.Amazon && item.asin !== 0) || viewingProvider == Utilities.SEARCH_PROVIDERS.GiantBomb && item.gbombID !== 0) {

                    // switch initialProvider and change out images
                    item.initialProvider = viewingProvider;
                    item.largeImage = secondItem.largeImage;
                    item.smallImage = secondItem.smallImage;
                    item.thumbnailImage = secondItem.thumbnailImage;
                }
            }

            addItemToTagRequest = ItemData.addItemToTags(tagsToAdd, item, addItemToTags_result);
        }

        // delete tags
        if (idsToDelete.length > 0) {
            ItemData.deleteTagsForItem(idsToDelete, tagsToDelete, item, deleteTagsForItem_result);
        }

        // check if saving without async data (metacritic, linked item) - if so, update
        updateAsyncData(item);

        // update save item button
        updateSaveItemButton();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateAsyncData - update item with data loaded asynchronously if not available at time of item save
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateAsyncData = function(item) {

        // check for metascore data
        if (_.isUndefined(item.metascore) || item.metascore === null) {

            // deferreds: wait for metascore and add item to tag requests
            $.when(metascoreRequest, addItemToTagRequest).then(

                // all ajax requests returned
                function() {

                    // update metacritic data for item
                    ItemData.updateMetacritic(firstItem);

                    // refresh itemView
                    ItemView.refreshView();
                },
                function() {

                }
            );
        }

        // amazon provider - giantbomb not linked
        if (currentProvider === Utilities.SEARCH_PROVIDERS.Amazon && item.gbombID === 0) {


        // giantbomb provider - amazon not linked
        } else if (currentProvider === Utilities.SEARCH_PROVIDERS.Amazon && item.asin === 0) {

        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * saveAttributes -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var saveAttributes = function(item) {

        // if attributes changed: update user item
        if (isAttributesDirty() && itemType === ITEM_TYPES.EXISTING) {
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

        // if new item - set to existing item
        if (itemType !== ITEM_TYPES.EXISTING) {
            setItemType(ITEM_TYPES.EXISTING);
        }

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
            if (itemType === ITEM_TYPES.NEW) {

                // populate user set tags from current tag selection
                TagView.updateUserTags();
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
        if (itemType === ITEM_TYPES.EXISTING && TagView.isAddListChanged()) {
            $saveItemButton.fadeIn();
        } else {
            $saveItemButton.fadeOut();
        }
    };

})(gamedex.module('detailView'), gamedex, jQuery, _, moment);
