// Generated by CoffeeScript 1.9.3
(function() {
  angular.module('app').config(function($stateProvider) {
    return $stateProvider.state('loading', {
      url: '/loading',
      templateUrl: 'js/layout/loading.html',
      controller: 'LoadingController'
    });
  }).controller('LoadingController', function($scope, $q, $timeout, $state, AuthSrv) {
    var redirect, vm;
    vm = {};
    redirect = function() {
      return $timeout(function() {
        if (AuthSrv.isLogged()) {
          return $state.go('app.search');
        } else {
          return $state.go('login');
        }
      }, 300);
    };
    $scope.vm = vm;
    return $scope.$on('$ionicView.enter', function(viewInfo) {
      return redirect();
    });
  });

}).call(this);

//# sourceMappingURL=loading.js.map
