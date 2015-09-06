angular.module 'app'

.factory 'PluginUtils', ($window, $ionicPlatform, $q, $log) ->
  service = onReady: onReady

  onReady = (name, testFn) ->
    $ionicPlatform.ready().then ->
      if !testFn()
        $log.error 'pluginNotFound:' + name
        return $q.reject(message: 'pluginNotFound:' + name)

  service


