var articlesController = (function() {
    'use strict';

    var articlesController = {
        init: function() {

        },
        index: function() {
            appController.core.openHref();

            var require = [
                appController.libsJS.plugin.jQueryMinimalect
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $(".filter-select").minimalect({
                        placeholder: 'Selecione um filtro'
                    });
                }
            });
            $(".filter-select").on('change', function(event) {
                $("#formSelect").submit();
            });
        },
        article: function() {
            var global = {}

            /** Initialize modal script **/
            $('.link-start-quiz').on('click', function(event) {
                event.preventDefault();
                $("#timeSpended").val(new Date().getTime());
                appController.core.modal.show('#modal-quiz');
            });

            /** Checkbox **/

            var require = [
                appController.libsJS.plugin.ionCheckRadio
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $("input[type='radio']").ionCheckRadio();
                }
            });

            /** START - Rating function code **/
            // Seta o rating se tiver pontos
            global.rating = $("#mediaRating").val();
            eachStar('.article-rating li', global.rating);
            if ($("#ratingVoted").val() != "0") {
                $('.article-rating li a').css("cursor", "default");
            }
            // remove o click dos likes
            $(".post-rating.selected").each(function() {
                $(this).find("li a").css("cursor", "default");
                $(this).find("li a").on("click", function(event) {
                    event.preventDefault();
                });
            });

            // método para responder o quiz
            $('.btn-register-quiz').on('click', function(event) {
                event.preventDefault();
                var quiz = parseInt($("#articleQuizId").val());
                var answer = $('input[name="reading"]:checked').val();
                var article = parseInt($("#article_id").val());
                var spendedTime = new Date().getTime() - $("#timeSpended").val();
                $.ajax({
                    url: '/articles/answerArticleQuiz/',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        quiz_id: quiz,
                        answer: answer,
                        article_id: article,
                        miliseconds: spendedTime
                    },
                    success: function(data) {
                        var rightAnswer = parseInt(data.correctAnswer.charAt(data.correctAnswer.length - 1));
                        $(".btn-register-quiz").attr("disabled", "true");
                        $(".link-start-quiz").off("click");
                        $(".link-start-quiz").on("click", function(event) {
                            event.preventDefault();
                        });
                        $(".link-start-quiz").addClass("disabled").text('Quiz respondido');

                        if (!data.correct)
                            $('input[name="reading"]:checked').closest(".icr-label").find(".icr-text").css("color", "red");
                        else
                            $('input[name="reading"]:checked').closest(".icr-label").find(".icr-text").css("color", "#00C5AA");

                        $(".question-quiz input[type=radio]").each(function() {
                            $(this).attr("disabled", "true");
                            if ($(this).val() == rightAnswer && !data.correct) {
                                $(this).closest(".icr-label").find(".icr-text").css("color", "#00C5AA");
                            }
                        });
                        if (data.correct)
                            $(".reply-sucess").addClass("active");
                        else
                            $(".reply-error").addClass("active");
                    },
                    error: function(e, m, r) {
                        console.log("error ajax quiz " + e + " - " + m + " - " + r);
                    }
                });
            });

            // método para adicionar/remover artigo nos favoritos
            $('.favorite').on('click', function(event) {
                event.preventDefault();
                var article = parseInt($("#article_id").val());
                var fav = 1;
                if ($('.favorite').hasClass("active"))
                    fav = 0;
                $.ajax({
                    url: '/articles/favorite/',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        favorite: fav,
                        article_id: article
                    },
                    success: function(data) {
                        if ($('.favorite').hasClass("active")) {
                            $('.favorite').removeClass("active").find("span").text("Adicionar aos Favoritos");
                        } else {
                            $('.favorite').addClass("active").find("span").text("Remover dos Favoritos");
                        }
                    },
                    error: function(e, m, r) {
                        console.log("error ajax favorite " + e + " - " + m + " - " + r);
                    }
                });
            });

            // método dar like/unlike
            $('.like, .unlike').on('click', function(event) {
                event.preventDefault();
                if (!$(this).closest(".post-rating").hasClass("selected")) {
                    var like = ($(this).hasClass("like") ? 1 : 0);
                    var parent = $(this).closest(".comment-post");
                    var commentId = parent.find("input[type=hidden]").val();
                    parent = parent.find(".post-rating");
                    parent.addClass("selected");
                    parent.find("a").css("cursor", "default");
                    $(this).addClass("active");
                    $.ajax({
                        url: '/articles/like/',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            comment_id: commentId,
                            like: like
                        },
                        success: function(data) {},
                        error: function(e, m, r) {
                            console.log("error ajax like " + e + " - " + m + " - " + r);
                        }
                    });
                }
            });

            // método para carregar mais comentários
            $('.load-more-comments').on('click', function(event) {
                event.preventDefault();
				if($(this).hasClass('selected')) return;
				$('.load-more-comments').addClass("selected");
                var article = parseInt($("#article_id").val());
                var page = parseInt($("#pageComments").val());
                page++;
                $("#pageComments").val(page);
                $('.load-more-comments').addClass('load').find('span').text('Carregando, aguarde...');

                $.ajax({
                    url: '/articles/getComments/',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        article_id: article,
                        page: page,
                        insertedComments: $("#insertedComments").val()
                    },
                    success: function(data) {
                        for (var i = 0; i < data.comment.length; i++) {
                            var article = $(".clone").clone(true, true);
                            article.find("img").attr("src", data.comment[i].profile_photo).attr("alt", data.comment[i].full_name);
                            article.find("h1").text(data.comment[i].full_name);
                            article.find(".address").text(data.comment[i].address);
                            article.find(".datePosted").text(data.comment[i].date);
                            article.find("p").text(data.comment[i].content);
                            article.find("input[type=hidden]").val(data.comment[i].id);
                            article.css("display", "block");
                            article.removeClass("clone");
                            if (data.comment[i].checkLike) {
                                var post = article.find(".post-rating");
                                post.addClass("selected");
                                post.find("a").css("cursor", "default");
                            }
                            if (data.comment[i].isLike)
                                article.find(".like").addClass("active");
                            if (data.comment[i].isDisLike)
                                article.find(".unlike").addClass("active");
                            $(article).insertBefore(".load-more-comments");
                        }
                        if (data.comment.length == 0)
                            $('.load-more-comments').remove();
                        else
                            $('.load-more-comments').removeClass('load').find('span').text('Carregar mais comentários');
						window.setTimeout(function() {
                            $('.load-more-comments').removeClass("selected");
                        }, 1000);
                    },
                    error: function(e, m, r) {
                        console.log("error ajax rating" + e + " - " + m + " - " + r);
                    }
                });
            });

            // método para inserir um comentário
            $('.send-comment').on('click', function(event) {
                event.preventDefault();
				if ($(".text-comment").val() != "") {
					$(this).attr("disabled", true);
                    var article = parseInt($("#article_id").val());
                    var com = $(".text-comment").val();
                    $.ajax({
                        url: '/articles/comment/',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            comment: com,
                            article_id: article
                        },
                        success: function(data) {
                            var article = $(".clone").clone(true, true);
                            article.find(".post-rating").css("visibility", "hidden");
                            article.find("img").attr("src", data.profile_photo).attr("alt", data.full_name);
                            article.find("h1").text(data.full_name);
                            article.find(".address").text(data.address);
                            article.find(".datePosted").text(data.date);
                            article.find("p").text(data.content);
                            article.find("input[type=hidden]").val(data.id);
                            article.css("display", "block");
                            article.removeClass("clone");
                            $(article).insertAfter(".comment-area");
                            $(".text-comment").val("");
                            $("#countComments").text(data.count);
                            var insertedComments = parseInt($("#insertedComments").val());
                            insertedComments++;
                            $("#insertedComments").val(insertedComments);
							window.setTimeout(function() {								
								$('.send-comment').removeAttr("disabled");
							}, 100);
                        },
                        error: function(e, m, r) {
                            console.log("error ajax rating" + e + " - " + m + " - " + r);
                        }
                    });
                }
            });

            // Usuario não votou
            // Evento de rating ao click
            $('.article-rating li a').on('click', function(event) {
                event.preventDefault();
                if ($("#ratingVoted").val() == 0) {
                    var count = parseInt($(this).data('number'));
                    var article = parseInt($("#article_id").val());
                    $.ajax({
                        url: '/articles/rating/',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            rate: count,
                            article_id: article
                        },
                        success: function(data) {
                            $("#mediaRating").val(data);
                            eachStar('.article-rating li', $("#mediaRating").val());
                            $("#ratingVoted").val("1");
                            $('.article-rating li a').css("cursor", "default");
                            $('.title-rating').text('Avaliações gerais');
                        },
                        error: function(e, m, r) {
                            console.log("error ajax rating" + e + " - " + m + " - " + r);
                        }
                    });
                }
            });

            // Evento de rating ao hover
            $('.article-rating li').on('mouseover', function(event) {
                event.preventDefault();
                if ($("#ratingVoted").val() == 0) {
                    var count = parseInt($(this).find('a').data('number'));
                    $('.title-rating').text('Sua avaliação');
                    $('.article-rating li a').removeClass('active');
                    eachStar('.article-rating li', count);
                }
            }).on('mouseout', function(event) {
                event.preventDefault();
                if ($("#ratingVoted").val() == 0) {
                    $('.article-rating li a').removeClass('active');
                    $('.title-rating').text('Avaliações gerais');
                    if (global.rating != undefined) {
                        eachStar('.article-rating li', global.rating);
                    }
                }
            });

            // Função de each no rating
            function eachStar(selector, count) {
                $(selector).each(function(index, el) {
                    var number = parseInt($(this).find('a').data('number'));
                    if (number <= count) {
                        $(this).find('a').addClass('active');
                    } else if (number > count) {
                        $(this).find('a').removeClass('active');
                        return false;
                    }
                });
            }

            /** END - Rating function code **/

            $('.comment-area .textarea').on('focus', function(event) {
                $(this).text('');
            });

            $('.ctn-text a:contains("youtube.com/watch")').each(function() {
                var youtube = $(".youtubeClone").clone(true, true);
                youtube.show();
                youtube.removeClass("youtubeClone");
                youtube.find(".url-youtube").val($(this).html().replace("https://", "//").replace("http://", "//"));
                $(this).replaceWith(youtube);
            });

            if ($('.media-youtube').length != 0) {

                $('.media-youtube').each(function() {
                    var itemYoutube = $(this).find('.youtube-movie');
                    var urlCapa = articlesController.youtubeCapa($(this).find('.url-youtube').val(), 'standard');
                    $(this).attr('data-urlcapa', JSON.stringify(urlCapa));
                    $(itemYoutube).attr('style', 'background-image: url(' + urlCapa.image + ');');
                });


                $('.media-youtube').on('click', function(event) {
                    event.preventDefault();
                    var urlCapa = JSON.parse($(this).attr('data-urlcapa'));
                    $(this).find('.youtube-movie').append(appController.core.config.youtube.iframe.html);
                    $(this).find('.youtube-movie').find('.embed-youtube').attr('src', appController.core.config.youtube.iframe.embed + urlCapa.embed + '?autoplay=1&vq=hd720');
                    $(this).find('.youtube-movie').removeAttr('style');
                    $('.ytp-icon').hide();
                });
            }

            /** SCROLL para comentários **/

            $('.link-comment-scroll').on('click', function(event) {
                event.preventDefault();

                $('body').animate({
                    scrollTop: $('.article-comments-area').offset().top
                }, 1000);
            });
        },
        youtubeCapa: function(urlMedia, type) {
            var urlImage;

            urlImage = urlMedia.split('=');

            switch (type) {
                case 'thumb':
                    type = 'default';
                    break;

                case 'high':
                    type = 'hqdefault';
                    break;

                case 'medium':
                    type = 'mqdefault';
                    break;

                case 'standard':
                    type = 'sddefault';
                    break;

                case 'maximum':
                    type = 'maxresdefault';
                    break;
            }

            return {
                image: appController.core.config.youtube.media.image + urlImage[1] + '/' + type + '.jpg',
                embed: urlImage[1]
            };
        },
        category: function() {
            var require = [
                appController.libsJS.plugin.jQueryMinimalect
            ];

            appController.core.require(require, function(hasError, loaded, failed) {
                if (hasError != true) {
                    $(".filter-select").minimalect({
                        placeholder: 'Selecione um filtro'
                    });
                }
            });
            $(".filter-select").on('change', function(event) {
                $("#formSelect").submit();
            });
        }
    };

    return articlesController;
}());