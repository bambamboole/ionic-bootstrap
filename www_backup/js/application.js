angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule']).run(function($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config) {
  var checkRouteRights;
  $rootScope.$on('$stateChangeStart', function() {
    return console.log('StateChange', arguments);
  });
  checkRouteRights = function() {
    return $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      var logged, restricted;
      if (toState && toState.data && Array.isArray(toState.data.restrictAccess)) {
        restricted = toState.data.restrictAccess;
        logged = AuthSrv.isLogged();
        if (logged && restricted.indexOf('notLogged') > -1) {
          event.preventDefault();
          $log.log('IllegalAccess', 'State <' + toState.name + '> is restricted to non logged users !');
          return $state.go('loading');
        } else if (!logged && restricted.indexOf('logged') > -1) {
          event.preventDefault();
          $log.log('IllegalAccess', 'State <' + toState.name + '> is restricted to logged users !');
          return $state.go('loading');
        }
      }
    });
  };
  return checkRouteRights();
}).config(function($urlRouterProvider, $provide, $httpProvider) {
  $urlRouterProvider.otherwise('/loading');
  $provide.decorator('$log', [
    '$delegate', 'customLogger', function($delegate, customLogger) {
      return customLogger($delegate);
    }
  ]);
  return $httpProvider.interceptors.push('AuthInterceptor');
});

var date, datetime, duration, humanTime, mynumber, rating, time;

angular.module('app', ['ionic', 'ngCordova', 'LocalForageModule']).run(function($rootScope, $state, $log, AuthSrv, UserSrv, PushPlugin, ToastPlugin, Config) {
  var checkRouteRights, setupPushNotifications;
  checkRouteRights = void 0;
  setupPushNotifications = void 0;
  checkRouteRights = function() {
    return $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      var logged, restricted;
      logged = void 0;
      restricted = void 0;
      if (toState && toState.data && Array.isArray(toState.data.restrictAccess)) {
        restricted = toState.data.restrictAccess;
        logged = AuthSrv.isLogged();
        if (logged && restricted.indexOf('notLogged') > -1) {
          event.preventDefault();
          $log.log('IllegalAccess', 'State <' + toState.name + '> is restricted to non logged users !');
          return $state.go('loading');
        } else if (!logged && restricted.indexOf('logged') > -1) {
          event.preventDefault();
          $log.log('IllegalAccess', 'State <' + toState.name + '> is restricted to logged users !');
          return $state.go('loading');
        }
      }
    });
  };
  return checkRouteRights();
}).config(function($urlRouterProvider, $provide, $httpProvider) {
  $urlRouterProvider.otherwise('/loading');
  $provide.decorator('$log', [
    '$delegate', 'customLogger', function($delegate, customLogger) {
      return customLogger($delegate);
    }
  ]);
  return $httpProvider.interceptors.push('AuthInterceptor');
}).config(function($stateProvider) {
  return $stateProvider.state('loading', {
    url: '/loading',
    templateUrl: 'js/layout/loading.html',
    controller: 'LoadingCtrl'
  }).state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'js/layout/menu.html',
    controller: 'MenuCtrl',
    data: {
      restrictAccess: ['logged']
    }
  });
});

date = void 0;

datetime = void 0;

duration = void 0;

humanTime = void 0;

mynumber = void 0;

rating = void 0;

time = void 0;

angular.module('app').constant('Config', Config).constant('_', _).constant('moment', moment);

angular.module('app').filter('date', date).filter('datetime', datetime).filter('time', time).filter('humanTime', humanTime).filter('duration', duration).filter('mynumber', mynumber).filter('rating', rating);

date = function(Utils, moment) {
  return function(date, format) {
    var jsDate;
    jsDate = void 0;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).format(format ? format : 'll');
    } else {
      return '<date>';
    }
  };
};

datetime = function(Utils, moment) {
  return function(date, format) {
    var jsDate;
    jsDate = void 0;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).format(format ? format : 'D MMM YYYY, HH:mm:ss');
    } else {
      return '<datetime>';
    }
  };
};

time = function(Utils, moment) {
  return function(date, format) {
    var jsDate;
    jsDate = void 0;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).format(format ? format : 'LT');
    } else {
      return '<time>';
    }
  };
};

humanTime = function(Utils, moment) {
  return function(date) {
    var jsDate;
    jsDate = void 0;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).fromNow(true);
    } else {
      return '<humanTime>';
    }
  };
};

duration = function($log, moment) {
  return function(seconds, humanize) {
    var prefix;
    prefix = void 0;
    if (seconds || seconds === 0) {
      if (humanize) {
        return moment.duration(seconds, 'seconds').humanize();
      } else {
        prefix = -60 < seconds && seconds < 60 ? '00:' : '';
        return prefix + moment.duration(seconds, 'seconds').format('hh:mm:ss');
      }
    } else {
      $log.warn('Unable to format duration', seconds);
      return '<duration>';
    }
  };
};

mynumber = function($filter) {
  return function(number, round) {
    var mul;
    mul = void 0;
    mul = Math.pow(10, (round ? round : 0));
    return $filter('number')(Math.round(number * mul) / mul);
  };
};

rating = function($filter) {
  return function(rating, max, withText) {
    var maxStars, stars, text;
    maxStars = void 0;
    stars = void 0;
    text = void 0;
    stars = rating ? new Array(Math.floor(rating) + 1).join('★') : '';
    maxStars = max ? new Array(Math.floor(max) - Math.floor(rating) + 1).join('☆') : '';
    text = withText ? ' (' + $filter('mynumber')(rating, 1) + ' / ' + $filter('mynumber')(max, 1) + ')' : '';
    return stars + maxStars + text;
  };
};

angular.module('app').constant('Config', Config).constant('_', _).constant('moment', moment);

var blurOnKeyboardOut, debounce, focusOnKeyboardOpen, href;

angular.module('app').directive('href', href).directive('debounce', debounce).directive('blurOnKeyboardOut', blurOnKeyboardOut).directive('focusOnKeyboardOpen', focusOnKeyboardOpen);

href = function($window) {
  var externePrefixes, isExterneUrl;
  externePrefixes = void 0;
  isExterneUrl = void 0;
  externePrefixes = ['http:', 'https:', 'tel:', 'sms:'];
  isExterneUrl = function(url) {
    var i;
    i = void 0;
    if (url) {
      for (i in externePrefixes) {
        i = i;
        if (url.indexOf(externePrefixes[i]) === 0) {
          return true;
        }
      }
    }
    return false;
  };
  return {
    restrict: 'A',
    scope: {
      url: '@href'
    },
    link: function(scope, element, attrs) {
      if (isExterneUrl(scope.url)) {
        return element.bind('click', function(e) {
          e.preventDefault();
          return $window.open(encodeURI(scope.url), '_system', 'location=yes');
        });
      }
    }
  };
};

debounce = function($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 99,
    link: function(scope, element, attr, ngModelCtrl) {
      debounce = void 0;
      if (attr.type === 'radio' || attr.type === 'checkbox') {
        return;
      }
      debounce = void 0;
      element.unbind('input');
      element.bind('input', function() {
        $timeout.cancel(debounce);
        return debounce = $timeout((function() {
          return scope.$apply(function() {
            return ngModelCtrl.$setViewValue(element.val());
          });
        }), attr.ngDebounce || 1000);
      });
      return element.bind('blur', function() {
        return scope.$apply(function() {
          return ngModelCtrl.$setViewValue(element.val());
        });
      });
    }
  };
};

blurOnKeyboardOut = function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      return $window.addEventListener('native.keyboardhide', function(e) {
        element[0].blur();
        return scope.safeApply(function() {
          return scope.$eval(attrs.blurOnKeyboardOut);
        });
      });
    }
  };
};

focusOnKeyboardOpen = function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var keyboardOpen;
      keyboardOpen = void 0;
      keyboardOpen = false;
      $window.addEventListener('native.keyboardshow', function(e) {
        keyboardOpen = true;
        return element[0].focus();
      });
      $window.addEventListener('native.keyboardhide', function(e) {
        keyboardOpen = false;
        return element[0].blur();
      });
      return element[0].addEventListener('blur', (function(e) {
        if (keyboardOpen) {
          return element[0].focus();
        }
      }), true);
    }
  };
};

var date, datetime, duration, humanTime, mynumber, rating, time;

angular.module('app').filter('date', date).filter('datetime', datetime).filter('time', time).filter('humanTime', humanTime).filter('duration', duration).filter('mynumber', mynumber).filter('rating', rating);

date = function(Utils, moment) {
  return function(date, format) {
    var jsDate;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).format(format ? format : 'll');
    } else {
      return '<date>';
    }
  };
};

datetime = function(Utils, moment) {
  return function(date, format) {
    var jsDate;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).format(format ? format : 'D MMM YYYY, HH:mm:ss');
    } else {
      return '<datetime>';
    }
  };
};

time = function(Utils, moment) {
  return function(date, format) {
    var jsDate;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).format(format ? format : 'LT');
    } else {
      return '<time>';
    }
  };
};

humanTime = function(Utils, moment) {
  return function(date) {
    var jsDate;
    jsDate = Utils.toDate(date);
    if (jsDate) {
      return moment(jsDate).fromNow(true);
    } else {
      return '<humanTime>';
    }
  };
};

duration = function($log, moment) {
  return function(seconds, humanize) {
    var prefix;
    if (seconds || seconds === 0) {
      if (humanize) {
        return moment.duration(seconds, 'seconds').humanize();
      } else {
        prefix = -60 < seconds && seconds < 60 ? '00:' : '';
        return prefix + moment.duration(seconds, 'seconds').format('hh:mm:ss');
      }
    } else {
      $log.warn('Unable to format duration', seconds);
      return '<duration>';
    }
  };
};

mynumber = function($filter) {
  return function(number, round) {
    var mul;
    mul = Math.pow(10, (round ? round : 0));
    return $filter('number')(Math.round(number * mul) / mul);
  };
};

rating = function($filter) {
  return function(rating, max, withText) {
    var maxStars, stars, text;
    stars = rating ? new Array(Math.floor(rating) + 1).join('★') : '';
    maxStars = max ? new Array(Math.floor(max) - Math.floor(rating) + 1).join('☆') : '';
    text = withText ? ' (' + $filter('mynumber')(rating, 1) + ' / ' + $filter('mynumber')(max, 1) + ')' : '';
    return stars + maxStars + text;
  };
};

var AuthInterceptor, AuthSrv;

angular.module('app').factory('AuthSrv', AuthSrv).factory('AuthInterceptor', AuthInterceptor);

AuthSrv.$inject = ['$http', 'UserSrv', 'StorageUtils', 'Config'];

AuthInterceptor.$inject = ['$q', '$location', '$log'];

AuthSrv = function($http, UserSrv, StorageUtils, Config) {
  var isLogged, login, logout, service;
  service = {
    login: login,
    logout: logout,
    isLogged: isLogged
  };
  login = function(credentials) {
    var user;
    $http.get(Config.backendUrl + '/login', {
      login: credentials.login,
      password: credentials.password
    }).then(function(res) {});
    user = res.data;
    user.logged = true;
    return UserSrv.set(user).then(function() {
      return user;
    });
  };
  logout = function() {
    return $http.get(Config.backendUrl + '/logout').then(function() {
      return UserSrv.get().then(function(user) {
        user.logged = false;
        return UserSrv.set(user);
      });
    });
  };
  isLogged = function() {
    var user;
    user = StorageUtils.getSync(UserSrv.storageKey);
    return user && user.logged === true;
  };
  return service;
};

