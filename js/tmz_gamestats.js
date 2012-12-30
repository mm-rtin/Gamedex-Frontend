// GameStats
(function(GameStats, tmz, $, _) {
	"use strict";

    // module references

	// properties

	// REST URL
	var POPULAR_LIST_URL = tmz.api + 'list/popular/',

		// data
		gameStatsListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getPopularGamesListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameStats.getPopularGamesListByPlatform = function(platform, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform);

		if (cachedList) {
			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'platform': platform
			};

			$.ajax({
				url: POPULAR_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					gameStatsListCache[platform] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(platform) {

		var gameStatsList = null;

		if (typeof gameStatsListCache[platform] !== 'undefined') {
			gameStatsList = gameStatsListCache[platform];
		}

		return gameStatsList;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToGamestatsCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGamestatsCache = function() {


	};




})(tmz.module('gameStats'), tmz, jQuery, _);

