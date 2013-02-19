// IGN
(function(IGN, gamedex, $, _) {

	// REST URL
	var UPCOMING_POPULAR_LIST_URL = gamedex.api + 'list/ign/upcoming/popular/',
		UPCOMING_LIST_URL = gamedex.api + 'list/ign/upcoming/',
		REVIEWED_LIST_URL = gamedex.api + 'list/ign/reviewed/',

		// data
		IGNUpcomingPopularListCache = {};
		IGNUpcomingListCache = {};
		IGNReviewedListCache = {};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getPopularGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getPopularGames = function(platform, page, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(IGNUpcomingPopularListCache, platform, page);

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
				url: UPCOMING_POPULAR_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					IGNUpcomingPopularListCache[platform + '_' + page] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUpcomingGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getUpcomingGames = function(platform, page, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(IGNUpcomingListCache, platform, page);

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
	* getReviewedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getReviewedGames = function(platform, page, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(IGNReviewedListCache, platform, page);

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
				url: REVIEWED_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					IGNReviewedListCache[platform + '_' + page] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(cache, platform, page) {

		var IGNUpcomingList = null;

		if (typeof cache[platform + '_' + page] !== 'undefined') {
			IGNUpcomingList = cache[platform + '_' + page];
		}

		return IGNUpcomingList;
	};


})(gamedex.module('ign'), gamedex, jQuery, _);