AuthInterceptor = function($q, $location, $log) {
  var onRequest, onResponse, onResponseError, service;
  service = {
    request: onRequest,
    response: onResponse,
    responseError: onResponseError
  };
  onRequest = function(config) {
    return config;
  };
  onResponse = function(response) {
    return response;
  };
  onResponseError = function(response) {
    $log.warn('request error', response);
    if (response.status === 401 || response.status === 403) {
      $location.path('/login');
    }
    return $q.reject(response);
  };
  return service;
};

angular.module('app').config(function($stateProvider) {
  return $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'js/authentication/login.html',
    controller: 'LoginController',
    data: {
      restrictAccess: ['notLogged']
    }
  });
}).controller('LoginController', function($scope, $state, AuthSrv) {
  var login, vm;
  vm = {};
  login = function(credentials) {
    vm.error = null;
    vm.loading = true;
    return AuthSrv.login(credentials).then(function() {
      $state.go('app.search');
      vm.credentials.password = '';
      vm.error = null;
      return vm.loading = false;
    }, function(error) {
      vm.credentials.password = '';
      vm.error = error.data && error.data.message ? error.data.message : error.statusText;
      return vm.loading = false;
    });
  };
  $scope.vm = vm;
  vm.error = null;
  vm.loding = false;
  vm.credentials = {
    login: '',
    password: ''
  };
  return vm.login = login;
});

var UserSrv;

angular.module('app').factory('UserSrv', UserSrv);

UserSrv.$inject = ['StorageUtils'];

UserSrv = function(StorageUtils) {
  var deleteCurrentUser, getCurrentUser, service, setCurrentUser, userKey;
  userKey = 'user';
  service = {
    storageKey: userKey,
    get: getCurrentUser,
    set: setCurrentUser,
    "delete": deleteCurrentUser
  };
  getCurrentUser = function() {
    return StorageUtils.get(userKey);
  };
  setCurrentUser = function(user) {
    return StorageUtils.set(userKey, user);
  };
  deleteCurrentUser = function() {
    return StorageUtils.clear(userKey);
  };
  return service;
};

angular.module('app').config(function($stateProvider) {
  return $stateProvider.state('app.charts', {
    url: '/charts',
    templateUrl: 'js/charts/charts.html',
    controller: 'ChartsController'
  });
}).controller('ChartsController', function($scope) {
  var vm;
  vm = {};
  return $scope.vm = vm;
});

angular.module('app').factory('CollectionUtils', function(_) {
  var clear, copy, isEmpty, isNotEmpty, removeElt, removeEltBy, service, size, toArray, toMap, updateElt, updateEltBy, upsertElt, upsertEltBy;
  service = {
    clear: clear,
    copy: copy,
    updateElt: updateElt,
    upsertElt: upsertElt,
    removeElt: removeElt,
    updateEltBy: updateEltBy,
    upsertEltBy: upsertEltBy,
    removeEltBy: removeEltBy,
    toMap: toMap,
    toArray: toArray,
    size: size,
    isEmpty: isEmpty,
    isNotEmpty: isNotEmpty
  };
  clear = function(col) {
    var i, results, results1;
    if (Array.isArray(col)) {
      results = [];
      while (col.length > 0) {
        results.push(col.pop());
      }
      return results;
    } else {
      results1 = [];
      for (i in col) {
        results1.push(delete col[i]);
      }
      return results1;
    }
  };
  copy = function(srcCol, destCol) {
    var i, results;
    clear(destCol);
    results = [];
    for (i in srcCol) {
      results.push(destCol[i] = angular.copy(srcCol[i]));
    }
    return results;
  };
  updateElt = function(collection, selector, elt) {
    var foundElt, replacedElt;
    foundElt = _.find(collection, selector);
    if (foundElt) {
      replacedElt = angular.copy(foundElt);
      angular.copy(elt, foundElt);
      return replacedElt;
    }
  };
  upsertElt = function(collection, selector, key, elt) {
    var foundElt, replacedElt;
    foundElt = _.find(collection, selector);
    if (foundElt) {
      replacedElt = angular.copy(foundElt);
      angular.copy(elt, foundElt);
      return replacedElt;
    } else {
      if (Array.isArray(collection)) {
        return collection.push(elt);
      } else {
        return collection[key] = elt;
      }
    }
  };
  removeElt = function(collection, selector) {
    return _.remove(collection, selector);
  };
  updateEltBy = function(collection, elt, keyAttr) {
    var selector;
    selector = {};
    selector[keyAttr] = elt[keyAttr];
    return updateElt(collection, selector, elt);
  };
  upsertEltBy = function(collection, elt, keyAttr) {
    var selector;
    selector = {};
    selector[keyAttr] = elt[keyAttr];
    return upsertElt(collection, selector, elt[keyAttr], elt);
  };
  removeEltBy = function(collection, elt, keyAttr) {
    var selector;
    selector = {};
    selector[keyAttr] = elt[keyAttr];
    return removeElt(collection, selector);
  };
  toMap = function(arr) {
    var i, map;
    map = {};
    if (Array.isArray(arr)) {
      for (i in arr) {
        map[arr[i].id] = arr[i];
      }
    }
    return map;
  };
  toArray = function(map) {
    var arr, i;
    arr = [];
    for (i in map) {
      map[i].id = i;
      arr.push(map[i]);
    }
    return arr;
  };
  size = function(col) {
    if (Array.isArray(col)) {
      return col.length;
    } else {
      return Object.keys(col).length;
    }
  };
  isEmpty = function(col) {
    return size(col) === 0;
  };
  isNotEmpty = function(col) {
    return !isEmpty(col);
  };
  return service;
});

