// VideoPanel
(function(VideoPanel, tmz, $, _, moment) {
	"use strict";

	// constants
	var GIANT_BOMB_VIDEO_PATH = 'http://media.giantbomb.com/video/',
		VIDEO_PLAYER_ID = 'videoPlayer',
		VIDEO_SET_HEIGHT = 84,
		VIDEOS_PER_SET = 5,

		// properties
		currentVideoSet = 0,
		currentMaxVideoSet = null,
		currentVideoCount = 0,

		// data
		videoResults = [],		// current item videos

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

		// create event handlers
		VideoPanel.createEventHandlers();

		videoJSPLayer = _V_(VIDEO_PLAYER_ID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.createEventHandlers = function() {

		// videoList li: click
		$videoList.on('click', 'li', function(e) {
			e.preventDefault();

			var url = $(this).attr('data-url');
			changeVideoSource(url);

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
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showVideoPanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.showVideoPanel = function() {

		// show video modal
		$videoModal.modal('show');

		playCurrentVideo();
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderVideoModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	VideoPanel.renderVideoModal = function(videoResults) {

		if (videoResults.length !== 0) {

			// get video count
			currentVideoCount = videoResults.length;

			// reset max
			currentMaxVideoSet = null;

			// get model data
			var templateData = {'videoResults': videoResults};

			// render video list
			$videoList.html(videoResultsTemplate(templateData));

			// update video source with first video url
			var videoItem = videoResults[0];

			// update video source
			changeVideoSource(videoItem.url);

			// change videoSet to default
			currentVideoSet = 0;
			changeVideoSet(0);

			showVideoListNavigation();
		}

		if (videoResults.length <= VIDEOS_PER_SET) {
			hideVideoListNavigation();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeVideoSource -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeVideoSource = function(url) {

		// update videoPlayer source
		var videoURLParts = url.split('.');
		var videoURL = GIANT_BOMB_VIDEO_PATH + videoURLParts[0] + '_3500.' + videoURLParts[1];
		videoJSPLayer.src(videoURL);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playCurrentVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playCurrentVideo = function() {

		videoJSPLayer.play();
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
			currentVideoSet--;

			changeVideoSet(currentVideoSet);
		// reached min > loop to max
		} else {
			currentVideoSet = maxVideoSet;
			changeVideoSet(currentVideoSet);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* nextVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var nextVideoSet = function() {

		// get set height
		var maxVideoSet = getMaxVideoSet();

		if (currentVideoSet < maxVideoSet) {
			currentVideoSet++;

			changeVideoSet(currentVideoSet);

		// reached max > loop to 0
		} else {
			currentVideoSet = 0;
			changeVideoSet(currentVideoSet);
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

		// animate position
		$videoList.stop().animate({top: position}, 250, function() {

		});

		// set page number
		$pageNumberText.text(Number(set + 1) + ' / ' + Number(getMaxVideoSet() + 1));
	};


})(tmz.module('videoPanel'), tmz, jQuery, _);

