angular.module 'app'

.factory 'UserSrv', UserSrv

UserSrv.$inject = [ 'StorageUtils' ]

UserSrv = (StorageUtils) ->
  userKey = 'user'
  service =
    storageKey: userKey
    get: getCurrentUser
    set: setCurrentUser
    delete: deleteCurrentUser

  getCurrentUser = ->
    StorageUtils.get userKey

  setCurrentUser = (user) ->
    StorageUtils.set userKey, user

  deleteCurrentUser = ->
    StorageUtils.clear userKey

  service