angular.module('app').factory('CrudRestUtils', function($http, $q, $cacheFactory, $window, $log, CollectionUtils, Utils) {
  var _crudConfig, _crudFind, _crudFindOne, _crudGet, _crudGetAll, _crudGetUrl, _crudRemove, _crudSave, _ctrlAddElt, _ctrlCancelEdit, _ctrlCreate, _ctrlEdit, _ctrlEltRestUrl, _ctrlInit, _ctrlRemove, _ctrlRemoveElt, _ctrlSave, _ctrlSort, _ctrlToggle, _invalideAllCache, _setInCache, createCrud, createCrudCtrl, service;
  service = {
    createCrud: createCrud,
    createCrudCtrl: createCrudCtrl
  };

  /**
     * Create a service connected to a REST backend with following endpoints :
     *  - GET     /endpoint       : return an array of all values in the property 'data' of the response
     *  - GET     /endpoint?where : return an array of values matching object specified in 'where' in the property 'data' of the response
     *  - GET     /endpoint/:id   : return the value with the specified id in the property 'data' of the response
     *  - POST    /endpoint       : create new value with a random id an return the created id in the property 'data' of the response
     *  - PUT     /endpoint/:id   : update the value with the specified id
     *  - DELETE  /endpoint/:id   : delete the value with the specified id and return only the status code
     *
     * Params starting with '_' are optionnals
     * @param endpointUrl: String                     REST API url (like http://localhost:9000/api/v1/todos)
     * @param _objectKey: String (default: 'id')      elt attribute used as id (access to http://localhost:9000/api/v1/todos/myid as elt url !)
     * @param _getData: function(response){}          transform API response and returns data (list of elts or elt according to called methods)
     * @param _processBreforeSave: function(elt){}    process elt before saving it
     * @param _useCache: Boolean (default: true)      should the service use angular cache
     * @param _httpConfig: Headers                    http headers to add to all API requests
   */
  createCrud = function(endpointUrl, _objectKey, _getData, _processBreforeSave, _useCache, _httpConfig) {
    var CrudSrv, cache, objectKey;
    objectKey = _objectKey ? _objectKey : 'id';
    cache = _useCache === false ? null : $cacheFactory.get(endpointUrl) || $cacheFactory(endpointUrl);
    CrudSrv = {
      eltKey: objectKey,
      getUrl: function(_id) {
        return _crudGetUrl(endpointUrl, _id);
      },
      getAll: function(_noCache) {
        return _crudGetAll(endpointUrl, objectKey, cache, _noCache, _getData, _httpConfig);
      },
      find: function(where, params) {
        return _crudFind(where, params, endpointUrl, objectKey, cache, _getData, _httpConfig);
      },
      findOne: function(where) {
        return _crudFindOne(where, endpointUrl, objectKey, cache, _getData, _httpConfig);
      },
      get: function(id, _noCache) {
        return _crudGet(id, endpointUrl, objectKey, cache, _noCache, _getData, _httpConfig);
      },
      save: function(elt) {
        return _crudSave(elt, endpointUrl, objectKey, cache, _processBreforeSave, _getData, _httpConfig);
      },
      remove: function(elt) {
        return _crudRemove(elt, endpointUrl, objectKey, cache, _httpConfig);
      }
    };
    return CrudSrv;
  };

  /*
     * Create data and functions to use in crud controller, based on a CrudSrv
     *
     * Params starting with '_' are optionnals
     * @param CrudSrv                       data service to connect with
     * @param _defaultSort: {order, desc}   how to sort elts by default
     * @param _defaultFormElt: elt          default elt to load in form when create new elt
   */
  createCrudCtrl = function(CrudSrv, _defaultSort, _defaultFormElt) {
    var ctrl, data;
    data = {
      elts: [],
      currentSort: _defaultSort ? _defaultSort : {},
      selectedElt: null,
      defaultFormElt: _defaultFormElt ? _defaultFormElt : {},
      form: null,
      status: {
        error: null,
        loading: true,
        saving: false,
        removing: false
      }
    };
    ctrl = {
      data: data,
      fn: {
        sort: function(order, _desc) {
          return _ctrlSort(order, _desc, data);
        },
        toggle: function(elt) {
          return _ctrlToggle(elt, CrudSrv, data);
        },
        create: function() {
          return _ctrlCreate(data);
        },
        edit: function(elt) {
          return _ctrlEdit(elt, data);
        },
        addElt: function(obj, attr, _elt) {
          return _ctrlAddElt(obj, attr, _elt);
        },
        removeElt: function(arr, index) {
          return _ctrlRemoveElt(arr, index);
        },
        cancelEdit: function() {
          return _ctrlCancelEdit(data);
        },
        save: function(_elt) {
          return _ctrlSave(_elt, CrudSrv, data);
        },
        remove: function(elt) {
          return _ctrlRemove(elt, CrudSrv, data);
        },
        eltRestUrl: function(_elt) {
          return _ctrlEltRestUrl(_elt, CrudSrv);
        }
      }
    };
    _ctrlInit(CrudSrv, data, _defaultSort);
    return ctrl;
  };
  _crudGetUrl = function(endpointUrl, _id) {
    return endpointUrl + (_id ? '/' + _id : '');
  };
  _crudConfig = function(_cache, _httpConfig) {
    var cfg;
    cfg = _httpConfig ? angular.copy(_httpConfig) : {};
    if (_cache) {
      cfg.cache = _cache;
    }
    return cfg;
  };
  _setInCache = function(_cache, endpointUrl, objectKey, result, elt) {
    if (_cache) {
      return _cache.put(_crudGetUrl(endpointUrl, elt[objectKey]), [result.status, JSON.stringify(elt), result.headers(), result.statusText]);
    }
  };
  _invalideAllCache = function(_cache, endpointUrl) {
    if (_cache) {
      return _cache.remove(_crudGetUrl(endpointUrl));
    }
  };
  _crudGetAll = function(endpointUrl, objectKey, _cache, _noCache, _getData, _httpConfig) {
    var url;
    url = _crudGetUrl(endpointUrl);
    if (_cache && _noCache) {
      _cache.remove(url);
    }
    return $http.get(url, _crudConfig(_cache, _httpConfig)).then(function(result) {
      var elts, i;
      elts = typeof _getData === 'function' ? _getData(result) : result.data;
      if (Array.isArray(elts)) {
        if (_cache) {
          for (i in elts) {
            _setInCache(_cache, endpointUrl, objectKey, result, elts[i]);
          }
        }
        return elts;
      }
    });
  };
  _crudFind = function(where, params, endpointUrl, objectKey, _cache, _getData, _httpConfig) {
    var url;
    url = _crudGetUrl(endpointUrl);
    return $http.get(url + '?where=' + JSON.stringify(where) + (params ? params : ''), _crudConfig(null, _httpConfig)).then(function(result) {
      var elts, i;
      elts = typeof _getData === 'function' ? _getData(result) : result.data;
      if (Array.isArray(elts)) {
        if (_cache) {
          for (i in elts) {
            _setInCache(_cache, endpointUrl, objectKey, result, elts[i]);
          }
        }
        return elts;
      }
    });
  };
  _crudFindOne = function(where, endpointUrl, objectKey, _cache, _getData, _httpConfig) {
    return _crudFind(where, '', endpointUrl, objectKey, _cache, _getData, _httpConfig).then(function(elts) {
      if (Array.isArray(elts) && elts.length > 0) {
        if (elts.length > 1) {
          $log.warn('More than one result for clause', where);
        }
        return elts[0];
      }
    });
  };
  _crudGet = function(id, endpointUrl, objectKey, _cache, _noCache, _getData, _httpConfig) {
    var url;
    url = _crudGetUrl(endpointUrl, id);
    if (_cache && _noCache) {
      _cache.remove(url);
    }
    return $http.get(url, _crudConfig(_cache, _httpConfig)).then(function(result) {
      var elt;
      elt = typeof _getData === 'function' ? _getData(result) : result.data;
      if (elt && elt[objectKey]) {
        return elt;
      }
    });
  };
  _crudSave = function(elt, endpointUrl, objectKey, _cache, _processBreforeSave, _getData, _httpConfig) {
    var promise;
    if (elt) {
      if (typeof _processBreforeSave === 'function') {
        _processBreforeSave(elt);
      }
      promise = null;
      if (elt[objectKey]) {
        promise = $http.put(_crudGetUrl(endpointUrl, elt[objectKey]), elt, _crudConfig(null, _httpConfig));
      } else {
        promise = $http.post(_crudGetUrl(endpointUrl), elt, _crudConfig(null, _httpConfig));
      }
      return promise.then(function(result) {
        var data, newElt;
        data = typeof _getData === 'function' ? _getData(result) : result.data;
        newElt = angular.copy(elt);
        if (!newElt[objectKey] && data[objectKey]) {
          newElt[objectKey] = data[objectKey];
        }
        if (!newElt['createdAt'] && data['createdAt']) {
          newElt['createdAt'] = data['createdAt'];
        }
        _setInCache(_cache, endpointUrl, objectKey, result, newElt);
        _invalideAllCache(_cache, endpointUrl);
        return newElt;
      });
    } else {
      return $q.when();
    }
  };
  _crudRemove = function(elt, endpointUrl, objectKey, _cache, _httpConfig) {
    var url;
    if (elt && elt[objectKey]) {
      url = _crudGetUrl(endpointUrl, elt[objectKey]);
      return $http["delete"](url, _crudConfig(null, _httpConfig)).then(function(result) {
        if (_cache) {
          _cache.remove(url);
          return _invalideAllCache(_cache, endpointUrl);
        }
      });
    } else {
      return $q.when();
    }
  };
  _ctrlInit = function(CrudSrv, data, _defaultSort) {
    if (_defaultSort) {
      Utils.sort(data.elts, _defaultSort);
    }
    return CrudSrv.getAll().then((function(elts) {
      if (data.currentSort) {
        Utils.sort(elts, data.currentSort);
      }
      data.elts = elts;
      return data.status.loading = false;
    }), function(err) {
      $log.warn('can\'t load data', err);
      data.status.loading = false;
      return data.status.error = err.statusText ? err.statusText : 'Unable to load data :(';
    });
  };
  _ctrlSort = function(order, _desc, data) {
    if (data.currentSort.order === order) {
      data.currentSort.desc = !data.currentSort.desc;
    } else {
      data.currentSort = {
        order: order,
        desc: _desc ? _desc : false
      };
    }
    return Utils.sort(data.elts, data.currentSort);
  };
  _ctrlToggle = function(elt, CrudSrv, data) {
    if (elt && data.selectedElt && elt[CrudSrv.eltKey] === data.selectedElt[CrudSrv.eltKey]) {
      data.selectedElt = null;
    } else {
      data.selectedElt = elt;
    }
    return data.form = null;
  };
  _ctrlCreate = function(data) {
    return data.form = angular.copy(data.defaultFormElt);
  };
  _ctrlEdit = function(elt, data) {
    return data.form = angular.copy(elt);
  };
  _ctrlAddElt = function(obj, attr, _elt) {
    var elt;
    if (obj && typeof obj === 'object') {
      if (!Array.isArray(obj[attr])) {
        obj[attr] = [];
      }
      elt = _elt ? angular.copy(_elt) : {};
      return obj[attr].push(elt);
    } else {
      return $log.warn('Unable to addElt to', obj);
    }
  };
  _ctrlRemoveElt = function(arr, index) {
    if (Array.isArray(arr) && index < arr.length) {
      return arr.splice(index, 1);
    } else {
      return $log.warn('Unable to removeElt <' + index + '> from', arr);
    }
  };
  _ctrlCancelEdit = function(data) {
    return data.form = null;
  };
  _ctrlSave = function(_elt, CrudSrv, data) {
    var elt;
    data.status.saving = true;
    elt = _elt ? _elt : data.form;
    return CrudSrv.save(elt).then((function(elt) {
      CollectionUtils.upsertEltBy(data.elts, elt, CrudSrv.eltKey);
      if (data.currentSort) {
        Utils.sort(data.elts, data.currentSort);
      }
      data.selectedElt = elt;
      data.form = null;
      data.status.loading = false;
      return data.status.saving = false;
    }), function(error) {
      $log.info('error', error);
      data.status.saving = false;
      return data.status.error = err;
    });
  };
  _ctrlRemove = function(elt, CrudSrv, data) {
    if (elt && elt[CrudSrv.eltKey] && $window.confirm('Supprimer ?')) {
      data.status.removing = true;
      return CrudSrv.remove(elt).then((function() {
        CollectionUtils.removeEltBy(data.elts, elt, CrudSrv.eltKey);
        data.selectedElt = null;
        data.form = null;
        data.status.loading = false;
        return data.status.removing = false;
      }), function(error) {
        $log.info('error', error);
        data.status.removing = false;
        return data.status.error = error;
      });
    } else {
      return $q.when();
    }
  };
  _ctrlEltRestUrl = function(_elt, CrudSrv) {
    if (_elt && _elt[CrudSrv.eltKey]) {
      return CrudSrv.getUrl(_elt[CrudSrv.eltKey]);
    } else {
      return CrudSrv.getUrl();
    }
  };
  return service;
});

var DataUtils;

angular.module('app').factory('DataUtils', DataUtils);

DataUtils.$inject = ['$http', 'StorageUtils', 'Config'];

DataUtils = function($http, StorageUtils, Config) {
  var getOrFetch, refresh, service;
  service = {
    getOrFetch: getOrFetch,
    refresh: refresh
  };
  getOrFetch = function(storageKey, url, _absolute) {
    return StorageUtils.get(storageKey).then(function(data) {
      if (data) {
        return data;
      } else {
        return refresh(storageKey, url, _absolute);
      }
    });
  };
  refresh = function(storageKey, url, _absolute) {
    return $http.get(_absolute ? url : Config.backendUrl + url).then(function(res) {
      return StorageUtils.set(storageKey, res.data).then(function() {
        return res.data;
      });
    });
  };
  return service;
};

var IonicUtils;

angular.module('app').factory('IonicUtils', IonicUtils);

IonicUtils.$inject = ['$ionicLoading', '$ionicScrollDelegate', '$ionicPosition'];

IonicUtils = function($ionicLoading, $ionicScrollDelegate, $ionicPosition) {
  var _getParentWithClass, scrollTo, service, withLoading;
  service = {
    withLoading: withLoading,
    scrollTo: scrollTo
  };
  withLoading = function(promise) {
    $ionicLoading.show();
    return promise.then(function(res) {
      return res;
    })["finally"](function() {
      return $ionicLoading.hide();
    });
  };
  scrollTo = function(className, _shouldAnimate) {
    var $scroll, e, elt, eltOffset, error, handle, scroll, scrollElt, scrollOffset;
    elt = document.getElementsByClassName(className);
    if (elt) {
      scrollElt = _getParentWithClass(angular.element(elt), 'scroll-content');
      if (scrollElt) {
        try {
          eltOffset = $ionicPosition.offset(elt);
          scrollOffset = $ionicPosition.offset(scrollElt);
          handle = scrollElt.attr('delegate-handle');
          $scroll = handle ? $ionicScrollDelegate.$getByHandle(handle) : $ionicScrollDelegate;
          scroll = $scroll.getScrollPosition();
          return $scroll.scrollTo(scroll.left, eltOffset.top - scrollOffset.top, _shouldAnimate);
        } catch (error) {
          e = error;
          return console.warn('scrollTo(' + className + ') error :(', e);
        }
      } else {
        return console.warn('Parent element with class <scroll-content> not found !');
      }
    } else {
      return console.warn('Element with class <' + className + '> not found !');
    }
  };
  _getParentWithClass = function(elt, className, _maxDeep) {
    var parent;
    if (_maxDeep === void 0) {
      _maxDeep = 10;
    }
    parent = elt.parent();
    if (parent.hasClass(className)) {
      return parent;
    } else if (_maxDeep > 0) {
      return _getParentWithClass(parent, className, _maxDeep - 1);
    } else {
      return null;
    }
  };
  return service;
};

angular.module('app').factory('customLogger', function() {
  var track;
  track = function(name, data, _time) {
    var event;
    if (typeof data === 'string') {
      data = {
        message: data
      };
    }
    event = {};
    if (data) {
      event.data = data;
    }
    if (_time) {
      event.time = _time;
    }
    return Logger.track(name, event);
  };
  return function($delegate) {
    return {
      debug: function() {
        return $delegate.debug.apply(null, arguments);
      },
      log: function() {
        track(arguments[0], arguments[1], arguments[2]);
        return $delegate.log.apply(null, arguments);
      },
      info: function() {
        return $delegate.info.apply(null, arguments);
      },
      warn: function() {
        return $delegate.warn.apply(null, arguments);
      },
      error: function() {
        var cause, data, exception;
        if (typeof arguments[0] === 'string') {
          track('error', {
            type: arguments[0],
            error: arguments[1]
          }, arguments[2]);
        } else {
          exception = arguments[0];
          cause = arguments[1];
          data = {
            type: 'angular'
          };
          if (cause) {
            data.cause = cause;
          }
          if (exception) {
            if (exception.message) {
              data.message = exception.message;
            }
            if (exception.name) {
              data.name = exception.name;
            }
            if (exception.stack) {
              data.stack = exception.stack;
            }
          }
          track('exception', data);
        }
        return $delegate.error.apply(null, arguments);
      }
    };
  };
});

