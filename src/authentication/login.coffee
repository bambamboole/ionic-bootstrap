angular.module 'app'

.config ($stateProvider) ->
  $stateProvider.state 'login',
    url: '/login'
    templateUrl: 'js/authentication/login.html'
    controller: 'LoginController'
    data:
      restrictAccess: ['notLogged']

.controller 'LoginController', ($scope, $state, AuthSrv) ->
  vm = {}

  login = (credentials) ->
    vm.error = null
    vm.loading = true
    AuthSrv.login(credentials).then ->
      $state.go 'app.search'
      vm.credentials.password = ''
      vm.error = null
      vm.loading = false

    , (error) ->
      vm.credentials.password = ''
      vm.error = if error.data and error.data.message then error.data.message else error.statusText
      vm.loading = false

  $scope.vm = vm
  vm.error = null
  vm.loding = false
  vm.credentials =
    login: ''
    password: ''
  vm.login = login
