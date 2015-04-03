var numberOfPagesToOpen = 10;

var url = '';
var system = require('system');
var args = system.args;
var failures = 0;
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
        switch (status) {
            case 'error':
                console.log(url + ' failed to load.');
                phantom.exit(1);
                break;
            case 'fail':
                failures++;
            default:
                break;
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

var getFailureMessage = function(fails) {
    if (!fails) {
        return;
    }
    var percentFail = numberOfPagesToOpen / fails * 100;
    return 'Failures: ' + fails + ' ('  + Math.round(percentFail) + '%)';
};

var endTest = function() {
    var endTime = new Date();
    var elapsedTime = endTime - startTime;
    var failureMessage = '';
    console.log('\n\n***************\nLoaded ' + url + ' '
        + numberOfPagesToOpen + ' times\n'
        + '\tElapsed: ' + elapsedTime + 'ms'
        + '\n\t' + getFailureMessage(failures)
        +'\n***************');
    phantom.exit();
};

// page.onLoadFinished = function(status) {
//     console.log('loadFinished');
//     continueTest();
// };

startTest();
