/*!
 * jFormValidate v1.0.0 / Additionals Methods
 *
 * Copyright (c) 2015/04 Christian Fortes
 * Released under the MIT license
 * Documentation: http://christianfortes.github.io/jformvalidate
 *
 */

function date(element){
	var date = element.val().split('/');

	// Só quem tem 16 anos ou mais vai passar na data
	var currentYear = new Date().getFullYear();
	var yearUser = currentYear - date[2];

	if(date[0] >= '01' && date[0] <= '31'){
		if(date[1] >= '01' && date[1] <= '12'){
			if(yearUser >= '16' && yearUser <= '100'){
				return true;
			}
		}
	}

	return false;
}

function cpfMethod(element){
	if(!jformApp.validate.cpf($(element)))return false;	
	$.ajax({
		url: '/users/cpfExists/',
		type: 'POST',
		dataType: 'json',
		data: {cpf: $(element).val().replace(/\./g, '').replace('-', '') },
		success: function (dataCPF) {
			if(dataCPF)
				return false;
			return true;
		}
	});
	return true;
}	
