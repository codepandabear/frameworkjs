var appController = (function() {
    'use strict';

    var jsVar = typeof DATA !== 'undefined';

    var appController = {
        init: function() {
            var require = [
                this.config.libJS.plugin.jquery,
                this.config.libJS.plugin.sweetalert
            ];

            this.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {

                    if (jsVar) {
                        jsVar = DATA;

                        if (jsVar.alertFunction != undefined) {
                            if (jsVar.alertFunction.actionAlert) {
                                appController.alerts(jsVar.alertFunction);
                            }
                        }
                    }

                    appController.switchRoute();

                    /** Ativando busca do topo **/
                    $('.link-search').on('click', function(event) {
                        event.preventDefault();
                        appController.modal.show('#modal-search');
                        $(".inputSearch").focus();
                    });

                }
            });
        },
        config: {
            rootPathJS: 'webroot/js/front',
            libJS: {
                plugin: {
                    jquery: 'webroot/js/front/bower_components/jquery/dist/jquery.js',
                    sweetalert: 'webroot/js/front/bower_components/sweetalert/dist/sweetalert.min.js',
                    flickerplate: 'webroot/js/front/bower_components/flickerplate/dist/flickerplate.js',
                    hammer: 'webroot/js/front/bower_components/flickerplate/dist/hammer-v2.0.3.js',
                    jformValidate: 'webroot/js/front/bower_components/jformvalidate/src/jform.validate.js',
                    jformValidateAdditional: 'webroot/js/front/bower_components/jformvalidate/dist/jform.additional.js',
                    jQueryAccordion: 'webroot/js/front/plugins/jquery.accordion.js',
                    jQueryMinimalect: 'webroot/js/front/plugins/jquery.minimalect.js',
                    instagram: 'webroot/js/front/plugins/instagram.js',
                    instafeed: 'webroot/js/front/plugins/instafeed.js',
                    jQueryColorbox: 'webroot/js/front/bower_components/jquery-colorbox/jquery.colorbox.js',
                    ionCheckRadio: 'webroot/js/front/bower_components/ion-checkradio/js/ion.checkRadio.js',
                    jqueryMaskedInput: 'webroot/js/front/bower_components/jquery.maskedinput/dist/jquery.maskedinput.js',
                    oldDist: 'webroot/js/dist.js',
                },
                component: {
                    tabs: 'webroot/js/front/controller/components/component-tabs.js'
                }
            },
            youtube: {
                media: {
                    image: 'http://img.youtube.com/vi/'
                },
                iframe: {
                    html: '<iframe class="embed-youtube" src="" frameborder="0" allowfullscreen></iframe>',
                    embed: '//www.youtube.com/embed/'
                }
            },
        },
        alerts: function(customOptions) {
            // Referência: http://t4t5.github.io/sweetalert/
            var options,
                objectOptions;

            options = {
                styleAlert: 'simple',
                titleAlert: '',
                textAlert: '',
                typeAlert: ''
            }

            objectOptions = $.extend(true, options, customOptions);

            swal({
                title: objectOptions.titleAlert,
                text: objectOptions.textAlert,
                type: objectOptions.typeAlert
            });
        },
        switchRoute: function() {
            var controllerFile,
                controllerMethodInit,
                controllerMethodPage,
                pageJSRequire;

            if (jsVar) {
                if (DATA.ctl.require) {
                    // Definindo arquivo de controller
                    controllerFile = DATA.ctl.control + 'Controller';
                    // Definindo método inicial de controller
                    controllerMethodInit = controllerFile + '.init();';
                    // Definindo método especifico da página
                    controllerMethodPage = controllerFile + '.' + DATA.ctl.action + '();';
                    // Definindo arquivo controller que será incluido na página
                    pageJSRequire = this.config.rootPathJS + '/controller/' + controllerFile + '.js';
                    // Chamando e executando a controller e método
                    this.require(pageJSRequire, function(hasError, loaded, failed) {
                        if (hasError != true) {
                            eval(controllerMethodInit);
                            eval(controllerMethodPage);
                        }
                    });

                    // Add class in menu itens header
                    $('ul.bx-topo-menu li a[href="/' + DATA.ctl.control + '"]').addClass('active');

                    // Name controller and method executable in page
                    if (DATA.ctl.debugJS) {
                        console.log('Controller: ' + controllerFile + '.js');
                        console.log('Method Init: ' + controllerMethodInit);
                        console.log('Method Page: ' + controllerMethodPage);
                    };
                }
            } else {
                console.error('Defina a variável DATA com suas respectivas propriedades');
            }
        },
        require: function(src, callback) {
            if (!(src != null && (typeof src == 'string' || typeof src == 'object'))) return;
            var src = typeof src == 'string' ? [src] : src;
            var total = [];
            var loaded = [];
            var failed = [];
            var fn = function(e) {
                if (e.type == 'load') loaded.push(e.target.src);
                else failed.push(e.target.src);
                if ((loaded.length + failed.length) == total.length && typeof callback == 'function') callback(!!failed.length, loaded, failed);
            };

            var load = function(src) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = '//' + window.location.host + '/' + src;
                s.addEventListener('error', fn, false);
                s.addEventListener('load', fn, false);
                document.body.appendChild(s);
                return s.src;

            };
            for (var i in src) {
                var s = src[i].split(/[\s,]+/);
                for (var j in s)
                    if (total.indexOf(s[j]) < 0) total.push(load(s[j]));
            }
        },
        openHref: function() {
            $('[data-href]').on('click', function(event) {
                event.preventDefault();
                window.location.href = $(this).data('href');
            });
        },
        addLastClass: function(elem, divisor) {
            var i = 1;
            var limit = divisor;
            $(elem).each(function(index, el) {
                if (i >= limit) {
                    $(this).addClass('last-item');
                    i = 0;
                }

                i++;
            });
        },
        modal: {
            show: function(elem) {
                $('.jsModal').addClass('-active');
                $('.jsModal-ctn' + elem).show();
                $('body').addClass('jsModal-active');
                console.log($('.jsModal-ctn' + elem));
                $('.jsModal-ctn' + elem).focus();
                this.click();
            },
            close: function() {
                $('.jsModal').removeClass('-active');
                $('.jsModal-ctn').hide();
                $('body').removeClass('jsModal-active');
            },
            click: function() {
                $('.jsModal-close').on('click', function(event) {
                    event.preventDefault();

                    appController.modal.close();
                });

                $(".jsModal").click(function(e) {
                    if (e.target.className == "jsModal -active") {
                        appController.modal.close();
                    }
                });

                document.onkeydown = function(evt) {
                    evt = evt || window.event;
                    if (evt.keyCode == 27) {
                        appController.modal.close();
                    }
                };
            }
        }
    };

    return {
        core: appController,
        libsJS: appController.config.libJS
    };
}());

document.addEventListener("DOMContentLoaded", function() {
    appController.core.init();
}, false);