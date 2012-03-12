
// SEARCH VIEW
(function(SearchView) {

	// module references
	var DetailView = tmz.module('detailView');
	var Amazon = tmz.module('amazon');
	var GiantBomb = tmz.module('giantbomb');
	var Utilities = tmz.module('utilities');
	var GameStats = tmz.module('gameStats');
	var ItemLinker = tmz.module('itemLinker');

    // constants
	var LIST_PROVIDERS = {'Gamestats': 0, 'IGN': 1};
    var TAB_IDS = {'#searchTab': 0, '#listTab': 1};
    var TIME_TO_SUBMIT_QUERY = 500;	// the number of miliseconds to wait before submiting search query
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2};
    var PANEL_HEIGHT_OFFSET = 275;
    var PANEL_HEIGHT_PADDING = 40;

    // search field timeout
    var timeout = null;

    // data
    var searchTerms = 'skyrim';
    var searchResults = {};

    // properties
    var searchProvider = Utilities.getProviders().Amazon;
    var listProvider = LIST_PROVIDERS.Gamestats;
    var currentTab = TAB_IDS['#searchTab'];
    var platform = null;
    var displayType = DISPLAY_TYPE.Icons;

    // node cache
    var $searchProviderContainer = $('#searchProviderContainer');
    var $searchContainer = $('#searchContainer');
    var $searchProvider = $('#searchProvider');

    var $listProviderContainer = $('#listProviderContainer');
    var $listProvider = $('#listProvider');

    var $platformListContainer = $('#platformContainer');
    var $platformList = $('#platformList');

    var $finderTabLinks = $('#finderTabLinks');
    var $finderTabContent = $('#finderTabContent');
    var $searchTab = $('#searchTab');
    var $listTab = $('#listTab');
    var $searchTabLink = $('#searchTabLink');
    var $listTabLink = $('#listTabLink');

    var $search = $('#search');
    var $searchButton = $('#search_btn');
    var $searchResultsContainer = $('#searchResultsContainer');
    var $searchResults = $('#searchResults');
    var $inputField = $search.find('input');

    var $listResultsContainer = $('#listResultsContainer');
    var $listResults = $('#listResults');

    var $displayOptions = $searchContainer.find('.displayOptions');

    // templates
    var searchResultsTemplate = _.template($('#search-results-template').html());
    var listResultsTemplate = _.template($('#list-results-template').html());
    var platformDropdownTemplate = _.template($('#search-results-platform-dropdown-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.init = function(keywords) {

		// get current state
		searchProviderChanged();

		SearchView.createEventHandlers();

		// set platform
		platform = Utilities.getPlatformIndex()[0];

		// set nanoscroll
		setInterval(function() {
			$searchResultsContainer.nanoScroller();
			$listResultsContainer.nanoScroller();
		}, 1500);
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
		$searchProvider.chosen().change(searchProviderChanged);

		// listProvider: change
		$listProvider.chosen().change(listProviderChanged);

		// platformList: change
		$platformList.chosen().change(platformChanged);

		// search results: click
		$searchResults.on('click', 'tr', searchResultItem_onClick);

		// list results: click
		$listResults.on('click', 'tr', listResultItem_onClick);

		// dropdown menu > li: click
		$searchResults.on('click', '.dropdown-menu li', platformMenu_onClick);

		// displayType toggle
		$displayOptions.on('click', 'button', function(e) {
			e.preventDefault();
			changeDisplayType(this);
		});

		// search button: click
		$searchButton.click(function() {

			SearchView.search($inputField.val());
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

		var sortedSearchResults = [];

		// generate sorted items array
		_.each(items, function(item, key) {
			sortedSearchResults.push(item);
		});

		// sort results
		sortedSearchResults.sort(sortItemsByDate);

		// get model data
		var templateData = {'sortedSearchResults': sortedSearchResults};

		// add displayType to templateData
		templateData.displayType = displayType;

		// output data to template
		$searchResults.html(searchResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.renderListResults = function(items) {

		// get model data
		var templateData = {'listResults': items};

		// add displayType to templateData
		templateData.displayType = displayType;

		// output data to template
		$listResults.html(listResultsTemplate(templateData));
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
	* getGamestatsPopularityListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getGamestatsPopularityListByPlatform = function(platform) {

		console.info(platform);
		GameStats.getPopularGamesListByPlatform(platform.gamestats, getGamestatsPopularityList_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNUpcomingListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNUpcomingListByPlatform = function(platform) {

		console.info(platform);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.resizePanel = function() {

		var resultsHeight = null;
		var $container = null;

		switch(currentTab) {
			case 0:
				resultsHeight = $searchResults.height();
				$container = $searchResultsContainer;
				break;
			case 1:
				resultsHeight = $listResults.height();
				$container = $listResultsContainer;
				break;
		}


		console.info(resultsHeight, $container);

		var windowHeight = $(window).height();

		if (resultsHeight < windowHeight - PANEL_HEIGHT_OFFSET) {
			$container.css({'height': resultsHeight + PANEL_HEIGHT_PADDING});
		} else {
			$container.css({'height': windowHeight - PANEL_HEIGHT_OFFSET});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGamestatsPopularityList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGamestatsPopularityList_result = function(data) {

		// renderSearchResults list
		SearchView.renderListResults(data);
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

		console.info(searchResults);

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

		// get game lists
		getList(listProvider);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* listProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var listProviderChanged = function() {

		switch($listProvider.val()) {
			case '0':
				listProvider = LIST_PROVIDERS.Gamestats;
				break;
			case '1':
				listProvider = LIST_PROVIDERS.IGN;
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finderTabChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finderTabChanged = function(tab) {

		switch(tab) {
			case 0:
				showSearchOptions(true);
				showListOptions(false);
				break;
			case 1:
				showListOptions(true);
				showSearchOptions(false);
				break;
		}
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
	var getList = function(listProvider) {

		switch (listProvider) {
			case LIST_PROVIDERS.Gamestats:
				SearchView.getGamestatsPopularityListByPlatform(platform);
				break;

			case LIST_PROVIDERS.IGN:
				SearchView.getIGNUpcomingListByPlatform(platform);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSearchOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSearchOptions = function(show) {

		if (show) {
			$searchProviderContainer.fadeIn();
			$search.fadeIn();

			// hide platform list if going back to search where provider is giantbomb
			if (searchProvider === Utilities.getProviders().GiantBomb) {
				$platformListContainer.hide();
			}

		} else {
			$searchProviderContainer.hide();
			$search.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showListOptions = function(show) {

		if (show) {
			$platformListContainer.fadeIn();
			$listProviderContainer.fadeIn();
		} else {
			$listProviderContainer.hide();
		}
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

		clearTimeout(timeout);
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* inputFieldKeyUp
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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

			timeout = setTimeout(searchFieldTimeOut, TIME_TO_SUBMIT_QUERY);
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

		// get search text and standardize
		searchTerms = ItemLinker.standardizeTitle($(this).find('.itemName').text());

		// show search tab
		showTab(TAB_IDS['#searchTab']);

		// set search input field
		$inputField.val(searchTerms);

		// start search for clicked item text
		SearchView.search(searchTerms);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformMenu_onClick
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var platformMenu_onClick = function(e) {

		// assign platform to searchItem and relaunch detail view
		var searchResult = SearchView.getSearchResult($(this).attr('data-content'));
		searchResult.platform = $(this).find('a').text();

		// get title element
		$(this).parent().siblings('.dropdown-toggle').html(searchResult.platform).append('<b class="caret"></b>');
    };

})(tmz.module('searchView'));