angular.module('app').provider('ParseUtils', function() {
  var credentials;
  credentials = {
    applicationId: null,
    restApiKey: null
  };
  this.initialize = function(applicationId, restApiKey) {
    credentials.applicationId = applicationId;
    return credentials.restApiKey = restApiKey;
  };
  return this.$get = [
    '$http', '$q', 'CrudRestUtils', 'Utils', function($http, $q, CrudRestUtils, Utils) {
      var createCrud, createUserCrud, getParseData, login, loginOAuth, parseHttpConfig, parseObjectKey, parseUrl, passwordRecover, service, signup, toDate, toGeoPoint, toPointer;
      service = {
        createCrud: createCrud,
        createUserCrud: createUserCrud,
        signup: signup,
        login: login,
        loginOAuth: loginOAuth,
        passwordRecover: passwordRecover,
        toGeoPoint: toGeoPoint,
        toPointer: toPointer,
        toDate: toDate
      };
      parseUrl = 'https://api.parse.com/1';
      parseObjectKey = 'objectId';
      getParseData = function(result) {
        if (result && result.data) {
          if (!result.data[parseObjectKey] && result.data.results) {
            return result.data.results;
          } else {
            return result.data;
          }
        }
      };
      parseHttpConfig = {
        headers: {
          'X-Parse-Application-Id': credentials.applicationId,
          'X-Parse-REST-API-Key': credentials.restApiKey
        }
      };
      createCrud = function(objectClass, _processBreforeSave, _useCache) {
        var endpointUrl;
        endpointUrl = parseUrl + '/classes/' + objectClass;
        service = CrudRestUtils.createCrud(endpointUrl, parseObjectKey, getParseData, _processBreforeSave, _useCache, parseHttpConfig);
        service.savePartial = function(objectToSave, dataToUpdate) {
          var objectId, toUpdate;
          objectId = typeof objectToSave === 'string' ? objectToSave : objectToSave[parseObjectKey];
          toUpdate = angular.copy(dataToUpdate);
          toUpdate[parseObjectKey] = objectId;
          return service.save(toUpdate);
        };
        return service;
      };
      createUserCrud = function(sessionToken, _processBreforeSave, _useCache) {
        var _processBreforeSaveReal, endpointUrl, parseUserHttpConfig;
        endpointUrl = parseUrl + '/users';
        parseUserHttpConfig = angular.copy(parseHttpConfig);
        parseUserHttpConfig.headers['X-Parse-Session-Token'] = sessionToken;
        _processBreforeSaveReal = function(user) {
          delete user.emailVerified;
          if (_processBreforeSave) {
            return _processBreforeSave(user);
          }
        };
        service = CrudRestUtils.createCrud(endpointUrl, parseObjectKey, getParseData, _processBreforeSaveReal, _useCache, parseUserHttpConfig);
        service.savePartial = function(objectToSave, dataToUpdate) {
          var objectId, toUpdate;
          objectId = typeof objectToSave === 'string' ? objectToSave : objectToSave[parseObjectKey];
          toUpdate = angular.copy(dataToUpdate);
          toUpdate[parseObjectKey] = objectId;
          return service.save(toUpdate);
        };
        return service;
      };
      signup = function(user) {
        if (user && user.username && user.password) {
          return $http.post(parseUrl + '/users', user, parseHttpConfig).then(function(result) {
            var newUser;
            newUser = angular.copy(user);
            delete newUser.password;
            newUser.objectId = result.data.objectId;
            newUser.sessionToken = result.data.sessionToken;
            return newUser;
          });
        } else {
          return $q.reject({
            data: {
              error: 'user MUST have fields username & password !'
            }
          });
        }
      };
      login = function(username, password) {
        return $http.get(parseUrl + '/login?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), parseHttpConfig).then(function(result) {
          return result.data;
        });
      };
      loginOAuth = function(authData) {
        return $http.post(parseUrl + '/users', {
          authData: authData
        }, parseHttpConfig).then(function(result) {
          return result.data;
        });
      };
      passwordRecover = function(email) {
        return $http.post(parseUrl + '/requestPasswordReset', {
          email: email
        }, parseHttpConfig).then(function() {});
      };
      toGeoPoint = function(lat, lon) {
        return {
          __type: 'GeoPoint',
          latitude: lat,
          longitude: lon
        };
      };
      toPointer = function(className, sourceObject) {
        return {
          __type: 'Pointer',
          className: className,
          objectId: typeof sourceObject === 'string' ? sourceObject : sourceObject[parseObjectKey]
        };
      };
      toDate = function(date) {
        var d;
        d = Utils.toDate(date);
        if (d) {
          return d.toISOString();
        }
        throw 'Function toDate must be used with a timestamp or a Date object';
      };
      return service;
    }
  ];
});

var LocalForageUtils, LocalStorageProvider;

angular.module('app').provider('StorageUtils', LocalStorageProvider).factory('LocalForageUtils', LocalForageUtils).provider('LocalStorageUtils', LocalStorageProvider);

LocalForageUtils = function($localForage, $q, $log, Utils, Config) {
  var _clear, _clearStartingWith, _get, _getSync, _remove, _set, promiseStorageCache, service, storageCache;
  storageCache = {};
  promiseStorageCache = {};
  service = {
    get: _get,
    set: _set,
    remove: _remove,
    clear: _clear,
    clearStartingWith: _clearStartingWith,
    getSync: _getSync
  };
  _get = function(key, _defaultValue) {
    if (storageCache[key]) {
      return Utils.async(function() {
        return angular.copy(storageCache[key]);
      });
    } else if (promiseStorageCache[key]) {
      return promiseStorageCache[key];
    } else {
      if (Config.storage) {
        promiseStorageCache[key] = $localForage.getItem(Config.storagePrefix + key).then(function(value) {
          var e, error1;
          try {
            storageCache[key] = JSON.parse(value) || angular.copy(_defaultValue);
          } catch (error1) {
            e = error1;
            storageCache[key] = angular.copy(_defaultValue);
          }
          delete promiseStorageCache[key];
          return angular.copy(storageCache[key]);
        }, function(error) {
          $log.error('error in LocalForageUtils._get(' + key + ')', error);
          return delete promiseStorageCache[key];
        });
        return promiseStorageCache[key];
      } else {
        storageCache[key] = angular.copy(_defaultValue);
        return Utils.async(function() {
          return angular.copy(storageCache[key]);
        });
      }
    }
  };
  _getSync = function(key, _defaultValue) {
    if (storageCache[key]) {
      return angular.copy(storageCache[key]);
    } else {
      _get(key, _defaultValue);
      return angular.copy(_defaultValue);
    }
  };
  _set = function(key, value) {
    if (!angular.equals(storageCache[key], value)) {
      storageCache[key] = angular.copy(value);
      if (Config.storage) {
        return $localForage.setItem(Config.storagePrefix + key, JSON.stringify(storageCache[key])).then((function(value) {}), function(error) {
          return $log.error('error in LocalForageUtils._set(' + key + ')', error);
        });
      } else {
        return $q.when();
      }
    } else {
      $log.debug('Don\'t save <' + key + '> because values are equals !', value);
      return $q.when();
    }
  };
  _remove = function(key) {
    $log.debug('Remove <' + key + '> from storage !');
    delete storageCache[key];
    if (Config.storage) {
      return $localForage.removeItem(Config.storagePrefix + key);
    } else {
      return $q.when();
    }
  };
  _clear = function() {
    storageCache = {};
    if (Config.storage) {
      return $localForage.clear();
    } else {
      return $q.when();
    }
  };
  _clearStartingWith = function(keyStartWith) {
    var i;
    for (i in storageCache) {
      if (Utils.startsWith(i, keyStartWith)) {
        delete storageCache[i];
      }
    }
    if (Config.storage) {
      return $localForage.keys().then(function(keys) {
        var promises;
        promises = [];
        for (i in keys) {
          if (Utils.startsWith(keys[i], Config.storagePrefix + keyStartWith)) {
            promises.push($localForage.removeItem(keys[i]));
          }
        }
        return $q.all(promises).then(function(results) {});
      });
    } else {
      return $q.when();
    }
  };
  return service;
};

LocalStorageProvider = function(Config) {
  var LocalStorageUtils, _get, storageCache;
  storageCache = {};
  _get = function(key, _defaultValue) {
    var e, error1;
    if (!storageCache[key]) {
      if (Config.storage && window.localStorage) {
        try {
          storageCache[key] = JSON.parse(window.localStorage.getItem(Config.storagePrefix + key)) || angular.copy(_defaultValue);
        } catch (error1) {
          e = error1;
          storageCache[key] = angular.copy(_defaultValue);
        }
      } else {
        storageCache[key] = angular.copy(_defaultValue);
      }
    }
    return angular.copy(storageCache[key]);
  };
  LocalStorageUtils = function($window, $log, Utils) {
    var _clear, _clearStartingWith, _remove, _set, service;
    service = {
      get: function(key, _defaultValue) {
        return Utils.async(function() {
          return _get(key, _defaultValue);
        });
      },
      set: function(key, value) {
        return Utils.async(function() {
          return _set(key, value);
        });
      },
      remove: function(key) {
        return Utils.async(function() {
          return _remove(key);
        });
      },
      clear: function() {
        return Utils.async(function() {
          return _clear();
        });
      },
      clearStartingWith: function(keyStartWith) {
        return Utils.async(function() {
          return _clearStartingWith(keyStartWith);
        });
      },
      getSync: _get,
      setSync: _set,
      removeSync: _remove,
      clearSync: _clear,
      clearStartingWithSync: _clearStartingWith
    };
    _set = function(key, value) {
      if (!angular.equals(storageCache[key], value)) {
        storageCache[key] = angular.copy(value);
        if (Config.storage && $window.localStorage) {
          return $window.localStorage.setItem(Config.storagePrefix + key, JSON.stringify(storageCache[key]));
        }
      } else {
        return $log.debug('Don\'t save <' + key + '> because values are equals !');
      }
    };
    _remove = function(key) {
      $log.debug('Remove <' + key + '> from storage !');
      delete storageCache[key];
      if (Config.storage && $window.localStorage) {
        return $window.localStorage.removeItem(Config.storagePrefix + key);
      }
    };
    _clear = function() {
      storageCache = {};
      if (Config.storage && $window.localStorage) {
        return $window.localStorage.clear();
      }
    };
    _clearStartingWith = function(keyStartWith) {
      var i, j, key, results1;
      for (i in storageCache) {
        if (Utils.startsWith(i, keyStartWith)) {
          delete storageCache[i];
        }
      }
      if (Config.storage && $window.localStorage) {
        j = $window.localStorage.length - 1;
        results1 = [];
        while (j >= 0) {
          key = $window.localStorage.key(j);
          if (Utils.startsWith(key, Config.storagePrefix + keyStartWith)) {
            $window.localStorage.removeItem(key);
          }
          results1.push(j--);
        }
        return results1;
      }
    };
    return service;
  };
  this.getSync = _get;
  this.$get = LocalStorageUtils;
  return LocalStorageUtils.$inject = ['$window', '$log', 'Utils'];
};

