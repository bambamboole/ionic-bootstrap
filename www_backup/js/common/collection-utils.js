// Generated by CoffeeScript 1.9.3
(function() {
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

}).call(this);

//# sourceMappingURL=collection-utils.js.map
