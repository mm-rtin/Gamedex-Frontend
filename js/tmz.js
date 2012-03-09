
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
      return modules[name] = { Views: {} };
    };
  }()
};

// module references
tmz.util = null;

// models
tmz.listModel = null;
tmz.user = null;

// views
tmz.searchView = null;
tmz.detailView = null;
tmz.itemView = null;


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * DOCUMENT READY
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
$(document).ready(function() {

	// intialize app
	tmz.initialize();
});

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initialize
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initialize = function() {

	// set application properties
	tmz.api = '/';

	// module references
	tmz.util = tmz.module('utilities');

	// models
	tmz.user = tmz.module('user');
	tmz.listModel = tmz.module('list');

	// data interfaces
	tmz.itemData = tmz.module('itemData');
	tmz.listData = tmz.module('listData');
	tmz.Amazon = tmz.module('amazon');

	// views
	tmz.searchView = tmz.module('searchView');
	tmz.detailView = tmz.module('detailView');
	tmz.itemView = tmz.module('itemView');
	tmz.gridView = tmz.module('gridView');

	// linkers
	tmz.itemLinker = tmz.module('itemLinker');

	// 3rd party libaries
	tmz.initializeLibraries();

	// event handling
	tmz.initializeModules();
};

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initializeLibraries
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initializeLibraries = function() {

	// chosen list: add to list
	$(".chzn-select").chosen({no_results_text: "<strong>Press ENTER key to add:<br/><br/></strong>"});

	// moment.js calendar config
	moment.calendar = {
		lastDay : '[Yesterday]',
		sameDay : '[Today]',
		nextDay : '[Tomorrow]',
		lastWeek : '[last] dddd',
		nextWeek : 'dddd',
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

	// SEARCH PANEL
	tmz.searchView.init();

	// DETAILS PANEL
	tmz.detailView.init();

	// ITEM PANEL
	tmz.itemView.init();

	// USER
	tmz.user.init();

	// GRID VIEW
	tmz.gridView.init();
};
