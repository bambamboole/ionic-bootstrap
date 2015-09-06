# for Push plugin : https://github.com/phonegap-build/PushPlugin
angular.module 'app'

.factory 'PushPlugin', ($q, $http, $ionicPlatform, $window, $log, PluginUtils, Config) ->
  pluginName = 'Push'

  pluginTest = ->
    $window.plugins and $window.plugins.pushNotification

  callbackCurRef = 1
  callbackList = {}
  service =
    type:
      ALL: 'all'
      MESSAGE: 'message'
      REGISTERED: 'registered'
      ERROR: 'error'
    sendPush: sendPush
    register: register
    onNotification: onNotification
    cancel: cancel
  # This function is not part of the plugin, you should implement it here !!!

  sendPush = (recipients, data) ->
    if $ionicPlatform.is('android')
      $http.post('https://android.googleapis.com/gcm/send', {
        registration_ids: recipients
        data: data
      }, headers: Authorization: 'key=' + Config.gcm.apiServerKey).then ->
        true
    else
      $window.alert 'Your platform don\'t have push support :('
      $q.when false

  register = (senderID) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      callbackRef = onNotification(((notification) ->
        defer.resolve notification.regid
        cancel callbackRef

      ), service.type.REGISTERED)
      $window.plugins.pushNotification.register ((data) ->
        ), ((err) ->
          registerDefer.reject err

        ),
        senderID: senderID
        ecb: 'onPushNotification'
      defer.promise

  onNotification = (callback, _type) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      id = callbackCurRef++
      callbackList[id] =
        fn: callback
        type: _type or service.type.MESSAGE
      id

  cancel = (id) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      delete callbackList[id]


  # iOS only

  setApplicationIconBadgeNumber = (badgeNumber) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.pushNotification.setApplicationIconBadgeNumber ((a, b, c) ->
        console.log 'success a', a
        console.log 'success b', b
        console.log 'success c', c
        defer.resolve()

      ), ((err) ->
# on Android : "Invalid action : setApplicationIconBadgeNumber"
        defer.reject err

      ), badgeNumber
      defer.promise

  # iOS only

  showToastNotification = (options) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.pushNotification.showToastNotification ((a, b, c) ->
        console.log 'success a', a
        console.log 'success b', b
        console.log 'success c', c
        defer.resolve()

      ), ((err) ->
# on Android : "Invalid action : showToastNotification"
        defer.reject err

      ), options
      defer.promise

  $window.onPushNotification = (notification) ->
    if notification.event == service.type.MESSAGE
    else if notification.event == service.type.REGISTERED
    else if notification.event == service.type.ERROR
      $log.error 'GCM error', notification
    else
      $log.error 'unknown GCM event has occurred', notification
    # unknown notification
    for i of callbackList
      if callbackList[i].type == service.type.ALL or callbackList[i].type == notification.event
        callbackList[i].fn notification
    

  service


###*************************
   *                        *
   *      Browser Mock      *
   *                        *
   *************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.plugins
      window.plugins = {}
    if !window.plugins.pushNotification
      window.plugins.pushNotification = do ->
        {
        register: (successCallback, errorCallback, options) ->
          setTimeout (->
            if successCallback
              successCallback 'OK'
            if options and options.ecb
              eval(options.ecb)
                event: 'registered'
                regid: 'registration_id'
            return
          ), 0
          return
        setApplicationIconBadgeNumber: (successCallback, errorCallback, badge) ->
          if errorCallback
            errorCallback 'Invalid action : setApplicationIconBadgeNumber'
          return
        showToastNotification: (successCallback, errorCallback, options) ->
          if errorCallback
            errorCallback 'Invalid action : showToastNotification'
          return
        unregister: (successCallback, errorCallback, options) ->
        onDeviceReady: (opts) ->
        registerDevice: (successCallback, errorCallback) ->
          if successCallback
            successCallback 'status'
          return

        }


