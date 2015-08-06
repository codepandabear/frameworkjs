var brandsController = (function() {
    'use strict';

    var brandsController = {
        init: function() {
            var require = [
                appController.libsJS.plugin.flickerplate,
                appController.libsJS.plugin.hammer
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $('.portal-banner-image').flickerplate({
                        arrows: false,
                        dot_navigation: false,
                        auto_flick: false,
                        block_text: false
                    });
                }
            });
        },
        index: function() {

        }
    };

    return brandsController;
}());