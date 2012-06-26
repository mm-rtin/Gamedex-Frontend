// ItemLinker
(function(ItemLinker, tmz, $, _) {
	"use strict";

	// Dependencies
	var Amazon = tmz.module('amazon'),
		GiantBomb = tmz.module('giantbomb'),
		Utilities = tmz.module('utilities');

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

		// exact name check
		if (sourceItem.standardName === searchItem.name.toLowerCase()) {

			score += 50;

		// fuzzy name check
		} else {
			// check if searchItem title exists within original title and vice versa
			var reSource = new RegExp(sourceItem.standardName, 'gi');
			var reSearch = new RegExp(standardResultName, 'gi');
			var sourceInTarget = reSource.exec(standardResultName);
			var targetInSource = reSearch.exec(sourceItem.standardName);

			if ((sourceInTarget && sourceInTarget[0].length > 0) || (targetInSource && targetInSource[0].length > 0)) {

				score += 5;
			}
		}

		// exact release date check
		if (typeof searchItem.releaseDate !== 'undefined') {
			if (sourceItem.releaseDate === searchItem.releaseDate) {
				score += 10;

			// fuzzy release date check
			} else {
				var diff = Math.floor((Date.parse(sourceItem.releaseDate) - Date.parse(searchItem.releaseDate) ) / 86400000);

				// don't subtract score if search result date is unknown/unreleased
				if (!isNaN(diff) && searchItem.releaseDate !== '1900-01-01')  {
					score -= Math.abs(diff / 365);
				}
			}
		}

		// platform match
		if (typeof searchItem.platform !== 'undefined') {
			// get standard platform name from platform
			var standardPlatform = Utilities.matchPlatformToIndex(searchItem.platform).name;

			if (sourceItem.platform === standardPlatform) {
				score += 20;
			}
		}

		return score;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* convertRomanNumerals -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.convertRomanNumerals = function(name) {

		var reRoman = new RegExp('\\s[XVI]+', 'gi');
		var match = reRoman.exec(name);

		// roman numeral found
		if (match && match[0].length > 0) {

			var roman = match[0];
			// remove III first and set dec to start at 3
			// the simplified converter below does add 'III' of anything correctly
			var re = new RegExp('III', 'gi');
			var match2 = re.exec(roman);
			var dec = '';

			if (match2 && match2[0].length > 0) {
				dec = 3;
				roman = roman.replace(re, '');
			}

			var arr = roman.split('');
			var num = null;

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
			case Utilities.SEARCH_PROVIDERS.Amazon:

				var searchName = item.standardName;

				// run search for giantbomb
				GiantBomb.searchGiantBomb(searchName, function(data) {
					findGiantbombMatch(data, item, onSuccess);
				});
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:


				var browseNode = 0;

				// run same platform search
				if (item.platform !== 'n/a') {



					browseNode = Utilities.getStandardPlatform(item.platform).amazon;
				}

				// run search for amazon
				Amazon.searchAmazon(item.name, browseNode, function(data) {
					findAmazonMatch(data, item, onSuccess, false);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getLinkedItemData
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getLinkedItemData = function(item, provider, onSuccess) {

		switch (provider) {

			// amazon is provider > fetch from giantbomb
			case Utilities.SEARCH_PROVIDERS.Amazon:

				// get item from giantbomb
				GiantBomb.getGiantBombItemDetail(item.gbombID, function(data) {
					getGiantBombItemDetail_result(data, onSuccess);
				});
				break;

			// giantbomb is provider > fetch from amazon
			case Utilities.SEARCH_PROVIDERS.GiantBomb:

				// get item from amazon
				Amazon.getAmazonItemDetail(item.asin, function(data) {
					getAmazonItemDetail_result(data, onSuccess);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findWikipediaMatch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findWikipediaMatch = function(data, sourceItem, onSuccess) {

		var results = data;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// create searchItem object
			searchItem = {
				'name': results[i]
			};

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

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getAmazonItemDetail_result = function(data, onSuccess) {

		var detailItem = {};
		// iterate results
		$('Item', data).each(function() {

			// parse item and set detailItem
			detailItem = Amazon.parseAmazonResultItem($(this));
		});

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemDetail_result = function(data, onSuccess) {

		// parse result item and set detailItem
		var detailItem = GiantBomb.parseGiantBombResultItem(data);

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findAmazonMatch
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findAmazonMatch = function(data, sourceItem, onSuccess, lastSearch) {

		var resultLength = ($('Item', data).length);
		var searchItem = {};
		var count = 0;

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$('Item', data).each(function() {

			// parse item and return searchItem
			searchItem = Amazon.parseAmazonResultItem($(this));

			// searchItem not filtered
			if (typeof searchItem.isFiltered === 'undefined') {


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

				}
			}
		});

		// return best match to onSuccess method
		if (bestMatch) {
			// return best match
			onSuccess(bestMatch);

		// re-run search without platform filter - only if this hasn't been run before
		} else if (!lastSearch) {
			Amazon.searchAmazon(sourceItem.name, 0, function(data) {
				findAmazonMatch(data, sourceItem, onSuccess, true);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findGiantbombMatch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findGiantbombMatch = function(data, sourceItem, onSuccess) {

		var results = data.results;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// parse result into searchItem object
			searchItem = GiantBomb.parseGiantBombResultItem(results[i]);

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

})(tmz.module('itemLinker'), tmz, jQuery, _);
