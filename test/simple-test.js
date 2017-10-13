import test from 'ava';
import {Builder as WebDriverBuilder} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import {Eyes, ConsoleLogHandler, FixedCutProvider} from '../index';

const appName = "Eyes.Selenium.JavaScript - simple";

const capabilities = {
    "Chrome Mac": {
        'browserName': 'chrome',
        'platform': 'OS X 10.11',
        "screenResolution": "1280x960",
        'name':'test-chrome',
    },

    "Chrome Linux": {
        'browserName': 'chrome',
        'platform': 'LINUX',
        "screenResolution": "1024x768",
        'name':'test-chrome-linux',
    },

    "Chrome Windows ": {
        'browserName': 'chrome',
        'platform': 'Windows 10',
        "screenResolution": "1024x768",
        'name':'test-chrome-win',
    },

    "Firefox Mac":{
        'browserName': 'firefox',
        'platform': 'Mac',
        'name': 'test-firefox-mac',
        "screenResolution": "1280x960",
    },

    "Firefox Linux": {
        'browserName': 'firefox',
        'platform': 'LINUX',
        'name': 'test-firefox-linux',
        'screenResolution': "1024x768",
    },

    "Firefox Windows ": {
        'browserName': 'firefox',
        'platform': 'Windows 10',
        'name': 'test-firefox-win',
        'screenResolution': "1024x768",
    },

    "Internet Explorer Windows":{
        'browserName': 'internet explorer',
        'platform': "Windows 10",
        'name': 'test-explorer'
    },

    "Safari Mac": {
        'browserName': "safari",
        'platform': 'OS X 10.12',
        'name': 'test-safari',
    }

};

for (let capability in capabilities) {

    let driver = null, eyes = null, testName = null;

    test.before(() => {
        if ('undefined' === typeof process.env.SAUCE_USERNAME
            || 'undefined' === typeof process.env.SAUCE_ACCESS_KEY
            || 'undefined' === typeof process.env.APPLITOOLS_API_KEY)
        {
            console.log('Please set all environment variables');
            process.exit(-1);
        }
    });

    test.beforeEach(t => {
        testName = t.title.replace("beforeEach for ", "");
    });

    test.serial("Selenim test browser: " +
      capabilities[capability]["platform"] + '-' +
      capabilities[capability]['browserName'] + '-' +
      "Simple methods on TestHtmlPages", () => {

        driver = new WebDriverBuilder()
            //.usingServer('http://localhost:4444/wd/hub')
            .usingServer('http://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub')
            .withCapabilities(capabilities[capability])
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));

        return eyes.open(driver, appName, testName, {width: 800, height: 560})
            .then((browser) => {
                driver = browser;
            })
            .then(() => {
                driver.get('https://astappev.github.io/test-html-pages/');

                eyes.addProperty("MyProp", "I'm correct!");
                eyes.checkWindow("Entire window");
                // cut params: header, footer, left, right.
                eyes.setImageCut(new FixedCutProvider(60, 100, 50, 120));
                eyes.checkWindow("Entire window with cut borders");

                return eyes.close();
            })
            .then(() => {
                return driver.quit();
            })
            .then(() => {
                return eyes.abortIfNotClosed();
            });
    });
}