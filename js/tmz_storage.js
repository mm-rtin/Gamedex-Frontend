// Storage
(function(Storage) {

	// Dependencies
	var User = tmz.module('user');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* get
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.get = function(key) {

		var userID = User.getUserData().user_id;

		// get local storage object for userID_key
		var serializedObject = localStorage.getItem(userID + '_' + key);
		var object = null;

		// retrieve and parse object
		if (serializedObject) {
			object = JSON.parse(serializedObject);
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* set
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.set = function(key, object) {

		var userID = User.getUserData().user_id;

		// store object as string back into userID_key
		localStorage.setItem(userID + '_' + key, JSON.stringify(object));

		if (!object) {
			object = {};
		}

		return object;
	};

})(tmz.module('storage'));

