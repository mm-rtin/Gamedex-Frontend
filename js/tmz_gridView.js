// GiantBomb
(function(GridView) {

    // module references
    var DetailView = tmz.module('detailView');
	var ItemData = tmz.module('itemData');
	var Amazon = tmz.module('amazon');
	var Utilities = tmz.module('utilities');

	// constants
	var DEFAULT_DISPLAY_TYPE = 1;

    // node cache
    var $gridViewContainer = $('#gridViewContainer');
    var $gridList = $('#gridList');
    var $gridViewOptions = $('#gridViewOptions');

    var $displayOptions = $gridViewOptions.find('.displayOptions');
    var $sortOptions = $gridViewOptions.find('.sortOptions');
    var $filterOptions = $gridViewOptions.find('.filterOptions');

    // templates
    var gridResultsTemplate = _.template($('#grid-results-template').html());

    // data
    var widthCache = {};

    // properties
    var isotopeInitialized = false;
    var displayType = null;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.init = function() {

		// create event handlers
		createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var createEventHandlers = function(item) {

		// exit grid view button: click
		$('#exitGridView_btn').click(function(e) {
			e.preventDefault();
			exitGridView();
		});

		// gridList: change
		$gridList.chosen().change(gridListChanged);

		// gridItem: click
		$gridViewContainer.on('click', '.gridItem img', function(e) {
			gridItemSelected($(this).parent().parent().attr('data-content'));
			e.preventDefault();
		});

		// gridItem: mouseover
		$gridViewContainer.on('mouseover', '.gridItem', function(e) {

			var $gridItem = $(this);
			var id = $gridItem.attr('data-content');
			var width = widthCache[id];
			if (!width) {
				width = $gridItem.width();
				widthCache[id] = width;
			}

			var offset = Math.round((width * 1.2 - width) / 2);

			$gridItem.css({'z-index': '999',
						'top': -offset + 'px',
						'left': -offset + 'px',
						'width': width * 1.2 + 'px',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
			e.preventDefault();
		});
		// gridItem: mouseout
		$gridViewContainer.on('mouseout', '.gridItem', function(e) {

			var $gridItem = $(this);

			$gridItem.css({'z-index': '',
						'top': '',
						'left': '',
						'width': '',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
			e.preventDefault();
		});

		// displayOptions: click
		$displayOptions.find('button').click(function(e) {
			e.preventDefault();
			changeDisplayType($(this).attr('data-content'));
		});

		// sortOptions: click
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList($(this).attr('data-content'));
		});

		// filterOptions: click
		$filterOptions.find('li a').click(function(e) {
			e.preventDefault();
			quickFilter($(this).attr('data-content'));
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.showGridView = function(tagID) {

		// switch content display to gridView

		// modify styles
		$('#content').removeClass('standardView');
		$('#content').addClass('gridView');

		// load grid
		loadGridData(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* exitGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var exitGridView = function() {

		// switch content display to standardView
		// modify styles
		$('#content').removeClass('gridView');
		$('#content').addClass('standardView');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gridListChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gridListChanged = function() {

		// load items
		loadGridData($gridList.val());
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadGridData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadGridData = function(tagID) {

		// reset isotop
		if (isotopeInitialized) {
			$gridViewContainer.isotope('destroy');
		}

		ItemData.getItems(tagID, getItems_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems_result = function(items) {

		// setup isotope gride
		initializeGrid(items);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeGrid -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initializeGrid = function(items) {

		console.info(items);

		var templateData = {'items': items};

		// set html from items data
		$gridViewContainer.html(gridResultsTemplate(templateData));

		// add filtering classes
		addFilteringClasses(items);

		// initialize isotope after images have loaded
		$gridViewContainer.imagesLoaded( function(){

			// show gridViewContainer
			$gridViewContainer.show();
			initializeIsotope();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addFilteringClasses -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addFilteringClasses = function(items) {

		var $gridItem = null;
		var id = null;
		var item = null;
		var releaseDate = null;
		var currentDate = null;
		var diff = null;
		var score = null;

		// iterate current grid items
		$('.gridItem').each(function(key, item) {

			$gridItem = $(item);

			// get item data
			id = $gridItem.attr('data-content');
			item = items[id];

			// platform
			$gridItem.addClass(item.platform);

			// releaseDate
			releaseDate = moment(item.releaseDate, 'YYYY-MM-DD');
			currentDate = moment();
			diff = releaseDate.diff(currentDate, 'seconds');
			if (diff > 0) {
				$gridItem.addClass('unreleased');
			} else {
				$gridItem.addClass('released');
			}

			// gameStatus
			$gridItem.addClass('gameStatus' + item.gameStatus);
			// playStatus
			$gridItem.addClass('playStatus' + item.playStatus);
			// userRating
			$gridItem.addClass('userRating' + item.userRating);

			// metascore
			if (score >= 90) {
				$gridItem.addClass('m_90s');
			} else if (score >= 80 && score < 90) {
				$gridItem.addClass('m_80s');
			} else if (score >= 70 && score < 80) {
				$gridItem.addClass('m_70s');
			} else if (score >= 60 && score < 70) {
				$gridItem.addClass('m_60s');
			} else if (score >= 50 && score < 60) {
				$gridItem.addClass('m_50s');
			} else if (score >= 25 && score < 50) {
				$gridItem.addClass('m_25to50');
			} else if (score >= 0 && score < 25) {
				$gridItem.addClass('m_0to24');
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeIsotope -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initializeIsotope = function() {

		isotopeInitialized = true;

		$gridViewContainer.isotope({
			itemSelector : '.gridItem',

			// sort
			getSortData : {
				itemName: itemNameSort,
				releaseDate: releaseDateSort,
				platform: platformSort,
				userRating: userRatingSort,
				metacriticScore: metacriticScoreSort,
				rawPrice: priceSort
			},

			// starting sort
			sortBy : 'itemName',
			sortAscending : true
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gridItemSelected -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gridItemSelected = function(id) {

		// show item detail page
		var item = ItemData.getItem(id);

		console.info(item);

		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		var quickFilter = parseInt(filterType, 10);

		switch (quickFilter) {

			// upcoming
			case 0:
				// unreleased, released
				releaseDatesQuickFilter([true, false]);
				break;

			// new releases
			case 1:
				// unreleased, released
				releaseDatesQuickFilter([false, true]);
				break;

			// best unplayed
			case 2:
				// not started, playing, finished
				bestPendingGamesQuickFilter([true, false, false]);
				break;

			// best unfinished
			case 3:
				// not started, playing, finished
				bestPendingGamesQuickFilter([false, true, false]);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		currentSortIndex = parseInt(sortType, 10);

		switch (currentSortIndex) {

			// alphabetical
			case 0:
				// set sort status
				$sortOptions.find('.currentSort').text('Alphabetical');
				// sort new list
				$gridViewContainer.isotope({
					sortBy : 'itemName',
					sortAscending : true
				});

				break;

			// review scores
			case 1:
				$sortOptions.find('.currentSort').text('Review Score');
				$gridViewContainer.isotope({
					sortBy : 'metacriticScore',
					sortAscending : false
				});

				break;

			// release date
			case 2:
				$sortOptions.find('.currentSort').text('Release Date');
				$gridViewContainer.isotope({
					sortBy : 'releaseDate',
					sortAscending : false
				});

				break;

			// platform
			case 3:
				$sortOptions.find('.currentSort').text('Platform');
				$gridViewContainer.isotope({
					sortBy : 'platform',
					sortAscending : true
				});

				break;

			// price
			case 4:
				$sortOptions.find('.currentSort').text('Price');
				$gridViewContainer.isotope({
					sortBy : 'rawPrice',
					sortAscending : true
				});

				break;
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDatesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDatesQuickFilter = function(filterList) {

		console.info(filterList);

		// get filter selection string
		var filterString = releaseDateFilter(filterList);

		console.info(filterString);

		// apply isotope filter and sort
		$gridViewContainer.isotope({
			filter: filterString,
			sortBy : 'releaseDate',
			sortAscending : false
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* bestPendingGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var bestPendingGamesQuickFilter = function(filterList) {

		console.info(filterList);

		// get filter selection string
		var filterString = playStatusFilter(filterList);

		console.info(filterString);

		// apply isotope filter and sort
		$gridViewContainer.isotope({
			filter: filterString,
			sortBy : 'metacriticScore',
			sortAscending : false
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateFilter = function(filterList) {

		// filter config (1: unreleased, 2: released)
		var unreleasedFilter = filterList[0];
		var releasedFilter = filterList[1];
		var filterString = '';

		// construct filter string
		if (unreleasedFilter) {
			filterString += '.unreleased';
		}
		if (releasedFilter) {
			filterString += '.released';
		}

		return filterString;
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gameStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gameStatusFilter = function(filterList) {

		// filter config (0: none)
		var noneFilter = filterList[0];
		var ownFilter = filterList[1];
		var soldFilter = filterList[2];
		var wantedFilter = filterList[3];
		var filterString = '';

		// construct filter string
		if (noneFilter) {
			filterString += '.gameStatus0';
		}
		if (ownFilter) {
			filterString += '.gameStatus1';
		}
		if (soldFilter) {
			filterString += '.gameStatus2';
		}
		if (wantedFilter) {
			filterString += '.gameStatus3';
		}
		return filterString;
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playStatusFilter = function(filterList) {

		// filter config (1: unreleased, 2: released)
		var notPlayingFilter = filterList[0];
		var playingFilter = filterList[1];
		var finishedFilter = filterList[2];
		var filterString = '';

		// construct filter string
		if (notPlayingFilter) {
			filterString += '.playStatus0';
		}
		if (playingFilter) {
			filterString += '.playStatus1';
		}
		if (finishedFilter) {
			filterString += '.playStatus2';
		}

		return filterString;
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreFilter = function(filterList) {

		var _90sFilter = filterList[0];
		var _80sFilter = filterList[1];
		var _70sFilter = filterList[2];
		var _60sFilter = filterList[3];
		var _50sFilter = filterList[4];
		var _25to49Filter = filterList[5];
		var _0to24Filter = filterList[6];
		var filterString = '';

		// construct filter string
		if (_90sFilter) {
			filterString += '.m_90s';
		}
		if (_80sFilter) {
			filterString += '.m_80s';
		}
		if (_70sFilter) {
			filterString += '.m_70s';
		}
		if (_60sFilter) {
			filterString += '.m_60s';
		}
		if (_50sFilter) {
			filterString += '.m_50s';
		}
		if (_25to49Filter) {
			filterString += '.m_25to50';
		}
		if (_0to24Filter) {
			filterString += '.m_0to24';
		}

		return filterString;
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var platformFilter = function(filterList) {

		var filterString = '';
		// iterate platform filter options
		platformFilters = $('#platformFilterList').val() || [];

		// iterate selected platforms
		for (var i = 0, len = platformFilters.length; i < len; i++) {
			filterString += Utilities.getStandardPlatform(platformFilters[i]);
		}

		// construct filter string
		return filterString;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemNameSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemNameSort = function($elem) {
		return $elem.find('.itemName').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function($elem) {
		return $elem.find('.releaseDate').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var platformSort = function($elem) {
		return $elem.find('.platform').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* userRatingSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var userRatingSort = function($elem) {
		return parseInt($elem.find('.userRating').text(), 10);
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metacriticScoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metacriticScoreSort = function($elem) {
		return parseInt($elem.find('.metacriticScore').text(), 10);
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function($elem) {
		return parseInt($elem.find('.rawPrice').text(), 10);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(currentDisplayType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		// reset cache
		widthCache = {};

		// set new display type if changed
		if (displayType !== currentDisplayType) {

			// change #itemResults tbody class
			$gridViewContainer.removeClass('display-' + displayType).addClass('display-' + currentDisplayType);

			displayType = currentDisplayType;

			// re-layout isotope
			$gridViewContainer.isotope( 'reLayout', function() {
				console.info('done');
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearTransitionProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearTransitionProperties = function(item) {

		$('.gridItem').each(function(key, item) {
			$(item).css({'z-index': '',
				'-webkit-transition-property': ''
			});
		});
	};


})(tmz.module('gridView'));
