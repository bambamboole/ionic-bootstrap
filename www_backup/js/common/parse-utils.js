// Generated by CoffeeScript 1.9.3
(function() {
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

}).call(this);

//# sourceMappingURL=parse-utils.js.map
