var clubsController = (function() {
    'use strict';

    var clubsController = {
        init: function() {
            var require = [
                appController.libsJS.plugin.flickerplate,
                appController.libsJS.plugin.hammer
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $('.ctn-club-banner').flickerplate({
                        arrows: false,
                        dot_navigation: false,
                        auto_flick: false,
                        block_text: false
                    });
                }
            });
        },
        index: function() {
            $('.lnk-terms').on('click', function(event) {
                event.preventDefault();

                appController.core.modal.show('#modal-terms');
                if ($('.jsModal-ctn.modal-terms').height() > $(window).height()) {
                    $('.jsModal.-active').css({
                        'overflow-y': 'scroll'
                    });
                }
            });
        }
    };

    return clubsController;
}());