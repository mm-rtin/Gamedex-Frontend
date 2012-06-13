/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* TAG DATA - methods for interacting with server side tag data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

		// local represenation of localStorage data model
		storedTags = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTags - return tags for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.getTags = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserCredentials();

		var requestData = {};
		$.extend(true, requestData, userData);

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
	* addTag - create new tag for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.addTag = function(tagName, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'tag_name': tagName
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_ADD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// add response to stored tag internal model
				storedTags.push({'tagName': data.tagName.toLowerCase(), 'tagID': data.tagID});

				// update local storage with store tag model
				Storage.set('tag', storedTags);
				onSuccess(data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag - update tag name for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.updateTag = function(tagName, tagID, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'tag_name': tagName,
			'tag_id': tagID
		};
		$.extend(true, requestData, userData);

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
			if (storedTags[i].tagID === tagID) {

				// update name
				storedTags[i].tagName = tagName;

				// update local storage with stored tag model
				Storage.set('tag', storedTags);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag - delete users tag
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.deleteTag = function(tagID, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		// delete tag
		var requestData = {
			'id': tagID
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});

		// delete tag item from storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].tagID === tagID) {

				storedTags.splice(i, 1);

				// update local storage with stored tag model
				Storage.set('tag', storedTags);

				break;
			}
		}
	};


})(tmz.module('tagData'), tmz, jQuery, _);

