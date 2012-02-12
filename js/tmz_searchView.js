
// SEARCH VIEW
(function(SearchView) {

	// module references
	var DetailView = tmz.module('detailView');
	var SearchData = tmz.module('searchData');
	var Utilities = tmz.module('utilities');

    // constants
    var TIME_TO_SUBMIT_QUERY = 500;	// the number of miliseconds to wait before submiting search query
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2};

    // search field timeout
    var timeout = null;

    // data
    var searchTerms = '';

    // properties
    var searchProvider = Utilities.getProviders().Amazon;
    var displayType = DISPLAY_TYPE.Icons;

    // node cache
    var searchProviderNode = $('#searchProvider');
    var searchResultsNode = $('#searchResults');
    var inputFieldNode = $('#search').find('input');
    var searchResultsDisplayGroupNode = $('#searchResultsDisplayGroup');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.Model = Backbone.Model.extend({

		defaults: {
            searchResults: {},
            sortedSearchResults: []
        },

        initialize: function() {

        }
	});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: View
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.View = Backbone.View.extend({

		el: searchResultsNode,

		resultsTemplates: [	_.template($('#search-results-list-template').html()),
							_.template($('#search-results-icon-template').html()),
							_.template($('#search-results-cover-template').html())],

        initialize: function() {

			// searchResults: changed
            this.model.bind('change:searchResults', this.render, this);
        },

		render: function() {

			// hide all popovers
			$(searchResultsNode).find('tr').trigger('mouseout');

			var sortedSearchResults = [];

			// generate sorted items array
			_.each(this.model.get('searchResults'), function(item, key) {
				sortedSearchResults.push(item);
			});

			// sort results
			sortedSearchResults.sort(sortItemsByDate);
			this.model.set({'sortedSearchResults': sortedSearchResults});

			// output JSON search model to results container
			// select template based on displayType
			$(this.el).html(this.resultsTemplates[displayType](this.model.toJSON()));

			// create popover
			$(searchResultsNode).find('tr').popover({
				trigger: "hover",
				placement: "right",
				offset: 10,
				html: true,
				animate: false,
				title: function(){
					return $(this).attr('data-original-title');
				},
				content: function(){
					return $(this).attr('data-content');
				}}
			);

			return this;
		}

	});

    // backbone model
	var search = new SearchView.Model();
    // backbone view
    var searchPanel = new SearchView.View({model: search});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.init = function(keywords) {

		// get current state
		searchProviderChanged();

		SearchView.createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.createEventHandlers = function() {

		// search field: keypress
		$(inputFieldNode).keyup(inputFieldKeyUp);

		// searchProvider: change
		$(searchProviderNode).chosen().change(searchProviderChanged);

		// search results: click
		$(searchResultsNode).on('click', 'tr', searchResultItem_onClick);

		// displayType toggle
		$(searchResultsDisplayGroupNode).on('click', 'button', function(e) {
			e.preventDefault();
			displayTypeChanged(this);
		});

		// dropdown menu > li: click
		$(searchResultsNode).on('click', '.dropdown-menu li', platformMenu_onClick);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* search
	* @param {string} keywords
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.search = function(keywords) {

		// don't search empty search terms
		if (searchTerms !== '') {
			// search based on search provider
			switch (searchProvider) {

				// amazon
				case Utilities.getProviders().Amazon:
					SearchData.searchAmazon(keywords, searchAmazon_result);
					break;

				// giantbomb
				case Utilities.getProviders().GiantBomb:
					SearchData.searchGiantBomb(keywords, searchGiantBomb_result);
					break;
			}
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

			// collect attributes into searchItem object
			searchItem = {};

			// parse amazon result item and get back filtered status, add data to searchItem
			filtered = SearchData.parseAmazonResultItem($(this), searchItem);

			// add temp results object
			if (!filtered) {

				// save item in search results cache under ASIN key
				tempSearchResults[searchItem.id] = searchItem;
			}
		});

		// set tempSearchResults to search model
		search.set({'searchResults': tempSearchResults});
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

			// collect attributes into searchItem object
			searchItem = {};

			// parse result item and add to searchItem
			SearchData.parseGiantBombResultItem(results[i], searchItem);

			// get platform information for each item by gbombID
			SearchData.getGiantBombItemPlatform(searchItem.gbombID, getGiantBombItemPlatform_result);

			// save item in search results cache under ASIN key
			tempSearchResults[searchItem.id] = searchItem;
		}

		// set tempSearchResults to search model
		search.set({'searchResults': tempSearchResults});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemPlatform_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemPlatform_result = function(data, gbombID) {

		var platforms = data.results.platforms;
		var platformList = [];

		for (var i = 0, len = platforms.length; i < len; i++) {
			platformList.push(platforms[i].name);
		}

		// add platform drop down to item results
		addPlatformDropDown(gbombID, platformList);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addPlatformDropDown -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addPlatformDropDown = function(gbombID, platformList) {

		var i = 0;
		var dropDown = [];
		dropDown[i++] = '<ul class="nav nav-pills">';
		dropDown[i++] = '<li class="dropdown">';
		dropDown[i++] = '<a href="#" data-toggle="dropdown" class="dropdown-toggle">Platforms <b class="caret"></b></a>';
		dropDown[i++] = '<ul class="dropdown-menu" id="menu1">';

		// iterate platformList
		for (var j = 0, len = platformList.length; j < len; j++) {
			dropDown[i++] = '<li data-content="' + gbombID + '"><a href="#">' + platformList[j] + '</a></li>';
		}

		dropDown[i++] = '</ul>';
		dropDown[i++] = '</ul>';

		var dropDownHTML = dropDown.join('');

		// attach to existing result row
		$('#' + gbombID).find('.title').append(dropDownHTML);
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

		return search.get('searchResults')[id];
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchProviderChanged = function() {

		switch(searchProviderNode.val()) {

			case '0':
				searchProvider = Utilities.getProviders().Amazon;
				break;
			case '1':
				searchProvider = Utilities.getProviders().GiantBomb;
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayTypeChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayTypeChanged = function(toggleButton) {

		console.info('changed');
		var currentDisplayType = $(toggleButton).attr('data-content');

		console.info(currentDisplayType);
		// set new display type if changed
		if (displayType !== currentDisplayType) {
			displayType = currentDisplayType;

			// change display type for current results
			changeDisplayType();
		}

		console.info(displayType);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function() {

		// trigger change on searchResults to re-render template for new dislayType
		search.trigger("change:searchResults");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchFieldTimeOut
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchFieldTimeOut = function() {

		console.info("search timeout: search current search terms");

		clearTimeout(timeout);
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* EVENT HANDLERS
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	// search field: keypress (up)
    var inputFieldKeyUp = function(event) {

		// get search value
		searchTerms = $(inputFieldNode).val();

		if (timeout) {
			clearTimeout(timeout);
		}

		// enter key, run query immediately
		if(event.which == 13) {
			SearchView.search(searchTerms);

		// start search timer
		} else {
			console.info("start search timer");
			timeout = setTimeout(searchFieldTimeOut, TIME_TO_SUBMIT_QUERY);
		}
    };

    // search result: click
    var searchResultItem_onClick = function() {

		// hide popover on clicked item
		$(this).popover('hide');

		var searchResult = SearchView.getSearchResult($(this).attr('id'));

		// show item detail
		DetailView.viewFirstSearchItemDetail(searchResult);
    };

    // platform menu: click
    var platformMenu_onClick = function() {

		// assign platform to searchItem and relaunch detail view
		var searchResult = SearchView.getSearchResult($(this).attr('data-content'));
		searchResult.platform = $(this).find('a').text();

		console.info(searchResult);

		// show item detail
		DetailView.viewFirstSearchItemDetail(searchResult);
    };

})(tmz.module('searchView'));