angular.module('app').factory('Utils', function($timeout, $q, $sce, $log) {
  var _boolSort, _getDeep, _intSort, _strSort, async, createUuid, debounce, debounces, endsWith, extendDeep, extendsWith, getDeep, isDate, isEmail, isUrl, randInt, service, sort, startsWith, toDate, trustHtml;
  service = {
    createUuid: createUuid,
    isEmail: isEmail,
    isUrl: isUrl,
    startsWith: startsWith,
    endsWith: endsWith,
    randInt: randInt,
    toDate: toDate,
    isDate: isDate,
    getDeep: getDeep,
    async: async,
    debounce: debounce,
    trustHtml: trustHtml,
    extendDeep: extendDeep,
    extendsWith: extendsWith,
    sort: sort
  };
  debounces = [];
  createUuid = function() {
    var S4;
    S4 = function() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    };
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  };
  isEmail = function(str) {
    var re;
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
  };
  isUrl = function(str) {
    return /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i.test(str);
  };
  startsWith = function(str, prefix) {
    return str.indexOf(prefix) === 0;
  };
  endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };
  randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) - min;
  };
  toDate = function(date) {
    if (typeof date === 'number') {
      return new Date(date);
    }
    if (typeof date === 'string') {
      return new Date(date);
    }
    if (date instanceof Date) {
      return date;
    }
    if (date && typeof date.toDate === 'function' && date.toDate() instanceof Date) {
      return date.toDate();
    }
  };
  isDate = function(date) {
    var d;
    d = toDate(date);
    return d instanceof Date && d.toString() !== 'Invalid Date';
  };
  async = function(fn) {
    var defer;
    defer = $q.defer();
    $timeout((function() {
      return defer.resolve(fn());
    }), 0);
    return defer.promise;
  };
  trustHtml = function(html) {
    return $sce.trustAsHtml(html);
  };
  debounce = function(key, callback, _debounceTime) {
    $timeout.cancel(debounces[key]);
    return debounces[key] = $timeout((function() {
      return callback();
    }), _debounceTime || 1000);
  };
  extendDeep = function(dest) {
    angular.forEach(arguments, function(arg) {
      if (arg !== dest) {
        return angular.forEach(arg, function(value, key) {
          if (dest[key] && typeof dest[key] === 'object') {
            return extendDeep(dest[key], value);
          } else {
            return dest[key] = angular.copy(value);
          }
        });
      }
    });
    return dest;
  };
  extendsWith = function(dest, src) {
    var i, results;
    results = [];
    for (i in src) {
      if (typeof src[i] === 'object') {
        if (dest[i] === void 0 || dest[i] === null) {
          results.push(dest[i] = angular.copy(src[i]));
        } else if (typeof dest[i] === 'object') {
          results.push(extendsWith(dest[i], src[i]));
        } else {
          results.push(void 0);
        }
      } else if (typeof src[i] === 'function') {

      } else if (dest[i] === void 0 || dest[i] === null) {
        results.push(dest[i] = src[i]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  sort = function(arr, params) {
    var firstElt, i;
    if (Array.isArray(arr) && arr.length > 0 && params && params.order) {
      firstElt = null;
      for (i in arr) {
        firstElt = _getDeep(arr[i], params.order.split('.'));
        if (typeof firstElt !== 'undefined') {
          break;
        }
      }
      if (typeof firstElt === 'boolean') {
        return _boolSort(arr, params);
      } else if (typeof firstElt === 'number') {
        return _intSort(arr, params);
      } else if (typeof firstElt === 'string') {
        return _strSort(arr, params);
      } else {
        return $log.warn('Unable to find suitable sort for type <' + typeof firstElt + '>', firstElt);
      }
    }
  };
  _strSort = function(arr, params) {
    return arr.sort(function(a, b) {
      var aStr, bStr;
      aStr = _getDeep(a, params.order.split('.'), '').toLowerCase();
      bStr = _getDeep(b, params.order.split('.'), '').toLowerCase();
      if (aStr > bStr) {
        return 1 * (params.desc ? -1 : 1);
      } else if (aStr < bStr) {
        return -1 * (params.desc ? -1 : 1);
      } else {
        return 0;
      }
    });
  };
  _intSort = function(arr, params) {
    return arr.sort(function(a, b) {
      var aInt, bInt;
      aInt = _getDeep(a, params.order.split('.'), 0);
      bInt = _getDeep(b, params.order.split('.'), 0);
      return (aInt - bInt) * (params.desc ? -1 : 1);
    });
  };
  _boolSort = function(arr, params) {
    return arr.sort(function(a, b) {
      var aBool, bBool;
      aBool = _getDeep(a, params.order.split('.'), 0);
      bBool = _getDeep(b, params.order.split('.'), 0);
      return (aBool === bBool ? 0 : aBool ? -1 : 1) * (params.desc ? -1 : 1);
    });
  };
  getDeep = function(obj, path, _defaultValue) {
    return _getDeep(obj, path.split('.'), _defaultValue);
  };
  _getDeep = function(obj, attrs, _defaultValue) {
    var attr;
    if (Array.isArray(attrs) && attrs.length > 0) {
      if (typeof obj === 'object') {
        attr = attrs.shift();
        return _getDeep(obj[attr], attrs, _defaultValue);
      } else {
        return _defaultValue;
      }
    } else {
      if (typeof obj === 'undefined') {
        return _defaultValue;
      } else {
        return obj;
      }
    }
  };
  return service;
});

var Config;

Config = (function() {
  'use strict';
  var cfg;
  cfg = {
    appVersion: '~',
    debug: true,
    verbose: true,
    track: false,
    storage: true,
    storagePrefix: 'app-',
    emailSupport: 'exemple@mail.com',
    backendUrl: 'data',
    parse: {
      applicationId: '',
      restApiKey: ''
    },
    gcm: {
      senderID: '263462318850',
      apiServerKey: 'AIzaSyDzM4XzyW9HWJNol9OePz4cAXi7QbVANOs'
    }
  };
  return cfg;
})();

var Logger;

Logger = (function() {
  var Scheduler, _getUserId, cache, config, createUuid, track;
  createUuid = function() {
    var S4;
    S4 = function() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    };
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  };
  track = function(name, event, _allowNoUser) {
    var msg;
    if (typeof event === 'string') {
      event = {
        messgae: event
      };
    }
    if (!event.name) {
      event.name = name;
    }
    if (!event.time) {
      event.time = Date.now();
    }
    if (!event.user) {
      event.user = _getUserId();
    }
    if (!event.appVersion && Config) {
      event.appVersion = Config.appVersion;
    }
    if (!event.source) {
      event.source = {};
    }
    if (!event.source.url && window && window.location) {
      event.source.url = window.location.href;
    }
    if (!event.id) {
      event.id = createUuid();
      event.prevId = cache.currentEventId;
      cache.currentEventId = event.id;
    }
    if (!event.user && !_allowNoUser) {
      window.setTimeout((function() {
        track(name, event, true);
      }), 2000);
    } else {
      if (config.verbose) {
        console.log('$[track] ' + name, event);
      }
      if (config.track) {
        if (config.async && event.name !== 'exception') {
          Scheduler.schedule(event);
        } else {
          Scheduler.send(event, function(status) {
            if (status === 'ko') {
              Scheduler.schedule(event);
            }
          });
        }
      }
      if (name === 'error' && config.debug && event.data.error) {
        msg = event.data && event.data.error ? (event.data.error.message ? event.data.error.message : event.data.error) : '';
        window.alert('Error: ' + event.data.type + '\n' + msg + '\nPlease contact: ' + Config.emailSupport);
      }
      if (name === 'exception') {
        msg = event.data && event.data.message ? event.data.message : event.message;
        window.alert('Exception: ' + msg + '\nPlease contact: ' + Config.emailSupport);
      }
    }
  };
  _getUserId = function() {
    var user;
    if (cache && cache.userId) {
      return cache.userId;
    } else if (localStorage) {
      user = JSON.parse(localStorage.getItem(config.storagePrefix + 'user'));
      if (user && user.id) {
        cache.userId = user.id;
        return user.id;
      }
    }
  };
  'use strict';
  Scheduler = (function() {
    var _addEvent, _addEvents, _getEvents, _resetEvents, _setEvents, _startScheduler, _stopScheduler, eventSender, events, init, schedule, send, sendAll;
    events = [];
    eventSender = null;
    init = function() {
      if (localStorage) {
        events = _getEvents() || [];
        if (events.length > 0) {
          _startScheduler();
        }
      }
    };
    schedule = function(event) {
      _addEvent(event);
      _startScheduler();
    };
    send = function(event, callback) {

      /*$.ajax({
        type: 'POST',
        url: config.backendUrl+'/api/v1/track/event',
        data: JSON.stringify(event),
        contentType: 'application/json'
      })
      .done(function(data, textStatus, jqXHR)       { if(callback){callback('ok');} })
      .fail(function(jqXHR, textStatus, errorThrown){ if(callback){callback('ko');} });
       */
      if (callback) {
        callback('ok');
      }
    };
    sendAll = function(events, callback) {

      /*$.ajax({
        type: 'POST',
        url: config.backendUrl+'/api/v1/track/events',
        data: JSON.stringify(events),
        contentType: 'application/json'
      })
      .done(function(data, textStatus, jqXHR)       { if(callback){callback('ok');} })
      .fail(function(jqXHR, textStatus, errorThrown){ if(callback){callback('ko');} });
       */
      if (callback) {
        callback('ok');
      }
    };
    _startScheduler = function() {
      var i;
      if (eventSender === null && events.length > 0) {
        i = 0;
        while (i < events.length) {
          events[i].sending = false;
          i++;
        }
        eventSender = window.setInterval((function() {
          var event, toSend;
          if (events.length === 0) {
            _stopScheduler();
          } else if (events.length === 1) {
            event = events[0];
            _resetEvents();
            send(event, function(status) {
              if (status === 'ko') {
                _addEvent(event);
                _stopScheduler();
              }
            });
          } else {
            toSend = events;
            _resetEvents();
            sendAll(toSend, function(status) {
              if (status === 'ko') {
                _addEvents(toSend);
                _stopScheduler();
              }
            });
          }
        }), config.scheduler.interval);
      }
    };
    _stopScheduler = function() {
      if (eventSender !== null) {
        window.clearInterval(eventSender);
        eventSender = null;
      }
    };
    _addEvent = function(event) {
      events.push(event);
      _setEvents(events);
    };
    _addEvents = function(eventsToAdd) {
      events = events.concat(eventsToAdd);
      _setEvents(events);
    };
    _resetEvents = function() {
      events = [];
      _setEvents(events);
    };
    _setEvents = function(events) {
      if (localStorage) {
        localStorage.setItem(config.scheduler.storageKey, JSON.stringify(events));
      }
    };
    _getEvents = function() {
      if (localStorage) {
        return JSON.parse(localStorage.getItem(config.scheduler.storageKey));
      }
    };
    return {
      init: init,
      schedule: schedule,
      send: send
    };
  })();
  config = {
    storagePrefix: Config.storagePrefix,
    backendUrl: Config.backendUrl,
    verbose: Config.verbose,
    debug: Config.debug,
    track: Config.track,
    async: true,
    scheduler: {
      storageKey: 'tracking-events-cache',
      interval: 3000
    }
  };
  cache = {
    currentEventId: null,
    userId: null,
    deviceId: null
  };
  Scheduler.init();
  return {
    track: track
  };
})();

window.onerror = function(message, url, line, col, error) {
  'use strict';
  var data, stopPropagation;
  stopPropagation = false;
  data = {
    type: 'javascript'
  };
  if (message) {
    data.message = message;
  }
  if (url) {
    data.fileName = url;
  }
  if (line) {
    data.lineNumber = line;
  }
  if (col) {
    data.columnNumber = col;
  }
  if (error) {
    if (error.name) {
      data.name = error.name;
    }
    if (error.stack) {
      data.stack = error.stack;
    }
  }
  if (navigator) {
    if (navigator.userAgent) {
      data['navigator.userAgent'] = navigator.userAgent;
    }
    if (navigator.platform) {
      data['navigator.platform'] = navigator.platform;
    }
    if (navigator.vendor) {
      data['navigator.vendor'] = navigator.vendor;
    }
    if (navigator.appCodeName) {
      data['navigator.appCodeName'] = navigator.appCodeName;
    }
    if (navigator.appName) {
      data['navigator.appName'] = navigator.appName;
    }
    if (navigator.appVersion) {
      data['navigator.appVersion'] = navigator.appVersion;
    }
    if (navigator.product) {
      data['navigator.product'] = navigator.product;
    }
  }
  Logger.track('exception', {
    data: data
  });
  return stopPropagation;
};

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

angular.module('app').config(function($stateProvider) {
  return $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'js/layout/menu.html',
    controller: 'MenuCtrl',
    data: {
      restrictAccess: ['logged']
    }
  });
}).controller('MenuCtrl', function($scope, $state, AuthSrv) {
  var logout, vm;
  vm = {};
  logout = function() {
    return AuthSrv.logout().then(function() {
      return $state.go('login');
    });
  };
  $scope.vm = vm;
  return vm.logout = logout;
});

