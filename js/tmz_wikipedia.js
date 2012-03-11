// Wikipedia
(function(Wikipedia) {

	// Dependencies
	var User = tmz.module('user');
	var Utilities = tmz.module('utilities');
	var ItemLinker = tmz.module('itemLinker');

	// wikipedia cache
	var wikipediaPageCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getWikipediaPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Wikipedia.getWikipediaPage = function(title, sourceItem, onSuccess) {

		// find in attributes cache first
		var itemAttributes = wikipediaPageCache[sourceItem.id];

		if (itemAttributes && typeof itemAttributes.wikipediaPage !== 'undefined') {

			// display attribute
			onSuccess(itemAttributes.wikipediaPage);

		// search wikipedia
		} else {

			// // console.info('seearch pedia');
			searchWikipedia(title, function(data) {

				// get page array
				var pageArray = null;
				_.each(data, function(item, key) {
					pageArray = item;
				});

				// match page to sourceItem
				ItemLinker.findWikipediaMatch(pageArray, sourceItem, function(item) {

					// get wikipedia page details
					getWikipediaPageDetails(item.name, function(data) {

						// get wikipedia page url
						_.each(data.query.pages, function(pageItem, key){

							// add to cache
							if (itemAttributes) {
								itemAttributes.wikipediaPage = pageItem.fullurl;
							} else {
								wikipediaPageCache[sourceItem.id] = {wikipediaPage: pageItem.fullurl};
							}

							// display attribute
							onSuccess(pageItem.fullurl);
						});
					});
				});
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchWikipedia
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchWikipedia = function(keywords, onSuccess, onError) {

		var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=?';

		var requestData = {
			'search': keywords,
			'prop': 'revisions',
			'rvprop': 'content'
		};

        $.ajax({
            url: url,
            type: 'GET',
            data: requestData,
            dataType: 'jsonp',
            cache: false,
            crossDomain: true,
            success: onSuccess,
            error: onError
        });

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getWikipediaPageDetails
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getWikipediaPageDetails = function(pageTitle, onSuccess, onError) {

		var url = 'http://en.wikipedia.org/w/api.php?action=query&format=json&callback=?';

		var requestData = {
			'titles': pageTitle,
			'prop': 'info',
			'inprop': 'url'
		};

        $.ajax({
            url: url,
            type: 'GET',
            data: requestData,
            dataType: 'jsonp',
            cache: false,
            crossDomain: true,
            success: onSuccess,
            error: onError
        });

	};


})(tmz.module('wikipedia'));

