// FILTER PANEL
(function(FilterPanel) {

	// dependecies
	var Utilities = tmz.module('utilities');

	// node cache
	var $filtersModal = $('#filters-modal');

	// filters
    var $releaseDateFilter = $('#releaseDate_filter');
    var $gameStatusFilter = $('#gameStatus_filter');
    var $playStatusFilter = $('#playStatus_filter');
    var $metascoreFilter = $('#metascore_filter');
    var $platformFilter = $('#platformFilterList');

	// data

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.init = function() {

		FilterPanel.createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.createEventHandlers = function() {

		// filter buttons
        $filtersModal.on('click', '.btn-group button', function(e) {
            e.preventDefault();
        });
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showFilterPanel
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.showFilterPanel = function() {

		$filtersModal.modal('show');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.getFilters = function() {

		console.info('apply filter');

		var filters = {};
		filters.releaseDateFilters = [];
		filters.metascoreFilters = [];
		filters.platformFilters = [];
		filters.gameStatusFilters = [];
		filters.playStatusFilters = [];

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.releaseDateFilters.push(true);
			} else {
				filters.releaseDateFilters.push(false);
			}
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.metascoreFilters.push(true);
			} else {
				filters.metascoreFilters.push(false);
			}
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.gameStatusFilters.push(true);
			} else {
				filters.gameStatusFilters.push(false);
			}
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.playStatusFilters.push(true);
			} else {
				filters.playStatusFilters.push(false);
			}
		});

		// iterate platform filter options
		platformFilters = $platformFilter.val() || [];

		for (var i = 0, len = platformFilters.length; i < len; i++) {
			filters.platformFilters[i] = Utilities.getStandardPlatform(platformFilters[i]);
		}

		return filters;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyListJSFiltering -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.applyListJSFiltering = function(list) {

		// get filters
		var filters = FilterPanel.getFilters();
		var filtered = false;

		// apply filters
		list.filter(function(itemValues) {

			var releaseDateStatus = FilterPanel.releaseDateFilter(itemValues.releaseDate, filters.releaseDateFilters);
			var metascoreStatus = FilterPanel.metascoreFilter(itemValues.metascore, filters.metascoreFilters);
			var platformStatus = FilterPanel.platformFilter(itemValues.platform, filters.platformFilters);
			var gameStatus = FilterPanel.gameStatusFilter(itemValues.gameStatus, filters.gameStatusFilters);
			var playStatus = FilterPanel.playStatusFilter(itemValues.playStatus, filters.playStatusFilters);

			// not filtered
			if (releaseDateStatus && metascoreStatus && platformStatus && playStatus && gameStatus) {
				return true;
			}

			// filtered out
			filtered = true;
			return false;
		});

		return filtered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyIsotopeFiltering -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.applyIsotopeFiltering = function($gridViewContainer, sortType, sortAsc) {

		var filters = FilterPanel.getFilters();
		var filtered = false;
		console.info(filters);
		console.info(sortType);

		// get selected items
		var selectedItems = $('.gridItem').filter(function(index){

			var $this = $(this);

			// releaseDate
			var releaseDate = $this.find('.releaseDate').text();
			var releaseDateFiltered = FilterPanel.releaseDateFilter(releaseDate, filters.releaseDateFilters);

			// metacriticScore
			var metacriticScore = $this.find('.metacriticScore').text();
			var metacriticScoreFiltered =  FilterPanel.metascoreFilter(metacriticScore, filters.metascoreFilters);

			// platform
			var platform = $this.find('.platform .data').text();
			var platformFiltered =  FilterPanel.platformFilter(platform, filters.platformFilters);

			// gameStatus
			var gameStatus = $this.find('.gameStatus').text();
			var gameStatusFiltered =  FilterPanel.gameStatusFilter(gameStatus, filters.gameStatusFilters);

			// playStatus
			var playStatus = $this.find('.playStatus').text();
			var playStatusFiltered =  FilterPanel.playStatusFilter(playStatus, filters.playStatusFilters);

			if (releaseDateFiltered && gameStatusFiltered && playStatusFiltered && metacriticScoreFiltered && platformFiltered) {
				return true;
			}

			filtered = true;
			return false;
		});

		// apply isotope filter and keep current sort
		$gridViewContainer.isotope({
			filter: selectedItems,
			sortBy : sortType,
			sortAscending : sortAsc
		});

		return filtered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.resetFilters = function(item) {

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all platform options, deselect
		$platformFilter.find('option').each(function(key, item) {
			$(this).removeAttr('selected');
		});
		$platformFilter.trigger("liszt:updated");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* upcomingQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.upcomingQuickFilter = function(list) {
		// activate filter panel option
		$releaseDateFilter.find('button[data-content="0"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* newReleasesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.newReleasesQuickFilter = function(list) {
		$releaseDateFilter.find('button[data-content="1"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* neverPlayedQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.neverPlayedQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="0"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gamesPlayingQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.gamesPlayingQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="1"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finishedGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.finishedGamesQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="2"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* ownedGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.ownedGamesQuickFilter = function(list) {
		$gameStatusFilter.find('button[data-content="1"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* wantedGamesQuickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.wantedGamesQuickFilter = function(list) {
		$gameStatusFilter.find('button[data-content="3"]').addClass('active');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.releaseDateFilter = function(rawReleaseDate, filterList) {

		// filter config (1: unreleased, 2: released)
		var unreleasedFilter = filterList[0];
		var releasedFilter = filterList[1];

		var releaseDate = moment(rawReleaseDate, 'YYYY-MM-DD');
		var currentDate = moment();

		var diff = releaseDate.diff(currentDate, 'seconds');

		// all filters active - ignore filter
		if (unreleasedFilter && releasedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!unreleasedFilter && !releasedFilter) {
			return true;

		// specific filter
		} else if (unreleasedFilter && diff > 0) {
			return true;
		} else if (releasedFilter && diff < 0) {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gameStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.gameStatusFilter = function(gameStatus, filterList) {

		var noneFilter = filterList[0];
		var ownFilter = filterList[1];
		var soldFilter = filterList[2];
		var wantedFilter = filterList[3];

		// all filters active - ignore filter
		if (noneFilter && ownFilter && soldFilter && wantedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!noneFilter && !ownFilter && !soldFilter && !wantedFilter) {
			return true;

		// specific filters
		} else if (noneFilter && gameStatus === '0') {
			return true;
		} else if (ownFilter && gameStatus === '1') {
			return true;
		} else if (soldFilter && gameStatus === '2') {
			return true;
		} else if (wantedFilter && gameStatus === '3') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.playStatusFilter = function(playStatus, filterList) {

		var notPlayingFilter = filterList[0];
		var playingFilter = filterList[1];
		var finishedFilter = filterList[2];

		// all filters active - ignore filter
		if (notPlayingFilter && playingFilter && finishedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!notPlayingFilter && !playingFilter && !finishedFilter) {
			return true;

		// specific filters
		} else if (notPlayingFilter && playStatus === '0') {
			return true;
		} else if (playingFilter && playStatus === '1') {
			return true;
		} else if (finishedFilter && playStatus === '2') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.metascoreFilter = function(metascore, filterList) {

		var _90sFilter = filterList[0];
		var _80sFilter = filterList[1];
		var _70sFilter = filterList[2];
		var _60sFilter = filterList[3];
		var _50sFilter = filterList[4];
		var _25to49Filter = filterList[5];
		var _0to24Filter = filterList[6];

		var score = parseInt(metascore, 10);

		// all filters selected - ignore filter
		if (_90sFilter && _80sFilter && _70sFilter && _60sFilter && _50sFilter && _25to49Filter && _0to24Filter) {
			return true;

		// no filters selected - ignore filter
		} else if (!_90sFilter && !_80sFilter && !_70sFilter && !_60sFilter && !_50sFilter && !_25to49Filter && !_0to24Filter) {
			return true;

		// specifc filter
		} else if (_90sFilter && score >= 90) {
			return true;
		} else if (_80sFilter && score >= 80 && score < 90) {
			return true;
		} else if (_70sFilter && score >= 70 && score < 80) {
			return true;
		} else if (_60sFilter && score >= 60 && score < 70) {
			return true;
		} else if (_50sFilter && score >= 50 && score < 60) {
			return true;
		} else if (_25to49Filter && score >= 25 && score < 50) {
			return true;
		} else if (_0to24Filter && score >= 0 && score < 25) {
			return true;
		}

		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.platformFilter = function(platform, filterList) {

		// platform filter list empty - no filter
		if (filterList.length === 0) {
			return true;
		}

		// iterate platform list
		for (var i = 0, len = filterList.length; i < len; i++) {

			if (filterList[i].name === platform) {
				return true;
			}
		}

		return false;
	};

})(tmz.module('filterPanel'));
