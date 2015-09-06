# for Camera plugin : org.apache.cordova.camera (https://github.com/apache/cordova-plugin-camera)
angular.module 'app'

.factory 'CameraPlugin', ($window, $q, $log, PluginUtils) ->
  pluginName = 'Camera'

  pluginTest = ->
    $window.navigator and $window.navigator.camera

  service =
    getPicture: _getPicture
    takePicture: takePicture
    findPicture: findPicture
  defaultOpts =
    quality: 75
    destinationType: $window.Camera.DestinationType.FILE_URI
    sourceType: $window.Camera.PictureSourceType.CAMERA
    allowEdit: false
    encodingType: $window.Camera.EncodingType.JPEG
    mediaType: $window.Camera.MediaType.PICTURE
    cameraDirection: $window.Camera.Direction.BACK
    correctOrientation: true
    saveToPhotoAlbum: false

  _getPicture = (_opts) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      opts = angular.extend(defaultOpts, _opts)
      defer = $q.defer()
      $window.navigator.camera.getPicture ((picture) ->
        defer.resolve picture

      ), ((error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      ), opts
      defer.promise

  takePicture = ->
    _getPicture {}

  findPicture = ->
    _getPicture sourceType: $window.Camera.PictureSourceType.PHOTOLIBRARY

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
    if !window.navigator.camera
      window.navigator.camera = do ->
        window.Camera =
          DestinationType:
            DATA_URL: 0
            FILE_URI: 1
            NATIVE_URI: 2
          Direction:
            BACK: 0
            FRONT: 1
          EncodingType:
            JPEG: 0
            PNG: 1
          MediaType:
            PICTURE: 0
            VIDEO: 1
            ALLMEDIA: 2
          PictureSourceType:
            PHOTOLIBRARY: 0
            CAMERA: 1
            SAVEDPHOTOALBUM: 2
          PopoverArrowDirection:
            ARROW_UP: 1
            ARROW_DOWN: 2
            ARROW_LEFT: 4
            ARROW_RIGHT: 8
            ARROW_ANY: 15
        ret = JSON.parse(JSON.stringify(window.Camera))

        ret.getPicture = (success, error, options) ->
          uri = window.prompt('Image uri :')
          if uri
            if success
              success uri
          else
            if error
              error()
          return

        return ret
