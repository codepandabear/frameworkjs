var usersController = (function() {
    'use strict';

    var usersController = {
        init: function() {

        },
        dashboard: function() {
            var require = [
                appController.libsJS.plugin.flickerplate,
                appController.libsJS.plugin.hammer
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $('.home-banner-header').flickerplate({
                        arrows: true,
                        dot_navigation: false,
                        auto_flick: false,
                        block_text: false
                    });

                    $('.home-banner-footer').flickerplate({
                        arrows: false,
                        dot_navigation: false,
                        auto_flick: false,
                        block_text: false
                    });

                    var homeBannerFooter = $('.home-banner-footer ul li');

                    $(homeBannerFooter).each(function(index, el) {
                        if ($(this).data('href') == "") {
                            $(this).css('cursor', 'default');
                        }
                    });

                    $(homeBannerFooter).on('click', function(event) {
                        event.preventDefault();

                        var linkBanner = $(this).data('href');
                        if (linkBanner != "") {
                            window.location.href = linkBanner;
                        }
                    });
                }
            });
        },
        login: function() {
            var require = [
                appController.libsJS.plugin.jformValidate
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    jformApp.init();
                }
            });
        },
        index: function() {
            var require = [
                appController.libsJS.component.tabs,
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {

                    usersController.register();

                    // Click de add produtos
                    $('.produtos .js-add-prod').on('click', function(event) {
                        event.preventDefault();
                        var elemPai = $(this).closest('.produto');
                        var pointsProd = parseInt($(elemPai).find('.produto-bolinha-pontos').text());
                        var pointsUser = parseInt($('.saldo-number').text());

                        if (pointsUser < pointsProd) {
                            var options = {
                                titleAlert: 'Pontos insuficientes',
                                textAlert: 'Sua pontuação é insuficiente para trocar pelo produto selecionado',
                                typeAlert: 'warning'
                            }
                            appController.core.alerts(options);
                        } else {
                            $('.saldo-number').text(pointsUser - pointsProd);
                            $(this).addClass('hidden');
                            addProduto($(elemPai).data('prod'));
                            $(this).next('.js-remove-prod').removeClass('hidden');
                        }
                    });

                    $('.produtos .js-remove-prod').on('click', function(event) {
                        $.ajax({
                            url: '/users/trocarPontos/',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                produtosAdicionados: $('.prod-selected').val()
                            },
                            success: function(data) {

                            }
                        });
                    });

                    $('.change-extrato-periodo').on('change', function(event) {
                        $.ajax({
                            url: '/users/changeExtratoPeriodo/',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                periodo: $(this).val()
                            },
                            success: function(data) {
                                location.reload();
                            }
                        });
                    });

                    // Click de remoção de produtos
                    $('.produtos .js-remove-prod').on('click', function(event) {
                        event.preventDefault();
                        var elemPai = $(this).closest('.produto');
                        var pointsProd = parseInt($(elemPai).find('.produto-bolinha-pontos').text());
                        var pointsUser = parseInt($('.saldo-number').text());

                        $('.saldo-number').text(pointsUser + pointsProd);
                        $(this).addClass('hidden');
                        removeProduto($(elemPai).data('prod'));
                        $(this).prev('.js-add-prod').removeClass('hidden');
                    });

                    $('.comprar').on('click', function(event) {
                        if ($('.prod-selected').val() == '') {
                            var options = {
                                titleAlert: 'Nenhum produto selecionado',
                                textAlert: 'Selecione um produto',
                                typeAlert: 'warning'
                            }
                            appController.core.alerts(options);
                            event.preventDefault();
                        } else {
                            swal({
                                    title: "Confirmação?",
                                    text: "Você realmente deseja trocar os pontos pelos produtos selecionados?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Sim, confirmo!",
                                    closeOnConfirm: false
                                },
                                function(isConfirm) {
                                    if (isConfirm) {
                                        $(".form-comprar").submit();
                                    }
                                });
                            event.preventDefault();
                        }
                    });
                }
            });

            // Adiciona os produtos
            function addProduto(id) {
                var valuesInput = $('.prod-selected').val();
                var arrProdutos = [];
                if (valuesInput != "") {
                    arrProdutos = valuesInput.split(',');
                }
                arrProdutos.push(id);
                $('.prod-selected').val(arrProdutos.toString());
            }

            // Remove os produtos
            function removeProduto(id) {
                var valuesInput = $('.prod-selected').val();
                var arrProdutos = valuesInput.split(',');
                var removeItem = arrProdutos.indexOf(id);
                arrProdutos.splice(removeItem, 1);
                $('.prod-selected').val(arrProdutos.toString());
            }
        },
        register: function() {
            var require = [
                appController.libsJS.plugin.jformValidate,
                appController.libsJS.plugin.jformValidateAdditional,
                appController.libsJS.plugin.ionCheckRadio,
                appController.libsJS.plugin.jqueryMaskedInput,
                appController.libsJS.plugin.jQueryMinimalect,
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    // Plugin de validação no form
                    jformApp.init();

                    $('.step-profissional').attr('disabled', true);

                    // Estilo Checkbox
                    $("input[type='radio'], input[type='checkbox']").ionCheckRadio();

                    // Mascára para inputs
                    $(".date").mask("99/99/9999");
                    $(".cpf").mask("999.999.999-99");
                    $(".cep").mask("99999-999");
                    $(".phone").mask("(99) 9999-9999?9");

                    // Estilo select
                    $("select").minimalect({
                        placeholder: 'Selecione uma opção'
                    });

                    $('.profissionais .icr-label').each(function(index, el) {
                        if (index == 0 || index == 1) {
                            $(this).find('.radio-prof').attr('data-elements', 'box-rede');
                        }

                        if (index == 2) {
                            $(this).find('.radio-prof').attr('data-elements', 'box-rede, box-funcao');
                        }

                        if (index == 3) {
                            $(this).find('.radio-prof').attr('data-elements', 'box-rede, box-nova-funcao');
                        }

                    });

                    $('.icr-label .radio-prof').on('change', function(event) {
                        event.preventDefault();
                        changeProf(this, true);
                    });

                    function changeProf(elem, clearValue) {
                        var inputElement = $(elem);
                        var dataElement = $(inputElement).data('elements');
                        dataElement = dataElement.replace(/\s/g, "").split(',');

                        if ($('.step-profissional').attr('disabled') != undefined) {
                            $('.step-profissional').attr('disabled', false);
                        };
                        $('.profissionais .ctn-radio').addClass('hidden');
                        if (clearValue) {
                            $('.profissionais .input-new-network').val('');
                            $('.profissionais select').val('');
                        }

                        for (var i = 0; i < dataElement.length; i++) {
                            $('.profissionais').find('.' + dataElement[i]).removeClass('hidden');
                        }
                    }

                    if ($(".radio-prof:checked").length > 0)
                        changeProf($(".radio-prof:checked"), false);
                    otherNetwork($('.network'), false);

                    function otherNetwork(elem, clearValue) {
                        if ($(elem).val() == 'OUTRAS')
                            $('.profissionais .box-nova-rede').removeClass('hidden');
                        else {
                            $('.profissionais .box-nova-rede').addClass('hidden');
                            if (clearValue) {
                                $('.profissionais .input-new-network, .profissionais .input-new-function').val("");
                            }
                        }
                    }

                    $('.network').on('change', function(event) {
                        event.preventDefault();
                        otherNetwork(this, true);
                    });

                    $('.selectFunction').on('change', function(event) {
                        event.preventDefault();

                        if ($(this).val() == 'newFunction')
                            $('.profissionais .box-nova-funcao').removeClass('hidden');
                        else {
                            $('.profissionais .box-nova-funcao').addClass('hidden');
                            $('.profissionais .input-new-function').val("");
                        }
                    });

                    $('.step-profissional').on('click', function(event) {
                        event.preventDefault();

                        if ($('.radio-prof:checked').length > 0) {

                        }
                    });

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
            });

            $('.lnk-file').on('click', function(event) {
                event.preventDefault();

                $('.profile-foto').click();

                $('.profile-foto').on('change', function(event) {
                    event.preventDefault();
                    if ($('.profile-foto').val() != "") {
                        $('.inp-file').removeClass('jform-elem-error');
                        $('.inp-file').parent().find(".jform-msg-error").remove();
                        var fileExtension = $(".profile-foto").prop("files")[0]['type'];
                        if (fileExtension != 'image/jpeg' && fileExtension != 'image/jpg' && fileExtension != 'image/png') {
                            $('.inp-file').addClass('jform-elem-error');
                            $('.inp-file').parent().append('<span class="jform-msg-error cpf-error">Imagem inválida</span>');
                            $('.inp-file').val("");
                            $(".imagePreview").attr("src", $(".imagePreview").attr("data-default-src"));
                        } else {
                            previewImage();
                            $('.inp-file').val($(".profile-foto").prop("files")[0]['name']);
                        }
                    };
                });
            });

            $(".-next").on('click', function(event) {
                if ($(".jform-elem-error").length > 0) {
                    event.preventDefault(); //have errors
                }
            });

            function previewImage() {
                var oFReader = new FileReader();
                oFReader.readAsDataURL($(".profile-foto").prop("files")[0]);
                oFReader.onload = function(oFREvent) {
                    $(".imagePreview").attr("src", oFREvent.target.result);
                };
            }

            $('[data-jform-step-next=02]').on('click', function(event) {
                //checkUsername();
                //checkCPF();
                // if ($(".jform-elem-error").length > 0){
                // event.preventDefault(); //have errors
                // return false;
                // }
            });

            $('.estado').on('change', function(event) {
                $.ajax({
                    url: '../cities/getListByStateId/' + $(this).val(),
                    dataType: 'json',
                    success: function(cities) {
                        $('.cidade').empty();
                        $('.cidade').append($('<option>Selecione</option>'));
                        for (var i = 0; i < cities.length; i++) {
                            $('.cidade').append($('<option value="' + cities[i].id + '">' + cities[i].name + '</option>'));
                        }
                        $('.cidade').attr('disabled', null);
                    }
                });
            });


            $('.cep').on('change', function(event) {
                event.preventDefault();
                if ($(this).val() == "") return;
                var value = $(this).val().replace('-', '');

                $.ajax({
                    url: 'http://correiosapi.apphb.com/cep/' + value,
                    type: 'POST',
                    dataType: 'jsonp',
                    success: function(data) {
                        var estado = "";
                        $('.residenciais .estado option').each(function() {
                            if ($(this).attr("data-short") == data.estado) {
                                estado = $(this).attr("value");
                                return false;
                            }
                        });
                        $.ajax({
                            url: '../cities/getListByStateId/' + estado,
                            dataType: 'json',
                            success: function(cities) {
                                $('.cidade').empty();
                                $('.cidade').append($('<option>Selecione</option>'));
                                for (var i = 0; i < cities.length; i++) {
                                    if (data.cidade == cities[i].name)
                                        $('.cidade').append($('<option value="' + cities[i].id + '" selected="selected">' + cities[i].name + '</option>'));
                                    else
                                        $('.cidade').append($('<option value="' + cities[i].id + '">' + cities[i].name + '</option>'));
                                }
                                $('.residenciais .logradouro').val(data.tipoDeLogradouro + ' ' + data.logradouro);
                                $('.residenciais .bairro').val(data.bairro);
                                $(".residenciais .estado").val(estado);
                                $('.residenciais .pais').val('1');
                                $('.cidade').attr('disabled', null);
                                $(".numero").focus();
                            }
                        });
                    }
                });
            });

            function isEmail(email) {
                var b = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return b.test(email);
            }

            function checkCPF() {
                $('.cpf').removeClass('jform-elem-error');
                $('.cpf').parent().find(".jform-msg-error").remove();
                if (!jformApp.validate.cpf($(".cpf"))) {
                    $('.cpf').addClass('jform-elem-error');
                    $('.cpf').parent().append('<span class="jform-msg-error cpf-error">Digite um cpf válido</span>');
                } else {
                    $.ajax({
                        url: '/users/cpfExists/',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            cpf: $('.cpf').val().replace(/\./g, '').replace('-', '')
                        },
                        success: function(dataCPF) {
                            if (dataCPF) {
                                $('.cpf').addClass('jform-elem-error');
                                $('.cpf').parent().append('<span class="jform-msg-error cpf-error">Cpf já utilizado</span>');
                            }
                        }
                    });
                }
            }

            function checkEmail() {
                $('.email').removeClass('jform-elem-error');
                $('.email').parent().find(".jform-msg-error").remove();
                if (!isEmail($('.email').val())) {
                    $('.email').addClass('jform-elem-error');
                    $('.email').parent().append('<span class="jform-msg-error">E-mail inválido</span>');
                } else {
                    $.ajax({
                        url: '/users/emailExists/',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            email: $('.email').val()
                        },
                        success: function(data) {
                            if (data) {
                                $('.email').addClass('jform-elem-error');
                                $('.email').parent().append('<span class="jform-msg-error">E-mail já utilizado</span>');
                            }
                        }
                    });
                }
            }

            function checkUsername() {
                $('.username').removeClass('jform-elem-error');
                $('.username').parent().find(".jform-msg-error").remove();
                if ($('.username').val() != "") {
                    $.ajax({
                        url: '/users/usernameExists/',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            username: $('.username').val()
                        },
                        success: function(data) {
                            if (data) {
                                $('.username').addClass('jform-elem-error');
                                $('.username').parent().append('<span class="jform-msg-error">Username já utilizado</span>');
                            }
                        }
                    });
                }
            }

            function checkPassword() {
                var valid = true;
                $('.password').removeClass('jform-elem-error');
                $('.password').parent().find(".jform-msg-error").remove();
                if ($('.password').val().length < 8) {
                    $('.password').addClass('jform-elem-error');
                    $('.password').parent().append('<span class="jform-msg-error">A senha deve conter ao menos 8 dígitos</span>');
                    valid = false;
                }
                return valid;
            }

            function checkConfirmPassword() {
                var valid = true;
                $('.confirmPassword').removeClass('jform-elem-error');
                $('.confirmPassword').parent().find(".jform-msg-error").remove();
                if ($('.password').val() != $(".confirmPassword").val()) {
                    $('.confirmPassword').addClass('jform-elem-error');
                    $('.confirmPassword').parent().append('<span class="jform-msg-error">Senhas não conferem</span>');
                    valid = false;
                }
                return valid;
            }

            $('.finish-register').on('click', function(event) {
                if ($('.password').length) {
                    checkPassword();
                    checkConfirmPassword();
                    checkEmail();
                }
                if ($('.registro .check-terms:checked').length <= 0) {
                    var options = {
                        titleAlert: 'Aviso!',
                        textAlert: 'Para se cadastrar você deve aceitar os termos de uso.',
                        typeAlert: 'warning'
                    }

                    $('.registro .check-terms').closest('.icr-label').find('.icr-text').addClass('error');
                    appController.core.alerts(options);
                    return false;
                } else {
                    return true;
                }
            });
        },
        recover: function() {
            function checkPassword() {
                var valid = true;
                $('.password').removeClass('jform-elem-error');
                $('.password').parent().find(".jform-msg-error").remove();
                if ($('.password').val().length < 8) {
                    $('.password').addClass('jform-elem-error');
                    $('.password').parent().append('<span class="jform-msg-error">A senha deve conter ao menos 8 dígitos</span>');
                    valid = false;
                }
                return valid;
            }

            function checkConfirmPassword() {
                var valid = true;
                $('.confirmPassword').removeClass('jform-elem-error');
                $('.confirmPassword').parent().find(".jform-msg-error").remove();
                if ($('.password').val() != $(".confirmPassword").val()) {
                    $('.confirmPassword').addClass('jform-elem-error');
                    $('.confirmPassword').parent().append('<span class="jform-msg-error">Senhas não conferem</span>');
                    valid = false;
                }
                return valid;
            }


            $('.btn-change-password').on('click', function(event) {
                if ($('.password').length) {
                    checkPassword();
                    checkConfirmPassword();
                    return $('.jform-elem-error').length == 0;
                }
            });
        }
    };

    return usersController;
}());