// USER
(function(User, gamedex, $, _, alertify) {
	"use strict";

	// Dependencies
	var Utilities = gamedex.module('utilities'),
		Storage = gamedex.module('storage'),
		ItemView = gamedex.module('itemView'),
		ItemCache = gamedex.module('itemCache'),

		// constants
		USER_LOGIN_URL = gamedex.api + 'user/login/',
		USER_LOGOUT_URL = gamedex.api + 'user/logout/',
		USER_VIEW_URL = gamedex.api + 'user/',
		USER_CREATE_URL = gamedex.api + 'user/create/',
		USER_DELETE_URL = gamedex.api + 'user/delete/',
		USER_UPDATE_URL = gamedex.api + 'user/update/',
		USER_SEND_RESET_CODE_URL = gamedex.api + 'user/resetcode/send/',
		USER_SUBMIT_RESET_CODE_URL = gamedex.api + 'user/resetcode/submit/',
		USER_UPDATE_PASSWORD_URL = gamedex.api + 'user/password/update/',

		// data
		userData = {'user_id': '', 'secret_key': '', 'viewUser': null},

		// demo account
		demoUser = {'user_id': 'ag1zfnQtbWludXN6ZXJvcgwLEgVVc2Vycxj6VQw', 'secret_key': '1'};

		if (document.location.hostname === 'localhost') {
			demoUser = {'user_id': 'ag9kZXZ-dC1taW51c3plcm9yEwsSBVVzZXJzGICAgICAgICARAw', 'secret_key': '1'};
		}

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserData = function(item) {
		return userData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserCredentials
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserCredentials = function(setTimestamp) {

		// default argument
		setTimestamp = typeof setTimestamp !== 'undefined' ? setTimestamp : false;

		// set new timestamp - milliseconds since 1 Jan 1970
		userData.timestamp = new Date().getTime();

		// if setTimestamp: save local storage timestamp
		if (setTimestamp) {
			Storage.set('timestamp', userData.timestamp);
		}

		// viewing user credentials
		if (userData.viewUser) {
			return {'user_name': userData.viewUser};

		// logged in user credentials
		} else {

			if (setTimestamp) {
				return {'uid': userData.user_id, 'uk': userData.secret_key, 'ts': userData.timestamp};
			} else {
				return {'uid': userData.user_id, 'uk': userData.secret_key};
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserID = function() {

		return userData.user_id;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.login = function(email, password, onSuccess, onError) {

		alertify.success('Logging in... ' + email);

		User.verifyUser(email, password, function(data, email) {
			login_success(data, email);
			onSuccess(data, email);
		}, onError);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* verifyUser
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.verifyUser = function(email, password, onSuccess, onError) {

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
				onSuccess(data, email);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteAccount
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.deleteAccount = function(userID, password, onSuccess, onError) {

		var requestData = {
			uid: userID,
			user_password: password
		};

		// login request
		$.ajax({
			url: USER_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: onError
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
	* validateUser
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.validateUser = function(userName, onSuccess) {

		var requestData = {
			user_name: userName
		};

		// login request
		$.ajax({
			url: USER_VIEW_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				validateUser_result(data);
				onSuccess(data);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* logout
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.logout = function() {

		alertify.success('Logged out');

		var requestData = {
			uid: userData.user_id,
			uk: userData.secret_key
		};

		// login request
		$.ajax({
			url: USER_LOGOUT_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

			},
			error: function(data) {

			}
		});

		// clear user data (session)
		userData.user_id = null;
		userData.secret_key = null;
		userData.userName = null;
		userData.email = null;
		userData.viewUser = null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.createUser = function(email, password, onSuccess, onError) {

		alertify.success('Creating account : ' + email);

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
				login_success(data, email);
				onSuccess(data, email);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.updateUser = function(password, email, userName, newPassword, onSuccess) {

		// only update if existing password provided
		if (password !== '') {

			var requestData = {
				'uid': userData.user_id,
				'user_password': password
			};

			if (userName !== '' && userName !== userData.userName) {
				requestData.user_name = userName;
			}
			if (userName !== '' && email !== userData.email) {
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
	* isViewUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.isViewUser = function() {

		if (userData.viewUser) {
			return true;
		}
		return false;
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
	* login_success
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_success = function(data, email) {

		if (data.userID) {

			// save user data (session)
			userData.user_id = data.userID;
			userData.secret_key = data.secretKey;
			userData.userName = data.userName;
			userData.email = email;
			userData.viewUser = null;

			alertify.success('Welcome ' + data.userName);

			// set history state to root
			var path = window.location.pathname;
			if (history && path !== '/') {
				history.pushState(null, null, '/');
			}

			// compare timestamps - if different from localstorage value: clear item local storage data
			var localTimestamp = Storage.get('timestamp');

			// if no localtimestamp in storage set new timestamp from data
			if (!localTimestamp) {
				Storage.set('timestamp', data.timestamp);

			// compare timestamps
			} else if (data.timestamp != localTimestamp) {

				ItemCache.clearStoredData();

				// update timestamp
				Storage.set('timestamp', data.timestamp);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* validateUser_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var validateUser_result = function(data) {

		if (data.status === 'success') {
			// save user data (session)
			userData.viewUser = data.userName;
			userData.user_id = data.userName;
			userData.secret_key = 0;
		}
	};

})(gamedex.module('user'), gamedex, jQuery, _, alertify);
