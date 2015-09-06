angular.module 'app', [
  'ionic'
  'ngCordova'
  'LocalForageModule'
  'templates'
]

.run ($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config) ->

  $rootScope.$on '$stateChangeStart', ->
    console.log 'StateChange', arguments

  checkRouteRights = ->
    $rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
      if toState and toState.data and Array.isArray(toState.data.restrictAccess)
        restricted = toState.data.restrictAccess
        logged = AuthSrv.isLogged()
        if logged and restricted.indexOf('notLogged') > -1
          event.preventDefault()
          $log.log 'IllegalAccess', 'State <' + toState.name + '> is restricted to non logged users !'
          $state.go 'loading'
        else if !logged and restricted.indexOf('logged') > -1
          event.preventDefault()
          $log.log 'IllegalAccess', 'State <' + toState.name + '> is restricted to logged users !'
          $state.go 'loading'





  checkRouteRights()


.config ($urlRouterProvider, $provide, $httpProvider) ->
# ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);
  $urlRouterProvider.otherwise '/loading'
  # improve angular logger
  $provide.decorator '$log', [
    '$delegate'
    'customLogger'
    ($delegate, customLogger) ->
      customLogger $delegate
  ]
  # configure $http requests according to authentication
  $httpProvider.interceptors.push 'AuthInterceptor'


