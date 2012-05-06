
// UTILITIES
(function(Utilities, tmz, $, _) {

	// Dependencies
	var User = tmz.module('user'),

		// amazon nodes, possible platform names and standard name link table
		PLATFORM_INDEX = [
			{'id': 'all', 'ign': '', 'gamestats': '', 'amazon': 0, alias: 'all'},
			{'id': 'pc', 'ign': 'pc', 'gamestats': 'pc', 'amazon': 229575, alias: 'pc,windows', name: 'PC'},
			{'id': 'mac', 'ign': '', 'gamestats': 'pc', 'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
			{'id': 'xbox', 'ign': '', 'gamestats': 'xbox', 'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
			{'id': 'x360', 'ign': 'x360', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'x360,xbox 360,microsoft xbox360,360', name: 'X360'},
			{'id': 'xbl', 'ign': 'x360&downloadType=1', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'xbl,xbox live', name: 'XBL'},
			{'id': 'ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 11075831, alias: 'ds,nintendo ds', name: 'DS'},
			{'id': '3ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 2622269011,alias: '3ds,nintendo 3ds', name: '3DS'},
			{'id': 'wii', 'ign': 'wii', 'gamestats': 'wii', 'amazon': 14218901, alias: 'wii,nintendo wii', name: 'Wii'},
			{'id': 'ps', 'ign': '', 'gamestats': 'playstation', 'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'PS1'},
			{'id': 'ps2', 'ign': '', 'gamestats': 'playstation-2', 'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'PS2'},
			{'id': 'ps3', 'ign': 'ps3', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PS3'},
			{'id': 'psn', 'ign': 'ps3&downloadType=201', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'psn,playstation network', name: 'PSN'},
			{'id': 'vita', 'ign': 'ps-vita', 'gamestats': 'playstation-3', 'amazon': 3010556011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'Vita'},
			{'id': 'psp', 'ign': '', 'gamestats': 'playstation-portable', 'amazon': 11075221, alias: 'psp,sony psp', name: 'PSP'},
			{'id': 'gc', 'ign': '', 'gamestats': 'gamecube', 'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
			{'id': 'n64', 'ign': '', 'gamestats': 'nintendo-64', 'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'N64'},
			{'id': 'nes', 'ign': '', 'gamestats': 'nes', 'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
			{'id': 'snes', 'ign': '', 'gamestats': 'super-nes', 'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
			{'id': 'gba', 'ign': '', 'gamestats': 'gameboy-advance', 'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
			{'id': 'gb', 'ign': '', 'gamestats': 'game-boy', 'amazon': 541020, alias: 'gba,gameboy advance,game boy,advance,gbadvance', name: 'GBA'},
			{'id': 'gbc', 'ign': '', 'gamestats': 'game-boy-color', 'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'GBC'},
			{'id': 'dc', 'ign': '', 'gamestats': 'dreamcast', 'amazon': 229793, alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Dreamcast'},
			{'id': 'saturn', 'ign': '', 'gamestats': 'saturn', 'amazon': 294944, alias: 'saturn,sega saturn', name: 'Saturn'},
			{'id': 'genesis', 'ign': '', 'gamestats': 'genesis', 'amazon': 294943, alias: 'genesis,sega genesis', name: 'Genesis'},
			{'id': 'gamegear', 'ign': '', 'gamestats': 'game-gear', 'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Gamegear'},
			{'id': 'segacd', 'ign': '', 'gamestats': 'sega-cd', 'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
		],

		// constants
		SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1},
		VIEW_ALL_TAG_ID = '0';

		// properties

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStandardPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.getStandardPlatform = function(platformName) {

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
	Utilities.matchPlatformToIndex = function(platformName) {

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
	* getPlatformIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.getPlatformIndex = function() {
		return PLATFORM_INDEX;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getViewAllTagID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.getViewAllTagID = function() {
		return VIEW_ALL_TAG_ID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getProviders
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.getProviders = function() {

		return SEARCH_PROVIDERS;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectFieldSubstring
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.selectFieldSubstring = function(field, start, end) {

		if(field.createTextRange) {
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart('character', start);
			selRange.moveEnd('character', end);
			selRange.select();
		} else if(field.setSelectionRange) {
			field.setSelectionRange(start, end);
		} else if(field.selectionStart) {
			field.selectionStart = start;
			field.selectionEnd = end;
		}
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* autofillHighlightedElements -
	* autofills search box with first found item, highlights autofilled portion of text
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.autofillHighlightedElements = function($container, autoFillTimeOut) {

		clearTimeout(autoFillTimeOut);

		var highlightedText = '';
		var currentInputText = '';
		var concatText = '';
		var inputField = null;

		$container.find('.highlighted').each(function(){

			highlightedText = $container.find('.highlighted').contents().filter(function() {
				return this.nodeType == Node.TEXT_NODE;
			}).text();

			$container.find('input').each(function(){

				inputField = $(this)[0];

				// current input text
				currentInputText = $(this).val();

				// set input field text
				concatText = currentInputText + highlightedText;

				// set input text
				$(this).val(concatText);

				// re-scale
				var dropdown = $container.find('div.chzn-drop').first();
				var style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
				var styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
				for (_i = 0, _len = styles.length; _i < _len; _i++) {
					style = styles[_i];
					style_block += style + ":" + $(this).css(style) + ";";
				}
				div = $('<div />', {
					'style': style_block
				});
				div.text($(this).val());
				$('body').append(div);
				w = div.width() + 25;
				div.remove();
				$(this).css({
					'width': w + 'px'
				});
				var dd_top = $container.height() - 5;
				$(dropdown).css({
					"top": dd_top + "px"
				});

				// highlight autofilled portion
				Utilities.selectFieldSubstring(inputField, currentInputText.length, concatText.length);
			});
		});
	};


})(tmz.module('utilities'), tmz, jQuery, _);

