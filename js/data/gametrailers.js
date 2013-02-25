// GameTrailers
(function(GameTrailers, gamedex, $, _) {
	"use strict";

    // module references
	var Amazon = gamedex.module('amazon'),
		ItemLinker = gamedex.module('itemLinker'),
		ItemData = gamedex.module('itemData'),

		// REST URL
		GAMETRAILERS_SEARCH_URL = gamedex.api + 'gametrailers/search/',
		GAMETRAILERS_CACHE_URL = gamedex.api + 'gametrailers/cache/',

		// properties
		GAMETRAILERS_BASE_URL = 'gametrailers.com',

		// data
		gametrailersPageCache = {},

		// request queues
		getGametrailersQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameTrailers.getGametrailersPage = function(searchTerms, sourceItem, onSuccess) {

		var ajax = null;

		// find in cache first
		var gameTrailersItem = getCachedGametrailersPage(searchTerms);

		if (gameTrailersItem) {

			// add gametrailersPage to source item
			sourceItem.gametrailersPage = gameTrailersItem.gametrailersPage;

			// return updated source item
			onSuccess(sourceItem.gametrailersPage);

		// fetch gametrailersPage
		} else {

			// add to queue
			var queueKey = searchTerms + '_';

			if (!_.has(getGametrailersQueue, queueKey)) {
				getGametrailersQueue[queueKey] = [];
			}
			getGametrailersQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getGametrailersQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms)
				};

				ajax = $.ajax({
						url: GAMETRAILERS_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// parse result
							var gametrailersPage = parseGametrailersResults(cleanedSearchTerms, data, sourceItem);

							// iterate queued return methods
							_.each(getGametrailersQueue[queueKey], function(successMethod) {

								// add gametrailersPage to source item
								sourceItem.gametrailersPage = gametrailersPage;
								// add to local cache
								addToGametrailersCache(searchTerms, gametrailersPage);
								// return data
								successMethod(gametrailersPage);
							});

							// empty queue
							getGametrailersQueue[queueKey] = [];
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

		// convert spaces to '+'
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '+');

		return cleanedSearchTerms;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedGametrailersPage = function(searchTerms) {

		var gametrailersPage = null;

		if (typeof gametrailersPageCache[searchTerms] !== 'undefined') {
			gametrailersPage = gametrailersPageCache[searchTerms];
		}

		return gametrailersPage;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToGametrailersCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGametrailersCache = function(searchTerms, gametrailersPage) {

		gametrailersPageCache[searchTerms] = {gametrailersPage: gametrailersPage};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGametrailersResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGametrailersResults = function(keywords, data, sourceItem) {

		var gametrailersPage = null;

		// parse raw result
		if (typeof data.gametrailersPage === 'undefined') {

			// get result that matches sourceItem
			gametrailersPage = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (gametrailersPage) {
				addToServerCache(keywords, gametrailersPage);
			}

		// parse cached result
		} else {
			gametrailersPage = data.gametrailersPage;
		}

		return gametrailersPage;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(searchTerms, gametrailersPage) {

		var requestData = {
			'keywords': encodeURI(searchTerms),
			'gametrailersPage': encodeURI(gametrailersPage)
		};

		$.ajax({
			url: GAMETRAILERS_CACHE_URL,
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
	var getMatchedSearchResult = function(data, sourceItem) {

		var results = $('#games', data).find('.video_game_information_child');
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		$(results).each(function() {

			// create standard item
			searchItem = {
				name: $(this).find('.content h3 a').text(),
				releaseDate: $(this).find('.content dl dd:eq(1) a').text(),
				gametrailersPage: $(this).find('.content h3 a').attr('href')
			};

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		});

		if (bestMatch) {
			return bestMatch.gametrailersPage + '/videos-trailers';
		}

		return null;
	};

})(gamedex.module('gameTrailers'), gamedex, jQuery, _);

