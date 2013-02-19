
// UTILITIES
(function(Utilities, gamedex, $, _) {
    "use strict";

    // Dependencies
    var User = gamedex.module('user'),

        // amazon nodes, possible platform names and standard name link table
        PLATFORM_INDEX = [
            {id: 'all',       gt: '',           ign: '',          amazon: 468642,       name: 'All Platforms',  alias: 'all'                                                                               },
            {id: 'pc',        gt: 'pc',         ign: 'pc',        amazon: 229575,       name: 'PC',             alias: 'pc,windows'                                                                        },
            {id: 'mac',       gt: '',           ign: 'mac',       amazon: 229647,       name: 'Mac',            alias: 'mac,macwindows,osx,os x,apple,macintosh'                                           },
            {id: 'xbox',      gt: '',           ign: 'xbox',      amazon: 537504,       name: 'Xbox',           alias: 'xbox,microsoft xbox'                                                               },
            {id: 'x360',      gt: 'xbox 360',   ign: 'xbox-360',  amazon: 14220161,     name: 'X360',           alias: 'x360,xbox 360,microsoft xbox360,360'                                               },
            {id: 'xbl',       gt: 'xbla',       ign: 'xbox-360',  amazon: 14220161,     name: 'XBL',            alias: 'xbl,xbox live'                                                                     },
            {id: 'ds',        gt: 'ds',         ign: 'ds',        amazon: 11075831,     name: 'DS',             alias: 'ds,nintendo ds'                                                                    },
            {id: '3ds',       gt: '3ds',        ign: 'ds',        amazon: 2622269011,   name: '3DS',            alias: '3ds,nintendo 3ds'                                                                  },
            {id: 'wii',       gt: 'wii',        ign: 'wii',       amazon: 14218901,     name: 'Wii',            alias: 'wii,nintendo wii'                                                                  },
            {id: 'wiiu',      gt: 'wii u',      ign: 'wii-u',     amazon: 3075112011,   name: 'Wii U',          alias: 'wiiu,wii u,wii-u,nintendo wii u,nintendo wiiu'                                     },
            {id: 'ps',        gt: '',           ign: 'ps',        amazon: 229773,       name: 'PS1',            alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation' },
            {id: 'ps2',       gt: '',           ign: 'ps2',       amazon: 301712,       name: 'PS2',            alias: 'ps2,playstation 2,playstation2,sony playstation 2'                                 },
            {id: 'ps3',       gt: 'ps3',        ign: 'ps3',       amazon: 14210751,     name: 'PS3',            alias: 'ps3,playstation 3,playstation3,sony playstation 3'                                 },
            {id: 'psn',       gt: '',           ign: 'ps3',       amazon: 14210751,     name: 'PSN',            alias: 'psn,playstation network'                                                           },
            {id: 'vita',      gt: 'vita',       ign: 'vita',      amazon: 3010556011,   name: 'Vita',           alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita'              },
            {id: 'psp',       gt: '',           ign: 'psp',       amazon: 11075221,     name: 'PSP',            alias: 'psp,sony psp'                                                                      },
            {id: 'gc',        gt: '',           ign: 'gcn',       amazon: 541022,       name: 'Gamecube',       alias: 'gamecube,gc,nintendo gamecube'                                                     },
            {id: 'n64',       gt: '',           ign: 'n64',       amazon: 229763,       name: 'N64',            alias: 'n64,nintendo 64,nintendo64'                                                        },
            {id: 'nes',       gt: '',           ign: '',          amazon: 566458,       name: 'NES',            alias: 'nes,nintendo nes'                                                                  },
            {id: 'snes',      gt: '',           ign: '',          amazon: 294945,       name: 'SNES',           alias: 'snes,super nintendo,nintendo snes'                                                 },
            {id: 'gba',       gt: '',           ign: 'gba',       amazon: 1272528011,   name: 'Game Boy',       alias: 'gb,gameboy'                                                                        },
            {id: 'gb',        gt: '',           ign: 'gb',        amazon: 541020,       name: 'GBA',            alias: 'gba,gameboy advance,game boy,advance,gbadvance'                                    },
            {id: 'gbc',       gt: '',           ign: '',          amazon: 229783,       name: 'GBC',            alias: 'gbc,gbcolor,gameboy color'                                                         },
            {id: 'dc',        gt: '',           ign: 'dc',        amazon: 229793,       name: 'Dreamcast',      alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast'                            },
            {id: 'saturn',    gt: '',           ign: '',          amazon: 294944,       name: 'Saturn',         alias: 'saturn,sega saturn'                                                                },
            {id: 'genesis',   gt: '',           ign: '',          amazon: 294943,       name: 'Genesis',        alias: 'genesis,sega genesis'                                                              },
            {id: 'gamegear',  gt: '',           ign: '',          amazon: 294942,       name: 'Gamegear',       alias: 'gamegear,game gear,sega gamegear'                                                  },
            {id: 'segacd',    gt: '',           ign: '',          amazon: 11000181,     name: 'Sega CD',        alias: 'cd,sega cd'                                                                        }
        ],

        // constants
        SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1},
        PRICE_PROVIDERS = {'Amazon': 0, 'Steam': 1},
        VIEW_ALL_TAG_ID = '0',

        // 3RD PARTY IMAGE PREFIX
        AMAZON_IMAGE = {'URL': 'http://ecx.images-amazon.com/images', 'RE': /http:\/\/ecx\.images-amazon\.com\/images/gi, 'TOKEN': '~1~'},
        GIANTBOMB_IMAGE = {'URL': 'http://media.giantbomb.com/uploads', 'RE': /http:\/\/media\.giantbomb\.com\/uploads/gi, 'TOKEN': '~1~'};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getStandardPlatform -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getStandardPlatform = function(platformName) {

        var re = new RegExp(platformName, 'gi');

        for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {
            if (re.test(PLATFORM_INDEX[i].alias)) {
                return PLATFORM_INDEX[i];
            }
        }
        return PLATFORM_INDEX[0];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * matchPlatformToIndex -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var matchPlatformToIndex = function(platformName) {

        var re = null;
        var aliasArray = [];
        var bestMatch = null;
        var originalTextLength = platformName.length;
        var bestMatchLength = 0;
        var currentMatch = null;

        // reverse lookup - make regex of each platform index alias and match with platformName
        for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {

            aliasArray = PLATFORM_INDEX[i].alias.split(',');

            for (var j = 0, aliasLen = aliasArray.length; j < aliasLen; j++) {

                re = new RegExp(aliasArray[j], 'gi');
                currentMatch = re.exec(platformName);

                if (currentMatch && currentMatch[0].length === originalTextLength) {

                    return PLATFORM_INDEX[i];

                } else if (currentMatch && currentMatch[0].length > bestMatchLength) {

                    bestMatchLength = currentMatch[0].length;
                    bestMatch = PLATFORM_INDEX[i];
                }
            }
        }

        if (bestMatch) {
            return bestMatch;
        }

        return PLATFORM_INDEX[0];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'PLATFORM_INDEX': PLATFORM_INDEX,
        'SEARCH_PROVIDERS': SEARCH_PROVIDERS,
        'PRICE_PROVIDERS': PRICE_PROVIDERS,
        'VIEW_ALL_TAG_ID': VIEW_ALL_TAG_ID,
        'AMAZON_IMAGE': AMAZON_IMAGE,
        'GIANTBOMB_IMAGE': GIANTBOMB_IMAGE,
        'getStandardPlatform': getStandardPlatform,
        'matchPlatformToIndex': matchPlatformToIndex
    };

    $.extend(Utilities, publicMethods);

})(gamedex.module('utilities'), gamedex, jQuery, _);

