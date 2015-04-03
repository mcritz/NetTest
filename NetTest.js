var numberOfPagesToOpen = 10;

var url = '';
var system = require('system');
var args = system.args;
if (args.length === 1) {
    console.log('Usage:\nphantomjs http://url 100\nReturns how long it takes to load url 100 times.');
    phantom.exit(0);
} else {
    var url = args[1] || 'https://google.com/';
    numberOfPagesToOpen = args[2] ? args[2] : 10;
}

var page = require('webpage').create();
var startTime = new Date();
var numberOfPagesOpened = 0;

var getElapsedTime = function(date) {
    return date - startTime;
};

var startTest = function() {
    startTime = new Date();
    console.log('Testing ' + url + ' ' + numberOfPagesToOpen + ' times.');
    openPage();
};

var continueTest  = function() {
    console.log('page ' + numberOfPagesOpened + ': ' + getElapsedTime(new Date()));
    numberOfPagesOpened++;
    if (numberOfPagesOpened < numberOfPagesToOpen) {
        openPage();
    } else {
        endTest();
    }
};

var openPage = function() {
    page.open(url, function (status) {
        if (status == 'error') {
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
    console.log('Loaded ' + url + ' '
        + numberOfPagesToOpen + ' times\n'
        + 'Elapsed: ' + elapsedTime + 'ms');
    phantom.exit();
};

// page.onLoadFinished = function(status) {
//     console.log('loadFinished');
//     continueTest();
// };

startTest();
