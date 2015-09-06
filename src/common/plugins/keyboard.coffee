# for Keyboard plugin : https://github.com/driftyco/ionic-plugin-keyboard
angular.module 'app'

.factory 'KeyboardPlugin', ($window, PluginUtils) ->
  pluginName = 'Keyboard'

  pluginTest = ->
    $window.cordova and $window.cordova.plugins and $window.cordova.plugins.Keyboard

  service =
    hideKeyboardAccessoryBar: hideKeyboardAccessoryBar
    disableScroll: disableScroll

  hideKeyboardAccessoryBar = ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar true


  disableScroll = (shouldDisable) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      window.cordova.plugins.Keyboard.disableScroll shouldDisable


  return service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.cordova
      window.cordova = {}
    if !window.cordova.plugins
      window.cordova.plugins = {}
    if !window.cordova.plugins.Keyboard
      window.cordova.plugins.Keyboard = do ->
        plugin =
          isVisible: false
          show: ->
            plugin.isVisible = true
            event = new Event('native.keyboardshow')
            event.keyboardHeight = 284
            window.dispatchEvent event
            return
          close: ->
            plugin.isVisible = false
            window.dispatchEvent new Event('native.keyboardhide')
            return
          hideKeyboardAccessoryBar: (shouldHide) ->
          disableScroll: (shouldDisable) ->
        return plugin


