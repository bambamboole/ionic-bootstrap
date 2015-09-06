# for Dialogs plugin : org.apache.cordova.dialogs (https://github.com/apache/cordova-plugin-dialogs)
angular.module 'app'

.factory 'DialogPlugin', ($window, $q, $log, PluginUtils) ->
  pluginName = 'Dialogs'

  pluginTest = ->
    $window.navigator and $window.navigator.notification

  ###
     * Button indexes :
     *    - 0 : cancel with backdrop
     *    - 1 : Ok
     *    - 2 : Annuler
     * Or, your index in buttonLabels array but one based !!! (0 is still cancel)
  ###

  service =
    alert: pluginAlert
    confirm: (message, _title) ->
      pluginConfirm(message, _title).then (buttonIndex) ->
        _isConfirm buttonIndex
    confirmMulti: pluginConfirm
    prompt: (message, _title, _defaultText) ->
      pluginPrompt(message, _title, null, _defaultText).then (result) ->
        result.confirm = _isConfirm(result.buttonIndex)
        result
    promptMulti: pluginPrompt
    beep: pluginBeep
  AudioCtx = window.AudioContext or window.webkitAudioContext

  pluginAlert = (message, _title, _buttonName) ->
    PluginUtils.onReady(pluginName, pluginTest).then (->
      defer = $q.defer()
      $window.navigator.notification.alert message, (->
        defer.resolve()

      ), _title, _buttonName
      defer.promise
    ), (error) ->
      $log.error 'pluginError:' + pluginName, error
      $window.alert message


  pluginConfirm = (message, _title, _buttonLabels) ->
    PluginUtils.onReady(pluginName, pluginTest).then (->
      defer = $q.defer()
      $window.navigator.notification.confirm message, ((buttonIndex) ->
        defer.resolve buttonIndex

      ), _title, _buttonLabels
      defer.promise
    ), (error) ->
      $log.error 'pluginError:' + pluginName, error
      _toButtonIndex $window.confirm(message)

  pluginPrompt = (message, _title, _buttonLabels, _defaultText) ->
    PluginUtils.onReady(pluginName, pluginTest).then (->
      defer = $q.defer()
      $window.navigator.notification.prompt message, ((result) ->
        defer.resolve result

      ), _title, _buttonLabels, _defaultText
      defer.promise
    ), (error) ->
      $log.error 'pluginError:' + pluginName, error
      text = $window.prompt(message, _defaultText)
      {
      buttonIndex: _toButtonIndex(text)
      input1: text
      }

  pluginBeep = (times) ->
    if !times
      times = 1
    PluginUtils.onReady(pluginName, pluginTest).then (->
      $window.navigator.notification.beep times

    ), (error) ->
      $log.error 'pluginError:' + pluginName, error
      if beepFallback
        beepFallback times
      else
        $q.reject error


  _isConfirm = (buttonIndex) ->
    if buttonIndex == 1 then true else false

  _toButtonIndex = (value) ->
    if value then 1 else 2

  if AudioCtx
    ctx = new AudioCtx

    html5Beep = (callback) ->
      duration = 200
      type = 0
      if !callback

        callback = ->

      osc = ctx.createOscillator()
      osc.type = type
      osc.connect ctx.destination
      osc.noteOn 0
      $window.setTimeout (->
        osc.noteOff 0
        callback()

      ), duration


    beepFallback = (times) ->
      if times > 0
        html5Beep ->
          $window.setTimeout (->
            beepFallback times - 1

          ), 500



  return service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.navigator
      window.navigator = {}
    if !window.navigator.notification
      window.navigator.notification = do ->
        ctx = new ((window.AudioContext or window.webkitAudioContext))

        html5Beep = (callback) ->
          duration = 200
          type = 0
          if !callback

            callback = ->

          osc = ctx.createOscillator()
          osc.type = type
          osc.connect ctx.destination
          osc.noteOn 0
          window.setTimeout (->
            osc.noteOff 0
            callback()
            return
          ), duration
          return

        beep = (times) ->
          if times > 0
            html5Beep ->
              window.setTimeout (->
                beep times - 1
                return
              ), 500
              return
          return

        {
        alert: (message, alertCallback, title, buttonName) ->
          window.alert message
          if alertCallback
            alertCallback()
          return
        confirm: (message, confirmCallback, title, buttonLabels) ->
          c = window.confirm(message)
          if confirmCallback
            confirmCallback if c then 1 else 2
          return
        prompt: (message, promptCallback, title, buttonLabels, defaultText) ->
          text = window.prompt(message, defaultText)
          if promptCallback
            promptCallback
              buttonIndex: if text then 1 else 2
              input1: text
          return
        beep: beep
        }
