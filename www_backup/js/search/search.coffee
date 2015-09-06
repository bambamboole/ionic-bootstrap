angular.module 'app'

.config ($stateProvider) ->
  $stateProvider
  .state 'app.search',
    url: '/search'
    templateUrl: 'js/search/search.html'
    controller: 'SearchController'

.controller 'SearchController', ($scope) ->
  vm = {}

  $scope.vm = vm