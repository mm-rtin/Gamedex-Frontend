// SearchData
(function(SearchData) {

	// Dependencies
	var User = tmz.module('user');

	// constants
	var FILTERED_NAMES = ['set', 'accessory', 'covers', 'new', 'software', 'membership', 'japan', 'import', 'pack', 'skin', 'headset', 'head set', 'faceplate', 'face plate', 'controller', 'stylus', 'wheel', 'kit', 'wireless', 'combo', 'poster', 'map', 'pre-paid', 'codes', 'shell', 'case'];
	var BROWSE_NODES = {'all': 0, 'ps3': 14210861, 'xbox': 0, 'xbox360': 14220271, 'pc': 12508701, 'wii': 14219011, 'ds': 11075831, '3ds': 2622270011, 'psp': 12508741, 'vita': 3010557011, 'ps2': 0, 'ps1':0};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.searchAmazon = function(keywords, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);
		var browseNode = BROWSE_NODES.all;

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
	* getGiantBombItemPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemPlatform = function(gbombID, onSuccess, onError) {

		// searchTerms and page number in url
		var restURL = tmz.api + 'itemdetail/giantbomb/';

		// list of fields to get as query parameter
		var fieldList = ['platforms'];

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
			success: function(data) {
				onSuccess(data, gbombID);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemDetail = function(gbombID, onSuccess, onError) {

		// searchTerms and page number in url
		var restURL = tmz.api + 'itemdetail/giantbomb/';

		// list of fields to get as query parameter
		var fieldList = ['description', 'developers'];

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
		}

		//console.info('------------ AMAZON -------------- ' + itemData.name);

		return isFiltered;
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

		//console.info('------------ GIANT BOMB -------------- ' + itemData.name);

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


})(tmz.module('searchData'));

