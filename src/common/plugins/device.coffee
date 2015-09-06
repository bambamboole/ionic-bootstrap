# for Device plugin : org.apache.cordova.device (https://github.com/apache/cordova-plugin-device);
angular.module 'app'

.factory 'DevicePlugin', ($window, PluginUtils) ->
  pluginName = 'Device'

  pluginTest = ->
    $window.device

  service =
    getDevice: getDevice
    getDeviceUuid: getDeviceUuid

  getDevice = ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.device

  getDeviceUuid = ->
    getDevice().then (device) ->
      device.uuid

  return service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.device
      browser =
        available: true
        cordova: ''
        manufacturer: ''
        model: ''
        platform: 'browser'
        uuid: '0123456789'
        version: '0'
      android =
        available: true
        cordova: '3.6.4'
        manufacturer: 'LGE'
        model: 'Nexus 4'
        platform: 'Android'
        uuid: '891b8e516ae6bd65'
        version: '5.0.1'
      window.device = browser
