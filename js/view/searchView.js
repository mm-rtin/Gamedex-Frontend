// SEARCH VIEW
(function(SearchView, gamedex, $, _, moment, ListJS) {
	"use strict";

	// module references
	var DetailView = gamedex.module('detailView'),
		Amazon = gamedex.module('amazon'),
		GiantBomb = gamedex.module('giantbomb'),
		Utilities = gamedex.module('utilities'),
		IGN = gamedex.module('ign'),
		ReleasedList = gamedex.module('releasedList'),
		ItemLinker = gamedex.module('itemLinker'),

		// constants
		LIST_TYPE = {'POPULAR': 0, 'UPCOMING': 1, 'RELEASED': 2, 'REVIEWED': 3},
		TAB_IDS = {'#searchTab': 0, '#listTab': 1},
		TIME_TO_SUBMIT_QUERY = 400,                             // the number of miliseconds to wait before submiting search query
		DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2},
		PANEL_HEIGHT_OFFSET_USE = 258,
		PANEL_HEIGHT_OFFSET_INFO = 503,
		PANEL_HEIGHT_PADDING_MAX = 5,
		PANEL_HEIGHT_PADDING_SCROLL = 13,
		DISTANCE_TO_END_INFINITE_SCROLL_TRIGGER = 1500,
		NUMBER_OF_LIST_PAGES_TO_LOAD = 1,

		// timeout
		searchFieldTimeout = null,

		// data
		searchTerms = 'skyrim',
		previousSearchTerms = '',
		searchResults = {},
		sortedSearchResults = [],

		// properties
		currentTab = TAB_IDS['#searchTab'],

		infiniteScrollDisabled = false,

		ignUpcomingListPagesLoaded = -1,
		ignReleasedListPagesLoaded = -1,
		ignPopularListPagesLoaded = -1,

		ignUpcomingListPagesEnded = false,
		ignReviewedListPagesEnded = false,
		ignPopularListPagesEnded = false,


		listType = null,
		listTabScrollPosition = 0,
		listPlatform = null,
		listDisplayType = DISPLAY_TYPE.Icons,

		searchTabScrollPosition = 0,
		searchPlatform = null,
		searchDisplayType = DISPLAY_TYPE.Icons,

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
		$listType = $('#listType'),
		$listTypeName = $listType.find('.listTypeName'),

		$searchPlatforms = $('#searchPlatforms'),
		$legacySubNav = $('#legacySubNav'),
		$platformSelectButton = $('#platformSelect_btn'),
		$listPlatforms = $('#listPlatforms'),
		$listPlatformsDropdown = $('#listPlatforms').find('ul'),
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
		listPlatformTemplate = _.template($('#list-platform-template').html()),
		platformDropdownTemplate = _.template($('#search-results-platform-dropdown-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.init = function(keywords) {

		SearchView.createEventHandlers();

		// render list platform menu
		renderListPlatformMenu();

		// set default platform
		searchPlatform = Utilities.PLATFORM_INDEX[0];
		listPlatform = Utilities.getStandardPlatform('');

		toggleClearSearchButton(false);

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

		// setup infinite scroll event
		$listResultsContent.on('scroll', function(e) {

			var scrollPos = $listResultsContent.scrollTop(),
				contentHeight = $listResults.height(),
				containerHeight = $listResultsContent.height(),

				posToEnd = contentHeight - (scrollPos + containerHeight);

			if (posToEnd < DISTANCE_TO_END_INFINITE_SCROLL_TRIGGER) {

				if (!infiniteScrollDisabled) {
					infiniteScrollDisabled = true;
					SearchView.loadNextListPages();
				}
			}
		});

		// init BootstrapSubMenu (bootstrap sub menu)
		$legacySubNav.BootstrapSubMenu({'$mainNav': $searchPlatforms});
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
		$listPlatforms.on('click', 'li a', function(e) {
			e.preventDefault();

			if ($(this).attr('data-content')) {
				changeListPlatform($(this).attr('data-content'), $(this).text());
			}
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
		$searchDisplayOptions.on('click', 'button', function(e) {
			e.preventDefault();
			changeDisplayType($(this).attr('data-content'), false, $(this));
		});
		// listDisplayType toggle
		$listDisplayOptions.on('click', 'button', function(e) {
			e.preventDefault();

			// only allow changes for provider which has multiple views (upcoming/released games)
			if (listType == LIST_TYPE.UPCOMING || listType == LIST_TYPE.RELEASED || listType == LIST_TYPE.REVIEWED || listType == LIST_TYPE.POPULAR) {
				changeDisplayType($(this).attr('data-content'), false, $(this));
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

		// reset sorted results
		sortedSearchResults = [];

		// hide loading status
		$searchLoadingStatus.removeClass('show');

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
		$listLoadingStatus.removeClass('show');

		// get model data
		var templateData = {'listResults': items};

		// output data to template
		$listTable.append(listResultsTemplate(templateData));

		// init listJS
		initListJS(order);
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

			clearSearch();

			// show loading status
			$searchResultsContainer.find('.noResults').hide();
			$searchLoadingStatus.addClass('show');

			previousSearchTerms = keywords;

			// search amazon and giantbomb
			Amazon.searchAmazon(keywords, searchPlatform.amazon, function(data) {
				searchAmazon_result(data, keywords);
			});
			GiantBomb.searchGiantBomb(keywords, function(data) {
				searchGiantBomb_result(data, keywords);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadNextListPages -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.loadNextListPages = function() {

		$listLoadingStatus.addClass('show');

		switch (listType) {
			case LIST_TYPE.POPULAR:
				SearchView.getIGNPopularList(listPlatform, ignPopularListPagesLoaded + 1);
				break;

			case LIST_TYPE.UPCOMING:
				SearchView.getIGNUpcomingList(listPlatform, ignUpcomingListPagesLoaded + 1);
				break;

			case LIST_TYPE.RELEASED:
				break;

			case LIST_TYPE.REVIEWED:
				SearchView.getIGNReviewedList(listPlatform, ignReleasedListPagesLoaded + 1);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNPopularList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNPopularList = function(platform, page) {

		if (ignPopularListPagesEnded) {

			$listLoadingStatus.removeClass('show');
			return;
		}

		// get upcoming games
		for (var i = 0; i < NUMBER_OF_LIST_PAGES_TO_LOAD; i++) {
			IGN.getPopularGames(platform.ign, page + i, listResult);
		}

		function listResult(data) {

			if (data.length === 0) {
				ignPopularListPagesEnded = true;
			}

			infiniteScrollDisabled = false;
			getList_result(data, 'asc', LIST_TYPE.POPULAR);
			ignPopularListPagesLoaded++;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNUpcomingList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNUpcomingList = function(platform, page) {

		if (ignUpcomingListPagesEnded) {

			$listLoadingStatus.addClass('show');
			return;
		}

		// get upcoming games (page 1..2)
		for (var i = 0; i < NUMBER_OF_LIST_PAGES_TO_LOAD; i++) {
			IGN.getUpcomingGames(platform.ign, page + i, listResult);
		}

		function listResult(data) {

			if (data.length === 0) {
				ignUpcomingListPagesEnded = true;
			}

			infiniteScrollDisabled = false;
			getList_result(data, 'asc', LIST_TYPE.UPCOMING);
			ignUpcomingListPagesLoaded++;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNReviewedList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNReviewedList = function(platform, page) {

		if (ignReviewedListPagesEnded) {

			$listLoadingStatus.remove('show');
			return;
		}

		// get reviewed games (page 1)
		for (var i = 0; i < NUMBER_OF_LIST_PAGES_TO_LOAD; i++) {
			IGN.getReviewedGames(platform.ign, page + i, listResult);
		}

		function listResult(data) {

			if (data.length === 0) {
				ignReviewedListPagesEnded = true;
			}

			infiniteScrollDisabled = false;
			getList_result(data, 'desc', LIST_TYPE.REVIEWED);
			ignReleasedListPagesLoaded++;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGTReleasedList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getGTReleasedList = function(platform) {

		var numberOfWeeks = 14;

		// get current date (start of week)
		var startWeek = moment().day(0);

		// get released games
		// get up to numberOfWeeks previous releases
		var previousWeek = startWeek;

		for (var i = 0, len = numberOfWeeks; i < len; i++) {

			ReleasedList.getReleasedGames(platform.id, previousWeek.year(), previousWeek.month() + 1, previousWeek.date(), listResult);

			previousWeek = previousWeek.subtract('weeks', 1);
		}

		function listResult(data, platformsFound) {
			getList_result(data, 'desc', LIST_TYPE.RELEASED, platformsFound);
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

		SearchView.resizePanel();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearSearch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearSearch = function() {

		// clear results output
		$searchResults.empty();

		$searchLoadingStatus.addClass('show');

		// clear searchResults data
		searchResults = {};
		sortedSearchResults = [];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initListJS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initListJS = function(order) {

		// update list.js for item list
		itemList = new ListJS('listResults', listOptions);

		// sort using current sort method
		if (order === 'asc') {
			itemList.sort('releaseDate', {sortFunction: releaseDateSortAsc});
		} else {
			itemList.sort('releaseDate', {sortFunction: releaseDateSortDesc});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getList_result = function(data, order, sourceListType, platformsCount) {

		platformsCount = typeof platformsCount !== 'undefined' ? platformsCount : null;

		if (platformsCount) {
			renderListPlatformMenu(platformsCount);
		}

		// if current listType does not match source - skip render
		if (sourceListType === listType) {
			// render list
			SearchView.renderListResults(data, order);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderListPlatformMenu - render platform filter with counts from currently viewing list
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var renderListPlatformMenu = function(platformCount) {

		var formattedPlatformCount = {};

		if (typeof platformCount !== 'undefined' && platformCount) {

			// add parenthesis around counts
			_.each(platformCount, function(count, key) {
				formattedPlatformCount[key] = "(" + count + ") ";
			});

		} else {

			// default
			formattedPlatformCount = {
				'all': '',
				'pc': '',
				'x360': '',
				'xbl': '',
				'ps3': '',
				'psn': '',
				'vita': '',
				'ds': '',
				'3ds': '',
				'wii': '',
				'wiiu': ''
			};
		}

		$listPlatformsDropdown.html(listPlatformTemplate({'found': formattedPlatformCount}));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon_result - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchAmazon_result = function(data, keywords) {
		// local properties
		var filtered = false;
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

				// subtract 100 years to release date force amazon items to bottom
				var releaseDateComponents = searchItem.releaseDate.split('-');
				var releaseYear = parseInt(releaseDateComponents[0], 10) - 100;
				searchItem.sortDate = releaseYear + '-' + releaseDateComponents[1] + '-' + releaseDateComponents[2];

				// save item in search results cache under ASIN key
				tempSearchResults[searchItem.id] = searchItem;
			}
		});

		// extend searchResults data with tempSearchResults
		$.extend(true, searchResults, tempSearchResults);

		// skip render if current search terms do not match search terms for this query
		if (searchTerms === keywords) {
			// renderSearchResults results
			SearchView.renderSearchResults(searchResults);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb_result - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchGiantBomb_result = function(data, keywords) {

		var results = data.results;
		var tempSearchResults = {};
		var searchItem = {};

		// iterate results array
		_.each(results, function(resultItem) {

			// parse result item and set searchItem
			searchItem = GiantBomb.parseGiantBombResultItem(resultItem);

			// add sort date
			searchItem.sortDate = searchItem.releaseDate;

			if (searchItem.releaseDate == '1900-01-01') {
				searchItem.sortDate = '2100-01-01';
			}

			// save item in search results cache under ASIN key
			tempSearchResults[searchItem.id] = searchItem;
		});

		// extend searchResults data with tempSearchResults
		$.extend(true, searchResults, tempSearchResults);

		// skip render if current search terms do not match search terms for this query
		if (searchTerms === keywords) {
			// renderSearchResults
			SearchView.renderSearchResults(searchResults);

			// render platforms for each search item
			_.each(results, function(searchItem) {

				_.delay(function() {
					displayPlatformDropdown(searchItem.platforms, searchItem.id);
				}, 500);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayPlatformDropdown -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayPlatformDropdown = function(platforms, gbombID) {

		var platformList = [];
		var standardPlatform = '';

		if (platforms) {

			_.each(platforms, function(platform) {

				// standardize platform names
				standardPlatform = Utilities.matchPlatformToIndex(platform.platform.name).name || platform.platform.name;

				// ignore Mac
				if (standardPlatform !== "Mac") {
					platformList.push(standardPlatform);
				}
			});

			// add platform drop down to item results
			addPlatformDropDown(gbombID, platformList);

			// get searchItem from model and save platform list to searchItem
			var searchItem = SearchView.getSearchResult(gbombID);

			if (searchItem) {
				searchItem['platformList'] = platformList;
				// set default platform
				searchItem.platform = platformList[0];
			}
		}
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

		var date1 = Date.parse(a.sortDate);
		var date2 = Date.parse(b.sortDate);

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
	* listTypeChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var listTypeChanged = function() {

		var typeID = parseInt($listType.attr('data-content'), 10);

		// update list if provider changed
		if (typeID !== listType) {

			switch(typeID) {

				// popular games
				case 0:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listTypeName.text('Popular');

					listType = LIST_TYPE.POPULAR;
					break;

				// ign upcoming games
				case 1:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listTypeName.text('Upcoming');

					listType = LIST_TYPE.UPCOMING;
					break;

				// gt released games
				case 2:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listTypeName.text('Released');

					listType = LIST_TYPE.RELEASED;
					break;

				// ign reviewed games
				case 3:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listTypeName.text('Reviewed');

					listType = LIST_TYPE.REVIEWED;
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

		infiniteScrollDisabled = false;

		ignReviewedListPagesEnded = false;
		ignUpcomingListPagesEnded = false;
		ignPopularListPagesEnded = false;

		ignUpcomingListPagesLoaded = -1;
		ignReleasedListPagesLoaded = -1;
		ignPopularListPagesLoaded = -1;

		// reset platform menu
		renderListPlatformMenu();

		$listLoadingStatus.addClass('show');
		$listTable.empty();

		switch (listType) {
			case LIST_TYPE.POPULAR:
				resetListName();
				SearchView.getIGNPopularList(listPlatform, 0);
				break;

			case LIST_TYPE.UPCOMING:
				resetListName();
				SearchView.getIGNUpcomingList(listPlatform, 0);
				break;

			case LIST_TYPE.RELEASED:
				SearchView.getGTReleasedList(listPlatform);
				break;

			case LIST_TYPE.REVIEWED:
				SearchView.getIGNReviewedList(listPlatform, 0);
				break;
		}

		// reset platform name - to remove list counts
		function resetListName() {
			$listPlatformsName.text($listPlatformsName.text().split(' (')[0]);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSearchOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSearchOptions = function(show) {

		if (show) {
			$searchDisplayOptions.show();
			$searchPlatforms.show();

		} else {
			$searchDisplayOptions.hide();
			$searchPlatforms.hide();
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
	var changeDisplayType = function(displayType, doNotUpdateCurrentDisplayType, $toggleButton) {

		doNotUpdateCurrentDisplayType = typeof doNotUpdateCurrentDisplayType !== 'undefined' ? doNotUpdateCurrentDisplayType : false;

		if ($toggleButton) {
			$toggleButton.addClass('active').siblings().removeClass('active');
		}

		// change #searchResults or #listResults tbody class based on current tab
		if (currentTab === TAB_IDS['#searchTab']) {
			searchDisplayType = displayType;
			$searchResults.find('tbody').removeClass().addClass('display-' + displayType);

		// check if the actual element has the displayType class
		} else if ($listResults.find('tbody').hasClass('display-' + displayType) === false) {

			// this is so popular list does not define the view for upcoming list
			if (!doNotUpdateCurrentDisplayType) {
				listDisplayType = displayType;
			}

			$listResultsContainer.find('.content')
				.removeClass('display-0')
				.removeClass('display-1')
				.removeClass('display-2')
				.addClass('display-' + displayType);
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

		if (searchTerms !== previousSearchTerms) {
			clearSearch();
		}

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
		changeSearchPlatform(listPlatform.id, listPlatform.name);

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
			$search.addClass('showAddOn');
		} else {
			$search.removeClass('showAddOn');
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

})(gamedex.module('searchView'), gamedex, jQuery, _, moment, List);
