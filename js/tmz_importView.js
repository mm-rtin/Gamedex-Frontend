// ITEM VIEW
(function(ImportView, tmz, $, _) {
	"use strict";

    // modules references
    var User = tmz.module('user'),
		Utilities = tmz.module('utilities'),
		ItemData = tmz.module('itemData'),
		TagData = tmz.module('tagData'),
		Amazon = tmz.module('amazon'),
		Metacritic = tmz.module('metacritic'),
		ItemLinker = tmz.module('itemLinker'),
		GiantBomb = tmz.module('giantbomb'),

		// constants
		INPUT_SOURCES = ['Steam', 'PSN', 'XBL'],
		INPUT_SOURCES_ID_NAME = ['Account Name', 'PSN ID', 'Gamertag'],

		// properties
		currentSourceID = null,

		// data
		importedGames = [],

		// element cache
		$importResults = $('#importResults'),
		$importResultsBody = $('#importResults tbody'),
		$startImportBtn = $('#startImport_btn'),
		$confirmImportBtn = $('#confirmImport_btn'),
		$sourceUser = $('#sourceUser'),

		$importSourceID = $('#importSourceID'),
		$importSourceName = $('#importSourceName'),

		// modal
		$importConfigModal = $('#importConfig-modal'),
		$importModal = $('#import-modal'),

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
	* clearImportView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearImportView = function() {

		$importResults.html('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startImport - beging game import
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startImport = function(sourceID) {

		// reset data
		importedGames = [];
		currentSourceID = sourceID;

		// clear import list
		$importResultsBody.empty();

		// show source config
		showImportConfigModal();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showImportConfigModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showImportConfigModal = function() {

		// set source name
		$importSourceID.text(INPUT_SOURCES_ID_NAME[currentSourceID]);
		$importSourceName.text(INPUT_SOURCES[currentSourceID]);

		// show modal
		$importConfigModal.modal('show');

		// focus source user filed
		$sourceUser.focus();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* importSource -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var importSource = function(sourceUser) {

		// hide config and show import modal
		$importConfigModal.modal('hide');
		$importModal.modal('show');

		// import games
		ItemData.importGames(currentSourceID, sourceUser, function(importedTitles) {

			// parse imported titles
			parseImportList(importedTitles);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseImportList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseImportList = function(importedTitles) {

		var importCount = 0;
		var linkedCount = 0;

		// for each imported game - search giantbomb and add
		_.each(importedTitles, function(title) {

			// cleanup title
			title = ItemLinker.standardizeTitle(title);

			// set giantbomb as initial provider, add standard name propery
			var searchItem = {'initialProvider': 1, 'standardName': title};

			// search giantbomb
			ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.Amazon, false, function (item) {

				importCount++;

				// extend searchItem with returned item data
				$.extend(true, searchItem, item);

				console.info(searchItem);

				// get platform information for each item by gbombID
				GiantBomb.getGiantBombItemPlatform(searchItem.id, function(platformResult) {

					// iterate platforms
					_.each(platformResult.results.platforms, function(platform) {

						// save platform name to search item
						switch(platform.id) {

							case 88:
								searchItem.platform = 'PSN';
								break;
							case 35:
								searchItem.platform = 'PS3';
								break;
							case 143:
								searchItem.platform = 'Vita';
								break;
						}
					});

					// find alternate amazon item
					var alternateRequest = ItemLinker.findItemOnAlternateProvider(searchItem, Utilities.SEARCH_PROVIDERS.GiantBomb, false, function (item) {

						//console.info(searchResult.results[0].name, 'alternate');
						//console.info(item.asin);
						// add asin to search item
						searchItem.asin = item.asin;

					});

					// get metascore
					var metascoreRequest = Metacritic.getMetascore(searchItem.standardName, searchItem, true, function(data) {
						//console.info(searchResult.results[0].name, 'metascore');
						// score retrieved and properties added to searchItem
					});

					// when both requests complete >
					$.when(metascoreRequest, alternateRequest).then(function() {
						//console.info(searchResult.results[0].name, 'done');
						//console.info(searchItem.asin, searchItem.metascorePage);

						// add to importedGames
						importedGames.push(searchItem);

						// append item to importResults
						appendResults(searchItem);

						//console.info(searchItem);

						// when linkedCount == importCount > import has completed
						linkedCount++;
						if (linkedCount === importCount - 1) {

							// import has completed > allow user to add games
							allowImport();
						}
					}, function() {
						linkedCount++;
						console.info('failure');
					});
				});

			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* allowImport -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var allowImport = function() {


	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImportedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImportedGames = function() {

		// get tag name
		var tagName = INPUT_SOURCES[currentSourceID].toLowerCase() + ' import';

		// create tag
		TagData.addTag(tagName, function(tag) {

			// tag created > add importedGames to tag list
			var tagsToAdd = [tag.tagID];

			// for each imported game > add to tag
			_.each(importedGames, function(item) {

				ItemData.addItemToTags(tagsToAdd, item, function(data) {

					console.info(data);
				});
			});
		});
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
