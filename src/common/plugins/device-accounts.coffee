# for DeviceAccounts plugin : https://github.com/loicknuchel/cordova-device-accounts
angular.module 'app'

.factory 'DeviceAccountsPlugin', ($window, $q, $log, PluginUtils) ->
  pluginName = 'DeviceAccounts'

  pluginTest = ->
    $window.plugins and $window.plugins.DeviceAccounts

  service =
    getAccounts: getAccounts
    getEmail: getEmail

  getAccounts = ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.DeviceAccounts.get ((accounts) ->
        defer.resolve accounts

      ), (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      defer.promise

  getEmail = ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.DeviceAccounts.getEmail ((email) ->
        defer.resolve email

      ), (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

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
    if !window.plugins
      window.plugins = {}
    if !window.plugins.DeviceAccounts
      window.plugins.DeviceAccounts =
        get: (onSuccess, onFail) ->
          onSuccess [ {
            type: 'com.google'
            name: 'test@example.com'
          } ]

        getByType: (type, onSuccess, onFail) ->
          onSuccess [ {
            type: 'com.google'
            name: 'test@example.com'
          } ]

        getEmails: (onSuccess, onFail) ->
          onSuccess [ 'test@example.com' ]

        getEmail: (onSuccess, onFail) ->
          onSuccess 'test@example.com'

