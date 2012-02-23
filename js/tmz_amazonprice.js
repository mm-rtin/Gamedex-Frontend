// AmazonPrice
(function(AmazonPrice) {

    // module references
	var SearchData = tmz.module('searchData');

	// templates
	var priceMenuTemplate = _.template($('#price-menu-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemOffers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	AmazonPrice.getAmazonItemOffers = function(asin, sourceItem, priceSelector) {

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
			success: function(data) {
				parseAmazonOffers(data, sourceItem, priceSelector);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOffers = function(data, sourceItem, priceSelector) {

		var offerItem = {};

		// iterate xml results, construct offers
		$('Item', data).each(function() {

			// parse amazon result item, add data to offerItem
			offerItem = parseAmazonOfferItem($(this));
		});

		// add offerItem to item model
		sourceItem.offers = offerItem;

		// add price menu to item results
		addPriceMenu(offerItem, priceSelector);
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

		// iterate offers
		$('Offer', $resultItem).each(function() {

			offer = {};
			offerItem.offers = [];

			offer.price = $(this).find('FormattedPrice').text();
			offer.availability = $(this).find('AvailabilityType').text();
			offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

			offerItem.offers.push(offer);
		});

		return offerItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addPriceMenu -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addPriceMenu = function(offerItem, priceSelector) {

		var buyNowPrice = null;

		// iterate offers
		for (var i = 0, len = offerItem.offers.length; i < len; i++) {
			if (offerItem.offers[i].avalability === 'now') {
				buyNowPrice = offerItem.offers[i].price;
			}
		}

		buyNowPrice = buyNowPrice || offerItem.lowestNewPrice;

		var templateData = {'buyNowPrice': buyNowPrice, 'lowestNewPrice': offerItem.lowestNewPrice, 'lowestUsedPrice': offerItem.lowestUsedPrice, 'totalNew': offerItem.totalNew, 'totalUsed': offerItem.totalUsed};

		// attach to existing item result
		$(priceSelector).html(priceMenuTemplate(templateData));
	};

})(tmz.module('amazonPrice'));

