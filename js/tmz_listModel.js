
// LIST MODEL
(function(List) {

	// dependecies
	var User = tmz.module('user');
	var ListData = tmz.module('listData');
	var ItemData = tmz.module('itemData');

	// node cache
	var $addList = $('#addList');
	var $viewList = $('#viewList');
	var $gridList = $('#gridList');

	// data
	var addList = {};
	var viewList = {};
	var emptyList = {};
	var listIndex = {};
	var sortedAddList = [];
	var sortedViewList = [];

	// active tags - tags currently used by items
	var activeTags = {};

	// templates
	var listTemplate = _.template($('#tag-results-template').html());

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

		// set properties
		viewListTemplateData.viewList = true;

		// output template to list containers
		$viewList.html(listTemplate(viewListTemplateData));
		$gridList.html(listTemplate(viewListTemplateData));

		// send event to update chzn dropdown
		$viewList.trigger("liszt:updated");
		$gridList.trigger("liszt:updated");
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

		// set properties
		addListTemplateData.viewList = false;

		// output template to list containers
		$addList.html(listTemplate(addListTemplateData));

		// send event to update chzn dropdown
		$addList.trigger("liszt:updated");
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.getList = function() {

		// empty list data
		viewList = {};
		addList = {};

		ListData.getList(function(data) {

			// populate active tags
			populateActiveTags();

			parseListResponse(data);

			// render lits
			List.renderViewLists();
			List.renderAddLists();

		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.addList = function(listName) {

		console.info(listName);
		// check if list name exists
		if (typeof addList[listName] === 'undefined') {

			ListData.addList(listName, parseAddListResponse);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateViewList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.updateViewList = function(tagIDsAdded, currentViewTagID) {

		console.info('update view list');

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
				console.info('update list', viewList[listIndex[tagIDsAdded[i]]]);
				updated = true;
			}
		}

		if (updated) {

			// update view list
			List.renderViewLists();

			// after render of view list - reselect currently viewing tag
			List.selectViewTag(currentViewTagID);
		}

		return updated;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectViewTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.selectViewTag = function(tagID) {

		// get option node
		option = $viewList.find('option[value="' + tagID + '"]');

		// select option
		$(option).attr('selected', '');

		$viewList.trigger("liszt:updated");
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectGridTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.selectGridTag = function(tagID) {

		// get option node
		option = $gridList.find('option[value="' + tagID + '"]');

		// select option
		$(option).attr('selected', '');

		$gridList.trigger("liszt:updated");
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
	var parseListResponse = function(data) {

		// reset list data
		viewList = {};
		addList = {};
		emptyList = {};
		listIndex = {};

		// temp list data
		var listItem = {};

		// iterate data
		for (var i = 0, len = data.list.length; i < len; i++) {

			listItem = {};

			// get attributes
			listItem.name = data.list[i].listName.toLowerCase();
			listItem.id = data.list[i].listID;

			// check if listID is in activeTags before adding to view list data
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
	* parseAddListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAddListResponse = function(response) {

		var listItem = {name: response.listName.toLowerCase(), id: response.listID};

		// update addList and listIndex
		addList[listItem.name] = listItem;
		emptyList[listItem.name] = listItem;
		listIndex[listItem.id] = listItem.name;

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

})(tmz.module('list'));
