// VideoPanel
(function(VideoPanel, _V_, tmz, $, _, moment) {
	"use strict";

	// constants
	var GIANT_BOMB_VIDEO_PATH = 'http://media.giantbomb.com/video/',
		VIDEO_PLAYER_ID = 'videoPlayer',
		VIDEO_SET_HEIGHT = 91,
		VIDEOS_PER_SET = 5,

		// properties
		currentVideoSet = 0,
		currentMaxVideoSet = null,
		currentVideoCount = 0,
		currentVideoIndex = 0,
		previousVideoIndex = 0,

		// data
		currentVideos = [],		// current item videos

		// objects
		videoJSPLayer = null,

		// jquery cache
		$videoModal = $('#video-modal'),
		$videoListContainer = $('#videoListContainer'),
		$videoList = $('#videoList'),
		$videoPlayer = $('#videoPlayer'),
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

		$('html, body').scrollTop(0);

		// show video modal
		$videoModal.modal('show');

		playCurrentVideo();
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderVideoModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	VideoPanel.renderVideoModal = function(videoResults) {

		currentVideos = $.extend(true, [], videoResults);

		if (currentVideos.length !== 0) {

			// get video count
			currentVideoCount = currentVideos.length;

			// reset max, videoIndex
			currentMaxVideoSet = null;
			currentVideoIndex = 0;

			// format data
			formatVideoData(currentVideos);

			// get model data
			var templateData = {'videoResults': currentVideos};

			// render video list
			$videoList.html(videoResultsTemplate(templateData));

			// update video source
			changeVideoSource(0);

			// change videoSet to default
			currentVideoSet = 0;
			changeVideoSet(0);

			// init popover
			$videoList.find('a').popover({'placement': 'top', 'animation': true});

			showVideoListNavigation();
		}

		if (currentVideos.length <= VIDEOS_PER_SET) {
			hideVideoListNavigation();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatVideoData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatVideoData = function(videoArray) {

		// iterate videoArray and add new attributes
		for (var i = 0, len = videoArray.length; i < len; i++) {

			// format publish date
			videoArray[i].publishDate = moment(videoArray[i].publish_date, "YYYY-MM-DD").calendar();
			delete videoArray[i].publish_date;

			// format video length
			var minutes = Math.floor(videoArray[i].length_seconds / 60);
			var seconds = (videoArray[i].length_seconds % 60).toString();
			if (seconds.length === 1) {
				seconds = '0' + seconds;
			}
			delete videoArray[i].length_seconds;


			videoArray[i].runningTime = minutes + ':' + seconds;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playNextVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playNextVideo = function() {

		if (currentVideoIndex === currentVideoCount - 1) {
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
		$videoListNavigation.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showVideoListNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showVideoListNavigation = function() {
		$videoListNavigation.show();
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

		if (!currentMaxVideoSet) {
			currentMaxVideoSet = Math.ceil(currentVideoCount / VIDEOS_PER_SET) - 1;
		}

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


})(tmz.module('videoPanel'), _V_, tmz, jQuery, _, moment);

