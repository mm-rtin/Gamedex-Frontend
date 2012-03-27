// IGN
(function(IGN) {

    // module references

	// properties

	// REST URL
	var UPCOMING_LIST_URL = tmz.api + 'upcominglist/';

	// data
	var IGNUpcomingListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUpcomingGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getUpcomingGames = function(platform, page, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform, page);

		if (cachedList) {

			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'platform': platform,
				'page': page
			};

			$.ajax({
				url: UPCOMING_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					IGNUpcomingListCache[platform + '_' + page] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(platform, page) {

		var IGNUpcomingList = null;

		if (typeof IGNUpcomingListCache[platform + '_' + page] !== 'undefined') {
			IGNUpcomingList = IGNUpcomingListCache[platform + '_' + page];
		}

		return IGNUpcomingList;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToIGNCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToIGNCache = function() {


	};




})(tmz.module('ign'));

