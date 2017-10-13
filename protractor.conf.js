// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    seleniumAddress: 'http://'+ process.env.SAUCE_USERNAME +':'+  process.env.SAUCE_ACCESS_KEY +'@ondemand.saucelabs.com:80/wd/hub',
    suites: {
        checkInterface: 'test-protractor/check-interface-protractor-test.js',
        scalingMethods: 'test-protractor/scaling-methods-protractor-test.js',
        simple: 'test-protractor/simple-protractor-test.js',
    },

    multiCapabilities: [
        {
            browserName: 'chrome',
            platform: "Mac",
            version: "latest",
            screenResolution: "1152x900",
            name: 'test-protractor-chrome-mac',
            shardTestFiles: true
        },
        {
            browserName: 'chrome',
            platform: "Linux",
            // screenResolution: "1152x900",
            name: 'test-protractor-chrome-linux',
            shardTestFiles: true
        },
        {
            browserName: 'chrome',
            platform: "Windows 10",
            //screenResolution: "1152x900",
            name: 'test-protractor-chrome-win',
            shardTestFiles: true
        },
        {
            browserName: 'firefox',
            platform: 'Linux',
            name: 'test-protractor-firefox-linux'
        },
        {
            browserName: 'firefox',
            platform: 'Mac',
            name: 'test-protractor-firefox-mac'
        },
        {
            browserName: 'firefox',
            platform: 'Windows 10',
            name: 'test-protractor-firefox-win'
        },
        {
            browserName: 'Internet Explorer',
            platform: "Windows 10",
            name: 'test-protractor-explorer'
        },
        {
            browserName: "safari",
            platform: 'OS X 10.12',
            name: 'test-safari'
        }
    ],

    // use this param to config number of concurrent runs for Applitools
    maxSessions: 1,

    restartBrowserBetweenTests: true,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 300000
    },
    onPrepare: function() {
        // we need this to get appName and testName and pass them to eyes.open in beforeEach
        jasmine.getEnv().addReporter({
            specStarted: function(result) {
                global.testName = result.description;
                global.appName = result.fullName.replace(" " + testName, "");
            }
        });
    },
};