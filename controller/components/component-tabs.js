var componentTabs = (function() {
    'use strict';

    var componentTabs = {
        init: function() {

            if (location.hash != "") {
                this.getHash(location.hash);
            }

            $(window).on('hashchange', function() {
                componentTabs.getHash(location.hash);
            });
        },
        getHash: function(get, elem) {
            var selector = get.split('#');
            selector = selector[1];

            // Activated link clicked in menu selector
            $('.component-tabs-menu li a').removeClass('tab-active');
            $('.component-tabs-menu li a[href=#' + selector + ']').addClass('tab-active');
            // Activated content respective the menu clicked
            $('.tab-section').addClass('hidden').removeClass('active');
            $('.tab-section-' + selector).removeClass('hidden').addClass('active');

        }
    };

    return componentTabs.init();
}());