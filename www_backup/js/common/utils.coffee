angular.module 'app'

.factory 'Utils', ($timeout, $q, $sce, $log) ->
  service =
    createUuid: createUuid
    isEmail: isEmail
    isUrl: isUrl
    startsWith: startsWith
    endsWith: endsWith
    randInt: randInt
    toDate: toDate
    isDate: isDate
    getDeep: getDeep
    async: async
    debounce: debounce
    trustHtml: trustHtml
    extendDeep: extendDeep
    extendsWith: extendsWith
    sort: sort
  debounces = []

  createUuid = ->

    S4 = ->
      ((1 + Math.random()) * 0x10000 | 0).toString(16).substring 1

    (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()

  isEmail = (str) ->
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    re.test str

  isUrl = (str) ->
    /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i.test str

  startsWith = (str, prefix) ->
    str.indexOf(prefix) == 0

  endsWith = (str, suffix) ->
    str.indexOf(suffix, str.length - (suffix.length)) != -1

  randInt = (min, max) ->
    Math.floor(Math.random() * (max - min + 1)) - min

  toDate = (date) ->
    if typeof date == 'number'
      return new Date(date)
    # timestamp
    if typeof date == 'string'
      return new Date(date)
    # iso string
    if date instanceof Date
      return date
    # JavaScript Date
    if date and typeof date.toDate == 'function' and date.toDate() instanceof Date
      return date.toDate()
    # moment Date


  isDate = (date) ->
    d = toDate(date)
    d instanceof Date and d.toString() != 'Invalid Date'

  async = (fn) ->
    defer = $q.defer()
    $timeout (->
      defer.resolve fn()

    ), 0
    defer.promise

  trustHtml = (html) ->
    $sce.trustAsHtml html

  debounce = (key, callback, _debounceTime) ->
    $timeout.cancel debounces[key]
    debounces[key] = $timeout((->
      callback()

    ), _debounceTime or 1000)


  # like angular.merge() (but for previous angular versions)

  extendDeep = (dest) ->
    angular.forEach arguments, (arg) ->
      if arg != dest
        angular.forEach arg, (value, key) ->
          if dest[key] and typeof dest[key] == 'object'
            extendDeep dest[key], value
          else
            dest[key] = angular.copy(value)

    dest

  extendsWith = (dest, src) ->
    for i of src
      if typeof src[i] == 'object'
        if dest[i] == undefined or dest[i] == null
          dest[i] = angular.copy(src[i])
        else if typeof dest[i] == 'object'
          extendsWith dest[i], src[i]
      else if typeof src[i] == 'function'
# nothing
      else if dest[i] == undefined or dest[i] == null
        dest[i] = src[i]


  sort = (arr, params) ->
    if Array.isArray(arr) and arr.length > 0 and params and params.order
      firstElt = null
      for i of arr
        firstElt = _getDeep(arr[i], params.order.split('.'))
        if typeof firstElt != 'undefined'
          break
      if typeof firstElt == 'boolean'
        _boolSort arr, params
      else if typeof firstElt == 'number'
        _intSort arr, params
      else if typeof firstElt == 'string'
        _strSort arr, params
      else
        $log.warn 'Unable to find suitable sort for type <' + typeof firstElt + '>', firstElt


  _strSort = (arr, params) ->
    arr.sort (a, b) ->
      aStr = _getDeep(a, params.order.split('.'), '').toLowerCase()
      bStr = _getDeep(b, params.order.split('.'), '').toLowerCase()
      if aStr > bStr
        1 * (if params.desc then -1 else 1)
      else if aStr < bStr
        -1 * (if params.desc then -1 else 1)
      else
        0


  _intSort = (arr, params) ->
    arr.sort (a, b) ->
      aInt = _getDeep(a, params.order.split('.'), 0)
      bInt = _getDeep(b, params.order.split('.'), 0)
      (aInt - bInt) * (if params.desc then -1 else 1)


  _boolSort = (arr, params) ->
    arr.sort (a, b) ->
      aBool = _getDeep(a, params.order.split('.'), 0)
      bBool = _getDeep(b, params.order.split('.'), 0)
      (if aBool == bBool then 0 else if aBool then -1 else 1) * (if params.desc then -1 else 1)


  getDeep = (obj, path, _defaultValue) ->
    _getDeep obj, path.split('.'), _defaultValue

  _getDeep = (obj, attrs, _defaultValue) ->
    if Array.isArray(attrs) and attrs.length > 0
      if typeof obj == 'object'
        attr = attrs.shift()
        _getDeep obj[attr], attrs, _defaultValue
      else
        _defaultValue
    else
      if typeof obj == 'undefined' then _defaultValue else obj

  service

