// Metacritic
(function(Metacritic) {

    // module references
	var SearchData = tmz.module('searchData');

	// properties
	var metacriticDomain = 'http://www.metacritic.com';

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchMetacritic -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.searchMetacritic = function(searchTerms, sourceItem, metacriticSelector) {

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
				parseMetacriticSearch_result(data, sourceItem, metacriticSelector);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetacriticSearch_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetacriticSearch_result = function(data, sourceItem, metacriticSelector) {

		var matchedResult = parseMetacriticResultItem(data, sourceItem);
		var metacriticData = {};

		// add metacritic data to sourceItem
		if (matchedResult !== null && matchedResult.score !== '') {
			sourceItem.metascore = matchedResult.score;
			sourceItem.metacriticPage = matchedResult.page;
		} else if (matchedResult !== null) {
			sourceItem.metascore = -1;
			sourceItem.metacriticPage = matchedResult.page;
		} else {
			sourceItem.metascore = -1;
			sourceItem.metacriticPage = '';
		}

		// add metacritic info to item detail
		displayMetacriticData(sourceItem.metacriticPage, sourceItem.metascore, metacriticSelector);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetacriticResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetacriticResultItem = function(data, sourceItem) {

		var results = $('#main', data).find('.result');

		var name = '';
		var page = '';
		var platform = '';
		var score = '';
		var releaseDate = '';
		var standardName = '';
		var releaseDateObject = null;

		var reSource = null;
		var reTarget = null;

		var metacriticItem = {};
		var matchedResult = null;
		var found = 6;

		// iterate all results and get result that matches platform
		$(results).each(function() {

			// skip if exact match already found
			if (found === 1) return;

			metacriticItem = {};

			metacriticItem.score = $(this).find('.metascore').text();
			metacriticItem.name = $(this).find('.product_title a').text();
			metacriticItem.page = $(this).find('.product_title a').attr('href');
			metacriticItem.platform = $(this).find('.platform').text();

			// format date
			releaseDateObject =new Date($(this).find('.release_date .data').text());
			var month = releaseDateObject.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			var date = releaseDateObject.getDate();
			date = date < 10 ? '0' + date : date;
			metacriticItem.releaseDate = releaseDateObject.getFullYear() + '-' + month + '-' + date;

			// get standard platform name from platform
			var standardPlatform = SearchData.getStandardPlatform(metacriticItem.platform);
			var standardName = metacriticItem.name.toLowerCase();

			console.info('^^^^^^^^^^^^^^^^^^^^^^^^ (FIRST ITEM): ', sourceItem.standardName, sourceItem.platform, sourceItem.releaseDate);
			console.info('^^^^^^^^^^^^^^^^^^^^^^^^ (METACRITIC): ', standardName, standardPlatform.name, metacriticItem.releaseDate);

			// title, platform and release date match
			if (sourceItem.standardName === standardName && standardPlatform.name === sourceItem.platform && metacriticItem.releaseDate === sourceItem.releaseDate) {

				console.info('^^^^^^^^^^^^^^^^^^^^^^^^ EXACT MATCH (METACRITIC): ', metacriticItem.name, metacriticItem.platform, metacriticItem.releaseDate);
				matchedResult = metacriticItem;
				found = 1;

			// title, platform
			} else if (found > 1 && sourceItem.standardName === standardName && standardPlatform.name === sourceItem.platform) {
				console.info('^^^^^^^^^^^^^^^^^^^^^^^^ 1ST MATCH (METACRITIC): ', metacriticItem.name, metacriticItem.platform, metacriticItem.releaseDate);
				matchedResult = metacriticItem;
				found = 2;

			// platform and release date match
			} else if (found > 2 && standardPlatform.name === sourceItem.platform && metacriticItem.releaseDate === sourceItem.releaseDate) {
				console.info('^^^^^^^^^^^^^^^^^^^^^^^^ 2ND MATCH (METACRITIC): ', metacriticItem.name, metacriticItem.platform, metacriticItem.releaseDate);
				matchedResult = metacriticItem;
				found = 3;

			// release date match
			} else if (found > 3 && metacriticItem.releaseDate === sourceItem.releaseDate) {
				console.info('^^^^^^^^^^^^^^^^^^^^^^^^ 3RD MATCH (METACRITIC): ', metacriticItem.name, metacriticItem.platform, metacriticItem.releaseDate);
				matchedResult = metacriticItem;
				found = 4;

			// name match
			} else if (found > 4 && sourceItem.standardName === standardName) {
				matchedResult = metacriticItem;
				found = 5;

			// last resort regex match - check if either source or target names exist within each other
			} else if (found > 5) {

				reSource = new RegExp(sourceItem.standardName, 'gi');
				reTarget = new RegExp(standardName, 'gi');
				sourceInTarget = reSource.exec(standardName);
				targetInSource = reTarget.exec(sourceItem.standardName);

				if (standardPlatform.name === sourceItem.platform && ((sourceInTarget && sourceInTarget[0].length > 0) || (targetInSource && targetInSource[0].length > 0))) {
					matchedResult = metacriticItem;
					console.info(matchedResult);
				}
			}
		});

		return matchedResult;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetacriticData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayMetacriticData = function(page, score, metacriticSelector) {

		var $metacriticContainer = $(metacriticSelector);

		// determine score color
		var colorClass = 'favorable';
		if (score < 0) {
			score = 'n/a';
			colorClass = 'unavailable';
		} else if (score < 50) {
			colorClass = 'unfavorable';
		} else if (score < 75) {
			colorClass = 'neutral';
		}

		$metacriticContainer
			.html(score)
			.addClass(colorClass)
			.attr('href', metacriticDomain + page)
			.attr('data-original-title', 'metacritic.com' + page);

		// activate tooltip
		$metacriticContainer.tooltip();
	};


})(tmz.module('metacritic'));