angular.module('app').config(function($stateProvider) {
  return $stateProvider.state('app.search', {
    url: '/search',
    templateUrl: 'js/search/search.html',
    controller: 'SearchController'
  });
}).controller('SearchController', function($scope) {
  var vm;
  vm = {};
  return $scope.vm = vm;
});

angular.module('app').factory('BackgroundGeolocationPlugin', function($window, $q, $log, GeolocationPlugin, PluginUtils) {
  var configure, defaultOpts, enable, pluginName, pluginTest, service, start, stop;
  pluginName = 'BackgroundGeolocation';
  pluginTest = function() {
    return $window.plugins && $window.plugins.backgroundGeoLocation;
  };
  service = {
    enable: enable,
    disable: stop,
    configure: configure,
    start: start,
    stop: stop
  };
  defaultOpts = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    notificationTitle: 'Location tracking',
    notificationText: 'ENABLED',
    activityType: 'AutomotiveNavigation',
    debug: true,
    stopOnTerminate: true
  };
  configure = function(opts, postLocation) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var callbackFn, failureFn, options;
      callbackFn = function(location) {
        if (postLocation) {
          return postLocation(location).then((function() {
            return $window.plugins.backgroundGeoLocation.finish();
          }), function(error) {
            $log.error('pluginError:' + pluginName, error);
            return $window.plugins.backgroundGeoLocation.finish();
          });
        } else {
          return $window.plugins.backgroundGeoLocation.finish();
        }
      };
      failureFn = function(error) {
        return $log.error('pluginError:' + pluginName, error);
      };
      options = angular.extend({}, defaultOpts, opts);
      $window.plugins.backgroundGeoLocation.configure(callbackFn, failureFn, options);
      return GeolocationPlugin.getCurrentPosition();
    });
  };
  start = function() {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.plugins.backgroundGeoLocation.start();
    });
  };
  stop = function() {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.plugins.backgroundGeoLocation.stop();
    });
  };
  enable = function(opts, postLocation) {
    return configure(opts, postLocation).then(function() {
      return start();
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.plugins) {
      window.plugins = {};
    }
    if (!window.plugins.backgroundGeoLocation) {
      return window.plugins.backgroundGeoLocation = (function() {
        var callback, config, interval;
        config = null;
        callback = null;
        interval = null;
        return {
          configure: function(callbackFn, failureFn, opts) {
            config = opts;
            callback = callbackFn;
          },
          start: function() {
            if (interval === null) {
              interval = setInterval((function() {
                window.navigator.geolocation.getCurrentPosition(function(position) {
                  callback(position);
                });
              }), 3000);
            }
          },
          stop: function() {
            if (interval !== null) {
              clearInterval(interval);
              interval = null;
            }
          },
          finish: function() {}
        };
      })();
    }
  }
});

angular.module('app').factory('CameraPlugin', function($window, $q, $log, PluginUtils) {
  var _getPicture, defaultOpts, findPicture, pluginName, pluginTest, service, takePicture;
  pluginName = 'Camera';
  pluginTest = function() {
    return $window.navigator && $window.navigator.camera;
  };
  service = {
    getPicture: _getPicture,
    takePicture: takePicture,
    findPicture: findPicture
  };
  defaultOpts = {
    quality: 75,
    destinationType: $window.Camera.DestinationType.FILE_URI,
    sourceType: $window.Camera.PictureSourceType.CAMERA,
    allowEdit: false,
    encodingType: $window.Camera.EncodingType.JPEG,
    mediaType: $window.Camera.MediaType.PICTURE,
    cameraDirection: $window.Camera.Direction.BACK,
    correctOrientation: true,
    saveToPhotoAlbum: false
  };
  _getPicture = function(_opts) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer, opts;
      opts = angular.extend(defaultOpts, _opts);
      defer = $q.defer();
      $window.navigator.camera.getPicture((function(picture) {
        return defer.resolve(picture);
      }), (function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      }), opts);
      return defer.promise;
    });
  };
  takePicture = function() {
    return _getPicture({});
  };
  findPicture = function() {
    return _getPicture({
      sourceType: $window.Camera.PictureSourceType.PHOTOLIBRARY
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.navigator) {
      window.navigator = {};
    }
    if (!window.navigator.camera) {
      return window.navigator.camera = (function() {
        var ret;
        window.Camera = {
          DestinationType: {
            DATA_URL: 0,
            FILE_URI: 1,
            NATIVE_URI: 2
          },
          Direction: {
            BACK: 0,
            FRONT: 1
          },
          EncodingType: {
            JPEG: 0,
            PNG: 1
          },
          MediaType: {
            PICTURE: 0,
            VIDEO: 1,
            ALLMEDIA: 2
          },
          PictureSourceType: {
            PHOTOLIBRARY: 0,
            CAMERA: 1,
            SAVEDPHOTOALBUM: 2
          },
          PopoverArrowDirection: {
            ARROW_UP: 1,
            ARROW_DOWN: 2,
            ARROW_LEFT: 4,
            ARROW_RIGHT: 8,
            ARROW_ANY: 15
          }
        };
        ret = JSON.parse(JSON.stringify(window.Camera));
        ret.getPicture = function(success, error, options) {
          var uri;
          uri = window.prompt('Image uri :');
          if (uri) {
            if (success) {
              success(uri);
            }
          } else {
            if (error) {
              error();
            }
          }
        };
        return ret;
      })();
    }
  }
});

angular.module('app').factory('DeviceAccountsPlugin', function($window, $q, $log, PluginUtils) {
  var getAccounts, getEmail, pluginName, pluginTest, service;
  pluginName = 'DeviceAccounts';
  pluginTest = function() {
    return $window.plugins && $window.plugins.DeviceAccounts;
  };
  service = {
    getAccounts: getAccounts,
    getEmail: getEmail
  };
  getAccounts = function() {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.DeviceAccounts.get((function(accounts) {
        return defer.resolve(accounts);
      }), function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      return defer.promise;
    });
  };
  getEmail = function() {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.DeviceAccounts.getEmail((function(email) {
        return defer.resolve(email);
      }), function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      return defer.promise;
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.plugins) {
      window.plugins = {};
    }
    if (!window.plugins.DeviceAccounts) {
      return window.plugins.DeviceAccounts = {
        get: function(onSuccess, onFail) {
          return onSuccess([
            {
              type: 'com.google',
              name: 'test@example.com'
            }
          ]);
        },
        getByType: function(type, onSuccess, onFail) {
          return onSuccess([
            {
              type: 'com.google',
              name: 'test@example.com'
            }
          ]);
        },
        getEmails: function(onSuccess, onFail) {
          return onSuccess(['test@example.com']);
        },
        getEmail: function(onSuccess, onFail) {
          return onSuccess('test@example.com');
        }
      };
    }
  }
});

angular.module('app').factory('DevicePlugin', function($window, PluginUtils) {
  var getDevice, getDeviceUuid, pluginName, pluginTest, service;
  pluginName = 'Device';
  pluginTest = function() {
    return $window.device;
  };
  service = {
    getDevice: getDevice,
    getDeviceUuid: getDeviceUuid
  };
  getDevice = function() {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.device;
    });
  };
  getDeviceUuid = function() {
    return getDevice().then(function(device) {
      return device.uuid;
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  var android, browser;
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.device) {
      browser = {
        available: true,
        cordova: '',
        manufacturer: '',
        model: '',
        platform: 'browser',
        uuid: '0123456789',
        version: '0'
      };
      android = {
        available: true,
        cordova: '3.6.4',
        manufacturer: 'LGE',
        model: 'Nexus 4',
        platform: 'Android',
        uuid: '891b8e516ae6bd65',
        version: '5.0.1'
      };
      return window.device = browser;
    }
  }
});

angular.module('app').factory('DialogPlugin', function($window, $q, $log, PluginUtils) {
  var AudioCtx, _isConfirm, _toButtonIndex, beepFallback, ctx, html5Beep, pluginAlert, pluginBeep, pluginConfirm, pluginName, pluginPrompt, pluginTest, service;
  pluginName = 'Dialogs';
  pluginTest = function() {
    return $window.navigator && $window.navigator.notification;
  };

  /*
     * Button indexes :
     *    - 0 : cancel with backdrop
     *    - 1 : Ok
     *    - 2 : Annuler
     * Or, your index in buttonLabels array but one based !!! (0 is still cancel)
   */
  service = {
    alert: pluginAlert,
    confirm: function(message, _title) {
      return pluginConfirm(message, _title).then(function(buttonIndex) {
        return _isConfirm(buttonIndex);
      });
    },
    confirmMulti: pluginConfirm,
    prompt: function(message, _title, _defaultText) {
      return pluginPrompt(message, _title, null, _defaultText).then(function(result) {
        result.confirm = _isConfirm(result.buttonIndex);
        return result;
      });
    },
    promptMulti: pluginPrompt,
    beep: pluginBeep
  };
  AudioCtx = window.AudioContext || window.webkitAudioContext;
  pluginAlert = function(message, _title, _buttonName) {
    return PluginUtils.onReady(pluginName, pluginTest).then((function() {
      var defer;
      defer = $q.defer();
      $window.navigator.notification.alert(message, (function() {
        return defer.resolve();
      }), _title, _buttonName);
      return defer.promise;
    }), function(error) {
      $log.error('pluginError:' + pluginName, error);
      return $window.alert(message);
    });
  };
  pluginConfirm = function(message, _title, _buttonLabels) {
    return PluginUtils.onReady(pluginName, pluginTest).then((function() {
      var defer;
      defer = $q.defer();
      $window.navigator.notification.confirm(message, (function(buttonIndex) {
        return defer.resolve(buttonIndex);
      }), _title, _buttonLabels);
      return defer.promise;
    }), function(error) {
      $log.error('pluginError:' + pluginName, error);
      return _toButtonIndex($window.confirm(message));
    });
  };
  pluginPrompt = function(message, _title, _buttonLabels, _defaultText) {
    return PluginUtils.onReady(pluginName, pluginTest).then((function() {
      var defer;
      defer = $q.defer();
      $window.navigator.notification.prompt(message, (function(result) {
        return defer.resolve(result);
      }), _title, _buttonLabels, _defaultText);
      return defer.promise;
    }), function(error) {
      var text;
      $log.error('pluginError:' + pluginName, error);
      text = $window.prompt(message, _defaultText);
      return {
        buttonIndex: _toButtonIndex(text),
        input1: text
      };
    });
  };
  pluginBeep = function(times) {
    if (!times) {
      times = 1;
    }
    return PluginUtils.onReady(pluginName, pluginTest).then((function() {
      return $window.navigator.notification.beep(times);
    }), function(error) {
      $log.error('pluginError:' + pluginName, error);
      if (beepFallback) {
        return beepFallback(times);
      } else {
        return $q.reject(error);
      }
    });
  };
  _isConfirm = function(buttonIndex) {
    if (buttonIndex === 1) {
      return true;
    } else {
      return false;
    }
  };
  _toButtonIndex = function(value) {
    if (value) {
      return 1;
    } else {
      return 2;
    }
  };
  if (AudioCtx) {
    ctx = new AudioCtx;
    html5Beep = function(callback) {
      var duration, osc, type;
      duration = 200;
      type = 0;
      if (!callback) {
        callback = function() {};
      }
      osc = ctx.createOscillator();
      osc.type = type;
      osc.connect(ctx.destination);
      osc.noteOn(0);
      return $window.setTimeout((function() {
        osc.noteOff(0);
        return callback();
      }), duration);
    };
    beepFallback = function(times) {
      if (times > 0) {
        return html5Beep(function() {
          return $window.setTimeout((function() {
            return beepFallback(times - 1);
          }), 500);
        });
      }
    };
  }
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.navigator) {
      window.navigator = {};
    }
    if (!window.navigator.notification) {
      return window.navigator.notification = (function() {
        var beep, ctx, html5Beep;
        ctx = new (window.AudioContext || window.webkitAudioContext);
        html5Beep = function(callback) {
          var duration, osc, type;
          duration = 200;
          type = 0;
          if (!callback) {
            callback = function() {};
          }
          osc = ctx.createOscillator();
          osc.type = type;
          osc.connect(ctx.destination);
          osc.noteOn(0);
          window.setTimeout((function() {
            osc.noteOff(0);
            callback();
          }), duration);
        };
        beep = function(times) {
          if (times > 0) {
            html5Beep(function() {
              window.setTimeout((function() {
                beep(times - 1);
              }), 500);
            });
          }
        };
        return {
          alert: function(message, alertCallback, title, buttonName) {
            window.alert(message);
            if (alertCallback) {
              alertCallback();
            }
          },
          confirm: function(message, confirmCallback, title, buttonLabels) {
            var c;
            c = window.confirm(message);
            if (confirmCallback) {
              confirmCallback(c ? 1 : 2);
            }
          },
          prompt: function(message, promptCallback, title, buttonLabels, defaultText) {
            var text;
            text = window.prompt(message, defaultText);
            if (promptCallback) {
              promptCallback({
                buttonIndex: text ? 1 : 2,
                input1: text
              });
            }
          },
          beep: beep
        };
      })();
    }
  }
});

