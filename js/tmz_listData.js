// ListData
(function(ListData) {

	// Dependencies
	var User = tmz.module('user');
	var Storage = tmz.module('storage');

	// local represenation of localStorage data model
	var storedList = {};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ListData.getList = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserData();
		var restURL = tmz.api + 'list/';

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
				url: restURL,
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
	* addList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ListData.addList = function(listName, onSuccess, onError) {

		var userData = User.getUserData();
		var restURL = tmz.api + 'list/add';

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key,
			list_name: listName
		};

		$.ajax({
			url: restURL,
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
	* deleteList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ListData.deleteList = function(listID, onSuccess, onError) {

		var userData = User.getUserData();
		var restURL = tmz.api + 'list/delete';

		// delete list
		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key,
			id: listID
		};

		$.ajax({
			url: restURL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});

		// delete list item from storedList model
		for (var i = 0, len = storedList.length; i < len; i++) {
			if (storedList[i].id === listID) {
				delete storedList[i];

				// update local storage with store list model
				Storage.set('list', storedList);
			}
		}
	};


})(tmz.module('listData'));

