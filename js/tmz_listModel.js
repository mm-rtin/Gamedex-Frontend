
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
	var sortedAddList = [];
	var sortedViewList = [];

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: List Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.ListModel = Backbone.Model.extend({

		defaults: {
            list: {},
            viewList: {}
        },

        initialize: function() {

        },

        // override parse method
		parse : function(response) {
			parseListResponse(response);
		},

        // get list
		url: function () {
			return tmz.api + 'list/';
		}

	});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: List View
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.ListView = Backbone.View.extend({

		viewListElement: $viewList,
		addListElement: $addList,
		gridListElement: $gridList,

		template: _.template($('#tag-results-template').html()),

        initialize: function() {

            // orderedList: changed
            this.model.bind('change:list', this.render, this);
        },

		render: function() {

			// reset sorted lists
			sortedAddList = [];
			sortedViewList = [];

			// generate sorted add list
			_.each(this.model.get('list'), function(item, key) {
				sortedAddList.push(item);
			});
			// generate sorted view list
			_.each(this.model.get('viewList'), function(item, key) {
				sortedViewList.push(item);
			});

			// sort lists
			sortedViewList.sort(sortListItemByName);
			sortedAddList.sort(sortListItemByName);



			// create template data structure
			var addListTemplateData = {'orderedList': sortedAddList};
			var viewListTemplateData = {'orderedList': sortedViewList};

			// set properties
			addListTemplateData.showDynamic = false;
			viewListTemplateData.showDynamic = true;

			// output template to list containers
			$(this.viewListElement).html(this.template(viewListTemplateData));
			$(this.gridListElement).html(this.template(viewListTemplateData));
			$(this.addListElement).html(this.template(addListTemplateData));

			// send event to update chzn dropdown
			$(this.viewListElement).trigger("liszt:updated");
			$(this.gridListElement).trigger("liszt:updated");
			$(this.addListElement).trigger("liszt:updated");

			return this;
		}
	});

	// backbone list model
	var list = new List.ListModel();
    // backbone view
    var listView = new List.ListView({model: list});

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.createEventHandlers = function(keywords) {


	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.getList = function() {

		var userData = User.getUserData();

		var requestData = {
			user_id: userData.user_id,
			uk: userData.secret_key
		};

		// fetch list - submit user key data via POST
		list.fetch({data: requestData, type: 'POST'});

		// clear items - if not cleared some cases result in items not updating
		list.set({'list': {}});
		list.set({'viewList': {}});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addList
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.addList = function(listName) {

		// check if list name exists
		if (!list.get('list')[listName]) {

			ListData.addList(listName, parseAddListResponse);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseListResponse = function(response) {

		// temp list data
		var tempAddList = {};
		var tempViewList = {};
		var listItem = {};

		// get active tags from ItemData
		var activeTags = ItemData.getActiveTags();

		// iterate response
		for (var i = 0, len = response.list.length; i < len; i++) {

			listItem = {};

			// get attributes
			listItem.name = response.list[i].listName.toLowerCase();
			listItem.id = response.list[i].listID;

			// check if listID is in activeTags before adding to view list data
			if (typeof activeTags[listItem.id] !== 'undefined') {

				// add to view lists object
				tempViewList[listItem.name] = listItem;
			}

			// add all to add list objects
			tempAddList[listItem.name] = listItem;
		}

		// set list model data
		list.set({'viewList': tempViewList});
		list.set({'list': tempAddList});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAddListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAddListResponse = function(response) {

		// get current list data
		var tempList = list.get('list');

		var listItem = {name: response.listName.toLowerCase(), id: response.listID};

		tempList[listItem.name] = listItem;

		// set list model data
		list.set({'list': tempList});

		// trigger change manually since updating objects internally does not trigger update
		list.trigger("change:list");
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
