angular.module 'app'

.factory 'customLogger', ->

  track = (name, data, _time) ->
    if typeof data == 'string'
      data = message: data
    event = {}
    if data
      event.data = data
    if _time
      event.time = _time
    Logger.track name, event


  ($delegate) ->
    {
    debug: ->
      $delegate.debug.apply null, arguments

    log: ->
      track arguments[0], arguments[1], arguments[2]
      $delegate.log.apply null, arguments

    info: ->
      $delegate.info.apply null, arguments

    warn: ->
      $delegate.warn.apply null, arguments

    error: ->
      if typeof arguments[0] == 'string'
        track 'error', {
          type: arguments[0]
          error: arguments[1]
        }, arguments[2]
      else
        exception = arguments[0]
        cause = arguments[1]
        data = type: 'angular'
        if cause
          data.cause = cause
        if exception
          if exception.message
            data.message = exception.message
          if exception.name
            data.name = exception.name
          if exception.stack
            data.stack = exception.stack
        track 'exception', data
      $delegate.error.apply null, arguments


    }


