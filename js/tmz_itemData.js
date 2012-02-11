// ItemData
(function(ItemData) {

	// Dependencies
	var User = tmz.module('user');

	// get items by 3RD party ID
	var amazonDirectory = {};
	var giantBombDirectory = {};

	// get items by itemID
	var itemTagsDirectory = {};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getAmazonDirectory = function() {
		return amazonDirectory;
	};

	ItemData.getGiantBombDirectory = function() {
		return giantBombDirectory;
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getAmazonItemDetail = function(itemData, onSuccess, onError) {

		// method/searchIndex/browseNode/keywords/ResponseGroup/Page
		var restURL = tmz.api + 'itemlookup_asin/' + encodeURIComponent(asin) + '/Medium';

		$.ajax({
			url: restURL,
			type: 'GET',
			dataType: 'xml',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItemDirectory = function(onSuccess, onError) {

		var restURL = tmz.api + 'item/directory';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key
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
					onSuccess(data);
				}
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTagsByItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getTagsByItemID = function(itemID, onSuccess, onError) {

		var restURL = tmz.api + 'item/tags';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
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
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			list_ids: listIDs,
			item_name: item.name,
			item_releasedate: item.releaseDate,
			item_asin:  item.asin,
			item_gbombID: item.gbombID,
			item_platform: item.platform,
			item_smallImage: item.smallImage,
			item_thumbnailImage: item.thumbnailImage,
			item_largeImage: item.largeImage
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				addTagsToDirectory(item, data);
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
			secret_key: userData.secret_key,
			ids: listIDs
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// iterate delete tagIDs
				for (var i = 0, len = data.itemsDeleted.length; i < len; i++) {
					// delete tag from directory
					deleteTagFromDirectory(currentItem.itemID, data.itemsDeleted[i].tagID);
				}
				onSuccess(data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteSingleItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.deleteSingleItem = function(id, itemID, onSuccess) {

		var restURL = tmz.api + 'item/delete';
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			secret_key: userData.secret_key,
			id: id
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				deleteTagFromDirectory(itemID, data.tagID);
				onSuccess(data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemTagsFromDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItemTagsFromDirectory = function(itemID) {

		var tags = {};
		if (itemTagsDirectory[itemID]) {
			tags = itemTagsDirectory[itemID].tags;
		}

		return tags;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemTagCountFromDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemData.getItemTagCountFromDirectory = function(itemID) {

		var tagCount = 0;
		if (itemTagsDirectory[itemID]) {
			tagCount = itemTagsDirectory[itemID].tagCount;
		}

		return tagCount;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagFromDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagFromDirectory = function(itemID, tagID) {

		console.info(itemID);
		console.info(tagID);
		var itemTags = itemTagsDirectory[itemID];

		// remove tag from item
		delete itemTags.tags[tagID];

		// decrement tagCount
		itemTags.tagCount += -1;

		console.info(itemTagsDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTagsToDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addTagsToDirectory = function(item, data) {

		// if itemID doesn't exist in directory
		if (!itemTagsDirectory[data.itemID]) {

			// add to tag directory
			itemTagsDirectory[data.itemID] = {'itemAsin': item.asin, 'itemGBombID': item.gbombID, 'tags': {}, 'tagCount': 0};

			// add to 3rd party directory
			addItemTo3rdPartyDirectory(item.asin, item.gbombID, data.itemID);
		}

		// iterate added tags
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {
			// add tag
			itemTagsDirectory[data.itemID].tags[data.tagIDsAdded[i]] = data.idsAdded[i];
			// increment tagCount
			itemTagsDirectory[data.itemID].tagCount += 1;
		}

		console.info(itemTagsDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemTo3rdPartyDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemTo3rdPartyDirectory = function(asin, gbombID, itemID) {

		var directory = null;

		// giant bomb
		if (gbombID !== 0) {
			directory =  ItemData.getGiantBombDirectory();
			directory[gbombID] = itemID;

		// amazon
		} else if (asin !== 0) {
			directory =  ItemData.getAmazonDirectory();
			directory[asin] = itemID;
		}

		console.info(directory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDirectory_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemDirectory_result = function(data) {

		// create new directory, set 3rd party IDs as keys
		_.each(data.directory, function(item, itemID) {

			// for each 3RD party directory sets their ID as keys
			if (item.itemAsin !== '0') {
				amazonDirectory[item.itemAsin] = itemID;
			}
			if (item.itemGBombID !== '0') {
				giantBombDirectory[item.itemGBombID] = itemID;
			}

		});

		// assign itemTags directory
		itemTagsDirectory = data.directory;
	};

})(tmz.module('itemData'));

