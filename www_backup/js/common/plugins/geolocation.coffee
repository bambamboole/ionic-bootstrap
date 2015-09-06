# for Geolocation plugin : org.apache.cordova.geolocation (https://github.com/apache/cordova-plugin-geolocation)
angular.module 'app'

.factory 'GeolocationPlugin', ($window, $q, $timeout, $log, PluginUtils) ->
# http://stackoverflow.com/questions/8543763/android-geo-location-tutorial
# http://tol8.blogspot.fr/2014/03/how-to-get-reliable-geolocation-data-on.html
# http://www.andygup.net/how-accurate-is-html5-geolocation-really-part-2-mobile-web/

  ###
     * Solutions :
     *  -> reboot device
     *  -> don't use cordova plugin !
     *  -> use native geolocation (should code plugin...)
  ###

  pluginName = 'Geolocation'

  pluginTest = ->
    $window.navigator and $window.navigator.geolocation

  service = getCurrentPosition: getCurrentPosition

  getCurrentPosition = (_timeout, _enableHighAccuracy, _maximumAge) ->
    opts =
      enableHighAccuracy: if _enableHighAccuracy then _enableHighAccuracy else true
      timeout: if _timeout then _timeout else 10000
      maximumAge: if _maximumAge then _maximumAge else 0
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      geolocTimeout = $timeout((->
        defer.reject message: 'Geolocation didn\'t responded within ' + opts.timeout + ' millis :('

      ), opts.timeout)
      $window.navigator.geolocation.getCurrentPosition ((position) ->
        $timeout.cancel geolocTimeout
        defer.resolve position

      ), ((error) ->
        $timeout.cancel geolocTimeout
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      ), opts
      defer.promise

  getCurrentPositionByWatch = (_timeout, _enableHighAccuracy, _maximumAge) ->
    opts =
      enableHighAccuracy: if _enableHighAccuracy then _enableHighAccuracy else true
      timeout: if _timeout then _timeout else 10000
      maximumAge: if _maximumAge then _maximumAge else 1000
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      watchID = null
      geolocTimeout = $timeout((->
        $window.navigator.geolocation.clearWatch watchID
        defer.reject message: 'Geolocation didn\'t responded within ' + opts.timeout + ' millis :('

      ), opts.timeout)
      watchID = $window.navigator.geolocation.watchPosition(((position) ->
        $window.navigator.geolocation.clearWatch watchID
        $timeout.cancel geolocTimeout
        defer.resolve position

      ), ((error) ->
        $timeout.cancel geolocTimeout
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      ), opts)
      defer.promise

  return service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
  else
