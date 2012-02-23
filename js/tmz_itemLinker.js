// ItemLinker$
(function(ItemLinker) {

	// Dependencies
	var SearchData = tmz.module('searchData');
	var Utilities = tmz.module('utilities');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findItemOnAlternateProvider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findItemOnAlternateProvider = function(item, provider, onSuccess) {

		switch (provider) {
			case Utilities.getProviders().Amazon:
				console.info('alt search giantbomb');

				searchName = item.standardName;

				console.info('############# ', searchName);

				// run search for giantbomb
				SearchData.searchGiantBomb(searchName, function(data) {
					parseGiantBombAlternate_result(data, item, onSuccess);
				});
				break;

			case Utilities.getProviders().GiantBomb:
				console.info('alt search amazon');

				var browseNode = 0;

				// run same platform search
				if (item.platform !== 'n/a') {
					console.info('RUN SAME PLATFORM SEARCH');
					console.info(item.platform);

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
				console.info('get giantbomb item');

				// get item from giantbomb
				SearchData.getGiantBombItemDetail(item.gbombID, function(data) {
					getGiantBombItemDetail_result(data, onSuccess);
				});
				break;

			case Utilities.getProviders().GiantBomb:
				console.info('get amazon item');

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

			// collect attributes into detailItem object
			detailItem = {};

			// parse item and return if filtered by rules set in searchData
			SearchData.parseAmazonResultItem($(this), detailItem);
		});

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemDetail_result = function(data, onSuccess) {

		// collect attributes into searchItem object
		var detailItem = {};

		console.info(data);

		// parse result item and add to searchItem
		SearchData.parseGiantBombResultItem(data.results, detailItem);

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonAlternate_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonAlternate_result = function(data, originalItem, onSuccess) {

		var filtered = false;

		// number of items found
		var resultLength = ($('Item', data).length);
		var firstResult = null;
		var firstChoice = null;
		var found = false;
		var searchItem = {};
		// current number of items parsed
		var count = 0;

		console.info('**************** RESULTS FOUND: ' + resultLength + ' *******************');

		// iterate results
		$('Item', data).each(function() {

			// collect attributes into searchItem object
			searchItem = {};
			count++;

			// parse item and return if filtered by rules set in searchData
			filtered = SearchData.parseAmazonResultItem($(this), searchItem);

			// save first non-filtered result
			if (!filtered && firstResult === null) {
				firstResult = searchItem;
			}

			// found exact title and release date match
			if (!filtered && originalItem.name.toLowerCase() === searchItem.name.toLowerCase() && searchItem.releaseDate === originalItem.releaseDate) {

				console.info('################ FOUND EXACT MATCH: ' + searchItem.name);

				// exact match found - view second item
				onSuccess(searchItem);
				found = true;

			// found possible name match, but releaseDates don't match - don't match again if firstChoice defined
			} else if (!filtered && originalItem.name.toLowerCase() === searchItem.name.toLowerCase() && firstChoice === null) {
				firstChoice = searchItem;

			// found exact release date match, but names don't match - this choice takes precedance over name match
			} else if (!filtered && searchItem.releaseDate === originalItem.releaseDate) {
				firstChoice = searchItem;
			}
		});


		// no exact matches - multiple results returned
		if (!found && resultLength > 1) {


			// if firstChoice availble, use it
			if (firstChoice !== null) {
				console.info('################ FAILED: VIEW FIRST CHOICE: ', firstChoice);
				onSuccess(firstChoice);

			// use first result found
			} else {
				console.info('################ FAILED: VIEW FIRST RESULT: ', firstResult);
				onSuccess(firstResult);
			}


		// last item - one result returned
		} else if (!found && resultLength === 1) {

			console.info('################ DISPLAY LAST AND ONLY ITEM: ' + searchItem.name);
			// display last item anyway
			onSuccess(searchItem);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombAlternate_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGiantBombAlternate_result = function(data, originalItem, onSuccess) {

		var results = data.results;
		var searchItem = {};
		var standardizedName = '';
		var found = false;

		console.info('**************** RESULTS FOUND: ' + results.length + ' *******************');

		console.info(results);

		// iterate results
		for (var i = 0, len = results.length; i < len; i++) {

			// collect attributes into searchItem object
			searchItem = {};

			// parse result item and add to searchItem
			SearchData.parseGiantBombResultItem(results[i], searchItem);

			// filter unnecessary words from title
			standardizedName = originalItem.standardName;

			console.info(standardizedName, searchItem.name);

			// check if item name is exact match with initial item name
			if(standardizedName === searchItem.name.toLowerCase()) {

				console.info('################ VIEW SECOND GIANT BOMB ITEM: ' + searchItem.name);
				// exact match found - view second item
				onSuccess(searchItem);
				found = true;

			// last item
			} else if (!found && i === len - 1) {
				SearchData.parseGiantBombResultItem(results[0], searchItem);
				onSuccess(searchItem);
			}
		}
	};




})(tmz.module('itemLinker'));
