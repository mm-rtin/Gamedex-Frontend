// Steam
(function(Steam, tmz, $, _) {
	"use strict";

    // module references
	var ItemLinker = tmz.module('itemLinker'),

		// REST URL
		STEAM_SEARCH_URL = tmz.api + 'steam/search/',
		STEAM_CACHE_URL = tmz.api + 'steam/cache/',

		// properties
		STEAM_BASE_URL = 'http://store.steampowered.com/',

		// data
		steamItemCache = {},

		// request queues
		getSteamQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getSteamGame -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Steam.getSteamGame = function(searchTerms, sourceItem, onSuccess) {

		var ajax = null;

		// find in cache first
		var steamItem = getCachedSteamGame(searchTerms);

		if (steamItem) {

			// add steam data to source item
			sourceItem.steamPage = steamItem.steamPage;
			sourceItem.steamPrice = steamItem.steamPrice;

			// return steam item
			onSuccess(steamItem);

		// fetch steam item
		} else {

			// add to queue
			var queueKey = searchTerms + '_';

			if (!_.has(getSteamQueue, queueKey)) {
				getSteamQueue[queueKey] = [];
			}
			getSteamQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getSteamQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms)
				};

				ajax = $.ajax({
						url: STEAM_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// parse result
							var steamItem = parseSteamResults(cleanedSearchTerms, data, sourceItem);

							if (steamItem) {

								// iterate queued return methods
								_.each(getSteamQueue[queueKey], function(successMethod) {

									// add steamItem to source item
									sourceItem.steamPage = steamItem.steamPage;
									sourceItem.steamPrice = steamItem.steamPrice;

									// add to local cache
									addToSteamCache(searchTerms, steamItem.steamPage, steamItem.steamPrice);

									// return data
									successMethod(steamItem);
								});
							}

							// empty queue
							getSteamQueue[queueKey] = [];
						}
					});
			}
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cleanupSearchTerms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cleanupSearchTerms = function(searchTerms) {

		// remove ':', '&'
		re = /\s*[:&]\s*/g;
		var cleanedSearchTerms = searchTerms.replace(re, ' ');

		// remove spaces
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '');

		return cleanedSearchTerms;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedSteamGame -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedSteamGame = function(searchTerms) {

		var steamItem = null;

		if (typeof steamItemCache[searchTerms] !== 'undefined') {
			steamItem = steamItemCache[searchTerms];
		}

		return steamItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToSteamCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToSteamCache = function(searchTerms, steamPage, steamPrice) {

		steamItemCache[searchTerms] = {'steamPage': steamPage, 'steamPrice': steamPrice};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseSteamResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseSteamResults = function(keywords, data, sourceItem) {

		var steamItem = {};

		// cache new result which requires matching and caching
		if (typeof data.url === 'undefined') {

			// get result that matches sourceItem
			steamItem = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (steamItem) {
				addToServerCache(keywords, steamItem.steamPage, steamItem.steamPrice);
			}

		// parse cached result
		} else {
			steamItem = {'steamPage': data.url, 'steamPrice': data.price};
		}

		return steamItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(searchTerms, steamPage, steamPrice) {

		var requestData = {
			'keywords': encodeURI(searchTerms),
			'url': encodeURI(steamPage),
			'price': encodeURI(steamPrice)
		};

		$.ajax({
			url: STEAM_CACHE_URL,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMatchedSearchResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMatchedSearchResult = function(steamList, sourceItem) {

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		_.each(steamList, function(steamItem) {

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, steamItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = {'steamPage': steamItem.page, 'steamPrice': steamItem.price.replace('$', '')};
				bestScore = score;
			}
		});

		return bestMatch;
	};

})(tmz.module('steam'), tmz, jQuery, _);

