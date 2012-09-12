// ITEM VIEW
(function(ImportView, tmz, $, _) {
	"use strict";

    // modules references
    var User = tmz.module('user'),
		Utilities = tmz.module('utilities'),
		ItemData = tmz.module('itemData'),
		TagView = tmz.module('tagView'),
		ItemView = tmz.module('itemView'),
		Amazon = tmz.module('amazon'),
		Metacritic = tmz.module('metacritic'),
		ItemLinker = tmz.module('itemLinker'),
		GiantBomb = tmz.module('giantbomb'),

		// constants
		INPUT_SOURCES = ['Steam', 'PSN', 'XBL'],
		INPUT_SOURCES_ID_NAME = ['Account Name', 'PSN ID', 'Gamertag'],
		INPUT_SOURCES_URL = ['http://steamcommunity.com/actions/SearchFriends', 'http://us.playstation.com/mytrophies/', 'https://live.xbox.com/en-US/Friends'],

		NO_MATCH_IMAGE = 'http://d2sifwlm28j6up.cloudfront.net/no_match.png',

		// properties
		requestCount = 0,
		requestsCompleted = 0,
		titlesFoundCount = 0,		// number of titles found form source
		titlesImportedCount = 0,	// number of titles actually imported (linked to external source)

		currentSourceID = null,
		sourceImportStarted = {},

		// data
		importedTitles = [],
		importedGames = [],

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

		$loadingStatus = $importContainer.find('.loadingStatus'),
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

		// construct rate limited function
		findAmazonItemRateLimited = findAmazonItem.lazy(2000, 2000),

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
		}, 1000);
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

		// clear import list
		$importResultsBody.empty();

		// hide loading status
		$loadingStatus.stop().hide();
		$importProgress.stop().hide();
		$importStatus.stop().hide();
		$importProgressBar.css({'width': '0%'});

		// remove ready status from modal
		$importModal.removeClass('ready');

		// hide config and show import modal
		$importConfigModal.modal('hide');
		$importModal.modal('show');

		// show loading status
		$loadingStatus.fadeIn();

		// import games
		ItemData.importGames(currentSourceID, sourceUser, function(importedTitles) {

			// parse imported titles
			importTitles(importedTitles, ['PSN', 'PS3', 'Vita']);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cancelImport -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cancelImport = function() {

		delete sourceImportStarted[currentSourceID];

		// show config and hide import modal
		showImportConfigModal();
		$importModal.modal('hide');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importTitles - begin linking and fetching title data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importTitles = function(_importedTitles, allowedPlatforms) {

		importedTitles = _importedTitles;
		titlesFoundCount = importedTitles.length;

		/* iterate each imported game - find on giantbomb, get platform, metacritic and alternate provider (Amazon) data
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		_.each(importedTitles, function(title) {

			// cleanup title
			title = ItemLinker.standardizeTitle(title);

			// set giantbomb as initial provider, add standard name propery
			var searchItem = {'initialProvider': 1, 'standardName': title};

			/* search giantbomb
			~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.Amazon, false, function (item) {

				// process giantbomb item
				processGiantbombItem(title, item, searchItem, allowedPlatforms);

			// on error - no giantbomb match found
			}, function() {

				// add no match placeholder warning
				addNoMatchTitle(title);
			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* processGiantbombItem - get platforms, linked source and third party data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var processGiantbombItem = function(title, item, searchItem, allowedPlatforms) {

		// extend searchItem with returned item data
		$.extend(true, searchItem, item);

		/* get platform information for each item by gbombID
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		GiantBomb.getGiantBombItemPlatform(searchItem.id, function(platformResult) {

			var platformList = [];
			var alternateRequest;

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
				findAmazonItemRateLimited(searchItem, amazonAlternateComplete);

				/* get metascore
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				var metascoreRequest = Metacritic.getMetascore(searchItem.standardName, searchItem, true, metascoreComplete);

				/* add game title
				~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
				addTitle(searchItem);


			// no platform found in allowedPlatforms - is likely not a correct match
			} else {
				addNoMatchTitle(title);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findAmazonItem - get amazon alternate item
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findAmazonItem = function(searchItem, onSuccess) {

		// find alternate amazon item
		var alternateRequest = ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.GiantBomb, false, function (item) {

			// add asin to search item
			searchItem.asin = item.asin;
			onSuccess();

		// on error
		}, function() {
			onSuccess();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTitle - add title to results
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addTitle = function(importedItem) {

		importedItem.importClass = 'imported';

		if (titlesImportedCount === 0) {
			$loadingStatus.stop().fadeOut();
			$importProgress.stop().fadeIn();
			$importStatus.stop().fadeIn();
		}

		titlesImportedCount++;

		// add to importedGames
		importedGames.push(importedItem);

		// append item to importResults
		appendResults(importedItem);

		// increment progress bar
		incrementProgress();
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

		incrementProgress();

		// allow import once all requests complete
		if (requestCount == requestsCompleted) {
			finalizeImport();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* increment progress bar
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var incrementProgress = function() {

		// update progress bar
		var progressTotal = titlesFoundCount + requestCount;
		var progressComplete = titlesImportedCount + requestsCompleted;

		var progressPercent = Math.round((progressComplete / progressTotal) * 100);

		$importProgressBar.css({'width': progressPercent + '%'});

		// update status text
		$importStatusText.text(progressComplete + ' of ' + progressTotal);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finalizeImport - all items imported and linked
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finalizeImport = function() {

		// hide progress and show confirm import button
		$importProgress.stop().fadeOut();
		$importStatus.stop().fadeOut();
		$importModal.addClass('ready');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImportedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImportedGames = function() {

		// get tag name
		var tagName = INPUT_SOURCES[currentSourceID].toLowerCase() + ' import';

		var importTotal = importedGames.length;
		var importCount = 0;

		// create tag
		TagView.addTag(tagName, function(tag) {

			// tag created > add importedGames to tag list
			var tagsToAdd = [tag.tagID];

			// for each imported game > add to tag
			_.each(importedGames, function(item) {

				// add game to tag
				ItemData.addItemToTags(tagsToAdd, item, function(data) {

					importCount++;

					// all items added > run final step
					if (importCount === importTotal) {
						finalizeAdditions(tagsToAdd);
					}
				});
			});
		});

		// import complete, reset source id
		delete sourceImportStarted[currentSourceID];
		currentSourceID = null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finalizeAdditions - all items added to tag list
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finalizeAdditions = function(tagIDsAdded) {

		// hide modal
		$importModal.modal('hide');

		// refresh item view
		ItemView.refreshView();

		// update tag view list
		TagView.updateViewList(tagIDsAdded);

		// select random item
		ItemView.viewRandomItem();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'init': init,
		'startImport': startImport
	};

	$.extend(ImportView, publicMethods);


})(tmz.module('importView'), tmz, jQuery, _);
