angular.module 'app'

.config ($stateProvider) ->
  $stateProvider
  .state('app',
    url: '/app'
    abstract: true
    templateUrl: 'js/layout/menu.html'
    controller: 'MenuCtrl'
    data:
      restrictAccess: ['logged'])

.controller 'MenuCtrl', ($scope, $state, AuthSrv) ->
  vm = {}

  logout = ->
    AuthSrv.logout().then ->
      $state.go 'login'

  $scope.vm = vm
  vm.logout = logout
