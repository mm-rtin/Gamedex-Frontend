
// LIST MODEL
(function(List, tmz, $, _) {
	"use strict";

	// dependecies
	var User = tmz.module('user'),
		TagData = tmz.module('tagData'),
		ItemData = tmz.module('itemData'),

		// node cache
		$addList = $('#addList'),
		$viewList = $('#viewList'),
		$gridList = $('#gridList'),

		// data
		addList = {},
		viewList = {},
		emptyList = {},
		listIndex = {},
		sortedAddList = [],
		sortedViewList = [],
		sortedEmptyList = [],

		// active tags - tags currently used by items
		activeTags = {},

		// selected tags - tags currently selected
		selectedTags = [],

		// templates
		addListTemplate = _.template($('#add-list-template').html()),
		viewListTemplate = _.template($('#view-list-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.createEventHandlers = function() {


	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderViewLists
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.renderViewLists = function() {

		// reset sorted lists
		sortedViewList = [];
		sortedEmptyList = [];

		// generate sorted view list
		_.each(viewList, function(item, key) {
			sortedViewList.push(item);
		});
		// generate sorted empty list
		_.each(emptyList, function(item, key) {
			sortedEmptyList.push(item);
		});

		// sort lists
		sortedViewList.sort(sortListItemByName);

		// create template data structure
		var viewListTemplateData = {'orderedList': sortedViewList, 'emptyList': sortedEmptyList};

		// output template to list containers
		$viewList.find('ul').html(viewListTemplate(viewListTemplateData));
		$gridList.find('ul').html(viewListTemplate(viewListTemplateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderAddLists
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.renderAddLists = function() {

		// reset sorted lists
		sortedAddList = [];

		// generate sorted add list
		_.each(addList, function(item, key) {
			sortedAddList.push(item);
		});

		// sort lists
		sortedAddList.sort(sortListItemByName);

		// create template data structure
		var addListTemplateData = {'orderedList': sortedAddList};

		// output template to list containers
		$addList.html(addListTemplate(addListTemplateData));

		// reselected currently selected tags
		if (selectedTags.length !== 0) {
			reselectTags();

			$addList.trigger('change');
		}

		// send event to update chzn dropdown
		$addList.trigger('liszt:updated');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getListName -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.getListName = function(tagID) {

		return listIndex[tagID];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.getTags = function(onSuccess, onFail) {

		var ajax = null;

		// empty list data
		viewList = {};
		addList = {};

		ajax = TagData.getTags(onSuccess, onFail);

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTags_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.getTags_result = function(data) {



		// populate active tags
		populateActiveTags();

		parseListResponse(data);

		// render lits
		List.renderViewLists();
		List.renderAddLists();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTag
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.addTag = function(listName) {

		// check if list name exists
		if (typeof addList[listName] === 'undefined') {

			TagData.addTag(listName, addTag_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateViewList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.updateViewList = function(tagIDsAdded, currentViewTagID) {

		var updated = false;

		// iterated added tag IDS
		for (var i = 0, len = tagIDsAdded.length; i < len; i++) {

			// check if added tagID is in activeTags
			if (typeof activeTags[tagIDsAdded[i]] === 'undefined') {

				// add tagID to activeTags
				activeTags[tagIDsAdded[i]] = true;

				// remove tag from empty list
				delete emptyList[listIndex[tagIDsAdded[i]]];

				// add to view lists object
				viewList[listIndex[tagIDsAdded[i]]] = {'id': tagIDsAdded[i], 'name': listIndex[tagIDsAdded[i]]};

				updated = true;
			}
		}

		if (updated) {

			// update view list
			List.renderViewLists();
		}

		return updated;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectAddListTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.selectAddListTag = function(tagID) {

		// get option node
		var $option = $addList.find('option[value="' + tagID + '"]');

		// select option
		$option.attr('selected', '');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetAddList - clear all addList selected attributes
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.resetAddList = function() {

		// reset tags
		$addList.find('option').each(function() {
			// remove selected attribute
			$(this).removeAttr('selected');
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectGridTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.selectGridTag = function(tagID) {

		// get option node
		var $listItem = $gridList.find('a[data-content="' + tagID + '"]');

		// set gridList name as listItem name
		$gridList.find('.viewName').text($listItem.text());
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* reselectTags -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var reselectTags = function() {

		for (var i = 0, len = selectedTags.length; i < len; i++) {

			// get option node
			var $option = $addList.find('option[value="' + selectedTags[i] + '"]');

			// select option
			$option.attr('selected', '');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* populateActiveTags -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var populateActiveTags = function() {

		var itemDataDirectory = ItemData.getItemDirectory();

		// reset activeTags
		activeTags = {};

		// iterate items in itemDirectory
		_.each(itemDataDirectory, function(item, key) {

			// iterate tags
			_.each(item.tags, function(id, tag) {

				// if tag not in activeTags: add it
				if (typeof activeTags[tag] === 'undefined') {
					activeTags[tag] = true;
				}
			});
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseListResponse = function(tagData) {

		// reset list tagData
		viewList = {};
		addList = {};
		emptyList = {};
		listIndex = {};

		// temp list tagData
		var listItem = {};

		// iterate tagData
		for (var i = 0, len = tagData.length; i < len; i++) {

			listItem = {};

			// get attributes
			listItem.name = tagData[i].listName.toLowerCase();
			listItem.id = tagData[i].listID;

			// check if listID is in activeTags before adding to view list
			if (typeof activeTags[listItem.id] !== 'undefined') {

				// add to view lists object
				viewList[listItem.name] = listItem;

			} else {
				emptyList[listItem.name] = listItem;
			}

			// add all to add list objects
			addList[listItem.name] = listItem;
			listIndex[listItem.id] = listItem.name;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTag_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addTag_result = function(response) {

		var listItem = {name: response.listName.toLowerCase(), id: response.listID};

		// update addList and listIndex
		addList[listItem.name] = listItem;
		emptyList[listItem.name] = listItem;
		listIndex[listItem.id] = listItem.name;

		// save currently selected tags
		selectedTags = $addList.val() || [];

		// add new tag to selectedTags
		selectedTags.push(listItem.id);

		List.renderAddLists();
		List.renderViewLists();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortListItemByName
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortListItemByName = function(a, b) {

		var name_a = a.name;
		var name_b = b.name;

		return name_a.toLowerCase().localeCompare(name_b.toLowerCase());
	};

})(tmz.module('tagView'), tmz, jQuery, _);
