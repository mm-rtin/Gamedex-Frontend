module.exports = function(grunt) {

    // Gamedex project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * less - dev, prod
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        less: {
          dev: {
            options: {
              paths: ["less/"]
            },
            files: {
              "css/gamedex.css": "less/gamedex.less"
            }
          },
          prod: {
            options: {
              paths: ["less/"],
              yuicompress: true
            },
            files: {
              "css/gamedex.css": "less/gamedex.less"
            }
          }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * concat - lib, scripts
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        concat: {
            options: {
                separator: ';'
            },

            // lib
            lib: {
                src: [
                    'lib/underscore.js',
                    'lib/underscore.string.js',
                    'lib/sugar-core.js',
                    'lib/sugar-function.js',
                    'lib/jquery-ui.min.js',
                    'lib/jquery.ui.stars.min.js',
                    'lib/jquery.ba-resize.js',
                    'lib/jquery.nanoscroller.js',
                    'lib/jquery.isotope.js',
                    'lib/jquery.opentip.js',
                    'lib/bootstrap.js',
                    'lib/video.js',
                    'lib/moment.js',
                    'lib/select2.js',
                    'lib/list.js',
                    'lib/alertify.js'
                ],

                dest: 'dist/lib/lib.js'
            },

            // scripts
            scripts: {
                src: [
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

                dest: 'dist/scripts/scripts.js'
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * uglify - lib, scripts
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        uglify: {
            lib: {
              files: {
                'dist/lib/lib.min.js': ['dist/lib/lib.js']
              }
            },
            scripts: {
              files: {
                'dist/scripts/scripts.min.js': ['dist/scripts/scripts.js']
              }
            }
        },


        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * ftp-deploy - upload static assets to ftp
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        'ftp-deploy': {
          css: {
            auth: {
              host: 'codecollision.com',
              port: 21,
              authKey: 'key1'
            },
            src: 'css',
            dest: '/home/hexvector/webapps/gamedex_static/css/',
            exclusions: ['']
          },
          lib: {
            auth: {
              host: 'codecollision.com',
              port: 21,
              authKey: 'key1'
            },
            src: 'dist/lib',
            dest: '/home/hexvector/webapps/gamedex_static/dist/',
            exclusions: ['']
          },
          scripts: {
            auth: {
              host: 'codecollision.com',
              port: 21,
              authKey: 'key1'
            },
            src: 'dist/scripts',
            dest: '/home/hexvector/webapps/gamedex_static/dist/',
            exclusions: ['']
          }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * watch - lib, scripts
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        watch: {
          lib: {
            files: ['lib/**/*.js'],
            tasks: ['concat:lib', 'ftp-deploy:lib'],
            options: {
              nospawn: true
            }
          },
          scripts: {
            files: ['js/**/*.js'],
            tasks: ['concat:scripts', 'ftp-deploy:scripts'],
            options: {
              nospawn: true
            }
          },
          less: {
            files: ['less/*.less'],
            tasks: ['less:prod', 'ftp-deploy:css'],
            options: {
              nospawn: true
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.loadNpmTasks('grunt-include-replace');

    // Default task(s)
    grunt.registerTask('default', ['concat', 'uglify', 'less:prod', 'ftp-deploy']);
};
