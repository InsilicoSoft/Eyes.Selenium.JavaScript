import test from 'ava';
import {Builder as WebDriverBuilder, By} from 'selenium-webdriver';
import {Eyes, ConsoleLogHandler, Target, MatchLevel, StitchMode} from '../index';

const appName = "Eyes.Selenium.JavaScript - check-interface";

const capabilities = {
    "Chrome Mac": {
        'browserName': 'chrome',
        'platform': 'OS X 10.11',
        "screenResolution": "1280x960",
        'name':'test-chrome-mac'
    },

    "Chrome Linux": {
        'browserName': 'chrome',
        'platform': 'LINUX',
        "screenResolution": "1024x768",
        'name':'test-chrome-linux'
    },

    "Chrome Windows ": {
        'browserName': 'chrome',
        'platform': 'Windows 10',
        "screenResolution": "1024x768",
        'name':'test-chrome-win'
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

    "Internet Explorer Windows": {
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
        capabilities[capability]['platform'] + '-' +
        capabilities[capability]['browserName'] + '-' +
        " Different check methods on TestHtmlPages", () => {

        driver = new WebDriverBuilder()
            //.usingServer('http://localhost:4444/wd/hub')
            .usingServer('http://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub')
            .withCapabilities(capabilities[capability])
            .build();


        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
        eyes.setStitchMode(StitchMode.CSS);
        eyes.setForceFullPageScreenshot(true);

        return eyes.open(driver, appName, testName, {width: 1000, height: 700})
            .then(function (browser) {
                driver = browser;
            })
            .then(() => {
                driver.get("https://astappev.github.io/test-html-pages/");

                // Entire window, equivalent to eyes.checkWindow()
                eyes.check("Entire window", Target.window()
                        .matchLevel(MatchLevel.Layout)
                        .ignore(By.id("overflowing-div"))
                        .ignore({element: driver.findElement(By.name("frame1"))})
                        .ignore({left: 400, top: 100, width: 50, height: 50}, {left: 400, top: 200, width: 50, height: 100})
                        .floating({
                            left: 500,
                            top: 100,
                            width: 75,
                            height: 100,
                            maxLeftOffset: 25,
                            maxRightOffset: 10,
                            maxUpOffset: 30,
                            maxDownOffset: 15
                        })
                        .floating({
                            element: By.id("overflowing-div-image"),
                            maxLeftOffset: 5,
                            maxRightOffset: 25,
                            maxUpOffset: 10,
                            maxDownOffset: 25
                        })
                    // .floating({element: driver.findElement(By.tagName("h1")), maxLeftOffset: 10, maxRightOffset: 10, maxUpOffset: 10, maxDownOffset: 10})
                );

                // Region by rect, equivalent to eyes.checkFrame()
                eyes.check("Region by rect", Target.region({left: 50, top: 50, width: 200, height: 200})
                    // .floating({left: 50, top: 50, width: 60, height: 50, maxLeftOffset: 10, maxRightOffset: 10, maxUpOffset: 10, maxDownOffset: 10})
                    // .floating({left: 150, top: 75, width: 60, height: 50, maxLeftOffset: 10, maxRightOffset: 10, maxUpOffset: 10, maxDownOffset: 10})
                );

                // Region by element, equivalent to eyes.checkRegionByElement()
                eyes.check("Region by element", Target.region(driver.findElement(By.css("body > h1"))));

                // Region by locator, equivalent to eyes.checkRegionBy()
                eyes.check("Region by locator", Target.region(By.id("overflowing-div-image")));

                // Entire element by element, equivalent to eyes.checkElement()
                eyes.check("Entire element by element", Target.region(driver.findElement(By.id("overflowing-div-image"))).fully());

                // Entire element by locator, equivalent to eyes.checkElementBy()
                eyes.check("Entire element by locator", Target.region(By.id("overflowing-div")).fully());

                // Entire frame by locator, equivalent to eyes.checkFrame()
                eyes.check("Entire frame by locator", Target.frame(By.name("frame1")));

                // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
                eyes.check("Entire region in frame by frame name and region locator", Target.region(By.id("inner-frame-div"), "frame1").fully());

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
