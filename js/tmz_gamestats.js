// GameStats
(function(GameStats) {

    // module references

	// properties

	// data
	var gamestatsCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getPopularGamesListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameStats.getPopularGamesListByPlatform = function(platform, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform);

		if (cachedList) {

			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var url = 'popularlist/gamestats/gpm';

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
					onSuccess(parseGamestatsResults(data));
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGamestatsResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGamestatsResults = function(data) {

		var items = [];
		var item = {};

		// get data table
		var $results = $('table:eq(1)', data);
		var $nameElement = null;

		// iterate and pull out item data
		$results.find('tr').each(function() {

			$nameElement = $(this).find('td:nth-child(2) a');

			item = {
				'name': $.trim($nameElement.text()),
				'gamestatsPage': $.trim($nameElement.attr('href'))
			};

			if (item.name !== '' && item.name !== 'Next 50') {
				items.push(item);
			}
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
	* addToGamestatsCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGamestatsCache = function() {


	};




})(tmz.module('gameStats'));

