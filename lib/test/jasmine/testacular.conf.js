// Testacular configuration
// Generated on Thu Dec 06 2012 16:08:26 GMT+0800 (CST)


// base path, that will be used to resolve files and exclude
basePath = '';

libPath = '../../base/';
// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    libPath + 'cellula.js',
    libPath + 'class.js',
    libPath + 'util.js',
    libPath + 'events.js',
    libPath + 'message.js',
    libPath + 'element.js',
    libPath + 'cell.js',
    libPath + 'collection.js',
    //'jasmine-util.js',
    //'jasmine-element.js',
    'jasmine-events.js'
    //'jasmine-class.js'
];


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];

// web server port
// CLI --port 9876
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 3000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

// report which specs are slower than 500ms
// CLI --report-slower-than 50
reportSlowerThan = 50;

preprocessors = {
    '../base/*.js':'coverage'
};