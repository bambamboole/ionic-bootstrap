# for Parse plugin : https://github.com/umurgdk/phonegap-parse-plugin
angular.module 'app'

.factory 'ParsePlugin', ($window, $q, $log, PluginUtils) ->
  pluginName = 'Parse'

  pluginTest = ->
    $window.parsePlugin

  service =
    initialize: (appId, clientKey) ->
      _exec $window.parsePlugin.initialize, appId, clientKey
    getInstallationId: ->
      _exec $window.parsePlugin.getInstallationId
    getInstallationObjectId: ->
      _exec $window.parsePlugin.getInstallationObjectId
    subscribe: (channel) ->
      _exec $window.parsePlugin.subscribe, channel
    unsubscribe: (channel) ->
      _exec $window.parsePlugin.unsubscribe, channel
    getSubscriptions: ->
      _exec $window.parsePlugin.getSubscriptions
    onMessage: ->
      _exec $window.parsePlugin.onMessage

  _exec = (fn) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      fnArgs = []
      # take all arguments except the first one
      i = 1
      while i < arguments.length
        fnArgs.push arguments[i]
        i++
      fnArgs.push (res) ->
        defer.resolve res

      fnArgs.push (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      fn.apply null, fnArgs
      defer.promise

  service


###*************************
   *                        *
   *      Browser Mock      *
   *                        *
   *************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.parsePlugin
      window.parsePlugin = do ->
        subscriptions = []
        {
        initialize: (appId, clientKey, successCallback, errorCallback) ->
          if successCallback
            successCallback()
          return
        getInstallationId: (successCallback, errorCallback) ->
          if successCallback
            successCallback '7ff61742-ab67-42aa-bf48-d821afb44022'
          return
        getInstallationObjectId: (successCallback, errorCallback) ->
          if successCallback
            successCallback 'ED4j8uPOth'
          return
        subscribe: (channel, successCallback, errorCallback) ->
          subscriptions.push channel
          if successCallback
            successCallback()
          return
        unsubscribe: (channel, successCallback, errorCallback) ->
          subscriptions.splice subscriptions.indexOf(channel), 1
          if successCallback
            successCallback()
          return
        getSubscriptions: (successCallback, errorCallback) ->
          if successCallback
            successCallback subscriptions
          return
        onMessage: (successCallback, errorCallback) ->

        }
