
// USER
(function(User) {

	// Dependencies
	var Utilities = tmz.module('utilities');
	var List = tmz.module('list');

	var amazonDirectory = {};
	var giantBombDirectory = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: User Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.UserModel = Backbone.Model.extend({

		defaults: {
            userData: {}
        },

        initialize: function() {

        },

        // override parse method
		parse : function(response) {
			parseUserResponse(response);
		},

        // url
		url: function () {
			return tmz.api + 'login/';
		}

	});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: User View
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.UserView = Backbone.View.extend({

        initialize: function() {

            // userData: changed
            this.model.bind('change:userData', this.render, this);
        },

		render: function() {

			// get user lists
			List.getList();

			// get item directory
			Utilities.getItemDirectory(directoryLoaded);

			return this;
		}
	});

	// backbone model
	var user = new User.UserModel();
    // backbone view
    var userView = new User.UserView({model: user});


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.init = function() {

		User.createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.createEventHandlers = function(keywords) {

		/* HEADER
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// login button: click
		$('#login_btn').click(function(e) {

			e.preventDefault();
			console.info('login');

			// send post request
			User.login($('#userLogin_field').val(), $('#password_field').val());
		});
		// create user button: click
		$('#createUser_btn').click(function(e) {
			e.preventDefault();

			$('#createuser-modal').modal('show');

		});

		/* CREATE USER DIALOG
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// create user: click
		$('#newAccount_btn').click(function(e) {

			e.preventDefault();
			var restURL = tmz.api + 'createuser/';

			// get parameters
			var postData = {
				user_login: $('#userNameCreate_field').val(),
				user_password: $('#passwordCreate_field').val(),
				user_email: $('#emailCreate_field').val()
			};

			$.post(restURL, postData, function(data) {
				console.info(data);
				$('#createuser-modal').modal('hide');
			}, "html");


		});
		// cancel create click: click
		$('#newAccount_cancel_btn').click(function() {
			$('#createuser-modal').modal('hide');

		});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.login = function(username, password) {

		var loginData = {
			user_login: username,
			user_password: password
		};

		console.info(loginData);

		// fetch user
		user.fetch({data: loginData, type: 'POST'});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseUserResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseUserResponse = function(response) {

		var tempUserData = {};

		// save user data (session)
		tempUserData.user_id = response.userID;
		tempUserData.secret_key = response.secretKey;

		user.set({'userData': tempUserData});
	};


	/* GETTER/SETTERS
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	// get userData
	User.getUserData = function() {
		return user.get('userData');
	};

	User.getAmazonDirectory = function() {
		return amazonDirectory;
	};

	User.getGiantBombDirectory = function() {
		return giantBombDirectory;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* directoryLoaded
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var directoryLoaded = function(data) {

		itemDirectory = {};

		// restructure directory, set 3rd party IDs as keys
		_.each(data.directory, function(item, itemID) {

			// for each 3RD party directory sets their ID as keys
			if (item.itemAsin !== '0') {
				amazonDirectory[item.itemAsin] = itemID;
			}
			if (item.itemGBombID !== '0') {
				giantBombDirectory[item.itemGBombID] = itemID;
			}

		});
	};

})(tmz.module('user'));
