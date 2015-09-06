# for Media plugin : org.apache.cordova.media (https://github.com/apache/cordova-plugin-media)
angular.module 'app'
.factory 'MediaPlugin', ($window, $q, $ionicPlatform, $log, PluginUtils) ->
  pluginName = 'Media'

  pluginTest = ->
    $window.Media

  service =
    loadMedia: loadMedia
    statusToMessage: statusToMessage
    errorToMessage: errorToMessage

  loadMedia = (src, onStop, onError, onStatus) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      mediaSuccess = ->
        if onStop
          onStop()


      mediaError = (error) ->
        $log.error 'pluginError:' + pluginName,
          src: src
          code: error.code
          message: errorToMessage(error.code)
        if onError
          onError error

      mediaStatus = (status) ->
        if onStatus
          onStatus status

      if $ionicPlatform.is('android')
        src = '/android_asset/www/' + src
      new ($window.Media)(src, mediaSuccess, mediaError, mediaStatus)

  statusToMessage = (status) ->
    if status == 0
      'Media.MEDIA_NONE'
    else if status == 1
      'Media.MEDIA_STARTING'
    else if status == 2
      'Media.MEDIA_RUNNING'
    else if status == 3
      'Media.MEDIA_PAUSED'
    else if status == 4
      'Media.MEDIA_STOPPED'
    else
      'Unknown status <' + status + '>'

  errorToMessage = (code) ->
    if code == 1
      'MediaError.MEDIA_ERR_ABORTED'
    else if code == 2
      'MediaError.MEDIA_ERR_NETWORK'
    else if code == 3
      'MediaError.MEDIA_ERR_DECODE'
    else if code == 4
      'MediaError.MEDIA_ERR_NONE_SUPPORTED'
    else
      'Unknown code <' + code + '>'

  service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.Media

      window.Media = (src, mediaSuccess, mediaError, mediaStatus) ->
# src: A URI containing the audio content. (DOMString)
# mediaSuccess: (Optional) The callback that executes after a Media object has completed the current play, record, or stop action. (Function)
# mediaError: (Optional) The callback that executes if an error occurs. (Function)
# mediaStatus: (Optional) The callback that executes to indicate status changes. (Function)
        if typeof Audio != 'function' and typeof Audio != 'object'
          console.warn 'HTML5 Audio is not supported in this browser'
        sound = new Audio
        sound.src = src
        sound.addEventListener 'ended', mediaSuccess, false
        sound.load()
        {
        getCurrentPosition: (mediaSuccess, mediaError) ->
          mediaSuccess sound.currentTime

        getDuration: ->
          if isNaN(sound.duration) then -1 else sound.duration
        play: ->
          sound.play()

        pause: ->
          sound.pause()

        release: ->
        seekTo: (milliseconds) ->
        setVolume: (volume) ->
          sound.volume = volume

        startRecord: ->
        stopRecord: ->
        stop: ->
          sound.pause()
          if mediaSuccess
            mediaSuccess()


        }

  

