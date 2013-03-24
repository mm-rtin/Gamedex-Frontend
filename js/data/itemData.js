// ItemData
(function(ItemData, gamedex, $, _, moment, alertify) {
	"use strict";

	// Dependencies
	var User = gamedex.module('user'),
		ItemLinker = gamedex.module('itemLinker'),
		ItemCache = gamedex.module('itemCache'),
		TagView = gamedex.module('tagView'),
		Utilities = gamedex.module('utilities'),

		// REST URLS
		ITEM_DIRECTORY_URL = gamedex.api + 'item/directory/',
		ITEM_URL = gamedex.api + 'item/',
		ITEM_ADD_URL = gamedex.api + 'item/add/',
		ITEM_BATCH_DELETE_URL = gamedex.api + 'item/delete/batch/',
		ITEM_SINGLE_DELETE_URL = gamedex.api + 'item/delete/',
		ITEM_USER_UPDATE = gamedex.api + 'item/user/update/',
		ITEM_SHARED_PRICE_UPDATE = gamedex.api + 'item/shared/price/update/',
		UPDATE_METACRITIC_URL = gamedex.api + 'item/metacritic/update/',
		IMPORT_GAMES_URL = gamedex.api + 'import/',

		// constants
		VIEW_ALL_TAG_ID = Utilities.VIEW_ALL_TAG_ID,

		// full item detail results for last viewed tag:
		// alias of itemsCacheByTag[tagID]
		// key by ID
		items = {},

		// basic item framework - loaded before item details
		// all directories share item data
		// key by itemID = contains tags for each itemID
		itemDataDirectory = {},

		// key 3RD party ID
		amazonDirectory = {},
		giantBombDirectory = {};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var init = function() {

		$(document).keypress(function(e) {
			if (e.which == 96) {
				console.warn('------------ itemDataDirectory: -------', itemDataDirectory);
				console.warn('------------ amazonDirectory: -------', amazonDirectory);
				console.warn('------------ giantBombDirectory: -------', giantBombDirectory);
				console.warn('------------ items: -------------------', items);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemsAndDirectoryLoaded -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemsAndDirectoryLoaded = function(items) {

		ItemCache.cacheItemsByTag(items, itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadItemDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var downloadItemDirectory = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserCredentials();

		// check local storage
		var itemDirectory = ItemCache.getStoredItemDirectory();

		if (itemDirectory) {

			storedItemDirectory_result(itemDirectory);
			if (onSuccess) {
				onSuccess(itemDirectory);
			}

		// download directory data
		} else {

			var requestData = {};
			$.extend(true, requestData, userData);

			ajax = $.ajax({
				url: ITEM_DIRECTORY_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					downloadedItemDirectory_result(data);

					// store finished directory
					ItemCache.storeItemDirectory(itemDataDirectory);

					if (onSuccess) {
						onSuccess(data);
					}
				},
				error: function(data) {
				}
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadedItemDirectory_result - run after a itemDirectory downloaded through AJAX
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var downloadedItemDirectory_result = function(data) {

		var directoryItem = {};

		// create new directory, set 3rd party IDs as keys
		_.each(data.directory, function(item, itemID) {

			directoryItem = {
				// add itemID to directoryItem
				itemID: itemID,
				asin: item.aid,
				gbombID: item.gid,
				gameStatus: item.gs,
				playStatus: item.ps,
				tags: item.t,
				tagCount: item.tc,
				userRating: item.ur
			};

			// for each 3RD party directory sets their ID as keys
			addItemToDirectories(directoryItem);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storedItemDirectory_result - run after itemDirectory loaded through localStorage
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storedItemDirectory_result = function(itemDirectory) {

		var directoryItem = {};

		// create new directory, set 3rd party IDs as keys
		_.each(itemDirectory, function(item) {

			// for each 3RD party directory sets their ID as keys
			addItemToDirectories(item);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(tagID, onSuccess, onError) {

		var ajax = null;

		// find in itemsCacheByTag first
		var cachedItems = ItemCache.getCachedItemsByTag(tagID);

		// load cached items offer
		if (cachedItems) {

			// assign as new current items data
			items = cachedItems;

			// return updated source item
			onSuccess(cachedItems);

		// get new items data
		} else {

			var requestData = {
				list_id: tagID
			};

			var userData = User.getUserCredentials();
			$.extend(true, requestData, userData);

			ajax = $.ajax({
				url: ITEM_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					// parse results and assign as new items data
					items = parseItemResults(data);

					// return data to callee
					onSuccess(items);
				},
				error: onError
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseItemResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseItemResults = function(itemResults) {

		// temp item data
		var tempItems = {};
		var item = {};

		var itemLength = 0;
		var calendarDate = null;

		// iterate itemResults
		_.each(itemResults.items, function(currentItem) {

			item = {};

			var initialProvider = currentItem.ip;
			var imageBaseURL = currentItem.ib || '';

			// add image base url and add media provider url prefix
			var smallImage = addImageURLPrefix(currentItem.si, imageBaseURL, initialProvider);
			var thumbnailImage = addImageURLPrefix(currentItem.ti, imageBaseURL, initialProvider);
			var largeImage = addImageURLPrefix(currentItem.li, imageBaseURL, initialProvider);

			// get attributes
			item.id = currentItem.iid;
			item.initialProvider = currentItem.ip;
			item.itemID = currentItem.iid;
			item.asin = currentItem.aid;
			item.gbombID = currentItem.gid;

			item.name = currentItem.n;
			item.releaseDate = currentItem.rd;
			item.platform = currentItem.p;
			item.smallImage = smallImage;
			item.thumbnailImage = thumbnailImage;
			item.largeImage = largeImage;
			item.metascore = currentItem.ms;
			item.metascorePage = currentItem.mp;

			item.offers = {};

			// amazon price (best offer)
			if (currentItem.ap !== null) {
				item.offers.buyNowPrice = currentItem.ap;
				item.offers.buyNowRawPrice = currentItem.ap.replace('.', '');
				item.offers.offersURL = currentItem.apu;
				item.offers.productURL = currentItem.apu;
			}

			// amazone new price
			if (currentItem.anp !== null) {
				item.offers.lowestNewPrice = currentItem.anp;
				item.offers.offersURLNew = currentItem.anpu;
			}

			// amazon used price
			if (currentItem.aup !== null) {
				item.offers.lowestUsedPrice = currentItem.aup;
				item.offers.offersURLUsed = currentItem.aupu;
			}

			// steam price
			if (currentItem.sp !== null) {
				item.steamPrice = currentItem.sp;
				item.steamPage = currentItem.spu;
			}

			item.description = '';

			// add custom formated properties
			addCustomProperties(item);

			// add to lists objects
			tempItems[item.itemID] = item;

		});

		return tempItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItem = function(id) {
		return items[id];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags = function(tagIDs, sourceItem, onSuccess, onError) {

		var ajax = null;

		var userData = User.getUserCredentials(true);

		// clone sourceItem as new object
		var item = $.extend(true, {}, sourceItem);

		// shorten image url
		var smallImage = getShortImageURL(item.smallImage, item.initialProvider);
		var thumbnailImage = getShortImageURL(item.thumbnailImage, item.initialProvider);
		var largeImage = getShortImageURL(item.largeImage, item.initialProvider);

		var s1 = smallImage.split('');
		var s2 = thumbnailImage.split('');
		var s3 = largeImage.split('');

		// get base url for all 3 images (common starting substring)
		var lastCommonIndex = findCommonSubstringIndex(s1, s2, s3);

		// remove common substring from images
		var imageBaseURL = s1.slice(0, lastCommonIndex).join('');
		smallImage = s1.slice(lastCommonIndex).join('');
		thumbnailImage = s2.slice(lastCommonIndex).join('');
		largeImage = s3.slice(lastCommonIndex).join('');

		// request data
		var requestData = {
			'lids': tagIDs,

			'n': item.name,
			'rd': item.releaseDate,
			'aid': item.asin,
			'gid': item.gbombID,
			'ip': item.initialProvider,
			'p': item.platform,

			'ib': imageBaseURL,
			'si': smallImage,
			'ti': thumbnailImage,
			'li': largeImage,

			'mp': item.metascorePage,
			'ms': item.metascore,

			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};

		// add price data

		// amazon price data found
		if (!_.isUndefined(item.offers)) {
			if (!_.isUndefined(item.offers.buyNowPrice)) {
				requestData.ap = item.offers.buyNowPrice;
				requestData.apu = item.offers.productURL;
			}

			if (!_.isUndefined(item.offers.lowestNewPrice)) {
				requestData.anp = item.offers.lowestNewPrice;
				requestData.anpu = item.offers.offersURLNew;
			}

			if (!_.isUndefined(item.offers.lowestUsedPrice)) {
				requestData.aup = item.offers.lowestUsedPrice;
				requestData.aupu = item.offers.offersURLUsed;
			}
		}

		// steam price data found
		if (!_.isUndefined(item.steamPrice)) {
			requestData.sp = item.steamPrice;
			requestData.spu = item.steamPage;
		}


		$.extend(true, requestData, userData);

		ajax = $.ajax({
					url: ITEM_ADD_URL,
					type: 'POST',
					data: requestData,
					dataType: 'json',
					cache: true,
					success: function(data) {

						// update sourceItem with returned data
						sourceItem.id = data.itemID;
						sourceItem.itemID = data.itemID;

						// add client item
						var addedItems = addClientItem(sourceItem, data);

						// update tagView initialItemTags
						TagView.updateInitialItemTags(data.tagIDsAdded, data.idsAdded);

						// create alert
						var tagNames = [];
						var alertMessage = ' added to tag: ';
						_.each(tagIDs, function(tag) {
							tagNames.push(TagView.getTagName(tag));
						});

						if (tagIDs.length > 1) {
							alertMessage = ' added to tags: ';
						}

						alertify.success(item.name + alertMessage + tagNames.join(', '));

						// callback
						onSuccess(data, addedItems);
					},
					error: onError
				});

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findCommonSubstringIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findCommonSubstringIndex = function(s1, s2, s3) {

		var lastCommonIndex = 0;
		var commonString = '';

		// step through each index of 3 string arrays
		for (var i = 0, len = s1.length; i < len; i++) {

			if (s1[i] === s2[i] && s1[i] === s3[i]) {
				lastCommonIndex = i;
			} else {
				break;
			}
		}

		return lastCommonIndex + 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getShortImageURL - shortens media url for common amazon or giantbomb image urls
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getShortImageURL = function(url, initialProvider) {

		var outURL = url;

		// find common prefix and return shortened version
		// amazon media url
		if (initialProvider === Utilities.SEARCH_PROVIDERS.Amazon) {
			outURL = url.replace(Utilities.AMAZON_IMAGE.RE, Utilities.AMAZON_IMAGE.TOKEN);

		// giantbomb media url
		} else if (initialProvider === Utilities.SEARCH_PROVIDERS.GiantBomb) {
			outURL = url.replace(Utilities.GIANTBOMB_IMAGE.RE, Utilities.GIANTBOMB_IMAGE.TOKEN);
		}

		return outURL;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImageURLPrefix - add provider specific prefix to image url
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImageURLPrefix = function(url, imageBaseURL, initialProvider) {

		var outURL = url;
		var re = null;

		// prepend image base url
		url = imageBaseURL + url;

		// find common prefix and return shortened version
		// amazon media url
		if (initialProvider == Utilities.SEARCH_PROVIDERS.Amazon) {
			re = new RegExp(Utilities.AMAZON_IMAGE.TOKEN, 'g');
			outURL = url.replace(re, Utilities.AMAZON_IMAGE.URL);

		// giantbomb media url
		} else if (initialProvider == Utilities.SEARCH_PROVIDERS.GiantBomb) {
			re = new RegExp(Utilities.GIANTBOMB_IMAGE.TOKEN, 'g');
			outURL = url.replace(re, Utilities.GIANTBOMB_IMAGE.URL);
		}

		return outURL;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem = function(deletedIDs, deletedTagIDs, currentItem, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'ids': deletedIDs
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_BATCH_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// create alert
				var tagNames = [];
				var alertMessage = ' removed from tag: ';
				_.each(deletedTagIDs, function(tag) {
					tagNames.push(TagView.getTagName(tag));
				});

				if (deletedTagIDs.length > 1) {
					alertMessage = ' removed from tags: ';
				}
				alertify.error(currentItem.name + alertMessage + tagNames.join(', '));
			},
			error: onError
		});

		// delete 1 or more tags from item
		batchTagDelete(currentItem.itemID, deletedIDs, deletedTagIDs);

		onSuccess(currentItem.itemID, deletedTagIDs);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* batchTagDelete -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var batchTagDelete = function(itemID, deletedIDs, deletedTagIDs) {

		// iterate delete tagIDs
		for (var i = 0, len = deletedIDs.length; i < len; i++) {

			// delete item for tag
			deleteClientItem(deletedTagIDs[i], itemID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteSingleTagForItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteSingleTagForItem = function(itemID, tagID, onSuccess, onError) {

		// get itemTagID
		var id = getDirectoryItemByItemID(itemID).tags[tagID];

		var userData = User.getUserCredentials(true);

		var requestData = {
			'id': id
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_SINGLE_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
			},
			error: onError
		});

		// delete client item
		deleteClientItem(tagID, itemID);

		onSuccess(id, tagID);

		return itemID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateSharedItemPrice
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateSharedItemPrice = function(currentItem, priceProvider, onSuccess, onError) {

		var update = false;

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID
		};

		// Amazon Price
		if (priceProvider == Utilities.PRICE_PROVIDERS.Amazon) {

			// amazon price data found
			if (_.isUndefined(item.offers) || _.keys(item.offers).length === 0) {

				item.offers = {
					buyNowPrice: '',
					buyNowRawPrice: '',
					lowestNewPrice: '',
					lowestUsedPrice: '',
					offersURL: '',
					offersURLNew: '',
					offersURLUsed: '',
					productURL: ''
				};

				requestData.ap = '';
				requestData.apu = '';
				requestData.anp = '';
				requestData.anpu = '';
				requestData.aup = '';
				requestData.aupu = '';


			// update amazon item price
			} else {
				if (!_.isUndefined(item.offers.buyNowPrice) && item.offers.buyNowPrice !== '') {
					update = true;
					requestData.ap = item.offers.buyNowPrice;
					requestData.apu = item.offers.productURL;
				}

				if (!_.isUndefined(item.offers.lowestNewPrice) && item.offers.lowestNewPrice !== '') {
					update = true;
					requestData.anp = item.offers.lowestNewPrice;
					requestData.anpu = item.offers.offersURLNew;
				}

				if (!_.isUndefined(item.offers.lowestUsedPrice) && item.offers.lowestUsedPrice !== '') {
					update = true;
					requestData.aup = item.offers.lowestUsedPrice;
					requestData.aupu = item.offers.offersURLUsed;
				}
			}

		// Steam Price
		} else if (priceProvider == Utilities.PRICE_PROVIDERS.Steam) {

			// steam price data not found > set to empty string
			if (_.isUndefined(item.steamPrice)) {
				update = true;
				item.steamPrice = '';
				item.steamPage = '';

				requestData.sp = '';
				requestData.spu = '';

			// update item price
			} else {

				if (!_.isUndefined(item.steamPrice) && item.steamPrice !== '') {
					update = true;
					requestData.sp = item.steamPrice;
					requestData.spu = item.steamPage;
				}
			}
		}

		if (update) {

			// get tags for itemID
			var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

			var userData = User.getUserCredentials(true);

			// push update to item cache
			updateItemData(item, itemTags);

			$.extend(true, requestData, userData);

			$.ajax({
				url: ITEM_SHARED_PRICE_UPDATE,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					onSuccess(item, data);
				},
				error: onError
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItem = function(currentItem, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_USER_UPDATE,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateUserItemData(item);
				onSuccess(item, data);

				alertify.success(item.name + ' status updated');
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateMetacritic
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateMetacritic = function(currentItem, onSuccess, onError) {

		// get tags for itemID
		var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'mp': item.metascorePage,
			'ms': item.metascore
		};
		$.extend(true, requestData, userData);

		// push update to item cache
		updateItemData(item, itemTags);

		$.ajax({
			url: UPDATE_METACRITIC_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				if(onSuccess) {
					onSuccess(item, data);
				}
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addClientItem = function(item, data) {

		// cached items
		var viewAllCachedItems = null;
		var newItem = null;
		var addedItems = [];

		// update item with itemID
		item.itemID = data.itemID;

		// update ids -  idsAdded[], tagIDsAdded[]
		// each idsAdded index matches with its tagIDAddeds index
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// clone item
			newItem = $.extend(true, {}, item);

			// update item with new id
			newItem.id = data.itemID;

			// add custom formated properties
			addCustomProperties(newItem);

			// cache new item by tag
			ItemCache.cacheItemByTag(data.tagIDsAdded[i], newItem);

			// item added
			addedItems.push(newItem);
		}

		// add to directory
		addItemDataToDirectory(newItem, data);

		// add last item to 'view all' list (id: 0) cache if exists and itemID does not exist in all items cache
		viewAllCachedItems = ItemCache.getCachedItemsByTag(VIEW_ALL_TAG_ID);

		var itemIDExists = false;
		_.each(viewAllCachedItems, function(item, key) {
			if (item.itemID === newItem.itemID) {
				itemIDExists = true;
			}
		});
		// is unique: add item to 'view all' list
		if (!itemIDExists) {

			// add item to view all cache
			ItemCache.cacheItemByTag(VIEW_ALL_TAG_ID, newItem);
		}

		return addedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteClientItem = function(tagID, itemID) {

		// delete item by id from cache by tagID
		ItemCache.deleteCachedItem(itemID, tagID);

		// delete tag from directory
		deleteTagFromDirectory(itemID, tagID);

		// last tag for item, remove from 'view all' list
		if (itemDataDirectory[itemID].tagCount === 0) {

			// update cached items
			ItemCache.deleteCachedItem(itemID, VIEW_ALL_TAG_ID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addCustomProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addCustomProperties = function(item) {

		// add formatted calendarDate
		if (item.releaseDate !== '1900-01-01') {
			item.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
		} else {
			item.calendarDate = 'Unknown';
		}
		// add standard name propery
		item.standardName = ItemLinker.standardizeTitle(item.name);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItemData - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItemData = function(item) {

		var directoryItem = itemDataDirectory[item.itemID];

		// update directoryItem properties
		directoryItem.gameStatus = item.gameStatus;
		directoryItem.playStatus = item.playStatus;
		directoryItem.userRating = item.userRating;

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItemData = function(item, itemTags) {

		// update itemCache and item local storage for each tag
		_.each(itemTags, function(id, tagID) {

			ItemCache.updateCacheItemByTag(tagID, item);
		});

		// update 'view all' tag cache
		ItemCache.updateCacheItemByTag(0, item);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemDataToDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemDataToDirectory = function(item, data) {

		// if itemID doesn't exist in directory
		if (!itemDataDirectory[data.itemID]) {

			// add to tag directory
			var directoryItem = {
				itemID: item.itemID,
				asin: item.asin,
				gbombID: item.gbombID,
				gameStatus: item.gameStatus,
				playStatus: item.playStatus,
				tags: {},
				tagCount: 0,
				userRating: item.userRating
			};

			// add to 3rd party directory
			addItemToDirectories(directoryItem);
		}

		// update tag information in directories
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// add tag
			itemDataDirectory[data.itemID].tags[data.tagIDsAdded[i]] = data.idsAdded[i];
			// increment tagCount
			itemDataDirectory[data.itemID].tagCount += 1;
		}

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagFromDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagFromDirectory = function(itemID, tagID) {

		var item = itemDataDirectory[itemID];

		// remove tag from item - will also remove from 3rd party directories
		delete item.tags[tagID];

		// decrement tagCount
		item.tagCount += -1;

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToDirectories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToDirectories = function(item) {

		// itemID directory
		itemDataDirectory[item.itemID] = item;

		// amazon
		if (parseInt(item.asin, 10) !== 0) {
			amazonDirectory[item.asin] = item;
		}
		// giant bomb
		if (parseInt(item.gbombID, 10) !== 0) {
			giantBombDirectory[item.gbombID] = item;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemDirectory = function() {
		return itemDataDirectory;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getDirectoryItemByItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getDirectoryItemByItemID = function(itemID) {

		// return item or empty object
		return itemDataDirectory[itemID] || null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemByThirdPartyID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemByThirdPartyID = function(gbombID, asin) {

		// itemID from directory
		var item = null;

		// select appropriate 3rd party item directory
		if (gbombID !== 0) {
			item = giantBombDirectory[gbombID];

		} else if (asin !== 0) {
			item = amazonDirectory[asin];
		}

		return item;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetItemData = function() {

		items = {};
		itemDataDirectory = {};
		amazonDirectory = {};
		giantBombDirectory = {};

		// clear cache
		ItemCache.clearItemCache();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getRandomItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getRandomItemID = function() {

		var idList = [];

		// add ids to idList
		_.each(items, function(item, key) {
			idList.push(key);
		});

		// get random number between 0 and idList.length
		var randomIndex = Math.floor(Math.random() * idList.length);

		return idList[randomIndex];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importGames = function(source, sourceUser, onSuccess) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'source': source,
			'source_user': sourceUser
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: IMPORT_GAMES_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: function(data) {

			}
		});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'init': init,
		'itemsAndDirectoryLoaded': itemsAndDirectoryLoaded,
		'getItemDirectory': getItemDirectory,
		'getDirectoryItemByItemID': getDirectoryItemByItemID,
		'getItemByThirdPartyID': getItemByThirdPartyID,
		'resetItemData': resetItemData,
		'getRandomItemID': getRandomItemID,
		'getItems': getItems,
		'getItem': getItem,
		'downloadItemDirectory': downloadItemDirectory,
		'addItemToTags': addItemToTags,
		'updateUserItem': updateUserItem,
		'updateSharedItemPrice': updateSharedItemPrice,
		'updateMetacritic': updateMetacritic,
		'deleteTagsForItem': deleteTagsForItem,
		'deleteSingleTagForItem': deleteSingleTagForItem,
		'deleteTagFromDirectory': deleteTagFromDirectory,
		'deleteClientItem': deleteClientItem,
		'importGames': importGames
	};

	$.extend(ItemData, publicMethods);

})(gamedex.module('itemData'), gamedex, $, _, moment, alertify);

