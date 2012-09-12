// ReleasedList
(function(ReleasedList, tmz, $, _) {
	"use strict";

    // module references

	// properties

	// REST URL
	var RELEASED_LIST_URL = tmz.api + 'list/released/',

		// data
		releasedListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getReleasedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ReleasedList.getReleasedGames = function(platform, year, month, day, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(year, month, day);

		if (cachedList) {

			// filter results based on platform
			var filteredResults = filterListResults(cachedList, platform);

			// return list
			onSuccess(filteredResults);

		// fetch list data
		} else {
			var requestData = {
				'year': year,
				'month': month,
				'day': day
			};

			$.ajax({
				url: RELEASED_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// filter results based on platform
					var filteredResults = filterListResults(data, platform);

					// cache result
					releasedListCache[year + '_' + month + '_' + day] = filteredResults;

					// return items to onSuccess function
					onSuccess(filteredResults);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* filterListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var filterListResults = function(listResults, platform) {

		var filteredResults = [];

		// iterate list results
		for (var i = 0, len = listResults.length; i < len; i++) {

			// clean up name
			// remove words appearing after 'box'
			listResults[i].name = listResults[i].name.replace(/\sbox\s*.*/gi, '');

			if (_.has(listResults[i], 'platforms')) {
				var listPlatforms = listResults[i].platforms.toLowerCase();

				// find platform substring in listPlatforms
				var searchIndex = listPlatforms.search(platform);

				// result contains platform add to filteredResults
				if (searchIndex !== -1) {
					filteredResults.push(listResults[i]);
				}
			}
		}

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

