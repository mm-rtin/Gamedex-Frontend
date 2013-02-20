// VideoPanel
(function(VideoPanel, _V_, gamedex, $, _, moment, ListJS) {
    "use strict";

    // module references
    var GiantBomb = gamedex.module('giantbomb');

    // constants
    var GIANT_BOMB_VIDEO_PATH = 'http://media.giantbomb.com/video/',
        VIDEO_PLAYER_ID = 'videoPlayer',
        VIDEO_SET_HEIGHT = 89,
        VIDEOS_PER_SET = 5,

        // properties
        initialLoad = false,
        currentVideoSet = 0,
        currentMaxVideoSet = null,
        totalVideoCount = 0,
        loadedVideoDetailCount = 0,
        currentVideoIndex = 0,
        previousVideoIndex = 0,

        // list
        videoList = null,
        listOptions = {
            valueNames: ['publishDate']
        },

        // data
        currentVideos = [],     // current item videos to load

        // objects
        videoJSPLayer = null,

        // jquery cache
        $videoModal = $('#video-modal'),
        $videoListContainer = $('#videoListContainer'),
        $videoList = $('#videoList'),
        $videoPlayer = $('#videoPlayer'),
        $videoModalTitle = $('#videoModalTitle'),
        $videoListNavigation = $('#videoListNavigation'),
        $navigateLeft = $videoListNavigation.find('.navigateLeft'),
        $navigateRight = $videoListNavigation.find('.navigateRight'),
        $pageNumberText = $videoListNavigation.find('.pageNumber'),

        // templates
        videoResultsTemplate = _.template($('#video-results-template').html());

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * init
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.init = function() {

        // init video js
        videoJSPLayer = _V_(VIDEO_PLAYER_ID);

        // create event handlers
        VideoPanel.createEventHandlers();

        // show video modal
        $videoModal.modal({backdrop: true, show: false});
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.createEventHandlers = function() {

        // videoList li: click
        $videoList.on('click', 'li', function(e) {
            e.preventDefault();

            var id = $(this).attr('data-id');
            changeVideoSource(Number(id));

            playCurrentVideo();
        });

        // navigateLeft: click
        $navigateLeft.click(function(e) {
            previousVideoSet();
        });
        // navigateRight: click
        $navigateRight.click(function(e) {
            nextVideoSet();
        });

        // videoModal: hidden
        $videoModal.on('hidden', function () {
            pauseCurrentVideo();
        });

        // video js: video ended
        videoJSPLayer.addEvent("ended", playNextVideo);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showVideoPanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.showVideoPanel = function() {

        // load first video detail
        loadVideoDetail(currentVideos[0], function(videoObj) {

            if (initialLoad) {
                initialLoad = false;

                // add video to set
                videoDetailLoaded(videoObj);

                // update video source
                changeVideoSource(0);

                // load remaining video detail
                loadVideoDetails();
            }

            playCurrentVideo();
        });

        // show video modal
        $videoModal.modal('show');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initializeVideoPanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.initializeVideoPanel = function(giantbombVideos, itemName) {

        // reset max, videoIndex and initialLoad
        initialLoad = true;
        currentMaxVideoSet = 1;
        currentVideoIndex = 0;
        currentVideoSet = 0;
        loadedVideoDetailCount = 0;
        totalVideoCount = giantbombVideos.length;

        // set video game name
        $videoModalTitle.text(itemName);

        // copy video data
        currentVideos = $.extend(true, [], giantbombVideos);

        // clear videoList
        $videoList.empty();

        // reset video set
        changeVideoSet(0);
        hideVideoListNavigation();

        // add index property to currentVideos
        _.each(currentVideos, function(video, index) {
            video.index = index;
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * loadVideoDetails -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var loadVideoDetails = function() {

        // for each video get video detail
        _.each(currentVideos, function(video) {

            loadVideoDetail(video, videoDetailLoaded);
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * loadVideoDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var loadVideoDetail = function(video, onSuccess) {

        // get video detail
        GiantBomb.getGiantBombVideo(video.id, function(data) {

            // update video object with new detail information
            $.extend(true, video, data);

            onSuccess(video);
        });
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * videoDetailLoaded -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var videoDetailLoaded = function(video) {

        if (!_.has(video, 'attached')) {

            // increment loaded video count
            loadedVideoDetailCount++;

            // format data
            formatVideoData(video);

            // render video item
            var templateData = {'video': video};
            $videoList.append(videoResultsTemplate(templateData));

            // add attached property
            video.attached = true;

            var $videoItem = $videoList.find('#video_' + video.id);

            // fade in videoItem
            _.delay(function() {
                $videoItem.addClass('showFade');

                // sort
                videoList = new ListJS('videoListContainer', listOptions);
                videoList.sort('publishDate', { asc: true });
            }, 200);


            // init popover
            $videoList.find('a').popover({'trigger': 'hover', 'placement': 'top', 'animation': true});

            // update video set
            changeVideoSet(currentVideoSet);

            if (loadedVideoDetailCount > VIDEOS_PER_SET) {
                showVideoListNavigation();
            }

        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * formatVideoData -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var formatVideoData = function(video) {

        // format publish date
        video.publishDate = moment(video.publish_date, "YYYY-MM-DD").calendar();
        delete video.publish_date;

        // format video length
        var minutes = Math.floor(video.length_seconds / 60);
        var seconds = (video.length_seconds % 60).toString();
        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }
        delete video.length_seconds;


        video.runningTime = minutes + ':' + seconds;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * playNextVideo -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var playNextVideo = function() {

        if (currentVideoIndex === loadedVideoDetailCount - 1) {
            currentVideoIndex = 0;
        } else {
            currentVideoIndex++;
        }

        // play next
        changeVideoSource(currentVideoIndex);

        // change video set
        if (currentVideoIndex % VIDEOS_PER_SET === 0) {

            var set = Math.floor(currentVideoIndex / VIDEOS_PER_SET);
            changeVideoSet(set);
        }

        playCurrentVideo();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * changeVideoSource -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var changeVideoSource = function(index) {

        currentVideoIndex = index;

        // get video url
        var url = currentVideos[index].url;

        // add 'playing' class to videoList item
        var $currentVideoItem = $videoList.find('li[data-id="' + index + '"]');
        var $previousVideoItem = $videoList.find('li[data-id="' + previousVideoIndex + '"]');
        $previousVideoItem.removeClass('playing');
        $currentVideoItem.addClass('playing');

        // update videoPlayer source
        var videoURLParts = url.split('.');
        var videoURL = GIANT_BOMB_VIDEO_PATH + videoURLParts[0] + '_3500.' + videoURLParts[1];
        videoJSPLayer.src(videoURL);

        previousVideoIndex = index;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * playCurrentVideo -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var playCurrentVideo = function() {

        videoJSPLayer.play();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * pauseCurrentVideo -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var pauseCurrentVideo = function() {

        videoJSPLayer.pause();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * hideVideoListNavigation -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var hideVideoListNavigation = function() {
        $videoListNavigation.removeClass('show');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showVideoListNavigation -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showVideoListNavigation = function() {
        $videoListNavigation.addClass('show');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * previousVideoSet -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var previousVideoSet = function() {

        // get set height
        var maxVideoSet = getMaxVideoSet();

        if (currentVideoSet > 0) {
            changeVideoSet(--currentVideoSet);
        // reached min > loop to max
        } else {
            changeVideoSet(maxVideoSet);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * nextVideoSet -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var nextVideoSet = function() {

        // get set height
        var maxVideoSet = getMaxVideoSet();

        if (currentVideoSet < maxVideoSet) {
            changeVideoSet(++currentVideoSet);

        // reached max > loop to 0
        } else {
            changeVideoSet(0);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getMaxVideoSet -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getMaxVideoSet = function() {

        currentMaxVideoSet = Math.ceil(loadedVideoDetailCount / VIDEOS_PER_SET) - 1;
        return currentMaxVideoSet;
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * changeVideoSet -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var changeVideoSet = function(set) {

        var position = -(set * VIDEO_SET_HEIGHT);
        currentVideoSet = set;

        // animate position
        $videoList.stop().animate({top: position}, 250, function() {

        });

        // set page number
        $pageNumberText.text(Number(set + 1) + ' / ' + Number(getMaxVideoSet() + 1));
    };


})(gamedex.module('videoPanel'), _V_, gamedex, jQuery, _, moment, List);

