(function ($) {

    // properties
    var pluginName = 'BootstrapDropdownSubMenu',
        defaults = {
            propertyName: "value"
        };

    var $subNav = null,
        $mainNav = null,
        showTimeout = null,
        hideTimeout = null;

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * BDSM - Bootstrap Dropdown Sub Menu
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function BDSM(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * intialize
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    BDSM.prototype.init = function () {

        // create events
        this.createEventHandlers($(this.element), this.options.$mainNav);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    BDSM.prototype.createEventHandlers = function ($subNav, $mainNav) {

        // mainNav root items: hover
        $mainNav.find('li:not(.dropdown-sub li) a').hover(function(e) {

            // cancel show
            clearTimeout(showTimeout);
            showTimeout = null;

            // create timeout if not already defined
            if (!hideTimeout) {

                // delay before hiding subnav
                hideTimeout = setTimeout(function() {
                    $subNav.removeClass('active');
                }, 500);
            }
        });

        // subNav: hover
        $subNav.hover(function(e) {
            // cancel hide
            clearTimeout(hideTimeout);
            hideTimeout = null;

            // create timeout if not already defined
            if (!showTimeout) {
                // delay before showing subnav
                showTimeout = setTimeout(function() {
                    $subNav.addClass('active');
                }, 500);
            }
        });

        // subNav: click
        $subNav.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            $subNav.addClass('active');
        });

        // subNav items: hover
        $subNav.find('li a').hover(function(e) {

            // cancel hide
            clearTimeout(hideTimeout);
            hideTimeout = null;
        });

        // subNav items: click
        $subNav.find('li a').click(function(e) {
            $mainNav.removeClass('open');
        });

        // dropdown-toggle: click
        $mainNav.find('.dropdown-toggle').click(function(e) {
            $subNav.removeClass('active');
        });

    };

    // create jQuery plugin - prevent multiple instantiation
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new BDSM(this, options));
            }
        });
    };

})( jQuery);

// TMZ namespace
var tmz = {
 // Create this closure to contain the cached modules
 module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an existing module.
    return function(name) {

      // return previously created module
      if (modules[name]) {
        return modules[name];
      }

      // create module - return module template to be extended by module
      return modules[name] = {};
    };
  }()
};

// set application properties
tmz.api = '/';


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initialize
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initialize = function() {

	// 3rd party libaries
	tmz.initializeLibraries();

	// event handling
	tmz.initializeModules();
};

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initializeLibraries
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initializeLibraries = function() {

	// moment.js calendar config
	moment.calendar = {
		lastDay : 'LL', //'[Yesterday]',
		sameDay : 'LL', //'[Today]',
		nextDay : 'LL', //'[Tomorrow]',
		lastWeek : 'LL', //'[last] dddd',
		nextWeek : 'LL', //'dddd',
		sameElse : 'LL'
	};

	// moment.js long date format
    moment.longDateFormat = {
		L: 'MM/DD/YYYY',
		LL: 'MMMM D, YYYY',
		LLL: 'MMMM D YYYY h:mm A',
		LLLL: 'dddd, MMMM D YYYY h:mm A'
    };
};

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initializeModules
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initializeModules = function() {

	// module references
    var itemData = tmz.module('itemData'),
        searchView = tmz.module('searchView'),
		detailView = tmz.module('detailView'),
		itemView = tmz.module('itemView'),
		tagView = tmz.module('tagView'),
		gridView = tmz.module('gridView'),
		filterPanel = tmz.module('filterPanel'),
        videoPanel = tmz.module('videoPanel'),
		importView = tmz.module('importView'),
		siteView = tmz.module('siteView');

	// initialize modules
    itemData.init();
	searchView.init();
	detailView.init();
	itemView.init();
	tagView.init();
	gridView.init();
	filterPanel.init();
    videoPanel.init();
	importView.init();
	siteView.init();
};


