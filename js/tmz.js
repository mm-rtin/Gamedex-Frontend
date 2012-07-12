
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
	var searchView = tmz.module('searchView'),
		detailView = tmz.module('detailView'),
		itemView = tmz.module('itemView'),
		tagView = tmz.module('tagView'),
		gridView = tmz.module('gridView'),
		filterPanel = tmz.module('filterPanel'),
		videoPanel = tmz.module('videoPanel'),
		siteView = tmz.module('siteView');

	// initialize modules
	searchView.init();
	detailView.init();
	itemView.init();
	tagView.init();
	gridView.init();
	filterPanel.init();
	videoPanel.init();
	siteView.init();
};
