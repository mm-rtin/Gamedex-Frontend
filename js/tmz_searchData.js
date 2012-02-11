// SearchData
(function(SearchData) {

	// Dependencies
	var User = tmz.module('user');

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.searchAmazon = function(keywords, browseNode, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);

		// browse node, search terms and response group in url
		var restURL = tmz.api + 'itemsearch/amazon/VideoGames/' + browseNode + '/' + searchTerms + '/ItemAttributes,Images/';

		$.ajax({
			url: restURL,
			type: 'GET',
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
		var restURL = tmz.api + 'itemsearch/giantbomb/' + searchTerms + '/0';

		// list of fields to get as query parameter
		var fieldList = ['id', 'name', 'original_release_date', 'image'];

		var requestData = {
			field_list: fieldList.join(',')
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
	* getGiantBombItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchData.getGiantBombItemDetail = function(gbombID, onSuccess, onError) {

		// searchTerms and page number in url
		var restURL = tmz.api + 'itemdetail/giantbomb/' + gbombID;

		// list of fields to get as query parameter
		var fieldList = ['description'];

		var requestData = {
			field_list: fieldList.join(',')
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


})(tmz.module('searchData'));

