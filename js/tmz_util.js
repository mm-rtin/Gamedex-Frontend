
// UTILITIES
(function(Utilities) {

	// Dependencies
	var User = tmz.module('user');

	// constants
	var SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1};

	// properties

	// timeout
	var autoFillTimeOut = null;

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

		console.info(event.which);
		// enter key
		if (event.which == 13) {

			console.info("LIST SEARCH");

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

		console.info(autoFillTimeOut);
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

