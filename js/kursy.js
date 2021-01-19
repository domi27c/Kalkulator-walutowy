document.addEventListener("DOMContentLoaded", function() {
    (function () {
        var http_request = false;
        const tab = document.getElementById('exchangeRate');
        function makeRequest(url) {
    
            http_request = false;
    
            if (window.XMLHttpRequest) { // Mozilla, Safari,...
                http_request = new XMLHttpRequest();
                if (http_request.overrideMimeType) {
                    http_request.overrideMimeType('text/xml');
                    /* Niektóre wersje przeglądarek opartych na technologii 
                    Mozilli nie zadziałają poprawnie, jeżeli odpowiedź z serwera nie będzie 
                    opisana XML-owym nagłówkiem mime-type. Aby rozwiązać ten problem, można użyć 
                    dodatkowej metody do nadpisania nagłówka wysyłanego przez serwer, jeśli nie jest to text/xml
                    A u nas jest to json
                    */
                }
            } else if (window.ActiveXObject) { // IE
                try {
                    http_request = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        http_request = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) { }
                }
            }
    
            if (!http_request) {
                tab.innerHTML = 'Poddaję się :( Nie mogę stworzyć instancji obiektu XMLHTTP';
                return false;
            }
            http_request.onreadystatechange = function () { makeMagic(http_request); };
            http_request.open('GET', url, true);
            http_request.send(null);
    
        }
    
        function makeMagic(http_request) {
    
            if (http_request.readyState == 4) {
                if (http_request.status == 200) {
                    const data = JSON.parse(http_request.responseText);
                    function createTable() {
                        let kursy = '<h2>Kurs NBP ' + data[0].effectiveDate + '</h2>' +
                            '<table><thead><tr><th>WALUTA</th>' +
                            '<th>SYMBOL</th>' +
                            '<th>SPRZEDAŻ</th>' +
                            '<th>SKUP</th></tr></thead><tbody>';
                        for (let i = 0; i < data[0].rates.length; i++) {
                            kursy += "<tr><th id='td-" + i + "'" + ">" + data[0].rates[i].currency +
                                "</th>" + "<th>" + data[0].rates[i].code + "</th>" + "<th>" + data[0].rates[i].bid +
                                "</th>" + "<th>" + data[0].rates[i].ask + "</th>";
                        }
                        kursy += "</tbody></table>";
                        tab.innerHTML = kursy;
                    }
                    createTable();
                } else {
                    tab.innerHTML = '<span class="alert">Wystąpił problem z zapytaniem.<p>Skontaktuj sie z administratorem</p></span>';
                }
            }
    
        }
        makeRequest("http://api.nbp.pl/api/exchangerates/tables/C?format=json");
    })();
});

