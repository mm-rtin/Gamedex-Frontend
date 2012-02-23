
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
	tmz.searchData = tmz.module('searchData');

	// views
	tmz.searchView = tmz.module('searchView');
	tmz.detailView = tmz.module('detailView');
	tmz.itemView = tmz.module('itemView');

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
};
