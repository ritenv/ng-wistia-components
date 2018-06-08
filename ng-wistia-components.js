'use strict';

(function() {

  const WISTIA_URL = 'https://upload.wistia.com';

  angular.module('ngWistiaComponents', [])

    /**
     * Wistia core component
     */
    .component('ngWistia', {
      bindings: {
        apiPassword: '@'
      },
      template: '',
      controller: [
        'ngWistiaComponents.service',
        function ngWistia(wistiaService) {
          var data = this.data = {};
          var ctrl = this;

          this.$onInit = function() {
            wistiaService.setApiPassword(this.apiPassword);
          };

          this.setProgressComponent = function(progressComponent) {
            data.progressComponent = progressComponent;
          }

          this.setProgress = function(percentage) {
            if (data.progressComponent) {
              data.progressComponent.setProgress(percentage);
            }
          }

          this.setInputComponent = function(inputComponent) {
            data.inputComponent = inputComponent;
          }

          this.setVideoComponent = function(videoComponent) {
            data.videoComponent = videoComponent;
          }

          this.setErrorComponent = function(errorComponent) {
            data.errorComponent = errorComponent;
          }

          this.setError = function(error) {
            if (data.errorComponent) {
              data.errorComponent.setError(error);
            }
          }

          this.playVideo = function(video) {
            if (data.videoComponent) {
              data.videoComponent.playVideo(video);
              ctrl.videoPlaying = true;
            }
          }
        }
      ]
    })

    /**
     * Wistia Progress Component
     */
    .component('ngWistiaProgress', {
      transclude: true,
      require: {
        coreWistia: '^ngWistia'
      },
      template: '' +
      '<div class="progress" ng-if="$ctrl.progress">' +
      '  <div class="progress-bar" role="progressbar" aria-valuenow="{{$ctrl.progress}}" aria-valuemin="0" aria-valuemax="100" style="width: {{$ctrl.progress}}%;">' +
      '    <span class="sr-only">{{$ctrl.progress}}% Complete</span>' +
      '  </div>' +
      '</div>',
      controller: function() {

        this.progress = 0;

        this.$onInit = function() {
          this.coreWistia.setProgressComponent(this);
        };

        this.setProgress = function(percentage) {
          this.progress = Math.min(percentage, 100);
        }
      }
    })

    /**
     * Wistia Progress Component
     */
    .component('ngWistiaVideo', {
      transclude: true,
      bindings: {
        onPlay: '&',
        videoId: '@'
      },
      require: {
        coreWistia: '^ngWistia'
      },
      template: '<div></div>',
      controller: [
        '$element',
        'ngWistiaComponents.service',
        function($element, wistiaService) {
          var ctrl = this;

          this.$onInit = function() {
            this.coreWistia.setVideoComponent(this);

            /**
             * If a video hash was provided directly via attribute, play the video
             * Useful for standalone player usage
             */
            if (this.videoId) {
              this.playVideo(this.videoId);
            }
          };

          this.playVideo = function(videoHashedId) {
            ctrl.videoHashedId = videoHashedId;
            wistiaService.loadVideo($element, ctrl.videoHashedId, ctrl.onPlay);
          }
        }
      ]
    })

    /**
     * Wistia Error Component
     */
    .component('ngWistiaError', {
      transclude: true,
      require: {
        coreWistia: '^ngWistia'
      },
      template: '' +
      '<p ng-if="$ctrl.error" class="alert alert-danger">' +
      '  {{$ctrl.error}} ' +
      '</p>',
      controller: [
        function() {
          var ctrl = this;

          this.$onInit = function() {
            this.coreWistia.setErrorComponent(this);
          };

          this.setError = function(error) {
            ctrl.error = error;
          }
        }
      ]
    })

    /**
     * Wistia Input Component
     */
    .component('ngWistiaInput', {
      transclude: true,
      require: {
        coreWistia: '^ngWistia'
      },
      template: '' +
      '<p>' +
      '  <span class="btn btn-primary fileinput-button btn-lg" role="button">' +
      '    <span>Upload</span>' +
      '    <input type="file" name="files">' +
      '  </span>' +
      '</p>',
      controller: [
        '$element',
        '$timeout',
        '$http',
        'ngWistiaComponents.service',
        function($element, $timeout, $http, wistiaService) {
          var ctrl = this;

          this.$onInit = function() {
            this.coreWistia.setInputComponent(this);
            this.initUploader();
          };

          this.initUploader = function() {

            wistiaService.initUploader($element, {

              /**
               * Called when a file is added for uploading
               */
              add: function (e, data) {
                ctrl.coreWistia.setError(); //clear any previous errors

                data
                  .submit()
                  .then(function (result, textStatus, jqXHR) {
                    ctrl.coreWistia.playVideo(result.hashed_id);
                  })
                  .catch(function (jqXHR, textStatus, errorThrown) {
                    $timeout(function() {
                      ctrl.coreWistia.setError('WistiaError: ' + jqXHR.responseJSON ? jqXHR.responseJSON.error : errorThrown);
                    });
                  })
                ;
              },

              /**
               * Called whenever upload progress is updated
               */
              progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);

                $timeout(function() {
                  ctrl.coreWistia.setProgress(progress);
                });
              }
            });

          }

        }
      ]
    })

    .service('ngWistiaComponents.service', [
      '$timeout',
      function($timeout) {

        var wistiaApiPassword;

        var service = {

          init: function() {
            if (!window.Wistia) {
              var scriptTag = document.createElement('script');
              scriptTag.setAttribute('src','https://fast.wistia.com/assets/external/E-v1.js');
              document.head.appendChild(scriptTag);
            }
          },

          loadVideo: function($element, videoHashedId, callback) {
            if (typeof Wistia == 'undefined') {
              return $timeout(function() {
                service.loadVideo($element, videoHashedId, callback);
              }, 1000);
            }

            var wistiaEl = angular.element(
              '<div style="width: 100%; height: 100%;" class="wistia_embed wistia_async_' + videoHashedId + '"></div>'
            );

            angular.element($element).append(wistiaEl);

            Wistia.embeds.setup();

            /**
             * Play the video whenever the player is ready
             */
            window._wq.push({ id: videoHashedId, onReady: function(video) {
              video.play();
              $timeout(function() {
                callback();
              });
            }});
          },

          setApiPassword: function(apiPassword) {
            wistiaApiPassword = apiPassword;
          },

          initUploader: function($element, options) {
            if (!wistiaApiPassword) {
              throw new Error('Wistia api_password not set');
            }
            angular.extend(options, {
              dataType: 'json',
              url: WISTIA_URL,
              formData: {
                api_password: wistiaApiPassword
              }
            });
            angular.element($element).find('input').fileupload(options);
          }
        };

        service.init();

        return service;
      }
    ])


    /**
     * Filter to mask sensitive data with partial asterists (e.g. helloworld will become hello*****)
     */
    .filter('sensitiveData', function() {

      return function(str) {
        var halfLength = str.length/2;
        return str.substr(0, Math.floor(halfLength)) + (new Array(Math.ceil(halfLength+1))).join('*');
      };
    })
  ;

})();
