//jshint strict: false
module.exports = function(config) {
  config.set({

    reporters: ['progress', 'html'],

    basePath: '../',

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'ng-wistia-components.js',
      'test/*-spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome', 'Firefox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-html-reporter'
    ],

    htmlReporter: {
      outputDir: 'karma_html'
    }

  });
};
