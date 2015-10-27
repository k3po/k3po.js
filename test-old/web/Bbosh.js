'use strict';

var Bbosh = function(url) {
    this.url = url;
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    function handleReadyState3() {
        // start the next request
        var status = xmlhttp.status();
        switch(status) {
            case 201:
                // create next
                break;
            case 200:
                // create next
                break;
            case 404:
                // if was connected, disconnect
                break;
            default:
                this.onerror("Unknown status: " + status);
        }
        xmlhttp.getResponseHeader('')
    }

    xmlhttp.onreadystatechange = function() {
        switch(xmlhttp.readyState == 4){
            case 0:
                break;
            case 1:
                this.onopen();
                break;
            case 2:
                break;
            case 3:
               handleReadyState3();
                break;
            case 4:
                var message = xmlHttp.responseText;
                this.onmessage(message);
                break;
        }
    };
    try {
        xmlhttp.open("POST", this.url);
        xmlhttp.setRequestHeader("Accept", "application/octet-stream");
        xmlhttp.setRequestHeader("X-Protocol", "bbosh/1.0");
        xmlhttp.setRequestHeader("X-Accept-Strategy", "polling;interval=1s");

        this.onopen();
    } catch (error) {
        console.log(error);
    }
};

Bbosh.prototype.sendRequest = function(data) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 400)) {
            var responseText = xmlhttp.responseText;
        }
    };
    try {
        xmlhttp.open("POST", this.url);
        this.onopen();
    } catch (error) {
        console.log(error);
    }
};

Bbosh.prototype.close = function(){

};

Bbosh.prototype.onclose = function(){

};

Bbosh.prototype.onerror = function(){

};

Bbosh.prototype.onmessage = function(){

};

Bbosh.prototype.onopen = function(){

};