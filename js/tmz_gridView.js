// GiantBomb
(function(GridView, tmz, $, _) {
	"use strict";

    // module references
    var DetailView = tmz.module('detailView'),
		ItemData = tmz.module('itemData'),
		TagView = tmz.module('tagView'),
		Amazon = tmz.module('amazon'),
		Utilities = tmz.module('utilities'),
		FilterPanel = tmz.module('filterPanel'),

		// constants
		DEFAULT_DISPLAY_TYPE = 1,
		SORT_TYPES = {'itemName': 0, 'metacriticScore': 1, 'releaseDate': 2, 'platform': 3, 'rawPrice': 4},

		// properties
		currentSortIndex = 0,
		currentSortType = null,
		currentSortAsc = true,
		filterType = null,

		// node cache
		$gridViewContainer = $('#gridViewContainer'),
		$gridList = $('#gridList'),
		$viewName = $gridList.find('.viewName'),
		$gridViewOptions = $('#gridViewOptions'),

		// display options
		$displayOptions = $gridViewOptions.find('.displayOptions'),
		$displayTypeField = $displayOptions.find('.displayType'),

		// sort options
		$sortOptions = $gridViewOptions.find('.sortOptions'),
		$sortTypeField = $sortOptions.find('.sortType'),

		// filter options
		$filterOptions = $gridViewOptions.find('.filterOptions'),
		$clearFiltersBtn = $filterOptions.find('.clearFilters_btn'),
		$filterTypeField = $filterOptions.find('.filterType'),
		$filterDropDownBtn = $filterOptions.find('.filterDropDown_btn'),
		$listFiltersButton = $filterOptions.find('.listFilters_btn'),
		$applyFiltersButton = $('#applyFilters_btn'),
		$filtersModal = $('#filters-modal'),

		// templates
		gridResultsTemplate = _.template($('#grid-results-template').html()),

		// data
		widthCache = {},

		// properties
		isotopeInitialized = false,
		displayType = null;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.init = function() {

		// create event handlers
		createEventHandlers();

		// init tooltips
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		$displayOptions.find('button').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// set initial filtered status
		setClearFiltersButton(false);
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

		// listFilters_btn: click
		$listFiltersButton.click(function(e) {
			e.preventDefault();
			$filtersModal.modal('show');
		});

		// clearFiltersBtn: click
		$clearFiltersBtn.click(function(e) {
			e.preventDefault();

			// hide clear filters button
			setClearFiltersButton(false);
			$filterTypeField.text('None');
			// clear filters
			FilterPanel.resetFilters();
			applyFilters();
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();
			// apply filters
			applyFilters();

			// show clear filters button
			setClearFiltersButton(true);
		});

		// gridList: click
		$gridList.find('ul').on('click', 'a', function(e) {
			e.preventDefault();
			changeGridList($(this).text(), $(this).attr('data-content'));
		});

		// gridItem: click
		$gridViewContainer.on('click', '.gridItem img', function(e) {
			e.preventDefault();
			gridItemSelected($(this).parent().parent().attr('data-content'));
		});

		// gridItem: mouseover
		$gridViewContainer.on('mouseover', '.gridItem', function(e) {
			e.preventDefault();

			var $gridItem = $(this);
			var id = $gridItem.attr('data-content');
			var width = widthCache[id];
			if (!width) {
				width = $gridItem.width();
				widthCache[id] = width;
			}

			var offset = Math.round((width * 1.2 - width) / 2);

			$gridItem.css({'z-index': '999',
						//'top': -offset + 'px',
						//'left': -offset + 'px',
						'width': width * 1.2 + 'px',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
		});

		// gridItem: mouseout
		$gridViewContainer.on('mouseout', '.gridItem', function(e) {
			e.preventDefault();

			var $gridItem = $(this);

			$gridItem.css({'z-index': '',
						//'top': '',
						//'left': '',
						'width': '',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
		});

		// displayOptions: click
		$displayOptions.find('li a').click(function(e) {
			e.preventDefault();

			// set type field
			$displayTypeField.text($(this).text());

			// change display type
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

			// custom filter
			filterType = parseInt($(this).attr('data-content'), 10);
			if (filterType === 0) {
				FilterPanel.showFilterPanel();

			// quick filter
			} else {

				// show clear filters button
				setClearFiltersButton(true);

				// set filterType field
				$filterTypeField.text($(this).text());

				quickFilter(parseInt($(this).attr('data-content'), 10));
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.showGridView = function(tagID) {

		// switch content display to gridView

		// modify styles
		$('#wrapper').removeClass('standardView');
		$('#wrapper').addClass('gridView');

		// select gridList tagID
		TagView.selectGridTag(tagID);

		// load grid
		loadGridData(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* exitGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var exitGridView = function() {

		// switch content display to standardView
		// modify styles
		$('#wrapper').removeClass('gridView');
		$('#wrapper').addClass('standardView');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeGridList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeGridList = function(tagName, tagID) {


		// set view name
		$viewName.text(tagName);

		// load items
		loadGridData(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadGridData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadGridData = function(tagID) {

		$gridViewContainer.hide();
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

		var templateData = {'items': items};

		// set html from items data
		$gridViewContainer.html(gridResultsTemplate(templateData));

		// initialize isotope after images have loaded
		$gridViewContainer.imagesLoaded( function(){

			// show gridViewContainer
			$gridViewContainer.show();
			initializeIsotope();
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

		// view in detail panel
		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		var quickFilter = parseInt(filterType, 10);
		FilterPanel.resetFilters();


		switch (quickFilter) {

			// upcoming
			case 1:
				FilterPanel.upcomingQuickFilter();
				currentSortType = 'releaseDate';
				currentSortAsc = true;
				break;

			// new releases
			case 2:
				FilterPanel.newReleasesQuickFilter();
				currentSortType = 'releaseDate';
				currentSortAsc = false;
				break;

			// never played
			case 3:
				FilterPanel.neverPlayedQuickFilter();
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// games playing
			case 4:
				FilterPanel.gamesPlayingQuickFilter();
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// games played
			case 5:
				FilterPanel.gamesPlayedQuickFilter();
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// finished games
			case 6:
				FilterPanel.finishedGamesQuickFilter();
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// owned games
			case 7:
				FilterPanel.ownedGamesQuickFilter();
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// wanted games
			case 8:
				FilterPanel.wantedGamesQuickFilter();
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;
		}

		// apply filters to itemList and set filtered Status icon
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		// check if custom filter type
		if (filterType === 0) {
			// set filterType field
			$filterTypeField.text('Custom');
		}

		// apply filters to itemList and set filtered Status icon
		setClearFiltersButton(FilterPanel.applyIsotopeFiltering($gridViewContainer, currentSortType, currentSortAsc));
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
			case SORT_TYPES.itemName:
				// set sort status
				$sortTypeField.text('Alphabetical');
				currentSortType = 'itemName';
				// sort new list
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;

			// review scores
			case SORT_TYPES.metacriticScore:
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : false
				});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : false
				});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortTypeField.text('Platform');
				currentSortType = 'platform';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;

			// price
			case SORT_TYPES.rawPrice:
				$sortTypeField.text('Price');
				currentSortType = 'rawPrice';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;
		}
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
	* setClearFiltersButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setClearFiltersButton = function(filtered) {

		// check if filtered - show clearFiltersBtn button
		if (filtered) {
			$clearFiltersBtn.show();
			$clearFiltersBtn.next().show();
		} else {
			$clearFiltersBtn.hide();
			$clearFiltersBtn.next().hide();
		}
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


})(tmz.module('gridView'), tmz, jQuery, _);
