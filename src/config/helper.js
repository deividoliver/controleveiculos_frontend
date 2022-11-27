const moment = require('moment')

function float2moeda(num) {
    var x = 0;
    if(num<0) {
    	num = Math.abs(num);
    	x = 1;
    }
    if(isNaN(num)) num = '0';
    var cents = Math.floor((num*100+0.5)%100);
    num = Math.floor((num*100+0.5)/100).toString();
    if(cents < 10) cents = '0' + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
    var ret = num + ',' + cents;
    if (x === 1) ret = ' - ' + ret;
    return ret;
}

function moeda2float(moeda) {
    if(moeda && moeda !== '' && typeof moeda == 'string') {
        moeda = moeda.replace(/\./g,'');
        moeda = moeda.replace(',','.');
 
      return parseFloat(moeda);
    }
    return moeda;
 }

function mascaraPlaca(string) {
	return string.substr(0,3)+'-'+string.substr(3);
}

function formataData(data) {
	if(!data)
		return '';
	return moment(data).format('DD/MM/YYYY HH:mm');
}


module.exports = {
    float2moeda: float2moeda,
    moeda2float: moeda2float,
    mascaraPlaca: mascaraPlaca,
    formataData: formataData
}