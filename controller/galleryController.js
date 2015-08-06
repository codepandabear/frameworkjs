var galleryController = (function() {
    'use strict';

    var galleryController = {
        init: function() {

        },
        index: function() {
            var require = [
                appController.libsJS.plugin.jQueryColorbox,
				appController.libsJS.plugin.instafeed,
                appController.libsJS.plugin.instagram
            ];
			
			appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $('.galleryLink').colorbox({
                        current: false,
                        closeButton: true
                    });
                }
            });

            appController.core.addLastClass('.ctn-gallery li', 3);
        }
    };

    return galleryController;
}());