# Storage helper using localForage (asynchronous best avaiable browser storage) and cache
angular.module 'app'

.provider 'StorageUtils', LocalStorageProvider

.factory 'LocalForageUtils', LocalForageUtils

.provider 'LocalStorageUtils', LocalStorageProvider

LocalForageUtils = ($localForage, $q, $log, Utils, Config) ->
  storageCache = {}
  promiseStorageCache = {}
  service =
    get: _get
    set: _set
    remove: _remove
    clear: _clear
    clearStartingWith: _clearStartingWith
    getSync: _getSync

  _get = (key, _defaultValue) ->
    if storageCache[key]
      Utils.async ->
        angular.copy storageCache[key]
    else if promiseStorageCache[key]
      promiseStorageCache[key]
    else
      if Config.storage
        promiseStorageCache[key] = $localForage.getItem(Config.storagePrefix + key).then (value) ->
          try
            storageCache[key] = JSON.parse(value) or angular.copy(_defaultValue)
          catch e
            storageCache[key] = angular.copy(_defaultValue)
          delete promiseStorageCache[key]
          angular.copy storageCache[key]
        , (error) ->
          $log.error 'error in LocalForageUtils._get(' + key + ')', error
          delete promiseStorageCache[key]

        promiseStorageCache[key]
      else
        storageCache[key] = angular.copy(_defaultValue)
        Utils.async ->
          angular.copy storageCache[key]

  _getSync = (key, _defaultValue) ->
    if storageCache[key]
      angular.copy storageCache[key]
    else
      _get key, _defaultValue
      angular.copy _defaultValue

  _set = (key, value) ->
    if !angular.equals(storageCache[key], value)
      storageCache[key] = angular.copy(value)
      if Config.storage
        $localForage.setItem(Config.storagePrefix + key, JSON.stringify(storageCache[key])).then ((value) ->
# return nothing !

        ), (error) ->
          $log.error 'error in LocalForageUtils._set(' + key + ')', error

      else
        $q.when()
    else
      $log.debug 'Don\'t save <' + key + '> because values are equals !', value
      $q.when()

  _remove = (key) ->
    $log.debug 'Remove <' + key + '> from storage !'
    delete storageCache[key]
    if Config.storage
      $localForage.removeItem Config.storagePrefix + key
    else
      $q.when()

  _clear = ->
    storageCache = {}
    if Config.storage
      $localForage.clear()
    else
      $q.when()

  _clearStartingWith = (keyStartWith) ->
    for i of storageCache
      if Utils.startsWith(i, keyStartWith)
        delete storageCache[i]
    if Config.storage
      $localForage.keys().then (keys) ->
        promises = []
        for i of keys
          if Utils.startsWith(keys[i], Config.storagePrefix + keyStartWith)
            promises.push $localForage.removeItem(keys[i])
        $q.all(promises).then (results) ->
# nothing

    else
      $q.when()

  service

# LocalStorage helper with caching system & asynchronous calls

LocalStorageProvider = (Config) ->
  storageCache = {}

  _get = (key, _defaultValue) ->
    if !storageCache[key]
      if Config.storage and window.localStorage
        try
          storageCache[key] = JSON.parse(window.localStorage.getItem(Config.storagePrefix + key)) or angular.copy(_defaultValue)
        catch e
          storageCache[key] = angular.copy(_defaultValue)
      else
        storageCache[key] = angular.copy(_defaultValue)
    angular.copy storageCache[key]

  LocalStorageUtils = ($window, $log, Utils) ->
    service =
      get: (key, _defaultValue) ->
        Utils.async ->
          _get key, _defaultValue
      set: (key, value) ->
        Utils.async ->
          _set key, value
      remove: (key) ->
        Utils.async ->
          _remove key
      clear: ->
        Utils.async ->
          _clear()
      clearStartingWith: (keyStartWith) ->
        Utils.async ->
          _clearStartingWith keyStartWith
      getSync: _get
      setSync: _set
      removeSync: _remove
      clearSync: _clear
      clearStartingWithSync: _clearStartingWith

    _set = (key, value) ->
      if !angular.equals(storageCache[key], value)
        storageCache[key] = angular.copy(value)
        if Config.storage and $window.localStorage
          $window.localStorage.setItem Config.storagePrefix + key, JSON.stringify(storageCache[key])
      else
        $log.debug 'Don\'t save <' + key + '> because values are equals !'


    _remove = (key) ->
      $log.debug 'Remove <' + key + '> from storage !'
      delete storageCache[key]
      if Config.storage and $window.localStorage
        $window.localStorage.removeItem Config.storagePrefix + key


    _clear = ->
      storageCache = {}
      if Config.storage and $window.localStorage
        $window.localStorage.clear()


    _clearStartingWith = (keyStartWith) ->
      for i of storageCache
        if Utils.startsWith(i, keyStartWith)
          delete storageCache[i]
      if Config.storage and $window.localStorage
        j = $window.localStorage.length - 1
        while j >= 0
          key = $window.localStorage.key(j)
          if Utils.startsWith(key, Config.storagePrefix + keyStartWith)
            $window.localStorage.removeItem key
          j--

    service

  @getSync = _get

  @$get = LocalStorageUtils

  LocalStorageUtils.$inject = [
    '$window'
    '$log'
    'Utils'
  ]