// ITEM VIEW
(function(ImportView, gamedex, $, _, alertify) {
	"use strict";

    // modules references
    var User = gamedex.module('user'),
		Utilities = gamedex.module('utilities'),
		ItemData = gamedex.module('itemData'),
		TagView = gamedex.module('tagView'),
		ItemView = gamedex.module('itemView'),
		Amazon = gamedex.module('amazon'),
		Metacritic = gamedex.module('metacritic'),
		ItemLinker = gamedex.module('itemLinker'),
		GiantBomb = gamedex.module('giantbomb'),

		// constants
		INPUT_SOURCES = ['Steam', 'PSN', 'XBL'],
		INPUT_SOURCES_ID_NAME = ['Steam ID', 'PSN ID', 'Gamertag'],
		INPUT_SOURCES_URL = ['http://steamcommunity.com/id/[steam_id]/games/', 'http://us.playstation.com/mytrophies/', 'http://www.xboxgamertag.com/search/[gamer_tag]'],
		INPUT_SOURCES_PLATFORMS = [['PC', 'Mac'],  ['PSN', 'PS3', 'Vita'],  ['Xbox', 'X360', 'XBL']],

		NO_MATCH_IMAGE = 'http://d2sifwlm28j6up.cloudfront.net/no_match.png',

		IMPORTING_STATUS_TEXT = 'Loading Data: ',
		ADDING_STATUS_TEXT = 'Importing: ',

		// properties
		requestCount = 0,
		requestsCompleted = 0,
		titlesFoundCount = 0,		// number of titles found form source
		titlesImportedCount = 0,	// number of titles actually imported (linked to external source)

		addTotal = 0,				// number of titles to be added
		addCount = 0,				// number of titles currently added

		currentSourceID = null,		// INPUT SOURCE: steam, psn, xbl
		sourceImportStarted = {},

		currentImportSessionID = 0,	// import session id for invalidating delayed function calls

		// data
		importedTitles = [],
		importedGames = [],
		pendingRequests = [],

		// element cache
		$importContainer = $('#importContainer'),
		$importResults = $('#importResults'),
		$importResultsBody = $('#importResults tbody'),
		$startImportBtn = $('#startImport_btn'),
		$confirmImportBtn = $('#confirmImport_btn'),
		$cancelImportBtn = $('#cancelImport_btn'),
		$sourceUser = $('#sourceUser'),

		$importSourceID = $('.importSourceID'),
		$importSourceName = $('.importSourceName'),
		$importSourceURL = $('.importSourceURL'),

		// modal
		$importConfigModal = $('#importConfig-modal'),
		$importModal = $('#import-modal'),

		$importProgressContainer = $('#importProgressContainer'),
		$importProgress = $('#importProgress'),
		$importProgressBar = $importProgress.find('.bar'),
		$importStatus = $('#importStatus'),
		$importStatusTitle = $importStatus.find('.statusTitle'),
		$importStatusText = $importStatus.find('.statusText'),

		// rate limited function for findAmazonItem - Amazon has request limit per second
		findAmazonItemRateLimited = null,

		// templates
		importResultsTemplate = _.template($('#import-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var init = function() {

		createEventHandlers();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var createEventHandlers = function() {

		// start import button: click
		$startImportBtn.click(function(e) {
			e.preventDefault();

			if ($sourceUser.val() !== '') {
				// begin import process
				importSource($sourceUser.val());
			}
		});

		// source user field: keyup
		$sourceUser.keyup(function(e) {
			e.preventDefault();

			// enter key
			if (e.which === 13 && $sourceUser.val() !== '') {

				// begin import process
				importSource($sourceUser.val());
			}
		});

		// confirm import button: click
		$confirmImportBtn.click(function(e) {
			e.preventDefault();

			// begin adding games to list
			addImportedGames();
		});

		// cancel import button: click
		$cancelImportBtn.click(function(e) {
			e.preventDefault();

			cancelImport();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearImportView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearImportView = function() {

		$importResults.html('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startImport - beging game import
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startImport = function(sourceID) {

		currentSourceID = sourceID;

		// previous import not complete and requested same source import, resume import
		if (_.has(sourceImportStarted, sourceID)) {

			// hide config and show import modal
			$importConfigModal.modal('hide');
			$importModal.modal('show');

		// start new import
		} else {

			// show source config
			showImportConfigModal();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showImportConfigModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showImportConfigModal = function() {

		// set source name
		$importSourceID.text(INPUT_SOURCES_ID_NAME[currentSourceID]);
		$importSourceName.text(INPUT_SOURCES[currentSourceID]);

		var url = INPUT_SOURCES_URL[currentSourceID];
		var href = '<a href="' + url + '" target="_blank">' + url + '</a>';
		$importSourceURL.html(href);

		// show modal
		$importConfigModal.modal('show');

		// focus source user filed
		_.delay(function() {
			$sourceUser.focus().select();
		}, 800);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importSource -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importSource = function(sourceUser) {

		// started source import
		sourceImportStarted[currentSourceID] = true;

		// reset data
		importedGames = [];

		requestCount = 0,
		requestsCompleted = 0,
		titlesFoundCount = 0,
		titlesImportedCount = 0,

		// create new rate limited function
		findAmazonItemRateLimited = findAmazonItem.lazy(500, 10000),

		// increment session ID
		currentImportSessionID++;

		// clear import list
		$importResultsBody.empty();

		// beging progress
		initializeProgress(IMPORTING_STATUS_TEXT);

		// hide config and show import modal
		$importConfigModal.modal('hide');
		$importModal.modal('show');

		// import games
		ItemData.importGames(currentSourceID, sourceUser, function(importedTitles) {

			// parse imported titles
			importTitles(importedTitles, INPUT_SOURCES_PLATFORMS[currentSourceID]);
		});

		alertify.success('Importing ' + INPUT_SOURCES[currentSourceID] + ' games for: ' + sourceUser);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cancelImport -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cancelImport = function() {

		delete sourceImportStarted[currentSourceID];

		// increment session id to invalidate delayed function calls
		currentImportSessionID++;

		// abort all pending requests
		_.each(pendingRequests, function(request, index) {

			if (request && _.has(request, 'abort')) {
				request.abort();
			}
		});

		// show config and hide import modal
		showImportConfigModal();
		$importModal.modal('hide');

		alertify.error(INPUT_SOURCES[currentSourceID] + ' import cancelled');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importTitles - begin linking and fetching title data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importTitles = function(_importedTitles, allowedPlatforms) {

		// set import properties
		importedTitles = _importedTitles;
		titlesFoundCount = importedTitles.length;

		// clear pending requests array
		pendingRequests = [];

		/* iterate each imported game - find on giantbomb, get platform, metacritic and alternate provider (Amazon) data
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		_.each(importedTitles, function(title) {

			// cleanup title
			title = ItemLinker.standardizeTitle(title);

			// search giantbomb
			var giantbombSearchRequest = searchGiantbomb(title, allowedPlatforms);

			// add search request to pending requests
			pendingRequests.push(giantbombSearchRequest);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantbomb -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchGiantbomb = function(title, allowedPlatforms) {

		// set giantbomb as initial provider, add standard name propery
		var searchItem = {'initialProvider': 1, 'standardName': title};

		/* search giantbomb
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		var giantbombSearchRequest = ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.Amazon, false, function (item) {

			// process giantbomb item
			processGiantbombItem(title, item, searchItem, allowedPlatforms);

		// on error - no giantbomb match found
		}, function() {

			// add no match placeholder warning
			addNoMatchTitle(title);
		});

		return giantbombSearchRequest;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* processGiantbombItem - get platforms, linked source and third party data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var processGiantbombItem = function(title, item, searchItem, allowedPlatforms) {

		// extend searchItem with returned item data
		$.extend(true, searchItem, item);

		/* get platform information for each item by gbombID
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		var giantbombPlatformRequest = GiantBomb.getGiantBombItemPlatform(searchItem.id, function(platformResult) {

			var platformList = [];

			// iterate returned platforms
			for (var i = 0, len = platformResult.results.platforms.length; i < len; i++) {

				// standardize platform names
				var standardPlatform = Utilities.matchPlatformToIndex(platformResult.results.platforms[i].name).name;
				platformList.push(standardPlatform);
			}

			// use only first platform found in allowed platforms
			var foundPlatforms = _.intersection(platformList, allowedPlatforms);

			// assign first platform
			searchItem.platform = foundPlatforms[0];

			// allowed platform found, get alternate, metascore and add to import list
			if (searchItem.platform) {

				// two requests created: amazon and metascore
				requestCount += 2;

				/* get amazon alternate item
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				findAmazonItemRateLimited(searchItem, amazonAlternateComplete, currentImportSessionID);

				/* get metascore
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				getMetascore(searchItem);

				/* add game title
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				addTitle(searchItem);


			// no platform found in allowedPlatforms - is likely not a correct match
			} else {
				addNoMatchTitle(title);
			}
		});

		// add to platform request to pending requests
		pendingRequests.push(giantbombPlatformRequest);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(searchItem) {

		var metascoreRequest = Metacritic.getMetascore(searchItem.standardName, searchItem, true, metascoreComplete);

		// add to pending requests
		pendingRequests.push(metascoreRequest);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findAmazonItem - get amazon alternate item
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findAmazonItem = function(searchItem, onSuccess, importSessionID) {

		// check if session invalidated
		if (currentImportSessionID !== importSessionID) {
			return;
		}

		// find alternate amazon item
		var amazonRequest = ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.GiantBomb, false, function (item) {

			console.info('success: ', searchItem.name)

			// add asin to search item
			searchItem.asin = item.asin;
			onSuccess();

		// on error
		}, function(serviceUnavailable) {

			if (serviceUnavailable) {
				console.info('service unavailable: ', searchItem.name)

			} else {
				console.info('no match found: ', searchItem.name)
				onSuccess();
			}
		});

		// add to pending requests
		pendingRequests.push(amazonRequest);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTitle - add title to results
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addTitle = function(importedItem) {

		importedItem.importClass = 'imported';

		if (titlesImportedCount === 0) {
			startProgress();
		}

		titlesImportedCount++;

		// add to importedGames
		importedGames.push(importedItem);

		// append item to importResults
		appendResults(importedItem);

		// increment progress bar
		incrementImportProgress();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addNoMatchTitle - add placeholder warning title
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addNoMatchTitle = function(title) {

		var placeholderItem = {
			'thumbnailImage': NO_MATCH_IMAGE,
			'name': title,
			'calendarDate': '',
			'platform': 'Title not found: please add manually',
			'importClass': 'importFailed'
		};

		// append item to importResults
		appendResults(placeholderItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* appendResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var appendResults = function(item) {

		// get model data
		var templateData = {'item': item};

		// append model to importResults
		$importResultsBody.append(importResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonAlternateComplete - amazon alernate request complete
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonAlternateComplete = function() {
		incrementRequestProgress();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreComplete - metascore request complete
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreComplete = function(score) {
		incrementRequestProgress();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* incrementRequestProgress - increment request progress and finalize when all requests complete
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var incrementRequestProgress = function() {

		requestsCompleted++;

		incrementImportProgress();

		// allow import once all requests complete
		if (requestCount == requestsCompleted) {
			finalizeImport();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* increment progress bar
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var incrementImportProgress = function() {

		// update progress bar
		var progressTotal = titlesFoundCount + requestCount;
		var progressComplete = titlesImportedCount + requestsCompleted;
		var progressPercent = Math.round((progressComplete / progressTotal) * 100);

		$importProgressBar.css({'width': progressPercent + '%'});

		// update status text
		$importStatusText.text(progressComplete + ' of ' + progressTotal);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* increment add progress bar
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var incrementAddProgress = function() {

		// update progress bar
		var progressPercent = Math.round((addCount / addTotal) * 100);
		$importProgressBar.css({'width': progressPercent + '%'});

		// update status text
		$importStatusText.text(addCount + ' of ' + addTotal);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeProgress - reset progress bar and status
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initializeProgress = function(title) {

		// remove ready class
		$importModal.removeClass('ready').addClass('loading');

		// hide progress container
		$importProgressContainer.removeClass('show');

		// progress bar width and status text reset
		$importProgressBar.css({'width': '0%'});
		$importStatusTitle.text(title);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startProgress -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startProgress = function() {

		$importProgressContainer.addClass('show');
		$importModal.removeClass('ready').removeClass('loading');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideProgress -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideProgress = function() {

		$importProgressContainer.removeClass('show');

		// reset width - delay so animation occurs while invisible
		_.delay(function() {
			$importProgressBar.css({'width': '0%'});
		}, 1000);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finalizeImport - all items imported and linked
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finalizeImport = function() {

		// hide progress and show confirm import button
		hideProgress();

		// delay ready state
		_.delay(function() {
			$importModal.addClass('ready');
		}, 1000);

		alertify.success(titlesFoundCount + ' titles found and linked for ' + INPUT_SOURCES[currentSourceID]);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImportedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImportedGames = function() {

		// new status text and start progress
		$importStatusTitle.text(ADDING_STATUS_TEXT);
		startProgress();

		// get tag name
		var tagName = INPUT_SOURCES[currentSourceID].toLowerCase() + ' import';

		addTotal = importedGames.length;
		addCount = 0;

		// create tag
		TagView.addTag(tagName, function(tag) {

			// tag created > add importedGames to tag list
			var tagsToAdd = [tag.tagID];

			// for each imported game > add to tag
			_.each(importedGames, function(item) {

				// add game to tag
				ItemData.addItemToTags(tagsToAdd, item, function(data) {

					addCount++;

					// increment adding progress bar
					incrementAddProgress();

					// all items added > run final step
					if (addCount === addTotal) {
						finalizeAdditions(tagsToAdd, tagName);
					}
				});
			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finalizeAdditions - all items added to tag list
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finalizeAdditions = function(tagIDsAdded, tagName) {

		alertify.success(INPUT_SOURCES[currentSourceID] + ' Import Complete');
		alertify.log('Games added to tag: ' + tagName);

		// hide modal
		$importModal.modal('hide');

		// refresh item view
		ItemView.refreshView();

		// update tag view list
		TagView.updateViewList(tagIDsAdded);

		// select random item
		ItemView.viewRandomItem();

		// import complete, reset source id
		delete sourceImportStarted[currentSourceID];
		currentSourceID = null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'init': init,
		'startImport': startImport
	};

	$.extend(ImportView, publicMethods);


})(gamedex.module('importView'), gamedex, jQuery, _, alertify);
