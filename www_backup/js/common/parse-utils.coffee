angular.module 'app'

.provider 'ParseUtils',  ->
  credentials =
    applicationId: null
    restApiKey: null

  @initialize = (applicationId, restApiKey) ->
    credentials.applicationId = applicationId
    credentials.restApiKey = restApiKey


  @$get = [
    '$http'
    '$q'
    'CrudRestUtils'
    'Utils'
    ($http, $q, CrudRestUtils, Utils) ->
      service =
        createCrud: createCrud
        createUserCrud: createUserCrud
        signup: signup
        login: login
        loginOAuth: loginOAuth
        passwordRecover: passwordRecover
        toGeoPoint: toGeoPoint
        toPointer: toPointer
        toDate: toDate
      parseUrl = 'https://api.parse.com/1'
      parseObjectKey = 'objectId'

      getParseData = (result) ->
        if result and result.data
          if !result.data[parseObjectKey] and result.data.results
            return result.data.results
          else
            return result.data


      parseHttpConfig = headers:
        'X-Parse-Application-Id': credentials.applicationId
        'X-Parse-REST-API-Key': credentials.restApiKey

      createCrud = (objectClass, _processBreforeSave, _useCache) ->

        endpointUrl = parseUrl + '/classes/' + objectClass
        service = CrudRestUtils.createCrud(endpointUrl, parseObjectKey, getParseData, _processBreforeSave, _useCache, parseHttpConfig)

        service.savePartial = (objectToSave, dataToUpdate) ->
          objectId = if typeof objectToSave == 'string' then objectToSave else objectToSave[parseObjectKey]
          toUpdate = angular.copy(dataToUpdate)
          toUpdate[parseObjectKey] = objectId
          service.save toUpdate

        service

      createUserCrud = (sessionToken, _processBreforeSave, _useCache) ->
        endpointUrl = parseUrl + '/users'
        parseUserHttpConfig = angular.copy(parseHttpConfig)
        parseUserHttpConfig.headers['X-Parse-Session-Token'] = sessionToken

        _processBreforeSaveReal = (user) ->

          delete user.emailVerified
          if _processBreforeSave
            _processBreforeSave user


        service = CrudRestUtils.createCrud(endpointUrl, parseObjectKey, getParseData, _processBreforeSaveReal, _useCache, parseUserHttpConfig)

        service.savePartial = (objectToSave, dataToUpdate) ->
          objectId = if typeof objectToSave == 'string' then objectToSave else objectToSave[parseObjectKey]
          toUpdate = angular.copy(dataToUpdate)
          toUpdate[parseObjectKey] = objectId
          service.save toUpdate

        service

      # user MUST have fields 'username' and 'password'. The first one should be unique, application wise.

      signup = (user) ->
        if user and user.username and user.password
          $http.post(parseUrl + '/users', user, parseHttpConfig).then (result) ->
            newUser = angular.copy(user)
            delete newUser.password
            newUser.objectId = result.data.objectId
            newUser.sessionToken = result.data.sessionToken
            newUser
        else
          $q.reject data: error: 'user MUST have fields username & password !'

      login = (username, password) ->
        $http.get(parseUrl + '/login?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), parseHttpConfig).then (result) ->
          result.data

      # https://parse.com/docs/rest#users-linking

      loginOAuth = (authData) ->
        $http.post(parseUrl + '/users', { authData: authData }, parseHttpConfig).then (result) ->
          result.data

      passwordRecover = (email) ->
        $http.post(parseUrl + '/requestPasswordReset', { email: email }, parseHttpConfig).then ->
# return nothing


      toGeoPoint = (lat, lon) ->
        {
        __type: 'GeoPoint'
        latitude: lat
        longitude: lon
        }

      toPointer = (className, sourceObject) ->
        {
        __type: 'Pointer'
        className: className
        objectId: if typeof sourceObject == 'string' then sourceObject else sourceObject[parseObjectKey]
        }

      toDate = (date) ->
        d = Utils.toDate(date)
        if d
          return d.toISOString()
        throw 'Function toDate must be used with a timestamp or a Date object'


      service
  ]

