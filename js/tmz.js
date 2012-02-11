
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
	this.api = '/';

	// module references
	this.util = this.module('utilities');

	// models
	this.user = this.module('user');
	this.listModel = this.module('list');

	// data interfaces
	this.itemData = this.module('itemData');
	this.listData = this.module('listData');
	this.searchData = this.module('searchData');

	// views
	this.searchView = this.module('searchView');
	this.detailView = this.module('detailView');
	this.itemView = this.module('itemView');

	// 3rd party libaries
	this.initializeLibraries();

	// event handling
	this.initializeModules();
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
