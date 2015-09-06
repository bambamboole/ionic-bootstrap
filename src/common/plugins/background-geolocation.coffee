# for BackgroundGeolocation plugin : https://github.com/christocracy/cordova-plugin-background-geolocation

angular.module 'app'

.factory 'BackgroundGeolocationPlugin', ($window, $q, $log, GeolocationPlugin, PluginUtils) ->
  pluginName = 'BackgroundGeolocation'

  pluginTest = ->
    $window.plugins and $window.plugins.backgroundGeoLocation

  service =
    enable: enable
    disable: stop
    configure: configure
    start: start
    stop: stop
  defaultOpts =
    desiredAccuracy: 10
    stationaryRadius: 20
    distanceFilter: 30
    notificationTitle: 'Location tracking'
    notificationText: 'ENABLED'
    activityType: 'AutomotiveNavigation'
    debug: true
    stopOnTerminate: true
  # postLocation function should take a 'location' parameter and return a promise

  configure = (opts, postLocation) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->

      callbackFn = (location) ->
        if postLocation
          postLocation(location).then (->
            $window.plugins.backgroundGeoLocation.finish()

          ), (error) ->
            $log.error 'pluginError:' + pluginName, error
            $window.plugins.backgroundGeoLocation.finish()

        else
          $window.plugins.backgroundGeoLocation.finish()


      failureFn = (error) ->
        $log.error 'pluginError:' + pluginName, error


      options = angular.extend({}, defaultOpts, opts)
      $window.plugins.backgroundGeoLocation.configure callbackFn, failureFn, options
      GeolocationPlugin.getCurrentPosition()

  start = ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.plugins.backgroundGeoLocation.start()


  stop = ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.plugins.backgroundGeoLocation.stop()


  enable = (opts, postLocation) ->
    configure(opts, postLocation).then ->
      start()

  return service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.plugins
      window.plugins = {}
    if !window.plugins.backgroundGeoLocation
      window.plugins.backgroundGeoLocation = do ->
        config = null
        callback = null
        interval = null
        {
        configure: (callbackFn, failureFn, opts) ->
          config = opts
          callback = callbackFn
          return
        start: ->
          if interval == null
            interval = setInterval((->
              window.navigator.geolocation.getCurrentPosition (position) ->
                callback position
                return
              return
            ), 3000)
          return
        stop: ->
          if interval != null
            clearInterval interval
            interval = null
          return
        finish: ->

        }
