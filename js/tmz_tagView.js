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

        // state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
        initialItemTags = {},

        // tags set by user for adding new items to list
        userSetTags = [],

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
    * getTags - download new tag data over network or from cache
    * @return json
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags = function(onSuccess, onFail) {

        // reset tag data
        _resetTagData();

        return TagData.getTags(onSuccess, onFail);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags_result - parse tag data response - used in defered so is made public
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags_result = function(data) {

        // find active tags
        _populateActiveTags();

        // parse response and create local data
        _parseGetTagsResponse(data);

        // render lists
        renderViewLists();
        _renderAddLists();
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
        sortedViewTags.sort(_sortListItemByName);

        // create template data structure
        var viewListTemplateData = {'orderedList': sortedViewTags, 'emptyList': sortedEmptyTags};

        // output template to tag containers
        $viewList.find('ul').html(viewListTemplate(viewListTemplateData));
        $gridList.find('ul').html(viewListTemplate(viewListTemplateData));
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagName - get tag name by tagID
    * @return string
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagName = function(tagID) {

        return tagIndex[tagID];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagCount - return number of tags
    * @return number
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagCount = function() {

        var tagCount = 0;
        _.each(activeAddTags, function(tag) {
            tagCount++;
        });

        return tagCount;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToAdd - added tags to addList
    * @return array
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToAdd = function() {

        var tagsToAdd = [];
        var currentTags = _getSelectedTagIDs();

        // iterate current tags - find tags to add
        _.each(currentTags, function(tagID) {

            // current tags NOT in initial
            if (!_.has(initialItemTags, tagID)) {

                // add placeholder for initialItemTags - allows for instant save button update
                initialItemTags[tagID] = 'placeholder';

                // add to list for batch insert
                tagsToAdd.push(tagID);
            }
        });

        return tagsToAdd;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToDelete - deleted tags from addList
    * @return object - contains tagID and link IDs as arrays
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToDelete = function() {

        var idsToDelete = [];
        var tagsToDelete = [];
        var currentTags = _getSelectedTagIDs();

        // iterate initialItemTags
        _.each(initialItemTags, function(id, tagID) {

            // if initial tagID not found in currentTags array, it has been deleted
            if (_.indexOf(currentTags, tagID) === -1) {

                // remove tag from initial state
                delete initialItemTags[tagID];

                // add item/tag tagIDs to lists for batch delete
                tagsToDelete.push(tagID);
                idsToDelete.push(id);
            }
        });

        // return object of tagIDs and ids
        return {'idsToDelete': idsToDelete, 'tagsToDelete': tagsToDelete};
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateInitialItemTags - update initialItemTags with added tag data
    * @param tagIDsAdded - array
    * @param idsAdded - array
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateInitialItemTags = function(tagIDsAdded, idsAdded) {

        // update initial tags with ids
        for (var i = 0, len = idsAdded.length; i < len; i++) {

            // add tag to initialItemTags
            initialItemTags[tagIDsAdded[i]] = idsAdded[i];
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * addTag - create new tag
    * @param tagName - string
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var addTag = function(tagName, onSuccess) {

        // check if tag name exists
        if (!_.has(activeAddTags, tagName)) {

            // create new tag
            TagData.addTag(tagName, function(tag) {

                _addTag_result(tag);

                if (onSuccess) {
                    onSuccess(tag);
                }
            });

        // tag exists > return tag data immediately
        } else {

            if (onSuccess) {
                // rename object properties to match what TagData returns
                var tag = {'tagID': activeAddTags[tagName].id, 'tagName': activeAddTags[tagName].name};
                onSuccess(tag);
            }
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * deleteTag - delete tag by tagID
    * @param tagID - string - tag to delete
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

        // get new tag data
        getTags(function(data) {
            getTags_result(data);
        });

        onSuccess();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * removeTagFromAddList - remove tagID from select2 list
    * @param tagID - string - tag to remove
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var removeTagFromAddList = function(tagID) {

        // remove tag from initialItemTags
        delete initialItemTags[tagID];

        // reselect form new initialItemTags
        _selectAddListTags(initialItemTags);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectTagsFromDirectory - set tags in tagList as selected in addList
    * @param tagList - object of tagID/id
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectTagsFromDirectory = function(tagList) {

        // reset initial tags, set initial provider
        initialItemTags = {};

        var option = null;

        // populate intialItemTags
        _.each(tagList, function(id, tagID) {

            // create associate of tags with item ids
            initialItemTags[tagID] = id;
        });

        // select initial tags
        _selectAddListTags(tagList);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateUserTags - set new user tags - tags set by user for adding NEW items
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateUserTags = function() {
        userSetTags = $addList.val().split(',');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectUserTags - set tags in userSetTags as selected in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectUserTags = function() {

        initialItemTags = {};

        $addList.val(userSetTags).trigger({
            type: 'change',
            reset: false
        });
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

        // update view tag
        if (updated) {
            renderViewLists();
        }

        return updated;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetAddList - clear addList select2 tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetAddList = function() {

        // reset initial/current item tags
        initialItemTags = {};
        userSetTags = [];

        $addList.val(['']).trigger({
            type:'change',
            reset:true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * isAddListChanged -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var isAddListChanged = function() {

        var addListChanged = false;
        var currentTags = _getSelectedTagIDs();

        // tags added
        _.each(currentTags, function(tagID) {

            // match with initial tags
            if (!_.has(initialItemTags, tagID)) {
                addListChanged = true;
            }
        });

        // tags deleted
        _.each(initialItemTags, function(id, tagID) {

            // match with user currentTags
            if (_.indexOf(currentTags, tagID) === -1) {
                addListChanged = true;
            }
        });

        return addListChanged;
    };



    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PRIVATE METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _renderAddLists - render select2 dropdown tag select for adding and saving items to tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _renderAddLists = function() {

        // reset sorted lists
        var sortedAddTag = [];
        var addListTags = [];

        // generate sorted add tag
        _.each(activeAddTags, function(tag, key) {
            sortedAddTag.push(tag);
            addListTags.push(tag.name);
        });

        // sort lists
        sortedAddTag.sort(_sortListItemByName);

        // render addList
        $addList.select2({
            tags:addListTags,
            placeholder: "Type a tag name",
            allowClear: true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _resetTagData - reset all tag data
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _resetTagData = function() {

        activeAddTags = {};
        activeViewTags = {};
        emptyViewTags = {};
        tagIndex = {};
        activeTags = {};
        initialItemTags = {};
        userSetTags = [];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _addTag_result - process addTag response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _addTag_result = function(newTag) {

        var tagItem = {name: newTag.tagName.toLowerCase(), id: newTag.tagID};

        // add tag to all tags data
        activeAddTags[tagItem.name] = tagItem;
        // tag is empty by default
        emptyViewTags[tagItem.name] = tagItem;
        // set tagID/name reference
        tagIndex[tagItem.id] = tagItem.name;

        // update view tag list
        renderViewLists();
        _renderAddLists();

        // reselect input field since after init .select2 field focus is lost
        $addListContainer.find('.select2-search-field input').focus();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getSelectedTagIDs - get tagIDs as array for each selected tag in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getSelectedTagIDs = function() {

        // get tag name array
        var currentTagString = $addList.val();
        var tagIDs = [];

        if (currentTagString !== '') {

            // get id for each tag name
            _.each(currentTagString.split(','), function(tag) {

                if (_.has(activeAddTags, tag)) {
                    tagIDs.push(activeAddTags[tag].id);
                } else {
                    tagIDs.push(tag);
                }
            });
        }
        return tagIDs;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _selectAddListTags - select tags specified in select2 list
    * @param tagList - array - ids of tags to select
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _selectAddListTags = function(tagList) {

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
    * _populateActiveTags - populate activeTags with tags which have items assigned
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _populateActiveTags = function() {

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
    * _parseGetTagsResponse - populate local tag data from getTags response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _parseGetTagsResponse = function(tagData) {

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
    * _sortListItemByName
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _sortListItemByName = function(a, b) {

        var name_a = a.name;
        var name_b = b.name;

        return name_a.toLowerCase().localeCompare(name_b.toLowerCase());
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'init': init,
        'getTags': getTags,
        'getTags_result': getTags_result,
        'renderViewLists': renderViewLists,
        'getTagName': getTagName,
        'getTagCount': getTagCount,
        'getTagsToAdd': getTagsToAdd,
        'getTagsToDelete': getTagsToDelete,
        'updateInitialItemTags': updateInitialItemTags,
        'addTag': addTag,
        'deleteTag': deleteTag,
        'removeTagFromAddList': removeTagFromAddList,
        'selectTagsFromDirectory': selectTagsFromDirectory,
        'updateUserTags': updateUserTags,
        'selectUserTags': selectUserTags,
        'updateViewList': updateViewList,
        'resetAddList': resetAddList,
        'isAddListChanged': isAddListChanged
    };

    $.extend(TagView, publicMethods);


})(tmz.module('tagView'), tmz, jQuery, _);
