$(function($) {
    var javascriptVars = DATA;
    var feed = new Instafeed({
        get: 'tagged',
        tagName: 'tagnameInstagram',
        target: 'instafeed',
        clientId: 'clientId',
        limit: 9,
        sortB: "most-recent",
        template: '<li>' + ' 	<figure>' + '			<a class="galleryLink" href="{{model.images.standard_resolution.url}}" title="{{caption}}" />' + '				<img src="{{model.images.low_resolution.url}}" alt="{{caption}}" title="{{caption}}" />' + '			</a>' + ' 	</figure>' + ' 	<div class="interaction">' + '			<a href="#" class="left like likePlace" id="{{id}}" username="{{model.user.username}}" link="{{link}}"><i class="ico ico-heart-border-blue"></i><span class="userLike">Curtir</span></a>' + '			<span class="right"><strong class="likeValue" id="{{id}}">{{dermoLikes}}</strong><span class="likeValueText">{{dermoLikesText}}<span></span>' + ' 	</div>' + '</li>',
        after: function() {
            $('.load-more-images a').removeClass('load').find('span').text('Carregar mais fotos');

            $("#instafeed .galleryLink").colorbox({ //plugin para dar zoom ao clicar na imagem
                href: function() {
                    return $(this).attr('href');
                },
                title: function() {
                    return $(this).attr('title');
                },
                current: false
            });
            //marcar as fotos curtidas pelo usuário do sistema
            for (var i = 0, len = javascriptVars.instagramUser.length; i < len; i++) {
                $(".interaction .likePlace").each(function() {
                    if (javascriptVars.instagramUser[i]['image_id'] == $(this).attr("id")) {
                        $(this).removeClass("like");
                        $(this).addClass("unlike");
                        $(this).attr("title", "Descutir");
                        $(this).parent().find(".userLike").html("Descutir");
                    }
                });
            }
            $(".likePlace").on('click', function(event) { //trigger para o evento de like
                event.preventDefault();
                if ($(this).hasClass("checked")) return false;
                $(this).addClass("checked");
                if ($(this).hasClass("like")) { //se a foto está curtida pelo usuário
                    for (var i = 0, len = javascriptVars.instagramUser.length; i < len; i++) {
                        if (javascriptVars.instagramUser[i]['image_id'] == $(this).attr("id")) {
                            javascriptVars.instagramUser.splice(i, 1);
                            break;
                        }
                    }
                } else { //foto não está curtida pelo usuário
                    var object = new Object();
                    object.image_id = $(this).attr("id");
                    javascriptVars.instagramUser.push(object);
                    //adiciona a imagem no array de imagens do usuário
                }
                var elemen = $(this);
                var like = $(this).hasClass("unlike");
                $.ajax({ //faz uma solicitação ajax para buscar todos os likes de todas as fotos
                    url: javascriptVars.controllerActionLike,
                    type: 'POST',
                    data: {
                        image_id: $(elemen).attr("id"),
                        insert: !like,
                        image_link: $(elemen).attr("link"),
                        username: $(elemen).attr("username")
                    },
                    success: function(data) {
                        var id = $(elemen).attr("id");
                        var estaNoArray = false;
                        //colocar as fotos curtidas
                        var parent = $(elemen).parent();
                        parent.find(".likeValue").text("");
                        parent.find(".likeValueText").text("");
                        for (var i = 0; i < javascriptVars.instagramLikes.length; i++) {
                            if (id == javascriptVars.instagramLikes[i].image_id) {
                                var likes = javascriptVars.instagramLikes[i].likes;
                                var text = "";
                                if (like) {
                                    likes = likes - 1;
                                    if (likes == 0) {
                                        javascriptVars.instagramLikes.splice(i, 1);
                                    } else {
                                        javascriptVars.instagramLikes[i].likes = likes;
                                        text = setCurtidaText(likes);
                                    }
                                } else {
                                    likes = likes + 1;
                                    javascriptVars.instagramLikes[i].likes = likes;
                                    text = setCurtidaText(likes);
                                }
                                if (likes > 0)
                                    parent.find(".likeValue").text(likes);
                                parent.find(".likeValueText").text(text);
                                estaNoArray = true;
                                break;
                            }
                        }
                        if (!estaNoArray) { //se a imagem nunca foi curtida, adiciona ela ao array de likes
                            var object = new Object();
                            object.image_id = $(elemen).attr("id");
                            object.likes = 1;
                            javascriptVars.instagramLikes.push(object);
                            parent.find(".likeValue").text("1");
                            parent.find(".likeValueText").text(setCurtidaText(1));
                        }
                        if (like) { //estilo do like
                            $(elemen).removeClass("unlike");
                            $(elemen).addClass("like");
                            $(elemen).attr("title", "Curtir");
                            $(elemen).parent().find(".userLike").html("Curtir");
                        } else {
                            $(elemen).removeClass("like");
                            $(elemen).addClass("unlike");
                            $(elemen).attr("title", "Descutir");
                            $(elemen).parent().find(".userLike").html("Descurtir");
                        }
                        window.setTimeout(function() {
                            $(elemen).removeClass("checked");
                        }, 100);
                    },
                    error: function(a, b, c) {
                        console.log('Erro');
                    }
                });
            });
            appController.core.addLastClass('.ctn-gallery li', 3);
        },
        success: function(data) {
            $(data.data).each(function() {
                for (var i = 0; i < javascriptVars.instagramLikes.length; i++) {
                    if ($(this)[0].id == javascriptVars.instagramLikes[i].image_id) {
                        $(this)[0].dermoLikes = javascriptVars.instagramLikes[i].likes;
                        $(this)[0].dermoLikesText = setCurtidaText(javascriptVars.instagramLikes[i].likes);
                        break;
                    }
                }
            });
        }
    });

    function setCurtidaText(quantidade) {
        if (quantidade == 1) {
            return " pessoa curtiu";
        }
        return " pessoas curtiram";
    }
    //método para buscar os likes de todas as fotos e setar na tela
    function getAllLikes() {
        $.ajax({
            url: javascriptVars.controller + 'returningInstagramLikesJson',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            success: function(data) {
                $(".likeValue, .likeValueText").text("");
                if (data.instagramLikes) {
                    for (var i = 0; i < data.instagramLikes.length; i++) {
                        $(".likeValue[id=" + data.instagramLikes[i].image_id + "]").each(function() {
                            if (data.instagramLikes[i].likes > 0) {
                                $(this).text(data.instagramLikes[i].likes);
                                $(this).closest("span").find(".likeValueText").text(setCurtidaText(data.instagramLikes[i].likes));
                            } else {
                                $(this).text("");
                                $(this).closest("span").find(".likeValueText").text("");
                            }
                        });
                    }
                    javascriptVars.instagramLikes = data.instagramLikes;
                } else {
                    for (var i = 0; i < data.length; i++) {
                        $(".likeValue[id=" + data[i].image_id + "]").each(function() {
                            $(this).text(data[i].likes);
                            $(this).closest("span").find(".likeValueText").text(setCurtidaText(data[i].likes));
                        });
                    }
                    javascriptVars.instagramLikes = data;
                }
                window.setTimeout(getAllLikes, 5000);
            },
            error: function(a, b, c) {
                console.log('Erro');
            }
        });
    }
    //atualização automática dos likes
    (function() {
        window.setTimeout(getAllLikes, 5000);
    })();

    feed.run(); //inicializa o plugin do instagram
    //métodos de ordenação das imagens
    $(".load-more-images").on('click', 'a', function(event) {
        event.preventDefault();
        $(this).addClass('load').find('span').text('Carregando, aguarde...');
        feed.next();
    });
});