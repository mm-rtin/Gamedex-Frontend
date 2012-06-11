// Storage
(function(Storage, tmz, $, _) {
	"use strict";

	// Dependencies
	var User = tmz.module('user');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* get
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.get = function(key) {

		var userID = User.getUserID();

		// get local storage object for userID_key - returns string 'undefined' if not found
		var serializedObject = localStorage.getItem(userID + '_' + key);
		var object = null;

		// check local object found
		if (serializedObject !== 'undefined') {
			// retrieve and parse object
			if (serializedObject) {
				object = JSON.parse(serializedObject);
			}
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* set
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.set = function(key, object) {

		// do not store view user data
		if (!User.isViewUser()) {

			var userID = User.getUserID();

			// store object as string back into userID_key
			localStorage.setItem(userID + '_' + key, JSON.stringify(object));

			if (!object) {
				object = {};
			}
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* remove -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.remove = function(key) {

		var userID = User.getUserID();

		// remove item from localstorage
		localStorage.removeItem(userID + '_' + key);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setGlobal
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.setGlobal = function(key, object) {

		// store object as string back into userID_key
		localStorage.setItem(key, JSON.stringify(object));

		if (!object) {
			object = {};
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGlobal
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.getGlobal = function(key) {

		// get local storage object for userID_key
		var serializedObject = localStorage.getItem(key);
		var object = null;

		// retrieve and parse object
		if (serializedObject) {
			object = JSON.parse(serializedObject);
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* removeGlobal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.removeGlobal = function(key) {

		// remove item from localstorage
		localStorage.removeItem(key);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearStorage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.clearStorage = function() {

		localStorage.clear();
	};

})(tmz.module('storage'), tmz, jQuery, _);

