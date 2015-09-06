angular.module 'app'

.factory 'CollectionUtils', (_) ->
  service =
    clear: clear
    copy: copy
    updateElt: updateElt
    upsertElt: upsertElt
    removeElt: removeElt
    updateEltBy: updateEltBy
    upsertEltBy: upsertEltBy
    removeEltBy: removeEltBy
    toMap: toMap
    toArray: toArray
    size: size
    isEmpty: isEmpty
    isNotEmpty: isNotEmpty

  clear = (col) ->
    if Array.isArray(col)
      while col.length > 0
        col.pop()
    else
      for i of col
        delete col[i]


  copy = (srcCol, destCol) ->
    clear destCol
    for i of srcCol
      destCol[i] = angular.copy(srcCol[i])


  updateElt = (collection, selector, elt) ->
    foundElt = _.find(collection, selector)
    if foundElt
      replacedElt = angular.copy(foundElt)
      angular.copy elt, foundElt
      return replacedElt


  upsertElt = (collection, selector, key, elt) ->
    foundElt = _.find(collection, selector)
    if foundElt
      replacedElt = angular.copy(foundElt)
      angular.copy elt, foundElt
      return replacedElt
    else
      if Array.isArray(collection)
        collection.push elt
      else
        collection[key] = elt


  removeElt = (collection, selector) ->
    _.remove collection, selector


  updateEltBy = (collection, elt, keyAttr) ->
    selector = {}
    selector[keyAttr] = elt[keyAttr]
    updateElt collection, selector, elt

  upsertEltBy = (collection, elt, keyAttr) ->
    selector = {}
    selector[keyAttr] = elt[keyAttr]
    upsertElt collection, selector, elt[keyAttr], elt

  removeEltBy = (collection, elt, keyAttr) ->
    selector = {}
    selector[keyAttr] = elt[keyAttr]
    removeElt collection, selector

  toMap = (arr) ->
    map = {}
    if Array.isArray(arr)
      for i of arr
        map[arr[i].id] = arr[i]
    map

  toArray = (map) ->
    arr = []
    for i of map
      map[i].id = i
      arr.push map[i]
    arr

  size = (col) ->
    if Array.isArray(col)
      col.length
    else
      Object.keys(col).length

  isEmpty = (col) ->
    size(col) == 0

  isNotEmpty = (col) ->
    !isEmpty(col)

  service

