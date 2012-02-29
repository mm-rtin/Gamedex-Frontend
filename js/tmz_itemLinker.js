// ItemLinker$
(function(ItemLinker) {

	// Dependencies
	var SearchData = tmz.module('searchData');
	var Utilities = tmz.module('utilities');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* standardizeTitle -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.standardizeTitle = function(title) {

		var sanitizedName = '';
		var re = null;
		var reRoman = null;

		var match = null;
		var match2 = null;
		var roman = '';
		var dec = 0;
		var num = 0;
		var arr = null;

		// remove word that appears before 'edition'
		sanitizedName = title.replace(/\S+ edition$/gi, '');
		// remove brackets and parenthesis
		sanitizedName = sanitizedName.replace(/\s*[\[\(].*[\)\]]/gi, '');

		// remove words appearing after '-' unless it is less than 4 chars
		re = new RegExp('\\s*-.*', 'gi');
		match = re.exec(sanitizedName);
		if (match && match[0].length > 3) {
			sanitizedName = sanitizedName.replace(re, '');
		}

		// remove words appearing after 'with'
		sanitizedName = sanitizedName.replace(/\swith\s.*/gi, '');

		// remove 'the ' if at the start of title
		sanitizedName = sanitizedName.replace(/^\s*the\s/gi, '');

		return sanitizedName.toLowerCase();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getSimilarityScore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getSimilarityScore = function(sourceItem, searchItem) {

		// matching properties
		var score = 0;

		// use standard name for search result
		var standardResultName = ItemLinker.standardizeTitle(searchItem.name);
		// get standard platform name from platform
		var standardPlatform = SearchData.getStandardPlatform(searchItem.platform);

		// exact name check
		if (sourceItem.standardName === searchItem.name.toLowerCase()) {
			console.info('exact name: 50 score');
			score += 50;

		// fuzzy name check
		} else {
			// check if searchItem title exists within original title and vice versa
			reSource = new RegExp(sourceItem.standardName, 'gi');
			reSearch = new RegExp(standardResultName, 'gi');
			sourceInTarget = reSource.exec(standardResultName);
			targetInSource = reSearch.exec(sourceItem.standardName);

			if ((sourceInTarget && sourceInTarget[0].length > 0) || (targetInSource && targetInSource[0].length > 0)) {
				console.info('fuzzy name: 5 score');
				score += 5;
			}
		}

		// exact release date check
		if (sourceItem.releaseDate === searchItem.releaseDate) {
			score += 10;
			console.info('release date: 10 score');

		// fuzzy release date check
		} else {
			var diff =  Math.floor((Date.parse(sourceItem.releaseDate) - Date.parse(searchItem.releaseDate) ) / 86400000);

			// don't subtract score if search result date is unknown/unreleased
			if (!isNaN(diff) && searchItem.releaseDate !== '1900-01-01')  {
				score -= Math.abs(diff / 365);
			}
		}

		// platform match



		// console.info('------------------------------');
		// console.info(sourceItem.standardName, ' - ', standardResultName);
		// console.info(sourceItem.releaseDate, ' - ', searchItem.releaseDate);
		// console.info(sourceItem.platform, ' - ', searchItem.platform);
		// console.info(score);
		// console.info('------------------------------');

		return score;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* convertRomanNumerals -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.convertRomanNumerals = function(name) {

		reRoman = new RegExp('\\s[XVI]+', 'gi');
		match = reRoman.exec(name);

		// roman numeral found
		if (match && match[0].length > 0) {

			roman = match[0];
			// remove III first and set dec to start at 3
			// the simplified converter below does add 'III' of anything correctly
			re = new RegExp('III', 'gi');
			match2 = re.exec(roman);

			if (match2 && match2[0].length > 0) {
				dec = 3;
				roman = roman.replace(re, '');
			}

			arr = roman.split('');

			// iterate each roman character except last blank character
			for (var i = arr.length - 1; i >= 1; i--) {
				switch(arr[i]) {
					case 'I':
				num = 1;
				break;
					case 'V':
				num = 5;
				break;
					case 'X':
				num = 10;
				break;
			}

			if (num < dec) {
				dec = dec - num;
			} else {
				dec = dec + num;
			}

			}

			// replace roman with decimal
			name = name.replace(reRoman, ' ' + dec);
		}

		return name;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findItemOnAlternateProvider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findItemOnAlternateProvider = function(item, provider, onSuccess) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				// console.info('alt search giantbomb');

				searchName = item.standardName;

				console.info('findItemOnAlternateProvider: searchName: ', searchName);

				// run search for giantbomb
				SearchData.searchGiantBomb(searchName, function(data) {
					parseGiantBombAlternate_result(data, item, onSuccess);
				});
				break;

			case Utilities.getProviders().GiantBomb:
				// console.info('alt search amazon');

				var browseNode = 0;

				// run same platform search
				if (item.platform !== 'n/a') {
					// console.info('RUN SAME PLATFORM SEARCH');
					// console.info(item.platform);

					browseNode = SearchData.getStandardPlatform(item.platform).amazon;
				}

				// run search for amazon
				SearchData.searchAmazon(item.name, browseNode, function(data) {
					parseAmazonAlternate_result(data, item, onSuccess);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getLinkedItemData
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getLinkedItemData = function(item, provider, onSuccess) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				// console.info('get giantbomb item');

				// get item from giantbomb
				SearchData.getGiantBombItemDetail(item.gbombID, function(data) {
					getGiantBombItemDetail_result(data, onSuccess);
				});
				break;

			case Utilities.getProviders().GiantBomb:
				// console.info('get amazon item');

				// get item from amazon
				SearchData.getAmazonItemDetail(item.asin, function(data) {
					getAmazonItemDetail_result(data, onSuccess);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getAmazonItemDetail_result = function(data, onSuccess) {

		var detailItem = {};
		// iterate results
		$('Item', data).each(function() {

			// parse item and set detailItem
			detailItem = SearchData.parseAmazonResultItem($(this));
		});

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemDetail_result = function(data, onSuccess) {

		// parse result item and set detailItem
		var detailItem = SearchData.parseGiantBombResultItem(data.results);

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonAlternate_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonAlternate_result = function(data, sourceItem, onSuccess) {

		var resultLength = ($('Item', data).length);
		var searchItem = {};
		var count = 0;

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		console.info('**************** parseAmazonAlternate_result found: ' + resultLength + ' *******************');

		// iterate results
		$('Item', data).each(function() {

			// parse item and return searchItem
			searchItem = SearchData.parseAmazonResultItem($(this));

			// searchItem not filtered
			if (typeof searchItem.isFiltered === 'undefined') {
				console.info('not filtered');

				// save first non-filtered result
				if (count === 0) {
					bestMatch = searchItem;
				}

				count++;
				// get similarity score
				score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

				// check if score is new best
				if (score > bestScore) {
					bestMatch = searchItem;
					bestScore = score;
					console.info(bestMatch);
				}
			}
		});

		// return best match to onSuccess method
		if (bestMatch !== null) {
			// return best match
			onSuccess(bestMatch);

		// re-run search without platform filter
		} else {
			SearchData.searchAmazon(sourceItem.name, 0, function(data) {
				parseAmazonAlternate_result(data, sourceItem, onSuccess);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombAlternate_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGiantBombAlternate_result = function(data, sourceItem, onSuccess) {

		var results = data.results;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		console.info('**************** parseGiantBombAlternate_result found: ' + results.length + ' *******************');

		// console.info(results);

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// parse result into searchItem object
			searchItem = SearchData.parseGiantBombResultItem(results[i]);

			// init best match with first item
			if (i === 0) {
				bestMatch = searchItem;
			}

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		}

		// return best match to onSuccess method
		if (results.length !== 0) {
			// return best match
			onSuccess(bestMatch);
		}
	};


})(tmz.module('itemLinker'));

