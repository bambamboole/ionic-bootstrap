angular.module 'app'

.factory 'DataUtils', DataUtils

DataUtils.$inject = [
  '$http'
  'StorageUtils'
  'Config'
]

DataUtils = ($http, StorageUtils, Config) ->
  service =
    getOrFetch: getOrFetch
    refresh: refresh

  getOrFetch = (storageKey, url, _absolute) ->
    StorageUtils.get(storageKey).then (data) ->
      if data
        data
      else
        refresh storageKey, url, _absolute

  refresh = (storageKey, url, _absolute) ->
    $http.get(if _absolute then url else Config.backendUrl + url).then (res) ->
      StorageUtils.set(storageKey, res.data).then ->
        res.data

  service

