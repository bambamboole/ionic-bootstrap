// Generated by CoffeeScript 1.9.3
(function() {
  angular.module('app').factory('KeyboardPlugin', function($window, PluginUtils) {
    var disableScroll, hideKeyboardAccessoryBar, pluginName, pluginTest, service;
    pluginName = 'Keyboard';
    pluginTest = function() {
      return $window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard;
    };
    service = {
      hideKeyboardAccessoryBar: hideKeyboardAccessoryBar,
      disableScroll: disableScroll
    };
    hideKeyboardAccessoryBar = function() {
      return PluginUtils.onReady(pluginName, pluginTest).then(function() {
        return $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      });
    };
    disableScroll = function(shouldDisable) {
      return PluginUtils.onReady(pluginName, pluginTest).then(function() {
        return window.cordova.plugins.Keyboard.disableScroll(shouldDisable);
      });
    };
    return service;
  });


  /**************************
   *                        *
   *      Browser Mock      *
   *                        *
  #************************
   */

  ionic.Platform.ready(function() {
    if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
      if (!window.cordova) {
        window.cordova = {};
      }
      if (!window.cordova.plugins) {
        window.cordova.plugins = {};
      }
      if (!window.cordova.plugins.Keyboard) {
        return window.cordova.plugins.Keyboard = (function() {
          var plugin;
          plugin = {
            isVisible: false,
            show: function() {
              var event;
              plugin.isVisible = true;
              event = new Event('native.keyboardshow');
              event.keyboardHeight = 284;
              window.dispatchEvent(event);
            },
            close: function() {
              plugin.isVisible = false;
              window.dispatchEvent(new Event('native.keyboardhide'));
            },
            hideKeyboardAccessoryBar: function(shouldHide) {},
            disableScroll: function(shouldDisable) {}
          };
          return plugin;
        })();
      }
    }
  });

}).call(this);

//# sourceMappingURL=keyboard.js.map
