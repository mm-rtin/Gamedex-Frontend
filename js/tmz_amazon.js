// Amazon
(function(Amazon) {

    // module references
    var Utilities = tmz.module('utilities');

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

	// data
	amazonOffersCache = {};

	// templates
	var priceMenuTemplate = _.template($('#price-menu-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.searchAmazon = function(keywords, browseNode, onSuccess, onError) {

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
	* parseAmazonResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.parseAmazonResultItem = function($resultItem) {

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
			itemData.platform = Utilities.matchPlatformToIndex(itemData.platform).name;
			// relative/calendar date
			if (itemData.releaseDate !== '1900-01-01') {
				itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
			} else {
				itemData.calendarDate = 'Unknown';
			}
		}



		return itemData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemDetail = function(asin, onSuccess, onError) {

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
	Amazon.getAmazonItemOffers = function(asin, sourceItem, onSuccess) {

		// find in amazon offer cache first
		var cachedOffer = getCachedData(sourceItem.id);
		// load cached amazon offer
		if (cachedOffer) {
			// add score data to source item
			sourceItem.offers = cachedOffer;

			// return updated source item
			onSuccess(cachedOffer);

		// get new offer data
		} else {

			// browse node, search terms and response group in url
			var restURL = tmz.api + 'itemdetail/amazon/';

			// OfferSummary, OfferListings, Offers, OfferFull
			var requestData = {
				'asin': asin,
				'response_group': 'OfferFull'
			};

			$.ajax({
				url: restURL,
				type: 'GET',
				data: requestData,
				dataType: 'xml',
				cache: true,
				success: function(data) {
					parseAmazonOffers(data, sourceItem, onSuccess);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatOfferData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatOfferData = function(offerItem) {

		var buyNowPrice = null;
		var buyNowRawPrice = null;

		// remove $ sign
		var re = /\$/;

		// iterate offers
		for (var i = 0, len = offerItem.offers.length; i < len; i++) {
			if (offerItem.offers[i].availability === 'now') {
				buyNowPrice = offerItem.offers[i].price.replace(re, '');
				buyNowRawPrice = offerItem.offers[i].rawPrice;
			}
		}

		buyNowPrice = buyNowPrice || offerItem.lowestNewPrice;

		// check for 'too low to display'
		if (buyNowPrice === 'Too low to display') {
			buyNowPrice = 'n/a';
			buyNowRawPrice = 0;
		}
		if (offerItem.lowestNewPrice === 'Too low to display') {
			offerItem.lowestNewPrice = 'n/a';
		}

		offerItem.buyNowPrice = buyNowPrice;
		offerItem.buyNowRawPrice = buyNowRawPrice;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(id) {

		var amazonOfferItem = null;

		if (typeof amazonOffersCache[id] !== 'undefined') {
			amazonOfferItem = amazonOffersCache[id];
		}

		return amazonOfferItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOffers = function(data, sourceItem, onSuccess) {

		var offerItem = {};

		// iterate xml results, construct offers
		$('Item', data).each(function() {

			// parse amazon result item, add data to offerItem
			offerItem = parseAmazonOfferItem($(this));
		});

		// add offerItem to item model
		sourceItem.offers = offerItem;

		// add to amazonOffersCache
		amazonOffersCache[sourceItem.id] = offerItem;


		onSuccess(offerItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOfferItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOfferItem = function($resultItem) {


		var offerItem = {};
		var offer = {};

		// get attributes from xml
		offerItem.lowestNewPrice = $resultItem.find('LowestNewPrice FormattedPrice').text();
		offerItem.lowestUsedPrice = $resultItem.find('LowestUsedPrice FormattedPrice').text();
		offerItem.totalNew = $resultItem.find('TotalNew').text();
		offerItem.totalUsed = $resultItem.find('TotalUsed').text();
		offerItem.totalOffers = $resultItem.find('TotalOffers').text();
		offerItem.offersURL = $resultItem.find('MoreOffersUrl').text();
		offerItem.offersURLNew = $resultItem.find('MoreOffersUrl').text() + '&condition=new';
		offerItem.offersURLUsed = $resultItem.find('MoreOffersUrl').text() + '&condition=used';

		// convert offer url to a product url
		var re = /offer-listing/gi;
		offerItem.productURL = offerItem.offersURL.replace(re, 'product');
		offerItem.offers = [];

		// iterate offers
		$('Offer', $resultItem).each(function() {


			offer = {};

			offer.price = $(this).find('Price FormattedPrice').text();
			offer.rawPrice = $(this).find('Price Amount').text();
			offer.availability = $(this).find('AvailabilityType').text();
			offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

			offerItem.offers.push(offer);
		});

		// format offer data
		formatOfferData(offerItem);

		return offerItem;
	};

})(tmz.module('amazon'));

