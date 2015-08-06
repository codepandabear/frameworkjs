var coursesController = (function() {
    'use strict';

    var coursesController = {
        init: function() {
            var require = [
                appController.libsJS.plugin.jQueryAccordion
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $(".accordion").accordion();

                    $('.bg-brand, .sub-list-item li > a').on('click', function(event) {
                        event.preventDefault();
                        var targetClick = event.target.className;

                        if (targetClick != "ico-check-black-bottom") {
                            $(this).next('ul').hide();
                            window.location.href = $(this).attr('href');
                        } else {
                            if ($(this).hasClass('link-release')) {
                                window.location.href = $(this).attr('href');
                            }

                            history.pushState('', '', '');
                        }
                    });
                }
            });
        },
        index: function() {

        },
        category: function() {

        },
        contact: function() {

            var require = [
                appController.libsJS.plugin.jQueryMinimalect,
                appController.libsJS.plugin.jformValidate
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    jformApp.init();

                    $('.filter-assunto').minimalect({
                        placeholder: 'Selecione um filtro'
                    });

                    $('.filter-assunto').val('');
                }
            });
        },
        course: function() {

        }
    };

    return coursesController;
}());