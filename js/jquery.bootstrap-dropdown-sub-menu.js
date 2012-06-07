(function ($) {

    // properties
    var pluginName = 'BootstrapDropdownSubMenu',
        defaults = {
            propertyName: "value"
        };

    var $subNav = null,
        $mainNav = null,
        showTimeout = null,
        hideTimeout = null;

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * BDSM - Bootstrap Dropdown Sub Menu
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function BDSM(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * intialize
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    BDSM.prototype.init = function () {

        // create events
        this.createEventHandlers($(this.element), this.options.$mainNav);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    BDSM.prototype.createEventHandlers = function ($subNav, $mainNav) {

        // mainNav root items: hover
        $mainNav.find('li:not(.dropdown-sub li) a').hover(function(e) {

            // cancel show
            clearTimeout(showTimeout);
            showTimeout = null;

            // create timeout if not already defined
            if (!hideTimeout) {

                // delay before hiding subnav
                hideTimeout = setTimeout(function() {
                    $subNav.removeClass('active');
                }, 500);
            }
        });

        // subNav: hover
        $subNav.hover(function(e) {
            // cancel hide
            clearTimeout(hideTimeout);
            hideTimeout = null;

            // create timeout if not already defined
            if (!showTimeout) {
                // delay before showing subnav
                showTimeout = setTimeout(function() {
                    $subNav.addClass('active');
                }, 500);
            }
        });

        // subNav: click
        $subNav.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            $subNav.addClass('active');
        });

        // subNav items: hover
        $subNav.find('li a').hover(function(e) {

            // cancel hide
            clearTimeout(hideTimeout);
            hideTimeout = null;
        });

        // subNav items: click
        $subNav.find('li a').click(function(e) {
            $mainNav.removeClass('open');
        });

        // dropdown-toggle: click
        $mainNav.find('.dropdown-toggle').click(function(e) {
            $subNav.removeClass('active');
        });

    };

    // create jQuery plugin - prevent multiple instantiation
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new BDSM(this, options));
            }
        });
    };

})( jQuery);