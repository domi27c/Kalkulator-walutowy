const submitButton = document.querySelector('.submit-button');
const result = document.querySelector('.result');
const select1 = document.querySelector('.select-1');
const select2 = document.querySelector('.select-2');
let amount = document.querySelector('.start-value');


function createOptions(select, tab){
  for (let i=0; i<tab.length; i++){
    var option = document.createElement('OPTION');
    option.setAttribute('value', tab[i]);
    option.setAttribute('class', 'curr-options')
    option.innerText = tab[i];
    select.appendChild(option);
  }
}

function downloadCurrencies(){
  fetch('http://api.nbp.pl/api/exchangerates/tables/c')
    .then(resp => resp.json())
    .then(resp => {
      var arrCodes = [];
      var arrCoursesAsk = [];
      var arrShortCodes = [];
      resp[0].rates.forEach(el => {
        arrCodes.push(el.code + ' - ' + el.currency);
        arrCoursesAsk.push(el.ask);
        arrShortCodes.push(el.code);
      });
      arrCodes.unshift('PLN - złoty polski')
      arrShortCodes.unshift('PLN')
      arrCoursesAsk.unshift(1)
      createOptions(select1, arrCodes)
      createOptions(select2, arrCodes)

      function countResult(bidTab, codesTab){
        let val1 = select1.value,
            val2 = select2.value,
            exchangeRate1 = bidTab[codesTab.indexOf(val1)],
            exchangeRate2 = bidTab[codesTab.indexOf(val2)];
            amountVal = amount.value
        return amountVal * exchangeRate1 / exchangeRate2
      }

      submitButton.addEventListener('click', function(){
        var code1 = arrShortCodes[arrCodes.indexOf(select1.value)];
        var code2 = arrShortCodes[arrCodes.indexOf(select2.value)];
        if (amount.value == 0 || amount.value == '') { amount.value = 0 };
        result.innerText = amount.value + ' '+code1
        +' = '+Math.round(countResult(arrCoursesAsk, arrCodes) * 100) / 100+' '+code2
      })
    })};

    var main = function(){

      $.ajax({
        url: 'http:api.nbp.pl/api/exchangerates/tables/C?format=JSON',
        method: 'GET',
      }) .then(function(data) {
        printTable(data[0].rates);		
        console.log(data[0].effectiveDate);
      });
    
      function printTable(rates) {
        for (var i = 0; i<rates.length; i++){
          $('#exchange').append('<tr><td>' + rates[i].code + '</td><td>' + rates[i].currency
            + '</td><td>' + Math.round(rates[i].ask*1000)/1000 + '</td></tr>')
        }
      };
    };

downloadCurrencies();
$(document).ready(main);