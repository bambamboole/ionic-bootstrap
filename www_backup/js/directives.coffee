angular.module 'app'

.directive 'href', href
.directive 'debounce', debounce
.directive 'blurOnKeyboardOut', blurOnKeyboardOut
.directive 'focusOnKeyboardOpen', focusOnKeyboardOpen

href = ($window) ->
  externePrefixes = undefined
  isExterneUrl = undefined
  externePrefixes = [
    'http:'
    'https:'
    'tel:'
    'sms:'
  ]

  isExterneUrl = (url) ->
    i = undefined
    if url
      for i of externePrefixes
        `i = i`
        if url.indexOf(externePrefixes[i]) == 0
          return true
    false

  {
  restrict: 'A'
  scope: url: '@href'
  link: (scope, element, attrs) ->
    if isExterneUrl(scope.url)
      element.bind 'click', (e) ->
        e.preventDefault()
        $window.open encodeURI(scope.url), '_system', 'location=yes'

  }

debounce = ($timeout) ->
  {
  restrict: 'A'
  require: 'ngModel'
  priority: 99
  link: (scope, element, attr, ngModelCtrl) ->
    debounce = undefined
    if attr.type == 'radio' or attr.type == 'checkbox'
      return
    debounce = undefined
    element.unbind 'input'
    element.bind 'input', ->
      $timeout.cancel debounce
      debounce = $timeout((->
        scope.$apply ->
          ngModelCtrl.$setViewValue element.val()


      ), attr.ngDebounce or 1000)

    element.bind 'blur', ->
      scope.$apply ->
        ngModelCtrl.$setViewValue element.val()

  }

blurOnKeyboardOut = ($window) ->
  {
  restrict: 'A'
  link: (scope, element, attrs) ->
    $window.addEventListener 'native.keyboardhide', (e) ->
      element[0].blur()
      scope.safeApply ->
        scope.$eval attrs.blurOnKeyboardOut

  }

focusOnKeyboardOpen = ($window) ->
  {
  restrict: 'A'
  link: (scope, element, attrs) ->
    keyboardOpen = undefined
    keyboardOpen = false
    $window.addEventListener 'native.keyboardshow', (e) ->
      keyboardOpen = true
      element[0].focus()

    $window.addEventListener 'native.keyboardhide', (e) ->
      keyboardOpen = false
      element[0].blur()

    element[0].addEventListener 'blur', ((e) ->
      if keyboardOpen
        element[0].focus()

    ), true

  }