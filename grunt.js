/*global module:false*/
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-less');

    // Project configuration
    grunt.initConfig({
        meta: {
            version: '1.0.0',
            banner: '/*! GAMEDEX - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://www.gamedex.net/\n' +
                '* <%= grunt.template.today("yyyy") %> - ' +
                'Michael Martin */'
        },

        // source files
        src: {

            // libraries
            lib: [
                // 'lib/underscore.min.js',
                'lib/underscore.string.js',
                'lib/sugar-core.js',
                'lib/sugar-function.js',
                'lib/jquery-ui.min.js',
                'lib/jquery.ui.stars.min.js',
                'lib/jquery.ba-resize.js',
                'lib/jquery.nanoscroller.js',
                'lib/jquery.isotope.js',
                'lib/bootstrap.js',
                'lib/video.js',
                'lib/moment.js',
                'lib/select2.js',
                'lib/list.js',
                'lib/alertify.js'
            ],

            // gamedex source
            gamedex: [
                'js/jquery.bootstrap-dropdown-sub-menu.js',
                'js/gamedex.js',

                'js/service/utilities.js',
                'js/service/user.js',
                'js/service/storage.js',
                'js/service/itemCache.js',
                'js/service/amazon.js',
                'js/service/giantbomb.js',
                'js/service/itemLinker.js',

                'js/data/itemData.js',
                'js/data/tagData.js',
                'js/data/metacritic.js',
                'js/data/wikipedia.js',
                'js/data/gametrailers.js',
                'js/data/steam.js',
                'js/data/ign.js',
                'js/data/releasedList.js',

                'js/view/siteView.js',
                'js/view/searchView.js',
                'js/view/detailView.js',
                'js/view/itemView.js',
                'js/view/gridView.js',
                'js/view/tagView.js',
                'js/view/filterPanel.js',
                'js/view/videoPanel.js',
                'js/view/importView.js',

                'js/init.js'
            ],

            // less
            less: [
                'less/*.less'
            ]
        },
        // concat
        concat: {
            dist: {
                src: ['<config:src.gamedex>'],
                dest: 'dist/scripts.js'
            },
            lib: {
                src: ['<config:src.lib>'],
                dest: 'dist/lib.js'
            }
        },
        // minify
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/scripts.min.js'
            },
            lib: {
                src: ['<banner:meta.banner>', '<config:concat.lib.dest>'],
                dest: 'dist/lib.min.js'
            }
        },

        // less
        less: {
            all: {
                src: 'less/gamedex.less',
                dest: 'css/gamedex.css',
                options: {
                    compress: true
                }
            }
        },
        // watch js
        watch: {
            files: ['<config:src.gamedex>', '<config:src.less>'],
            tasks: 'concat min less'
        },

        uglify: {}

    });

    // Default task.
    grunt.registerTask('default', 'concatlib');

};
