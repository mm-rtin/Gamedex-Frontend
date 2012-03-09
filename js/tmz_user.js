
// USER
(function(User) {

	// Dependencies
	var Utilities = tmz.module('utilities');
	var List = tmz.module('list');
	var ItemData = tmz.module('itemData');
	var ItemView = tmz.module('itemView');

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

		// debug login
		User.login('1', '1');

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
			// // // console.info('login');

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
				// // // console.info(data);
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

		// // // console.info(loginData);

		// login user
		user.fetch({data: loginData, type: 'POST', success: login_result});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_result = function(model, data) {

		if (data.userID) {
			// get user lists
			List.getList();

			// get item directory
			ItemData.getItemDirectory(function() {

				// init ItemView for logged in user after item directory loaded
				ItemView.userLoggedIn();
			});


		} else {
			// // // console.info('incorrect login');
		}
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

})(tmz.module('user'));