// UTILITIES
(function(Utilities, tmz, $, _) {
	"use strict";

	// Dependencies
	var User = tmz.module('user'),

		// amazon nodes, possible platform names and standard name link table
		PLATFORM_INDEX = [
			{'id': 'all', 'gt': '', 'ign': '', 'gamestats': '', 'amazon': 0, alias: 'all'},
			{'id': 'pc', 'gt': 'pc', 'ign': 'pc', 'gamestats': 'pc', 'amazon': 229575, alias: 'pc,windows', name: 'PC'},
			{'id': 'mac', 'gt': '', 'ign': '', 'gamestats': 'pc', 'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
			{'id': 'xbox', 'gt': '', 'ign': '', 'gamestats': 'xbox', 'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
			{'id': 'x360', 'gt': 'xbox 360', 'ign': 'x360', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'x360,xbox 360,microsoft xbox360,360', name: 'X360'},
			{'id': 'xbl', 'gt': 'xbla', 'ign': 'x360&downloadType=1', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'xbl,xbox live', name: 'XBL'},
			{'id': 'ds', 'gt': 'ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 11075831, alias: 'ds,nintendo ds', name: 'DS'},
			{'id': '3ds', 'gt': '3ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 2622269011,alias: '3ds,nintendo 3ds', name: '3DS'},
			{'id': 'wii', 'gt': 'wii', 'ign': 'wii', 'gamestats': 'wii', 'amazon': 14218901, alias: 'wii,nintendo wii', name: 'Wii'},
			{'id': 'ps', 'gt': '', 'ign': '', 'gamestats': 'playstation', 'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'PS1'},
			{'id': 'ps2', 'gt': '', 'ign': '', 'gamestats': 'playstation-2', 'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'PS2'},
			{'id': 'ps3', 'gt': 'ps3', 'ign': 'ps3', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PS3'},
			{'id': 'psn', 'gt': '', 'ign': 'ps3&downloadType=201', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'psn,playstation network', name: 'PSN'},
			{'id': 'vita', 'gt': 'vita', 'ign': 'ps-vita', 'gamestats': 'playstation-3', 'amazon': 3010556011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'Vita'},
			{'id': 'psp', 'gt': '', 'ign': '', 'gamestats': 'playstation-portable', 'amazon': 11075221, alias: 'psp,sony psp', name: 'PSP'},
			{'id': 'gc', 'gt': '', 'ign': '', 'gamestats': 'gamecube', 'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
			{'id': 'n64', 'gt': '', 'ign': '', 'gamestats': 'nintendo-64', 'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'N64'},
			{'id': 'nes', 'gt': '', 'ign': '', 'gamestats': 'nes', 'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
			{'id': 'snes', 'gt': '', 'ign': '', 'gamestats': 'super-nes', 'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
			{'id': 'gba', 'gt': '', 'ign': '', 'gamestats': 'gameboy-advance', 'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
			{'id': 'gb', 'gt': '', 'ign': '', 'gamestats': 'game-boy', 'amazon': 541020, alias: 'gba,gameboy advance,game boy,advance,gbadvance', name: 'GBA'},
			{'id': 'gbc', 'gt': '', 'ign': '', 'gamestats': 'game-boy-color', 'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'GBC'},
			{'id': 'dc', 'gt': '', 'ign': '', 'gamestats': 'dreamcast', 'amazon': 229793, alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Dreamcast'},
			{'id': 'saturn', 'gt': '', 'ign': '', 'gamestats': 'saturn', 'amazon': 294944, alias: 'saturn,sega saturn', name: 'Saturn'},
			{'id': 'genesis', 'gt': '', 'ign': '', 'gamestats': 'genesis', 'amazon': 294943, alias: 'genesis,sega genesis', name: 'Genesis'},
			{'id': 'gamegear', 'gt': '', 'ign': '', 'gamestats': 'game-gear', 'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Gamegear'},
			{'id': 'segacd', 'gt': '', 'ign': '', 'gamestats': 'sega-cd', 'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
		],

		// constants
		SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1},
		VIEW_ALL_TAG_ID = '0',

		// 3RD PARTY IMAGE PREFIX
		AMAZON_IMAGE = {'URL': 'http://ecx.images-amazon.com/images', 'RE': /http:\/\/ecx\.images-amazon\.com\/images/gi, 'TOKEN': '~1~'},
		GIANTBOMB_IMAGE = {'URL': 'http://media.giantbomb.com/uploads', 'RE': /http:\/\/media\.giantbomb\.com\/uploads/gi, 'TOKEN': '~1~'};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStandardPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStandardPlatform = function(platformName) {

		var re = new RegExp(platformName, 'gi');

		for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {
			if (re.test(PLATFORM_INDEX[i].alias)) {
				return PLATFORM_INDEX[i];
			}
		}
		return PLATFORM_INDEX[0];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* matchPlatformToIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var matchPlatformToIndex = function(platformName) {

		var re = null;
		var aliasArray = [];
		var bestMatch = null;
		var originalTextLength = platformName.length;
		var bestMatchLength = 0;
		var currentMatch = null;

		// reverse lookup - make regex of each platform index alias and match with platformName
		for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {

			aliasArray = PLATFORM_INDEX[i].alias.split(',');

			for (var j = 0, aliasLen = aliasArray.length; j < aliasLen; j++) {

				re = new RegExp(aliasArray[j], 'gi');
				currentMatch = re.exec(platformName);

				if (currentMatch && currentMatch[0].length === originalTextLength) {

					return PLATFORM_INDEX[i];

				} else if (currentMatch && currentMatch[0].length > bestMatchLength) {

					bestMatchLength = currentMatch[0].length;
					bestMatch = PLATFORM_INDEX[i];
				}
			}
		}

		if (bestMatch) {
			return bestMatch;
		}

		return PLATFORM_INDEX[0];
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'PLATFORM_INDEX': PLATFORM_INDEX,
        'SEARCH_PROVIDERS': SEARCH_PROVIDERS,
        'VIEW_ALL_TAG_ID': VIEW_ALL_TAG_ID,
        'AMAZON_IMAGE': AMAZON_IMAGE,
        'GIANTBOMB_IMAGE': GIANTBOMB_IMAGE,
        'getStandardPlatform': getStandardPlatform,
        'matchPlatformToIndex': matchPlatformToIndex
    };

    $.extend(Utilities, publicMethods);

})(tmz.module('utilities'), tmz, jQuery, _);


// USER
(function(User, tmz, $, _) {
	"use strict";

	// Dependencies
	var Utilities = tmz.module('utilities'),
		Storage = tmz.module('storage'),
		ItemView = tmz.module('itemView'),
		ItemCache = tmz.module('itemCache'),

		// constants
		USER_LOGIN_URL = tmz.api + 'user/login/',
		USER_LOGOUT_URL = tmz.api + 'user/logout/',
		USER_VIEW_URL = tmz.api + 'user/',
		USER_CREATE_URL = tmz.api + 'user/create/',
		USER_UPDATE_URL = tmz.api + 'user/update/',
		USER_SEND_RESET_CODE_URL = tmz.api + 'user/resetcode/send/',
		USER_SUBMIT_RESET_CODE_URL = tmz.api + 'user/resetcode/submit/',
		USER_UPDATE_PASSWORD_URL = tmz.api + 'user/password/update/',

		// data
		userData = {'user_id': '', 'secret_key': '', 'viewUser': null},

		// demo account
		demoUser = {'user_id': '1', 'secret_key': '1'};


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
				login_success(data, email);
				onSuccess(data, email);
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
	User.logout = function(email, password, onSuccess) {

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

			// compare timestamps - if different form localstorage value: clear item local storage data
			var localTimestamp = Storage.get('timestamp');

			// if no localtimestamp in storage set new timestamp from data
			if (!localTimestamp) {
				Storage.set('timestamp', data.timestamp);

			// compare timestamps
			} else if (data.timestamp != localTimestamp) {
				ItemCache.clearStoredData();
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

})(tmz.module('user'), tmz, jQuery, _);

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


// ItemData
(function(ItemData, tmz, $, _, moment) {
	"use strict";

	// Dependencies
	var User = tmz.module('user'),
		ItemLinker = tmz.module('itemLinker'),
		ItemCache = tmz.module('itemCache'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),

		// REST URLS
		ITEM_DIRECTORY_URL = tmz.api + 'item/directory/',
		ITEM_URL = tmz.api + 'item/',
		ITEM_ADD_URL = tmz.api + 'item/add/',
		ITEM_BATCH_DELETE_URL = tmz.api + 'item/delete/batch/',
		ITEM_SINGLE_DELETE_URL = tmz.api + 'item/delete/',
		ITEM_USER_UPDATE = tmz.api + 'item/user/update/',
		ITEM_SHARED_UPDATE = tmz.api + 'item/shared/update/',
		UPDATE_METACRITIC_URL = tmz.api + 'item/metacritic/update/',
		IMPORT_GAMES_URL = tmz.api + 'import/',

		// constants
		VIEW_ALL_TAG_ID = Utilities.VIEW_ALL_TAG_ID,

		// full item detail results for last viewed tag:
		// alias of itemsCacheByTag[tagID]
		// key by ID
		items = {},

		// basic item framework - loaded before item details
		// all directories share item data
		// key by itemID = contains tags for each itemID
		itemDataDirectory = {},

		// key 3RD party ID
		amazonDirectory = {},
		giantBombDirectory = {};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var init = function() {

		$(document).keypress(function(e) {
			if (e.which == 96) {
				console.warn('------------ itemDataDirectory: -------', itemDataDirectory);
				console.warn('------------ amazonDirectory: -------', amazonDirectory);
				console.warn('------------ giantBombDirectory: -------', giantBombDirectory);
				console.warn('------------ items: -------------------', items);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemsAndDirectoryLoaded -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemsAndDirectoryLoaded = function(items) {

		ItemCache.cacheItemsByTag(items, itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadItemDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var downloadItemDirectory = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserCredentials();

		// check local storage
		var itemDirectory = ItemCache.getStoredItemDirectory();

		if (itemDirectory) {

			storedItemDirectory_result(itemDirectory);
			if (onSuccess) {
				onSuccess(itemDirectory);
			}

		// download directory data
		} else {

			var requestData = {};
			$.extend(true, requestData, userData);

			ajax = $.ajax({
				url: ITEM_DIRECTORY_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					downloadedItemDirectory_result(data);

					// store finished directory
					ItemCache.storeItemDirectory(itemDataDirectory);

					if (onSuccess) {
						onSuccess(data);
					}
				},
				error: function(data) {
				}
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadedItemDirectory_result - run after a itemDirectory downloaded through AJAX
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var downloadedItemDirectory_result = function(data) {

		var directoryItem = {};

		// create new directory, set 3rd party IDs as keys
		_.each(data.directory, function(item, itemID) {

			directoryItem = {
				// add itemID to directoryItem
				itemID: itemID,
				asin: item.aid,
				gbombID: item.gid,
				gameStatus: item.gs,
				playStatus: item.ps,
				tags: item.t,
				tagCount: item.tc,
				userRating: item.ur
			};

			// for each 3RD party directory sets their ID as keys
			addItemToDirectories(directoryItem);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storedItemDirectory_result - run after itemDirectory loaded through localStorage
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storedItemDirectory_result = function(itemDirectory) {

		var directoryItem = {};

		// create new directory, set 3rd party IDs as keys
		_.each(itemDirectory, function(item) {

			// for each 3RD party directory sets their ID as keys
			addItemToDirectories(item);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(tagID, onSuccess, onError) {

		var ajax = null;

		// find in itemsCacheByTag first
		var cachedItems = ItemCache.getCachedItemsByTag(tagID);

		// load cached items offer
		if (cachedItems) {

			// assign as new current items data
			items = cachedItems;

			// return updated source item
			onSuccess(cachedItems);

		// get new items data
		} else {

			var requestData = {
				list_id: tagID
			};

			var userData = User.getUserCredentials();
			$.extend(true, requestData, userData);

			ajax = $.ajax({
				url: ITEM_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					// parse results and assign as new items data
					items = parseItemResults(data);

					// return data to callee
					onSuccess(items);
				},
				error: onError
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseItemResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseItemResults = function(itemResults) {

		// temp item data
		var tempItems = {};
		var item = {};

		var itemLength = 0;
		var calendarDate = null;

		// iterate itemResults
		for (var i = 0, len = itemResults.items.length; i < len; i++) {

			item = {};

			var initialProvider = itemResults.items[i].ip;
			var imageBaseURL = itemResults.items[i].ib || '';

			// add image base url and add media provider url prefix
			var smallImage = addImageURLPrefix(itemResults.items[i].si, imageBaseURL, initialProvider);
			var thumbnailImage = addImageURLPrefix(itemResults.items[i].ti, imageBaseURL, initialProvider);
			var largeImage = addImageURLPrefix(itemResults.items[i].li, imageBaseURL, initialProvider);

			// get attributes
			item.id = itemResults.items[i].iid;
			item.initialProvider = itemResults.items[i].ip;
			item.itemID = itemResults.items[i].iid;
			item.asin = itemResults.items[i].aid;
			item.gbombID = itemResults.items[i].gid;

			item.name = itemResults.items[i].n;
			item.releaseDate = itemResults.items[i].rd;
			item.platform = itemResults.items[i].p;
			item.smallImage = smallImage;
			item.thumbnailImage = thumbnailImage;
			item.largeImage = largeImage;
			item.metascore = itemResults.items[i].ms;
			item.metascorePage = itemResults.items[i].mp;
			item.offers = {};

			item.description = '';

			// add custom formated properties
			addCustomProperties(item);

			// add to lists objects
			tempItems[item.itemID] = item;
		}

		return tempItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItem = function(id) {
		return items[id];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags = function(tagIDs, sourceItem, onSuccess, onError) {

		var ajax = null;

		var userData = User.getUserCredentials(true);

		// clone sourceItem as new object
		var item = $.extend(true, {}, sourceItem);

		// shorten image url
		var smallImage = getShortImageURL(item.smallImage, item.initialProvider);
		var thumbnailImage = getShortImageURL(item.thumbnailImage, item.initialProvider);
		var largeImage = getShortImageURL(item.largeImage, item.initialProvider);

		var s1 = smallImage.split('');
		var s2 = thumbnailImage.split('');
		var s3 = largeImage.split('');

		// get base url for all 3 images (common starting substring)
		var lastCommonIndex = findCommonSubstringIndex(s1, s2, s3);

		// remove common substring from images
		var imageBaseURL = s1.slice(0, lastCommonIndex).join('');
		smallImage = s1.slice(lastCommonIndex).join('');
		thumbnailImage = s2.slice(lastCommonIndex).join('');
		largeImage = s3.slice(lastCommonIndex).join('');

		// request data
		var requestData = {
			'lids': tagIDs,

			'n': item.name,
			'rd': item.releaseDate,
			'aid': item.asin,
			'gid': item.gbombID,
			'ip': item.initialProvider,
			'p': item.platform,

			'ib': imageBaseURL,
			'si': smallImage,
			'ti': thumbnailImage,
			'li': largeImage,

			'mp': item.metascorePage,
			'ms': item.metascore,

			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};
		$.extend(true, requestData, userData);

		ajax = $.ajax({
					url: ITEM_ADD_URL,
					type: 'POST',
					data: requestData,
					dataType: 'json',
					cache: true,
					success: function(data) {

						// update sourceItem with returned data
						sourceItem.id = data.itemID;
						sourceItem.itemID = data.itemID;

						// add client item
						var addedItems = addClientItem(sourceItem, data);

						// update tagView initialItemTags
						TagView.updateInitialItemTags(data.tagIDsAdded, data.idsAdded);

						// callback
						onSuccess(data, addedItems);
					},
					error: onError
				});

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findCommonSubstringIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findCommonSubstringIndex = function(s1, s2, s3) {

		var lastCommonIndex = 0;
		var commonString = '';

		// step through each index of 3 string arrays
		for (var i = 0, len = s1.length; i < len; i++) {

			if (s1[i] === s2[i] && s1[i] === s3[i]) {
				lastCommonIndex = i;
			} else {
				break;
			}
		}

		return lastCommonIndex + 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getShortImageURL - shortens media url for common amazon or giantbomb image urls
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getShortImageURL = function(url, initialProvider) {

		var outURL = url;

		// find common prefix and return shortened version
		// amazon media url
		if (initialProvider === Utilities.SEARCH_PROVIDERS.Amazon) {
			outURL = url.replace(Utilities.AMAZON_IMAGE.RE, Utilities.AMAZON_IMAGE.TOKEN);

		// giantbomb media url
		} else if (initialProvider === Utilities.SEARCH_PROVIDERS.GiantBomb) {
			outURL = url.replace(Utilities.GIANTBOMB_IMAGE.RE, Utilities.GIANTBOMB_IMAGE.TOKEN);
		}

		return outURL;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImageURLPrefix - add provider specific prefix to image url
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImageURLPrefix = function(url, imageBaseURL, initialProvider) {

		var outURL = url;
		var re = null;

		// prepend image base url
		url = imageBaseURL + url;

		// find common prefix and return shortened version
		// amazon media url
		if (initialProvider == Utilities.SEARCH_PROVIDERS.Amazon) {
			re = new RegExp(Utilities.AMAZON_IMAGE.TOKEN, 'g');
			outURL = url.replace(re, Utilities.AMAZON_IMAGE.URL);

		// giantbomb media url
		} else if (initialProvider == Utilities.SEARCH_PROVIDERS.GiantBomb) {
			re = new RegExp(Utilities.GIANTBOMB_IMAGE.TOKEN, 'g');
			outURL = url.replace(re, Utilities.GIANTBOMB_IMAGE.URL);
		}

		return outURL;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem = function(deletedIDs, deletedTagIDs, currentItem, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'ids': deletedIDs
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_BATCH_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

			},
			error: onError
		});

		// delete 1 or more tags from item
		batchTagDelete(currentItem.itemID, deletedIDs, deletedTagIDs);

		onSuccess(currentItem.itemID, deletedTagIDs);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* batchTagDelete -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var batchTagDelete = function(itemID, deletedIDs, deletedTagIDs) {

		// iterate delete tagIDs
		for (var i = 0, len = deletedIDs.length; i < len; i++) {

			// delete item for tag
			deleteClientItem(deletedTagIDs[i], itemID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteSingleTagForItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteSingleTagForItem = function(itemID, tagID, onSuccess, onError) {

		// get itemTagID
		var id = getDirectoryItemByItemID(itemID).tags[tagID];

		var userData = User.getUserCredentials(true);

		var requestData = {
			'id': id
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_SINGLE_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
			},
			error: onError
		});

		// delete client item
		deleteClientItem(tagID, itemID);

		onSuccess(id, tagID);

		return itemID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItem = function(currentItem, onSuccess, onError) {

		// get tags for itemID
		var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'aid': item.asin,
			'gid': item.gbombID,

			'rd': item.releaseDate,
			'si': item.smallImage,
			'ti': item.thumbnailImage,
			'li': item.largeImage
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_SHARED_UPDATE,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateItemData(item, itemTags);
				onSuccess(item, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItem = function(currentItem, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_USER_UPDATE,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateUserItemData(item);
				onSuccess(item, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateMetacritic
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateMetacritic = function(currentItem, onSuccess, onError) {

		console.info(currentItem);

		// get tags for itemID
		var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'mp': item.metascorePage,
			'ms': item.metascore
		};
		$.extend(true, requestData, userData);

		// push update to item cache
		updateItemData(item, itemTags);

		$.ajax({
			url: UPDATE_METACRITIC_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				if(onSuccess) {
					onSuccess(item, data);
				}
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addClientItem = function(item, data) {

		// cached items
		var viewAllCachedItems = null;
		var newItem = null;
		var addedItems = [];

		// update item with itemID
		item.itemID = data.itemID;

		// update ids -  idsAdded[], tagIDsAdded[]
		// each idsAdded index matches with its tagIDAddeds index
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// clone item
			newItem = $.extend(true, {}, item);

			// update item with new id
			newItem.id = data.itemID;

			// add custom formated properties
			addCustomProperties(newItem);

			// cache new item by tag
			ItemCache.cacheItemByTag(data.tagIDsAdded[i], newItem);

			// item added
			addedItems.push(newItem);
		}

		// add to directory
		addItemDataToDirectory(newItem, data);

		// add last item to 'view all' list (id: 0) cache if exists and itemID does not exist in all items cache
		viewAllCachedItems = ItemCache.getCachedItemsByTag(VIEW_ALL_TAG_ID);

		var itemIDExists = false;
		_.each(viewAllCachedItems, function(item, key) {
			if (item.itemID === newItem.itemID) {
				itemIDExists = true;
			}
		});
		// is unique: add item to 'view all' list
		if (!itemIDExists) {

			// add item to view all cache
			ItemCache.cacheItemByTag(VIEW_ALL_TAG_ID, newItem);
		}

		return addedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteClientItem = function(tagID, itemID) {

		// delete item by id from cache by tagID
		ItemCache.deleteCachedItem(itemID, tagID);

		// delete tag from directory
		deleteTagFromDirectory(itemID, tagID);

		// last tag for item, remove from 'view all' list
		if (itemDataDirectory[itemID].tagCount === 0) {

			// update cached items
			ItemCache.deleteCachedItem(itemID, VIEW_ALL_TAG_ID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addCustomProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addCustomProperties = function(item) {

		// add formatted calendarDate
		if (item.releaseDate !== '1900-01-01') {
			item.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
		} else {
			item.calendarDate = 'Unknown';
		}
		// add standard name propery
		item.standardName = ItemLinker.standardizeTitle(item.name);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItemData - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItemData = function(item) {

		var directoryItem = itemDataDirectory[item.itemID];

		// update directoryItem properties
		directoryItem.gameStatus = item.gameStatus;
		directoryItem.playStatus = item.playStatus;
		directoryItem.userRating = item.userRating;

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItemData = function(item, itemTags) {

		// update itemCache and item local storage for each tag
		_.each(itemTags, function(id, tagID) {

			ItemCache.updateCacheItemByTag(tagID, item);
		});

		// update 'view all' tag cache
		ItemCache.updateCacheItemByTag(0, item);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemDataToDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemDataToDirectory = function(item, data) {

		// if itemID doesn't exist in directory
		if (!itemDataDirectory[data.itemID]) {

			// add to tag directory
			var directoryItem = {
				itemID: item.itemID,
				asin: item.asin,
				gbombID: item.gbombID,
				gameStatus: item.gameStatus,
				playStatus: item.playStatus,
				tags: {},
				tagCount: 0,
				userRating: item.userRating
			};

			// add to 3rd party directory
			addItemToDirectories(directoryItem);
		}

		// update tag information in directories
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// add tag
			itemDataDirectory[data.itemID].tags[data.tagIDsAdded[i]] = data.idsAdded[i];
			// increment tagCount
			itemDataDirectory[data.itemID].tagCount += 1;
		}

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagFromDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagFromDirectory = function(itemID, tagID) {

		var item = itemDataDirectory[itemID];

		// remove tag from item - will also remove from 3rd party directories
		delete item.tags[tagID];

		// decrement tagCount
		item.tagCount += -1;

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToDirectories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToDirectories = function(item) {

		// itemID directory
		itemDataDirectory[item.itemID] = item;

		// amazon
		if (parseInt(item.asin, 10) !== 0) {
			amazonDirectory[item.asin] = item;
		}
		// giant bomb
		if (parseInt(item.gbombID, 10) !== 0) {
			giantBombDirectory[item.gbombID] = item;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemDirectory = function() {
		return itemDataDirectory;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getDirectoryItemByItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getDirectoryItemByItemID = function(itemID) {

		// return item or empty object
		return itemDataDirectory[itemID] || null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemByThirdPartyID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemByThirdPartyID = function(gbombID, asin) {

		// itemID from directory
		var item = null;

		// select appropriate 3rd party item directory
		if (gbombID !== 0) {
			item = giantBombDirectory[gbombID];

		} else if (asin !== 0) {
			item = amazonDirectory[asin];
		}

		return item;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetItemData = function() {

		items = {};
		itemDataDirectory = {};
		amazonDirectory = {};
		giantBombDirectory = {};

		// clear cache
		ItemCache.clearItemCache();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getRandomItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getRandomItemID = function() {

		var idList = [];

		// add ids to idList
		_.each(items, function(item, key) {
			idList.push(key);
		});

		// get random number between 0 and idList.length
		var randomIndex = Math.floor(Math.random() * idList.length);

		return idList[randomIndex];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importGames = function(source, sourceUser, onSuccess) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'source': source,
			'source_user': sourceUser
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: IMPORT_GAMES_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: function(data) {

			}
		});
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'init': init,
		'itemsAndDirectoryLoaded': itemsAndDirectoryLoaded,
		'getItemDirectory': getItemDirectory,
		'getDirectoryItemByItemID': getDirectoryItemByItemID,
		'getItemByThirdPartyID': getItemByThirdPartyID,
		'resetItemData': resetItemData,
		'getRandomItemID': getRandomItemID,
		'getItems': getItems,
		'getItem': getItem,
		'downloadItemDirectory': downloadItemDirectory,
		'addItemToTags': addItemToTags,
		'updateUserItem': updateUserItem,
		'updateMetacritic': updateMetacritic,
		'deleteTagsForItem': deleteTagsForItem,
		'deleteSingleTagForItem': deleteSingleTagForItem,
		'deleteTagFromDirectory': deleteTagFromDirectory,
		'deleteClientItem': deleteClientItem,
		'importGames': importGames
	};

	$.extend(ItemData, publicMethods);

})(tmz.module('itemData'), tmz, $, _, moment);


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* TAG DATA - methods for interacting with server side tag data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
		ItemData = tmz.module('itemData'),

		// local represenation of localStorage data model
		storedTags = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTags - return tags for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.getTags = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserCredentials();

		var requestData = {};
		$.extend(true, requestData, userData);

		// check local storage
		storedTags = Storage.get('tag');

		if (storedTags) {

			if (onSuccess) {
				onSuccess(storedTags);
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

					// store tag data
					storedTags = Storage.set('tag', data.list);
					onSuccess(data.list);
				},
				error: onError
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTag - create new tag for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.addTag = function(tagName, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'tag_name': tagName
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_ADD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// add response to stored tag internal model
				storedTags.push({'tagName': data.tagName.toLowerCase(), 'tagID': data.tagID});

				// update local storage with store tag model
				Storage.set('tag', storedTags);
				onSuccess(data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag - update tag name for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.updateTag = function(tagName, tagID, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'tag_name': tagName,
			'tag_id': tagID
		};
		$.extend(true, requestData, userData);

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

		// update tag in storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].tagID === tagID) {

				// update name
				storedTags[i].tagName = tagName;

				// update local storage with stored tag model
				Storage.set('tag', storedTags);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag - delete users tag
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.deleteTag = function(tagID, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		// delete tag
		var requestData = {
			'id': tagID
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});

		// delete tag item from storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].tagID === tagID) {

				storedTags.splice(i, 1);

				// update local storage with stored tag model
				Storage.set('tag', storedTags);

				break;
			}
		}
	};


})(tmz.module('tagData'), tmz, jQuery, _);


// ItemCache
(function(ItemCache, tmz, $, _) {
	"use strict";

	// Dependencies
	var User = tmz.module('user'),
		Storage = tmz.module('storage'),
		Utilities = tmz.module('utilities'),

		// constants
		VIEW_ALL_TAG_ID = Utilities.VIEW_ALL_TAG_ID,

		// data

		// items cached by tagID
		itemsCacheByTag = {},

		// tagIDs which have been retrieved from local storage
		storedItems = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItemsByTag = function(tagID) {

		var cachedItems = null;

		// check memory (session)
		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			cachedItems = itemsCacheByTag[tagID];

		// check local storage (long term)
		} else {
			cachedItems = getStoredItemsByTag(tagID);
		}

		return cachedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cacheItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cacheItemsByTag = function(items, itemDataDirectory) {

		// iterate items
		_.each(items, function(item, id) {

			// check if itemID is in data directory
			if (typeof itemDataDirectory[item.itemID] !== 'undefined') {

				// get item in itemDataDirectory and iterate tags
				_.each(itemDataDirectory[item.itemID].tags, function(id, tagID) {

					// cache item by tag
					cacheItemByTag(tagID, item);

					// add item to view all cache
					cacheItemByTag(VIEW_ALL_TAG_ID, item);
				});
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cacheItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cacheItemByTag = function(tagID, item) {

		// cache item by tag
		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			itemsCacheByTag[tagID][item.itemID] = item;

		} else {
			itemsCacheByTag[tagID] = {};
			itemsCacheByTag[tagID][item.itemID] = item;
		}

		// add to local storage
		storeItemByTag(tagID, item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateCacheItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateCacheItemByTag = function(tagID, item) {

		// update cache
		itemsCacheByTag[tagID][item.itemID] = item;

		// update local storage
		storeItemByTag(tagID, item, true);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStoredItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStoredItemDirectory = function() {

		return Storage.get('itemDataDirectory');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storeItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storeItemDirectory = function(data) {

		Storage.set('itemDataDirectory', data);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storeItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storeItemByTag = function(tagID, item, updateStorage) {

		// skip storage if itemID was retrieved from local storage
		if (typeof storedItems[tagID + '_' + item.itemID] === 'undefined' || updateStorage) {

			// get stored items by tag
			var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

			// key exists
			if (storedItemsCacheByTag) {

				// tag exists
				if (typeof storedItemsCacheByTag[tagID] !== 'undefined') {

					// add item to retrieved storage object
					storedItemsCacheByTag[tagID][item.itemID] = item;

				// create tag object
				} else {

					storedItemsCacheByTag[tagID] = {};
					storedItemsCacheByTag[tagID][item.itemID] = item;
				}

			// new storage key: storedItemsCacheByTag
			} else {

				// create fresh object
				storedItemsCacheByTag = {};
				storedItemsCacheByTag[tagID] = {};
				storedItemsCacheByTag[tagID][item.itemID] = item;
			}

			// store user object as string back into userID key
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteCachedItem = function(itemID, tagID) {

		if (itemsCacheByTag[tagID]) {
			delete itemsCacheByTag[tagID][itemID];
		}

		deleteStoredItem(itemID, tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteCachedTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteCachedTag = function(tagID) {

		if (itemsCacheByTag[tagID]) {
			delete itemsCacheByTag[tagID];
		}

		deleteStoredTag(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteStoredTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteStoredTag = function(tagID) {

		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

		// found stored item: delete tagID in item cache
		if (storedItemsCacheByTag) {
			delete storedItemsCacheByTag[tagID];
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteStoredItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteStoredItem = function(itemID, tagID) {

		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

		// found stored item: delete tagID, itemID in item cache
		if (storedItemsCacheByTag) {
			delete storedItemsCacheByTag[tagID][itemID];
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStoredItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStoredItemsByTag = function(tagID) {

		// get local storage object
		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');
		var storedTag = null;

		if (storedItemsCacheByTag) {

			// if tag found in user object
			if (typeof storedItemsCacheByTag[tagID] !== 'undefined') {

				storedTag = storedItemsCacheByTag[tagID];

				// save item id as being retrieved from local storage
				_.each(storedTag, function(item, key) {
					storedItems[tagID + '_' + key] = true;
				});
			}
		}

		return storedTag;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearItemCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearItemCache = function(item) {

		itemsCacheByTag = {};
		storedItems = {};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearStoredData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearStoredData = function(item) {

		Storage.remove('itemsCacheByTag');
		Storage.remove('itemDataDirectory');
		Storage.remove('tag');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'getCachedItemsByTag': getCachedItemsByTag,
		'cacheItemsByTag': cacheItemsByTag,
		'cacheItemByTag': cacheItemByTag,
		'updateCacheItemByTag': updateCacheItemByTag,
		'getStoredItemDirectory': getStoredItemDirectory,
		'storeItemDirectory': storeItemDirectory,
		'deleteCachedItem': deleteCachedItem,
		'deleteCachedTag': deleteCachedTag,
		'clearItemCache': clearItemCache,
		'clearStoredData': clearStoredData
	};

	$.extend(ItemCache, publicMethods);

})(tmz.module('itemCache'), tmz, $, _);


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
		siteGuideCurrentStep = 1,

		// data

		// jquery cache
		// container
		$content = $('#content'),

		// header
		$infoHeader = $('#infoHeader'),
		$header = $('#header'),
		$userMenu = $('#userMenu'),
		$logoutButton = $('#logoutButton'),
		$loggedInButton = $('#loggedInButton'),

		// login/signup
		$loginForm = $('#loginForm'),
		$buttonContainer = $('#buttonContainer'),
		$loginButton = $('#loginButton'),
		$loginHitArea = $('#loginHitArea'),
		$signupButton = $('#signupButton'),
		$signupHitArea = $('#signupHitArea'),
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

		// site guide
		$guideHitArea = $('#guideHitArea'),
		$guideButton = $('#guideButton'),
		$siteGuide = $('#siteGuide'),
		$siteGuideBackdrop = $('#siteGuideBackdrop'),
		$siteGuideExitButton = $siteGuide.find('.siteGuideExit_btn'),
		$siteGuidePreviousButton = $siteGuide.find('.siteGuidePrevious_btn'),
		$siteGuideNextButton = $siteGuide.find('.siteGuideNext_btn'),

		$searchInput = $('#searchField input'),

		// loading status
		$loadingStatus = $('#itemResultsContainer').find('.loadingStatus');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var init = function() {

		createEventHandlers();

		// init login form
		initLoginForm();

		// setup password reset modal
		$resetpasswordModal.modal({backdrop: true, keyboard: true, show: false});

		// get url path parts
		var urlPathParts = window.location.pathname.split( '/' );
		var action = urlPathParts[1];
		var userName = urlPathParts[2];

		// view public user
		if (action == 'user' && userName !== '') {

			// validate user
			User.validateUser(userName, function(data) {

				// start app with user info
				if (data.status === 'success') {
					viewUser();
				}
			});

		// demo app
		} else {
			startDemo();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var createEventHandlers = function() {

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

		// signupHitArea
		$signupHitArea.click(function(e) {
			e.preventDefault();
			showSignupForm();
		});
		$signupHitArea.mouseover(function(e) {
			$signupButton.addClass('hover');
		});
		$signupHitArea.mouseout(function(e) {
			$signupButton.removeClass();
		});
		$signupHitArea.mousedown(function(e) {
			$signupButton.addClass('active');
		});
		$signupHitArea.mouseup(function(e) {
			$signupButton.removeClass('active');
		});

		// loginHitArea
		$loginHitArea.click(function(e) {
			e.preventDefault();
			showLoginForm();
		});
		$loginHitArea.mouseover(function(e) {
			$loginButton.addClass('hover');
		});
		$loginHitArea.mouseout(function(e) {
			$loginButton.removeClass();
		});
		$loginHitArea.mousedown(function(e) {
			$loginButton.addClass('active');
		});
		$loginHitArea.mouseup(function(e) {
			$loginButton.removeClass('active');
		});

		// guideHitArea
		$guideHitArea.click(function(e) {
			showSiteGuide();
		});
		$guideHitArea.mouseover(function(e) {
			$guideButton.addClass('hover');
		});
		$guideHitArea.mouseout(function(e) {
			$guideButton.removeClass();
		});
		$guideHitArea.mousedown(function(e) {
			$guideButton.addClass('active');
		});
		$guideHitArea.mouseup(function(e) {
			$guideButton.removeClass('active');
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

		// siteGuideBackdrop: click
		$siteGuide.click(function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		// siteGuideNextButton: click
		$siteGuideNextButton.click(function(e) {
			e.preventDefault();

			// next step
			showSiteGuide(++siteGuideCurrentStep);
		});


		// siteGuidePreviousButton: click
		$siteGuidePreviousButton.click(function(e) {
			e.preventDefault();

			// next step
			showSiteGuide(--siteGuideCurrentStep);
		});


		// siteGuideExitButton: click
		$siteGuideExitButton.click(function(e) {
			e.preventDefault();

			// reset step
			siteGuideCurrentStep = 1;

			showSiteGuide(siteGuideCurrentStep);

			hideSiteGuide();
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
	* viewUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewUser = function() {

		// start app with viewing user data
		startApp();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startApp - user credentials must be available before calling
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startApp = function() {

		// show loading status
		$loadingStatus.fadeIn();

		// focus search input field
		$searchInput.focus();

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
		var tagRequest = TagView.getTags(function(data) {
			listReturnedData = data;

		}, function() {

		});

		// deferreds: wait for itemsRequest and directoryRequest
		$.when(itemsRequest, directoryRequest, tagRequest).then(

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

		// logout user
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
	* showSiteGuide -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSiteGuide = function(step) {

		if (step) {
			// remove all classes
			$content.removeClass();

			// add step1 class
			$content.addClass('step' + step);
		}

		// show site guide overlay
		if (!$siteGuide.is(':visible')) {
			$siteGuide.show();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideSiteGuide -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideSiteGuide = function() {

		if ($siteGuide.is(':visible')) {
			$siteGuide.hide();
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

		resetLoginForm();

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
		$buttonContainer.hide();
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
		$buttonContainer.show();
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
				} else if (data.status === 'incorrect_password') {

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

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'init': init,
		'hideSiteGuide': hideSiteGuide
	};

	$.extend(SiteView, publicMethods);

})(tmz.module('siteView'), tmz, jQuery, _);


// SEARCH VIEW
(function(SearchView, tmz, $, _, moment, ListJS) {
	"use strict";

	// module references
	var DetailView = tmz.module('detailView'),
		Amazon = tmz.module('amazon'),
		GiantBomb = tmz.module('giantbomb'),
		Utilities = tmz.module('utilities'),
		GameStats = tmz.module('gameStats'),
		IGN = tmz.module('ign'),
		ReleasedList = tmz.module('releasedList'),
		ItemLinker = tmz.module('itemLinker'),

		// constants
		LIST_TYPE = {'POPULAR': 0, 'UPCOMING': 1, 'RELEASED': 2},
		TAB_IDS = {'#searchTab': 0, '#listTab': 1},
		TIME_TO_SUBMIT_QUERY = 250,								// the number of miliseconds to wait before submiting search query
		DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2},
		PANEL_HEIGHT_OFFSET_USE = 258,
		PANEL_HEIGHT_OFFSET_INFO = 493,
		PANEL_HEIGHT_PADDING_MAX = 5,
		PANEL_HEIGHT_PADDING_SCROLL = 13,

		// timeout
		searchFieldTimeout = null,

		// data
		searchTerms = 'skyrim',
		previousSearchTerms = '',
		searchResults = {},

		// properties
		searchProvider = Utilities.SEARCH_PROVIDERS.Amazon,
		listType = null,
		currentTab = TAB_IDS['#searchTab'],
		searchTabScrollPosition = 0,
		listTabScrollPosition = 0,
		searchPlatform = null,
		listPlatform = null,
		searchDisplayType = DISPLAY_TYPE.Icons,
		listDisplayType = DISPLAY_TYPE.Icons,
		panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO,
		scrollSaved = false,

		// list
		itemList = null,
		listOptions = {
			valueNames: ['itemName', 'releaseDate'],
			item: 'list-item'
		},

		// node cache
		$searchContainer = $('#searchContainer'),

		$searchViewMenu = $('#searchViewMenu'),
		$searchProvider = $('#searchProvider'),
		$listType = $('#listType'),
		$searchProviderName = $searchProvider.find('.providerName'),
		$listTypeName = $listType.find('.listTypeName'),

		$searchPlatforms = $('#searchPlatforms'),
		$legacySubNav = $('#legacySubNav'),
		$platformSelectButton = $('#platformSelect_btn'),
		$listPlatforms = $('#listPlatforms'),
		$searchPlatformsName = $searchPlatforms.find('.platformName'),
		$listPlatformsName = $listPlatforms.find('.platformName'),

		$finderTabLinks = $('#finderTabLinks'),
		$finderTabContent = $('#finderTabContent'),
		$searchTab = $('#searchTab'),
		$listTab = $('#listTab'),
		$searchTabLink = $('#searchTabLink'),
		$listTabLink = $('#listTabLink'),

		$search = $('#searchField'),
		$searchButton = $('#search_btn'),
		$clearSearchButton = $('#clearSearch_btn'),
		$clearSearchIcon = $clearSearchButton.find('i'),
		$searchResultsContainer = $('#searchResultsContainer'),
		$searchResultsContent = $searchResultsContainer.find('.content'),

		$searchResults = $('#searchResults'),
		$inputField = $search.find('input'),

		$listResultsContainer = $('#listResultsContainer'),
		$listResultsContent = $listResultsContainer.find('.content'),
		$listResults = $('#listResults'),
		$listTable = $listResults.find('.list'),

		$searchDisplayOptions = $searchContainer.find('.searchDisplayOptions'),
		$listDisplayOptions = $searchContainer.find('.listDisplayOptions'),

		$searchLoadingStatus = $searchResultsContainer.find('.loadingStatus'),
		$listLoadingStatus = $listResultsContainer.find('.loadingStatus'),

		// templates
		searchResultsTemplate = _.template($('#search-results-template').html()),
		listResultsTemplate = _.template($('#list-results-template').html()),
		platformDropdownTemplate = _.template($('#search-results-platform-dropdown-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.init = function(keywords) {

		SearchView.createEventHandlers();

		// set default platform
		searchPlatform = Utilities.PLATFORM_INDEX[0];
		listPlatform = Utilities.getStandardPlatform('');

		// set default search provider
		searchProvider = Utilities.SEARCH_PROVIDERS.Amazon;

		toggleClearSearchButton(false);

		// init tooltips
		$listDisplayOptions.find('a').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});
		$searchDisplayOptions.find('a').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// initialize nanoscroll
		var nanoScrollOptions = {
			sliderMinHeight: 20,
			iOSNativeScrolling: true,
			preventPageScrolling: true
		};
		$searchResultsContainer.nanoScroller(nanoScrollOptions);
		$listResultsContainer.nanoScroller(nanoScrollOptions);

		// update nanoscroll periodically
		setInterval(function() {

			saveNanoscrollPositions();

			$searchResultsContainer.nanoScroller();
			$listResultsContainer.nanoScroller();
		}, 1500);

		// init BDSM (bootstrap dropdown sub menu)
		$legacySubNav.BootstrapDropdownSubMenu({'$mainNav': $searchPlatforms});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.createEventHandlers = function() {

		// finder tabs: shown
		$finderTabLinks.find('a[data-toggle="tab"]').on('shown', function(e) {

			// get current tab and switch options content
			currentTab = TAB_IDS[$(e.target).attr('href')];
			finderTabChanged(currentTab);
		});

		// search field: keypress
		$inputField.keyup(inputFieldKeyUp);

		// searchProvider: change
		$searchProvider.find('li a').click(function(e) {
			e.preventDefault();
			// set attribute
			$searchProvider.attr('data-content', $(this).attr('data-content'));
			previousSearchTerms = '';

			searchProviderChanged();
		});

		// searchViewMenu .dropdown: hover
		$searchViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$searchViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// listType: change
		$listType.find('li a').click(function(e) {
			e.preventDefault();
			// set attribute
			$listType.attr('data-content', $(this).attr('data-content'));
			listTypeChanged();
		});

		// listPlatforms: change
		$listPlatforms.find('li a').click(function(e) {
			e.preventDefault();
			changeListPlatform($(this).attr('data-content'), $(this).text());
		});

		// searchPlatforms: change
		$searchPlatforms.find('li:not(.dropdown-sub) a').click(function(e) {
			e.preventDefault();
			changeSearchPlatform($(this).attr('data-content'), $(this).text());
		});

		// search results: click
		$searchResults.on('click', 'tr', searchResultItem_onClick);

		// list results: click
		$listResults.on('click', 'tr', listResultItem_onClick);

		// dropdown menu > li: click
		$searchResults.on('click', '.dropdown-menu li', function(e) {
			e.preventDefault();
			selectPlatform(this);
		});

		// searchDisplayType toggle
		$searchDisplayOptions.on('click', 'a', function(e) {
			e.preventDefault();
			changeDisplayType($(this).attr('data-content'));
		});
		// listDisplayType toggle
		$listDisplayOptions.on('click', 'a', function(e) {
			e.preventDefault();

			// only allow changes for provider which has multiple views (upcoming/released games)
			if (listType == LIST_TYPE.UPCOMING || listType == LIST_TYPE.RELEASED) {
				changeDisplayType($(this).attr('data-content'));
			}
		});

		// search button: click
		$searchButton.click(function(e) {
			e.preventDefault();

			SearchView.search(searchTerms);
		});

		// clear search button: click
		$clearSearchButton.click(function(e) {
			$inputField.val('');
			$inputField.focus();
			toggleClearSearchButton(false);
		});

		// window, searchResults: resized
		$searchResults.resize(SearchView.resizePanel);
		$listResults.resize(SearchView.resizePanel);
		$(window).resize(SearchView.resizePanel);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderSearchResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.renderSearchResults = function(items) {

		// hide loading status
		$searchLoadingStatus.stop().hide();

		var sortedSearchResults = [];

		// generate sorted items array
		_.each(items, function(item, key) {
			sortedSearchResults.push(item);
		});

		// sort results
		sortedSearchResults.sort(sortItemsByDate);

		// get model data
		var templateData = {'sortedSearchResults': sortedSearchResults};

		// add searchDisplayType to templateData
		templateData.displayType = searchDisplayType;

		// output data to template
		$searchResults.html(searchResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.renderListResults = function(items, order) {

		// hide loading status
		$listLoadingStatus.stop().hide();

		// get model data
		var templateData = {'listResults': items};

		// output data to template
		$listTable.append(listResultsTemplate(templateData));

		// update list.js for item list
		itemList = new ListJS('listResultsContainer', listOptions);

		// sort using current sort method
		if (order === 'asc') {
			itemList.sort('releaseDate', {sortFunction: releaseDateSortAsc});
		} else {
			itemList.sort('releaseDate', {sortFunction: releaseDateSortDesc});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* search
	* @param {string} keywords
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.search = function(keywords) {

		if (keywords === '') {
			toggleClearSearchButton(false);
		} else {
			toggleClearSearchButton(true);
		}

		// change finder tab to search if not on search tab
		if (currentTab !== TAB_IDS['#searchTab']) {

			// manually toggle search tab
			$searchTabLink.trigger('click');
			finderTabChanged(TAB_IDS['#searchTab']);
		}

		// don't search previous search terms
		if (keywords !== previousSearchTerms) {

			// show loading status
			$searchResultsContainer.find('.noResults').hide();
			$searchLoadingStatus.fadeIn();

			previousSearchTerms = keywords;

			// search based on search provider
			switch (searchProvider) {

				// amazon
				case Utilities.SEARCH_PROVIDERS.Amazon:
					Amazon.searchAmazon(keywords, searchPlatform.amazon, searchAmazon_result);
					break;

				// giantbomb
				case Utilities.SEARCH_PROVIDERS.GiantBomb:
					GiantBomb.searchGiantBomb(keywords, searchGiantBomb_result);
					break;
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGamestatsPopularityListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getGamestatsPopularityListByPlatform = function(platform) {

		$listLoadingStatus.fadeIn();

		// clear listTable
		$listTable.empty();

		// get popular games
		GameStats.getPopularGamesListByPlatform(platform.gamestats, getList_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNUpcomingListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNUpcomingListByPlatform = function(platform) {

		$listLoadingStatus.fadeIn();

		// clear listTable
		$listTable.empty();

		// get upcoming games (page 1)
		IGN.getUpcomingGames(platform.ign, 0, listResult);

		// get upcoming games (page 2)
		IGN.getUpcomingGames(platform.ign, 1, listResult);

		function listResult(data) {
			getList_result(data, 'asc', LIST_TYPE.UPCOMING);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getReleasedList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getReleasedList = function(platform) {

		var numberOfWeeks = 12;

		$listLoadingStatus.fadeIn();

		// clear listTable
		$listTable.empty();

		// get current date (start of week)
		var startWeek = moment().day(0);

		// get released games
		// get up to numberOfWeeks previous releases
		var previousWeek = startWeek;
		for (var i = 0, len = numberOfWeeks; i < len; i++) {

			ReleasedList.getReleasedGames(platform.gt, previousWeek.year(), previousWeek.month() + 1, previousWeek.date(), listResult);
			previousWeek = previousWeek.subtract('weeks', 1);
		}

		function listResult(data) {
			getList_result(data, 'desc', LIST_TYPE.RELEASED);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.resizePanel = function() {

		var resultsHeight = null;
		var $container = null;


		switch(currentTab) {
			case TAB_IDS['#searchTab']:

				resultsHeight = $searchResults.height();
				$container = $searchResultsContainer;

				// add loading status height if visible
				if ($searchLoadingStatus.is(':visible')) {
					resultsHeight += $searchLoadingStatus.height();
				}
				break;

			case TAB_IDS['#listTab']:

				resultsHeight = $listResults.height();

				// add loading status height if visible
				if ($listLoadingStatus.is(':visible')) {
					resultsHeight += $listLoadingStatus.height();
				}
				$container = $listResultsContainer;
				break;
		}

		var windowHeight = $(window).height();

		// panel does not require shrinking
		if (resultsHeight < windowHeight - panelHeightOffset) {
			$container.css({'height': resultsHeight + PANEL_HEIGHT_PADDING_MAX});

		// shrink panel to match window height
		} else {
			var constrainedHeight = windowHeight - panelHeightOffset;
			$container.css({'height': constrainedHeight + PANEL_HEIGHT_PADDING_SCROLL});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loggedInView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.loggedInView = function(isLoggedIn) {

		if (isLoggedIn) {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_USE;
		} else {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getList_result = function(data, order, sourceListType) {

		// if current listType does not match source - skip render
		if (sourceListType === listType) {
			// render list
			SearchView.renderListResults(data, order);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon_result - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchAmazon_result = function(data) {
		// local properties
		var	filtered = false;
		var tempSearchResults = {};
		var searchItem = {};

		/* sortedArray and searchResults cache construction
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// iterate xml results, filter results and construct search results array
		$('Item', data).each(function() {

			// parse amazon result item and get back filtered status, add data to searchItem
			searchItem = Amazon.parseAmazonResultItem($(this));

			// add temp results object
			if (typeof searchItem.isFiltered === 'undefined') {

				// save item in search results cache under ASIN key
				tempSearchResults[searchItem.id] = searchItem;
			}
		});

		// set tempSearchResults to searchResults data
		searchResults = tempSearchResults;

		// renderSearchResults results
		SearchView.renderSearchResults(searchResults);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb_result - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchGiantBomb_result = function(data) {

		var results = data.results;
		var tempSearchResults = {};
		var searchItem = {};

		// iterate results array
		for (var i = 0, len = results.length; i < len; i++) {

			// parse result item and set searchItem
			searchItem = GiantBomb.parseGiantBombResultItem(results[i]);

			// get platform information for each item by gbombID
			GiantBomb.getGiantBombItemPlatform(searchItem.gbombID, getGiantBombItemPlatform_result);

			// save item in search results cache under ASIN key
			tempSearchResults[searchItem.id] = searchItem;
		}

		// set tempSearchResults to searchResults data
		searchResults = tempSearchResults;

		// renderSearchResults results
		SearchView.renderSearchResults(searchResults);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemPlatform_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemPlatform_result = function(data, gbombID) {

		var platforms = data.results.platforms;
		var platformList = [];
		var standardPlatform = '';

		for (var i = 0, len = platforms.length; i < len; i++) {

			// standardize platform names
			standardPlatform = Utilities.matchPlatformToIndex(platforms[i].name).name || platforms[i].name;

			platformList.push(standardPlatform);
		}

		// add platform drop down to item results
		addPlatformDropDown(gbombID, platformList);

		// get searchItem from model and save platform list to searchItem
		var searchItem = SearchView.getSearchResult(gbombID);
		searchItem['platformList'] = platformList;

		// set default platform
		searchItem.platform = platformList[0];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addPlatformDropDown -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addPlatformDropDown = function(gbombID, platformList) {

		var templateData = {'platformList': platformList, 'gbombID': gbombID};

		// attach to existing result row
		$('#' + gbombID).find('.platformDropdown').html(platformDropdownTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortItemsByDate -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortItemsByDate = function(a, b) {

		var date1 = Date.parse(a.releaseDate);
		var date2 = Date.parse(b.releaseDate);

		return date2 - date1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getSearchResult
	* @param {string} asin
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getSearchResult = function(id) {

		return searchResults[id];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finderTabChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finderTabChanged = function(tab) {

		switch(tab) {

			// search tab
			case 0:

				// scroll to previous location - if location is same where it left off chrome won't scrollTo (buggy) so we -1
				$searchResultsContainer.nanoScroller({scrollTop:searchTabScrollPosition - 1});

				showSearchOptions(true);
				showListOptions(false);
				searchProviderChanged();
				break;

			// list tab
			case 1:

				// scroll to previous location - if location is same where it left off chrome won't scrollTo (buggy) so we -1
				$listResultsContainer.nanoScroller({scrollTop:parseInt(listTabScrollPosition - 1, 10)});

				showListOptions(true);
				showSearchOptions(false);
				listTypeChanged();
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchProviderChanged = function() {

		var providerID = $searchProvider.attr('data-content');

		switch(providerID) {
			case '0':
				searchProvider = Utilities.SEARCH_PROVIDERS.Amazon;
				// set title
				$searchProviderName.text('Amazon');
				// show platform list
				$searchPlatforms.show();
				break;
			case '1':
				searchProvider = Utilities.SEARCH_PROVIDERS.GiantBomb;
				// set title
				$searchProviderName.text('GiantBomb');
				// show platform list
				$searchPlatforms.hide();
				break;
		}

		// run search with new search provider
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* listTypeChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var listTypeChanged = function() {

		var typeID = parseInt($listType.attr('data-content'), 10);

		// update list if provider changed
		if (typeID !== listType) {

			switch(typeID) {

				// popular games
				case 0:
					// disable display options and set to list

					// EXCEPTION:
					// do not update listDisplayType as popular list cannot have any other view
					changeDisplayType(0, true);
					$listDisplayOptions.fadeTo(100, 0.35);

					// set title
					$listTypeName.text('Popular');

					listType = LIST_TYPE.POPULAR;
					break;

				// upcoming games
				case 1:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listTypeName.text('Upcoming');

					listType = LIST_TYPE.UPCOMING;
					break;

				// released games
				case 2:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listTypeName.text('Released');

					listType = LIST_TYPE.RELEASED;
					break;
			}

			// update list for new
			getList(listType);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeListPlatform
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeListPlatform = function(platform, name) {

		// set platform name
		$listPlatformsName.text(name);

		// set platform object
		listPlatform = Utilities.getStandardPlatform(platform);

		// get game lists
		getList(listType);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeSearchPlatform
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeSearchPlatform = function(platform, name) {

		previousSearchTerms = '';

		// set platform name
		$searchPlatformsName.text(name);

		// set platform object
		searchPlatform = Utilities.getStandardPlatform(platform);

		// do search with new platform
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showTab = function(tab) {

		switch (tab) {
			case 0:
				$searchTabLink.tab('show');
				break;

			case 1:
				$listTabLink.tab('show');
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getList = function(listType) {

		switch (listType) {
			case LIST_TYPE.POPULAR:
				SearchView.getGamestatsPopularityListByPlatform(listPlatform);
				break;

			case LIST_TYPE.UPCOMING:
				SearchView.getIGNUpcomingListByPlatform(listPlatform);
				break;

			case LIST_TYPE.RELEASED:
				SearchView.getReleasedList(listPlatform);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSearchOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSearchOptions = function(show) {

		if (show) {
			$searchDisplayOptions.show();
			$searchPlatforms.show();
			$searchProvider.show();

		} else {
			$searchDisplayOptions.hide();
			$searchPlatforms.hide();
			$searchProvider.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showListOptions = function(show) {

		if (show) {
			$listDisplayOptions.show();
			$listPlatforms.show();
			$listType.show();

		} else {
			$listDisplayOptions.hide();
			$listPlatforms.hide();
			$listType.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(displayType, doNotUpdateCurrentDisplayType) {

		// change #searchResults or #listResults tbody class based on current tab
		if (currentTab === TAB_IDS['#searchTab']) {
			searchDisplayType = displayType;
			$searchResults.find('tbody').removeClass().addClass('display-' + displayType);

		// check if the actual element has the displayType class
		} else if ($listResults.find('tbody').hasClass('display-' + displayType) === false) {

			// this is so popular list does not define the view for upcoming list
			if (typeof doNotUpdateCurrentDisplayType === 'undefined') {
				listDisplayType = displayType;
			}
			$listResults.find('tbody').removeClass().addClass('display-' + displayType);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchFieldTrigger
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchFieldTrigger = function() {

		clearTimeout(searchFieldTimeout);
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* inputFieldKeyUp
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var inputFieldKeyUp = function(event) {

		// get search value
		searchTerms = $inputField.val();

		if (searchFieldTimeout) {
			clearTimeout(searchFieldTimeout);
		}

		// enter key, run query immediately
		if (event.which == 13) {
			SearchView.search(searchTerms);

		// start search timer - only if key not delete or backspace
		} else {
			searchFieldTimeout = setTimeout(searchFieldTrigger, TIME_TO_SUBMIT_QUERY);
		}
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchResultItem_onClick
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var searchResultItem_onClick = function() {

		var searchResult = SearchView.getSearchResult($(this).attr('id'));

		// show item detail
		DetailView.viewFirstSearchItemDetail(searchResult);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* listResultItem_onClick
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var listResultItem_onClick = function() {

		// save scroll position for active tab
		saveNanoscrollPositions();

		// get search text and standardize
		searchTerms = ItemLinker.standardizeTitle($(this).find('.itemName').text());

		// show search tab
		showTab(TAB_IDS['#searchTab']);

		// set search input field
		$inputField.val(searchTerms);

		// change searchPlatform to listPlatform
		changeSearchPlatform(listPlatform.id);

		// start search for clicked item text
		SearchView.search(searchTerms);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectPlatform
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectPlatform = function(element) {

		// assign platform to searchItem and relaunch detail view
		var searchResult = SearchView.getSearchResult($(element).attr('data-content'));
		searchResult.platform = $(element).find('a').text();

		// get title element
		$(element).parent().siblings('.dropdown-toggle').html(searchResult.platform).append('<b class="caret"></b>');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * toggleClearSearchButton -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var toggleClearSearchButton = function(toggle) {

		if (toggle) {
			$clearSearchIcon.show();
			$clearSearchButton.addClass('hover');
		} else {
			$clearSearchIcon.hide();
			$clearSearchButton.removeClass('hover');
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * saveNanoscrollPositions -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var saveNanoscrollPositions = function() {

		// save scroll position for active tab
		if (currentTab === TAB_IDS['#searchTab']) {
			// never save 0 as location - since we are always -1 from final scrollTo value
			searchTabScrollPosition = $searchResultsContent.scrollTop() || 1;
		} else if (currentTab === TAB_IDS['#listTab']) {
			listTabScrollPosition = $listResultsContent.scrollTop() || 1;
		}
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSortAsc -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSortAsc = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date1 - date2;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSortDesc -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSortDesc = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date2 - date1;
	};

})(tmz.module('searchView'), tmz, jQuery, _, moment, List);

// DETAIL VIEW
(function(DetailView, tmz, $, _, moment) {

    // module references
    var User = tmz.module('user'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),
		SearchView = tmz.module('searchView'),
		ItemView = tmz.module('itemView'),
		ItemData = tmz.module('itemData'),
		Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		Metacritic = tmz.module('metacritic'),
		GiantBomb = tmz.module('giantbomb'),
		Wikipedia = tmz.module('wikipedia'),
		GameTrailers = tmz.module('gameTrailers'),
		VideoPanel = tmz.module('videoPanel'),

		// constants
		TAB_IDS = ['#amazonTab', '#giantBombTab'],
		GAME_STATUS = {0: 'None', 1: 'Own', 2: 'Sold', 3: 'Wanted'},
		PLAY_STATUS = {0: 'Not Started', 1: 'Playing', 2: 'Played', 3: 'Finished'},
		ITEM_TYPES = {'NEW': 0, 'EXISTING': 1},

		// properties
		hasRendered = false,
		currentProvider = null,
		currentTab = TAB_IDS[0],
		currentID = null,
		currentItemHasVideo = false,
		itemType = ITEM_TYPES.NEW,

		// timeout
		itemDetailInfoTimeOut = null,

		// data
		firstItem = {},			// current item data (first)
		secondItem = {},		// current item data (second)
		itemAttributes = {},	// current item attributes

		// ajax requests
		metascoreRequest = null,
		addItemToTagRequest = null,

		// node cache
		$detailTabContent = $('#detailTabContent'),
		$amazonTab = $('#amazonTab'),
		$giantBombTab = $('#giantBombTab'),
		$amazonTabLink = $('#amazonTabLink'),
		$giantBombTabLink = $('#giantBombTabLink'),
		$amazonItemDetailThumbnail = $amazonTab.find('.itemDetailThumbnail'),
		$giantbombItemDetailThumbnail = $giantBombTab.find('.itemDetailThumbnail'),
		$amazonItemDetailInfo = $amazonItemDetailThumbnail.find('.itemDetailInfo'),
		$giantbombItemDetailInfo = $giantbombItemDetailThumbnail.find('.itemDetailInfo'),
		$showVideoButton = $detailTabContent.find('.showVideo_btn'),
		$showDiscussionButton = $detailTabContent.find('.showDiscussion_btn'),

		$detailContainer = $('#detailContainer'),

		$addListContainer = $('#addListContainer'),
		$addList = $('#addList'),
		$saveItemButton = $('#saveItem_btn'),
		$addItemButton = $('#addItem_btn'),

		// node cache: data fields
		$itemAttributes = $('#itemAttributes'),
		$platform = $('#platform'),
		$releaseDate = $('#releaseDate'),
		$wikipediaPage = $('#wikipediaPage'),
		$gametrailersPage = $('#gametrailersPage'),
		$giantBombPage = $('#giantBombPage'),
		$metacriticPage = $('#metacriticPage'),

		$amazonPriceHeader = $itemAttributes.find('#amazonPriceHeader'),
		$amazonPriceNew = $itemAttributes.find('#amazonPriceNew'),
		$amazonPriceUsed = $itemAttributes.find('#amazonPriceUsed'),

		// node cache: custom attributes
		$gameStatus = $('#gameStatus'),
		$playStatus = $('#playStatus'),
		$userRating = $('#userRating'),
		$ratingCaption = $('#ratingCaption'),

		// templates
		modalTemplate = _.template($('#description-modal-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.init = function() {

		// create event handlers
		DetailView.createEventHandlers();

		// hide save button
		$saveItemButton.hide();

		// hide detail panel attributes
		$itemAttributes.hide();
		hideAsynchronousDetailAttributes();

		// intialize star rating plugin
		$userRating.stars({
			split: 2,
			captionEl: $ratingCaption,
			callback: function(ui, type, value) {

				// set userRating attribute
				firstItem.userRating = value;

				// save changes
				saveAttributes(firstItem);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.createEventHandlers = function() {

		// amazonTabLink: click
		$amazonTabLink.click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			showTab(Utilities.SEARCH_PROVIDERS.Amazon);
		});

		// giantBombTabLink: click
		$giantBombTabLink.click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			showTab(Utilities.SEARCH_PROVIDERS.GiantBomb);
		});

		// showVideoButton: click
		$showVideoButton.click(function(e) {
			e.preventDefault();

			if (currentItemHasVideo) {
				VideoPanel.showVideoPanel();

			// show no video message
			} else {

			}
		});

		// showDiscussionButton: click
		$showDiscussionButton.click(function(e) {
			e.preventDefault();

			// load disqus for item
			showDiscussion();
		});

		// amazonItemDetailThumbnail: click
		$amazonItemDetailThumbnail.click(function(e) {

		});

		// giantbombItemDetailThumbnail: click
		$giantbombItemDetailThumbnail.click(function(e) {

		});

		// amazonItemDetailThumbnail: mouseover
		$amazonItemDetailThumbnail.mouseenter(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			itemDetailInfoTimeOut = setTimeout(function() {
				$amazonItemDetailInfo.stop().fadeIn();
			}, 250);
		});

		// amazonItemDetailThumbnail: mouseout
		$amazonItemDetailThumbnail.mouseleave(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			$amazonItemDetailInfo.stop().fadeOut();
		});

		// giantbombItemDetailThumbnail: mouseover
		$giantbombItemDetailThumbnail.mouseenter(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			itemDetailInfoTimeOut = setTimeout(function() {
				$giantbombItemDetailInfo.stop().fadeIn();
			}, 250);
		});

		// giantbombItemDetailThumbnail: mouseout
		$giantbombItemDetailThumbnail.mouseleave(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			$giantbombItemDetailInfo.stop().fadeOut();
		});

		// saveItem_btn: click
		$saveItemButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
		});

		// addItem_btn: click
		$addItemButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
		});

		// gameStatus: select
		$gameStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set gameStatus attribute
			firstItem.gameStatus = $(this).attr('data-content');
			$gameStatus.find('.currentSelection').text(GAME_STATUS[firstItem.gameStatus]);

			// save changes
			saveAttributes(firstItem);
		});

		// playStatus: select
		$playStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set playStatus attribute
			firstItem.playStatus = $(this).attr('data-content');
			$playStatus.find('.currentSelection').text(PLAY_STATUS[firstItem.playStatus]);

			// save changes
			saveAttributes(firstItem);
		});

		// tabs: shown
		$('#detailTab a[data-toggle="tab"]').on('shown', function (e) {
			currentTab = $(e.target).attr('href');
		});

		// addList: change
		$addList.change(addListChanged);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewFirstSearchItemDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.viewFirstSearchItemDetail = function(searchItem) {

		// only view item detail if new item or platform for item has changed
		if (searchItem.id !== firstItem.id || searchItem.platform !== firstItem.platform) {

			// reset videos
			resetVideos();

			// hide information until update query returns
			hideAsynchronousDetailAttributes();

			// clone object as firstItem
			firstItem = $.extend(true, {}, searchItem);

			// figure out search provider for current item
			currentProvider = getItemProvider(firstItem.asin, firstItem.gbombID);

			// add first provider to item data
			firstItem.initialProvider = currentProvider;

			// add standard name propery
			firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

			// get item attributes data
			itemAttributes = ItemData.getItemByThirdPartyID(firstItem.gbombID, firstItem.asin);

			// set current viewing id
			currentID = firstItem.id;

			// clear secondItem model
			clearSecondItemModel(currentProvider);

			// show detail tab for initial provider
			showTab(currentProvider);

			// find item on alernate provider and view item as second search item
			ItemLinker.findItemOnAlternateProvider(firstItem, currentProvider, true, function(id) {
				return function(item) {
					viewSecondSearchItemDetail(item, id);
				};
			}(currentID), true);

			// display tags
			loadAndDisplayTags(firstItem, itemAttributes);

			// load user attributes
			loadAndDisplayUserAttributes(firstItem, itemAttributes);

			// load third party data
			loadThirdPartyData(firstItem, true);

			// call main view detail method
			completeSearchItemDetail(firstItem, currentProvider, 0);
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(item) {

		// reset videos
		resetVideos();

		// hide information until update query returns
		hideAsynchronousDetailAttributes();

		// existing item - list add button renamed to ITEM_TYPES.EXISTING
		setItemType(ITEM_TYPES.EXISTING);

		// clone object as firstItem
		firstItem = $.extend(true, {}, item);

		// add standard name propery
		firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

		// get first provider for item
		// convert to  integer for comparison to provider constants
		currentProvider = parseInt(firstItem.initialProvider, 10);

		// get item attributes data
		itemAttributes = ItemData.getDirectoryItemByItemID(firstItem.itemID);

		// set current viewing id
		currentID = firstItem.id;

		// clear secondItem model
		clearSecondItemModel(currentProvider);

		// show detail tab for initial provider
		showTab(currentProvider);

		// start download of linked item data
		ItemLinker.getLinkedItemData(firstItem, currentProvider, DetailView.viewSecondItemDetail);

		// load tags
		TagView.selectTagsFromDirectory(itemAttributes.tags);

		// display attributes
		loadAndDisplayUserAttributes(firstItem, itemAttributes);

		// load third party data
		loadThirdPartyData(firstItem, false);

		// finish tasks for viewing items
		completeViewItemDetail(firstItem, currentProvider, 0, item);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSecondItemDetail = function(item) {

		// clone object as secondItem
		secondItem = $.extend(true, {}, item);
		var provider = null;

		// make sure that the second item matches the first
		// fast clicking of view items can cause a desync of item rendering
		if (firstItem.asin == secondItem.asin || firstItem.gbombID == secondItem.gbombID) {
			// figure out provider for current item
			provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// finish tasks for viewing items
			completeViewItemDetail(secondItem, provider, 1);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.resetDetail = function(item) {

		// reset add list
		TagView.resetAddList();

		setItemType(ITEM_TYPES.NEW);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getViewingItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.getViewingItemID = function() {

		return firstItem.id;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadThirdPartyData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadThirdPartyData = function(item, fromSearch) {

		// get wikipedia page
		Wikipedia.getWikipediaPage(item.standardName, item, displayWikipediaPage);

		// get metascore
		getMetascore(item.standardName, item, fromSearch);

		// get gametrailers page
		GameTrailers.getGametrailersPage(item.standardName, item, displayGametrailersPage);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondSearchItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSecondSearchItemDetail = function(searchItem, linkedID) {

		// clone object as secondItem
		var secondItem = $.extend(true, {}, searchItem);


		if (currentID === linkedID) {

			// figure out search provider for current item
			var provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// extend firstItem with second provider 3rd party id
			switch (provider) {
				case Utilities.SEARCH_PROVIDERS.Amazon:
					firstItem.asin = secondItem.asin;
					break;

				case Utilities.SEARCH_PROVIDERS.GiantBomb:
					firstItem.gbombID = secondItem.gbombID;
					break;
			}

			// call main view detail method
			completeSearchItemDetail(secondItem, provider, 1);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* completeSearchItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var completeSearchItemDetail = function(item, provider, detailPhase) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(item, detailPhase);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* completeViewItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var completeViewItemDetail = function(item, provider, detailPhase, sourceItem) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(firstItem, detailPhase);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderTabDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderTabDetail = function(itemData, $tab) {

		// render detail
		$tab.find('.itemDetailTitle h3').text(itemData.name);
		$tab.find('img').attr('src', itemData.largeImage);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showDiscussion -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showDiscussion = function() {

		// change item panel view mode to discussion
		ItemView.viewDiscussion();

		var identifier = firstItem.standardName;

		DISQUS.reset({
			reload: true,
			config: function () {
			this.page.identifier = identifier;
			this.page.url = 'http://www.gamedex.net/#!' + identifier;
			}
		});
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateDataPanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateDataPanel = function(item, detailPhase) {

		if (!$itemAttributes.is(':visible')) {
			$itemAttributes.fadeIn();
		}

		// update platform for first phase only
		if (item.platform !== 'n/a' || detailPhase === 0) {
			$platform.find('.data').text(item.platform);
		}

		// use best releaseDate
		if (item.releaseDate !== '1900-01-01') {

			// always render first phase, after that, only update if first release date is not available
			if (detailPhase === 0 || firstItem.releaseDate === '1900-01-01') {

				// update release dates for primary item
				firstItem.releaseDate = item.releaseDate;
				firstItem.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
				$releaseDate.find('.data').text(firstItem.calendarDate);
			}

		// set date display as unknown
		} else if (firstItem.releaseDate === '1900-01-01') {
			$releaseDate.find('.data').text('unknown');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderDetail - render to corresponding tab based on provider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var renderDetail = function(provider, item) {

		// show hidden elements for first rendering
		if (!hasRendered) {
			$('#dataTab').show();
			$('.detailTitleBar').show();
			hasRendered = true;
		}

		// render tab based on current provider
		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:
				renderTabDetail(item, $amazonTab);
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				renderTabDetail(item, $giantBombTab);
				break;
		}
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * clearDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var clearDetail = function($tab) {

		// clear detail
		$tab.find('.itemDetailTitle h3').text('No Match found');
		$tab.find('img').attr('src', 'http://d2sifwlm28j6up.cloudfront.net/no_selection_placeholder.png');
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(title, item, fromSearch) {

		var metascoreSelector = '';

		// hide old metascore on each tab
		for (var i = 0, len = TAB_IDS.length; i < len; i++) {

			metascoreSelector = TAB_IDS[i] + ' .metascore';
			$(metascoreSelector).hide();
		}

		// fetch metascore
		metascoreRequest = Metacritic.getMetascore(title, item, fromSearch, getMetascore_result);

		// get metascore result
		function getMetascore_result(item) {

			// ignore results which do not match currently viewing item
			if (currentID === item.id || currentID === item.asin || currentID === item.gbombID) {

				// show metascore on each tab
				for (var i = 0, len = TAB_IDS.length; i < len; i++) {

					metascoreSelector = TAB_IDS[i] + ' .metascore';

					// add metascore info to item detail
					Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);

					// show page in detail attributes
					$metacriticPage.show();
					$metacriticPage.find('a').attr('href', 'http://www.metacritic.com' + item.metascorePage);
				}
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayWikipediaPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayWikipediaPage = function(wikipediaURL) {

		$wikipediaPage.show();
		$wikipediaPage.find('a').attr('href', wikipediaURL);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayGametrailersPage = function(gametrailersURL) {

		$gametrailersPage.show();
		$gametrailersPage.find('a').attr('href', gametrailersURL);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getProviderSpecificItemDetails -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getProviderSpecificItemDetails = function(provider, item) {

		switch (provider) {
			// amazon price details
			case Utilities.SEARCH_PROVIDERS.Amazon:
				Amazon.getAmazonItemOffers(item.asin, item, amazonItemOffers_result);
				break;

			// giantbomb detail
			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				GiantBomb.getGiantBombItemData(item.gbombID, giantBombItemData_result);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonItemOffers_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonItemOffers_result = function(offers) {

		// update data panel information
		if (offers.buyNowPrice !== '' || offers.lowestUsedPrice !== '') {
			$amazonPriceHeader.show();
		}

		// new price
		if (offers.buyNowPrice !== '') {
			$amazonPriceNew.find('a').attr('href', offers.productURL);
			$amazonPriceNew.find('.data').text(offers.buyNowPrice);
			$amazonPriceNew.show();
		} else {
			$amazonPriceNew.hide();
		}

		// used price
		if (offers.lowestUsedPrice !== '') {
			$amazonPriceUsed.find('.data').text(offers.lowestUsedPrice);
			$amazonPriceUsed.find('a').attr('href', offers.offersURLUsed);
			$amazonPriceUsed.show();
		} else {
			$amazonPriceUsed.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* giantBombItemData_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var giantBombItemData_result = function(itemDetail) {

		// update giantbomb page url
		$giantBombPage.show();
		$giantBombPage.find('a').attr('href', itemDetail.site_detail_url);

		// video config
		configureVideos(itemDetail.videos, firstItem.name);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* configureVideos -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var configureVideos = function(giantbombVideos, itemName) {

		// has giantbombVideos
		if (giantbombVideos.length !== 0) {
			// render video results
			VideoPanel.renderVideoModal(giantbombVideos, itemName);

			currentItemHasVideo = true;
			$showVideoButton.removeClass('noVideos');
			$showVideoButton.find('span').text('Show Videos');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetVideos -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetVideos = function(item) {

		currentItemHasVideo = false;
		$showVideoButton.addClass('noVideos');
		$showVideoButton.find('span').text('No Videos');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showTab = function(provider) {

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:
				// attach detailContainer to item detail info
				$amazonItemDetailInfo.append($detailContainer);
				$amazonTabLink.tab('show');
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				// attach detailContainer to item detail info
				$giantbombItemDetailInfo.append($detailContainer);
				$giantBombTabLink.tab('show');
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideAsynchronousDetailAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideAsynchronousDetailAttributes = function() {

		$wikipediaPage.hide();
		$giantBombPage.hide();
		$metacriticPage.hide();

		$amazonPriceHeader.hide();
		$amazonPriceNew.hide();
		$amazonPriceUsed.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearSecondItemModel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearSecondItemModel = function(provider) {

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:
				clearDetail($giantBombTab);
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				clearDetail($amazonTab);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemProvider -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemProvider = function(asin, gbombID) {

		var provider = null;

		// amazon data found
		if (asin !== 0) {
			provider = Utilities.SEARCH_PROVIDERS.Amazon;

		// giantbomb data found
		} else if (gbombID !== 0) {
			provider = Utilities.SEARCH_PROVIDERS.GiantBomb;
		}

		return provider;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setItemType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setItemType = function(type) {

		// item exists with tags
		if (type === ITEM_TYPES.EXISTING) {

			itemType = ITEM_TYPES.EXISTING;
			$addItemButton.hide();
			$saveItemButton.hide();

		// new item with no current tags
		} else if (type === ITEM_TYPES.NEW) {

			itemType = ITEM_TYPES.NEW;
			$saveItemButton.hide();
			$addItemButton.show();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayTags - find and display tags in select list for search items
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayTags = function(sourceItem, itemData) {

		// exisiting item with tags
		if (itemData && itemData.tagCount > 0) {

			setItemType(ITEM_TYPES.EXISTING);

			// update itemID
			sourceItem.itemID = itemData.itemID;

			// load tags
			TagView.selectTagsFromDirectory(itemData.tags);

		// new item - set user tags
		} else {
			setItemType(ITEM_TYPES.NEW);

			// set user saved tags for new items
			TagView.selectUserTags();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayUserAttributes = function(sourceItem, itemData) {

		// set item attributes into firstItem
		if (itemData) {
			sourceItem.gameStatus = itemData.gameStatus;
			sourceItem.playStatus = itemData.playStatus;
			sourceItem.userRating = itemData.userRating;

		// set default attributes
		} else {
			sourceItem.gameStatus = '0';
			sourceItem.playStatus = '0';
			sourceItem.userRating = '0';
		}

		// display attributes
		displayAttributes(sourceItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayAttributes = function(item) {

		// set attribute fields
		$gameStatus.find('.currentSelection').text(GAME_STATUS[item.gameStatus]);
		$playStatus.find('.currentSelection').text(PLAY_STATUS[item.playStatus]);

		// select star rating
		$userRating.stars("select", item.userRating);
		$ratingCaption.text(item.userRating / 2);

		// set initial data setting for dirty check
		$gameStatus.find('.currentSelection').attr('data-initial', item.gameStatus);
		$playStatus.find('.currentSelection').attr('data-initial', item.playStatus);
		$userRating.attr('data-initial', item.userRating);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveItemChanges - change tags for item: delete or add
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveItemChanges = function(item) {

		// find tags to add
		var tagsToAdd = TagView.getTagsToAdd();

		// find tags to delete
		var idsTagsToDelete = TagView.getTagsToDelete();
		var idsToDelete = idsTagsToDelete.idsToDelete;
		var tagsToDelete = idsTagsToDelete.tagsToDelete;

		// add tags
		if (tagsToAdd.length > 0) {
			addItemToTagRequest = ItemData.addItemToTags(tagsToAdd, item, addItemToTags_result);
		}

		// delete tags
		if (idsToDelete.length > 0) {
			ItemData.deleteTagsForItem(idsToDelete, tagsToDelete, item, deleteTagsForItem_result);
		}

		// check if saving without async data (metacritic, linked item) - if so, update
		updateAsyncData(item);

		// update save item button
		updateSaveItemButton();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateAsyncData - update item with data loaded asynchronously if not available at time of item save
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateAsyncData = function(item) {

		// check for metascore data
		if (_.isUndefined(item.metascore) || item.metascore === null) {

			// deferreds: wait for metascore and add item to tag requests
			$.when(metascoreRequest, addItemToTagRequest).then(

				// all ajax requests returned
				function() {

					// update metacritic data for item
					ItemData.updateMetacritic(firstItem);

					// refresh itemView
					ItemView.refreshView();
				},
				function() {

				}
			);
		}

		// amazon provider - giantbomb not linked
		if (currentProvider === Utilities.SEARCH_PROVIDERS.Amazon && item.gbombID === 0) {


		// giantbomb provider - amazon not linked
		} else if (currentProvider === Utilities.SEARCH_PROVIDERS.Amazon && item.asin === 0) {

		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveAttributes = function(item) {

		// if attributes changed: update user item
		if (isAttributesDirty() && itemType === ITEM_TYPES.EXISTING) {
			ItemData.updateUserItem(item, updateItem_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItem_result = function(item, data) {

		// check if success
		if (data.status === 'success') {

			// reset initial attribute status
			displayAttributes(item);

			// update list view
			ItemView.updateListAttributesChanged(item);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags_result = function(data, addedItems) {

		// if new item - set to existing item
		if (itemType !== ITEM_TYPES.EXISTING) {
			setItemType(ITEM_TYPES.EXISTING);
		}

		// update list view model with new item
		ItemView.updateListAdditions(data, addedItems);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem_result = function(itemID, deletedTagIDs) {

		// update list view model
		ItemView.updateListDeletions(itemID, deletedTagIDs);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* isAttributesDirty -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var isAttributesDirty = function() {

		var initialGameStatus = $gameStatus.find('.currentSelection').attr('data-initial');
		var initialPlayStatus = $playStatus.find('.currentSelection').attr('data-initial');
		var initialRating = $userRating.attr('data-initial');

		// 1 or more attributes changed
		if (initialGameStatus !== firstItem.gameStatus ||
			initialPlayStatus !== firstItem.playStatus ||
			initialRating !== firstItem.userRating) {

			return true;
		}

		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addListChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addListChanged = function(e) {

		// do not check for changes if event triggered from "reset" list
		if (hasRendered && !e.reset) {

			// save userSetTags
			if (itemType === ITEM_TYPES.NEW) {

				// populate user set tags from current tag selection
				TagView.updateUserTags();
			}

			// update button
			updateSaveItemButton();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateSaveItemButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateSaveItemButton = function() {

		// if addList changed and existing item
		if (itemType === ITEM_TYPES.EXISTING && TagView.isAddListChanged()) {
			$saveItemButton.fadeIn();
		} else {
			$saveItemButton.fadeOut();
		}
	};

})(tmz.module('detailView'), tmz, jQuery, _, moment);

// ITEM VIEW
(function(ItemView, tmz, $, _, ListJS) {
	"use strict";

    // modules references
    var User = tmz.module('user'),
		SiteView = tmz.module('siteView'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),
		DetailView = tmz.module('detailView'),
		ImportView = tmz.module('importView'),
		GridView = tmz.module('gridView'),
		ItemData = tmz.module('itemData'),
		ItemCache = tmz.module('itemCache'),
		TagData = tmz.module('tagData'),
		Amazon = tmz.module('amazon'),
		Metacritic = tmz.module('metacritic'),
		ItemLinker = tmz.module('itemLinker'),
		FilterPanel = tmz.module('filterPanel'),
		GiantBomb = tmz.module('giantbomb'),

		// constants
		DISPLAY_TYPE = {'List': 0, 'Icons': 1},
		VIEW_MODES = {'collection': 'collection', 'discussion': 'discussion'},
		SORT_TYPES = {'alphabetical': 0, 'metascore': 1, 'releaseDate': 2, 'platform': 3, 'price': 4},
		PANEL_HEIGHT_OFFSET_USE = 230,					// height offset when logged in
		PANEL_HEIGHT_OFFSET_INFO = 450,					// height offset when logged out
		PANEL_HEIGHT_PADDING_DISCUSSION_MAX = 10,		// padding for discussion content (panel no scrolling)
		PANEL_HEIGHT_PADDING_DISCUSSION_SCROLL = 50,	// padding for discussion content (panel requires scrolling)
		PANEL_HEIGHT_PADDING_COLLECTION_MAX = 5,		// padding for collection content (panel no scrolling)
		PANEL_HEIGHT_PADDING_COLLECTION_SCROLL = 10,	// padding for collection content (panel requires scrolling)
		VIEW_ALL_TAG_ID = '0',
		VIEW_ALL_TAG_NAME = 'View All',

		// list
		itemList = null,
		listOptions = {
			valueNames: ['itemName', 'metascore', 'releaseDate', 'platform', 'gameStatus', 'playStatus', 'userRating'],
			item: 'list-item'
		},

		// properties
		currentViewTagID = VIEW_ALL_TAG_ID,
		displayType = DISPLAY_TYPE.Icons,
		currentSortIndex = 0,
		filterHasBeenApplied = false,
		queueDisplayRefresh = false,
		filterType = null,
		itemMenuOpen = false,
		panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO,
		isFiltered = false,
		itemViewMode = VIEW_MODES.collection,

		// element cache
		$wrapper = $('#wrapper'),
		$itemResults = $('#itemResults'),
		$resizeContainer = $('#resizeContainer'),
		$viewItemsContainer = $('#viewItemsContainer'),
		$itemResultsContainer = $('#itemResultsContainer'),
		$displayOptions = $viewItemsContainer.find('.displayOptions'),
		$gridViewButton = $('#gridView_btn'),
		$showCollectionButton = $('#showCollection_btn'),

		$viewList = $('#viewList'),
		$viewName = $viewList.find('.viewName'),

		$itemViewMenu = $('#itemViewMenu'),
		$editMenu = $('#editMenu'),

		// sort elements
		$sortOptions = $viewItemsContainer.find('.sortOptions'),
		$sortTypeField = $sortOptions.find('.sortType'),

		// filter elements
		$filterOptions = $viewItemsContainer.find('.filterOptions'),
		$platformFilterSubNav = $('#platformFilterSubNav'),
		$clearFiltersBtn = $filterOptions.find('.clearFilters_btn'),
		$filterDropDownBtn = $filterOptions.find('.filterDropDown_btn'),
		$filterTypeField = $filterOptions.find('.filterType'),
		$applyFiltersButton = $('#applyFilters_btn'),

		// delete list modal
		$deleteListConfirmModal = $('#deleteListConfirm-modal'),
		$deleteListConfirmBtn = $('#deleteListConfirm_btn'),
		$deleteListBtn = $('#deleteList_btn'),
		$deleteListName = $deleteListBtn.find('.listName'),

		// import menu
		$importMenu = $('#importMenu'),

		// error modal
		$errorModal = $('#error-modal'),

		// update list modal
		$updateListModal = $('#updateList-modal'),
		$tagNameField = $('#tagNameField'),
		$updateListBtn = $('#updateListConfirm_btn'),
		$editListBtn = $('#editList_btn'),

		$loadingStatus = $itemResultsContainer.find('.loadingStatus'),

		// jquery objects
		currentHoverItem = null,

		// templates
		priceMenuTemplate = _.template($('#price-menu-template').html()),
		itemResultsTemplate = _.template($('#item-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.init = function() {

		ItemView.createEventHandlers();

		// init tooltips
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}});
		$displayOptions.find('a').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// initialize nanoscroll
		var nanoScrollOptions = {
			sliderMinHeight: 20,
			iOSNativeScrolling: true,
			preventPageScrolling: true,
			flash: true,
			flashDelay: 1500
		};
		$itemResultsContainer.nanoScroller(nanoScrollOptions);

		// update nano scroller sizes periodically
		setInterval(function() {
			$itemResultsContainer.nanoScroller();
		}, 1500);

		// set initial filtered status
		setClearFiltersButton(false);

		// init BDSM (bootstrap dropdown sub menu)
		$platformFilterSubNav.BootstrapDropdownSubMenu({'$mainNav': $filterOptions});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    ItemView.createEventHandlers = function() {

		// itemViewMenu .dropdown: hover
		$itemViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$itemViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// viewList: click
		$viewList.find('ul').on('click', 'a', function(e) {
			e.preventDefault();
			changeViewList($(this).attr('data-content'));
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();

			if (!$wrapper.hasClass('gridView')) {
				// show clear filters button
				setClearFiltersButton(true);
				applyFilters(0);
			}
		});

		// clearFiltersBtn: click
		$clearFiltersBtn.click(function(e) {
			e.preventDefault();

			// hide clear filters button
			setClearFiltersButton(false);
			$filterTypeField.text('None');
			// clear filters
			FilterPanel.resetFilters();
			applyFilters();
		});

		// item record: click
		$viewItemsContainer.on('click', '#itemResults tr', function(e) {

			// view item
			viewItem($(this).attr('id'));
		});

		// deleteItem_btn: click
		$itemResults.on('click', '.deleteItem_btn', function(e) {
			e.preventDefault();

			// get id from delete button attribute
			var id = $(this).attr('data-content');
			deleteItem(id);
		});

		// quickAttributes: click
		$itemResults.on('click', '.quickAttributes a', function(e) {
			e.preventDefault();
			e.stopPropagation();

			// get attribute id
			var attributeID = parseInt($(this).attr('data-content'), 10);
			var id = $(this).parent().parent().attr('data-content');

			// set quick attribute
			setQuickAttribute($(this), id, attributeID);
		});

		// deleteList_btn: click
		$deleteListBtn.click(function(e) {
			e.preventDefault();

			SiteView.hideSiteGuide();

			// check how many tags left
			if (TagView.getTagCount() > 1) {
				$deleteListConfirmModal.modal('show');
			} else {
				$errorModal.find('.alertTitle').text('Tag Delete Error');
				$errorModal.find('.alertText').text('Cannot delete last tag');
				$errorModal.modal('show');
			}
		});

		// deleteListConfirm_btn: click
		$deleteListConfirmBtn.click(function(e) {
			e.preventDefault();

			$deleteListConfirmModal.modal('hide');
			// delete currently viewing list
			deleteTag(currentViewTagID);
		});

		// updateListModal: form submit
		$updateListModal.find('form').submit(function(e) {
			e.preventDefault();
			// update tag name
			updateTag(currentViewTagID, $tagNameField.val());
			$updateListModal.modal('hide');
		});

		// updateListBtn: click
		$updateListBtn.click(function(e) {
			// update tag name
			updateTag(currentViewTagID, $tagNameField.val());
			$updateListModal.modal('hide');
		});

		// editListBtn: click
		$editListBtn.click(function(e) {
			e.preventDefault();

			SiteView.hideSiteGuide();

			var currentTagName = TagView.getTagName(currentViewTagID);

			// set field name
			$tagNameField.val(currentTagName);

			$updateListModal.modal('show');

			// select field text
			$tagNameField.focus().select();
		});

		// import menu buttons: click
		$importMenu.find('li').click(function(e) {
			e.preventDefault();

			SiteView.hideSiteGuide();

			// import games from source
			ImportView.startImport(parseInt($(this).attr('data-importSource'), 10));
		});

		// displayType: toggle
		$displayOptions.find('a').click(function(e) {
			e.preventDefault();
			changeDisplayType(this);
		});

		// sortOptions: select
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList(parseInt($(this).attr('data-content'), 10));
		});

		// filterOptions: select
		$filterOptions.find('li:not(.dropdown-sub) a').click(function(e) {
			e.preventDefault();

			// custom filter
			filterType = $(this).attr('data-content');
			if (filterType == '0') {

				SiteView.hideSiteGuide();
				FilterPanel.showFilterPanel();

			// quick filter
			} else {

				// show clear filters button
				setClearFiltersButton(true);

				// set filterType field
				$filterTypeField.text($(this).text());

				quickFilter(filterType);
			}

		});

		// show grid view button: click
		$gridViewButton.click(function(e) {
			e.preventDefault();

			SiteView.hideSiteGuide();
			showGridView();
		});

		// show collection button: click
		$showCollectionButton.click(function(e) {
			e.preventDefault();
			ItemView.viewCollection();
		});

		// window, itemResults: resized
		$resizeContainer.resize(ItemView.resizePanel);
		$(window).resize(ItemView.resizePanel);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* render -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var render = function(items) {

		// item length
		var length = 0;

		// add user attributes to model
		_.each(items, function(item, key) {
			addUserAttributes(item);
			length++;
		});

		// get model data
		var templateData = {'items': items, 'length': length};

		// add displayType/currentViewTagID to templateData
		templateData.displayType = displayType;
		templateData.currentViewTagID = currentViewTagID;

		// render model data to template
		$itemResults.html(itemResultsTemplate(templateData));

		if (length > 0) {
			// activate tooltips for quickAttributes bar
			$itemResults.find('.quickAttributes a').each(function(key, button) {
				$(button).tooltip({delay: {show: 750, hide: 1}, placement: 'bottom'});
			});

			// load preliminary data (for filtering, sorting)
			_.each(items, function(item, key) {
				loadPreliminaryMetascore(item);
			});

			// load latest/extra information for each item
			_.each(items, function(item, key) {
				loadThirdPartyData(item);
			});

			// update list.js for item list
			itemList = new ListJS('itemResultsContainer', listOptions);

			// sort using current sort method
			sortList(currentSortIndex);

			// apply filters
			applyFilters();

			// reset filters - allow filter index to be recreated after dynamic data loaded
			filterHasBeenApplied = false;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.getItem = function(id) {

		return ItemData.getItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearItemView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.clearItemView = function() {

		$itemResults.html('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.resizePanel = function() {

		var windowHeight = $(window).height();
		var resultsHeight = $resizeContainer.height();
		var discussionPaddingScroll = 0;
		var discussionPaddingMax = 0;

		// add loading status height if visible
		if ($loadingStatus.is(':visible')) {
			resultsHeight += $loadingStatus.height();
		}

		// if viewing collection: add additional height padding
		if (itemViewMode === VIEW_MODES.discussion) {
			discussionPaddingScroll = PANEL_HEIGHT_PADDING_DISCUSSION_SCROLL;
			discussionPaddingMax = PANEL_HEIGHT_PADDING_DISCUSSION_MAX;
		}

		// panel does not require shrinking
		if (resultsHeight - discussionPaddingScroll < windowHeight - panelHeightOffset) {
			$itemResultsContainer.css({'height': resultsHeight + PANEL_HEIGHT_PADDING_COLLECTION_MAX + discussionPaddingMax});

		// shrink panel to match window height
		} else {
			var constrainedHeight = windowHeight - panelHeightOffset;
			$itemResultsContainer.css({'height': constrainedHeight + PANEL_HEIGHT_PADDING_COLLECTION_SCROLL + discussionPaddingScroll});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loggedInView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.loggedInView = function(isLoggedIn) {

		if (isLoggedIn) {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_USE;
		} else {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeUserItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.initializeUserItems = function(onSuccess, onFail) {

		// save tagID
		currentViewTagID = VIEW_ALL_TAG_ID;

		// load item data for tagID
		return ItemData.getItems(VIEW_ALL_TAG_ID, onSuccess, onFail);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeUserItems_result - called upon result of initializeUserItems and other dependencies
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.initializeUserItems_result = function(items) {

		// ItemData items result
		ItemData.itemsAndDirectoryLoaded(items);

		// select 'view all' tag
		changeViewList(VIEW_ALL_TAG_ID);

		if (!$.isEmptyObject(items)) {
			// view random item
			ItemView.viewRandomItem();

		} else {
			DetailView.resetDetail();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListDeletions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListDeletions = function(itemID, deletedTagIDs) {

		var tagCount = null;

		// remove items deleted from view
		for (var i = 0, len = deletedTagIDs.length; i < len; i++) {

			// remove element from html
			// except when in 'view all' list (id: 0) and itemDeleted is the last tag for itemID
			if (currentViewTagID === VIEW_ALL_TAG_ID) {

				// get item by id
				tagCount = ItemData.getDirectoryItemByItemID(itemID).tagCount;

				if (tagCount === 0) {

					// remove item by itemID
					$('#' + itemID).remove();
				}

			// not viewing 'all items' remove item
			} else if (currentViewTagID === deletedTagIDs[i]) {
				$('#' + itemID).remove();
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAdditions
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAdditions = function(data, addedItems) {

		var renderCurrentList = false;

		// update view list
		TagView.updateViewList(data.tagIDsAdded, currentViewTagID);

		// viewing user list
		if (currentViewTagID !== VIEW_ALL_TAG_ID) {

			// iterate added tagIDs - render if viewing list where item was added
			for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

				if (data.tagIDsAdded[i] == currentViewTagID) {
					renderCurrentList = true;
				}
			}

		// viewing 'all list' view
		// don't re-render item already displayed in 'view all' list
		} else if (ItemData.getDirectoryItemByItemID(data.itemID).tagCount >= 1) {
			renderCurrentList = true;
		}

		if (renderCurrentList) {

			// get and render items
			changeViewList(currentViewTagID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAttributesChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAttributesChanged = function(item) {

		queueDisplayRefresh = true;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.showListView = function(tagID, newFilterType, filterTypeFieldText, isFiltered) {

		filterType = newFilterType;

		changeViewList(tagID);

		$filterTypeField.text(filterTypeFieldText);
		setClearFiltersButton(isFiltered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewDiscussion -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.viewDiscussion = function() {
		itemViewMode = VIEW_MODES.discussion;
		$viewItemsContainer.removeClass().addClass(itemViewMode);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewCollection -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.viewCollection = function() {
		itemViewMode = VIEW_MODES.collection;
		$viewItemsContainer.removeClass().addClass(itemViewMode);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* refreshView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.refreshView = function() {

		viewItems(currentViewTagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showGridView = function() {

		// show grid for current tag
		GridView.showGridView(currentViewTagID, filterType, $filterTypeField.text(), isFiltered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeViewList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeViewList = function(tagID) {

		var tagName = '';

		// show edit menu
		if (tagID !== VIEW_ALL_TAG_ID) {

			tagName = TagView.getTagName(tagID);

			// change edit menu delete list name
			$deleteListName.text(tagName);

			// show edit menu
			$editMenu.show();

		// hide edit menu
		} else {
			tagName = VIEW_ALL_TAG_NAME;
			$editMenu.hide();
		}

		// set view name
		$viewName.text(tagName);

		// view items
		viewItems(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewItems = function(tagID, onSuccess) {

		// save tagID
		currentViewTagID = tagID;

		// load item data for tagID
		ItemData.getItems(tagID,

			// success - render items
			function(items) {

				render(items);

				if (onSuccess) {
					onSuccess();
				}
			},

			// error - empty view
			function() {
				render({});
			}
		);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadThirdPartyData - loads and displays specialized item detail and populates new data into item model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadThirdPartyData = function(item) {

		// initialize limited function as static property of function loadThirdPartyData
		if (typeof loadThirdPartyData.getAmazonItemOffersLimited == 'undefined') {

			// get amazon price data
			loadThirdPartyData.getAmazonItemOffersLimited = function(item) {

				Amazon.getAmazonItemOffers(item.asin, item, function(offers) {
					amazonPrice_result(item.id, offers);
				});

			}.lazy(250);
		}

		loadThirdPartyData.getAmazonItemOffersLimited(item);

		// get updated metascore - if metascore or metascore page not in item data
		if (item.metascore === null || item.metascorePage === null) {
			// get updated score
			Metacritic.getMetascore(item.standardName, item, false, displayMetascore);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addUserAttributes = function(item) {

		// find directory item by itemID
		var itemData = ItemData.getDirectoryItemByItemID(item.itemID);

		if (itemData) {
			// add attributes to model item
			item.gameStatus = itemData.gameStatus;
			item.playStatus = itemData.playStatus;
			item.userRating = itemData.userRating;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonPrice_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonPrice_result = function(id, offers) {

		// render if offers available
		if (typeof offers.productURL !== 'undefined') {
			// display price
			var priceSelector = '#' + id + ' .priceDetails';

			// attach to existing item result
			$(priceSelector).html(priceMenuTemplate(offers));
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* load -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadPreliminaryMetascore = function(item) {

		// set displayMetascore and metascorePage preliminary data attributes
		if (item.metascore === -1) {
			item.displayMetascore = 'n/a';
		} else {
			item.displayMetascore = item.metascore;
		}

		displayMetascore(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayMetascore = function(item) {

		// display score
		var metascoreSelector = '#' + item.id + ' .metascore';
		Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewRandomItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.viewRandomItem = function() {

		// get random id and view item for id
		var id = ItemData.getRandomItemID();
		viewItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewItem = function(id) {

		// get item
		var item = ItemView.getItem(id);

		// show item detail page
		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem = function(id) {

		// delete item from server
		var itemID = ItemData.deleteSingleTagForItem(id, currentViewTagID, deleteItem_result);

		// remove tag from add list (Detail View) - only if currently viewing item matches deleted item
		if (DetailView.getViewingItemID() === id) {
			TagView.removeTagFromAddList(currentViewTagID);
		}

		// remove element from html
		$('#' + id).remove();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_result = function(data) {

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTag = function(tagID) {

		// delete tag
		TagView.deleteTag(tagID, function() {
			deleteTag_result();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTag_result = function() {

		// default back to 'view all' list
		changeViewList(VIEW_ALL_TAG_ID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateTag = function(tagID, tagName) {

		// delete database data
		TagData.updateTag(tagName, tagID, function(data) {
		});

		// update List
		TagView.getTags(function(data) {
			TagView.getTags_result(data);
		});

		// update tag name
		updateTagName(tagName, tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTagName -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateTagName = function(tagName, tagID) {

		// update update tag input field and current viewing tag name
		$viewName.text(tagName);
		$tagNameField.val(tagName);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setQuickAttribute -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setQuickAttribute = function($button, id, attributeID) {

		// get item by id
		var item = ItemView.getItem(id);

		// flag for item refresh
		queueDisplayRefresh = true;

		switch (attributeID) {

			// playing
			case 0:
				if (item.playStatus === '1') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '1');
					$button.parent().removeClass().addClass('playStatus-1');
					item.playStatus = '1';
				}
				break;
			// played
			case 1:
				if (item.playStatus === '2') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '2');
					$button.parent().removeClass().addClass('playStatus-2');
					item.playStatus = '2';
				}
				break;
			// finished
			case 2:
				if (item.playStatus === '3') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '3');
					$button.parent().removeClass().addClass('playStatus-3');
					item.playStatus = '3';
				}
				break;
			// favorite
			case 3:
				if (item.userRating === '10') {
					$button.parent().removeClass('rating-10');
					item.userRating = '0';
				} else {
					$button.parent().removeClass().addClass('rating-10');
					item.userRating = '10';
				}
				break;
			// owned
			case 4:
				if (item.gameStatus === '1') {
					$button.parent().removeClass().addClass('gameStatus-0');
					item.gameStatus = '0';
				} else {
					$button.parent().removeClass().addClass('gameStatus-1');
					item.gameStatus = '1';
				}
				break;
		}

		// update remote data
		ItemData.updateUserItem(item, function(item, data) {
			// update item detail view
			DetailView.viewItemDetail(item);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetPlayStatusQuickAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetPlayStatusQuickAttributes = function($button, status) {

		// find all quick attribute buttons with class playStatus-x
		$button.parent().parent().find('span[class*="playStatus"]').each(function() {
			$(this).removeClass().addClass('playStatus-' + status);
		});

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		var quickFilter = parseInt(filterType, 10);

		// reset filters
		FilterPanel.resetFilters();

		// filter is not a number - run platform quick filter
		if (isNaN(filterType)) {
			FilterPanel.platformQuickFilter(filterType);

		// standard quick filters
		} else {

			switch (quickFilter) {

				// upcoming
				case 1:
					// sort and apply filter
					sortList(SORT_TYPES.releaseDate);
					// set current filter text on filters button
					// set filter panel option
					FilterPanel.upcomingQuickFilter(itemList);
					break;

				// new releases
				case 2:
					sortList(SORT_TYPES.releaseDate);
					FilterPanel.newReleasesQuickFilter(itemList);
					break;

				// never played
				case 3:
					sortList(SORT_TYPES.metascore);
					FilterPanel.neverPlayedQuickFilter(itemList);
					break;

				// games playing
				case 4:
					sortList(SORT_TYPES.metascore);
					FilterPanel.gamesPlayingQuickFilter(itemList);
					break;

				// games played
				case 5:
					sortList(SORT_TYPES.metascore);
					FilterPanel.gamesPlayedQuickFilter(itemList);
					break;

				// finished games
				case 6:
					sortList(SORT_TYPES.metascore);
					FilterPanel.finishedGamesQuickFilter(itemList);
					break;

				// owned games
				case 7:
					sortList(SORT_TYPES.metascore);
					FilterPanel.ownedGamesQuickFilter(itemList);
					break;

				// wanted games
				case 8:
					sortList(SORT_TYPES.metascore);
					FilterPanel.wantedGamesQuickFilter(itemList);
					break;
			}
		}

		// apply filters and toggle filter status
		applyFilters(quickFilter);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function(filterType) {

		// check if custom filter type
		if (filterType === 0) {
			// set filterType field
			$filterTypeField.text('Custom');
		}

		// refresh item display first - then filter
		if (queueDisplayRefresh) {

			queueDisplayRefresh = false;

			// refresh item html for updated filtering
			changeViewList(currentViewTagID, function() {

				// apply filters to itemList
				var filtered = FilterPanel.applyListJSFiltering(itemList);
			});

		// filter immediately
		} else {
			// apply filters to itemList
			var filtered = FilterPanel.applyListJSFiltering(itemList);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setClearFiltersButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setClearFiltersButton = function(filtered) {

		isFiltered = filtered;

		// check if filtered - show clearFiltersBtn button
		if (filtered) {
			$clearFiltersBtn.show();
			$clearFiltersBtn.next().show();
		} else {
			$clearFiltersBtn.hide();
			$clearFiltersBtn.next().hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		currentSortIndex = sortType;

		switch (currentSortIndex) {

			// alphabetical
			case SORT_TYPES.alphabetical:
				// set sort status
				$sortTypeField.text('Alphabetical');
				// sort new list
				itemList.sort('itemName', { asc: true });

				break;

			// metascores
			case SORT_TYPES.metascore:
				$sortTypeField.text('Review Score');
				itemList.sort('scoreDetails', {sortFunction: metascoreSort});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortTypeField.text('Release Date');
				itemList.sort('releaseDate', {sortFunction: releaseDateSort});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortTypeField.text('Platform');
				itemList.sort('platform', { asc: true });

				break;

			// price
			case SORT_TYPES.price:
				$sortTypeField.text('Price');
				itemList.sort('priceDetails', {sortFunction: priceSort});

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.metascore');
		var $element2 = $(secondItem.elm).find('.metascore');

		var score1 = parseInt($element1.attr('data-score'), 10);
		var score2 = parseInt($element2.attr('data-score'), 10);

		if (score1 < score2) {
			return 1;
		}
		return -1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.priceDetails .lowestNew');
		var $element2 = $(secondItem.elm).find('.priceDetails .lowestNew');

		var price1 = 0;
		var price2 = 0;

		if ($element1.length > 0 ) {
			price1 = parseFloat($element1.attr('data-price'));
		}

		if ($element2.length > 0) {
			price2 = parseFloat($element2.attr('data-price'));
		}

		if (price1 < price2) {
			return -1;
		}
		return 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date2 - date1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(toggleButton) {

		var currentDisplayType = $(toggleButton).attr('data-content');

		// set new display type if changed
		if (displayType !== currentDisplayType) {
			displayType = currentDisplayType;

			// change #itemResults tbody class
			$itemResults.find('tbody').removeClass().addClass('display-' + displayType);

			// set nanoscroll
			$itemResultsContainer.nanoScroller();
		}
	};

})(tmz.module('itemView'), tmz, jQuery, _, List);

// GiantBomb
(function(GridView, tmz, $, _) {
	"use strict";

    // module references
    var DetailView = tmz.module('detailView'),
		ItemData = tmz.module('itemData'),
		ItemView = tmz.module('itemView'),
		TagView = tmz.module('tagView'),
		Amazon = tmz.module('amazon'),
		Utilities = tmz.module('utilities'),
		FilterPanel = tmz.module('filterPanel'),

		// constants
		DEFAULT_DISPLAY_TYPE = 1,
		SORT_TYPES = {'itemName': 0, 'metacriticScore': 1, 'releaseDate': 2, 'platform': 3, 'rawPrice': 4},

		// properties
		currentTagID = null,
		currentSortIndex = 0,
		currentSortType = null,
		currentSortAsc = true,
		filterType = null,
		isFiltered = false,

		// node cache
		$wrapper = $('#wrapper'),
		$gridViewContainer = $('#gridViewContainer'),
		$gridList = $('#gridList'),
		$viewName = $gridList.find('.viewName'),
		$gridViewMenu = $('#gridViewMenu'),

		// display options
		$displayOptions = $gridViewMenu.find('.grid_displayOptions'),
		$displayTypeField = $displayOptions.find('.displayType'),

		// sort options
		$sortOptions = $gridViewMenu.find('.sortOptions'),
		$sortTypeField = $sortOptions.find('.sortType'),

		// filter options
		$filterOptions = $gridViewMenu.find('.filterOptions'),
		$clearFiltersBtn = $filterOptions.find('.clearFilters_btn'),
		$filterTypeField = $filterOptions.find('.filterType'),
		$filterDropDownBtn = $filterOptions.find('.filterDropDown_btn'),
		$listFiltersButton = $filterOptions.find('.listFilters_btn'),
		$applyFiltersButton = $('#applyFilters_btn'),
		$filtersModal = $('#filters-modal'),

		// templates
		gridResultsTemplate = _.template($('#grid-results-template').html()),

		// data
		widthCache = {},

		// properties
		isotopeInitialized = false,
		displayType = null;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.init = function() {

		// create event handlers
		createEventHandlers();

		// init tooltips
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		$displayOptions.find('div').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// set initial filtered status
		setClearFiltersButton(false);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var createEventHandlers = function(item) {

		// gridViewMenu .dropdown: hover
		$gridViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$gridViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// exit grid view button: click
		$('#exitGridView_btn').click(function(e) {
			e.preventDefault();
			showListView();
		});

		// listFilters_btn: click
		$listFiltersButton.click(function(e) {
			e.preventDefault();
			$filtersModal.modal('show');
		});

		// clearFiltersBtn: click
		$clearFiltersBtn.click(function(e) {
			e.preventDefault();

			// hide clear filters button
			setClearFiltersButton(false);
			$filterTypeField.text('None');
			// clear filters
			FilterPanel.resetFilters();
			applyFilters();
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();
			// apply filters
			applyFilters();

			// show clear filters button
			setClearFiltersButton(true);
		});

		// gridList: click
		$gridList.find('ul').on('click', 'a', function(e) {
			e.preventDefault();
			changeGridList($(this).attr('data-content'));
		});

		// gridItem: click
		$gridViewContainer.on('click', '.gridItem img', function(e) {
			e.preventDefault();
			gridItemSelected($(this).parent().parent().attr('data-content'));
		});

		// gridItem: mouseover
		$gridViewContainer.on('mouseover', '.gridItem', function(e) {
			e.preventDefault();

			var $gridItem = $(this);
			var id = $gridItem.attr('data-content');
			var width = widthCache[id];
			if (!width) {
				width = $gridItem.width();
				widthCache[id] = width;
			}

			var offset = Math.round((width * 1.2 - width) / 2);

			$gridItem.css({'z-index': '999',
						//'top': -offset + 'px',
						//'left': -offset + 'px',
						'width': width * 1.2 + 'px',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
		});

		// gridItem: mouseout
		$gridViewContainer.on('mouseout', '.gridItem', function(e) {
			e.preventDefault();

			var $gridItem = $(this);

			$gridItem.css({'z-index': '',
						//'top': '',
						//'left': '',
						'width': '',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
		});

		// displayOptions: click
		$displayOptions.find('li a').click(function(e) {
			e.preventDefault();

			// set type field
			$displayTypeField.text($(this).text());

			// change display type
			changeDisplayType($(this).attr('data-content'));
		});

		// sortOptions: click
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList($(this).attr('data-content'));
		});

		// filterOptions: click
		$filterOptions.find('li a').click(function(e) {
			e.preventDefault();

			// custom filter
			filterType = parseInt($(this).attr('data-content'), 10);
			if (filterType === 0) {
				FilterPanel.showFilterPanel();

			// quick filter
			} else {

				// show clear filters button
				setClearFiltersButton(true);

				// set filterType field
				$filterTypeField.text($(this).text());

				quickFilter(parseInt($(this).attr('data-content'), 10));
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.showGridView = function(tagID, newFilterType, filterTypeFieldText, isFiltered) {

		// switch content display to gridView

		// modify styles
		$wrapper.removeClass('standardView');
		$wrapper.addClass('gridView');

		// reset filter/sort text
		filterType = newFilterType;

		// select gridList tagID
		selectGridTag(tagID);

		// load grid
		loadGridData(tagID);

		$filterTypeField.text(filterTypeFieldText);
		setClearFiltersButton(isFiltered);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectGridTag -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectGridTag = function(tagID) {

        // get option node
        var $listItem = $gridList.find('a[data-content="' + tagID + '"]');

        // set gridList name as listItem name
        $gridList.find('.viewName').text($listItem.text());
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showListView = function() {

		// switch content display to standardView
		// modify styles
		$wrapper.removeClass('gridView');
		$wrapper.addClass('standardView');

		// sync ItemView with gridView tagID list
		ItemView.showListView(currentTagID, filterType, $filterTypeField.text(), isFiltered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeGridList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeGridList = function(tagID) {

		currentTagID = tagID;

		// select grid tag
		selectGridTag(tagID);

		// load items
		loadGridData(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadGridData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadGridData = function(tagID) {

		currentTagID = tagID;

		$gridViewContainer.hide();
		// reset isotop
		if (isotopeInitialized) {
			$gridViewContainer.isotope('destroy');
		}

		ItemData.getItems(tagID, getItems_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems_result = function(items) {

		// setup isotope gride
		render(items);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* render -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var render = function(items) {

		var templateData = {'items': items};

		// set html from items data
		$gridViewContainer.html(gridResultsTemplate(templateData));

		initializeIsotope();

		// initialize isotope after images have loaded
		$gridViewContainer.imagesLoaded( function(){

			// show gridViewContainer
			$gridViewContainer.show();
			initializeIsotope();

			applyFilters();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeIsotope -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initializeIsotope = function() {

		isotopeInitialized = true;

		$gridViewContainer.isotope({
			itemSelector : '.gridItem',

			// sort
			getSortData : {
				itemName: itemNameSort,
				releaseDate: releaseDateSort,
				platform: platformSort,
				userRating: userRatingSort,
				metacriticScore: metacriticScoreSort,
				rawPrice: priceSort
			},

			// starting sort
			sortBy : 'itemName',
			sortAscending : true,

			transformsEnabled: false
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gridItemSelected -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gridItemSelected = function(id) {

		// show item detail page
		var item = ItemData.getItem(id);

		// view in detail panel
		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		var quickFilter = parseInt(filterType, 10);
		FilterPanel.resetFilters();

		switch (quickFilter) {

			// upcoming
			case 1:
				FilterPanel.upcomingQuickFilter();
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				currentSortAsc = true;
				break;

			// new releases
			case 2:
				FilterPanel.newReleasesQuickFilter();
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				currentSortAsc = false;
				break;

			// never played
			case 3:
				FilterPanel.neverPlayedQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// games playing
			case 4:
				FilterPanel.gamesPlayingQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// games played
			case 5:
				FilterPanel.gamesPlayedQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// finished games
			case 6:
				FilterPanel.finishedGamesQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// owned games
			case 7:
				FilterPanel.ownedGamesQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// wanted games
			case 8:
				FilterPanel.wantedGamesQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;
		}

		// apply filters to itemList and set filtered Status icon
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		// check if custom filter type
		if (filterType === 0) {
			// set filterType field
			$filterTypeField.text('Custom');
		}

		// apply filters to itemList and set filtered Status icon
		setClearFiltersButton(FilterPanel.applyIsotopeFiltering($gridViewContainer, currentSortType, currentSortAsc));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		currentSortIndex = parseInt(sortType, 10);

		switch (currentSortIndex) {

			// alphabetical
			case SORT_TYPES.itemName:
				// set sort status
				$sortTypeField.text('Alphabetical');
				currentSortType = 'itemName';
				// sort new list
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;

			// review scores
			case SORT_TYPES.metacriticScore:
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : false
				});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : false
				});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortTypeField.text('Platform');
				currentSortType = 'platform';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;

			// price
			case SORT_TYPES.rawPrice:
				$sortTypeField.text('Price');
				currentSortType = 'rawPrice';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemNameSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemNameSort = function($elem) {
		return $elem.find('.itemName').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function($elem) {
		return $elem.find('.releaseDate').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var platformSort = function($elem) {
		return $elem.find('.platform').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* userRatingSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var userRatingSort = function($elem) {
		return parseInt($elem.find('.userRating').text(), 10);
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metacriticScoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metacriticScoreSort = function($elem) {
		return parseInt($elem.find('.metacriticScore').text(), 10);
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function($elem) {
		return parseInt($elem.find('.rawPrice').text(), 10);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setClearFiltersButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setClearFiltersButton = function(filtered) {

		isFiltered = filtered;

		// check if filtered - show clearFiltersBtn button
		if (filtered) {
			$clearFiltersBtn.show();
			$clearFiltersBtn.next().show();
		} else {
			$clearFiltersBtn.hide();
			$clearFiltersBtn.next().hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(currentDisplayType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		// reset cache
		widthCache = {};

		// set new display type if changed
		if (displayType !== currentDisplayType) {

			// change #itemResults tbody class
			$gridViewContainer.removeClass('display-' + displayType).addClass('display-' + currentDisplayType);

			displayType = currentDisplayType;

			// re-layout isotope
			$gridViewContainer.isotope('reLayout', function() {

			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearTransitionProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearTransitionProperties = function(item) {

		$('.gridItem').each(function(key, item) {
			$(item).css({'z-index': '',
				'-webkit-transition-property': ''
			});
		});
	};


})(tmz.module('gridView'), tmz, jQuery, _);

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* TAG VIEW - controls tag presentation (View and Add tag lists) and manages tag data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function(TagView, tmz, $, _) {
    "use strict";

    // dependecies
    var User = tmz.module('user'),
        TagData = tmz.module('tagData'),
        ItemData = tmz.module('itemData'),
        ItemCache = tmz.module('itemCache'),

        // node cache
        $addListContainer = $('#addListContainer'),
        $addList = $('#addList'),
        $viewList = $('#viewList'),
        $gridList = $('#gridList'),

        // all tags
        activeAddTags = {},

        // view tags - split into two categories: active and empty
        activeViewTags = {},
        emptyViewTags = {},

        // reference data: tag name by tagID
        tagIndex = {},

        // reference data: holds tags with assigned items
        activeTags = {},

        // state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
        initialItemTags = {},

        // tags set by user for adding new items to list
        userSetTags = [],

        // templates
        viewListTemplate = _.template($('#view-list-template').html());

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * init
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var init = function() {

        createEventHandlers();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var createEventHandlers = function() {

        // addList: change
        $addList.change(function(e) {

            // get last tag
            var tags = $addList.val().split(',');
            var lastTag = tags[tags.length - 1];

            // create new tag if not empty string
            if (lastTag !== '') {
                addTag(lastTag);
            }
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags - download new tag data over network or from cache
    * @return json
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags = function(onSuccess, onFail) {

        // reset tag data
        _resetTagData();

        return TagData.getTags(onSuccess, onFail);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags_result - parse tag data response - used in defered so is made public
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags_result = function(data) {

        // find active tags
        _populateActiveTags();

        // parse response and create local data
        _parseGetTagsResponse(data);

        // render lists
        renderViewLists();
        _renderAddLists();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderViewLists - render tag view in Item View panel
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderViewLists = function() {

        // reset sorted lists
        var sortedViewTags = [];
        var sortedEmptyTags = [];

        // generate sorted view tag
        _.each(activeViewTags, function(item, key) {
            sortedViewTags.push(item);
        });
        // generate sorted empty tag
        _.each(emptyViewTags, function(item, key) {
            sortedEmptyTags.push(item);
        });

        // sort lists
        sortedViewTags.sort(_sortListItemByName);

        // create template data structure
        var viewListTemplateData = {'orderedList': sortedViewTags, 'emptyList': sortedEmptyTags};

        // output template to tag containers
        $viewList.find('ul').html(viewListTemplate(viewListTemplateData));
        $gridList.find('ul').html(viewListTemplate(viewListTemplateData));
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagName - get tag name by tagID
    * @return string
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagName = function(tagID) {

        return tagIndex[tagID];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagCount - return number of tags
    * @return number
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagCount = function() {

        var tagCount = 0;
        _.each(activeAddTags, function(tag) {
            tagCount++;
        });

        return tagCount;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToAdd - added tags to addList
    * @return array
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToAdd = function() {

        var tagsToAdd = [];
        var currentTags = _getSelectedTagIDs();

        // iterate current tags - find tags to add
        _.each(currentTags, function(tagID) {

            // current tags NOT in initial
            if (!_.has(initialItemTags, tagID)) {

                // add placeholder for initialItemTags - allows for instant save button update
                initialItemTags[tagID] = 'placeholder';

                // add to list for batch insert
                tagsToAdd.push(tagID);
            }
        });

        return tagsToAdd;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToDelete - deleted tags from addList
    * @return object - contains tagID and link IDs as arrays
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToDelete = function() {

        var idsToDelete = [];
        var tagsToDelete = [];
        var currentTags = _getSelectedTagIDs();

        // iterate initialItemTags
        _.each(initialItemTags, function(id, tagID) {

            // if initial tagID not found in currentTags array, it has been deleted
            if (_.indexOf(currentTags, tagID) === -1) {

                // remove tag from initial state
                delete initialItemTags[tagID];

                // add item/tag tagIDs to lists for batch delete
                tagsToDelete.push(tagID);
                idsToDelete.push(id);
            }
        });

        // return object of tagIDs and ids
        return {'idsToDelete': idsToDelete, 'tagsToDelete': tagsToDelete};
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateInitialItemTags - update initialItemTags with added tag data
    * @param tagIDsAdded - array
    * @param idsAdded - array
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateInitialItemTags = function(tagIDsAdded, idsAdded) {

        // update initial tags with ids
        for (var i = 0, len = idsAdded.length; i < len; i++) {

            // add tag to initialItemTags
            initialItemTags[tagIDsAdded[i]] = idsAdded[i];
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * addTag - create new tag
    * @param tagName - string
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var addTag = function(tagName, onSuccess) {

        // check if tag name exists
        if (!_.has(activeAddTags, tagName)) {

            // create new tag
            TagData.addTag(tagName, function(tag) {

                _addTag_result(tag);

                if (onSuccess) {
                    onSuccess(tag);
                }
            });

        // tag exists > return tag data immediately
        } else {

            if (onSuccess) {
                // rename object properties to match what TagData returns
                var tag = {'tagID': activeAddTags[tagName].id, 'tagName': activeAddTags[tagName].name};
                onSuccess(tag);
            }
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * deleteTag - delete tag by tagID
    * @param tagID - string - tag to delete
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var deleteTag = function(tagID, onSuccess) {

        // get all items by tagID
        var tagItems = ItemCache.getCachedItemsByTag(tagID);

        // each item in tag: delete client item and tag from directory
        _.each(tagItems, function(item, key) {
            ItemData.deleteClientItem(tagID, item.itemID);
            ItemData.deleteTagFromDirectory(item.itemID, tagID);
        });

        // remove tag from addList tags
        removeTagFromAddList(tagID);

        // delete cached tag
        ItemCache.deleteCachedTag(tagID);

        // delete tag data
        TagData.deleteTag(tagID);

        // get new tag data
        getTags(function(data) {
            getTags_result(data);
        });

        onSuccess();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * removeTagFromAddList - remove tagID from select2 list
    * @param tagID - string - tag to remove
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var removeTagFromAddList = function(tagID) {

        // remove tag from initialItemTags
        delete initialItemTags[tagID];

        // reselect form new initialItemTags
        _selectAddListTags(initialItemTags);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectTagsFromDirectory - set tags in tagList as selected in addList
    * @param tagList - object of tagID/id
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectTagsFromDirectory = function(tagList) {

        // reset initial tags, set initial provider
        initialItemTags = {};

        var option = null;

        // populate intialItemTags
        _.each(tagList, function(id, tagID) {

            // create associate of tags with item ids
            initialItemTags[tagID] = id;
        });

        // select initial tags
        _selectAddListTags(tagList);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateUserTags - set new user tags - tags set by user for adding NEW items
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateUserTags = function() {
        userSetTags = $addList.val().split(',');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectUserTags - set tags in userSetTags as selected in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectUserTags = function() {

        initialItemTags = {};

        $addList.val(userSetTags).trigger({
            type: 'change',
            reset: false
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateViewList -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateViewList = function(tagIDsAdded, currentViewTagID) {

        var updated = false;

        // iterated added tag IDS
        for (var i = 0, len = tagIDsAdded.length; i < len; i++) {

            // check if added tagID is in activeTags
            if (typeof activeTags[tagIDsAdded[i]] === 'undefined') {

                // add tagID to activeTags
                activeTags[tagIDsAdded[i]] = true;

                // remove tag from empty tag
                delete emptyViewTags[tagIndex[tagIDsAdded[i]]];

                // add to view lists object
                activeViewTags[tagIndex[tagIDsAdded[i]]] = {'id': tagIDsAdded[i], 'name': tagIndex[tagIDsAdded[i]]};

                updated = true;
            }
        }

        // update view tag
        if (updated) {
            renderViewLists();
        }

        return updated;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetAddList - clear addList select2 tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetAddList = function() {

        // reset initial/current item tags
        initialItemTags = {};
        userSetTags = [];

        $addList.val(['']).trigger({
            type:'change',
            reset:true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * isAddListChanged -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var isAddListChanged = function() {

        var addListChanged = false;
        var currentTags = _getSelectedTagIDs();

        // tags added
        _.each(currentTags, function(tagID) {

            // match with initial tags
            if (!_.has(initialItemTags, tagID)) {
                addListChanged = true;
            }
        });

        // tags deleted
        _.each(initialItemTags, function(id, tagID) {

            // match with user currentTags
            if (_.indexOf(currentTags, tagID) === -1) {
                addListChanged = true;
            }
        });

        return addListChanged;
    };



    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PRIVATE METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _renderAddLists - render select2 dropdown tag select for adding and saving items to tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _renderAddLists = function() {

        // reset sorted lists
        var sortedAddTag = [];
        var addListTags = [];

        // generate sorted add tag
        _.each(activeAddTags, function(tag, key) {
            sortedAddTag.push(tag);
            addListTags.push(tag.name);
        });

        // sort lists
        sortedAddTag.sort(_sortListItemByName);

        // render addList
        $addList.select2({
            tags:addListTags,
            placeholder: "Type a tag name",
            allowClear: true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _resetTagData - reset all tag data
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _resetTagData = function() {

        activeAddTags = {};
        activeViewTags = {};
        emptyViewTags = {};
        tagIndex = {};
        activeTags = {};
        initialItemTags = {};
        userSetTags = [];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _addTag_result - process addTag response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _addTag_result = function(newTag) {

        var tagItem = {name: newTag.tagName.toLowerCase(), id: newTag.tagID};

        // add tag to all tags data
        activeAddTags[tagItem.name] = tagItem;
        // tag is empty by default
        emptyViewTags[tagItem.name] = tagItem;
        // set tagID/name reference
        tagIndex[tagItem.id] = tagItem.name;

        // update view tag list
        renderViewLists();
        _renderAddLists();

        // reselect input field since after init .select2 field focus is lost
        $addListContainer.find('.select2-search-field input').focus();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getSelectedTagIDs - get tagIDs as array for each selected tag in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getSelectedTagIDs = function() {

        // get tag name array
        var currentTagString = $addList.val();
        var tagIDs = [];

        if (currentTagString !== '') {

            // get id for each tag name
            _.each(currentTagString.split(','), function(tag) {

                if (_.has(activeAddTags, tag)) {
                    tagIDs.push(activeAddTags[tag].id);
                } else {
                    tagIDs.push(tag);
                }
            });
        }
        return tagIDs;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _selectAddListTags - select tags specified in select2 list
    * @param tagList - array - ids of tags to select
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _selectAddListTags = function(tagList) {

        var newTags = [];

        // iterate tagList
        _.each(tagList, function(id, tagID) {
            // get tagName
            var tagName = getTagName(tagID);
            newTags.push(tagName);
        });

        $addList.val(newTags).trigger({
            type: 'change',
            reset: false
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _populateActiveTags - populate activeTags with tags which have items assigned
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _populateActiveTags = function() {

        var itemDataDirectory = ItemData.getItemDirectory();

        // reset activeTags
        activeTags = {};

        // iterate items in itemDirectory
        _.each(itemDataDirectory, function(item, key) {

            // iterate tags
            _.each(item.tags, function(id, tag) {

                // if tag not in activeTags: add it
                if (typeof activeTags[tag] === 'undefined') {
                    activeTags[tag] = true;
                }
            });
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _parseGetTagsResponse - populate local tag data from getTags response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _parseGetTagsResponse = function(tagData) {

        // temp tag tagData
        var tagItem = {};

        // iterate tagData
        for (var i = 0, len = tagData.length; i < len; i++) {

            tagItem = {};

            // get attributes
            tagItem.name = tagData[i].tagName.toLowerCase();
            tagItem.id = tagData[i].tagID;

            // check if tagID is in activeTags before adding to view tag
            if (typeof activeTags[tagItem.id] !== 'undefined') {

                // add to view lists object
                activeViewTags[tagItem.name] = tagItem;

            } else {
                emptyViewTags[tagItem.name] = tagItem;
            }

            // add all to add tag objects
            activeAddTags[tagItem.name] = tagItem;
            tagIndex[tagItem.id] = tagItem.name;
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _sortListItemByName
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _sortListItemByName = function(a, b) {

        var name_a = a.name;
        var name_b = b.name;

        return name_a.toLowerCase().localeCompare(name_b.toLowerCase());
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'init': init,
        'getTags': getTags,
        'getTags_result': getTags_result,
        'renderViewLists': renderViewLists,
        'getTagName': getTagName,
        'getTagCount': getTagCount,
        'getTagsToAdd': getTagsToAdd,
        'getTagsToDelete': getTagsToDelete,
        'updateInitialItemTags': updateInitialItemTags,
        'addTag': addTag,
        'deleteTag': deleteTag,
        'removeTagFromAddList': removeTagFromAddList,
        'selectTagsFromDirectory': selectTagsFromDirectory,
        'updateUserTags': updateUserTags,
        'selectUserTags': selectUserTags,
        'updateViewList': updateViewList,
        'resetAddList': resetAddList,
        'isAddListChanged': isAddListChanged
    };

    $.extend(TagView, publicMethods);


})(tmz.module('tagView'), tmz, jQuery, _);

// FILTER PANEL
(function(FilterPanel, tmz, $, _, moment) {
	"use strict";

	// dependecies
	var Utilities = tmz.module('utilities'),

		// node cache
		$filtersModal = $('#filters-modal'),

		// filters
		$releaseDateFilter = $('#releaseDate_filter'),
		$gameStatusFilter = $('#gameStatus_filter'),
		$playStatusFilter = $('#playStatus_filter'),
		$metascoreFilter = $('#metascore_filter'),
		$platformFilter = $('#platformFilterList');

		// data

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.init = function() {

		FilterPanel.createEventHandlers();

		// init select2
		$platformFilter.select2({
			placeholder: "Select platform",
			allowClear: true
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.createEventHandlers = function() {

		// filter buttons
        $filtersModal.on('click', '.btn-group button', function(e) {
            e.preventDefault();
        });
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showFilterPanel
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.showFilterPanel = function() {

		$filtersModal.modal('show');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.getFilters = function() {

		var filters = {};
		filters.releaseDateFilters = [];
		filters.metascoreFilters = [];
		filters.platformFilters = [];
		filters.gameStatusFilters = [];
		filters.playStatusFilters = [];

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.releaseDateFilters.push(true);
			} else {
				filters.releaseDateFilters.push(false);
			}
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.metascoreFilters.push(true);
			} else {
				filters.metascoreFilters.push(false);
			}
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.gameStatusFilters.push(true);
			} else {
				filters.gameStatusFilters.push(false);
			}
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.playStatusFilters.push(true);
			} else {
				filters.playStatusFilters.push(false);
			}
		});

		// iterate platform filter options
		var filtersString = $platformFilter.val();
		var platformFilters = [];

		if (filtersString && filtersString !== '') {
			platformFilters = filtersString.split(',');
		}

		_.each(platformFilters, function(filter, index) {
			filters.platformFilters[index] = Utilities.getStandardPlatform(filter);
		});

		return filters;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyListJSFiltering -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.applyListJSFiltering = function(list) {

		// get filters
		var filters = FilterPanel.getFilters();
		var filtered = false;

		// apply filters
		list.filter(function(itemValues) {

			var releaseDateStatus = FilterPanel.releaseDateFilter(itemValues.releaseDate, filters.releaseDateFilters);
			var metascoreStatus = FilterPanel.metascoreFilter(itemValues.metascore, filters.metascoreFilters);
			var platformStatus = FilterPanel.platformFilter(itemValues.platform, filters.platformFilters);
			var gameStatus = FilterPanel.gameStatusFilter(itemValues.gameStatus, filters.gameStatusFilters);
			var playStatus = FilterPanel.playStatusFilter(itemValues.playStatus, filters.playStatusFilters);

			// not filtered
			if (releaseDateStatus && metascoreStatus && platformStatus && playStatus && gameStatus) {
				return true;
			}

			// filtered out
			filtered = true;
			return false;
		});

		return filtered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyIsotopeFiltering -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.applyIsotopeFiltering = function($gridViewContainer, sortType, sortAsc) {

		var filters = FilterPanel.getFilters();
		var filtered = false;

		// get selected items
		var selectedItems = $('.gridItem').filter(function(index){

			var $this = $(this);

			// releaseDate
			var releaseDate = $this.find('.releaseDate').text();
			var releaseDateFiltered = FilterPanel.releaseDateFilter(releaseDate, filters.releaseDateFilters);

			// metacriticScore
			var metacriticScore = $this.find('.metacriticScore').text();
			var metacriticScoreFiltered =  FilterPanel.metascoreFilter(metacriticScore, filters.metascoreFilters);

			// platform
			var platform = $this.find('.platform .data').text();
			var platformFiltered =  FilterPanel.platformFilter(platform, filters.platformFilters);

			// gameStatus
			var gameStatus = $this.find('.gameStatus').text();
			var gameStatusFiltered =  FilterPanel.gameStatusFilter(gameStatus, filters.gameStatusFilters);

			// playStatus
			var playStatus = $this.find('.playStatus').text();
			var playStatusFiltered =  FilterPanel.playStatusFilter(playStatus, filters.playStatusFilters);

			if (releaseDateFiltered && gameStatusFiltered && playStatusFiltered && metacriticScoreFiltered && platformFiltered) {
				return true;
			}

			filtered = true;
			return false;
		});

		// apply isotope filter and keep current sort
		$gridViewContainer.isotope({
			filter: selectedItems,
			sortBy : sortType,
			sortAscending : sortAsc
		});

		return filtered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.resetFilters = function() {

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all platform options, deselect
		$platformFilter.val(['']).trigger('change');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quick filters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.upcomingQuickFilter = function(list) {
		// activate filter panel option
		$releaseDateFilter.find('button[data-content="0"]').addClass('active');
	};
	FilterPanel.newReleasesQuickFilter = function(list) {
		$releaseDateFilter.find('button[data-content="1"]').addClass('active');
	};
	FilterPanel.neverPlayedQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="0"]').addClass('active');
	};
	FilterPanel.gamesPlayingQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="1"]').addClass('active');
	};
	FilterPanel.gamesPlayedQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="2"]').addClass('active');
	};
	FilterPanel.finishedGamesQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="3"]').addClass('active');
	};
	FilterPanel.ownedGamesQuickFilter = function(list) {
		$gameStatusFilter.find('button[data-content="1"]').addClass('active');
	};
	FilterPanel.wantedGamesQuickFilter = function(list) {
		$gameStatusFilter.find('button[data-content="3"]').addClass('active');
	};
	FilterPanel.platformQuickFilter = function(platform) {
		$platformFilter.val(platform).trigger('change');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.releaseDateFilter = function(rawReleaseDate, filterList) {

		// filter config (1: unreleased, 2: released)
		var unreleasedFilter = filterList[0];
		var releasedFilter = filterList[1];

		var releaseDate = null;
		if (rawReleaseDate === '1900-01-01') {
			releaseDate = moment().add('days', 1);
		} else {
			releaseDate = moment(rawReleaseDate, 'YYYY-MM-DD');
		}
		var currentDate = moment();

		var diff = releaseDate.diff(currentDate, 'seconds');

		// all filters active - ignore filter
		if (unreleasedFilter && releasedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!unreleasedFilter && !releasedFilter) {
			return true;

		// specific filter
		} else if (unreleasedFilter && diff > 0) {
			return true;
		} else if (releasedFilter && diff < 0) {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gameStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.gameStatusFilter = function(gameStatus, filterList) {

		var noneFilter = filterList[0];
		var ownFilter = filterList[1];
		var soldFilter = filterList[2];
		var wantedFilter = filterList[3];

		// all filters active - ignore filter
		if (noneFilter && ownFilter && soldFilter && wantedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!noneFilter && !ownFilter && !soldFilter && !wantedFilter) {
			return true;

		// specific filters
		} else if (noneFilter && gameStatus === '0') {
			return true;
		} else if (ownFilter && gameStatus === '1') {
			return true;
		} else if (soldFilter && gameStatus === '2') {
			return true;
		} else if (wantedFilter && gameStatus === '3') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.playStatusFilter = function(playStatus, filterList) {

		var notPlayingFilter = filterList[0];
		var playingFilter = filterList[1];
		var playedFilter = filterList[2];
		var finishedFilter = filterList[3];

		// all filters active - ignore filter
		if (notPlayingFilter && playingFilter && playedFilter && finishedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!notPlayingFilter && !playingFilter && !playedFilter && !finishedFilter) {
			return true;

		// specific filters
		} else if (notPlayingFilter && playStatus === '0') {
			return true;
		} else if (playingFilter && playStatus === '1') {
			return true;
		} else if (playedFilter && playStatus === '2') {
			return true;
		} else if (finishedFilter && playStatus === '3') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.metascoreFilter = function(metascore, filterList) {

		var _90sFilter = filterList[0];
		var _80sFilter = filterList[1];
		var _70sFilter = filterList[2];
		var _60sFilter = filterList[3];
		var _50sFilter = filterList[4];
		var _25to49Filter = filterList[5];
		var _0to24Filter = filterList[6];

		var score = parseInt(metascore, 10);

		// all filters selected - ignore filter
		if (_90sFilter && _80sFilter && _70sFilter && _60sFilter && _50sFilter && _25to49Filter && _0to24Filter) {
			return true;

		// no filters selected - ignore filter
		} else if (!_90sFilter && !_80sFilter && !_70sFilter && !_60sFilter && !_50sFilter && !_25to49Filter && !_0to24Filter) {
			return true;

		// specifc filter
		} else if (_90sFilter && score >= 90) {
			return true;
		} else if (_80sFilter && score >= 80 && score < 90) {
			return true;
		} else if (_70sFilter && score >= 70 && score < 80) {
			return true;
		} else if (_60sFilter && score >= 60 && score < 70) {
			return true;
		} else if (_50sFilter && score >= 50 && score < 60) {
			return true;
		} else if (_25to49Filter && score >= 25 && score < 50) {
			return true;
		} else if (_0to24Filter && score >= 0 && score < 25) {
			return true;
		}

		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.platformFilter = function(platform, filterList) {

		// platform filter list empty - no filter
		if (filterList.length === 0) {
			return true;
		}

		// iterate platform list
		for (var i = 0, len = filterList.length; i < len; i++) {

			if (filterList[i].name === platform) {
				return true;
			}
		}

		return false;
	};

})(tmz.module('filterPanel'), tmz, $, _, moment);

// VideoPanel
(function(VideoPanel, _V_, tmz, $, _, moment) {
	"use strict";

	// constants
	var GIANT_BOMB_VIDEO_PATH = 'http://media.giantbomb.com/video/',
		VIDEO_PLAYER_ID = 'videoPlayer',
		VIDEO_SET_HEIGHT = 91,
		VIDEOS_PER_SET = 5,

		// properties
		currentVideoSet = 0,
		currentMaxVideoSet = null,
		currentVideoCount = 0,
		currentVideoIndex = 0,
		previousVideoIndex = 0,

		// data
		currentVideos = [],		// current item videos

		// objects
		videoJSPLayer = null,

		// jquery cache
		$videoModal = $('#video-modal'),
		$videoListContainer = $('#videoListContainer'),
		$videoList = $('#videoList'),
		$videoPlayer = $('#videoPlayer'),
		$videoModalTitle = $('#videoModalTitle'),
		$videoListNavigation = $('#videoListNavigation'),
		$navigateLeft = $videoListNavigation.find('.navigateLeft'),
		$navigateRight = $videoListNavigation.find('.navigateRight'),
		$pageNumberText = $videoListNavigation.find('.pageNumber'),

		// templates
		videoResultsTemplate = _.template($('#video-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	VideoPanel.init = function() {

		// init video js
		videoJSPLayer = _V_(VIDEO_PLAYER_ID);

		// create event handlers
		VideoPanel.createEventHandlers();

		// show video modal
		$videoModal.modal({backdrop: true, show: false});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.createEventHandlers = function() {

		// videoList li: click
		$videoList.on('click', 'li', function(e) {
			e.preventDefault();

			var id = $(this).attr('data-id');
			changeVideoSource(Number(id));

			playCurrentVideo();
		});

		// navigateLeft: click
		$navigateLeft.click(function(e) {
			previousVideoSet();
		});
		// navigateRight: click
		$navigateRight.click(function(e) {
			nextVideoSet();
		});

		// videoModal: hidden
		$videoModal.on('hidden', function () {
			pauseCurrentVideo();
		});

		// video js: video ended
		videoJSPLayer.addEvent("ended", playNextVideo);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showVideoPanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.showVideoPanel = function() {

		$('html, body').scrollTop(0);

		// show video modal
		$videoModal.modal('show');

		playCurrentVideo();
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderVideoModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	VideoPanel.renderVideoModal = function(videoResults, itemName) {

		currentVideos = $.extend(true, [], videoResults);

		if (currentVideos.length !== 0) {

			// get video count
			currentVideoCount = currentVideos.length;

			// reset max, videoIndex
			currentMaxVideoSet = null;
			currentVideoIndex = 0;

			// format data
			formatVideoData(currentVideos);

			// get model data
			var templateData = {'videoResults': currentVideos};

			// render video list
			$videoList.html(videoResultsTemplate(templateData));

			// set video game name
			$videoModalTitle.text(itemName);

			// update video source
			changeVideoSource(0);

			// change videoSet to default
			currentVideoSet = 0;
			changeVideoSet(0);

			// init popover
			$videoList.find('a').popover({'placement': 'top', 'animation': true});

			showVideoListNavigation();
		}

		if (currentVideos.length <= VIDEOS_PER_SET) {
			hideVideoListNavigation();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatVideoData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatVideoData = function(videoArray) {

		// iterate videoArray and add new attributes
		for (var i = 0, len = videoArray.length; i < len; i++) {

			// format publish date
			videoArray[i].publishDate = moment(videoArray[i].publish_date, "YYYY-MM-DD").calendar();
			delete videoArray[i].publish_date;

			// format video length
			var minutes = Math.floor(videoArray[i].length_seconds / 60);
			var seconds = (videoArray[i].length_seconds % 60).toString();
			if (seconds.length === 1) {
				seconds = '0' + seconds;
			}
			delete videoArray[i].length_seconds;


			videoArray[i].runningTime = minutes + ':' + seconds;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playNextVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playNextVideo = function() {

		if (currentVideoIndex === currentVideoCount - 1) {
			currentVideoIndex = 0;
		} else {
			currentVideoIndex++;
		}

		// play next
		changeVideoSource(currentVideoIndex);

		// change video set
		if (currentVideoIndex % VIDEOS_PER_SET === 0) {

			var set = Math.floor(currentVideoIndex / VIDEOS_PER_SET);
			changeVideoSet(set);
		}

		playCurrentVideo();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeVideoSource -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeVideoSource = function(index) {

		currentVideoIndex = index;

		// get video url
		var url = currentVideos[index].url;

		// add 'playing' class to videoList item
		var $currentVideoItem = $videoList.find('li[data-id="' + index + '"]');
		var $previousVideoItem = $videoList.find('li[data-id="' + previousVideoIndex + '"]');
		$previousVideoItem.removeClass('playing');
		$currentVideoItem.addClass('playing');

		// update videoPlayer source
		var videoURLParts = url.split('.');
		var videoURL = GIANT_BOMB_VIDEO_PATH + videoURLParts[0] + '_3500.' + videoURLParts[1];
		videoJSPLayer.src(videoURL);

		previousVideoIndex = index;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playCurrentVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playCurrentVideo = function() {

		videoJSPLayer.play();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* pauseCurrentVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var pauseCurrentVideo = function() {

		videoJSPLayer.pause();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideVideoListNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideVideoListNavigation = function() {
		$videoListNavigation.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showVideoListNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showVideoListNavigation = function() {
		$videoListNavigation.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* previousVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var previousVideoSet = function() {

		// get set height
		var maxVideoSet = getMaxVideoSet();

		if (currentVideoSet > 0) {
			changeVideoSet(--currentVideoSet);
		// reached min > loop to max
		} else {
			changeVideoSet(maxVideoSet);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* nextVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var nextVideoSet = function() {

		// get set height
		var maxVideoSet = getMaxVideoSet();

		if (currentVideoSet < maxVideoSet) {
			changeVideoSet(++currentVideoSet);

		// reached max > loop to 0
		} else {
			changeVideoSet(0);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMaxVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMaxVideoSet = function() {

		if (!currentMaxVideoSet) {
			currentMaxVideoSet = Math.ceil(currentVideoCount / VIDEOS_PER_SET) - 1;
		}

		return currentMaxVideoSet;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeVideoSet = function(set) {

		var position = -(set * VIDEO_SET_HEIGHT);
		currentVideoSet = set;

		// animate position
		$videoList.stop().animate({top: position}, 250, function() {

		});

		// set page number
		$pageNumberText.text(Number(set + 1) + ' / ' + Number(getMaxVideoSet() + 1));
	};


})(tmz.module('videoPanel'), _V_, tmz, jQuery, _, moment);


// Amazon
(function(Amazon, tmz, $, _, moment) {
	"use strict";

    // module references
    var Utilities = tmz.module('utilities'),

		// constants
		FILTERED_NAMES = [
			'accessory',
			'case',
			'codes',
			'combo',
			'console',
			'controller',
			'covers',
			'face plate',
			'faceplate',
			'head set',
			'headset',
			'import',
			'japan',
			'kit',
			'map',
			'membership',
			'new',
			'pack',
			'poster',
			'pre-paid',
			'set',
			'shell',
			'skin',
			'software',
			'stylus',
			'wireless'
		],

		// REST URLS
		AMAZON_SEARCH_URL = tmz.api + 'amazon/search/',
		AMAZON_DETAIL_URL = tmz.api + 'amazon/detail/',

		// data
		amazonOffersCache = {},
		amazonItemCache = {},

		// request queues
		getAmazonItemOffersQueue = {},
		getAmazonItemDetailQueue = {},

		// ajax requests
		searchRequest = null,
		searchAmazonID = 0;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon - search amazon, prevent all but latest from completing and returning onSuccess method
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.searchAmazon = function(keywords, browseNode, onSuccess, onError, preventMultipleRequests) {

		preventMultipleRequests = typeof preventMultipleRequests !== 'undefined' ? preventMultipleRequests : false;

		var searchTerms = encodeURIComponent(keywords);

		// browse node, search terms and response group in url
		var requestData = {
			'keywords': keywords,
			'browse_node': browseNode,
			'search_index': 'VideoGames',
			'response_group': 'ItemAttributes,Images',
			'page': 1
		};

		// abort previous request
		if (searchRequest && preventMultipleRequests) {
			searchRequest.abort();
		}

		// increment searchAmazonID and assign to local id
		var id = ++searchAmazonID;

		searchRequest = $.ajax({
			url: AMAZON_SEARCH_URL,
			type: 'GET',
			data: requestData,
			dataType: 'xml',
			cache: true,
			success: function(data) {

				// only allow latest request from returning onSuccess
				if (id === searchAmazonID || !preventMultipleRequests) {
					searchRequest = null;
					onSuccess(data);
				}
			},
			error: onError
		});

		return searchRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.parseAmazonResultItem = function($resultItem) {

		var isFiltered = false;
		var	filter = '(' + FILTERED_NAMES.join('|') + ')';
		var	re = new RegExp(filter, 'i');

		// get attributes from xml for filter check
		var itemData = {
			name: $resultItem.find('Title').text(),
			platform: $resultItem.find('Platform').text()
		};

		// result has been filtered
		if (re.test(itemData.name) || itemData.platform === '') {

			itemData.isFiltered = true;

		// not filtered > add more properties to itemData
		} else {

			itemData.id = $resultItem.find('ASIN').text();
			itemData.asin = $resultItem.find('ASIN').text();
			itemData.gbombID = 0;
			itemData.smallImage = $resultItem.find('ThumbnailImage > URL:first').text() || '';
			itemData.thumbnailImage = $resultItem.find('MediumImage > URL:first').text() || '';
			itemData.largeImage = $resultItem.find('LargeImage > URL:first').text() || '';
			itemData.description = $resultItem.find('EditorialReview > Content:first').text() || '';
			itemData.releaseDate = $resultItem.find('ReleaseDate').text() || '1900-01-01';

			// add custom formatted properties
			// standard platform name
			itemData.platform = Utilities.matchPlatformToIndex(itemData.platform).name;
			// relative/calendar date
			if (itemData.releaseDate !== '1900-01-01') {
				itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
			} else {
				itemData.calendarDate = 'Unknown';
			}
		}

		return itemData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemDetail = function(asin, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedItem = getCachedItem(asin);

		// load cached gb data
		if (cachedItem) {

			// return updated source item
			onSuccess(cachedItem);

		// download amazon item
		} else {

			// add to queue
			if (!_.has(getAmazonItemDetailQueue, asin)) {
				getAmazonItemDetailQueue[asin] = [];
			}
			getAmazonItemDetailQueue[asin].push(onSuccess);

			// run for first call only
			if (getAmazonItemDetailQueue[asin].length === 1) {

				// browse node, search terms and response group in url
				var requestData = {
					'asin': asin,
					'response_group': 'Medium'
				};

				$.ajax({
					url: AMAZON_DETAIL_URL,
					type: 'GET',
					data: requestData,
					dataType: 'xml',
					cache: true,
					success: function(data) {

						// iterate queued return methods
						_.each(getAmazonItemDetailQueue[asin], function(successMethod) {

							// cache result
							amazonItemCache[asin] = data;

							// return data
							successMethod(data);
						});

						// empty queue
						getAmazonItemDetailQueue[asin] = [];
					},
					error: onError
				});
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemOffers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemOffers = function(asin, sourceItem, onSuccess, onError) {

		// find in amazon offer cache first
		var cachedOffer = getCachedOffer(asin);
		// load cached amazon offer
		if (cachedOffer) {
			// add score data to source item
			sourceItem.offers = cachedOffer;

			// return updated source item
			onSuccess(cachedOffer);

		// get new offer data
		} else {

			// add to queue
			if (!_.has(getAmazonItemOffersQueue, asin)) {
				getAmazonItemOffersQueue[asin] = [];
			}
			getAmazonItemOffersQueue[asin].push(onSuccess);

			// run for first call only
			if (getAmazonItemOffersQueue[asin].length === 1) {

				// OfferSummary, OfferListings, Offers, OfferFull
				var requestData = {
					'asin': asin,
					'response_group': 'OfferFull'
				};

				$.ajax({
					url: AMAZON_DETAIL_URL,
					type: 'GET',
					data: requestData,
					dataType: 'xml',
					cache: true,
					success: function(data) {

						// iterate queued return methods
						_.each(getAmazonItemOffersQueue[asin], function(successMethod) {

							// parse
							var offerItem = parseAmazonOffers(data, sourceItem);

							// cache result
							amazonOffersCache[asin] = offerItem;

							// return data
							successMethod(offerItem);
						});

						// empty queue
						getAmazonItemOffersQueue[asin] = [];
					},
					error: onError
				});
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatOfferData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatOfferData = function(offerItem) {

		var buyNowPrice = null;
		var buyNowRawPrice = null;


		// iterate offers
		for (var i = 0, len = offerItem.offers.length; i < len; i++) {
			if (offerItem.offers[i].availability === 'now') {
				buyNowPrice = offerItem.offers[i].price;
				buyNowRawPrice = offerItem.offers[i].rawPrice;
			}
		}

		buyNowPrice = buyNowPrice || offerItem.lowestNewPrice;

		// check for 'too low to display'
		if (buyNowPrice === 'Too low to display') {
			buyNowPrice = 'n/a';
			buyNowRawPrice = 0;
		}
		if (offerItem.lowestNewPrice === 'Too low to display') {
			offerItem.lowestNewPrice = 'n/a';
		}

		offerItem.buyNowPrice = buyNowPrice;
		offerItem.buyNowRawPrice = buyNowRawPrice;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedOffer -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedOffer = function(asin) {

		var amazonOfferItem = null;

		if (typeof amazonOffersCache[asin] !== 'undefined') {
			amazonOfferItem = amazonOffersCache[asin];
		}

		return amazonOfferItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItem = function(id) {

		var amazonItem = null;

		if (typeof amazonItemCache[id] !== 'undefined') {
			amazonItem = amazonItemCache[id];
		}

		return amazonItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOffers = function(data, sourceItem) {

		var offerItem = {};

		// iterate xml results, construct offers
		$('Item', data).each(function() {

			// parse amazon result item, add data to offerItem
			offerItem = parseAmazonOfferItem($(this));
		});

		// add offerItem to item model
		sourceItem.offers = offerItem;

		return offerItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOfferItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOfferItem = function($resultItem) {

		var offerItem = {};
		var offer = {};

		// remove $ sign
		var re = /\$/;

		// get attributes from xml
		offerItem.lowestNewPrice = $resultItem.find('LowestNewPrice FormattedPrice').text().replace(re, '');
		offerItem.lowestUsedPrice = $resultItem.find('LowestUsedPrice FormattedPrice').text().replace(re, '');
		offerItem.totalNew = $resultItem.find('TotalNew').text();
		offerItem.totalUsed = $resultItem.find('TotalUsed').text();
		offerItem.totalOffers = $resultItem.find('TotalOffers').text();
		offerItem.offersURL = $resultItem.find('MoreOffersUrl').text();
		offerItem.offersURLNew = $resultItem.find('MoreOffersUrl').text() + '&condition=new';
		offerItem.offersURLUsed = $resultItem.find('MoreOffersUrl').text() + '&condition=used';

		// convert offer url to a product url
		var offerRE = /offer-listing/gi;
		offerItem.productURL = offerItem.offersURL.replace(offerRE, 'product');
		offerItem.offers = [];

		// iterate offers
		$('Offer', $resultItem).each(function() {

			offer = {};

			offer.price = $(this).find('Price FormattedPrice').text().replace(re, '');
			offer.rawPrice = $(this).find('Price Amount').text();
			offer.availability = $(this).find('AvailabilityType').text();
			offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

			offerItem.offers.push(offer);
		});

		// format offer data
		formatOfferData(offerItem);

		return offerItem;
	};

})(tmz.module('amazon'), tmz, jQuery, _, moment);


// GiantBomb
(function(GiantBomb, tmz, $, _, moment) {
	"use strict";

    // module references
	var Amazon = tmz.module('amazon'),

		// REST URLS
		GIANTBOMB_SEARCH_URL = tmz.api + 'giantbomb/search/',
		GIANTBOMB_DETAIL_URL = tmz.api + 'giantbomb/detail/',

		// data
		giantBombDataCache = {},
		giantBombItemCache = {},

		// request queue
		getGiantBombItemDataQueue = {},
		getGiantBombItemDetailQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.searchGiantBomb = function(keywords, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);

		// list of fields to get as query parameter
		var fieldList = ['id', 'name', 'original_release_date', 'image'];

		var requestData = {
			'field_list': fieldList.join(','),
			'keywords': keywords,
			'page': 0
		};

		var searchRequest = $.ajax({
			url: GIANTBOMB_SEARCH_URL,
			type: 'GET',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});

		return searchRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.parseGiantBombResultItem = function(resultItem) {
		var itemData = {
			id: resultItem.id,
			asin: 0,
			gbombID: resultItem.id,
			name: resultItem.name,
			platform: 'n/a'
		};

		// format date
		if (resultItem.original_release_date && resultItem.original_release_date !== '') {
			itemData.releaseDate = resultItem.original_release_date.split(' ')[0];
		} else {
			itemData.releaseDate = '1900-01-01';
		}

		// calendar date
		if (itemData.releaseDate !== '1900-01-01') {
			itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
		} else {
			itemData.calendarDate = 'Unknown';
		}

		// set small url
		if (resultItem.image && resultItem.image.small_url && resultItem.image.small_url !== '') {
			itemData.smallImage = resultItem.image.small_url;
		} else {
			itemData.smallImage = 'no image.png';
		}

		// set thumb url
		if (resultItem.image && resultItem.image.thumb_url && resultItem.image.thumb_url !== '') {
			itemData.thumbnailImage = resultItem.image.thumb_url;
		} else {
			itemData.thumbnailImage = 'no image.png';
		}

		// set large url
		if (resultItem.image && resultItem.image.super_url && resultItem.image.super_url !== '') {
			itemData.largeImage = resultItem.image.super_url;
		} else {
			itemData.largeImage = 'no image.png';
		}

		// set description
		if (resultItem.description && resultItem.description  !== '') {
			itemData.description = resultItem.description;
		} else {
			itemData.description = 'No Description';
		}

		return itemData;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemPlatform = function(gbombID, onSuccess, onError) {

		// list of fields to get as query parameter
		var fieldList = ['platforms'];

		getGiantBombItem(gbombID, fieldList, function(data) {
			onSuccess(data, gbombID);
		}, onError);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemData = function(gbombID, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedData = getCachedData(gbombID);

		// load cached gb data
		if (cachedData) {

			// return updated source item
			onSuccess(cachedData);

		// download gb data
		} else {

			// add to queue
			if (!_.has(getGiantBombItemDataQueue, gbombID)) {
				getGiantBombItemDataQueue[gbombID] = [];
			}
			getGiantBombItemDataQueue[gbombID].push(onSuccess);

			// run for first call only
			if (getGiantBombItemDataQueue[gbombID].length === 1) {

				// download data
				var fieldList = ['description', 'site_detail_url', 'videos'];

				// giantbomb item request
				getGiantBombItem(gbombID, fieldList, function(data) {

					// iterate queued return methods
					_.each(getGiantBombItemDataQueue[gbombID], function(successMethod) {

						// cache result
						giantBombDataCache[gbombID] = data.results;

						// return data
						successMethod(data.results);
					});

					// empty queue
					getGiantBombItemDataQueue[gbombID] = [];

				}, onError);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemDetail = function(gbombID, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedItem = getCachedItem(gbombID);

		// load cached gb data1
		if (cachedItem) {

			// return updated source item
			onSuccess(cachedItem);

		// download gb item
		} else {

			// add to queue
			if (!_.has(getGiantBombItemDetailQueue, gbombID)) {
				getGiantBombItemDetailQueue[gbombID] = [];
			}
			getGiantBombItemDetailQueue[gbombID].push(onSuccess);

			// run for first call only
			if (getGiantBombItemDetailQueue[gbombID].length === 1) {

				// download data
				var fieldList = ['id', 'name', 'original_release_date', 'image'];

				// giantbomb item request
				getGiantBombItem(gbombID, fieldList, function(data) {

					// iterate queued return methods
					_.each(getGiantBombItemDetailQueue[gbombID], function(successMethod) {

						// cache result
						giantBombItemCache[gbombID] = data.results;

						// return data
						successMethod(data.results);
					});

					// empty queue
					getGiantBombItemDetailQueue[gbombID] = [];

				}, onError);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItem = function(gbombID, fieldList, onSuccess, onError) {

		var requestData = {
			'field_list': fieldList.join(','),
			'id': gbombID
		};

		$.ajax({
			url: GIANTBOMB_DETAIL_URL,
			type: 'GET',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(id) {

		var giantBombData = null;

		if (typeof giantBombDataCache[id] !== 'undefined') {
			giantBombData = giantBombDataCache[id];
		}

		return giantBombData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItem = function(id) {

		var giantBombItem = null;

		if (typeof giantBombItemCache[id] !== 'undefined') {
			giantBombItem = giantBombItemCache[id];
		}

		return giantBombItem;
	};


})(tmz.module('giantbomb'), tmz, jQuery, _, moment);


// Metacritic
(function(Metacritic, tmz, $, _) {
	"use strict";

    // module references
	var Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		ItemData = tmz.module('itemData'),

		// REST URL
		METACRITIC_SEARCH_URL = tmz.api + 'metacritic/search/',
		METACRITIC_CACHE_URL = tmz.api + 'metacritic/cache/',

		// properties
		metacriticDomain = 'metacritic.com',

		// data
		metascoreCache = {},

		// request queues
		getMetascoreQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.getMetascore = function(searchTerms, sourceItem, fromSearch, onSuccess) {

		var ajax = null;

		// find in cache first
		var cachedScore = getCachedMetascore(sourceItem.asin, sourceItem.gbombID, sourceItem.platform);

		if (cachedScore) {

			ajax = cachedScore;

			// add score data to source item
			sourceItem.metascore = cachedScore.metascore;
			sourceItem.metascorePage = cachedScore.metascorePage;

			// return updated source item
			onSuccess(sourceItem);

		// fetch score data
		} else {

			// add to queue
			var queueKey = searchTerms + '_' + sourceItem.platform;

			if (!_.has(getMetascoreQueue, queueKey)) {
				getMetascoreQueue[queueKey] = [];
			}
			getMetascoreQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getMetascoreQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupMetacriticSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms),
					'platform': encodeURI(sourceItem.platform)
				};

				ajax = $.ajax({
						url: METACRITIC_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// save values before updated with current info
							var previousMetascore = sourceItem.metascore;

							// parse result > modify sourceItem
							var result = parseMetascoreResults(cleanedSearchTerms, data, sourceItem);

							// add results to sourceItem
							addMetascoreDatatoItem(result, sourceItem);

							// check if source item score or page differs from return score/page
							if (!fromSearch && sourceItem.metascore != previousMetascore) {
								// update metacritic data for source item record
								ItemData.updateMetacritic(sourceItem);
							}

							// iterate queued return methods
							_.each(getMetascoreQueue[queueKey], function(successMethod) {
								// add to local cache
								addToMetascoreCache(sourceItem.asin, sourceItem.gbombID, sourceItem.platform, sourceItem);
								// return data
								successMethod(sourceItem);
							});

							// empty queue
							getMetascoreQueue[queueKey] = [];
						}
					});
			}
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascoreData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.displayMetascoreData = function(page, score, metascoreSelector) {

		var $metascoreContainer = $(metascoreSelector);
		var textScore = score;

		// determine score color
		var colorClass = 'favorable';
		if (score < 0) {
			textScore = 'n/a';
			colorClass = 'unavailable';
		} else if (score < 50) {
			colorClass = 'unfavorable';
		} else if (score < 75) {
			colorClass = 'neutral';
		}

		$metascoreContainer
			.html(textScore)
			.removeClass('unavailable')
			.removeClass('unfavorable')
			.removeClass('neutral')
			.removeClass('favorable')
			.addClass(colorClass)
			.attr('href', 'http://www.' + metacriticDomain + page)
			.attr('data-score', score)
			.attr('data-original-title', metacriticDomain + ' ' + page)
			.show();

		// activate tooltip
		$metascoreContainer.tooltip({placement: 'left'});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cleanupMetacriticSearchTerms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cleanupMetacriticSearchTerms = function(searchTerms) {

		// remove ':', '&'
		re = /\s*[:&]\s*/g;
		var cleanedSearchTerms = searchTerms.replace(re, ' ');

		// convert spaces to '+'
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '+');

		return cleanedSearchTerms;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedMetascore = function(asin, gbombID, platform) {

		var metascoreItem = null;

		// amazon id
		if (typeof metascoreCache[asin + '_' + platform] !== 'undefined') {
			metascoreItem = metascoreCache[asin + '_' + platform];

		// giant bomb id
		} else if (typeof metascoreCache[gbombID + '_' + platform] !== 'undefined') {
			metascoreItem = metascoreCache[gbombID + '_' + platform];
		}

		return metascoreItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToMetascoreCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToMetascoreCache = function(asin, gbombID, platform, sourceItem) {

		// add to metascoreCache linked by asin
		if (asin != '0') {
			metascoreCache[asin + '_' + platform] = {metascorePage: sourceItem.metascorePage, metascore: sourceItem.metascore};
		}
		// add to metascoreCache linked by gbombID
		if (gbombID != '0') {
			metascoreCache[gbombID + '_' + platform] = {metascorePage: sourceItem.metascorePage, metascore: sourceItem.metascore};
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetascoreResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetascoreResults = function(keywords, data, sourceItem) {

		var result = null;

		// parse raw result
		if (typeof data.metascore === 'undefined') {

			// get result that matches sourceItem
			result = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (result) {
				addToServerCache(keywords, sourceItem.platform, result.metascore, result.metascorePage);
			}

		// parse cached result
		} else {

			result = data;
		}

		return result;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addMetascoreDatatoItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addMetascoreDatatoItem = function(result, sourceItem) {

		// add/update metascore data to sourceItem
		if (result && result.metascore !== '') {
			sourceItem.metascore = result.metascore;
			sourceItem.displayMetascore = result.metascore;
			sourceItem.metascorePage = result.metascorePage;
		} else if (result) {
			sourceItem.metascore = -1;
			sourceItem.displayMetascore = 'n/a';
			sourceItem.metascorePage = result.metascorePage;
		} else {
			sourceItem.metascore = -1;
			sourceItem.displayMetascore = 'n/a';
			sourceItem.metascorePage = '';
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(keywords, platform, metascore, metascorePage) {

		var requestData = {
			'keywords': encodeURI(keywords),
			'platform': encodeURI(platform),
			'metascore': encodeURI(metascore),
			'metascorePage': encodeURI(metascorePage)
		};

		$.ajax({
			url: METACRITIC_CACHE_URL,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {


			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMatchedSearchResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMatchedSearchResult = function(data, sourceItem) {

		var results = $('#main', data).find('.result');
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$(results).each(function() {

			// convert to date object
			var releaseDateObject = new Date($(this).find('.release_date .data').text());
			// format month
			var month = releaseDateObject.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			// format date
			var date = releaseDateObject.getDate();
			date = date < 10 ? '0' + date : date;

			// create standard item
			searchItem = {
				name: $(this).find('.product_title a').text(),
				releaseDate: releaseDateObject.getFullYear() + '-' + month + '-' + date,
				platform: $(this).find('.platform').text(),
				metascore: $(this).find('.metascore').text(),
				metascorePage: $(this).find('.product_title a').attr('href')
			};

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		});

		return bestMatch;
	};

})(tmz.module('metacritic'), tmz, jQuery, _);


// Wikipedia
(function(Wikipedia) {

	// Dependencies
	var User = tmz.module('user'),
		Utilities = tmz.module('utilities'),
		ItemLinker = tmz.module('itemLinker'),

		// wikipedia cache
		wikipediaPageCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getWikipediaPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Wikipedia.getWikipediaPage = function(title, sourceItem, onSuccess) {

		// find in attributes cache first
		var itemAttributes = wikipediaPageCache[sourceItem.id];

		if (itemAttributes && typeof itemAttributes.wikipediaPage !== 'undefined') {

			// display attribute
			onSuccess(itemAttributes.wikipediaPage);

		// search wikipedia
		} else {


			searchWikipedia(title, function(data) {

				// get page array
				var pageArray = null;
				_.each(data, function(item, key) {
					pageArray = item;
				});

				// match page to sourceItem
				ItemLinker.findWikipediaMatch(pageArray, sourceItem, function(item) {

					// get wikipedia page details
					getWikipediaPageDetails(item.name, function(data) {

						// get wikipedia page url
						_.each(data.query.pages, function(pageItem, key){

							// add to cache
							if (itemAttributes) {
								itemAttributes.wikipediaPage = pageItem.fullurl;
							} else {
								wikipediaPageCache[sourceItem.id] = {wikipediaPage: pageItem.fullurl};
							}

							// display attribute
							onSuccess(pageItem.fullurl);
						});
					});
				});
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchWikipedia
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchWikipedia = function(keywords, onSuccess, onError) {

		var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=?';

		var requestData = {
			'search': keywords,
			'prop': 'revisions',
			'rvprop': 'content'
		};

        $.ajax({
            url: url,
            type: 'GET',
            data: requestData,
            dataType: 'jsonp',
            cache: false,
            crossDomain: true,
            success: onSuccess,
            error: onError
        });

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getWikipediaPageDetails
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getWikipediaPageDetails = function(pageTitle, onSuccess, onError) {

		var url = 'http://en.wikipedia.org/w/api.php?action=query&format=json&callback=?';

		var requestData = {
			'titles': pageTitle,
			'prop': 'info',
			'inprop': 'url'
		};

        $.ajax({
            url: url,
            type: 'GET',
            data: requestData,
            dataType: 'jsonp',
            cache: false,
            crossDomain: true,
            success: onSuccess,
            error: onError
        });

	};


})(tmz.module('wikipedia'));


// GameTrailers
(function(GameTrailers, tmz, $, _) {
	"use strict";

    // module references
	var Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		ItemData = tmz.module('itemData'),

		// REST URL
		GAMETRAILERS_SEARCH_URL = tmz.api + 'gametrailers/search/',
		GAMETRAILERS_CACHE_URL = tmz.api + 'gametrailers/cache/',

		// properties
		GAMETRAILERS_BASE_URL = 'gametrailers.com',

		// data
		gametrailersPageCache = {},

		// request queues
		getGametrailersQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameTrailers.getGametrailersPage = function(searchTerms, sourceItem, onSuccess) {

		var ajax = null;

		// find in cache first
		var gameTrailersItem = getCachedGametrailersPage(searchTerms);

		if (gameTrailersItem) {

			// add gametrailersPage to source item
			sourceItem.gametrailersPage = gameTrailersItem.gametrailersPage;

			// return updated source item
			onSuccess(sourceItem.gametrailersPage);

		// fetch gametrailersPage
		} else {

			// add to queue
			var queueKey = searchTerms + '_';

			if (!_.has(getGametrailersQueue, queueKey)) {
				getGametrailersQueue[queueKey] = [];
			}
			getGametrailersQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getGametrailersQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms)
				};

				ajax = $.ajax({
						url: GAMETRAILERS_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// parse result
							var gametrailersPage = parseGametrailersResults(cleanedSearchTerms, data, sourceItem);

							// iterate queued return methods
							_.each(getGametrailersQueue[queueKey], function(successMethod) {

								// add gametrailersPage to source item
								sourceItem.gametrailersPage = gametrailersPage;
								// add to local cache
								addToGametrailersCache(searchTerms, gametrailersPage);
								// return data
								successMethod(gametrailersPage);
							});

							// empty queue
							getGametrailersQueue[queueKey] = [];
						}
					});
			}
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cleanupSearchTerms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cleanupSearchTerms = function(searchTerms) {

		// remove ':', '&'
		re = /\s*[:&]\s*/g;
		var cleanedSearchTerms = searchTerms.replace(re, ' ');

		// convert spaces to '+'
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '+');

		return cleanedSearchTerms;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedGametrailersPage = function(searchTerms) {

		var gametrailersPage = null;

		if (typeof gametrailersPageCache[searchTerms] !== 'undefined') {
			gametrailersPage = gametrailersPageCache[searchTerms];
		}

		return gametrailersPage;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToGametrailersCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGametrailersCache = function(searchTerms, gametrailersPage) {

		gametrailersPageCache[searchTerms] = {gametrailersPage: gametrailersPage};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGametrailersResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGametrailersResults = function(keywords, data, sourceItem) {

		var gametrailersPage = null;

		// parse raw result
		if (typeof data.gametrailersPage === 'undefined') {

			// get result that matches sourceItem
			gametrailersPage = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (gametrailersPage) {
				addToServerCache(keywords, gametrailersPage);
			}

		// parse cached result
		} else {
			gametrailersPage = data.gametrailersPage;
		}

		return gametrailersPage;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(searchTerms, gametrailersPage) {

		var requestData = {
			'keywords': encodeURI(searchTerms),
			'gametrailersPage': encodeURI(gametrailersPage)
		};

		$.ajax({
			url: GAMETRAILERS_CACHE_URL,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMatchedSearchResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMatchedSearchResult = function(data, sourceItem) {

		var results = $('#games', data).find('.video_game_information_child');
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		$(results).each(function() {

			// create standard item
			searchItem = {
				name: $(this).find('.content h3 a').text(),
				releaseDate: $(this).find('.content dl dd:eq(1) a').text(),
				gametrailersPage: $(this).find('.content h3 a').attr('href')
			};

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);



			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		});

		return bestMatch.gametrailersPage + '/videos-trailers';
	};

})(tmz.module('gameTrailers'), tmz, jQuery, _);


// GameStats
(function(GameStats, tmz, $, _) {
	"use strict";

    // module references

	// properties

	// REST URL
	var POPULAR_LIST_URL = tmz.api + 'list/popular/',

		// data
		gameStatsListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getPopularGamesListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameStats.getPopularGamesListByPlatform = function(platform, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform);

		if (cachedList) {


			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'platform': platform
			};

			$.ajax({
				url: POPULAR_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {


					// cache result
					gameStatsListCache[platform] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(platform) {

		var gameStatsList = null;

		if (typeof gameStatsListCache[platform] !== 'undefined') {
			gameStatsList = gameStatsListCache[platform];
		}

		return gameStatsList;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToGamestatsCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGamestatsCache = function() {


	};




})(tmz.module('gameStats'), tmz, jQuery, _);


// IGN
(function(IGN, tmz, $, _) {

    // module references

	// properties

	// REST URL
	var UPCOMING_LIST_URL = tmz.api + 'list/upcoming/',

		// data
		IGNUpcomingListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUpcomingGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getUpcomingGames = function(platform, page, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform, page);

		if (cachedList) {

			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'platform': platform,
				'page': page
			};

			$.ajax({
				url: UPCOMING_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					IGNUpcomingListCache[platform + '_' + page] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(platform, page) {

		var IGNUpcomingList = null;

		if (typeof IGNUpcomingListCache[platform + '_' + page] !== 'undefined') {
			IGNUpcomingList = IGNUpcomingListCache[platform + '_' + page];
		}

		return IGNUpcomingList;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToIGNCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToIGNCache = function() {


	};

})(tmz.module('ign'), tmz, jQuery, _);


// ReleasedList
(function(ReleasedList, tmz, $, _) {
	"use strict";

    // module references

	// properties

	// REST URL
	var RELEASED_LIST_URL = tmz.api + 'list/released/',

		// data
		releasedListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getReleasedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ReleasedList.getReleasedGames = function(platform, year, month, day, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(year, month, day);

		if (cachedList) {

			// filter results based on platform
			var filteredResults = filterListResults(cachedList, platform);
					
			// return list
			onSuccess(filteredResults);

		// fetch list data
		} else {
			var requestData = {
				'year': year,
				'month': month,
				'day': day
			};

			$.ajax({
				url: RELEASED_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// filter results based on platform
					var filteredResults = filterListResults(data, platform);

					// cache result
					releasedListCache[year + '_' + month + '_' + day] = filteredResults;

					// return items to onSuccess function
					onSuccess(filteredResults);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* filterListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var filterListResults = function(listResults, platform) {

		var filteredResults = [];

		// iterate list results
		for (var i = 0, len = listResults.length; i < len; i++) {

			if (_.has(listResults[i], 'platforms')) {
				var listPlatforms = listResults[i].platforms.toLowerCase();

				// find platform substring in listPlatforms
				var searchIndex = listPlatforms.search(platform);

				// result contains platform add to filteredResults
				if (searchIndex !== -1) {
					filteredResults.push(listResults[i]);
				}
			}
		}

		return filteredResults;
	};
	

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(year, month, day) {

		var releasedList = null;

		if (typeof releasedListCache[year + '_' + month + '_' + day] !== 'undefined') {
			releasedList = releasedListCache[year + '_' + month + '_' + day];
		}

		return releasedList;
	};


})(tmz.module('releasedList'), tmz, jQuery, _);


// ItemLinker
(function(ItemLinker, tmz, $, _) {
	"use strict";

	// Dependencies
	var Amazon = tmz.module('amazon'),
		GiantBomb = tmz.module('giantbomb'),
		Utilities = tmz.module('utilities');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* standardizeTitle -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.standardizeTitle = function(title) {

		var sanitizedName = title;
		var re = null;
		var reRoman = null;

		var match = null;
		var match2 = null;
		var roman = '';
		var dec = 0;
		var num = 0;
		var arr = null;

		// remove brackets and parenthesis and content inside
		sanitizedName = sanitizedName.replace(/\s*[\[\(].*[\)\]]/gi, '');

		// remove the word: trophies
		sanitizedName = sanitizedName.replace(/\s*trophies/gi, '');
		// remove word that appears before 'edition'
		sanitizedName = sanitizedName.replace(/\S+ edition$/gi, '');
		// remove words appearing after 'with'
		sanitizedName = sanitizedName.replace(/\swith\s.*/gi, '');

		// remove 'the ' if at the start of title
		sanitizedName = sanitizedName.replace(/^\s*the\s/gi, '');

		// remove words appearing after '-' unless it is less than 4 chars
		re = new RegExp('\\s*-.*', 'gi');
		match = re.exec(sanitizedName);

		if (match && match[0].length > 3) {
			sanitizedName = sanitizedName.replace(re, '');
		}

		return sanitizedName.toLowerCase();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getSimilarityScore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getSimilarityScore = function(sourceItem, searchItem) {

		// matching properties
		var score = 0;

		// use standard name for search result
		var standardResultName = ItemLinker.standardizeTitle(searchItem.name);

		// exact name check
		if (sourceItem.standardName === searchItem.name.toLowerCase()) {

			score += 50;

		// fuzzy name check
		} else {
			// check if searchItem title exists within original title and vice versa
			var reSource = new RegExp(sourceItem.standardName, 'gi');
			var reSearch = new RegExp(standardResultName, 'gi');
			var sourceInTarget = reSource.exec(standardResultName);
			var targetInSource = reSearch.exec(sourceItem.standardName);

			if ((sourceInTarget && sourceInTarget[0].length > 0) || (targetInSource && targetInSource[0].length > 0)) {

				score += 5;
			}
		}

		// exact release date check
		if (typeof searchItem.releaseDate !== 'undefined') {

			if (sourceItem.releaseDate === searchItem.releaseDate) {
				score += 10;

			// fuzzy release date check
			} else {
				var diff = Math.floor((Date.parse(sourceItem.releaseDate) - Date.parse(searchItem.releaseDate) ) / 86400000);

				// don't subtract score if search result date is unknown/unreleased
				if (!isNaN(diff) && searchItem.releaseDate !== '1900-01-01')  {
					score -= Math.abs(diff / 365);
				}
			}
		}

		// platform match
		if (typeof searchItem.platform !== 'undefined') {
			// get standard platform name from platform
			var standardPlatform = Utilities.matchPlatformToIndex(searchItem.platform).name;

			if (sourceItem.platform === standardPlatform) {
				score += 20;
			}
		}

		return score;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* convertRomanNumerals -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.convertRomanNumerals = function(name) {

		var reRoman = new RegExp('\\s[XVI]+', 'gi');
		var match = reRoman.exec(name);

		// roman numeral found
		if (match && match[0].length > 0) {

			var roman = match[0];
			// remove III first and set dec to start at 3
			// the simplified converter below does add 'III' of anything correctly
			var re = new RegExp('III', 'gi');
			var match2 = re.exec(roman);
			var dec = '';

			if (match2 && match2[0].length > 0) {
				dec = 3;
				roman = roman.replace(re, '');
			}

			var arr = roman.split('');
			var num = null;

			// iterate each roman character except last blank character
			for (var i = arr.length - 1; i >= 1; i--) {
				switch(arr[i]) {
					case 'I':
					num = 1;
				break;
					case 'V':
					num = 5;
				break;
					case 'X':
					num = 10;
				break;
			}

			if (num < dec) {
				dec = dec - num;
			} else {
				dec = dec + num;
			}

			}

			// replace roman with decimal
			name = name.replace(reRoman, ' ' + dec);
		}

		return name;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findItemOnAlternateProvider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findItemOnAlternateProvider = function(item, provider, preventMultipleRequests, onSuccess) {

		var searchRequest = null;

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:

				var searchName = item.standardName;

				// run search for giantbomb
				searchRequest = GiantBomb.searchGiantBomb(searchName, function(data) {
					findGiantbombMatch(data, item, onSuccess);
				});
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:

				var browseNode = 0;

				// run same platform search
				if (item.platform !== 'n/a') {
					browseNode = Utilities.getStandardPlatform(item.platform).amazon;
				}

				// run search for amazon
				searchRequest = Amazon.searchAmazon(item.name, browseNode, function(data) {
					findAmazonMatch(data, item, onSuccess, false);
				}, null, preventMultipleRequests);
				break;
		}

		return searchRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getLinkedItemData
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getLinkedItemData = function(item, provider, onSuccess) {

		switch (provider) {

			// amazon is provider > fetch from giantbomb
			case Utilities.SEARCH_PROVIDERS.Amazon:

				// get item from giantbomb
				GiantBomb.getGiantBombItemDetail(item.gbombID, function(data) {
					getGiantBombItemDetail_result(data, onSuccess);
				});
				break;

			// giantbomb is provider > fetch from amazon
			case Utilities.SEARCH_PROVIDERS.GiantBomb:

				// get item from amazon
				Amazon.getAmazonItemDetail(item.asin, function(data) {
					getAmazonItemDetail_result(data, onSuccess);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findWikipediaMatch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findWikipediaMatch = function(data, sourceItem, onSuccess) {

		var results = data;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// create searchItem object
			searchItem = {
				'name': results[i]
			};

			// init best match with first item
			if (i === 0) {
				bestMatch = searchItem;
			}

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		}

		// return best match to onSuccess method
		if (results.length !== 0) {
			// return best match
			onSuccess(bestMatch);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getAmazonItemDetail_result = function(data, onSuccess) {

		var detailItem = {};
		// iterate results
		$('Item', data).each(function() {

			// parse item and set detailItem
			detailItem = Amazon.parseAmazonResultItem($(this));
		});

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemDetail_result = function(data, onSuccess) {

		// parse result item and set detailItem
		var detailItem = GiantBomb.parseGiantBombResultItem(data);

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findAmazonMatch
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findAmazonMatch = function(data, sourceItem, onSuccess, lastSearch) {

		var resultLength = ($('Item', data).length);
		var searchItem = {};
		var count = 0;

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$('Item', data).each(function() {

			// parse item and return searchItem
			searchItem = Amazon.parseAmazonResultItem($(this));

			// searchItem not filtered
			if (typeof searchItem.isFiltered === 'undefined') {


				// save first non-filtered result
				if (count === 0) {
					bestMatch = searchItem;
				}

				count++;
				// get similarity score
				score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

				// check if score is new best
				if (score > bestScore) {
					bestMatch = searchItem;
					bestScore = score;

				}
			}
		});

		// return best match to onSuccess method
		if (bestMatch) {
			// return best match
			onSuccess(bestMatch);

		// re-run search without platform filter - only if this hasn't been run before
		} else if (!lastSearch) {
			Amazon.searchAmazon(sourceItem.name, 0, function(data) {
				findAmazonMatch(data, sourceItem, onSuccess, true);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findGiantbombMatch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findGiantbombMatch = function(data, sourceItem, onSuccess) {

		var results = data.results;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// parse result into searchItem object
			searchItem = GiantBomb.parseGiantBombResultItem(results[i]);

			// init best match with first item
			if (i === 0) {
				bestMatch = searchItem;
			}

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		}

		// return best match to onSuccess method
		if (results.length !== 0) {
			// return best match
			onSuccess(bestMatch);
		}
	};

})(tmz.module('itemLinker'), tmz, jQuery, _);

// ITEM VIEW
(function(ImportView, tmz, $, _) {
	"use strict";

    // modules references
    var User = tmz.module('user'),
		Utilities = tmz.module('utilities'),
		ItemData = tmz.module('itemData'),
		TagView = tmz.module('tagView'),
		ItemView = tmz.module('itemView'),
		Amazon = tmz.module('amazon'),
		Metacritic = tmz.module('metacritic'),
		ItemLinker = tmz.module('itemLinker'),
		GiantBomb = tmz.module('giantbomb'),

		// constants
		INPUT_SOURCES = ['Steam', 'PSN', 'XBL'],
		INPUT_SOURCES_ID_NAME = ['Account Name', 'PSN ID', 'Gamertag'],

		// properties
		currentSourceID = null,
		sourceImportStarted = {},

		// data
		importedGames = [],

		// element cache
		$importContainer = $('#importContainer'),
		$importResults = $('#importResults'),
		$importResultsBody = $('#importResults tbody'),
		$startImportBtn = $('#startImport_btn'),
		$confirmImportBtn = $('#confirmImport_btn'),
		$cancelImportBtn = $('#cancelImport_btn'),
		$sourceUser = $('#sourceUser'),

		$importSourceID = $('#importSourceID'),
		$importSourceName = $('#importSourceName'),

		// modal
		$importConfigModal = $('#importConfig-modal'),
		$importModal = $('#import-modal'),

		$loadingStatus = $importContainer.find('.loadingStatus'),

		// templates
		importResultsTemplate = _.template($('#import-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var init = function() {

		createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var createEventHandlers = function() {

		// start import button: click
		$startImportBtn.click(function(e) {
			e.preventDefault();

			if ($sourceUser.val() !== '') {
				// begin import process
				importSource($sourceUser.val());
			}
		});

		// source user field: keyup
		$sourceUser.keyup(function(e) {
			e.preventDefault();

			// enter key
			if (e.which === 13 && $sourceUser.val() !== '') {

				// begin import process
				importSource($sourceUser.val());
			}
		});

		// confirm import button: click
		$confirmImportBtn.click(function(e) {
			e.preventDefault();

			// begin adding games to list
			addImportedGames();
		});

		// cancel import button: click
		$cancelImportBtn.click(function(e) {
			e.preventDefault();

			cancelImport();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* appendResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var appendResults = function(item) {

		// get model data
		var templateData = {'item': item};

		// append model to importResults
		$importResultsBody.append(importResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearImportView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearImportView = function() {

		$importResults.html('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startImport - beging game import
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startImport = function(sourceID) {

		currentSourceID = sourceID;

		// previous import not complete and requested same source import, resume import
		if (_.has(sourceImportStarted, sourceID)) {

			// hide config and show import modal
			$importConfigModal.modal('hide');
			$importModal.modal('show');

		// start new import
		} else {

			// show source config
			showImportConfigModal();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showImportConfigModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showImportConfigModal = function() {

		// set source name
		$importSourceID.text(INPUT_SOURCES_ID_NAME[currentSourceID]);
		$importSourceName.text(INPUT_SOURCES[currentSourceID]);

		// show modal
		$importConfigModal.modal('show');

		// focus source user filed
		$sourceUser.focus();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importSource -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importSource = function(sourceUser) {

		// started source import
		sourceImportStarted[currentSourceID] = true;

		// reset data
		importedGames = [];

		// clear import list
		$importResultsBody.empty();

		// hide loading status
		$loadingStatus.stop().hide();

		// remove ready status from modal
		$importModal.removeClass('ready');

		// hide config and show import modal
		$importConfigModal.modal('hide');
		$importModal.modal('show');

		// show loading status
		$loadingStatus.fadeIn();

		// import games
		ItemData.importGames(currentSourceID, sourceUser, function(importedTitles) {

			// parse imported titles
			parseImportList(importedTitles);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cancelImport -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cancelImport = function() {

		delete sourceImportStarted[currentSourceID];

		// show config and hide import modal
		showImportConfigModal();
		$importModal.modal('hide');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseImportList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseImportList = function(importedTitles) {

		var importRequests = [];

		var findItemOnAlternateProviderLimited = function(searchItem, onSuccess) {

			// find alternate amazon item
			var alternateRequest = ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.GiantBomb, false, function (item) {

				// add asin to search item
				searchItem.asin = item.asin;

				onSuccess(searchItem);
			});

			// add alternate request to importRequests array
			//importRequests.push(alternateRequest);

		}.lazy(500);

		var alternateComplete = function(searchItem) {

			console.info(searchItem);
		};

		// for each imported game - search giantbomb and add
		_.each(importedTitles, function(title) {

			// cleanup title
			title = ItemLinker.standardizeTitle(title);

			// set giantbomb as initial provider, add standard name propery
			var searchItem = {'initialProvider': 1, 'standardName': title};

			// search giantbomb
			ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.Amazon, false, function (item) {

				// extend searchItem with returned item data
				$.extend(true, searchItem, item);

				// get platform information for each item by gbombID
				GiantBomb.getGiantBombItemPlatform(searchItem.id, function(platformResult) {

					// iterate platforms
					_.each(platformResult.results.platforms, function(platform) {

						// save platform name to search item
						switch(platform.id) {

							case 88:
								searchItem.platform = 'PSN';
								break;
							case 35:
								searchItem.platform = 'PS3';
								break;
							case 143:
								searchItem.platform = 'Vita';
								break;
						}
					});

					var alternateRequest;

					findItemOnAlternateProviderLimited(searchItem, alternateComplete);

					// get metascore
					var metascoreRequest = Metacritic.getMetascore(searchItem.standardName, searchItem, true, function(data) {

						// score retrieved and properties added to searchItem
					});

					// add metascore request to importRequests array
					importRequests.push(metascoreRequest);

					// when requests complete
					$.when(metascoreRequest).then(function() {

						// add to importedGames
						importedGames.push(searchItem);

						// append item to importResults
						appendResults(searchItem);
					});
				});
			});


			// when all requests complete
			$.when.apply($, importRequests).then(function() {
				finalizeImport();
			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finalizeImport - all items imported and linked
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finalizeImport = function() {

		// hide loading and show confirm import button
		$loadingStatus.stop().fadeOut();
		$importModal.addClass('ready');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImportedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImportedGames = function() {

		// get tag name
		var tagName = INPUT_SOURCES[currentSourceID].toLowerCase() + ' import';

		var importTotal = importedGames.length;
		var importCount = 0;

		// create tag
		TagView.addTag(tagName, function(tag) {

			// tag created > add importedGames to tag list
			var tagsToAdd = [tag.tagID];

			// for each imported game > add to tag
			_.each(importedGames, function(item) {

				// add game to tag
				ItemData.addItemToTags(tagsToAdd, item, function(data) {

					importCount++;

					// all items added > run final step
					if (importCount === importTotal) {
						finalizeAdditions(tagsToAdd);
					}
				});
			});
		});

		// import complete, reset source id
		delete sourceImportStarted[currentSourceID];
		currentSourceID = null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finalizeAdditions - all items added to tag list
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finalizeAdditions = function(tagIDsAdded) {

		// hide modal
		$importModal.modal('hide');

		// refresh item view
		ItemView.refreshView();

		// update tag view list
		TagView.updateViewList(tagIDsAdded);

		// select random item
		ItemView.viewRandomItem();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'init': init,
		'startImport': startImport
	};

	$.extend(ImportView, publicMethods);


})(tmz.module('importView'), tmz, jQuery, _);

	// intialize app
	tmz.initialize();