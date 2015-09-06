angular.module 'app'

.factory 'IonicUtils', ($ionicLoading, $ionicScrollDelegate, $ionicPosition) ->
  service =
    withLoading: withLoading
    scrollTo: scrollTo

  withLoading = (promise) ->
    $ionicLoading.show()
    promise.then((res) ->
      res
    ).finally ->
      $ionicLoading.hide()


  scrollTo = (className, _shouldAnimate) ->
    elt = document.getElementsByClassName(className)
    if elt
      scrollElt = _getParentWithClass(angular.element(elt), 'scroll-content')
      if scrollElt
        try
          eltOffset = $ionicPosition.offset(elt)
          # get an error when element is not visible :(
          scrollOffset = $ionicPosition.offset(scrollElt)
          handle = scrollElt.attr('delegate-handle')
          $scroll = if handle then $ionicScrollDelegate.$getByHandle(handle) else $ionicScrollDelegate
          scroll = $scroll.getScrollPosition()
          $scroll.scrollTo scroll.left, eltOffset.top - (scrollOffset.top), _shouldAnimate
        catch e
          console.warn 'scrollTo(' + className + ') error :(', e
      else
        console.warn 'Parent element with class <scroll-content> not found !'
    else
      console.warn 'Element with class <' + className + '> not found !'


  # because  ionic.DomUtil.getParentWithClass(elt, 'scroll-content') doesn't seems to work :(

  _getParentWithClass = (elt, className, _maxDeep) ->
    if _maxDeep == undefined
      _maxDeep = 10
    parent = elt.parent()
    if parent.hasClass(className)
      parent
    else if _maxDeep > 0
      _getParentWithClass parent, className, _maxDeep - 1
    else
      null

  service


