import test from 'ava';
import {Builder as WebDriverBuilder, By} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import {Eyes, ConsoleLogHandler} from '../index';

const appName = "Eyes.Selenium.JavaScript - scaling methods";

const capabilities = {
    "Chrome Mac": {
        'browserName': 'chrome',
        'platform': 'OS X 10.11',
        "screenResolution": "1280x960",
        'name':'test-chrome'
    },

    "Chrome Linux": {
        'browserName': 'chrome',
        'platform': 'LINUX',
        "screenResolution": "1024x768",
        'name':'test-chrome'
    },

    "Chrome Windows ": {
        'browserName': 'chrome',
        'platform': 'Windows 10',
        "screenResolution": "1024x768",
        'name':'test-chrome'
    },

    "Firefox Mac":{
        'browserName': 'firefox',
        'platform': 'Mac',
        'name': 'firefox',
        "screenResolution": "1280x960",
    },

    "Firefox Linux": {
        'browserName': 'firefox',
        'platform': 'LINUX',
        'name': 'firefox',
        'screenResolution': "1024x768",
    },

    "Firefox Windows ": {
        'browserName': 'firefox',
        'platform': 'Windows 10',
        'name': 'firefox',
        'screenResolution': "1024x768",
    },

    "internet explorer Windows":{
        'browserName': 'internet explorer',
        'platform': "Windows 10",
        'name': 'test-explorer',
        "screenResolution": "1024x768",
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
            || 'undefined' === typeof process.env.APPLITOOLS_API_KEY) {
            console.log('Please set all environment variables');
            process.exit(-1);
        }
    });

    test.beforeEach(t => {
        testName = t.title.replace("beforeEach for ", "");
    });

    test.serial("Selenim test browser: " +
        capabilities[capability]['platform'] + '-' +
        capabilities[capability]['browserName'] + '-' +
        "Using scaling methods on TestHtmlPages", () => {

        if ('chrome' === capabilities[capability]['browserName']) {
            const options = new chrome.Options().addArguments("--force-device-scale-factor=1.25");
            capabilities[capability]['chromeOptions'] = options;
        }

        driver = new WebDriverBuilder()
            // .usingServer('http://localhost:4444/wd/hub')
            .usingServer('http://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub')
            .withCapabilities(capabilities[capability])
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
        eyes.setForceFullPageScreenshot(true);

        return eyes.open(driver, appName, testName, {width: 1000, height: 700})
            .then(function (browser) {
                driver = browser;
            })
            .then(() => {
                driver.get("https://astappev.github.io/test-html-pages/");

                eyes.checkWindow("Initial");
                eyes.checkElementBy(By.id("overflowing-div"), null, "Text block");
                eyes.checkElementBy(By.id("overflowing-div-image"), null, "Minions");

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