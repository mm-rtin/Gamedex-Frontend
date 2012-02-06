
// SEARCH VIEW
(function(SearchView) {

	// module references
	var DetailView = tmz.module('detailView');

    // constants
    var FILTERED_NAMES = ['japan', 'bundle', 'import', 'pack', 'skin', 'faceplate', 'controller', 'wheel', 'kit', 'wireless', 'combo', 'poster', 'map', 'pre-paid', 'codes'];
    var TIME_TO_SUBMIT_QUERY = 1000;	// the number of miliseconds to wait before submiting search query
    var BROWSENODES = {'ps3': 14210861, 'xbox': 0, 'xbox360': 14220271, 'pc': 12508701, 'wii': 14219011, 'ds': 11075831, '3ds': 2622270011, 'psp': 12508741, 'vita': 3010557011, 'ps2': 0, 'ps1':0};
    var SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1};
    var DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2};
    // private variables
    var timeout = null;		// search field timeout

    // properties
    var searchProvider = SEARCH_PROVIDERS.Amazon;
    var displayType = DISPLAY_TYPE.Icons;

    // node cache
    var searchProviderNode = $('#searchProvider');
    var searchResultsNode = $('#searchResults');
    var inputFieldNode = $('#search').find('input');
    var searchResultsDisplayGroup = $('#searchResultsDisplayGroup');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.Model = Backbone.Model.extend({

		defaults: {
            searchTerms: '',
            searchResults: {},
            sortedSearchResults: []
        },

        initialize: function() {

        },

        // override parse method
		parse : function(response) {

			// amazon provider
			if (searchProvider === SEARCH_PROVIDERS.Amazon) {
				parseAmazonResponse(response);

			// giantbomb provider
			} else if (searchProvider === SEARCH_PROVIDERS.GiantBomb) {
				parseGiantBombResponse(response);
			}
		},

        // set url based on searchTerms
		url: function () {

			var searchTerms = encodeURIComponent(this.get('searchTerms'));

			// amazon provider
			if (searchProvider === SEARCH_PROVIDERS.Amazon) {

				var browseNode = 0;
				// method / index / browseNode / keywords / Response Groups / page
				return tmz.api + 'itemsearch/amazon/VideoGames/' + browseNode + '/' + searchTerms + '/Medium/';

			// giantbomb provider
			} else if (searchProvider === SEARCH_PROVIDERS.GiantBomb) {

				return tmz.api + 'itemsearch/giantbomb/' + searchTerms + '/0';
			}
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
            this.model.bind('change:searchResults', function() {
                console.info('results changed');
            });

            // sortedSearchResults: changed
            this.model.bind('change:sortedSearchResults', this.render, this);
        },

		render: function() {

			// hide all popovers
			$(searchResultsNode).find('tr').trigger('mouseout');

			// sort search results
			this.model.get('sortedSearchResults').sort(sortSearchItemByDate);

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
		$(inputFieldNode).keydown(inputFieldKeyDown);

		// searchProvider: change
		$(searchProviderNode).chosen().change(searchProviderChanged);

		// search results: click
		$(searchResultsNode).delegate("tr", "click", function() {

			// hide popover on clicked item
			$(this).popover('hide');

			// show item detail
			DetailView.viewSearchDetail(SearchView.getSearchResult($(this).attr('id')));
		});

		// displayType toggle
		$(searchResultsDisplayGroup).find('button').click(function(e){
			e.preventDefault();
			displayTypeChanged(this);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* search
	* @param {string} keywords
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.search = function(keywords) {

		// sync backbone model with new search results
		// amazon provider
		if (searchProvider === SEARCH_PROVIDERS.Amazon) {
			search.fetch({dataType: 'xml'});
		// giantbomb provider
		} else if (searchProvider === SEARCH_PROVIDERS.GiantBomb) {
			search.fetch();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonResponse - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonResponse = function(data) {

		// local properties
		var	filter = '(' + FILTERED_NAMES.join('|') + ')';
		var	re = new RegExp(filter, 'i');
		var	filtered = false;
		var	searchItemHTML = '';
		var tempSearchResults = {};
		var tempSortedResults = [];

		/* sortedArray and searchResults cache construction
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// iterate xml results, filter results and construct search results array
		$('Item', data).each(function() {

			// collect attributes into searchItem object
			var searchItem = {};

			// get attributes from xml
			searchItem.name = $(this).find('Title').text();
			searchItem.platform = $(this).find('Platform').text();
			searchItem.releaseDate = $(this).find('ReleaseDate').text() || 'unknown';

			// filter out non-media item products
			if (re.test(searchItem.name) || searchItem.platform === '') {
				console.error(searchItem.name);
				filtered = true;
			}

			console.info(searchItem.name);

			// add to search results cache
			if (!filtered) {

				searchItem.id = $(this).find('ASIN').text();
				searchItem.asin = $(this).find('ASIN').text();
				searchItem.gbombID = 0;
				searchItem.smallImage = $(this).find('ThumbnailImage > URL:first').text() || '';
				searchItem.thumbnailImage = $(this).find('MediumImage > URL:first').text() || '';
				searchItem.largeImage = $(this).find('LargeImage > URL:first').text() || '';
				searchItem.description = $(this).find('EditorialReview > Content:first').text() || '';

				// save item in search results cache under ASIN key
				tempSearchResults[searchItem.id] = searchItem;
				// add again to tempSortedResults to sort array by releaseDate
				tempSortedResults.push(searchItem);
			}
			filtered = false;
		});

		// set tempSearchResults, tempSortedResults to search model
		search.set({'searchResults': tempSearchResults});
		search.set({'sortedSearchResults': tempSortedResults});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombResponse - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGiantBombResponse = function(data) {

		var i = 0;
		var results = data.results;
		var length = results.length;
		var tempSearchResults = {};
		var tempSortedResults = [];
		var searchItem = {};

		for (i; i < length; i++) {

			// collect properties
			searchItem = {};
			searchItem.id = results[i].id;
			searchItem.asin = 0;
			searchItem.gbombID = results[i].id;
			searchItem.name = results[i].name;
			searchItem.platform = 'n/a';

			// format date
			if (results[i].original_release_date !== null && results[i].original_release_date !== '') {
				searchItem.releaseDate = results[i].original_release_date.split(' ')[0];
			} else {
				searchItem.releaseDate = '1900-01-01';
			}

			// set small url
			if (results[i].image !== null && results[i].image.small_url && results[i].image.small_url !== '') {
				searchItem.smallImage = results[i].image.small_url;
			} else {
				searchItem.smallImage = 'no image.png';
			}

			// set thumb url
			if (results[i].image !== null && results[i].image.thumb_url && results[i].image.thumb_url !== '') {
				searchItem.thumbnailImage = results[i].image.thumb_url;
			} else {
				searchItem.thumbnailImage = 'no image.png';
			}

			// set large url
			if (results[i].image !== null && results[i].image.super_url && results[i].image.super_url !== '') {
				searchItem.largeImage = results[i].image.super_url;
			} else {
				searchItem.largeImage = 'no image.png';
			}

			// set description
			if (results[i].description !== null && results[i].description  !== '') {
				searchItem.description = results[i].description;
			} else {
				searchItem.description = 'No Description';
			}

			// save item in search results cache under ASIN key
			tempSearchResults[searchItem.id] = searchItem;
			// add again to tempSortedResults to sort array by releaseDate
			tempSortedResults.push(searchItem);

		}

		// set tempSearchResults, tempSortedResults to search model
		search.set({'searchResults': tempSearchResults});
		search.set({'sortedSearchResults': tempSortedResults});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortSearchItemByDate -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortSearchItemByDate = function(a, b) {

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
				searchProvider = SEARCH_PROVIDERS.Amazon;
				break;
			case '1':
				searchProvider = SEARCH_PROVIDERS.GiantBomb;
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayTypeChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayTypeChanged = function(toggleButton) {

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

		// trigger change on sortedSearchResults to re-render template for new dislayType
		search.trigger("change:sortedSearchResults");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchFieldTimeOut
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchFieldTimeOut = function() {

		console.info("SEARCH FIELD TIME OUT");

		clearTimeout(timeout);
		SearchView.search(search.get('searchTerms'));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* EVENT HANDLERS
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var inputFieldKeyDown = function(event) {

		// get search value
		search.set({'searchTerms': $(inputFieldNode).val()});

		if (timeout) {
			clearTimeout(timeout);
		}
		// if space key, start timer to wait
		if(event.which == 32) {
			console.info("START TIMER");
			timeout = setTimeout(searchFieldTimeOut, TIME_TO_SUBMIT_QUERY);

		// enter key, run query immediately
		} else if (event.which == 13) {
			SearchView.search(search.get('searchTerms'));
		}
    };

})(tmz.module('searchView'));
