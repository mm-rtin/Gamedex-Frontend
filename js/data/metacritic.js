// Metacritic
(function(Metacritic, gamedex, $, _) {
	"use strict";

    // module references
	var Amazon = gamedex.module('amazon'),
		ItemLinker = gamedex.module('itemLinker'),
		ItemData = gamedex.module('itemData'),

		// REST URL
		METACRITIC_SEARCH_URL = gamedex.api + 'metacritic/search/',
		METACRITIC_CACHE_URL = gamedex.api + 'metacritic/cache/',

		// properties
		metacriticDomain = 'metacritic.com',

		// data
		metascoreCache = {},

		// request queues
		getMetascoreQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.getMetascore = function(searchTerms, sourceItem, fromSearch, onSuccess) {

		var metascoreRequest = null;

		// find in cache first
		var cachedScore = getCachedMetascore(sourceItem.asin, sourceItem.gbombID, sourceItem.platform);

		if (cachedScore) {

			metascoreRequest = cachedScore;

			// add score data to source item
			sourceItem.metascore = cachedScore.metascore;
			sourceItem.metascorePage = cachedScore.metascorePage;

			// return updated source item
			onSuccess(sourceItem);

		// fetch score data
		} else {

			// add to queue
			var queueKey = searchTerms + '_' + sourceItem.platform;

			if (!_.has(getMetascoreQueue, queueKey)) {
				getMetascoreQueue[queueKey] = [];
			}
			getMetascoreQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getMetascoreQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupMetacriticSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms),
					'platform': encodeURI(sourceItem.platform)
				};

				metascoreRequest = $.ajax({
						url: METACRITIC_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// save values before updated with current info
							var previousMetascore = sourceItem.metascore;

							// parse result > modify sourceItem
							var result = parseMetascoreResults(cleanedSearchTerms, data, sourceItem);

							// add results to sourceItem
							addMetascoreDatatoItem(result, sourceItem);

							// check if source item score or page differs from return score/page
							if (!fromSearch && sourceItem.metascore != previousMetascore) {
								// update metacritic data for source item record
								ItemData.updateMetacritic(sourceItem);
							}

							// iterate queued return methods
							_.each(getMetascoreQueue[queueKey], function(successMethod) {
								// add to local cache
								addToMetascoreCache(sourceItem.asin, sourceItem.gbombID, sourceItem.platform, sourceItem);
								// return data
								successMethod(sourceItem);
							});

							// empty queue
							getMetascoreQueue[queueKey] = [];
						}
					});
			}
		}

		return metascoreRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascoreData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.displayMetascoreData = function(page, score, metascoreSelector) {

		var $metascoreContainer = $(metascoreSelector);
		var textScore = score;

		// determine score color
		var colorClass = 'favorable';
		if (score < 0) {
			textScore = 'n/a';
			colorClass = 'unavailable';
		} else if (score < 50) {
			colorClass = 'unfavorable';
		} else if (score < 75) {
			colorClass = 'neutral';
		}

		$metascoreContainer
			.html(textScore)
			.removeClass('unavailable')
			.removeClass('unfavorable')
			.removeClass('neutral')
			.removeClass('favorable')
			.addClass(colorClass)
			.attr('href', 'http://www.' + metacriticDomain + page)
			.attr('data-score', score)
			.attr('data-original-title', metacriticDomain + ' ' + page)
			.show();

		// activate tooltip
		$metascoreContainer.tooltip({placement: 'left'});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cleanupMetacriticSearchTerms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cleanupMetacriticSearchTerms = function(searchTerms) {

		// remove ':', '&'
		re = /\s*[:&]\s*/g;
		var cleanedSearchTerms = searchTerms.replace(re, ' ');

		// convert spaces to '+'
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '+');

		return cleanedSearchTerms;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedMetascore = function(asin, gbombID, platform) {

		var metascoreItem = null;

		// amazon id
		if (typeof metascoreCache[asin + '_' + platform] !== 'undefined') {
			metascoreItem = metascoreCache[asin + '_' + platform];

		// giant bomb id
		} else if (typeof metascoreCache[gbombID + '_' + platform] !== 'undefined') {
			metascoreItem = metascoreCache[gbombID + '_' + platform];
		}

		return metascoreItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToMetascoreCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToMetascoreCache = function(asin, gbombID, platform, sourceItem) {

		// add to metascoreCache linked by asin
		if (asin != '0') {
			metascoreCache[asin + '_' + platform] = {metascorePage: sourceItem.metascorePage, metascore: sourceItem.metascore};
		}
		// add to metascoreCache linked by gbombID
		if (gbombID != '0') {
			metascoreCache[gbombID + '_' + platform] = {metascorePage: sourceItem.metascorePage, metascore: sourceItem.metascore};
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetascoreResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetascoreResults = function(keywords, data, sourceItem) {

		var result = null;

		// parse raw result
		if (typeof data.metascore === 'undefined') {

			// get result that matches sourceItem
			result = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (result) {
				addToServerCache(keywords, sourceItem.platform, result.metascore, result.metascorePage);
			}

		// parse cached result
		} else {

			result = data;
		}

		return result;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addMetascoreDatatoItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addMetascoreDatatoItem = function(result, sourceItem) {

		// add/update metascore data to sourceItem
		if (result && result.metascore !== '') {
			sourceItem.metascore = result.metascore;
			sourceItem.displayMetascore = result.metascore;
			sourceItem.metascorePage = result.metascorePage;
		} else if (result) {
			sourceItem.metascore = -1;
			sourceItem.displayMetascore = 'n/a';
			sourceItem.metascorePage = result.metascorePage;
		} else {
			sourceItem.metascore = -1;
			sourceItem.displayMetascore = 'n/a';
			sourceItem.metascorePage = '';
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(keywords, platform, metascore, metascorePage) {

		var requestData = {
			'keywords': encodeURI(keywords),
			'platform': encodeURI(platform),
			'metascore': encodeURI(metascore),
			'metascorePage': encodeURI(metascorePage)
		};

		$.ajax({
			url: METACRITIC_CACHE_URL,
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

		var results = $('#main', data).find('.result');
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$(results).each(function() {

			// convert to date object
			var releaseDateObject = new Date($(this).find('.release_date .data').text());
			// format month
			var month = releaseDateObject.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			// format date
			var date = releaseDateObject.getDate();
			date = date < 10 ? '0' + date : date;

			// create standard item
			searchItem = {
				name: $(this).find('.product_title a').text(),
				releaseDate: releaseDateObject.getFullYear() + '-' + month + '-' + date,
				platform: $(this).find('.platform').text(),
				metascore: $(this).find('.metascore').text(),
				metascorePage: $(this).find('.product_title a').attr('href')
			};

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		});

		return bestMatch;
	};

})(gamedex.module('metacritic'), gamedex, jQuery, _);

