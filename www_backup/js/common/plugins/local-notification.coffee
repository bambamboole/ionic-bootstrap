# for LocalNotification plugin : de.appplant.cordova.plugin.local-notification (https://github.com/katzer/cordova-plugin-local-notifications/)
angular.module 'app'

.factory 'LocalNotificationPlugin', ($window, $q, PluginUtils) ->
  pluginName = 'LocalNotification'

  pluginTest = ->
    $window.plugin and $window.plugin.notification and $window.plugin.notification.local

  service =
    schedule: schedule
    cancel: cancel
    onClick: (callback) ->
      onReady 'click', callback

  schedule = (opts) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.plugin.notification.local.schedule opts


  cancel = (id) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugin.notification.local.cancel id, ->
        defer.resolve()

      defer.promise

  onReady = (event, callback) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.plugin.notification.local.on event, callback


  return service

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.plugin
      window.plugin = {}
    if !window.plugin.notification
      window.plugin.notification = {}
    if !window.plugin.notification.local
      window.plugin.notification.local = do ->
        notifs = {}
        # https://github.com/katzer/cordova-plugin-local-notifications/wiki/04.-Scheduling#interface
        defaults =
          id: '0'
          title: ''
          text: ''
          every: 0
          at: new Date
          badge: 0
          sound: 'res://platform_default'
          data: null
          icon: 'res://icon'
          smallIcon: 'res://ic_popup_reminder'
          ongoing: false
          led: 'FFFFFF'
        ret =
          hasPermission: (callback, scope) ->
            if callback
              callback true
            return
          registerPermission: (callback, scope) ->
            if callback
              callback true
            return
          schedule: (opts, callback, scope) ->
            if !Array.isArray(opts)
              opts = [opts]
            for i of opts
              params = withDefaults(opts[i])
              if ret.onadd
                ret.onadd params.id, 'foreground', params.json
              notifs[params.id] = params
            if callback
              callback()
            return
          cancel: (id, callback, scope) ->
            if ret.oncancel
              ret.oncancel id, 'foreground', notifs[id].json
            delete notifs[id]
            if callback
              callback()
            return
          cancelAll: (callback, scope) ->
            for i of notifs
              if ret.oncancel
                ret.oncancel notifs[i].id, 'foreground', notifs[i].json
              delete notifs[i]
            if callback
              callback()
            return
          on: (event, callback) ->
          isScheduled: (id, callback, scope) ->
            if callback
              callback !!notifs[id]
            return
          getScheduledIds: (callback, scope) ->
            if callback
              ids = []
              for i of notifs
                ids.push notifs[i].id
              callback ids
            return
          isTriggered: (id, callback, scope) ->
            if callback
              callback false
            return
          getTriggeredIds: (callback, scope) ->
            if callback
              callback []
            return
          getDefaults: ->
            JSON.parse JSON.stringify(defaults)
          setDefaults: (opts) ->
            defaults = withDefaults(opts)
            return

        withDefaults = (opts) ->
          res = JSON.parse(JSON.stringify(defaults))
          for i of opts
            res[i] = opts[i]
          res

        ret
