'use strict';

describe('ngWistiaComponents >', function() {

  var $componentController;
  var ngWistia;
  var wistiaServiceMock;

  beforeEach(module('ngWistiaComponents'));

  /**
   * Mock ngWistiaComponents.wistiaService
   */
  beforeEach(function() {
    wistiaServiceMock = {
      init: jasmine.createSpy(),
      loadVideo: jasmine.createSpy(),
      setApiPassword: jasmine.createSpy(),
      initUploader: jasmine.createSpy()
    };

    module(function ($provide) {
      $provide.value('ngWistiaComponents.service', wistiaServiceMock);
    });
  });


  /**
   * Inject componentController
   */
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;


  }));

  /**
   * Initialize ngWistia parent component for use in all child components' testing
   */
  beforeEach(function() {
    ngWistia = $componentController('ngWistia', null, {
      apiPassword: 'dummyWistiaPassword'
    });
  });


  describe('Testing ngWistiaProgress Component', function() {

    it('should register itself with ngWistia component', function() {
      var ctrl = $componentController('ngWistiaProgress', null, {coreWistia: ngWistia});
      ctrl.$onInit();
      expect(ctrl.coreWistia).toBe(ngWistia);
      expect(ctrl.coreWistia.data.progressComponent).toBe(ctrl);
    });

    it('should begin with 0 progress', function() {
      var ctrl = $componentController('ngWistiaProgress', null, {});
      expect(ctrl.progress).toBe(0);
    });

    it('should respond to setProgress', function() {
      var ctrl = $componentController('ngWistiaProgress', null, {});
      ctrl.setProgress(30);
      expect(ctrl.progress).toBe(30);
    });

    it('should not set progress more than 100%', function() {
      var ctrl = $componentController('ngWistiaProgress', null, {});
      ctrl.setProgress(200);
      expect(ctrl.progress).toBe(100);
    });

  });


  describe('Testing ngWistiaVideo Component', function() {
    var injections = {$element: angular.element('<div></div>')};
    var onPlayMock = function() {}

    it('should register itself with ngWistia component', function() {
      var ctrl = $componentController('ngWistiaVideo', injections, {coreWistia: ngWistia, onPlay: onPlayMock});
      ctrl.$onInit();
      expect(ctrl.coreWistia).toBe(ngWistia);
      expect(ctrl.coreWistia.data.videoComponent).toBe(ctrl);
    });

    it('should play a video properly by calling the service', function() {
      var videoHashedId = 'sampleVideoHash';
      var ctrl = $componentController('ngWistiaVideo', injections, {coreWistia: ngWistia, onPlay: onPlayMock});
      ctrl.$onInit();
      ctrl.playVideo(videoHashedId);
      expect(ctrl.videoHashedId).toBe(videoHashedId);
      expect(wistiaServiceMock.loadVideo).toHaveBeenCalledWith(injections.$element, videoHashedId, onPlayMock);
    });

  });


  describe('Testing ngWistiaError Component', function() {

    it('should register itself with ngWistia component', function() {
      var ctrl = $componentController('ngWistiaError', null, {coreWistia: ngWistia});
      ctrl.$onInit();
      expect(ctrl.coreWistia).toBe(ngWistia);
      expect(ctrl.coreWistia.data.errorComponent).toBe(ctrl);
    });

    it('should set error properly', function() {
      var ctrl = $componentController('ngWistiaError', null, {coreWistia: ngWistia});
      ctrl.$onInit();
      expect(ctrl.coreWistia).toBe(ngWistia);
      ctrl.setError('testError');
      expect(ctrl.error).toBe('testError');
    });

    it('should clear previous error properly', function() {
      var ctrl = $componentController('ngWistiaError', null, {coreWistia: ngWistia});
      ctrl.$onInit();
      expect(ctrl.coreWistia).toBe(ngWistia);
      ctrl.setError('testError');
      expect(ctrl.error).toBe('testError');
      ctrl.setError();
      expect(ctrl.error).toBeUndefined();
    });


  });


  describe('Testing ngWistiaInput Component', function() {

    it('should register itself with ngWistia component', function() {
      var ctrl = $componentController('ngWistiaInput', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      ctrl.$onInit();
      expect(ctrl.coreWistia).toBe(ngWistia);
      expect(ctrl.coreWistia.data.inputComponent).toBe(ctrl);
    });

    it('should attempt to init blueimp uploader', function() {
      var ctrl = $componentController('ngWistiaInput', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      ctrl.$onInit();
      expect(wistiaServiceMock.initUploader).toHaveBeenCalled();
    });

  });


  describe('Testing ngWistia Component', function() {

    it('should set Wistia apiPassword correctly', function() {
      var ctrl = $componentController('ngWistia', null, {apiPassword: 'dummyWistiaPassword'});
      ctrl.$onInit();
      expect(wistiaServiceMock.setApiPassword).toHaveBeenCalledWith('dummyWistiaPassword');
    });


    it('should have all child components registered', function() {
      var errorComponentController = $componentController('ngWistiaError', null, {coreWistia: ngWistia});
      errorComponentController.$onInit();

      var videoComponentController = $componentController('ngWistiaVideo', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      videoComponentController.$onInit();

      var progressComponentController = $componentController('ngWistiaProgress', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      progressComponentController.$onInit();

      var inputComponentController = $componentController('ngWistiaInput', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      inputComponentController.$onInit();

      expect(ngWistia.data.errorComponent).toBe(errorComponentController);
      expect(ngWistia.data.videoComponent).toBe(videoComponentController);
      expect(ngWistia.data.progressComponent).toBe(progressComponentController);
      expect(ngWistia.data.inputComponent).toBe(inputComponentController);
    });

    it('should communicate well with all child components', function() {
      var errorComponentController = $componentController('ngWistiaError', null, {coreWistia: ngWistia});
      errorComponentController.$onInit();

      var videoComponentController = $componentController('ngWistiaVideo', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      videoComponentController.$onInit();

      var progressComponentController = $componentController('ngWistiaProgress', {$element: angular.element('<div></div>')}, {coreWistia: ngWistia});
      progressComponentController.$onInit();

      ngWistia.setError('testError');
      ngWistia.setProgress(80);
      ngWistia.playVideo('testVideo');

      expect(errorComponentController.error).toBe('testError');
      expect(progressComponentController.progress).toBe(80);
      expect(videoComponentController.videoHashedId).toBe('testVideo');
    });

  });


});
