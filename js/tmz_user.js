// USER
(function(User, tmz, $, _) {
	"use strict";

	// Dependencies
	var Utilities = tmz.module('utilities'),
		Storage = tmz.module('storage'),
		ItemView = tmz.module('itemView'),
		ItemCache = tmz.module('itemCache'),

		// constants
		USER_LOGIN_URL = tmz.api + 'login/',
		USER_CREATE_URL = tmz.api + 'createuser/',
		USER_UPDATE_URL = tmz.api + 'updateuser/',
		USER_SEND_RESET_CODE_URL = tmz.api + 'sendresetcode/',
		USER_SUBMIT_RESET_CODE_URL = tmz.api + 'submitresetcode/',
		USER_UPDATE_PASSWORD_URL = tmz.api + 'updatepassword/',

		// data
		userData = {'user_id': '', 'secret_key': ''},

		// demo account
		demoUser = {'user_id': '1', 'secret_key': '1'};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserData
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserData = function(setTimestamp) {

		// default argument
		setTimestamp = typeof setTimestamp !== 'undefined' ? setTimestamp : false;

		// set new timestamp - milliseconds since 1 Jan 1970
		userData.timestamp = new Date().getTime();

		// save local storage timestamp
		if (setTimestamp) {
			Storage.set('timestamp', userData.timestamp);
		}

		return userData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.login = function(email, password, onSuccess) {

		var requestData = {
			user_email: email,
			user_password: password
		};

		// login request
		$.ajax({
			url: USER_LOGIN_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				login_result(data, email);
				onSuccess(data, email);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* demoLogin
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.demoLogin = function() {

		// assign demo credentials to user
		userData.user_id = demoUser.user_id;
		userData.secret_key = demoUser.secret_key;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* logout
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.logout = function(email, password, onSuccess) {

		// clear user data (session)
		userData.user_id = null;
		userData.secret_key = null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.createUser = function(email, password, onSuccess) {

		// get parameters
		var requestData = {
			user_email: email,
			user_password: password
		};

		$.ajax({
			url: USER_CREATE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				login_result(data);
				onSuccess(data, email);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.updateUser = function(password, email, userName, newPassword, onSuccess) {

		// only update if existing password provided
		if (password !== '') {

			var requestData = {'user_id': userData.user_id, 'user_password': password};

			if (userName !== userData.userName) {
				requestData.user_name = userName;
			}
			if (email !== userData.email) {
				requestData.user_email = email;
			}
			if (newPassword !== '') {
				requestData.user_new_password = newPassword;
			}

			requestData.user_password = password;

			// login request
			$.ajax({
				url: USER_UPDATE_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					if (data.status === 'success') {
						updateUser_result(requestData);
					}
					onSuccess(data);
				},
				error: function(data) {

				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sendResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.sendResetPasswordCode = function(email, onSuccess) {

		var requestData = {'user_email': email};

		// login request
		$.ajax({
			url: USER_SEND_RESET_CODE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.submitResetPasswordCode = function(email, resetCode, onSuccess) {

		var requestData = {'user_email': email, 'user_reset_code': resetCode};

		// login request
		$.ajax({
			url: USER_SUBMIT_RESET_CODE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updatePassword -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.updatePassword = function(email, resetCode, newPassword, onSuccess) {

		var requestData = {'user_email': email, 'user_reset_code': resetCode, 'user_new_password': newPassword};

		// login request
		$.ajax({
			url: USER_UPDATE_PASSWORD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: function(data) {

			}
		});

	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUser_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUser_result = function(requestData) {

		// update userData
		if (typeof requestData.user_name !== 'undefined') {
			userData.userName = requestData.user_name;
		}
		if (typeof requestData.user_email !== 'undefined') {
			userData.email = requestData.user_email;
		}

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_result = function(data, email) {

		if (data.userID) {

			// save user data (session)
			userData.user_id = data.userID;
			userData.secret_key = data.secretKey;
			userData.userName = data.userName;
			userData.email = email;

			// compare timestamps - if different form localstorage value: clear item local storage data
			var localTimestamp = Storage.get('timestamp');

			if (data.timestamp != localTimestamp) {


				ItemCache.clearStoredData();
			}
		}
	};

})(tmz.module('user'), tmz, jQuery, _);
