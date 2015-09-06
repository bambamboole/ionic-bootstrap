# for Sharing plugin : https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
angular.module 'app'

.factory 'SocialSharingPlugin', ($window, $q, $log, PluginUtils) ->
  pluginName = 'SocialSharing'

  pluginTest = ->
    $window.plugins and $window.plugins.socialsharing

  service =
    share: share
    shareViaFacebook: shareViaFacebook
    shareViaTwitter: shareViaTwitter
    shareViaEmail: shareViaEmail
  # _fileOrFileArray can be null, a string or an array of strings

  share = (message, _subject, _fileOrFileArray, _link) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.socialsharing.share message, _subject or null, _fileOrFileArray or null, _link or null, (->
        defer.resolve()

      ), (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      defer.promise

  shareViaFacebook = (message, _fileOrFileArray, _link) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint message, _fileOrFileArray or null, _link or null, 'Tu peux coller le message par défaut si tu veux...', (->
        defer.resolve()

      ), (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      defer.promise

  shareViaTwitter = (message, _file, _link) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.socialsharing.shareViaTwitter message, _file or null, _link or null, (->
        defer.resolve()

      ), (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      defer.promise

  shareViaEmail = (message, _subject, _fileOrFileArray) ->
    PluginUtils.onReady(pluginName, pluginTest).then ->
      defer = $q.defer()
      $window.plugins.socialsharing.shareViaEmail message, _subject or null, null, null, null, _fileOrFileArray or null, (->
        defer.resolve()

      ), (error) ->
        $log.error 'pluginError:' + pluginName, error
        defer.reject error

      defer.promise

  service


###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
  else

