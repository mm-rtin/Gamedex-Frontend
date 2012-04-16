// SEARCH VIEW
(function(SearchView, tmz, $, _) {
	"use strict";

	// module references
	var DetailView = tmz.module('detailView');
	var Amazon = tmz.module('amazon');
	var GiantBomb = tmz.module('giantbomb');
	var Utilities = tmz.module('utilities');
	var GameStats = tmz.module('gameStats');
	var IGN = tmz.module('ign');
	var ItemLinker = tmz.module('itemLinker');

    // constants
	var LIST_PROVIDERS = {'Gamestats': 0, 'IGN': 1};
    var TAB_IDS = {'#searchTab': 0, '#listTab': 1};
    var TIME_TO_SUBMIT_QUERY = 250;	// the number of miliseconds to wait before submiting search query
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2};
    var PANEL_HEIGHT_OFFSET = 225;
    var PANEL_HEIGHT_PADDING = 40;

    // search field timeout
    var timeout = null;

    // data
    var searchTerms = 'skyrim';
    var previousSearchTerms = '';
    var searchResults = {};

    // properties
    var searchProvider = Utilities.getProviders().Amazon;
    var listProvider = LIST_PROVIDERS.IGN;
    var currentTab = TAB_IDS['#searchTab'];
    var searchPlatform = null;
    var listPlatform = null;
    var searchDisplayType = DISPLAY_TYPE.Icons;
    var listDisplayType = DISPLAY_TYPE.Icons;

    // node cache
    var $searchContainer = $('#searchContainer');

    var $searchProvider = $('#searchProvider');
    var $listProvider = $('#listProvider');
    var $searchProviderName = $searchProvider.find('.providerName');
    var $listProviderName = $listProvider.find('.providerName');

    var $searchPlatforms = $('#searchPlatforms');
    var $listPlatforms = $('#listPlatforms');
    var $searchPlatformsName = $searchPlatforms.find('.platformName');
    var $listPlatformsName = $listPlatforms.find('.platformName');

    var $finderTabLinks = $('#finderTabLinks');
    var $finderTabContent = $('#finderTabContent');
    var $searchTab = $('#searchTab');
    var $listTab = $('#listTab');
    var $searchTabLink = $('#searchTabLink');
    var $listTabLink = $('#listTabLink');

    var $search = $('#searchField');
    var $searchButton = $('#search_btn');
    var $searchResultsContainer = $('#searchResultsContainer');
    var $searchResults = $('#searchResults');
    var $inputField = $search.find('input');

    var $listResultsContainer = $('#listResultsContainer');
    var $listResults = $('#listResults');
    var $listTable = $listResults.find('.list');

    var $searchDisplayOptions = $searchContainer.find('.searchDisplayOptions');
    var $listDisplayOptions = $searchContainer.find('.listDisplayOptions');

    // templates
    var searchResultsTemplate = _.template($('#search-results-template').html());
    var listResultsTemplate = _.template($('#list-results-template').html());
    var platformDropdownTemplate = _.template($('#search-results-platform-dropdown-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.init = function(keywords) {

		SearchView.createEventHandlers();

		// set default platform
		searchPlatform = Utilities.getPlatformIndex()[0];
		listPlatform = Utilities.getStandardPlatform('');

		// set default search provider
		searchProvider = Utilities.getProviders().Amazon;

		// init tooltips
		$listDisplayOptions.find('button').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}});
		});
		$searchDisplayOptions.find('button').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}});
		});

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
		$searchProvider.find('li a').click(function(e) {
			e.preventDefault();
			// set attribute
			$searchProvider.attr('data-content', $(this).attr('data-content'));
			previousSearchTerms = '';

			searchProviderChanged();
		});

		// listProvider: change
		$listProvider.find('li a').click(function(e) {
			e.preventDefault();
			// set attribute
			$listProvider.attr('data-content', $(this).attr('data-content'));
			listProviderChanged();
		});

		// listPlatforms: change
		$listPlatforms.find('li a').click(function(e) {
			e.preventDefault();
			changeListPlatform($(this).attr('data-content'), $(this).text());
		});

		// searchPlatforms: change
		$searchPlatforms.find('li a').click(function(e) {
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
		$searchDisplayOptions.on('click', 'button', function(e) {
			e.preventDefault();
			changeDisplayType($(this).attr('data-content'));
		});
		// listDisplayType toggle
		$listDisplayOptions.on('click', 'button', function(e) {
			e.preventDefault();

			// only allow changes for provider which has multiple views (IGN - upcoming games)
			if (listProvider == LIST_PROVIDERS.IGN) {
				changeDisplayType($(this).attr('data-content'));
			}
		});

		// search button: click
		$searchButton.click(function() {
			SearchView.search(searchTerms);
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

		// add searchDisplayType to templateData
		templateData.displayType = searchDisplayType;

		// output data to template
		$searchResults.html(searchResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.renderListResults = function(items) {

		// get model data
		var templateData = {'listResults': items};

		// output data to template
		$listTable.append(listResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* search
	* @param {string} keywords
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.search = function(keywords) {

		// change finder tab to search if not on search tab
		if (currentTab !== TAB_IDS['#searchTab']) {

			// manually toggle search tab
			$searchTabLink.trigger('click');
			finderTabChanged(TAB_IDS['#searchTab']);
		}

		// don't search previous search terms
		if (keywords !== previousSearchTerms) {

			previousSearchTerms = keywords;

			// search based on search provider
			switch (searchProvider) {

				// amazon
				case Utilities.getProviders().Amazon:
					Amazon.searchAmazon(keywords, searchPlatform.amazon, searchAmazon_result);
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

		// clear listTable
		$listTable.empty();

		// get popular games
		GameStats.getPopularGamesListByPlatform(platform.gamestats, getGamestatsPopularityList_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNUpcomingListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNUpcomingListByPlatform = function(platform) {

		// clear listTable
		$listTable.empty();

		// get upcoming games (page 1)
		IGN.getUpcomingGames(platform.ign, 0, function(data) {

			// parse page 0 result
			getIGNUpcomingList_result(data);

			// get upcoming games (page 2)
			IGN.getUpcomingGames(platform.ign, 1, getIGNUpcomingList_result);
		});
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
	* getIGNUpcomingList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getIGNUpcomingList_result = function(data) {

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
				showSearchOptions(true);
				showListOptions(false);
				searchProviderChanged();
				break;

			// list tab
			case 1:
				showListOptions(true);
				showSearchOptions(false);
				listProviderChanged();
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
				searchProvider = Utilities.getProviders().Amazon;
				// set title
				$searchProviderName.text('Amazon');
				// show platform list
				$searchPlatforms.show();
				break;
			case '1':
				searchProvider = Utilities.getProviders().GiantBomb;
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
	* listProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var listProviderChanged = function() {

		var providerID = $listProvider.attr('data-content');

		switch(providerID) {

			// popular games
			case '0':
				// disable display options and set to list

				// EXCEPTION:
				// do not update listDisplayType as popular list cannot have any other view
				changeDisplayType(0, true);
				$listDisplayOptions.fadeTo(100, 0.35);

				// set title
				$listProviderName.text('Popular');

				listProvider = LIST_PROVIDERS.Gamestats;
				break;

			// upcoming games
			case '1':

				// set toggle button and enable display options
				changeDisplayType(listDisplayType);
				$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
				$listDisplayOptions.fadeTo(100, 1);

				// set title
				$listProviderName.text('Upcoming');

				listProvider = LIST_PROVIDERS.IGN;
				break;
		}

		// update list for new
		getList(listProvider);
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
		getList(listProvider);
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
	var getList = function(listProvider) {

		switch (listProvider) {
			case LIST_PROVIDERS.Gamestats:
				SearchView.getGamestatsPopularityListByPlatform(listPlatform);
				break;

			case LIST_PROVIDERS.IGN:
				SearchView.getIGNUpcomingListByPlatform(listPlatform);
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
			$listProvider.show();

		} else {
			$listDisplayOptions.hide();
			$listPlatforms.hide();
			$listProvider.hide();
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

		// set nanoscroll
		$('#itemResultsContainer.nano').nanoScroller();
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

})(tmz.module('searchView'), tmz, jQuery, _);
