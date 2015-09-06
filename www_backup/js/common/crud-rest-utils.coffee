angular.module 'app'

.factory 'CrudRestUtils', ($http, $q, $cacheFactory, $window, $log, CollectionUtils, Utils) ->
  service =
    createCrud: createCrud
    createCrudCtrl: createCrudCtrl

  ###*
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
  ###

  createCrud = (endpointUrl, _objectKey, _getData, _processBreforeSave, _useCache, _httpConfig) ->
    objectKey = if _objectKey then _objectKey else 'id'
    cache = if _useCache == false then null else $cacheFactory.get(endpointUrl) or $cacheFactory(endpointUrl)
    CrudSrv =
      eltKey: objectKey
      getUrl: (_id) ->
        _crudGetUrl endpointUrl, _id
      getAll: (_noCache) ->
        _crudGetAll endpointUrl, objectKey, cache, _noCache, _getData, _httpConfig
      find: (where, params) ->
        _crudFind where, params, endpointUrl, objectKey, cache, _getData, _httpConfig
      findOne: (where) ->
        _crudFindOne where, endpointUrl, objectKey, cache, _getData, _httpConfig
      get: (id, _noCache) ->
        _crudGet id, endpointUrl, objectKey, cache, _noCache, _getData, _httpConfig
      save: (elt) ->
        _crudSave elt, endpointUrl, objectKey, cache, _processBreforeSave, _getData, _httpConfig
      remove: (elt) ->
        _crudRemove elt, endpointUrl, objectKey, cache, _httpConfig
    CrudSrv

  ###
     * Create data and functions to use in crud controller, based on a CrudSrv
     *
     * Params starting with '_' are optionnals
     * @param CrudSrv                       data service to connect with
     * @param _defaultSort: {order, desc}   how to sort elts by default
     * @param _defaultFormElt: elt          default elt to load in form when create new elt
  ###

  createCrudCtrl = (CrudSrv, _defaultSort, _defaultFormElt) ->
    data =
      elts: []
      currentSort: if _defaultSort then _defaultSort else {}
      selectedElt: null
      defaultFormElt: if _defaultFormElt then _defaultFormElt else {}
      form: null
      status:
        error: null
        loading: true
        saving: false
        removing: false
    ctrl =
      data: data
      fn:
        sort: (order, _desc) ->
          _ctrlSort order, _desc, data

        toggle: (elt) ->
          _ctrlToggle elt, CrudSrv, data

        create: ->
          _ctrlCreate data

        edit: (elt) ->
          _ctrlEdit elt, data

        addElt: (obj, attr, _elt) ->
          _ctrlAddElt obj, attr, _elt

        removeElt: (arr, index) ->
          _ctrlRemoveElt arr, index

        cancelEdit: ->
          _ctrlCancelEdit data

        save: (_elt) ->
          _ctrlSave _elt, CrudSrv, data

        remove: (elt) ->
          _ctrlRemove elt, CrudSrv, data

        eltRestUrl: (_elt) ->
          _ctrlEltRestUrl _elt, CrudSrv

    _ctrlInit CrudSrv, data, _defaultSort
    ctrl

  _crudGetUrl = (endpointUrl, _id) ->
    endpointUrl + (if _id then '/' + _id else '')

  _crudConfig = (_cache, _httpConfig) ->
    cfg = if _httpConfig then angular.copy(_httpConfig) else {}
    if _cache
      cfg.cache = _cache
    cfg

  _setInCache = (_cache, endpointUrl, objectKey, result, elt) ->
    if _cache
      _cache.put _crudGetUrl(endpointUrl, elt[objectKey]), [
        result.status
        JSON.stringify(elt)
        result.headers()
        result.statusText
      ]


  _invalideAllCache = (_cache, endpointUrl) ->
    if _cache
      _cache.remove _crudGetUrl(endpointUrl)


  _crudGetAll = (endpointUrl, objectKey, _cache, _noCache, _getData, _httpConfig) ->
    url = _crudGetUrl(endpointUrl)
    if _cache and _noCache
      _cache.remove url
    $http.get(url, _crudConfig(_cache, _httpConfig)).then (result) ->
      elts = if typeof _getData == 'function' then _getData(result) else result.data
      if Array.isArray(elts)
        if _cache
# add all individual elements to cache !
          for i of elts
            _setInCache _cache, endpointUrl, objectKey, result, elts[i]
        return elts


  _crudFind = (where, params, endpointUrl, objectKey, _cache, _getData, _httpConfig) ->
    url = _crudGetUrl(endpointUrl)
    $http.get(url + '?where=' + JSON.stringify(where) + (if params then params else ''), _crudConfig(null, _httpConfig)).then (result) ->
      elts = if typeof _getData == 'function' then _getData(result) else result.data
      if Array.isArray(elts)
        if _cache
