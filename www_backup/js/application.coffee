angular.module 'app', [
  'ionic'
  'ngCordova'
  'LocalForageModule'
]

.run ($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config) ->
  checkRouteRights = undefined
  setupPushNotifications = undefined

  checkRouteRights = ->
    $rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
      logged = undefined
      restricted = undefined
      if toState and toState.data and Array.isArray(toState.data.restrictAccess)
        restricted = toState.data.restrictAccess
        logged = AuthSrv.isLogged()
        if logged and restricted.indexOf('notLogged') > -1
          event.preventDefault()
          $log.log 'IllegalAccess', 'State <' + toState.name + '> is restricted to non logged users !'
          return $state.go('loading')
        else if !logged and restricted.indexOf('logged') > -1
          event.preventDefault()
          $log.log 'IllegalAccess', 'State <' + toState.name + '> is restricted to logged users !'
          return $state.go('loading')

  checkRouteRights()


.config ($urlRouterProvider, $provide, $httpProvider) ->
  $urlRouterProvider.otherwise '/loading'
  $provide.decorator '$log', [
    '$delegate'
    'customLogger'
    ($delegate, customLogger) ->
      customLogger $delegate
  ]
  $httpProvider.interceptors.push 'AuthInterceptor'


.config ($stateProvider) ->
  $stateProvider
  .state 'loading',
    url: '/loading'
    templateUrl: 'js/layout/loading.html'
    controller: 'LoadingCtrl'
  .state 'app',
    url: '/app'
    abstract: true
    templateUrl: 'js/layout/menu.html'
    controller: 'MenuCtrl'
    data:
      restrictAccess: ['logged']



date = undefined
datetime = undefined
duration = undefined
humanTime = undefined
mynumber = undefined
rating = undefined
time = undefined

angular.module('app').constant('Config', Config).constant('_', _).constant 'moment', moment

angular.module('app')
.filter('date', date)
.filter('datetime', datetime)
.filter('time', time)
.filter('humanTime', humanTime)
.filter('duration', duration)
.filter('mynumber', mynumber)
.filter 'rating', rating

date = (Utils, moment) ->
  (date, format) ->
    jsDate = undefined
    jsDate = Utils.toDate(date)
    if jsDate
      moment(jsDate).format if format then format else 'll'
    else
      '<date>'

datetime = (Utils, moment) ->
  (date, format) ->
    jsDate = undefined
    jsDate = Utils.toDate(date)
    if jsDate
      moment(jsDate).format if format then format else 'D MMM YYYY, HH:mm:ss'
    else
      '<datetime>'

time = (Utils, moment) ->
  (date, format) ->
    jsDate = undefined
    jsDate = Utils.toDate(date)
    if jsDate
      moment(jsDate).format if format then format else 'LT'
    else
      '<time>'

humanTime = (Utils, moment) ->
  (date) ->
    jsDate = undefined
    jsDate = Utils.toDate(date)
    if jsDate
      moment(jsDate).fromNow true
    else
      '<humanTime>'

duration = ($log, moment) ->
  (seconds, humanize) ->
    prefix = undefined
    if seconds or seconds == 0
      if humanize
        moment.duration(seconds, 'seconds').humanize()
      else
        prefix = if -60 < seconds and seconds < 60 then '00:' else ''
        prefix + moment.duration(seconds, 'seconds').format('hh:mm:ss')
    else
      $log.warn 'Unable to format duration', seconds
      '<duration>'

mynumber = ($filter) ->
  (number, round) ->
    mul = undefined
    mul = 10 ** (if round then round else 0)
    $filter('number') Math.round(number * mul) / mul

rating = ($filter) ->
  (rating, max, withText) ->
    maxStars = undefined
    stars = undefined
    text = undefined
    stars = if rating then new Array(Math.floor(rating) + 1).join('★') else ''
    maxStars = if max then new Array(Math.floor(max) - Math.floor(rating) + 1).join('☆') else ''
    text = if withText then ' (' + $filter('mynumber')(rating, 1) + ' / ' + $filter('mynumber')(max, 1) + ')' else ''
    stars + maxStars + text


