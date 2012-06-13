/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* TAG VIEW - controls tag presentation (View and Add tag lists) and manages tag data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function(TagView, tmz, $, _) {
    "use strict";

    // dependecies
    var User = tmz.module('user'),
        TagData = tmz.module('tagData'),
        ItemData = tmz.module('itemData'),
        ItemCache = tmz.module('itemCache'),

        // node cache
        $addListContainer = $('#addListContainer'),
        $addList = $('#addList'),
        $viewList = $('#viewList'),
        $gridList = $('#gridList'),

        // all tags
        activeAddTags = {},

        // view tags - split into two categories: active and empty
        activeViewTags = {},
        emptyViewTags = {},

        // reference data: tag name by tagID
        tagIndex = {},
        
        // reference data: holds tags with assigned items
        activeTags = {},

        // current selected tags, key = tagID, value = true
        currentItemTags = {},

        // state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
        initialItemTags = {},

        // tags set by user for adding new items to list
        userSetTags = {},

        // templates
        viewListTemplate = _.template($('#view-list-template').html());

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

        // addList: change
        $addList.change(function(e) {

            // get last tag
            var tags = $addList.val().split(',');
            var lastTag = tags[tags.length - 1];

            // create new tag if not empty string
            if (lastTag !== '') {
                addTag(lastTag);
            }
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getInitialItemTags -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getInitialItemTags = function() {
       return initialItemTags;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderViewLists - render tag view in Item View panel
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderViewLists = function() {

        // reset sorted lists
        var sortedViewTags = [];
        var sortedEmptyTags = [];

        // generate sorted view tag
        _.each(activeViewTags, function(item, key) {
            sortedViewTags.push(item);
        });
        // generate sorted empty tag
        _.each(emptyViewTags, function(item, key) {
            sortedEmptyTags.push(item);
        });

        // sort lists
        sortedViewTags.sort(sortListItemByName);

        // create template data structure
        var viewListTemplateData = {'orderedList': sortedViewTags, 'emptyList': sortedEmptyTags};

        // output template to tag containers
        $viewList.find('ul').html(viewListTemplate(viewListTemplateData));
        $gridList.find('ul').html(viewListTemplate(viewListTemplateData));
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderAddLists - render select2 dropdown tag select for adding and saving items to tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderAddLists = function() {

        // reset sorted lists
        var sortedAddTag = [];
        var addListTags = [];

        // generate sorted add tag
        _.each(activeAddTags, function(item, key) {
            sortedAddTag.push(item);
            addListTags.push(item.name);
        });

        // sort lists
        sortedAddTag.sort(sortListItemByName);

        // render addList
        $addList.select2({
            tags:addListTags,
            placeholder: "Type a tag name",
            allowClear: true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetTagData - reset all tag data
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetTagData = function() {
        
        activeAddTags = {};
        activeViewTags = {};

        emptyViewTags = {};
        tagIndex = {};
        
        activeTags = {};
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagName - get tag name from tagID
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagName = function(tagID) {

        return tagIndex[tagID];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags - download new tag data over network or from cache
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags = function(onSuccess, onFail) {

        var ajax = null;

        // empty tag data
        activeViewTags = {};
        activeAddTags = {};

        ajax = TagData.getTags(onSuccess, onFail);

        return ajax;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags_result - parse tag data response - used in defered so is made public
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags_result = function(data) {

        resetTagData();

        // find active tags
        populateActiveTags();

        // parse response and create local data
        parseGetTagsResponse(data);

        // render lists
        renderViewLists();
        renderAddLists();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * addTag - create new tag
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var addTag = function(tagName) {

        // check if tag name exists
        if (typeof activeAddTags[tagName] === 'undefined') {

            // create new tag
            TagData.addTag(tagName, addTag_result);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * addTag_result - process addTag response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var addTag_result = function(newTag) {

        var tagItem = {name: newTag.tagName.toLowerCase(), id: newTag.tagID};

        // add tag to all tags data
        activeAddTags[tagItem.name] = tagItem;
        // tag is empty by default
        emptyViewTags[tagItem.name] = tagItem;
        // set tagID/name reference
        tagIndex[tagItem.id] = tagItem.name;

        // update view tag list
        renderViewLists();
        renderAddLists();

        // reselect input field since after init .select2 field focus is lost
        $addListContainer.find('.select2-search-field input').focus();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * deleteTag - delete tag by tagID
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var deleteTag = function(tagID, onSuccess) {
        
        // get all items by tagID
        var tagItems = ItemCache.getCachedItemsByTag(tagID);

        // each item in tag: delete client item and tag from directory
        _.each(tagItems, function(item, key) {
            ItemData.deleteClientItem(tagID, item.itemID);
            ItemData.deleteTagFromDirectory(item.itemID, tagID);
        });

        // remove tag from addList tags
        removeTagFromAddList(tagID);

        // delete cached tag
        ItemCache.deleteCachedTag(tagID);

        // delete tag data
        TagData.deleteTag(tagID);

        // update tag
        getTags(function(data) {
            getTags_result(data);
        });

        onSuccess();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * removeTagFromAddList - remove tagID from addList select2 list
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var removeTagFromAddList = function(tagID) {
        
        // remove tag from initialItemTags
        delete initialItemTags[tagID];

        // reselect form new initialItemTags
        TagView.selectAddListTags(initialItemTags);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getSelectedTagIDs - get tagIDs as array for each selected tag in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getSelectedTagIDs = function() {

        // get tag name array
        var currentTagString = $addList.val();
        var tagIDs = [];

        if (currentTagString !== '') {

            // get id for each tag name
            _.each(currentTagString.split(','), function(tag) {

                if (!_.isUndefined(activeAddTags[tag])) {
                    tagIDs.push(activeAddTags[tag].id);
                } else {
                    tagIDs.push(tag);
                }

            });
        }
        return tagIDs;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateViewList -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateViewList = function(tagIDsAdded, currentViewTagID) {

        var updated = false;

        // iterated added tag IDS
        for (var i = 0, len = tagIDsAdded.length; i < len; i++) {

            // check if added tagID is in activeTags
            if (typeof activeTags[tagIDsAdded[i]] === 'undefined') {

                // add tagID to activeTags
                activeTags[tagIDsAdded[i]] = true;

                // remove tag from empty tag
                delete emptyViewTags[tagIndex[tagIDsAdded[i]]];

                // add to view lists object
                activeViewTags[tagIndex[tagIDsAdded[i]]] = {'id': tagIDsAdded[i], 'name': tagIndex[tagIDsAdded[i]]};

                updated = true;
            }
        }

        if (updated) {
            // update view tag
            renderViewLists();
        }

        return updated;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectTagsFromDirectory - set tags in tagList as selected in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectTagsFromDirectory = function(tagList) {

        // reset initial tags, set initial provider
        initialItemTags = {};

        var option = null;

        // populate intialItemTags
        _.each(tagList, function(id, tagID) {

            // create associate of tags with item ids
            initialItemTags[tagID] = 1;
        });

        // select initial tags
        TagView.selectAddListTags(tagList);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectUserTags -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectUserTags = function() {
    
        selectAddListTags(userSetTags);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectAddListTags - select tags specified in select2 list
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectAddListTags = function(tagList) {

        var newTags = [];

        // iterate tagList
        _.each(tagList, function(id, tagID) {
            // get tagName
            var tagName = getTagName(tagID);
            newTags.push(tagName);
        });

        $addList.val(newTags).trigger({
            type: 'change',
            reset: false
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetAddList - clear addList select2 tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetAddList = function() {

        // reset initial/current item tags
        initialItemTags = {};
        currentItemTags = {};
        userSetTags = {};

        $addList.val(['']).trigger({
            type:'change',
            reset:true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectGridTag -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectGridTag = function(tagID) {

        // get option node
        var $listItem = $gridList.find('a[data-content="' + tagID + '"]');

        // set gridList name as listItem name
        $gridList.find('.viewName').text($listItem.text());
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagCount - return number of tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagCount = function() {
    
        var tagCount = 0;
        _.each(activeAddTags, function(tag) {
            tagCount++;
        });
    
        return tagCount;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * populateActiveTags - populate activeTags with tags which have items assigned
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
    * parseGetTagsResponse - populate local tag data from getTags response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var parseGetTagsResponse = function(tagData) {

        // temp tag tagData
        var tagItem = {};

        // iterate tagData
        for (var i = 0, len = tagData.length; i < len; i++) {

            tagItem = {};

            // get attributes
            tagItem.name = tagData[i].tagName.toLowerCase();
            tagItem.id = tagData[i].tagID;

            // check if tagID is in activeTags before adding to view tag
            if (typeof activeTags[tagItem.id] !== 'undefined') {

                // add to view lists object
                activeViewTags[tagItem.name] = tagItem;

            } else {
                emptyViewTags[tagItem.name] = tagItem;
            }

            // add all to add tag objects
            activeAddTags[tagItem.name] = tagItem;
            tagIndex[tagItem.id] = tagItem.name;
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * sortListItemByName
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var sortListItemByName = function(a, b) {

        var name_a = a.name;
        var name_b = b.name;

        return name_a.toLowerCase().localeCompare(name_b.toLowerCase());
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * isAddListChanged -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var isAddListChanged = function() {

        var userTags = {};
        var addListChanged = false;
        var currentTags = TagView.getSelectedTagIDs();

        // iterate currentTags
        _.each(currentTags, function(item) {

            userTags[item] = true;

            // match with initial tags
            if (typeof initialItemTags[item] === 'undefined') {
                addListChanged = true;
            }
        });

        // iterate initialItemTags
        _.each(initialItemTags, function(item, key) {

            // match with user userSetTags
            if (typeof userTags[key] === 'undefined') {
                addListChanged = true;
            }
        });

        return addListChanged;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToAdd -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToAdd = function() {
    
        // reset currentItem Tags
        currentItemTags = {};

        var tagsToAdd = [];
        var currentTags = getSelectedTagIDs();
        var tagID = '';

        // iterate current tags - find tags to add
        for (var i = 0, len = currentTags.length; i < len; i++) {

            tagID = currentTags[i];
            // save current tag into currentItemTags object for quick reference by loop to find tags to delete
            currentItemTags[tagID] = true;

            // current tags NOT in initial
            if (!initialItemTags[tagID]) {

                // set new initial state with placeholder
                initialItemTags[tagID] = 1;

                // add to list for batch insert
                tagsToAdd.push(tagID);
            }
        }
    
        return tagsToAdd;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToDelete -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToDelete = function() {
    
        var idsToDelete = [];
        var tagsToDelete = [];

        $.each(initialItemTags, function(key, id){

            if (!currentItemTags[key]) {

                // remove tag from initial state
                delete initialItemTags[key];

                // add item/tag keys to lists for batch delete
                idsToDelete.push(id);
                tagsToDelete.push(key);
            }
        });
    
        return {'idsToDelete': idsToDelete, 'tagsToDelete': tagsToDelete};
    };
    
    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * populateUserTags -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var populateUserTags = function() {

        var tagIDs = TagView.getSelectedTagIDs();
        userSetTags = {};

        // create object use tagID as key
        _.each(tagIDs, function(tagID) {
            userSetTags[tagID] = '';
        });
    };
    

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'init': init,
        'getInitialItemTags': getInitialItemTags,
        'renderViewLists': renderViewLists,
        'renderAddLists': renderAddLists,
        'resetTagData': resetTagData,
        'getTagName': getTagName,
        'getTags': getTags,
        'getTags_result': getTags_result,
        'addTag': addTag,
        'deleteTag': deleteTag,
        'removeTagFromAddList': removeTagFromAddList,
        'getSelectedTagIDs': getSelectedTagIDs,
        'updateViewList': updateViewList,
        'selectTagsFromDirectory': selectTagsFromDirectory,
        'selectUserTags': selectUserTags,
        'selectAddListTags': selectAddListTags,
        'resetAddList': resetAddList,
        'selectGridTag': selectGridTag,
        'getTagCount': getTagCount,
        'isAddListChanged': isAddListChanged,
        'getTagsToAdd': getTagsToAdd,
        'getTagsToDelete': getTagsToDelete,
        'populateUserTags': populateUserTags
    };

    $.extend(TagView, publicMethods);


})(tmz.module('tagView'), tmz, jQuery, _);
