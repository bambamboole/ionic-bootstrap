angular.module 'app'

.config ($stateProvider) ->
  $stateProvider
  .state 'app.charts',
    url: '/charts'
    templateUrl: 'js/charts/charts.html'
    controller: 'ChartsController'

.controller 'ChartsController', ($scope) ->
  vm = {}

  $scope.vm = vm