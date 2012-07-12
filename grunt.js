/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		meta: {
			version: '0.1.0',
			banner: '/*! GAMEDEX - v<%= meta.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* http://www.gamedex.net/\n' +
				'* <%= grunt.template.today("yyyy") %> - ' +
				'Michael Martin */'
		},

		// source files
		src: {
			files: [

				// libraries
				'lib/underscore-min.js',
				'lib/jquery-ui.min.js',
				'lib/jquery.ui.stars.min.js',
				'lib/jquery.ba-resize.js',
				'lib/jquery.nanoscroller.min.js',
				'lib/jquery.isotope.min.js',
				'lib/bootstrap-transition.js',
				'lib/bootstrap-tooltip.js',
				'lib/bootstrap-tab.js',
				'lib/bootstrap-popover.js',
				'lib/bootstrap-modal.js',
				'lib/bootstrap-dropdown.js',
				'lib/bootstrap-button.js',
				'lib/bootstrap-alert.js',
				'lib/list.min.js',
				'lib/video.min.js',
				'lib/moment.js',
				'lib/select2.min.js',

				// gamedex source (order matters)
				'js/jquery.bootstrap-dropdown-sub-menu.js',
				'js/tmz.js',
				'js/tmz_util.js',
				'js/tmz_user.js',
				'js/tmz_storage.js',
				'js/tmz_itemData.js',
				'js/tmz_tagData.js',
				'js/tmz_itemCache.js',
				'js/tmz_siteView.js',
				'js/tmz_searchView.js',
				'js/tmz_detailView.js',
				'js/tmz_itemView.js',
				'js/tmz_gridView.js',
				'js/tmz_tagView.js',
				'js/tmz_filterPanel.js',
				'js/tmz_videoPanel.js',
				'js/tmz_amazon.js',
				'js/tmz_giantbomb.js',
				'js/tmz_metacritic.js',
				'js/tmz_wikipedia.js',
				'js/tmz_gametrailers.js',
				'js/tmz_gamestats.js',
				'js/tmz_ign.js',
				'js/tmz_releasedList.js',
				'js/tmz_itemLinker.js',
				'js/init.js'
			]
		},
		// concat
		concat: {
			dist: {
				src: [
					'<config:src.files>'
				],
				dest: 'dist/scripts.min.js'
			}
		},
		// minify
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/scripts.min.js'
			}
		},
		// watch
		watch: {
			files: '<config:src.files>',
			tasks: 'concat'
		},

		uglify: {}
	});

	// Default task.
	grunt.registerTask('default', 'concat');

};
