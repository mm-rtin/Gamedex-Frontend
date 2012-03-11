
// UTILITIES
(function(Utilities) {

	// Dependencies
	var User = tmz.module('user');

	// amazon nodes, possible platform names and standard name link table
	var PLATFORM_INDEX = [
		{'amazon': 0, alias: 'all'},
		{'amazon': 12508701, alias: 'pc,windows', name: 'PC'},
		{'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
		{'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
		{'amazon': 14220271, alias: 'x360,xbox 360,microsoft xbox360,360', name: 'X360'},
		{'amazon': 14220271, alias: 'xbl,xbox live', name: 'XBL'},
		{'amazon': 11075831, alias: 'ds,nintendo ds', name: 'DS'},
		{'amazon': 2622270011,alias: '3ds,nintendo 3ds', name: '3DS'},
		{'amazon': 14219011, alias: 'wii,nintendo wii', name: 'Wii'},
		{'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'PS1'},
		{'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'PS2'},
		{'amazon': 14210861, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PS3'},
		{'amazon': 14210861, alias: 'psn,playstation network', name: 'PSN'},
		{'amazon': 3010557011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'Vita'},
		{'amazon': 12508741, alias: 'psp,sony psp', name: 'PSP'},
		{'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
		{'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'N64'},
		{'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
		{'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
		{'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
		{'amazon': 541020, alias: 'gba,gameboy advance,game boy,advance,gbadvance', name: 'GBA'},
		{'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'GBC'},
		{'amazon': 229793, alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Dreamcast'},
		{'amazon': 294944, alias: 'saturn,sega saturn', name: 'Saturn'},
		{'amazon': 294943, alias: 'genesis,sega genesis', name: 'Genesis'},
		{'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Gamegear'},
		{'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
	];

	// constants
	var SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1};

	// properties

	// timeout
	var autoFillTimeOut = null;


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

				if (currentMatch !== null && currentMatch[0].length === originalTextLength) {

					return PLATFORM_INDEX[i];

				} else if (currentMatch !== null && currentMatch[0].length > bestMatchLength) {

					bestMatchLength = currentMatch[0].length;
					bestMatch = PLATFORM_INDEX[i];
				}
			}
		}

		if (bestMatch !== null) {
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
	* handleInputKeyDown
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.handleInputKeyDown = function(event, container, ListModel){

		if (autoFillTimeOut) {
			clearTimeout(autoFillTimeOut);
		}

		// enter key
		if (event.which == 13) {

			// // // // console.info("LIST SEARCH");

			// get input value
			var listName = $(container).find('input').val().toLowerCase();

			// create new list
			ListModel.addList(listName);

		// entering text event, exclude backspace so text may be erased without autofilling
		} else if (event.which != 8 && event.which != 38 && event.which != 40 && event.which != 37 && event.which != 39) {

			// autofill input box with active-result highlighted
			// wait until chosen has a chance to update css classes
			autoFillTimeOut = setTimeout(function(){
				Utilities.autofillHighlightedElements(container);
			}, 250);
		}
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* autofillHighlightedElements -
	* autofills search box with first found item, highlights autofilled portion of text
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Utilities.autofillHighlightedElements = function(container) {

		// // // // console.info(autoFillTimeOut);
		clearTimeout(autoFillTimeOut);


		var highlightedText = '';
		var currentInputText = '';
		var concatText = '';
		var inputField = null;

		$(container).find('.highlighted').each(function(){

			highlightedText = $(container).find('.highlighted').contents().filter(function() {
				return this.nodeType == Node.TEXT_NODE;
			}).text();

			$(container).find('input').each(function(){

				inputField = $(this)[0];

				// current input text
				currentInputText = $(this).val();

				// set input field text
				concatText = currentInputText + highlightedText;

				// set input text
				$(this).val(concatText);

				// re-scale
				var dropdown = $(container).find('div.chzn-drop').first();
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
				var dd_top = $(container).height() - 5;
				$(dropdown).css({
					"top": dd_top + "px"
				});

				// highlight autofilled portion
				Utilities.selectFieldSubstring(inputField, currentInputText.length, concatText.length);
			});
		});
	};


})(tmz.module('utilities'));

