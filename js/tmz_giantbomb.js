// GiantBomb
(function(GiantBomb) {

    // module references
	var Amazon = tmz.module('amazon');

	// data
	giantBombDataCache = {};
	giantBombItemCache = {};

	// templates

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.searchGiantBomb = function(keywords, onSuccess, onError) {

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
	* parseGiantBombResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.parseGiantBombResultItem = function(resultItem) {
		itemData = {
			id: resultItem.id,
			asin: 0,
			gbombID: resultItem.id,
			name: resultItem.name,
			platform: 'n/a'
		};



		// format date
		if (resultItem.original_release_date !== null && resultItem.original_release_date !== '') {
			itemData.releaseDate = resultItem.original_release_date.split(' ')[0];
		} else {
			itemData.releaseDate = '1900-01-01';
		}

		// calendar date
		if (itemData.releaseDate !== '1900-01-01') {
			itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
		} else {
			itemData.calendarDate = 'Unknown';
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
	* getGiantBombItemPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemPlatform = function(gbombID, onSuccess, onError) {

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
	GiantBomb.getGiantBombItemData = function(gbombID, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedData = getCachedData(gbombID);

		// load cached gb data
		if (cachedData) {

			// return updated source item
			onSuccess(cachedData);

		// download gb data
		} else {

			// download data
			var fieldList = ['description', 'site_detail_url'];
			getGiantBombItem(gbombID, fieldList, function(data) {

				// cache result
				giantBombDataCache[gbombID] = data.results;

				onSuccess(data.results);

			}, onError);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemDetail = function(gbombID, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedItem = getCachedItem(gbombID);

		// load cached gb data
		if (cachedItem) {

			// return updated source item
			onSuccess(cachedItem);


		// download gb item
		} else {

			// download data
			var fieldList = ['id', 'name', 'original_release_date', 'image'];
			getGiantBombItem(gbombID, fieldList, function(data) {

				// cache result
				giantBombItemCache[gbombID] = data.results;
				onSuccess(data.results);

			}, onError);
		}
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
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(id) {

		var giantBombData = null;

		if (typeof giantBombDataCache[id] !== 'undefined') {
			giantBombData = giantBombDataCache[id];
		}

		return giantBombData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItem = function(id) {

		var giantBombItem = null;

		if (typeof giantBombItemCache[id] !== 'undefined') {
			giantBombItem = giantBombItemCache[id];
		}

		return giantBombItem;
	};


})(tmz.module('giantbomb'));

