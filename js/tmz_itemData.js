// ItemData
(function(ItemData) {

	// Dependencies
	var User = tmz.module('user');
	var ItemLinker = tmz.module('itemLinker');

	// constants
	var VIEW_ALL_TAG_ID = '0';

	// full item detail results for last viewed tag:
	// alias of itemsCacheByTag[tagID]
	var items = {};

	// items cached by tagID
	itemsCacheByTag = {};

	// basic item framework - loaded before item details
	// all directories share item data

	// items by itemID = contains tags for each itemID
	var itemDataDirectory = {};

	// items by 3RD party ID
	var amazonDirectory = {};
	var giantBombDirectory = {};

	// active tags - tags currently used by items
	var activeTags = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItemDirectory = function() {
		return itemDataDirectory;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getDirectoryItemByItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getDirectoryItemByItemID = function(itemID) {

		// return item or empty object
		return itemDataDirectory[itemID] || null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemByThirdPartyID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItemByThirdPartyID = function(gbombID, asin) {

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
	* getActiveTags -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getActiveTags = function() {
		return activeTags;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItems = function(tagID, onSuccess, onError) {

		// DEBUG
		if (typeof $(document).data('events').keypress === 'undefined') {
			console.info($(document).data('events'));
			$(document).keypress(function(e) {
				if (e.which == 96) {
					console.warn('------------ itemsCacheByTag: ---------', itemsCacheByTag);
					console.warn('------------ itemDataDirectory: -------', itemDataDirectory);
					console.warn('------------ items: -------------------', items);
				}
			});
		}

		// find in itemsCacheByTag first
		var cachedItems = getCachedItemsByTag(tagID);

		// load cached items offer
		if (cachedItems) {

			// assign as new current items data
			items = cachedItems;



			// return updated source item
			onSuccess(cachedItems);

		// get new items data
		} else {

			var restURL = tmz.api + 'item/';
			var userData = User.getUserData();

			var requestData = {
				user_id: userData.user_id,
				uk: userData.secret_key,
				list_id: tagID
			};

			$.ajax({
				url: restURL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					// parse results and assign as new items data
					items = parseItemResults(data);

					// save reference to itemsCacheByTag
					itemsCacheByTag[tagID] = items;

					// return data to callee
					onSuccess(items);
				},
				error: onError
			});
		}


	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItem = function(id) {
		return items[id];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadItemDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.downloadItemDirectory = function(onSuccess, onError) {

		var restURL = tmz.api + 'item/directory';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				getItemDirectory_result(data);
				if (onSuccess) {
					populateActiveTags();
					onSuccess(data);
				}
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTagsByItemID - currently not used
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getTagsByItemID = function(itemID, onSuccess, onError) {

		var restURL = tmz.api + 'item/tags';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key,
			item_id: itemID
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data.itemTags);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.addItemToTags = function(listIDs, currentItem, onSuccess, onError) {

		var restURL = tmz.api + 'item/add';
		var userData = User.getUserData();

		// clone currentItem as new object
		var item = jQuery.extend(true, {}, currentItem);

		var requestData = {
			'uid': userData.user_id,
			'uk': userData.secret_key,
			'lids': listIDs,

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
			url: restURL,
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
	* updateItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.updateItem = function(currentItem, onSuccess, onError) {

		var restURL = tmz.api + 'item/update';
		var userData = User.getUserData();

		// clone currentItem as new object
		var item = jQuery.extend(true, {}, currentItem);

		var requestData = {
			'uid': userData.user_id,
			'uk': userData.secret_key,

			'id': item.itemID,
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
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				updateDirectoryItem(item);
				onSuccess(item, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.deleteTagsForItem = function(listIDs, currentItem, onSuccess, onError) {

		var restURL = tmz.api + 'item/batch-delete';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key,
			ids: listIDs
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// delete 1 or more tags from item
				batchTagDelete(currentItem.itemID, data.itemsDeleted);
				onSuccess(currentItem.itemID, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteSingleTagForItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.deleteSingleTagForItem = function(id, tagID, onSuccess, onError) {

		var itemID = items[id].itemID;

		var restURL = tmz.api + 'item/delete';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key,
			id: id
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: onError
		});

		// delete tag from directory
		deleteTagFromDirectory(itemID, tagID);

		// delete client item
		deleteClientItem(id, tagID, itemID);

		return itemID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* populateActiveTags -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var populateActiveTags = function() {

		// reset activeTags
		activeTags = {};

		// iterate items in itemDirectory
		_.each(itemDataDirectory, function(item, key) {

			// iterate tags
			_.each(item.tags, function(id, tag) {

				// if tag not in activeTags: add it
				if (typeof activeTags[tag] === 'undefined') {
					activeTags[tag] = true;
				}
			});
		});


	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteClientItem = function(id, tagID, itemID) {



		var cachedItems = getCachedItemsByTag(tagID);
		var cachedItem = null;


		// delete item by id from cache by tagID
		if (cachedItems) {
			delete cachedItems[id];
		}

		// delete from view all list if cached
		// but only if last tag for itemID is deleted
		// find 'view all' cache item by itemID
		cachedItems = getCachedItemsByTag(VIEW_ALL_TAG_ID);
		cachedItem = getCacheItemByItemID(itemID, VIEW_ALL_TAG_ID);


		// 'view all' cache available and item is in cache
		if (cachedItem) {



			// last tag for item, remove from 'view all' list
			if (itemDataDirectory[itemID].tagCount === 0) {

				delete cachedItems[cachedItem.id];
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addClientItem = function(item, data) {

		// cached items
		var cachedItems = null;
		var newItem = null;
		var addedItems = [];

		// update item with itemID
		item.itemID = data.itemID;

		// update ids -  idsAdded[], tagIDsAdded[]
		// each idsAdded index matches with its tagIDAddeds index
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// clone item
			newItem = jQuery.extend(true, {}, item);

			// update item with new id
			newItem.id = data.idsAdded[i];

			// add custom formated properties
			addCustomProperties(newItem);

			// check if item cache for tagID exists
			cachedItems = getCachedItemsByTag(data.tagIDsAdded[i]);
			// if cache found - add item to cache
			if (cachedItems) {

				// add to existing cache
				cachedItems[newItem.id] = newItem;
			}

			// item added
			addedItems.push(newItem);
		}

		// add to directory
		addItemDataToDirectory(newItem, data);

		// add last item to 'view all' list (id: 0) cache if exists and itemID does not exist in all items cache
		cachedItems = getCachedItemsByTag(VIEW_ALL_TAG_ID);
		var itemIDExists = false;
		_.each(cachedItems, function(item, key) {
			if (item.itemID === newItem.itemID) {
				itemIDExists = true;
			}
		});
		// is unique: add item to 'view all' list
		if (cachedItems && !itemIDExists) {
			cachedItems[newItem.id] = newItem;
		}

		return addedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItemsByTag = function(tagID) {

		var cachedItems = null;

		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			cachedItems = itemsCacheByTag[tagID];
		}
		return cachedItems;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCacheItemByItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCacheItemByItemID = function(itemID, tagID) {

		var cachedItems = getCachedItemsByTag(tagID);
		var foundItem = null;

		if (cachedItems) {

			// iterate cachedItems: search for item with itemID
			_.each(cachedItems, function(item, key) {

				if (item.itemID === itemID) {
					foundItem = item;
				}
			});
		}

		return foundItem;
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
		var i = 0;

		listLength = itemResults.items.length;

		// iterate itemResults
		for (i; i < listLength; i++) {

			item = {};

			// get attributes
			item.id = itemResults.items[i].id;
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
			tempItems[item.id] = item;
		}

		return tempItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* batchTagDelete -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var batchTagDelete = function(itemID, deletedItems) {

		// iterate delete tagIDs
		for (var i = 0, len = deletedItems.length; i < len; i++) {

			// delete tag from directory
			deleteTagFromDirectory(itemID, deletedItems[i].tagID);

			// delete item for tag
			deleteClientItem(deletedItems[i].id, deletedItems[i].tagID, itemID);
		}
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
	* updateDirectoryItem - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateDirectoryItem = function(item) {

		var directoryItem = itemDataDirectory[item.itemID];

		// update properties
		directoryItem.gameStatus = item.gameStatus;
		directoryItem.playStatus = item.playStatus;
		directoryItem.userRating = item.userRating;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemDataToDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemDataToDirectory = function(item, data) {




		// if itemID doesn't exist in directory
		if (!itemDataDirectory[data.itemID]) {

			// add to tag directory
			directoryItem = {
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

		return itemDataDirectory[data.itemID];
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
	* getItemDirectory_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemDirectory_result = function(data) {

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

})(tmz.module('itemData'));

