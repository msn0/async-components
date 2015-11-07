module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      {pattern: 'test/fixtures/**/*.html', watched: true, served: true, included: false},
      'async-components.js',
      'test/test.js'
    ],
    exclude: [],
    preprocessors: {},
    coverageReporter: {},
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-jasmine'
    ],
    singleRun: true
  });
};
