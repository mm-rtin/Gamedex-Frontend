// ItemData
(function(ItemData, tmz, $, _, moment) {
	"use strict";

	// Dependencies
	var User = tmz.module('user'),
		ItemLinker = tmz.module('itemLinker'),
		ItemCache = tmz.module('itemCache'),
		Utilities = tmz.module('utilities'),

		// REST URLS
		ITEM_DIRECTORY_URL = tmz.api + 'item/directory/',
		ITEM_URL = tmz.api + 'item/',
		ITEM_ADD_URL = tmz.api + 'item/add/',
		ITEM_BATCH_DELETE_URL = tmz.api + 'item/delete/batch/',
		ITEM_SINGLE_DELETE_URL = tmz.api + 'item/delete/',
		ITEM_UPDATE_USER_URL = tmz.api + 'item/update/user/',
		ITEM_UPDATE_URL = tmz.api + 'item/update/',
		UPDATE_METACRITIC_URL = tmz.api + 'item/update/metacritic/';

		// constants
	var VIEW_ALL_TAG_ID = Utilities.getViewAllTagID(),

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
		var userData = User.getUserData();

		// check local storage
		var itemDirectory = ItemCache.getStoredItemDirectory();

		if (itemDirectory) {

			storedItemDirectory_result(itemDirectory);
			if (onSuccess) {
				onSuccess(itemDirectory);
			}

		// download directory data
		} else {

			var requestData = {
				user_id: userData.user_id,
				uk: userData.secret_key
			};

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
				error: onError
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

		// DEBUG
		if (typeof $(document).data('events').keypress === 'undefined') {

			$(document).keypress(function(e) {
				if (e.which == 96) {
					console.warn('------------ itemDataDirectory: -------', itemDataDirectory);
					console.warn('------------ amazonDirectory: -------', amazonDirectory);
					console.warn('------------ giantBombDirectory: -------', giantBombDirectory);
					console.warn('------------ items: -------------------', items);
				}
			});
		}

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

			var userData = User.getUserData();

			var requestData = {
				user_id: userData.user_id,
				uk: userData.secret_key,
				list_id: tagID
			};

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
		for (var i = 0, len = itemResults.items.length; i < len; i++) {

			item = {};

			// get attributes
			item.id = itemResults.items[i].iid;
			item.initialProvider = itemResults.items[i].ip;
			item.itemID = itemResults.items[i].iid;
			item.asin = itemResults.items[i].aid;
			item.gbombID = itemResults.items[i].gid;

			item.name = itemResults.items[i].n;
			item.releaseDate = itemResults.items[i].rd;
			item.platform = itemResults.items[i].p;
			item.smallImage = itemResults.items[i].si;
			item.thumbnailImage = itemResults.items[i].ti;
			item.largeImage = itemResults.items[i].li;
			item.metascore = itemResults.items[i].ms;
			item.offers = {};

			item.description = '';

			// add custom formated properties
			addCustomProperties(item);

			// add to lists objects
			tempItems[item.itemID] = item;
		}

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
	var addItemToTags = function(tagIDs, currentItem, onSuccess, onError) {

		var userData = User.getUserData(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'uid': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,
			'lids': tagIDs,

			'n': item.name,
			'rd': item.releaseDate,
			'aid': item.asin,
			'gid': item.gbombID,
			'ip': item.initialProvider,
			'p': item.platform,
			'si': item.smallImage,
			'ti': item.thumbnailImage,
			'li': item.largeImage,

			'mp': item.metascorePage,
			'ms': item.metascore,

			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};

		$.ajax({
			url: ITEM_ADD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				var addedItems = addClientItem(item, data);
				onSuccess(data, addedItems);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem = function(deletedIDs, deletedTagIDs, currentItem, onSuccess, onError) {

		var userData = User.getUserData(true);

		var requestData = {
			'user_id': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,
			'ids': deletedIDs
		};

		$.ajax({
			url: ITEM_BATCH_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

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

		var userData = User.getUserData(true);

		var requestData = {
			'user_id': userData.user_id,
			'ts': userData.timestamp,
			'uk': userData.secret_key,
			'id': id
		};

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
	* updateItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItem = function(currentItem, onSuccess, onError) {

		// get tags for itemID
		var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

		var userData = User.getUserData(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'uid': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,

			'id': item.itemID,
			'aid': item.asin,
			'gid': item.gbombID,

			'rd': item.releaseDate,
			'si': item.smallImage,
			'ti': item.thumbnailImage,
			'li': item.largeImage
		};

		$.ajax({
			url: ITEM_UPDATE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateItemData(item, itemTags);
				onSuccess(item, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItem = function(currentItem, onSuccess, onError) {

		var userData = User.getUserData(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'uid': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,

			'id': item.itemID,
			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};

		$.ajax({
			url: ITEM_UPDATE_USER_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateUserItemData(item);
				onSuccess(item, data);
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

		var userData = User.getUserData(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'uid': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,

			'id': item.itemID,
			'mp': item.metascorePage,
			'ms': item.metascore
		};

		$.ajax({
			url: UPDATE_METACRITIC_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateItemData(item, itemTags);

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
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
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
		'updateMetacritic': updateMetacritic,
		'deleteTagsForItem': deleteTagsForItem,
		'deleteSingleTagForItem': deleteSingleTagForItem,
		'deleteTagFromDirectory': deleteTagFromDirectory,
		'deleteClientItem': deleteClientItem
	};

	$.extend(ItemData, publicMethods);

})(tmz.module('itemData'), tmz, $, _, moment);

