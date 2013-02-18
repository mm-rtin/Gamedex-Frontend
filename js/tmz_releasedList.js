// ReleasedList
(function(ReleasedList, tmz, $, _) {
	"use strict";

    // module references
	var Utilities = tmz.module('utilities');

	// properties

	// REST URL
	var RELEASED_LIST_URL = tmz.api + 'list/gt/released/',

		// data
		releasedListCache = {},

		// list of platforms found in released list
		platformsFound = {},

		pendingRequests = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getReleasedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ReleasedList.getReleasedGames = function(platform, year, month, day, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(year, month, day);
		var releasedGamesRequest = null;

		if (cachedList) {

			// filter results based on platform
			var filteredResults = parseAndFilterListResults(cachedList, platform);

			// return list
			onSuccess(filteredResults, platformsFound);

		// fetch list data
		} else {

			var key = year + '_' + month + '_' + day;

			// if request is already pending, skip
			if (!_.has(pendingRequests, key)) {

				// add to pendingRequests
				var pendingRequest = {'platform':platform};
				pendingRequests[key] = pendingRequest;

				var requestData = {
					'year': year,
					'month': month,
					'day': day
				};

				releasedGamesRequest = $.ajax({
					url: RELEASED_LIST_URL,
					type: 'GET',
					data: requestData,
					cache: true,
					success: function(data) {

						// parse platforms and add into proper platform list
						parsePlatforms(data);

						// get platforms found in list
						getPlatformsFound(data);

						// filter results based on platform
						var filteredResults = parseAndFilterListResults(data, pendingRequests[key].platform);

						// cache unfiltered result
						releasedListCache[year + '_' + month + '_' + day] = data;

						// return items to onSuccess function
						onSuccess(filteredResults, platformsFound);

						// remove pending request
						delete pendingRequests[key];
					}
				});

			// update platform for request
			} else {
				pendingRequests[key].platform = platform;
			}
		}

		return releasedGamesRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parsePlatforms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parsePlatforms = function(listResults) {

		// iterate list results
		_.each(listResults, function(listItem) {

			var platformList = listItem.platforms.split(',');

			// created linkedPlatform property
			listItem['linkedPlatforms'] = {'all': undefined};

			// iterate list item platforms
			_.each(platformList, function(platform) {

				var cleanedPlatform = _.str.trim(platform);
				var linkedPlatform = Utilities.getStandardPlatform(cleanedPlatform);

				// add to linkedPlatforms
				listItem.linkedPlatforms[linkedPlatform.id] = linkedPlatform.name;
			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getPlatformsFound -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getPlatformsFound = function(listResults) {

		// iterate list results
		_.each(listResults, function(listItem) {

			// iterate list item platforms
			_.each(listItem.linkedPlatforms, function(value, id) {

				// add playform to platformsFound object
				if (!_.has(platformsFound, id)) {
					platformsFound[id] = 1;
				} else {
					platformsFound[id] = platformsFound[id] + 1;
				}
			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAndFilterListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAndFilterListResults = function(listResults, platform) {

		var filteredResults = [];

		// iterate list results
		_.each(listResults, function(listItem) {

			// clean up name
			// remove words appearing after 'box'
			listItem.name = listItem.name.replace(/\sbox\s*.*/gi, '');

			// result contains platform add to filteredResults
			if (_.has(listItem.linkedPlatforms, platform)) {
				filteredResults.push(listItem);
			}
		});

		return filteredResults;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(year, month, day) {

		var releasedList = null;

		if (typeof releasedListCache[year + '_' + month + '_' + day] !== 'undefined') {
			releasedList = releasedListCache[year + '_' + month + '_' + day];
		}

		return releasedList;
	};


})(tmz.module('releasedList'), tmz, jQuery, _);

