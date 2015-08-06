/*!
 * jFormValidate v1.1.0
 *
 * Copyright (c) 2015/04 Christian Fortes
 * Released under the MIT license
 * Documentation: http://christianfortes.github.io/jformvalidate
 * Github: https://github.com/christianfortes/jformvalidate
 * Based on jQuery.validate
 * 
 */

var jformApp = (function() {
	'use strict';
	
	var options = {
		message: {
			text: {
				empty: "Este campo é obrigatório",
				cnpj: "Insira um cnpj válido",
				cpf: "Insira um cnpj válido",
				email: "Insira um email válido",
				url: "Insira uma url válida", 
				cep: "Insira um cep válido", 
				minlength: "Você deve por um mínimo de letras", 
				number: "Insira somente números decimais", 
				extension: "Extensão inválida", 
				letters: "Insira somente letras",
				addmethod: "Personalize a mensagem declarando o atributo data-jform-message",
				errormethod: "Erro: The specified function is not found!",
				errorjquery: "Erro: jFormValidate need the jQuery library!"
			},
			style: {
				this: {
					name: "jform-msg-error",
					type: "."
				},
				element: {
					name: "jform-elem-error",
					type: "."	
				},
				form: {
					name: "jform-form-error",
					type: "."	
				}
			}
		},
		class: {
			stepActive: "active"
		}
	};

	var jformApp = {
		init: function(customOptions){
			if ($('form').length == 1){
				if(this.loadjQuery(window.jQuery)){
					options = $.extend(true, options, customOptions);
					this.submitExecute();
				}else{ console.error(options.message.text.errorjquery); }
			}
		},
		submitExecute: function(){
			var	dataNameStep,
				dataFormName,
				stepMap = [],
				clickCount = 0,
				prevElement,
				stepCount,
				jformStep,
				verifyForm,
				optionValidate,
				dataFormSubmit,
				cacheOptions = {};

			dataNameStep = '[data-jform-step]';
			dataFormSubmit = '[data-jform-submit]';
			dataFormName = 'form';
			verifyForm = $(dataFormName).find(dataNameStep);

			optionValidate = ($(dataFormName).find(dataFormSubmit)[0].dataset.jformSubmit == 'true') ? true : false;

			if($(verifyForm).length >= 1){

				$(verifyForm).first().addClass(options.class.stepActive);
				
				fnSubmitForm();

				$("[data-jform-step-next]").on('click', function(e) {
					e.preventDefault();

					cacheOptions = new Object;

					prevElement = $(this).closest(dataNameStep);
					stepCount = prevElement[0].dataset.jformStep;

					var nameClass = 'jformStep-' + stepCount;
					prevElement.addClass(nameClass);
					var dataAttribute = '.' + nameClass;

					jformStep = $(this)[0].dataset.jformStepNext;
					
					cacheOptions = {
						'this': $(this),
						'dataNameStep': dataNameStep,
						'jformStep': jformStep,
						'clickCount': clickCount
					};

					if (optionValidate){
						if (jQuery.inArray(false, jformApp.submitValidate(dataAttribute)) == -1){
							fnOptionValidate(cacheOptions);
						}
					}else{
						fnOptionValidate(cacheOptions);
					}
				});

				$("[data-jform-step-prev]").on('click', function(e) {
					e.preventDefault();

					prevElement = $(this).closest(dataNameStep);
					stepCount = prevElement[0].dataset.jformStep;

					jQuery.grep(stepMap, function(n, i) {
						if (n == stepCount){
							var positionPrevStep = i - 1;
							jformStep = stepMap[positionPrevStep];
						}
					});

					clickCount = 2;
					fnHideShowSteps(dataNameStep, jformStep, clickCount);
				});

			}else{
				fnSubmitForm();
			}

			function fnOptionValidate(cacheOptions){
				if ($(cacheOptions.this)[0].dataset.jformStepNext != "submit"){	
					fnHideShowSteps(cacheOptions.dataNameStep, cacheOptions.jformStep, cacheOptions.clickCount);
					clickCount = 1;
				}else{
					$(dataFormName).submit();
				}
			}

			function fnHideShowSteps(dataNameStep, jformStep, clickCount){
				$(dataNameStep).each(function(index, el) {
					if (clickCount < 1){
						stepMap.push($(this)[0].dataset.jformStep);
					}

					if($(this)[0].dataset.jformStep == jformStep){
						$(this).addClass(options.class.stepActive);
					}else{
						$(this).removeClass(options.class.stepActive);
					}
				});
			}

			function fnSubmitForm(){
				$(dataFormSubmit).on('click', function(e) {
					if (optionValidate){
						e.preventDefault();
						
						if (jQuery.inArray(false, jformApp.submitValidate('')) == -1){
							$(this).closest(dataFormName).submit();
						}
					}
				});
			}
		},
		submitValidate: function(dataAttribute){

			var formObject = {}, 
				objTemp = [],
				returnTemp,
				returnMessage;

			$('[data-jform]', dataAttribute).each(function(index, el){

				returnTemp = jformApp.validate.empty($(this));

				if(!returnTemp){
					jformApp.getMessage("get", $(this), options.message.text.empty);
					objTemp.push(returnTemp);
				}else{
					jformApp.getMessage("delete", $(this));					
					formObject.data = jformApp.saveData($(this), formObject);

					switch(formObject.data.jform){
						case "cnpj":
							returnTemp = jformApp.validate.cnpj($(this));
							returnMessage = (formObject.data.message == undefined) ? options.message.text.cnpj : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "cpf":
							returnTemp = jformApp.validate.cpf($(this));
							returnMessage = (formObject.data.message == undefined) ? options.message.text.cpf : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "email":
							returnTemp = jformApp.validate.email($(this));
							returnMessage = (formObject.data.message == undefined) ? options.message.text.email : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "url":
							returnTemp = jformApp.validate.url($(this));
							returnMessage = (formObject.data.message == undefined) ? options.message.text.url : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "minlength":
							returnTemp = jformApp.validate.minlength($(this), formObject);
							returnMessage = (formObject.data.message == undefined) ? options.message.text.minlength : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "number":
							returnTemp = jformApp.validate.number($(this));
							returnMessage = (formObject.data.message == undefined) ? options.message.text.number : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "extension":
							returnTemp = jformApp.validate.extension($(this), formObject);
							returnMessage = (formObject.data.message == undefined) ? options.message.text.extension : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "letters":
							returnTemp = jformApp.validate.letters($(this), formObject);
							returnMessage = (formObject.data.message == undefined) ? options.message.text.letters : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "cep":
							returnTemp = jformApp.validate.cep($(this));
							returnMessage = (formObject.data.message == undefined) ? options.message.text.cep : formObject.data.message;
							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;

						case "addmethod":
							returnTemp = jformApp.validate.addmethod($(this), formObject.data.method);
							if (returnTemp == undefined){
								returnTemp = false;
								returnMessage =  options.message.text.empty;
								console.error(options.message.text.errormethod);
							}else{
								returnMessage = (formObject.data.message == undefined) ? options.message.text.addmethod : formObject.data.message;
							}

							(!returnTemp) ? jformApp.getMessage("get", $(this), returnMessage) : "";
							objTemp.push(returnTemp);
						break;
					}
				}
			});

			return objTemp;
		},
		validate: {
			empty: function(data){
				var tmpVal, 
					tmpOpt, 
					tmpObject = [],
					count,
					element,
					i;

				tmpVal = $(data)[0].dataset;
				tmpOpt = (tmpVal.jformOption) ? tmpVal.jformOption : 1;
				tmpVal = (tmpVal.jform == "radio" || tmpVal.jform == "checkbox") ? $(data)[0].dataset.jform : data[0].nodeName.toLowerCase();
				
				switch(tmpVal){
					case "select":
						return ($(data).val() && $(data).val().length > 0) ? true : false;
					break;

					case "radio":
					case "checkbox":
						element = $("[type='" + tmpVal + "']");

						for (i = element.length - 1; i >= 0; i--) {
							tmpObject.push(element[i].checked);
						}

						if (tmpVal == "radio"){
							return (jQuery.inArray(true, tmpObject) == -1) ? false : true;
						}else{
							count = tmpObject.filter(function(value){
							    return value === true;
							}).length;

							return false || count >= tmpOpt;
						}
					break;

					default:
						return (data.val() == "" || data.val() == undefined || data.val() == null) ? false : true;
					break;
				}
			},
			cnpj: function(data) {
				var arg = {}, i, seeType;
				arg.cnpj = data.val();
				
				seeType = parseInt(data.val());

				if (isNaN(seeType)){
					return false;
				}

		        if (arg.cnpj.length == 0) {
		            return false;
		        }

		        arg.cnpj = arg.cnpj.replace(/\D+/g, '');
		        arg.equal = 1;
		 
		        for (i = 0; i < arg.cnpj.length - 1; i++){
					if (arg.cnpj.charAt(i) != arg.cnpj.charAt(i + 1)) {
						arg.equal = 0;
						break;
					}

					if (arg.equal){
						return false;
					}
		        }
		       
		        arg.size = arg.cnpj.length - 2;
		        arg.numbers = arg.cnpj.substring(0,arg.size);
		        arg.digits = arg.cnpj.substring(arg.size);
		        arg.sum = 0;
		        arg.after = arg.size - 7;
		        for (i = arg.size; i >= 1; i--) {
					arg.sum += arg.numbers.charAt(arg.size - i) * arg.after--;
					if (arg.after < 2){
						arg.after = 9;
					}
		        }
		        
		        arg.result = arg.sum % 11 < 2 ? 0 : 11 - arg.sum % 11;
		        if (arg.result != arg.digits.charAt(0)){
					return false;
		        }

		        arg.size = arg.size + 1;
		        arg.numbers = arg.cnpj.substring(0,arg.size);
		        arg.sum = 0;
		        arg.after = arg.size - 7;
		        
		        for (i = arg.size; i >= 1; i--) {
		            arg.sum += arg.numbers.charAt(arg.size - i) * arg.after--;
		            if (arg.after < 2){
		            	arg.after = 9;
		            }
		        }
		 
		        arg.result = arg.sum % 11 < 2 ? 0 : 11 - arg.sum % 11;

		        return (arg.result == arg.digits.charAt(1));
			},
			cpf: function(data) {
				var value, expReg, cpf, i, y, x, a = [], b = new Number, c = 11, result;
				cpf = jQuery.trim(data.val()).replace(/\.|-/g,'');
				while(cpf.length < 11) cpf = "0"+ cpf;
				expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
				for (i=0; i<11; i++){
					a[i] = cpf.charAt(i);
					if (i < 9) b += (a[i] * --c);
				}
				if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }
				b = 0; c = 11;
				for (y=0; y<10; y++) b += (a[y] * c--);
				if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11-x; }
				
				result = true;
				if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) result = false;
				return false || result;
			},
			email: function(data){
				var reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
				return false || reg.test(data.val());
			},
			url: function(data){
				var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
				return false || reg.test(data.val());
			},
			cep: function(data){
				var cep = data.val(), 
					reg = /\d\d((\d\d\d)|(\.\d\d\d-))\d\d\d/;
				cep = cep.replace(/\.|\-/g, '');
				return false || reg.test(cep);
			},
			minlength: function(data, object){
				return false || data.val().length >= object.data.option;
			},
			number: function(data){
				var reg = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
				return false || reg.test(data.val());
			},
			extension: function(data, object){
				var param;
				param = typeof object.data.option === "string" ? object.data.option.replace(/,/g, "|") : "png|jpe?g|gif";
				return false || data.val().match(new RegExp(".(" + param + ")$", "i"));
			},
			letters: function(data){
				var reg = /^[a-zA-Z]+$/;
				return false || reg.test(data.val());
			},
			addmethod: function(data, method){
				var fn = window[method];
				return (fn != undefined) ? fn(data) : undefined;
			}
		},
		saveData: function(el, formObject){
			formObject.data = new Object;
			formObject.data.jform = $(el).data('jform').toLowerCase();

			if ($(el).is("[data-jform-message]")) {
				formObject.data.message = $(el).data('jform-message');
			}

			if ($(el).is("[data-jform-option]")) {
				formObject.data.option = $(el).data('jform-option');
			}

			if ($(el).is("[data-jform-method]")) {
				formObject.data.method = $(el).data('jform-method');
			}

			return formObject.data;
		},
		getMessage: function(op, el, message){
			var thisMessageName = options.message.style.this.name,
				thisMessageType = options.message.style.this.type,
				elemMessageName = options.message.style.element.name,
				elemMessageType = options.message.style.element.type,
				elemFormName = options.message.style.form.name,
				elemFormType = options.message.style.form.type,
				elemForm = $(el).closest('form');

			switch(op){
				case "get":
					if($(el).next(thisMessageType + thisMessageName).length != 0){
						$(el).next(thisMessageType + thisMessageName).text(message);
					}else{
						(!$(el).hasClass(elemMessageName)) ? $(el).addClass(elemMessageName) : "";
						(!$(elemForm).hasClass(elemFormName)) ? $(elemForm).addClass(elemFormName) : "";
						$(el).after("<span class='" + thisMessageName + "'>" + message + "</span>");
					}
				break;

				case "delete":
					($(el).hasClass(elemMessageName)) ? $(el).removeClass(elemMessageName) : "";
					($(elemForm).hasClass(elemFormName)) ? $(elemForm).removeClass(elemFormName) : "";
					$(el).next(thisMessageType + thisMessageName).remove();
				break;
			}
		},
		loadjQuery: function(jquery){
			return (typeof jquery == "function" && jquery != undefined) ? true : false;
		}
	};

	return jformApp;
}());