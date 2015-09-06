angular.module 'app'

.config ($stateProvider) ->
  $stateProvider
  .state 'loading',
    url: '/loading'
    templateUrl: 'js/layout/loading.html'
    controller: 'LoadingController'

.controller 'LoadingController', ($scope, $q, $timeout, $state, AuthSrv) ->
  vm = {}

  redirect = ->
    $timeout ->
      if AuthSrv.isLogged()
        $state.go 'app.search'
      else
        $state.go 'login'

    , 300


  $scope.vm = vm
  $scope.$on '$ionicView.enter', (viewInfo) ->
    redirect()