angular.module('app').factory('GeolocationPlugin', function($window, $q, $timeout, $log, PluginUtils) {

  /*
     * Solutions :
     *  -> reboot device
     *  -> don't use cordova plugin !
     *  -> use native geolocation (should code plugin...)
   */
  var getCurrentPosition, getCurrentPositionByWatch, pluginName, pluginTest, service;
  pluginName = 'Geolocation';
  pluginTest = function() {
    return $window.navigator && $window.navigator.geolocation;
  };
  service = {
    getCurrentPosition: getCurrentPosition
  };
  getCurrentPosition = function(_timeout, _enableHighAccuracy, _maximumAge) {
    var opts;
    opts = {
      enableHighAccuracy: _enableHighAccuracy ? _enableHighAccuracy : true,
      timeout: _timeout ? _timeout : 10000,
      maximumAge: _maximumAge ? _maximumAge : 0
    };
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer, geolocTimeout;
      defer = $q.defer();
      geolocTimeout = $timeout((function() {
        return defer.reject({
          message: 'Geolocation didn\'t responded within ' + opts.timeout + ' millis :('
        });
      }), opts.timeout);
      $window.navigator.geolocation.getCurrentPosition((function(position) {
        $timeout.cancel(geolocTimeout);
        return defer.resolve(position);
      }), (function(error) {
        $timeout.cancel(geolocTimeout);
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      }), opts);
      return defer.promise;
    });
  };
  getCurrentPositionByWatch = function(_timeout, _enableHighAccuracy, _maximumAge) {
    var opts;
    opts = {
      enableHighAccuracy: _enableHighAccuracy ? _enableHighAccuracy : true,
      timeout: _timeout ? _timeout : 10000,
      maximumAge: _maximumAge ? _maximumAge : 1000
    };
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer, geolocTimeout, watchID;
      defer = $q.defer();
      watchID = null;
      geolocTimeout = $timeout((function() {
        $window.navigator.geolocation.clearWatch(watchID);
        return defer.reject({
          message: 'Geolocation didn\'t responded within ' + opts.timeout + ' millis :('
        });
      }), opts.timeout);
      watchID = $window.navigator.geolocation.watchPosition((function(position) {
        $window.navigator.geolocation.clearWatch(watchID);
        $timeout.cancel(geolocTimeout);
        return defer.resolve(position);
      }), (function(error) {
        $timeout.cancel(geolocTimeout);
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      }), opts);
      return defer.promise;
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {

  } else {

  }
});

angular.module('app').factory('KeyboardPlugin', function($window, PluginUtils) {
  var disableScroll, hideKeyboardAccessoryBar, pluginName, pluginTest, service;
  pluginName = 'Keyboard';
  pluginTest = function() {
    return $window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard;
  };
  service = {
    hideKeyboardAccessoryBar: hideKeyboardAccessoryBar,
    disableScroll: disableScroll
  };
  hideKeyboardAccessoryBar = function() {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    });
  };
  disableScroll = function(shouldDisable) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return window.cordova.plugins.Keyboard.disableScroll(shouldDisable);
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.cordova) {
      window.cordova = {};
    }
    if (!window.cordova.plugins) {
      window.cordova.plugins = {};
    }
    if (!window.cordova.plugins.Keyboard) {
      return window.cordova.plugins.Keyboard = (function() {
        var plugin;
        plugin = {
          isVisible: false,
          show: function() {
            var event;
            plugin.isVisible = true;
            event = new Event('native.keyboardshow');
            event.keyboardHeight = 284;
            window.dispatchEvent(event);
          },
          close: function() {
            plugin.isVisible = false;
            window.dispatchEvent(new Event('native.keyboardhide'));
          },
          hideKeyboardAccessoryBar: function(shouldHide) {},
          disableScroll: function(shouldDisable) {}
        };
        return plugin;
      })();
    }
  }
});

angular.module('app').factory('LocalNotificationPlugin', function($window, $q, PluginUtils) {
  var cancel, onReady, pluginName, pluginTest, schedule, service;
  pluginName = 'LocalNotification';
  pluginTest = function() {
    return $window.plugin && $window.plugin.notification && $window.plugin.notification.local;
  };
  service = {
    schedule: schedule,
    cancel: cancel,
    onClick: function(callback) {
      return onReady('click', callback);
    }
  };
  schedule = function(opts) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.plugin.notification.local.schedule(opts);
    });
  };
  cancel = function(id) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugin.notification.local.cancel(id, function() {
        return defer.resolve();
      });
      return defer.promise;
    });
  };
  onReady = function(event, callback) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.plugin.notification.local.on(event, callback);
    });
  };
  return service;
});

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.plugin) {
      window.plugin = {};
    }
    if (!window.plugin.notification) {
      window.plugin.notification = {};
    }
    if (!window.plugin.notification.local) {
      return window.plugin.notification.local = (function() {
        var defaults, notifs, ret, withDefaults;
        notifs = {};
        defaults = {
          id: '0',
          title: '',
          text: '',
          every: 0,
          at: new Date,
          badge: 0,
          sound: 'res://platform_default',
          data: null,
          icon: 'res://icon',
          smallIcon: 'res://ic_popup_reminder',
          ongoing: false,
          led: 'FFFFFF'
        };
        ret = {
          hasPermission: function(callback, scope) {
            if (callback) {
              callback(true);
            }
          },
          registerPermission: function(callback, scope) {
            if (callback) {
              callback(true);
            }
          },
          schedule: function(opts, callback, scope) {
            var i, params;
            if (!Array.isArray(opts)) {
              opts = [opts];
            }
            for (i in opts) {
              params = withDefaults(opts[i]);
              if (ret.onadd) {
                ret.onadd(params.id, 'foreground', params.json);
              }
              notifs[params.id] = params;
            }
            if (callback) {
              callback();
            }
          },
          cancel: function(id, callback, scope) {
            if (ret.oncancel) {
              ret.oncancel(id, 'foreground', notifs[id].json);
            }
            delete notifs[id];
            if (callback) {
              callback();
            }
          },
          cancelAll: function(callback, scope) {
            var i;
            for (i in notifs) {
              if (ret.oncancel) {
                ret.oncancel(notifs[i].id, 'foreground', notifs[i].json);
              }
              delete notifs[i];
            }
            if (callback) {
              callback();
            }
          },
          on: function(event, callback) {},
          isScheduled: function(id, callback, scope) {
            if (callback) {
              callback(!!notifs[id]);
            }
          },
          getScheduledIds: function(callback, scope) {
            var i, ids;
            if (callback) {
              ids = [];
              for (i in notifs) {
                ids.push(notifs[i].id);
              }
              callback(ids);
            }
          },
          isTriggered: function(id, callback, scope) {
            if (callback) {
              callback(false);
            }
          },
          getTriggeredIds: function(callback, scope) {
            if (callback) {
              callback([]);
            }
          },
          getDefaults: function() {
            return JSON.parse(JSON.stringify(defaults));
          },
          setDefaults: function(opts) {
            defaults = withDefaults(opts);
          }
        };
        withDefaults = function(opts) {
          var i, res;
          res = JSON.parse(JSON.stringify(defaults));
          for (i in opts) {
            res[i] = opts[i];
          }
          return res;
        };
        return ret;
      })();
    }
  }
});

angular.module('app').factory('MediaPlugin', function($window, $q, $ionicPlatform, $log, PluginUtils) {
  var errorToMessage, loadMedia, pluginName, pluginTest, service, statusToMessage;
  pluginName = 'Media';
  pluginTest = function() {
    return $window.Media;
  };
  service = {
    loadMedia: loadMedia,
    statusToMessage: statusToMessage,
    errorToMessage: errorToMessage
  };
  loadMedia = function(src, onStop, onError, onStatus) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var mediaError, mediaStatus, mediaSuccess;
      mediaSuccess = function() {
        if (onStop) {
          return onStop();
        }
      };
      mediaError = function(error) {
        $log.error('pluginError:' + pluginName, {
          src: src,
          code: error.code,
          message: errorToMessage(error.code)
        });
        if (onError) {
          return onError(error);
        }
      };
      mediaStatus = function(status) {
        if (onStatus) {
          return onStatus(status);
        }
      };
      if ($ionicPlatform.is('android')) {
        src = '/android_asset/www/' + src;
      }
      return new $window.Media(src, mediaSuccess, mediaError, mediaStatus);
    });
  };
  statusToMessage = function(status) {
    if (status === 0) {
      return 'Media.MEDIA_NONE';
    } else if (status === 1) {
      return 'Media.MEDIA_STARTING';
    } else if (status === 2) {
      return 'Media.MEDIA_RUNNING';
    } else if (status === 3) {
      return 'Media.MEDIA_PAUSED';
    } else if (status === 4) {
      return 'Media.MEDIA_STOPPED';
    } else {
      return 'Unknown status <' + status + '>';
    }
  };
  errorToMessage = function(code) {
    if (code === 1) {
      return 'MediaError.MEDIA_ERR_ABORTED';
    } else if (code === 2) {
      return 'MediaError.MEDIA_ERR_NETWORK';
    } else if (code === 3) {
      return 'MediaError.MEDIA_ERR_DECODE';
    } else if (code === 4) {
      return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';
    } else {
      return 'Unknown code <' + code + '>';
    }
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.Media) {
      return window.Media = function(src, mediaSuccess, mediaError, mediaStatus) {
        var sound;
        if (typeof Audio !== 'function' && typeof Audio !== 'object') {
          console.warn('HTML5 Audio is not supported in this browser');
        }
        sound = new Audio;
        sound.src = src;
        sound.addEventListener('ended', mediaSuccess, false);
        sound.load();
        return {
          getCurrentPosition: function(mediaSuccess, mediaError) {
            return mediaSuccess(sound.currentTime);
          },
          getDuration: function() {
            if (isNaN(sound.duration)) {
              return -1;
            } else {
              return sound.duration;
            }
          },
          play: function() {
            return sound.play();
          },
          pause: function() {
            return sound.pause();
          },
          release: function() {},
          seekTo: function(milliseconds) {},
          setVolume: function(volume) {
            return sound.volume = volume;
          },
          startRecord: function() {},
          stopRecord: function() {},
          stop: function() {
            sound.pause();
            if (mediaSuccess) {
              return mediaSuccess();
            }
          }
        };
      };
    }
  }
});

