
// UTILITIES
(function(Utilities, tmz, $, _) {
	"use strict";

	// Dependencies
	var User = tmz.module('user'),

		// amazon nodes, possible platform names and standard name link table
		PLATFORM_INDEX = [
			{'id': 'all', 'gt': '', 'ign': '', 'gamestats': '', 'amazon': 468642, alias: 'all', name: 'All Platforms'},
			{'id': 'pc', 'gt': 'pc', 'ign': 'pc', 'gamestats': 'pc', 'amazon': 229575, alias: 'pc,windows', name: 'PC'},
			{'id': 'mac', 'gt': '', 'ign': '', 'gamestats': 'pc', 'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
			{'id': 'xbox', 'gt': '', 'ign': '', 'gamestats': 'xbox', 'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
			{'id': 'x360', 'gt': 'xbox 360', 'ign': 'x360', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'x360,xbox 360,microsoft xbox360,360', name: 'Xbox 360'},
			{'id': 'xbl', 'gt': 'xbla', 'ign': 'x360&downloadType=1', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'xbl,xbox live', name: 'Xbox Live'},
			{'id': 'ds', 'gt': 'ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 11075831, alias: 'ds,nintendo ds', name: 'DS'},
			{'id': '3ds', 'gt': '3ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 2622269011,alias: '3ds,nintendo 3ds', name: '3DS'},
			{'id': 'wii', 'gt': 'wii', 'ign': 'wii', 'gamestats': 'wii', 'amazon': 14218901, alias: 'wii,nintendo wii', name: 'Wii'},
			{'id': 'wiiu', 'gt': 'wii u', 'ign': 'wii u', 'gamestats': 'wii u', 'amazon': 3075112011, alias: 'wiiu,wii u,wii-u,nintendo wii u,nintendo wiiu', name: 'Wii U'},
			{'id': 'ps', 'gt': '', 'ign': '', 'gamestats': 'playstation', 'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'Playstation'},
			{'id': 'ps2', 'gt': '', 'ign': '', 'gamestats': 'playstation-2', 'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'Playstation 2'},
			{'id': 'ps3', 'gt': 'ps3', 'ign': 'ps3', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PS3'},
			{'id': 'psn', 'gt': '', 'ign': 'ps3&downloadType=201', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'psn,playstation network', name: 'PSN'},
			{'id': 'vita', 'gt': 'vita', 'ign': 'ps-vita', 'gamestats': 'playstation-3', 'amazon': 3010556011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'Vita'},
			{'id': 'psp', 'gt': '', 'ign': '', 'gamestats': 'playstation-portable', 'amazon': 11075221, alias: 'psp,sony psp', name: 'PSP'},
			{'id': 'gc', 'gt': '', 'ign': '', 'gamestats': 'gamecube', 'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
			{'id': 'n64', 'gt': '', 'ign': '', 'gamestats': 'nintendo-64', 'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'N64'},
			{'id': 'nes', 'gt': '', 'ign': '', 'gamestats': 'nes', 'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
			{'id': 'snes', 'gt': '', 'ign': '', 'gamestats': 'super-nes', 'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
			{'id': 'gba', 'gt': '', 'ign': '', 'gamestats': 'gameboy-advance', 'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
			{'id': 'gb', 'gt': '', 'ign': '', 'gamestats': 'game-boy', 'amazon': 541020, alias: 'gba,gameboy advance,game boy,advance,gbadvance', name: 'GBA'},
			{'id': 'gbc', 'gt': '', 'ign': '', 'gamestats': 'game-boy-color', 'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'GBC'},
			{'id': 'dc', 'gt': '', 'ign': '', 'gamestats': 'dreamcast', 'amazon': 229793, alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Dreamcast'},
			{'id': 'saturn', 'gt': '', 'ign': '', 'gamestats': 'saturn', 'amazon': 294944, alias: 'saturn,sega saturn', name: 'Saturn'},
			{'id': 'genesis', 'gt': '', 'ign': '', 'gamestats': 'genesis', 'amazon': 294943, alias: 'genesis,sega genesis', name: 'Genesis'},
			{'id': 'gamegear', 'gt': '', 'ign': '', 'gamestats': 'game-gear', 'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Gamegear'},
			{'id': 'segacd', 'gt': '', 'ign': '', 'gamestats': 'sega-cd', 'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
		],

		// constants
		SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1},
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
        'VIEW_ALL_TAG_ID': VIEW_ALL_TAG_ID,
        'AMAZON_IMAGE': AMAZON_IMAGE,
        'GIANTBOMB_IMAGE': GIANTBOMB_IMAGE,
        'getStandardPlatform': getStandardPlatform,
        'matchPlatformToIndex': matchPlatformToIndex
    };

    $.extend(Utilities, publicMethods);

})(tmz.module('utilities'), tmz, jQuery, _);

