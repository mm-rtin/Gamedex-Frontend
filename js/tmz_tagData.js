// TagData
(function(TagData, tmz, $, _) {
	"use strict";

	// constants
	var TAG_GET_URL = tmz.api + 'tag/',
		TAG_ADD_URL = tmz.api + 'tag/add/',
		TAG_UPDATE_URL = tmz.api + 'tag/update/',
		TAG_DELETE_URL = tmz.api + 'tag/delete/',

		// Dependencies
		User = tmz.module('user'),
		Storage = tmz.module('storage'),
		ItemData = tmz.module('itemData'),
		ItemCache = tmz.module('itemCache'),

		// local represenation of localStorage data model
		storedTags = {};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.getTags = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key
		};

		// check local storage
		storedTags = Storage.get('tag');

		if (storedTags) {

			if (onSuccess) {
				onSuccess(storedTags);
			}

		// download directory data
		} else {

			ajax = $.ajax({
				url: TAG_GET_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					// store tag data
					storedTags = Storage.set('tag', data.list);

					onSuccess(data.list);
				},
				error: onError
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTag
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.addTag = function(listName, onSuccess, onError) {

		var userData = User.getUserData();

		var requestData = {
			'user_id': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,
			'tag_name': listName
		};

		$.ajax({
			url: TAG_ADD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// add response to stored tag internal model
				storedTags.push({'listName': data.listName.toLowerCase(), 'listID': data.listID});

				// update local storage with store tag model
				Storage.set('tag', storedTags);

				onSuccess(data);
			},
			error: onError
		});

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.updateTag = function(listName, tagID, onSuccess, onError) {

		var userData = User.getUserData();

		var requestData = {
			'user_id': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,
			'tag_name': listName,
			'tag_id': tagID
		};

		$.ajax({
			url: TAG_UPDATE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				onSuccess(data);
			},
			error: onError
		});

		// update tag in storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].listID === tagID) {

				// update name
				storedTags[i].listName = listName;

				// update local storage with stored tag model
				Storage.set('tag', storedTags);
			}
		}

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.deleteTag = function(tagID, onSuccess, onError) {

		var userData = User.getUserData();

		// delete tag
		var requestData = {
			'user_id': userData.user_id,
			'uk': userData.secret_key,
			'ts': userData.timestamp,
			'id': tagID
		};

		$.ajax({
			url: TAG_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});

		// get all items by tagID
		var tagItems = ItemCache.getCachedItemsByTag(tagID);

		// each item in tag: delete client item
		_.each(tagItems, function(item) {
			ItemData.deleteClientItem(tagID, item.itemID);
		});

		// delete tag item from storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].listID === tagID) {

				storedTags.splice(i, 1);

				// update local storage with stored tag model
				Storage.set('tag', storedTags);
			}
		}
	};


})(tmz.module('tagData'), tmz, jQuery, _);

