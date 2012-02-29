// AmazonPrice
(function(AmazonPrice) {

    // module references
	var SearchData = tmz.module('searchData');

	// data
	amazonOffersCache = {};

	// templates
	var priceMenuTemplate = _.template($('#price-menu-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemOffers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	AmazonPrice.getAmazonItemOffers = function(asin, sourceItem, onSuccess) {

		// find in amazon offer cache first
		var cachedOffer = getCachedOffers(sourceItem.id);
		// load cached amazon offer
		if (cachedOffer) {
			// add score data to source item
			sourceItem.offers = cachedOffer;

			// return updated source item
			onSuccess(sourceItem);

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
	* addPriceMenu -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	AmazonPrice.addPriceMenu = function(offerItem, priceSelector) {

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

		var templateData = {'productURL': offerItem.productURL, 'offersURLNew': offerItem.offersURLNew, 'offersURLUsed': offerItem.offersURLUsed, 'buyNowPrice': buyNowPrice, 'buyNowRawPrice': buyNowRawPrice, 'lowestNewPrice': offerItem.lowestNewPrice, 'lowestUsedPrice': offerItem.lowestUsedPrice, 'totalNew': offerItem.totalNew, 'totalUsed': offerItem.totalUsed};

		// attach to existing item result
		$(priceSelector).html(priceMenuTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedOffers = function(id) {

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

		onSuccess(sourceItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOfferItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOfferItem = function($resultItem) {

		console.info($resultItem);
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

			console.info($(this));
			offer = {};

			offer.price = $(this).find('Price FormattedPrice').text();
			offer.rawPrice = $(this).find('Price Amount').text();
			offer.availability = $(this).find('AvailabilityType').text();
			offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

			offerItem.offers.push(offer);
		});

		console.info(offerItem);
		return offerItem;
	};

})(tmz.module('amazonPrice'));

