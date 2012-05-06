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

		// local represenation of localStorage data model
		storedList = {};

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
		storedList = Storage.get('list');

		if (storedList) {

			if (onSuccess) {
				onSuccess(storedList);
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

					// store list data
					storedList = Storage.set('list', data.list);

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

				// add response to stored list internal model
				storedList.push({'listName': data.listName.toLowerCase(), 'listID': data.listID});

				// update local storage with store list model
				Storage.set('list', storedList);

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

		// update list in storedList model
		for (var i = 0, len = storedList.length; i < len; i++) {
			if (storedList[i].listID === tagID) {

				// update name
				storedList[i].listName = listName;

				// update local storage with stored list model
				Storage.set('list', storedList);
			}
		}

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.deleteTag = function(tagID, onSuccess, onError) {



		var userData = User.getUserData();

		// delete list
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

		// delete list item from storedList model
		for (var i = 0, len = storedList.length; i < len; i++) {
			if (storedList[i].listID === tagID) {

				storedList.splice(i, 1);

				// update local storage with stored list model
				Storage.set('list', storedList);
			}
		}
	};


})(tmz.module('tagData'), tmz, jQuery, _);

