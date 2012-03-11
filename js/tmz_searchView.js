
// SEARCH VIEW
(function(SearchView) {

	// module references
	var DetailView = tmz.module('detailView');
	var Amazon = tmz.module('amazon');
	var GiantBomb = tmz.module('giantbomb');
	var Utilities = tmz.module('utilities');

    // constants
    var TIME_TO_SUBMIT_QUERY = 500;	// the number of miliseconds to wait before submiting search query
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2};
    var PANEL_HEIGHT_OFFSET = 240;
    var PANEL_HEIGHT_PADDING = 40;

    // search field timeout
    var timeout = null;

    // data
    var searchTerms = 'skyrim';

    // properties
    var searchProvider = Utilities.getProviders().Amazon;
    var platform = null;
    var displayType = DISPLAY_TYPE.Icons;

    // node cache
    var $searchContainer = $('#searchContainer');
    var $searchProvider = $('#searchProvider');
    var $platformListContainer = $('#platformContainer');
    var $platformList = $('#platformList');
    var $searchResultsContainer = $('#searchResultsContainer');
    var $searchResults = $('#searchResults');
    var $inputField = $('#search').find('input');
    var $displayOptions = $searchContainer.find('.displayOptions');

    // templates
    var searchResultsTemplate = _.template($('#search-results-template').html());
    var platformDropdownTemplate = _.template($('#search-results-platform-dropdown-template').html());

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

		el: $searchResults,

		resultsTemplate: searchResultsTemplate,

        initialize: function() {

			// searchResults: changed
            this.model.bind('change:searchResults', this.render, this);
        },

		render: function() {

			var sortedSearchResults = [];

			// generate sorted items array
			_.each(this.model.get('searchResults'), function(item, key) {
				sortedSearchResults.push(item);
			});

			// sort results
			sortedSearchResults.sort(sortItemsByDate);
			this.model.set({'sortedSearchResults': sortedSearchResults});

			// get model data
			var templateData = this.model.toJSON();

			// add displayType to templateData
			templateData.displayType = displayType;

			// output JSON search model to results container
			$(this.el).html(this.resultsTemplate(templateData));

			// set nanoscroll
			setTimeout(function() {
				$searchResultsContainer.nanoScroller();
			}, 500);

			SearchView.resizePanel();
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

		// set platform
		platform = Utilities.getPlatformIndex()[0];

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.createEventHandlers = function() {

		// search field: keypress
		$inputField.keyup(inputFieldKeyUp);

		// searchProvider: change
		$searchProvider.chosen().change(searchProviderChanged);

		// platformList: change
		$platformList.chosen().change(platformChanged);

		// search results: click
		$searchResults.on('click', 'tr', searchResultItem_onClick);

		// dropdown menu > li: click
		$searchResults.on('click', '.dropdown-menu li', platformMenu_onClick);

		// displayType toggle
		$displayOptions.on('click', 'button', function(e) {
			e.preventDefault();
			changeDisplayType(this);
		});

		// search button: click
		$('#search_btn').click(function() {
			// // // // console.info('click search');
			SearchView.search(searchTerms);
		});

		// window, searchResults: resized
		$searchResults.resize(SearchView.resizePanel);
		$(window).resize(SearchView.resizePanel);
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
					Amazon.searchAmazon(keywords, platform.amazon, searchAmazon_result);
					break;

				// giantbomb
				case Utilities.getProviders().GiantBomb:
					GiantBomb.searchGiantBomb(keywords, searchGiantBomb_result);
					break;
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.resizePanel = function() {

		var windowHeight = $(window).height();
		var resultsHeight = $searchResults.height();

		// // // // console.info(resultsHeight);

		if (resultsHeight < windowHeight - PANEL_HEIGHT_OFFSET) {
			$searchResultsContainer.css({'height': resultsHeight + PANEL_HEIGHT_PADDING});
		} else {
			$searchResultsContainer.css({'height': windowHeight - PANEL_HEIGHT_OFFSET});
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

			// parse result item and set searchItem
			searchItem = GiantBomb.parseGiantBombResultItem(results[i]);

			// get platform information for each item by gbombID
			GiantBomb.getGiantBombItemPlatform(searchItem.gbombID, getGiantBombItemPlatform_result);

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
		var standardPlatform = '';

		for (var i = 0, len = platforms.length; i < len; i++) {

			// // // console.info(platforms[i].name);
			// standardize platform names
			standardPlatform = Utilities.matchPlatformToIndex(platforms[i].name).name || platforms[i].name;

			platformList.push(standardPlatform);
			// platformList.push(platforms[i].name);
		}

		// // // console.info('--------------------------------------');

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

		return search.get('searchResults')[id];
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchProviderChanged = function() {

		switch($searchProvider.val()) {

			case '0':
				searchProvider = Utilities.getProviders().Amazon;
				// show platform list
				$platformListContainer.show();
				break;
			case '1':
				searchProvider = Utilities.getProviders().GiantBomb;
				$platformListContainer.hide();
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var platformChanged = function() {

		// set platform object
		platform = Utilities.getStandardPlatform($(this).val());
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
			$searchResults.find('tbody').removeClass().addClass('display-' + displayType);

			// set nanoscroll
			$('#itemResultsContainer.nano').nanoScroller();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchFieldTimeOut
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchFieldTimeOut = function() {

		// // // // console.info("search timeout: search current search terms");

		clearTimeout(timeout);
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* EVENT HANDLERS
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	// search field: keypress (up)
    var inputFieldKeyUp = function(event) {

		// get search value
		searchTerms = $inputField.val();

		if (timeout) {
			clearTimeout(timeout);
		}

		// enter key, run query immediately
		if(event.which == 13) {
			SearchView.search(searchTerms);

		// start search timer
		} else {
			// // // // console.info("start search timer");
			timeout = setTimeout(searchFieldTimeOut, TIME_TO_SUBMIT_QUERY);
		}
    };

    // search result: click
    var searchResultItem_onClick = function() {

		var searchResult = SearchView.getSearchResult($(this).attr('id'));

		// // console.info(searchResult);

		// show item detail
		DetailView.viewFirstSearchItemDetail(searchResult);
    };

    // platform menu: click
    var platformMenu_onClick = function(e) {

		// assign platform to searchItem and relaunch detail view
		var searchResult = SearchView.getSearchResult($(this).attr('data-content'));
		searchResult.platform = $(this).find('a').text();

		// get title element
		$(this).parent().siblings('.dropdown-toggle').html(searchResult.platform).append('<b class="caret"></b>');
    };

})(tmz.module('searchView'));
