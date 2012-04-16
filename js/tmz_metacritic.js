// Metacritic
(function(Metacritic) {

    // module references
	var Amazon = tmz.module('amazon');
	var ItemLinker = tmz.module('itemLinker');
	var ItemData = tmz.module('itemData');

	// REST URL
	var METACRITIC_SEARCH_URL = tmz.api + 'metacritic/search';
	var METACRITIC_CACHE_URL = tmz.api + 'metacritic/cache';

	// properties
	var metacriticDomain = 'metacritic.com';

	// data
	var metascoreCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.getMetascore = function(searchTerms, sourceItem, onSuccess) {


		// console.info(sourceItem.asin, sourceItem.gbombID);
		// find in cache first
		var cachedScore = getCachedData(sourceItem.asin, sourceItem.gbombID);

		if (cachedScore) {
			// console.info('cached metascore:', cachedScore);

			// add score data to source item
			sourceItem.metascore = cachedScore.metascore;
			sourceItem.metascorePage = cachedScore.metascorePage;

			// return updated source item
			onSuccess(sourceItem);

		// fetch score data
		} else {
			var cleanedSearchTerms = cleanupMetacriticSearchTerms(searchTerms);

			var requestData = {
				'keywords': encodeURI(cleanedSearchTerms)
			};

			$.ajax({
				url: METACRITIC_SEARCH_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// console.info('fetch metascore:', data);

					// parse result
					parseMetascoreResults(cleanedSearchTerms, data, sourceItem, function(data) {

						// local cache
						addToMetascoreCache(sourceItem.asin, sourceItem.gbombID, data);
						onSuccess(data);
					});
				}
			});
		}
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
			.fadeIn();

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
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(asin, gbombID) {

		var metascoreItem = null;

		// amazon id
		if (typeof metascoreCache[asin] !== 'undefined') {
			metascoreItem = metascoreCache[asin];

		// giant bomb id
		} else if (typeof metascoreCache[gbombID] !== 'undefined') {
			metascoreItem = metascoreCache[gbombID];
		}

		return metascoreItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToMetascoreCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToMetascoreCache = function(asin, gbombID, metacriticItem) {

		// add to metascoreCache linked by asin
		if (asin != '0') {
			metascoreCache[asin] = {metascorePage: metacriticItem.metascorePage, metascore: metacriticItem.metascore};
		}
		// add to metascoreCache linked by gbombID
		if (gbombID != '0') {
			metascoreCache[gbombID] = {metascorePage: metacriticItem.metascorePage, metascore: metacriticItem.metascore};
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetascoreResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetascoreResults = function(keywords, data, sourceItem, onSuccess) {

		var result = null;

		// save values before updated with current info
		var previousMetascore = sourceItem.metascore;
		var previousMetascorePage = sourceItem.metascorePage;

		// parse raw result
		if (typeof data.metascore === 'undefined') {

			// get result that matches sourceItem
			result = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (result) {
				addToServerCache(keywords, result.metascore, result.metascorePage);
			}

		// parse cached result
		} else {

			result = data;
		}

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

		// console.info(sourceItem, previousMetascore);

		// check if source item score or page differs from return score/page
		if (previousMetascore && sourceItem.metascore != previousMetascore) {

			// console.info('######## UPDATE METACRITIC RECORD:', sourceItem.metascore, previousMetascore, sourceItem.metascorePage, previousMetascorePage);
			// update metacritic data for source item record
			ItemData.updateMetacritic(sourceItem);
		}

		onSuccess(sourceItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(keywords, metascore, metascorePage) {

		var requestData = {
			'keywords': encodeURI(keywords),
			'metascore': encodeURI(metascore),
			'metascorePage': encodeURI(metascorePage)
		};

		// console.info(requestData);

		$.ajax({
			url: METACRITIC_CACHE_URL,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {
				// console.info('metacritic: add to server cache');
				// console.info(data);
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
			releaseDateObject = new Date($(this).find('.release_date .data').text());
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



})(tmz.module('metacritic'));

