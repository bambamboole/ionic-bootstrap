angular.module 'app'

.factory 'AuthSrv', AuthSrv

.factory 'AuthInterceptor', AuthInterceptor


AuthSrv.$inject = [
  '$http'
  'UserSrv'
  'StorageUtils'
  'Config'
]

AuthInterceptor.$inject = [
  '$q'
  '$location'
  '$log'
]

AuthSrv = ($http, UserSrv, StorageUtils, Config) ->
  service =
    login: login
    logout: logout
    isLogged: isLogged

  login = (credentials) ->
    $http.get(Config.backendUrl + '/login',
      login: credentials.login
      password: credentials.password).then (res) ->
    user = res.data
    user.logged = true
    UserSrv.set(user).then ->
      user

  logout = ->
    $http.get(Config.backendUrl + '/logout').then ->
      UserSrv.get().then (user) ->
        user.logged = false
        UserSrv.set user

  isLogged = ->
    user = StorageUtils.getSync(UserSrv.storageKey)
    user and user.logged == true

  service

AuthInterceptor = ($q, $location, $log) ->
  service =
    request: onRequest
    response: onResponse
    responseError: onResponseError

  onRequest = (config) ->
# add headers here if you want...
    config

  onResponse = (response) ->
    response

  onResponseError = (response) ->
    $log.warn 'request error', response
    if response.status == 401 or response.status == 403
# user is not authenticated
      $location.path '/login'
    $q.reject response

  service



