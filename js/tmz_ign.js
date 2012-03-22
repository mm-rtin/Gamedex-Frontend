// IGN
(function(IGN) {

    // module references

	// properties

	// data
	var IGNCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUpcomingGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getUpcomingGames = function(platform, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform);

		if (cachedList) {

			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var url = 'upcominglist/ign';

			var requestData = {
				'platform': platform
			};

			$.ajax({
				url: url,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// parse results and return items to onSuccess function
					onSuccess(parseIGNResults(data));
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseIGNResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseIGNResults = function(data) {

		var items = [];
		var item = {};

		// get data table
		var $results = $('#table-section-index', data);
		var $nameElement = null;
		var $imageElement = null;
		var $dateElement = null;

		// iterate and pull out item data
		$results.find('.game-row').each(function() {

			$nameElement = $(this).find('.title-game a');
			$imageElement = $(this).find('.box-art img');
			$dateElement = $(this).find('td:nth-child(3)');

			console.info($dateElement);

			item = {
				'name': $nameElement.text(),
				'IGNPage': $nameElement.attr('href'),
				'calendarDate': $dateElement.text(),
				'mediumImage': $imageElement.attr('src')
			};

			items.push(item);
		});

		return items;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function() {

		return null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToIGNCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToIGNCache = function() {


	};




})(tmz.module('ign'));

