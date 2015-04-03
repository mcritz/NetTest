var numberOfPagesToOpen = 10;
var url = 'https://rg.scedev.com/';

var page = require('webpage').create();
var startTime = new Date();
var numberOfPagesOpened = 0;

var startTest = function() {
    console.log('test started: ' + new Date());
    openPage();
};

var continueTest  = function() {
    console.log('page ' + numberOfPagesOpened + ': ' + new Date());
    numberOfPagesOpened++;
    if (numberOfPagesOpened < numberOfPagesToOpen) {
        openPage();
    } else {
        endTest();
    }
};

var openPage = function() {
    page.open(url, function (status) {
        if (status != 'success') {
            console.log(url + ' failed to load.');
            phantom.exit(1);
        }
        console.log('Loading page: ' + numberOfPagesOpened + ': ' + new Date() + '\nstatus: ' + status);
        page.evaluate(function(data) {
            document.addEventListener('DOMContentLoaded', function() {
                window.callPhantom('DOMContentLoaded');
            }, false);
        });
        continueTest();
    });

    page.onCallback = function(data) {
        continueTest();
    };
};

var endTest = function() {
    var endTime = new Date();
    var elapsedTime = endTime - startTime;
    console.log('elapsedTime: ' + elapsedTime);
    phantom.exit();
};

// page.onLoadFinished = function(status) {
//     console.log('loadFinished');
//     continueTest();
// };

startTest();
