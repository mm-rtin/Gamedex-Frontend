// VideoPanel
(function(VideoPanel, tmz, $, _, moment) {
	"use strict";

	// constants
	var GIANT_BOMB_VIDEO_PATH = 'http://media.giantbomb.com/video/',
		VIDEO_PLAYER_ID = 'videoPlayer',

		// data
		videoResults = [],		// current item videos

		// objects
		videoJSPLayer = null,

		// jquery cache
		$videoModal = $('#video-modal'),
		$videoListContainer = $('#videoListContainer'),
		$videoList = $('#videoList'),
		$videoPlayer = $('#videoPlayer'),

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

		// get model data
		var templateData = {'videoResults': videoResults};

		// render video list
		$videoList.html(videoResultsTemplate(templateData));

		// update video source with first video url
		var videoItem = videoResults[0];

		// update video source
		changeVideoSource(videoItem.url);
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


})(tmz.module('videoPanel'), tmz, jQuery, _);