angular.module('app').factory('ParsePlugin', function($window, $q, $log, PluginUtils) {
  var _exec, pluginName, pluginTest, service;
  pluginName = 'Parse';
  pluginTest = function() {
    return $window.parsePlugin;
  };
  service = {
    initialize: function(appId, clientKey) {
      return _exec($window.parsePlugin.initialize, appId, clientKey);
    },
    getInstallationId: function() {
      return _exec($window.parsePlugin.getInstallationId);
    },
    getInstallationObjectId: function() {
      return _exec($window.parsePlugin.getInstallationObjectId);
    },
    subscribe: function(channel) {
      return _exec($window.parsePlugin.subscribe, channel);
    },
    unsubscribe: function(channel) {
      return _exec($window.parsePlugin.unsubscribe, channel);
    },
    getSubscriptions: function() {
      return _exec($window.parsePlugin.getSubscriptions);
    },
    onMessage: function() {
      return _exec($window.parsePlugin.onMessage);
    }
  };
  _exec = function(fn) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer, fnArgs, i;
      defer = $q.defer();
      fnArgs = [];
      i = 1;
      while (i < arguments.length) {
        fnArgs.push(arguments[i]);
        i++;
      }
      fnArgs.push(function(res) {
        return defer.resolve(res);
      });
      fnArgs.push(function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      fn.apply(null, fnArgs);
      return defer.promise;
    });
  };
  return service;
});


/**************************
   *                        *
   *      Browser Mock      *
   *                        *
   *************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.parsePlugin) {
      return window.parsePlugin = (function() {
        var subscriptions;
        subscriptions = [];
        return {
          initialize: function(appId, clientKey, successCallback, errorCallback) {
            if (successCallback) {
              successCallback();
            }
          },
          getInstallationId: function(successCallback, errorCallback) {
            if (successCallback) {
              successCallback('7ff61742-ab67-42aa-bf48-d821afb44022');
            }
          },
          getInstallationObjectId: function(successCallback, errorCallback) {
            if (successCallback) {
              successCallback('ED4j8uPOth');
            }
          },
          subscribe: function(channel, successCallback, errorCallback) {
            subscriptions.push(channel);
            if (successCallback) {
              successCallback();
            }
          },
          unsubscribe: function(channel, successCallback, errorCallback) {
            subscriptions.splice(subscriptions.indexOf(channel), 1);
            if (successCallback) {
              successCallback();
            }
          },
          getSubscriptions: function(successCallback, errorCallback) {
            if (successCallback) {
              successCallback(subscriptions);
            }
          },
          onMessage: function(successCallback, errorCallback) {}
        };
      })();
    }
  }
});

angular.module('app').factory('PushPlugin', function($q, $http, $ionicPlatform, $window, $log, PluginUtils, Config) {
  var callbackCurRef, callbackList, cancel, onNotification, pluginName, pluginTest, register, sendPush, service, setApplicationIconBadgeNumber, showToastNotification;
  pluginName = 'Push';
  pluginTest = function() {
    return $window.plugins && $window.plugins.pushNotification;
  };
  callbackCurRef = 1;
  callbackList = {};
  service = {
    type: {
      ALL: 'all',
      MESSAGE: 'message',
      REGISTERED: 'registered',
      ERROR: 'error'
    },
    sendPush: sendPush,
    register: register,
    onNotification: onNotification,
    cancel: cancel
  };
  sendPush = function(recipients, data) {
    if ($ionicPlatform.is('android')) {
      return $http.post('https://android.googleapis.com/gcm/send', {
        registration_ids: recipients,
        data: data
      }, {
        headers: {
          Authorization: 'key=' + Config.gcm.apiServerKey
        }
      }).then(function() {
        return true;
      });
    } else {
      $window.alert('Your platform don\'t have push support :(');
      return $q.when(false);
    }
  };
  register = function(senderID) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var callbackRef, defer;
      defer = $q.defer();
      callbackRef = onNotification((function(notification) {
        defer.resolve(notification.regid);
        return cancel(callbackRef);
      }), service.type.REGISTERED);
      $window.plugins.pushNotification.register((function(data) {}), (function(err) {
        return registerDefer.reject(err);
      }), {
        senderID: senderID,
        ecb: 'onPushNotification'
      });
      return defer.promise;
    });
  };
  onNotification = function(callback, _type) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var id;
      id = callbackCurRef++;
      callbackList[id] = {
        fn: callback,
        type: _type || service.type.MESSAGE
      };
      return id;
    });
  };
  cancel = function(id) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return delete callbackList[id];
    });
  };
  setApplicationIconBadgeNumber = function(badgeNumber) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.pushNotification.setApplicationIconBadgeNumber((function(a, b, c) {
        console.log('success a', a);
        console.log('success b', b);
        console.log('success c', c);
        return defer.resolve();
      }), (function(err) {
        return defer.reject(err);
      }), badgeNumber);
      return defer.promise;
    });
  };
  showToastNotification = function(options) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.pushNotification.showToastNotification((function(a, b, c) {
        console.log('success a', a);
        console.log('success b', b);
        console.log('success c', c);
        return defer.resolve();
      }), (function(err) {
        return defer.reject(err);
      }), options);
      return defer.promise;
    });
  };
  $window.onPushNotification = function(notification) {
    var i, results;
    if (notification.event === service.type.MESSAGE) {

    } else if (notification.event === service.type.REGISTERED) {

    } else if (notification.event === service.type.ERROR) {
      $log.error('GCM error', notification);
    } else {
      $log.error('unknown GCM event has occurred', notification);
    }
    results = [];
    for (i in callbackList) {
      if (callbackList[i].type === service.type.ALL || callbackList[i].type === notification.event) {
        results.push(callbackList[i].fn(notification));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  return service;
});


/**************************
   *                        *
   *      Browser Mock      *
   *                        *
   *************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.plugins) {
      window.plugins = {};
    }
    if (!window.plugins.pushNotification) {
      return window.plugins.pushNotification = (function() {
        return {
          register: function(successCallback, errorCallback, options) {
            setTimeout((function() {
              if (successCallback) {
                successCallback('OK');
              }
              if (options && options.ecb) {
                eval(options.ecb)({
                  event: 'registered',
                  regid: 'registration_id'
                });
              }
            }), 0);
          },
          setApplicationIconBadgeNumber: function(successCallback, errorCallback, badge) {
            if (errorCallback) {
              errorCallback('Invalid action : setApplicationIconBadgeNumber');
            }
          },
          showToastNotification: function(successCallback, errorCallback, options) {
            if (errorCallback) {
              errorCallback('Invalid action : showToastNotification');
            }
          },
          unregister: function(successCallback, errorCallback, options) {},
          onDeviceReady: function(opts) {},
          registerDevice: function(successCallback, errorCallback) {
            if (successCallback) {
              successCallback('status');
            }
          }
        };
      })();
    }
  }
});

angular.module('app').factory('SocialSharingPlugin', function($window, $q, $log, PluginUtils) {
  var pluginName, pluginTest, service, share, shareViaEmail, shareViaFacebook, shareViaTwitter;
  pluginName = 'SocialSharing';
  pluginTest = function() {
    return $window.plugins && $window.plugins.socialsharing;
  };
  service = {
    share: share,
    shareViaFacebook: shareViaFacebook,
    shareViaTwitter: shareViaTwitter,
    shareViaEmail: shareViaEmail
  };
  share = function(message, _subject, _fileOrFileArray, _link) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.socialsharing.share(message, _subject || null, _fileOrFileArray || null, _link || null, (function() {
        return defer.resolve();
      }), function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      return defer.promise;
    });
  };
  shareViaFacebook = function(message, _fileOrFileArray, _link) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(message, _fileOrFileArray || null, _link || null, 'Tu peux coller le message par défaut si tu veux...', (function() {
        return defer.resolve();
      }), function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      return defer.promise;
    });
  };
  shareViaTwitter = function(message, _file, _link) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.socialsharing.shareViaTwitter(message, _file || null, _link || null, (function() {
        return defer.resolve();
      }), function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      return defer.promise;
    });
  };
  shareViaEmail = function(message, _subject, _fileOrFileArray) {
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      var defer;
      defer = $q.defer();
      $window.plugins.socialsharing.shareViaEmail(message, _subject || null, null, null, null, _fileOrFileArray || null, (function() {
        return defer.resolve();
      }), function(error) {
        $log.error('pluginError:' + pluginName, error);
        return defer.reject(error);
      });
      return defer.promise;
    });
  };
  return service;
});


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {

  } else {

  }
});

var ToastPlugin;

ToastPlugin = function($window, PluginUtils) {
  var pluginName, pluginTest, service, show;
  pluginName = 'Toast';
  pluginTest = function() {
    return $window.plugins && $window.plugins.toast;
  };
  service = {
    show: show,
    showShortTop: function(message, successCb, errorCb) {
      return show(message, 'short', 'top', successCb, errorCb);
    },
    showShortCenter: function(message, successCb, errorCb) {
      return show(message, 'short', 'center', successCb, errorCb);
    },
    showShortBottom: function(message, successCb, errorCb) {
      return show(message, 'short', 'bottom', successCb, errorCb);
    },
    showLongTop: function(message, successCb, errorCb) {
      return show(message, 'long', 'top', successCb, errorCb);
    },
    showLongCenter: function(message, successCb, errorCb) {
      return show(message, 'long', 'center', successCb, errorCb);
    },
    showLongBottom: function(message, successCb, errorCb) {
      return show(message, 'long', 'bottom', successCb, errorCb);
    }
  };
  show = function(message, duration, position, successCb, errorCb) {
    if (!duration) {
      duration = 'short';
    }
    if (!position) {
      position = 'bottom';
    }
    if (!successCb) {
      successCb = function(status) {};
    }
    if (!errorCb) {
      errorCb = function(error) {};
    }
    return PluginUtils.onReady(pluginName, pluginTest).then(function() {
      return $window.plugins.toast.show(message, duration, position, successCb, errorCb);
    });
  };
  return service;
};

'use strict';

angular.module('app').factory('ToastPlugin', ToastPlugin);


/**************************
 *                        *
 *      Browser Mock      *
 *                        *
#************************
 */

ionic.Platform.ready(function() {
  if (!(ionic.Platform.isAndroid() || ionic.Platform.isIOS() || ionic.Platform.isIPad())) {
    if (!window.plugins) {
      window.plugins = {};
    }
    if (!window.plugins.toast) {
      return window.plugins.toast = {
        show: function(message, duration, position, successCallback, errorCallback) {
          console.log('Toast: ' + message);
          if (successCallback) {
            return window.setTimeout(successCallback('OK'), 0);
          }
        },
        showShortTop: function(message, successCallback, errorCallback) {
          return this.show(message, 'short', 'top', successCallback, errorCallback);
        },
        showShortCenter: function(message, successCallback, errorCallback) {
          return this.show(message, 'short', 'center', successCallback, errorCallback);
        },
        showShortBottom: function(message, successCallback, errorCallback) {
          return this.show(message, 'short', 'bottom', successCallback, errorCallback);
        },
        showLongTop: function(message, successCallback, errorCallback) {
          return this.show(message, 'long', 'top', successCallback, errorCallback);
        },
        showLongCenter: function(message, successCallback, errorCallback) {
          return this.show(message, 'long', 'center', successCallback, errorCallback);
        },
        showLongBottom: function(message, successCallback, errorCallback) {
          return this.show(message, 'long', 'bottom', successCallback, errorCallback);
        }
      };
    }
  }
});

angular.module('app').factory('PluginUtils', function($window, $ionicPlatform, $q, $log) {
  var onReady, service;
  service = {
    onReady: onReady
  };
  onReady = function(name, testFn) {
    return $ionicPlatform.ready().then(function() {
      if (!testFn()) {
        $log.error('pluginNotFound:' + name);
        return $q.reject({
          message: 'pluginNotFound:' + name
        });
      }
    });
  };
  return service;
});