# add all individual elements to cache !
          for i of elts
            _setInCache _cache, endpointUrl, objectKey, result, elts[i]
        return elts


  _crudFindOne = (where, endpointUrl, objectKey, _cache, _getData, _httpConfig) ->
    _crudFind(where, '', endpointUrl, objectKey, _cache, _getData, _httpConfig).then (elts) ->
      if Array.isArray(elts) and elts.length > 0
        if elts.length > 1
          $log.warn 'More than one result for clause', where
        return elts[0]


  _crudGet = (id, endpointUrl, objectKey, _cache, _noCache, _getData, _httpConfig) ->
    url = _crudGetUrl(endpointUrl, id)
    if _cache and _noCache
      _cache.remove url
    $http.get(url, _crudConfig(_cache, _httpConfig)).then (result) ->
      elt = if typeof _getData == 'function' then _getData(result) else result.data
      if elt and elt[objectKey]
        return elt


  _crudSave = (elt, endpointUrl, objectKey, _cache, _processBreforeSave, _getData, _httpConfig) ->
    if elt
      if typeof _processBreforeSave == 'function'
        _processBreforeSave elt
      promise = null
      if elt[objectKey]
# update
        promise = $http.put(_crudGetUrl(endpointUrl, elt[objectKey]), elt, _crudConfig(null, _httpConfig))
      else
# create
        promise = $http.post(_crudGetUrl(endpointUrl), elt, _crudConfig(null, _httpConfig))
      promise.then (result) ->
        data = if typeof _getData == 'function' then _getData(result) else result.data
        newElt = angular.copy(elt)
        if !newElt[objectKey] and data[objectKey]
          newElt[objectKey] = data[objectKey]
        if !newElt['createdAt'] and data['createdAt']
          newElt['createdAt'] = data['createdAt']
        # for Parse responses...
        _setInCache _cache, endpointUrl, objectKey, result, newElt
        _invalideAllCache _cache, endpointUrl
        newElt
    else
      $q.when()

  _crudRemove = (elt, endpointUrl, objectKey, _cache, _httpConfig) ->
    if elt and elt[objectKey]
      url = _crudGetUrl(endpointUrl, elt[objectKey])
      $http.delete(url, _crudConfig(null, _httpConfig)).then (result) ->
        if _cache
          _cache.remove url
          _invalideAllCache _cache, endpointUrl

    else
      $q.when()

  _ctrlInit = (CrudSrv, data, _defaultSort) ->
    if _defaultSort
      Utils.sort data.elts, _defaultSort
    CrudSrv.getAll().then ((elts) ->
      if data.currentSort
        Utils.sort elts, data.currentSort
      data.elts = elts
      data.status.loading = false

    ), (err) ->
      $log.warn 'can\'t load data', err
      data.status.loading = false
      data.status.error = if err.statusText then err.statusText else 'Unable to load data :('



  _ctrlSort = (order, _desc, data) ->
    if data.currentSort.order == order
      data.currentSort.desc = !data.currentSort.desc
    else
      data.currentSort =
        order: order
        desc: if _desc then _desc else false
    Utils.sort data.elts, data.currentSort


  _ctrlToggle = (elt, CrudSrv, data) ->
    if elt and data.selectedElt and elt[CrudSrv.eltKey] == data.selectedElt[CrudSrv.eltKey]
      data.selectedElt = null
    else
      data.selectedElt = elt
    data.form = null


  _ctrlCreate = (data) ->
    data.form = angular.copy(data.defaultFormElt)


  _ctrlEdit = (elt, data) ->
    data.form = angular.copy(elt)


  _ctrlAddElt = (obj, attr, _elt) ->
    if obj and typeof obj == 'object'
      if !Array.isArray(obj[attr])
        obj[attr] = []
      elt = if _elt then angular.copy(_elt) else {}
      obj[attr].push elt
    else
      $log.warn 'Unable to addElt to', obj


  _ctrlRemoveElt = (arr, index) ->
    if Array.isArray(arr) and index < arr.length
      arr.splice index, 1
    else
      $log.warn 'Unable to removeElt <' + index + '> from', arr


  _ctrlCancelEdit = (data) ->
    data.form = null


  _ctrlSave = (_elt, CrudSrv, data) ->
    data.status.saving = true
    elt = if _elt then _elt else data.form
    CrudSrv.save(elt).then ((elt) ->
      CollectionUtils.upsertEltBy data.elts, elt, CrudSrv.eltKey
      if data.currentSort
        Utils.sort data.elts, data.currentSort
      data.selectedElt = elt
      data.form = null
      data.status.loading = false
      data.status.saving = false

    ), (error) ->
      $log.info 'error', error
      data.status.saving = false
      data.status.error = err


  _ctrlRemove = (elt, CrudSrv, data) ->
    if elt and elt[CrudSrv.eltKey] and $window.confirm('Supprimer ?')
      data.status.removing = true
      CrudSrv.remove(elt).then (->
        CollectionUtils.removeEltBy data.elts, elt, CrudSrv.eltKey
        data.selectedElt = null
        data.form = null
        data.status.loading = false
        data.status.removing = false

      ), (error) ->
        $log.info 'error', error
        data.status.removing = false
        data.status.error = error

    else
      $q.when()

  _ctrlEltRestUrl = (_elt, CrudSrv) ->
    if _elt and _elt[CrudSrv.eltKey] then CrudSrv.getUrl(_elt[CrudSrv.eltKey]) else CrudSrv.getUrl()

  service

