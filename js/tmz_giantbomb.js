// GiantBomb
(function(GiantBomb, tmz, $, _, moment) {
	"use strict";

    // module references
	var Amazon = tmz.module('amazon'),

		// REST URLS
		GIANTBOMB_SEARCH_URL = tmz.api + 'giantbomb/search/',
		GIANTBOMB_DETAIL_URL = tmz.api + 'giantbomb/detail/',

		// data
		giantBombDataCache = {},
		giantBombItemCache = {},

		// request queue
		getGiantBombItemDataQueue = {},
		getGiantBombItemDetailQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.searchGiantBomb = function(keywords, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);

		// list of fields to get as query parameter
		var fieldList = ['id', 'name', 'original_release_date', 'image'];

		var requestData = {
			'field_list': fieldList.join(','),
			'keywords': keywords,
			'page': 0
		};

		$.ajax({
			url: GIANTBOMB_SEARCH_URL,
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
		var itemData = {
			id: resultItem.id,
			asin: 0,
			gbombID: resultItem.id,
			name: resultItem.name,
			platform: 'n/a'
		};

		// format date
		if (resultItem.original_release_date && resultItem.original_release_date !== '') {
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
		if (resultItem.image && resultItem.image.small_url && resultItem.image.small_url !== '') {
			itemData.smallImage = resultItem.image.small_url;
		} else {
			itemData.smallImage = 'no image.png';
		}

		// set thumb url
		if (resultItem.image && resultItem.image.thumb_url && resultItem.image.thumb_url !== '') {
			itemData.thumbnailImage = resultItem.image.thumb_url;
		} else {
			itemData.thumbnailImage = 'no image.png';
		}

		// set large url
		if (resultItem.image && resultItem.image.super_url && resultItem.image.super_url !== '') {
			itemData.largeImage = resultItem.image.super_url;
		} else {
			itemData.largeImage = 'no image.png';
		}

		// set description
		if (resultItem.description && resultItem.description  !== '') {
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

			// add to queue
			if (!_.has(getGiantBombItemDataQueue, gbombID)) {
				getGiantBombItemDataQueue[gbombID] = [];
			}
			getGiantBombItemDataQueue[gbombID].push(onSuccess);

			// run for first call only
			if (getGiantBombItemDataQueue[gbombID].length === 1) {

				// download data
				var fieldList = ['description', 'site_detail_url', 'videos'];

				// giantbomb item request
				getGiantBombItem(gbombID, fieldList, function(data) {

					// iterate queued return methods
					_.each(getGiantBombItemDataQueue[gbombID], function(successMethod) {

						// cache result
						giantBombDataCache[gbombID] = data.results;

						// return data
						successMethod(data.results);
					});

					// empty queue
					getGiantBombItemDataQueue[gbombID] = [];

				}, onError);
			}
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

			// add to queue
			if (!_.has(getGiantBombItemDetailQueue, gbombID)) {
				getGiantBombItemDetailQueue[gbombID] = [];
			}
			getGiantBombItemDetailQueue[gbombID].push(onSuccess);

			// run for first call only
			if (getGiantBombItemDetailQueue[gbombID].length === 1) {

				// download data
				var fieldList = ['id', 'name', 'original_release_date', 'image'];

				// giantbomb item request
				getGiantBombItem(gbombID, fieldList, function(data) {

					// iterate queued return methods
					_.each(getGiantBombItemDetailQueue[gbombID], function(successMethod) {

						// cache result
						giantBombItemCache[gbombID] = data.results;

						// return data
						successMethod(data.results);
					});

					// empty queue
					getGiantBombItemDetailQueue[gbombID] = [];

				}, onError);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItem = function(gbombID, fieldList, onSuccess, onError) {

		var requestData = {
			'field_list': fieldList.join(','),
			'id': gbombID
		};

		$.ajax({
			url: GIANTBOMB_DETAIL_URL,
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


})(tmz.module('giantbomb'), tmz, jQuery, _, moment);

