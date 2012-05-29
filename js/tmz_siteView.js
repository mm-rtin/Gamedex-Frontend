// SITEVIEW
(function(SiteView, tmz, $, _) {
	"use strict";

    // module references
    var User = tmz.module('user'),
		ItemData = tmz.module('itemData'),
		TagView = tmz.module('tagView'),
		ItemView = tmz.module('itemView'),
		SearchView = tmz.module('searchView'),
		Storage = tmz.module('storage'),

		// constants
		FORM_TYPES = {'login': 0, 'signup': 1},

		// properties
		formType = FORM_TYPES.login,
		rememberMe = false,

		// data

		// jquery cache
		// header
		$infoHeader = $('#infoHeader'),
		$header = $('#header'),
		$userMenu = $('#userMenu'),
		$logoutButton = $('#logoutButton'),
		$loggedInButton = $('#loggedInButton'),

		// login/signup
		$loginForm = $('#loginForm'),
		$loginButton = $('#loginButton'),
		$signupButton = $('#signupButton'),
		$loginSubmitButton = $('#loginSubmitButton'),
		$signupSubmitButton = $('#signupSubmitButton'),
		$backButton = $('#backButton'),
		$email = $('#email').find('input'),
		$password = $('#password').find('input'),
		$rememberCheckboxToggle = $('#rememberCheckboxToggle'),
		$resetPasswordButton = $('#resetPasswordButton'),
		$invalidLoginTag = $('#invalidLoginTag'),
		$accountExistsTag = $('#accountExistsTag'),

		// account management
		$accountManagementModal = $('#accountManagement-modal'),
		$clearLocalStorageButton = $('#clearLocalStorage_btn'),
		$deleteAccountButton = $('#deleteAccount_btn'),
		$managementButton = $('#managementButton'),
		$updateAccountButton = $('#updateAccount_btn'),
		$userNameUpdateField = $('#userNameUpdateField'),
		$passwordField = $('#passwordField'),
		$passwordUpdateField = $('#passwordUpdateField'),
		$emailUpdateField = $('#emailUpdateField'),
		$existingPasswordGroup = $accountManagementModal.find('.existingPasswordGroup'),
		$emailGroup = $accountManagementModal.find('.emailGroup'),
		$successAlert = $accountManagementModal.find('.alert-success'),
		$errorAlert = $accountManagementModal.find('.alert-error'),

		// reset password
		$resetpasswordModal = $('#resetpassword-modal'),
		$resetCodeForm = $resetpasswordModal.find('.resetCodeForm'),
		$updatePasswordForm = $resetpasswordModal.find('.updatePasswordForm'),
		$passwordResetCodeContainer = $resetpasswordModal.find('.passwordResetCodeContainer'),
		$passwordResetEmailContainer = $resetpasswordModal.find('.passwordResetEmailContainer'),
		$passwordResetAlertSuccess = $resetpasswordModal.find('.alert-success'),
		$passwordResetAlertError = $resetpasswordModal.find('.alert-error'),

		$resetPasswordEmailField = $('#resetPasswordEmailField'),
		$resetPasswordCodeField = $('#resetPasswordCodeField'),
		$resetPasswordPasswordField = $('#resetPasswordPasswordField'),

		$sendResetCodeButton = $('#sendResetCode_btn'),
		$submitResetCodeButton = $('#submitResetCode_btn'),
		$updatePasswordButton = $('#updatePassword_btn'),

		// loading status
		$loadingStatus = $('#itemResultsContainer').find('.loadingStatus');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SiteView.init = function() {

		SiteView.createEventHandlers();

		// init login form
		initLoginForm();

		$resetpasswordModal.modal({backdrop: true, keyboard: true, show: false});

		// start demo app
		startDemo();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SiteView.createEventHandlers = function() {

		// managementButton: click
		$managementButton.click(function(e) {
			e.preventDefault();
			showAccountManagement();
		});

		// updateAccountButton: click
		$updateAccountButton.click(function(e) {
			e.preventDefault();
			updateAccount();
		});

		// email field: keydown
		$email.on('keydown', function(e) {
			submitForm(e.which);
		});

		// password field: keydown
		$password.on('keydown', function(e) {
			submitForm(e.which);
		});

		// logout button: click
		$logoutButton.click(function(e) {
			e.preventDefault();
			// logout
			logout();
		});

		// clearLocalStorageButton: click
		$clearLocalStorageButton.click(function(e) {
			e.preventDefault();
			Storage.clearStorage();
		});

		// deleteAccountButton: click
		$deleteAccountButton.click(function(e) {
			e.preventDefault();
			deleteAccount();
		});

		// login button: click
		$loginButton.click(function(e) {
			e.preventDefault();
			// login form
			showLoginForm();
		});

		// signup button: click
		$signupButton.click(function(e) {
			e.preventDefault();
			// signup form
			showSignupForm();
		});


		// login submit button: click
		$loginSubmitButton.click(function(e) {
			e.preventDefault();
			// login
			login($email.val(), $password.val());
		});

		// signup submit button: click
		$signupSubmitButton.click(function(e) {
			e.preventDefault();
			// signup
			signup($email.val(), $password.val());
		});

		// back button: click
		$backButton.click(function(e) {
			e.preventDefault();

			showFormNavigation();
		});

		// rememberCheckboxToggle: click
		$rememberCheckboxToggle.click(function(e) {
			if (rememberMe) {
				rememberMe = false;
				$(this).removeClass('on');
				setupRememberMe();
			} else {
				rememberMe = true;
				$(this).addClass('on');
			}
		});

		/* RESET PASSWORD
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// resetPasswordButton: click
		$resetPasswordButton.click(function(e) {
			e.preventDefault();

			// get e-mail storage key
			var email = $email.val() || Storage.getGlobal('email');

			// populate field
			if (email) {
				$resetPasswordEmailField.val(email);
			}

			$resetpasswordModal.modal('show');
		});
		// sendResetCodeButton: click
		$sendResetCodeButton.click(function(e) {
			e.preventDefault();

			// send reset password code
			sendResetPasswordCode($resetPasswordEmailField.val());
		});

		// submitResetCodeButton: click
		$submitResetCodeButton.click(function(e) {
			e.preventDefault();
			// submit reset password code
			submitResetPasswordCode($resetPasswordEmailField.val(), $resetPasswordCodeField.val());
		});

		// updatePasswordButton: click
		$updatePasswordButton.click(function(e) {
			e.preventDefault();
			// update password
			updatePassword($resetPasswordEmailField.val(), $resetPasswordCodeField.val(), $resetPasswordPasswordField.val());
		});

		// resetPasswordEmailField: keydown
		$resetPasswordEmailField.keydown(function(e) {

			if (e.which === 13) {
				e.preventDefault();
				// send reset password code
				sendResetPasswordCode($resetPasswordEmailField.val());
			}
		});

		// resetPasswordCodeField: keydown
		$resetPasswordCodeField.keydown(function(e) {

			if (e.which === 13) {
				e.preventDefault();
				// submit reset password code
				submitResetPasswordCode($resetPasswordEmailField.val(), $resetPasswordCodeField.val());
			}
		});

		// resetPasswordPasswordField: keydown
		$resetPasswordPasswordField.keydown(function(e) {

			if (e.which === 13) {
				e.preventDefault();
				// update password
				updatePassword($resetPasswordEmailField.val(), $resetPasswordCodeField.val(), $resetPasswordPasswordField.val());
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initLoginForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initLoginForm = function() {

		// get e-mail storage key
		var email = Storage.getGlobal('email');

		// populate field
		if (email) {
			rememberMe = true;
			$email.val(email);
			$rememberCheckboxToggle.addClass('on');
			$password.focus();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setupRememberMe -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setupRememberMe = function() {



		if (rememberMe) {
			Storage.setGlobal('email', $email.val());
		} else {
			Storage.removeGlobal('email');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login = function(email, password) {

		resetLoginForm();

		// send login request
		User.login(email, password, login_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetLoginForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetLoginForm = function() {

		$password.val('');

		$invalidLoginTag.hide();
		$accountExistsTag.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startDemo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startDemo = function() {

		// demo login
		User.demoLogin();

		// start user app
		startApp();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startApp - user credentials must be available before calling
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startApp = function() {

		// show loading status
		$loadingStatus.fadeIn();

		// clear view and item data
		ItemView.clearItemView();
		ItemData.resetItemData();

		// returned data
		var itemsReturnedData = null;
		var listReturnedData = null;

		// directory request promise
		var directoryRequest = ItemData.downloadItemDirectory();

		// items request promise
		var itemsRequest = ItemView.initializeUserItems(function(items) {
			itemsReturnedData = items;

		}, function() {
			itemsReturnedData = {};
		});

		// get user tags
		var listRequest = TagView.getTags(function(data) {
			listReturnedData = data;

		}, function() {

		});

		// deferreds: wait for itemsRequest and directoryRequest
		$.when(itemsRequest, directoryRequest, listRequest).then(

			// all ajax requests returned
			function() {

				// list result
				TagView.getTags_result(listReturnedData);

				// itemView result
				ItemView.initializeUserItems_result(itemsReturnedData);

				// hide loading status
				$loadingStatus.hide();
			},
			function() {

			}
		);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* logout -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var logout = function(email, password) {

		// return to info view
		showInfoView();

		// clear view
		ItemView.clearItemView();

		// reset item data
		ItemData.resetItemData();

		// clear user data
		User.logout();

		// start demo app
		startDemo();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* signup -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var signup = function(email, password) {

		resetLoginForm();

		// validate
		if (email !== '' && password !== '') {
			// create user
			User.createUser(email, password, signup_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_result = function(data, email) {

		// success
		if (data.status === 'success') {

			setupRememberMe();

			// show logged in view
			showUseView(email);

			// start user app
			startApp();

		// invalid login
		} else if (typeof data.status !== 'undefined' && data.status === 'invalid_login') {

			// show invalid login tag
			$invalidLoginTag.fadeIn();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* signup_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var signup_result = function(data, email) {

		// returned error status
		if (typeof data.status !== 'undefined' && data.status === 'user_exists') {

			$accountExistsTag.fadeIn();

		// success
		} else {

			setupRememberMe();

			// login new user
			login_result(data, email);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sendResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sendResetPasswordCode = function(email) {

		User.sendResetPasswordCode(email, sendResetPasswordCode_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sendResetPasswordCode_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sendResetPasswordCode_result = function(data) {

		// e-mail sent: success
		if (typeof data.status !== 'undefined' && data.status === 'success') {

			// hide previous buttons
			$sendResetCodeButton.hide();
			$submitResetCodeButton.show();

			// hide email field
			$passwordResetEmailContainer.hide();
			// show code field
			$passwordResetCodeContainer.show();

			// show success alert
			$passwordResetAlertSuccess.find('.alertTitle').text('E-mail sent:');
			$passwordResetAlertSuccess.show().find('.alertText').html('Check your e-mail and enter the <strong>3-digit code</strong> into the field above');

			$passwordResetAlertError.hide();

		// invalid e-mail address
		} else if (typeof data.status !== 'undefined' && data.status === 'invalid_email') {

			// show error alert
			$passwordResetAlertError.find('.alertTitle').text('Invalid E-mail address:');
			$passwordResetAlertError.show().find('.alertText').html('Cannot send password reset code');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var submitResetPasswordCode = function(email, resetCode) {

		User.submitResetPasswordCode(email, resetCode, submitResetPasswordCode_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitResetPasswordCode_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var submitResetPasswordCode_result = function(data) {

		// show update password form
		if (typeof data.status !== 'undefined' && data.status === 'success') {

			// hide previous form and buttons
			$resetCodeForm.hide();
			$submitResetCodeButton.hide();

			// show password form and button
			$updatePasswordForm.show();
			$updatePasswordButton.show();

			// hide success alert
			$passwordResetAlertSuccess.hide();
			$passwordResetAlertError.hide();

		// incorrect code
		} else {

			$passwordResetAlertSuccess.hide();

			// show error alert
			$passwordResetAlertError.find('.alertTitle').text('Invalid code:');
			$passwordResetAlertError.show().find('.alertText').html('Reset code is incorrect, please try again');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updatePassword -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updatePassword = function(email, resetCode, newPassword) {

		User.updatePassword(email, resetCode, newPassword, function(data) {
			updatePassword_result(data, email, newPassword);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updatePassword_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updatePassword_result = function(data, email, newPassword) {

		// show update password form
		if (typeof data.status !== 'undefined' && data.status === 'success') {

			// reset modal
			resetResetPasswordModal();

			// auto populate login info
			$email.val(email);
			$password.val(newPassword);

			// auto login
			login($email.val(), $password.val());
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetResetPasswordModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetResetPasswordModal = function() {

		$resetpasswordModal.modal('hide');

		$sendResetCodeButton.show();
		$submitResetCodeButton.hide();
		$updatePasswordButton.hide();

		$resetCodeForm.show();
		$updatePasswordForm.hide();

		$passwordResetEmailContainer.show();
		$passwordResetCodeContainer.hide();
		$passwordResetAlertSuccess.hide();
		$passwordResetAlertError.hide();

		// clear form fields
		$resetPasswordEmailField.val('');
		$resetPasswordCodeField.val('');
		$resetPasswordPasswordField.val('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showUseView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showUseView = function(email) {

		// set new body class
		$('body').removeClass('infoHeader');
		$('body').addClass('useHeader');

		// set user button
		$loggedInButton.find('.userEmail').text(email);

		// notify views
		ItemView.loggedInView(true);
		SearchView.loggedInView(true);

		// show user menu
		$userMenu.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showInfoView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showInfoView = function() {

		// set new body class
		$('body').removeClass('useHeader');
		$('body').addClass('infoHeader');

		// notify views
		ItemView.loggedInView(false);
		SearchView.loggedInView(false);

		// hide user menu
		$userMenu.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showLoginForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showLoginForm = function() {

		formType = FORM_TYPES.login;

		showForms();

		// show login submit button
		$loginSubmitButton.show();

		// hide signup submit button
		$signupSubmitButton.hide();

		// reposition back button
		$backButton.removeClass('signup');
		$backButton.addClass('login');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSignupForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSignupForm = function() {

		formType = FORM_TYPES.signup;

		showForms();

		// show signup submit button
		$signupSubmitButton.show();

		// hide login submit button
		$loginSubmitButton.hide();

		// reposition back button
		$backButton.removeClass('login');
		$backButton.addClass('signup');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* authenticateUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var authenticateUser = function() {


	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showForms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showForms = function() {

		// show input form
		$loginForm.show();

		// show back button
		$backButton.show();

		if (rememberMe && $email.val() !== '') {
			$password.focus();
		} else {
			$email.focus();
		}


		// hide main form navigation
		$loginButton.hide();
		$signupButton.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showFormNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showFormNavigation = function() {

		// hide input form
		$loginForm.hide();

		// hide submit buttons, back button
		$loginSubmitButton.hide();
		$signupSubmitButton.hide();
		$backButton.hide();

		// show main form navigation
		$loginButton.show();
		$signupButton.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var submitForm = function(key) {

		if (key === 13 && formType === FORM_TYPES.login) {
			login($email.val(), $password.val());

		} else if (key === 13 && formType === FORM_TYPES.signup) {
			signup($email.val(), $password.val());
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showAccountManagement -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showAccountManagement = function(item) {

		resetAccountManagementForm();

		// populate fields
		var userData = User.getUserData();

		$userNameUpdateField.val(userData.userName);
		$emailUpdateField.val(userData.email);

		// show modal
		$accountManagementModal.modal('show');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateAccount -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateAccount = function() {

		resetAccountManagementForm();

		// get field values
		var password = $passwordField.val();
		var email = $emailUpdateField.val();

		// existing password provided
		if (password !== '' && email !== '') {

			var userName = $userNameUpdateField.val();
			var newPassword = $passwordUpdateField.val();

			// send update request
			User.updateUser(password, email, userName, newPassword, function(data) {



				// update success
				if (data.status === 'success') {

					// update user email
					$loggedInButton.find('.userEmail').text(email);
					$passwordField.val('');
					$passwordUpdateField.val('');

					// show alert
					$successAlert.fadeIn().find('.alertText').text('Account updated');

				// password incorrect error
				} else if (data.status === 'incorrect password') {

					$existingPasswordGroup.addClass('error');
					$errorAlert.fadeIn().find('.alertText').text('Incorrect password');
				}

			});
		}

		// no existing password
		if (password === '') {
			// password empty error
			$existingPasswordGroup.addClass('error');
			$errorAlert.fadeIn().find('.alertText').text('Please enter existing password');
		}

		if (email === '') {
			// email empty error
			$emailGroup.addClass('error');
			$errorAlert.fadeIn().find('.alertText').text('E-mail cannot be blank');
		}

		// clear password field
		$passwordUpdateField.val('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteAccount -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteAccount = function() {


	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetAccountManagementForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetAccountManagementForm = function() {

		// reset form
		$successAlert.hide();
		$errorAlert.hide();
		$existingPasswordGroup.removeClass('error');
		$emailGroup.removeClass('error');
	};


})(tmz.module('siteView'), tmz, jQuery, _);

