
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
	var sortedAddList = [];
	var sortedViewList = [];

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

		// generate sorted view list
		_.each(viewList, function(item, key) {
			sortedViewList.push(item);
		});

		// sort lists
		sortedViewList.sort(sortListItemByName);

		// create template data structure
		var viewListTemplateData = {'orderedList': sortedViewList};

		// set properties
		viewListTemplateData.showDynamic = true;

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
		addListTemplateData.showDynamic = false;

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
	List.updateViewList = function(tagIDsAdded) {

		// get active tags from ItemData
		var activeTags = ItemData.getActiveTags();
		var updated = false;

		// iterate response
		_.each(addList, function(listItem, key) {

			// iterate added tags
			for (var i = 0, len = tagIDsAdded.length; i < len; i++) {

				// check if listID is in activeTags or show in tagIDsAdded array
				if (listItem.id === tagIDsAdded[i]) {

					console.info('update list', listItem);
					// add to view lists object
					viewList[listItem.name] = listItem;
					updated = true;
				}
			}
		});

		if (updated) {
			List.renderViewLists();
		}
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseListResponse = function(data) {

		// reset list data
		viewList = {};
		addList = {};

		// temp list data
		var listItem = {};

		// get active tags from ItemData
		var activeTags = ItemData.getActiveTags();

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
			}

			// add all to add list objects
			addList[listItem.name] = listItem;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAddListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAddListResponse = function(response) {

		var listItem = {name: response.listName.toLowerCase(), id: response.listID};

		addList[listItem.name] = listItem;

		List.renderAddLists();
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
