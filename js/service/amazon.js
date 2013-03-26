// Amazon
(function(Amazon, gamedex, $, _, moment) {
	"use strict";

    // module references
    var Utilities = gamedex.module('utilities'),

		// constants
		FILTERED_NAMES = [
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
		],

		// REST URLS
		AMAZON_SEARCH_URL = gamedex.api + 'amazon/search/',
		AMAZON_DETAIL_URL = gamedex.api + 'amazon/detail/',

		// constants
		RETRY_AMAZON_MIN = 500,
		RETRY_AMAZON_MAX = 3000,

		// data
		amazonOffersCache = {},
		amazonItemCache = {},

		// request queues
		getAmazonItemOffersQueue = {},
		getAmazonItemDetailQueue = {},

		// failed requests
		failedAmazonSearchRequests = [],

		// ajax requests
		searchRequest = null,
		searchAmazonID = 0;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon - search amazon, prevent all but latest from completing and returning onSuccess method
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.searchAmazon = function(keywords, browseNode, onSuccess, onError, preventMultipleRequests) {

		onError = typeof onError !== 'undefined' ? onError : null;
		preventMultipleRequests = typeof preventMultipleRequests !== 'undefined' ? preventMultipleRequests : false;

		var searchTerms = encodeURIComponent(keywords);

		// browse node, search terms and response group in url
		var requestData = {
			'keywords': keywords,
			'browse_node': browseNode,
			'search_index': 'VideoGames',
			'response_group': 'ItemAttributes,Images',
			'page': 1
		};

		// abort previous request
		if (searchRequest && preventMultipleRequests) {
			searchRequest.abort();
		}

		// increment searchAmazonID and assign to local id
		var id = ++searchAmazonID;

		searchRequest = $.ajax({
			url: AMAZON_SEARCH_URL,
			type: 'GET',
			data: requestData,
			dataType: 'xml',
			cache: true,
			success: function(data) {

				// only allow latest request from returning onSuccess
				if (id === searchAmazonID || !preventMultipleRequests) {
					searchRequest = null;
					onSuccess(data);
				}
			},
			error: function() {

				// random delay
				var delayMS = Math.floor(Math.random() * (RETRY_AMAZON_MAX - RETRY_AMAZON_MIN + 1)) + RETRY_AMAZON_MIN;

				// retry request after random delay
				(function() {
					Amazon.searchAmazon(keywords, browseNode, onSuccess, onError, preventMultipleRequests);

				}).delay(delayMS);

				// return error with serviceUnavailable status as True
				if (onError) {
					onError(true);
				}
			}
		});

		return searchRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.parseAmazonResultItem = function($resultItem, skipFilter) {

		skipFilter = typeof skipFilter !== 'undefined' ? skipFilter : false;

		var isFiltered = false;
		var	filter = '(' + FILTERED_NAMES.join('|') + ')';
		var	re = new RegExp(filter, 'i');

		// get attributes from xml for filter check
		var itemData = {
			name: $resultItem.find('Title').text(),
			platform: $resultItem.find('Platform').text()
		};

		// result has been filtered
		if (!skipFilter && (re.test(itemData.name) || itemData.platform === '')) {

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
			if (itemData.releaseDate && releaseDate !== '1900-01-01') {
				itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
			} else {
				itemData.calendarDate = 'Unknown';
				itemData.releaseDate = '1900-01-01';
			}
		}

		return itemData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemDetail = function(asin, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedItem = getCachedItem(asin);

		// load cached gb data
		if (cachedItem) {

			// return updated source item
			onSuccess(cachedItem);

		// download amazon item
		} else {

			// add to queue
			if (!_.has(getAmazonItemDetailQueue, asin)) {
				getAmazonItemDetailQueue[asin] = [];
			}
			getAmazonItemDetailQueue[asin].push(onSuccess);

			// run for first call only
			if (getAmazonItemDetailQueue[asin].length === 1) {

				// browse node, search terms and response group in url
				var requestData = {
					'asin': asin,
					'response_group': 'Medium'
				};

				$.ajax({
					url: AMAZON_DETAIL_URL,
					type: 'GET',
					data: requestData,
					dataType: 'xml',
					cache: true,
					success: function(data) {

						// iterate queued return methods
						_.each(getAmazonItemDetailQueue[asin], function(successMethod) {

							// cache result
							amazonItemCache[asin] = data;

							// return data
							successMethod(data);
						});

						// empty queue
						getAmazonItemDetailQueue[asin] = [];
					},
					error: onError
				});
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemOffers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemOffers = function(asin, sourceItem, onSuccess, onError) {

		console.info('getAmazonOffers');

		// find in amazon offer cache first
		var cachedOffer = getCachedOffer(asin);
		// load cached amazon offer
		if (cachedOffer) {
			console.info('get cached offer', cachedOffer);
			// add score data to source item
			sourceItem.offers = cachedOffer;

			// return updated source item
			onSuccess(cachedOffer);

		// get new offer data
		} else {

			// add to queue
			if (!_.has(getAmazonItemOffersQueue, asin)) {
				getAmazonItemOffersQueue[asin] = [];
			}
			getAmazonItemOffersQueue[asin].push(onSuccess);

			// run for first call only
			if (getAmazonItemOffersQueue[asin].length === 1) {

				// OfferSummary, OfferListings, Offers, OfferFull
				var requestData = {
					'asin': asin,
					'response_group': 'OfferFull'
				};

				$.ajax({
					url: AMAZON_DETAIL_URL,
					type: 'GET',
					data: requestData,
					dataType: 'xml',
					cache: true,
					success: function(data) {

						// iterate queued return methods
						_.each(getAmazonItemOffersQueue[asin], function(successMethod) {

							// parse
							var offerItem = parseAmazonOffers(data, sourceItem);

							// cache result
							amazonOffersCache[asin] = offerItem;

							// return data
							successMethod(offerItem);
						});

						// empty queue
						getAmazonItemOffersQueue[asin] = [];
					},
					error: onError
				});
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatOfferData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatOfferData = function(offerItem) {

		var buyNowPrice = null;
		var buyNowRawPrice = null;

		// iterate offers
		for (var i = 0, len = offerItem.offers.length; i < len; i++) {
			if (offerItem.offers[i].availability === 'now') {
				buyNowPrice = offerItem.offers[i].price;
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
	* getCachedOffer -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedOffer = function(asin) {

		var amazonOfferItem = null;

		if (typeof amazonOffersCache[asin] !== 'undefined') {
			amazonOfferItem = amazonOffersCache[asin];
		}

		return amazonOfferItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItem = function(id) {

		var amazonItem = null;

		if (typeof amazonItemCache[id] !== 'undefined') {
			amazonItem = amazonItemCache[id];
		}

		return amazonItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOffers = function(data, sourceItem) {

		var offerItem = {};

		// iterate xml results, construct offers
		$('Item', data).each(function() {

			// parse amazon result item, add data to offerItem
			offerItem = parseAmazonOfferItem($(this));
		});

		// add offerItem to item model
		sourceItem.offers = offerItem;

		return offerItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOfferItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOfferItem = function($resultItem) {

		var offerItem = {};
		var offer = {};

		// remove $ sign
		var re = /\$/;

		// get attributes from xml
		var totalNew = parseInt($resultItem.find('TotalNew').text(), 10);
		var totalUsed = parseInt($resultItem.find('TotalUsed').text(), 10);

		// offers found
		if (totalNew !== 0 || totalUsed !== 0) {

			offerItem.totalNew = totalNew;
			offerItem.totalUsed = totalUsed;
			offerItem.lowestNewPrice = $resultItem.find('LowestNewPrice FormattedPrice').text().replace(re, '');
			offerItem.lowestUsedPrice = $resultItem.find('LowestUsedPrice FormattedPrice').text().replace(re, '');
			offerItem.totalOffers = $resultItem.find('TotalOffers').text();
			offerItem.offersURL = $resultItem.find('MoreOffersUrl').text();
			offerItem.offersURLNew = $resultItem.find('MoreOffersUrl').text() + '&condition=new';
			offerItem.offersURLUsed = $resultItem.find('MoreOffersUrl').text() + '&condition=used';

			// convert offer url to a product url
			var offerRE = /offer-listing/gi;
			offerItem.productURL = offerItem.offersURL.replace(offerRE, 'product');
			offerItem.offers = [];

			// iterate offers
			$('Offer', $resultItem).each(function() {

				offer = {};

				offer.price = $(this).find('Price FormattedPrice').text().replace(re, '');
				offer.rawPrice = $(this).find('Price Amount').text();
				offer.availability = $(this).find('AvailabilityType').text();
				offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

				offerItem.offers.push(offer);
			});

			// format offer data
			formatOfferData(offerItem);
		}

		return offerItem;
	};

})(gamedex.module('amazon'), gamedex, jQuery, _, moment);

