// SITEVIEW
(function(SiteView) {

    // module references
    var User = tmz.module('user');
    var ItemData = tmz.module('itemData');
	var List = tmz.module('list');
	var ItemView = tmz.module('itemView');

	// constants
	var FORM_TYPES = {'login': 0, 'signup': 1};

	// properties
	var formType = FORM_TYPES.login;

	// data

	// jquery cache
	// header
	$infoHeader = $('#infoHeader');
	$header = $('#header');
	$logoutButton = $('#logoutButton');
	$loggedInButton = $('#loggedInButton');
	$managementButton = $('#managementButton');

	// login/signup
	$loginForm = $('#loginForm');
	$loginButton = $('#loginButton');
	$signupButton = $('#signupButton');
	$backButton = $('#backButton');
	$loginSubmitButton = $('#loginSubmitButton');
	$signupSubmitButton = $('#signupSubmitButton');
	$backButton = $('#backButton');
	$email = $('#email').find('input');
	$password = $('#password').find('input');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SiteView.init = function() {

		SiteView.createEventHandlers();

		// start demo app
		startDemo();
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SiteView.createEventHandlers = function() {

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

		// management button: click
		$managementButton.click(function(e) {
			e.preventDefault();
			// management modal
			showManagementModal();
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

		/* CREATE USER DIALOG
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// create user: click
		$('#newAccount_btn').click(function(e) {


		});
		// cancel create click: click
		$('#newAccount_cancel_btn').click(function() {
			$('#createuser-modal').modal('hide');

		});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login = function(email, password) {

		// send login request
		User.login(email, password, login_result);
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

		// get user lists
		var listRequest = List.getList(function(data) {
			listReturnedData = data;

		}, function() {


		});

		// deferreds: wait for itemsRequest and directoryRequest
		$.when(itemsRequest, directoryRequest, listRequest).then(

			// all ajax requests returned
			function() {

				console.info('all methods returned');

				// list result
				List.getList_result(listReturnedData);

				// itemView result
				ItemView.initializeUserItems_result(itemsReturnedData);
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

		// console.info(email, password);
		// create user
		User.createUser(email, password, signup_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_result = function(data, email) {

		// success
		if (data.userID) {

			// show logged in view
			showLoggedInView(email);

			// start user app
			startApp();

		// failed
		} else {

		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* signup_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var signup_result = function(data, email) {

		// returned error status
		if (typeof data.status !== 'undefined') {

			if (data.status === 'user_exists') {
				// console.info('user exists');
			}

		// success
		} else {
			// login new user
			login_result(data, email);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showLoggedInView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showLoggedInView = function(email) {

		// set new body class
		$('body').removeClass('infoHeader');
		$('body').addClass('useHeader');

		// set user button
		$loggedInButton.find('.userEmail').text(email);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showInfoView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showInfoView = function() {

		// set new body class
		$('body').removeClass('useHeader');
		$('body').addClass('infoHeader');
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

		// focus email field
		$email.focus();

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

})(tmz.module('siteView'));

