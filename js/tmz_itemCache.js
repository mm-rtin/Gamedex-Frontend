// ItemCache
(function(ItemCache) {

	// Dependencies
	var User = tmz.module('user');
	var Storage = tmz.module('storage');
	var Utilities = tmz.module('utilities');

	// constants
	var VIEW_ALL_TAG_ID = Utilities.getViewAllTagID();

	// data

	// items cached by tagID
	var itemsCacheByTag = {};

	// tagIDs which have been retrieved from local storage
	var storedItems = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItemsByTag = function(tagID) {

		var cachedItems = null;

		// check memory (session)
		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			cachedItems = itemsCacheByTag[tagID];

		// check local storage (long term)
		} else {
			cachedItems = getStoredItemsByTag(tagID);
		}
		return cachedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cacheItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cacheItemsByTag = function(items, itemDataDirectory) {

		// iterate items
		_.each(items, function(item, id) {

			// check if itemID is in data directory
			if (typeof itemDataDirectory[item.itemID] !== 'undefined') {

				// get item in itemDataDirectory and iterate tags
				_.each(itemDataDirectory[item.itemID].tags, function(id, tagID) {

					// cache item by tag
					cacheItemByTag(tagID, item);

					// add item to view all cache
					cacheItemByTag(VIEW_ALL_TAG_ID, item);
				});
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cacheItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cacheItemByTag = function(tagID, item) {

		// cache item by tag
		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			itemsCacheByTag[tagID][item.itemID] = item;

		} else {
			itemsCacheByTag[tagID] = {};
			itemsCacheByTag[tagID][item.itemID] = item;
		}

		// add to local storage
		storeItemByTag(tagID, item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStoredItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStoredItemDirectory = function() {

		return Storage.get('itemDataDirectory');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storeItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storeItemDirectory = function(data) {

		Storage.set('itemDataDirectory', data);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storeItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storeItemByTag = function(tagID, item) {

		console.info('try store item by tag: ', tagID, item.itemID);

		// skip storage if itemID was retrieved from local storage
		if (typeof storedItems[tagID + '_' + item.itemID] === 'undefined') {

			// get stored items by tag
			var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

			// key exists
			if (storedItemsCacheByTag) {

				// tag exists
				if (typeof storedItemsCacheByTag[tagID] !== 'undefined') {

					// add item to retrieved storage object
					storedItemsCacheByTag[tagID][item.itemID] = item;

				// create tag object
				} else {

					storedItemsCacheByTag[tagID] = {};
					storedItemsCacheByTag[tagID][item.itemID] = item;
				}

			// new storage key: storedItemsCacheByTag
			} else {

				// create fresh object
				storedItemsCacheByTag = {};
				storedItemsCacheByTag[tagID] = {};
				storedItemsCacheByTag[tagID][item.itemID] = item;
			}

			// store user object as string back into userID key
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);

			console.info('save to local storage: ' + tagID, item.itemID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteCachedItem = function(itemID, tagID) {

		if (itemsCacheByTag[tagID]) {
			delete itemsCacheByTag[tagID][itemID];
		}

		deleteStoredItem(itemID, tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteCachedTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteCachedTag = function(tagID) {

		if (itemsCacheByTag[tagID]) {
			delete itemsCacheByTag[tagID];
		}

		deleteStoredTag(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteStoredTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteStoredTag = function(tagID) {

		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');
		delete storedItemsCacheByTag[tagID];

		Storage.set('itemsCacheByTag', storedItemsCacheByTag);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteStoredItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteStoredItem = function(itemID, tagID) {

		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

		console.info(storedItemsCacheByTag);
		console.info(tagID, itemID);
		console.info(storedItemsCacheByTag[tagID][itemID]);

		delete storedItemsCacheByTag[tagID][itemID];

		Storage.set('itemsCacheByTag', storedItemsCacheByTag);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStoredItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStoredItemsByTag = function(tagID) {

		// get local storage object
		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');
		var storedTag = null;

		if (storedItemsCacheByTag) {

			// if tag found in user object
			if (typeof storedItemsCacheByTag[tagID] !== 'undefined') {

				storedTag = storedItemsCacheByTag[tagID];

				// save item id as being retrieved from local storage
				_.each(storedTag, function(item, key) {
					storedItems[tagID + '_' + key] = true;
				});

				console.info('get stored items by tag: ', tagID);
				console.info(storedTag);
			}
		}

		return storedTag;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearItemCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearItemCache = function(item) {

		itemsCacheByTag = {};
		storedItems = {};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearStoredData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearStoredData = function(item) {

		Storage.remove('itemsCacheByTag');
		Storage.remove('itemDataDirectory');
		Storage.remove('list');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'getCachedItemsByTag': getCachedItemsByTag,
		'cacheItemsByTag': cacheItemsByTag,
		'cacheItemByTag': cacheItemByTag,
		'getStoredItemDirectory': getStoredItemDirectory,
		'storeItemDirectory': storeItemDirectory,
		'deleteCachedItem': deleteCachedItem,
		'deleteCachedTag': deleteCachedTag,
		'clearItemCache': clearItemCache,
		'clearStoredData': clearStoredData
	};

	$.extend(ItemCache, publicMethods);

})(tmz.module('itemCache'));

