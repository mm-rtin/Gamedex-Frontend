// SearchData
(function(SearchData) {

	// Dependencies
	var User = tmz.module('user');

	// constants
	var FILTERED_NAMES = ['set', 'accessory', 'covers', 'new', 'software', 'membership', 'japan', 'import', 'pack', 'skin', 'headset', 'head set', 'faceplate', 'face plate', 'controller', 'stylus', 'wheel', 'kit', 'wireless', 'combo', 'poster', 'map', 'pre-paid', 'codes', 'shell', 'case'];

	// index matches with platform list values
	var PLATFORM_INDEX = [
		{'amazon': 0, alias: 'all'},
		{'amazon': 12508701, alias: 'pc,windows', name: 'PC'},
		{'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
		{'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
		{'amazon': 14220271, alias: 'xbox 360,microsoft xbox360,x360', name: 'Xbox 360'},
		{'amazon': 11075831, alias: 'ds,nintendo ds', name: 'Nintendo DS'},
		{'amazon': 2622270011,alias: '3ds,nintendo 3ds', name: 'Nintendo 3DS'},
		{'amazon': 14219011, alias: 'wii,nintendo wii', name: 'Nintendo Wii'},
		{'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'PlayStation 1'},
		{'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'PlayStation 2'},
		{'amazon': 14210861, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PlayStation 3'},
		{'amazon': 3010557011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'PlayStation Vita'},
		{'amazon': 12508741, alias: 'psp,sony psp', name: 'PSP'},
		{'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
		{'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'Nintendo 64'},
		{'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
		{'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
		{'amazon': 541020, alias: 'gba,gameboy advance,gbadvance', name: 'Game Boy Advance'},
		{'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'Game Boy Color'},
		{'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
		{'amazon': 229793, alias: 'dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Sega Dreamcast'},
		{'amazon': 294944, alias: 'saturn,sega saturn', name: 'Sega Saturn'},
		{'amazon': 294943, alias: 'genesis,sega genesis', name: 'Sega Genesis'},
		{'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Sega Gamegear'},
		{'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
	];

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.searchAmazon = function(keywords, browseNode, onSuccess, onError) {

		console.info(browseNode);

		var searchTerms = encodeURIComponent(keywords);

		// browse node, search terms and response group in url
		var restURL = tmz.api + 'itemsearch/amazon/';

		var requestData = {
			'keywords': keywords,
			'browse_node': browseNode,
			'search_index': 'VideoGames',
			'response_group': 'ItemAttributes,Images',
			'page': 1
		};

		$.ajax({
			url: restURL,
			type: 'GET',
			data: requestData,
			dataType: 'xml',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStandardPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getStandardPlatform = function(platformName) {

		var re = new RegExp(platformName, 'gi');

		for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {
			if (re.test(PLATFORM_INDEX[i].alias)) {
				return PLATFORM_INDEX[i];
			}
		}

		return PLATFORM_INDEX[0];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* matchPlatformToIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var matchPlatformToIndex = function(platformName) {

		var re = null;
		var aliasArray = [];
		var bestMatch = null;
		var originalTextLength = platformName.length;
		var bestMatchLength = 0;
		var currentMatch = null;

		// reverse lookup - make regex of each platform index alias and match with platformName
		for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {

			aliasArray = PLATFORM_INDEX[i].alias.split(',');

			for (var j = 0, aliasLen = aliasArray.length; j < aliasLen; j++) {

				re = new RegExp(aliasArray[j], 'gi');
				currentMatch = re.exec(platformName);

				if (currentMatch !== null && currentMatch[0].length === originalTextLength) {

					console.info('$$$$$$$$$$$$$$$$$$$$$$ EXACT MATCH WITH: ', PLATFORM_INDEX[i].name);
					return PLATFORM_INDEX[i];

				} else if (currentMatch !== null && currentMatch[0].length > bestMatchLength) {

					console.info(platformName, '********************* BEST MATCH WITH: ', PLATFORM_INDEX[i].name);
					bestMatchLength = currentMatch[0].length;
					bestMatch = PLATFORM_INDEX[i];
				}
			}
		}

		console.info('!!!!!!!!!!!!!!!!!!!! DONE !!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.info(bestMatch);

		if (bestMatch !== null) {
			return bestMatch;
		}

		return PLATFORM_INDEX[0];
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.searchGiantBomb = function(keywords, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);

		// searchTerms and page number in url
		var restURL = tmz.api + 'itemsearch/giantbomb/';

		// list of fields to get as query parameter
		var fieldList = ['id', 'name', 'original_release_date', 'image'];

		var requestData = {
			'field_list': fieldList.join(','),
			'keywords': keywords,
			'page': 0
		};

		$.ajax({
			url: restURL,
			type: 'GET',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchMetacritic -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.searchMetacritic = function(searchTerms, onSuccess, onError) {

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
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getAmazonItemDetail = function(asin, onSuccess, onError) {

		// browse node, search terms and response group in url
		var restURL = tmz.api + 'itemdetail/amazon/';

		var requestData = {
			'asin': asin,
			'response_group': 'Medium'
		};

		$.ajax({
			url: restURL,
			type: 'GET',
			data: requestData,
			dataType: 'xml',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemOffers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getAmazonItemOffers = function(asin, onSuccess, onError) {

		// OfferSummary, OfferListings, Offers, OfferFull

		// browse node, search terms and response group in url
		var restURL = tmz.api + 'itemdetail/amazon/';

		var requestData = {
			'asin': asin,
			'response_group': 'Offers'
		};

		$.ajax({
			url: restURL,
			type: 'GET',
			data: requestData,
			dataType: 'xml',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemPlatform = function(gbombID, onSuccess, onError) {

		// searchTerms and page number in url
		var restURL = tmz.api + 'itemdetail/giantbomb/';

		// list of fields to get as query parameter
		var fieldList = ['platforms'];

		getGiantBombItem(gbombID, fieldList, function(data) {
			onSuccess(data, gbombID);
		}, onError);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDescription -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemDescription = function(gbombID, onSuccess, onError) {

		var fieldList = ['description', 'developers'];
		getGiantBombItem(gbombID, fieldList, onSuccess, onError);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemDetail = function(gbombID, onSuccess, onError) {

		var fieldList = ['id', 'name', 'original_release_date', 'image', 'description'];
		getGiantBombItem(gbombID, fieldList, onSuccess, onError);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItem = function(gbombID, fieldList, onSuccess, onError) {

		// searchTerms and page number in url
		var restURL = tmz.api + 'itemdetail/giantbomb/';

		var requestData = {
			'field_list': fieldList.join(','),
			'id': gbombID
		};

		$.ajax({
			url: restURL,
			type: 'GET',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.parseAmazonResultItem = function($resultItem, itemData) {

		var isFiltered = false;
		var	filter = '(' + FILTERED_NAMES.join('|') + ')';
		var	re = new RegExp(filter, 'i');

		// get attributes from xml
		itemData.name = $resultItem.find('Title').text();
		itemData.platform = $resultItem.find('Platform').text();
		itemData.releaseDate = $resultItem.find('ReleaseDate').text() || 'unknown';

		// filter out non-media item products
		if (re.test(itemData.name) || itemData.platform === '') {
			//console.error(itemData.name, itemData.platform);
			isFiltered = true;
		}

		// find and add more properties if not filtered
		if (!isFiltered) {
			itemData.id = $resultItem.find('ASIN').text();
			itemData.asin = $resultItem.find('ASIN').text();
			itemData.gbombID = 0;
			itemData.smallImage = $resultItem.find('ThumbnailImage > URL:first').text() || '';
			itemData.thumbnailImage = $resultItem.find('MediumImage > URL:first').text() || '';
			itemData.largeImage = $resultItem.find('LargeImage > URL:first').text() || '';
			itemData.description = $resultItem.find('EditorialReview > Content:first').text() || '';

			// standardize platform names
			itemData.platform = matchPlatformToIndex(itemData.platform).name;
		}

		console.info('------------ AMAZON -------------- ' + itemData.name);

		return isFiltered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOfferItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.parseAmazonOfferItem = function($resultItem, offerData) {

		var offer = {};

		// get attributes from xml
		offerData.lowestNewPrice = $resultItem.find('LowestNewPrice FormattedPrice').text();
		offerData.lowestUsedPrice = $resultItem.find('LowestUsedPrice FormattedPrice').text();
		offerData.totalNew = $resultItem.find('TotalNew').text();
		offerData.totalUsed = $resultItem.find('TotalUsed').text();
		offerData.totalOffers = $resultItem.find('TotalOffers').text();

		// iterate offers
		$('Offer', $resultItem).each(function() {

			offer = {};
			offerData.offers = [];

			offer.price = $(this).find('FormattedPrice').text();
			offer.availability = $(this).find('AvailabilityType').text();
			offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

			offerData.offers.push(offer);
		});

		console.info(offerData);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.parseGiantBombResultItem = function(resultItem, itemData) {

		itemData.id = resultItem.id;
		itemData.asin = 0;
		itemData.gbombID = resultItem.id;
		itemData.name = resultItem.name;
		itemData.platform = 'n/a';

		console.info('------------ GIANT BOMB -------------- ' + itemData.name);

		// format date
		if (resultItem.original_release_date !== null && resultItem.original_release_date !== '') {
			itemData.releaseDate = resultItem.original_release_date.split(' ')[0];
		} else {
			itemData.releaseDate = '1900-01-01';
		}

		// set small url
		if (resultItem.image !== null && resultItem.image.small_url && resultItem.image.small_url !== '') {
			itemData.smallImage = resultItem.image.small_url;
		} else {
			itemData.smallImage = 'no image.png';
		}

		// set thumb url
		if (resultItem.image !== null && resultItem.image.thumb_url && resultItem.image.thumb_url !== '') {
			itemData.thumbnailImage = resultItem.image.thumb_url;
		} else {
			itemData.thumbnailImage = 'no image.png';
		}

		// set large url
		if (resultItem.image !== null && resultItem.image.super_url && resultItem.image.super_url !== '') {
			itemData.largeImage = resultItem.image.super_url;
		} else {
			itemData.largeImage = 'no image.png';
		}

		// set description
		if (resultItem.description !== null && resultItem.description  !== '') {
			itemData.description = resultItem.description;
		} else {
			itemData.description = 'No Description';
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetacriticResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.parseMetacriticResultItem = function(data, sourceItem) {

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
	* standardizeTitle -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.standardizeTitle = function(title) {

		var sanitizedName = '';
		var re = '';
		var match = '';

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
	* getPlatformIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getPlatformIndex = function() {
		return PLATFORM_INDEX;
	};



})(tmz.module('searchData'));

