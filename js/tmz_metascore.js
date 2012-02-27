// Metascore
(function(Metascore) {

    // module references
	var SearchData = tmz.module('searchData');
	var ItemLinker = tmz.module('itemLinker');

	// properties
	var metascoreDomain = 'http://www.metascore.com';

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metascore.getMetascore = function(searchTerms, sourceItem, onSuccess) {

		var url = 'itemsearch/metacritic/';

		// convert spaces to '+'
		var re = /\s/g;
		var modifiedSearchTerms = searchTerms.replace(re, '+');

		// remove ':'
		re = /:/g;
		modifiedSearchTerms = modifiedSearchTerms.replace(re, '');

		var requestData = {
			'keywords': encodeURI(modifiedSearchTerms)
		};

		$.ajax({
			url: url,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {
				parseMetascoreResults(data, sourceItem, onSuccess);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascoreData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metascore.displayMetascoreData = function(page, score, metascoreSelector) {

		var $metascoreContainer = $(metascoreSelector);
		var textScore = score;

		console.info(page, score, metascoreSelector);

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
			.addClass(colorClass)
			.attr('href', metascoreDomain + page)
			.attr('data-score', score)
			.attr('data-original-title', 'metascore.com' + page);

		// activate tooltip
		$metascoreContainer.tooltip();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetascoreResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetascoreResults = function(data, sourceItem, onSuccess) {

		// get result that matches sourceItem
		var matchedResult = getMatchedSearchResult(data, sourceItem);
		var metascoreData = {};

		// add metascore data to sourceItem
		if (matchedResult !== null && matchedResult.score !== '') {
			sourceItem.metascore = matchedResult.score;
			sourceItem.metascorePage = matchedResult.page;
		} else if (matchedResult !== null) {
			sourceItem.metascore = -1;
			sourceItem.metascorePage = matchedResult.page;
		} else {
			sourceItem.metascore = -1;
			sourceItem.metascorePage = '';
		}

		onSuccess(sourceItem);
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
				score: $(this).find('.metascore').text(),
				page: $(this).find('.product_title a').attr('href')
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



})(tmz.module('metascore'));

