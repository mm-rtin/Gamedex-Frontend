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
        autoNavigateToVideoItemSet = true,

        // list
        videoList = null,
        listOptions = {
            valueNames: ['publishDate']
        },

        // data
        currentVideos = [],     // current item videos to load
        videoOrderIndex = [],   // current video order by date as index for currentVideos array

        firstVideoDetailRequest = null,

        $currentVideoItem = null,
        $previousVideoItem = null,

        // debounced function
        sortVideoListDebounced = null,

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

        // create debounced function
        sortVideoListDebounced =  _.debounce(sortVideoList, 1000);

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

        // deferreds: wait for firstVideoDetailRequest
        $.when(firstVideoDetailRequest).then(

            // all ajax requests returned
            function() {

                if (initialLoad) {
                    initialLoad = false;

                    // add video to set
                    var detailLoaded = videoDetailLoaded(currentVideos[totalVideoCount - 1]);

                    if (detailLoaded) {
                        // update video source
                        changeVideoSource(totalVideoCount - 1);
                    }

                    // load remaining video detail
                    loadVideoDetails();
                }

                playCurrentVideo();
            },
            function() {

            }
        );

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
        currentVideoIndex = -1;
        currentVideoSet = 0;
        loadedVideoDetailCount = 0;
        autoNavigateToVideoItemSet = true;
        totalVideoCount = giantbombVideos.length;

        $currentVideoItem = null;
        $previousVideoItem = null;

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

        // load first video detail info
        firstVideoDetailRequest = loadVideoDetail(currentVideos[totalVideoCount - 1], function(videoObj) {

        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * loadVideoDetails -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var loadVideoDetails = function() {

        // for each video get video detail
        _.each(currentVideos, function(video) {

            loadVideoDetail(video, function(video, detailLoaded) {

                // if video hasn't loaded from first video detail attempt to play this video is details loaded
                if (currentVideoIndex === -1 && detailLoaded) {
                    changeVideoSource(video.index);
                    playCurrentVideo();
                }
            });
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * loadVideoDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var loadVideoDetail = function(video, onSuccess) {

        // get video detail
        var giantBombVideoAjax = GiantBomb.getGiantBombVideo(video.id, function(data) {

            // update video object with new detail information
            $.extend(true, video, data);

            // parse video detail data
            var detailLoaded = videoDetailLoaded(video);

            onSuccess(video, detailLoaded);
        });

        return giantBombVideoAjax;
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * videoDetailLoaded -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var videoDetailLoaded = function(video) {

        // if not attached to video list and detail data contains image object
        if (!_.has(video, 'attached') && _.has(video, 'image')) {

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

                // sort video list
                sortVideoListDebounced();

            }, 200);

            // init opentip
            $videoItem.opentip($videoItem.attr('data-ot'), $videoItem.attr('data-ot-title'), {tipJoint: 'bottom'});

            // update video set
            changeVideoSet(currentVideoSet);

            if (loadedVideoDetailCount > VIDEOS_PER_SET) {
                showVideoListNavigation();
            }
        }

        // if video detail loaded
        if (_.has(video, 'image')) {
            return true;

        } else {
            return false;
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * sortVideoList -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var sortVideoList = function() {

        videoOrderIndex = [];

        // sort
        videoList = new ListJS('videoListContainer', listOptions);
        videoList.sort('publishDate', { asc: false });

        // create new video order index
        _.each(videoList.items, function(videoItem) {
            videoOrderIndex.push(parseInt($(videoItem.elm).attr('data-id'), 10));
        });

        // change video set - only if user hasn't change video set manually
        if (autoNavigateToVideoItemSet) {
            console.info(autoNavigateToVideoItemSet);
            viewSetForCurrentlyPlaying();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * formatVideoData -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var formatVideoData = function(video) {

        // format publish date
        video.calendarDate = moment(video.publish_date, "YYYY-MM-DD").calendar();

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

        // get index of currently playing video in sorted array
        var sortedIndex = _.indexOf(videoOrderIndex, currentVideoIndex);

        // go back to first video in sorted list
        if (sortedIndex + 1 === videoOrderIndex.length) {
            currentVideoIndex = videoOrderIndex[0];

        // next video in sorted list
        } else {
            currentVideoIndex = videoOrderIndex[sortedIndex + 1];
        }

        // play next
        changeVideoSource(currentVideoIndex);

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
        $currentVideoItem = $videoList.find('li[data-id="' + index + '"]');
        $previousVideoItem = $videoList.find('li[data-id="' + previousVideoIndex + '"]');
        $previousVideoItem.removeClass('playing');
        $currentVideoItem.addClass('playing');

        // update videoPlayer source
        var videoURLParts = url.split('.');
        // var videoURL = GIANT_BOMB_VIDEO_PATH + videoURLParts[0] + '_3500.' + videoURLParts[1];
        var videoURL = currentVideos[index].high_url;
        videoJSPLayer.src(videoURL);

        previousVideoIndex = index;

        // change video set
        viewSetForCurrentlyPlaying();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewSetForCurrentlyPlaying -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var viewSetForCurrentlyPlaying = function() {

        // get index of currently playing video in sorted array
        var sortedIndex = _.indexOf(videoOrderIndex, currentVideoIndex);

        // change video set
        if (sortedIndex !== -1) {

            var set = Math.floor(sortedIndex / VIDEOS_PER_SET);
            changeVideoSet(set);
        }
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

        autoNavigateToVideoItemSet = false;

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

        autoNavigateToVideoItemSet = false;

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

