// SearchData
(function(SearchData) {

	// Dependencies
	var User = tmz.module('user');

	// constants
	var FILTERED_NAMES = [
		'accessory',
		'case',
		'codes',
		'combo',
		'console',
		'controller',
		'covers',
		'face plate',
		'faceplate',
		'head set',
		'headset',
		'import',
		'japan',
		'kit',
		'map',
		'membership',
		'new',
		'pack',
		'poster',
		'pre-paid',
		'set',
		'shell',
		'skin',
		'software',
		'stylus',
		'wireless'
	];

	// index matches with platform list values
	var PLATFORM_INDEX = [
		{'amazon': 0, alias: 'all'},
		{'amazon': 12508701, alias: 'pc,windows', name: 'PC'},
		{'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
		{'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
		{'amazon': 14220271, alias: 'x360,xbox 360,microsoft xbox360,360', name: 'X360'},
		{'amazon': 14220271, alias: 'xbl,xbox live', name: 'XBL'},
		{'amazon': 11075831, alias: 'ds,nintendo ds', name: 'DS'},
		{'amazon': 2622270011,alias: '3ds,nintendo 3ds', name: '3DS'},
		{'amazon': 14219011, alias: 'wii,nintendo wii', name: 'Wii'},
		{'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'PS1'},
		{'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'PS2'},
		{'amazon': 14210861, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PS3'},
		{'amazon': 14210861, alias: 'psn,playstation network', name: 'PSN'},
		{'amazon': 3010557011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'Vita'},
		{'amazon': 12508741, alias: 'psp,sony psp', name: 'PSP'},
		{'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
		{'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'N64'},
		{'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
		{'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
		{'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
		{'amazon': 541020, alias: 'gba,gameboy advance,game boy,advance,gbadvance', name: 'GBA'},
		{'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'GBC'},
		{'amazon': 229793, alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Dreamcast'},
		{'amazon': 294944, alias: 'saturn,sega saturn', name: 'Saturn'},
		{'amazon': 294943, alias: 'genesis,sega genesis', name: 'Genesis'},
		{'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Gamegear'},
		{'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
	];

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.searchAmazon = function(keywords, browseNode, onSuccess, onError) {

		// // console.info(browseNode);

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
	* parseAmazonResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.parseAmazonResultItem = function($resultItem) {

		var isFiltered = false;
		var	filter = '(' + FILTERED_NAMES.join('|') + ')';
		var	re = new RegExp(filter, 'i');

		// get attributes from xml for filter check
		var itemData = {
			name: $resultItem.find('Title').text(),
			platform: $resultItem.find('Platform').text()
		};

		// result has been filtered
		if (re.test(itemData.name) || itemData.platform === '') {

			// console.error('amazon item filtered: ', itemData.name, itemData.platform);
			itemData.isFiltered = true;

		// not filtered > add more properties to itemData
		} else {

			itemData.id = $resultItem.find('ASIN').text();
			itemData.asin = $resultItem.find('ASIN').text();
			itemData.gbombID = 0;
			itemData.smallImage = $resultItem.find('ThumbnailImage > URL:first').text() || '';
			itemData.thumbnailImage = $resultItem.find('MediumImage > URL:first').text() || '';
			itemData.largeImage = $resultItem.find('LargeImage > URL:first').text() || '';
			itemData.description = $resultItem.find('EditorialReview > Content:first').text() || '';
			itemData.releaseDate = $resultItem.find('ReleaseDate').text() || '1900-01-01';

			// add custom formatted properties
			// standard platform name
			itemData.platform = SearchData.matchPlatformToIndex(itemData.platform).name;
			// relative/calendar date
			itemData.calendarDate = moment(itemData.releaseDate || '1900-01-01', "YYYY-MM-DD").calendar();
		}

		// // console.info('------------ AMAZON -------------- ' + itemData.name);

		return itemData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.parseGiantBombResultItem = function(resultItem) {

		itemData = {
			id: resultItem.id,
			asin: 0,
			gbombID: resultItem.id,
			name: resultItem.name,
			platform: 'n/a'
		};

		// // console.info('------------ GIANT BOMB -------------- ' + itemData.name);

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

		return itemData;
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
	* getGiantBombItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemData = function(gbombID, onSuccess, onError) {

		var fieldList = ['description', 'developers', 'site_detail_url'];
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
	SearchData.matchPlatformToIndex = function(platformName) {

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

					// // console.info('$$$$$$$$$$$$$$$$$$$$$$ EXACT MATCH WITH: ', PLATFORM_INDEX[i].name);
					return PLATFORM_INDEX[i];

				} else if (currentMatch !== null && currentMatch[0].length > bestMatchLength) {

					// // console.info(platformName, '********************* BEST MATCH WITH: ', PLATFORM_INDEX[i].name);
					bestMatchLength = currentMatch[0].length;
					bestMatch = PLATFORM_INDEX[i];
				}
			}
		}

		// // console.info('!!!!!!!!!!!!!!!!!!!! DONE !!!!!!!!!!!!!!!!!!!!!!!!!!');
		// // console.info(bestMatch);

		if (bestMatch !== null) {
			return bestMatch;
		}

		return PLATFORM_INDEX[0];
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
	* getPlatformIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getPlatformIndex = function() {
		return PLATFORM_INDEX;
	};

})(tmz.module('searchData'));

