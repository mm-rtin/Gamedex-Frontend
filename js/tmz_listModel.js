
// LIST MODEL
(function(List) {

	// dependecies
	var User = tmz.module('user');
	var ListData = tmz.module('listData');

	// node cache
	var addListNode = $('#addList');
	var viewListNode = $('#viewList');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* BACKBONE: List Model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	List.ListModel = Backbone.Model.extend({

		defaults: {
            list: {},
            orderedList: []
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

		viewListElement: viewListNode,
		addListElement: addListNode,

		template: _.template($('#list-results-template').html()),

        initialize: function() {

            // orderedList: changed
            this.model.bind('change:orderedList', this.render, this);
        },

		render: function() {

			// sort list
			this.model.get('orderedList').sort(sortListItemByName);

			var viewListModel = this.model.toJSON();
			viewListModel.showDynamic = true;

			var addListModel = this.model.toJSON();
			addListModel.showDynamic = false;

			// output template to list containers
			$(this.viewListElement).html(this.template(viewListModel));
			$(this.addListElement).html(this.template(addListModel));

			// send event to update chzn dropdown
			$(this.viewListElement).trigger("liszt:updated");
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

		// fetch list - submit user key data via POST
		list.fetch({data: User.getUserData(), type: 'POST'});

		// clear items - if not cleared some cases result in items not updating
		list.set({'list': {}});
		list.set({'orderedList': []});
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
		var tempList = {};
		var tempOrderedList = [];

		var listLength = 0;
		var listItem = {};
		var i = 0;

		// iterate response
		listLength = response.list.length;

		for (i; i < listLength; i++) {

			listItem = {};

			// get attributes
			listItem.name = response.list[i].listName.toLowerCase();
			listItem.id = response.list[i].listID;

			// add to lists objects
			tempList[listItem.name] = listItem;
			tempOrderedList.push(listItem);
		}

		// set list model data
		list.set({'list': tempList});
		list.set({'orderedList': tempOrderedList});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAddListResponse
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAddListResponse = function(response) {

		// get current list data
		var tempList = list.get('list');
		var tempOrderedList = list.get('orderedList');

		var listItem = {name: response.listName.toLowerCase(), id: response.listID};

		tempList[listItem.name] = listItem;
		tempOrderedList.push(listItem);

		// set list model data
		list.set({'list': tempList});
		list.set({'orderedList': tempOrderedList});

		// trigger change manually since updating objects internally does not trigger update
		list.trigger("change:orderedList");
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
