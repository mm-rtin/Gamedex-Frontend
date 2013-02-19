
// gamedex namespace
var gamedex = {
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
gamedex.api = '/';


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initialize
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gamedex.initialize = function() {

	// 3rd party libaries
	gamedex.initializeLibraries();

	// event handling
	gamedex.initializeModules();
};

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initializeLibraries
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gamedex.initializeLibraries = function() {

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
gamedex.initializeModules = function() {

	// module references
    var itemData = gamedex.module('itemData'),
        searchView = gamedex.module('searchView'),
		detailView = gamedex.module('detailView'),
		itemView = gamedex.module('itemView'),
		tagView = gamedex.module('tagView'),
		gridView = gamedex.module('gridView'),
		filterPanel = gamedex.module('filterPanel'),
        videoPanel = gamedex.module('videoPanel'),
		importView = gamedex.module('importView'),
		siteView = gamedex.module('siteView');

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
