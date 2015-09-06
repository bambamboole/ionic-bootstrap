# Define Logger
Logger = do ->

  createUuid = ->

    S4 = ->
      ((1 + Math.random()) * 0x10000 | 0).toString(16).substring 1

    (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()

  track = (name, event, _allowNoUser) ->
    if typeof event == 'string'
      event = messgae: event
    if !event.name
      event.name = name
    if !event.time
      event.time = Date.now()
    if !event.user
      event.user = _getUserId()
    if !event.appVersion and Config
      event.appVersion = Config.appVersion
    if !event.source
      event.source = {}
    if !event.source.url and window and window.location
      event.source.url = window.location.href
    if !event.id
      event.id = createUuid()
      event.prevId = cache.currentEventId
      cache.currentEventId = event.id
    if !event.user and !_allowNoUser
      window.setTimeout (->
        track name, event, true
        return
      ), 2000
    else
      if config.verbose
        console.log '$[track] ' + name, event
      if config.track
        if config.async and event.name != 'exception'
          Scheduler.schedule event
        else
          Scheduler.send event, (status) ->

            if status == 'ko'
              Scheduler.schedule event
            return
      if name == 'error' and config.debug and event.data.error
        msg = if event.data and event.data.error then (if event.data.error.message then event.data.error.message else event.data.error) else ''
        window.alert 'Error: ' + event.data.type + '\n' + msg + '\nPlease contact: ' + Config.emailSupport
      if name == 'exception'
        msg = if event.data and event.data.message then event.data.message else event.message
        window.alert 'Exception: ' + msg + '\nPlease contact: ' + Config.emailSupport
    return

  _getUserId = ->
    if cache and cache.userId
      return cache.userId
    else if localStorage
      user = JSON.parse(localStorage.getItem(config.storagePrefix + 'user'))
      if user and user.id
        cache.userId = user.id
        return user.id
    return

  'use strict'
  Scheduler = do ->
    events = []
    eventSender = null

    init = ->
      if localStorage
        events = _getEvents() or []
        if events.length > 0
          _startScheduler()
      return

    schedule = (event) ->
      _addEvent event
      _startScheduler()
      return

    send = (event, callback) ->
# TODO : send one event to the server

      ###$.ajax({
        type: 'POST',
        url: config.backendUrl+'/api/v1/track/event',
        data: JSON.stringify(event),
        contentType: 'application/json'
      })
      .done(function(data, textStatus, jqXHR)       { if(callback){callback('ok');} })
      .fail(function(jqXHR, textStatus, errorThrown){ if(callback){callback('ko');} });
      ###

      if callback
        callback 'ok'
      return

    sendAll = (events, callback) ->
# TODO : send array of events to the server

      ###$.ajax({
        type: 'POST',
        url: config.backendUrl+'/api/v1/track/events',
        data: JSON.stringify(events),
        contentType: 'application/json'
      })
      .done(function(data, textStatus, jqXHR)       { if(callback){callback('ok');} })
      .fail(function(jqXHR, textStatus, errorThrown){ if(callback){callback('ko');} });
      ###

      if callback
        callback 'ok'
      return

    _startScheduler = ->
      if eventSender == null and events.length > 0
# when scheduler starts, all events are not sending !
        i = 0
        while i < events.length
          events[i].sending = false
          i++
        eventSender = window.setInterval((->
          if events.length == 0
            _stopScheduler()
          else if events.length == 1
            event = events[0]
            _resetEvents()
            send event, (status) ->
              if status == 'ko'
                _addEvent event
                _stopScheduler()
              return
          else
            toSend = events
            _resetEvents()
            sendAll toSend, (status) ->
              if status == 'ko'
                _addEvents toSend
                _stopScheduler()
              return
          return
        ), config.scheduler.interval)
      return

    _stopScheduler = ->
      if eventSender != null
        window.clearInterval eventSender
        eventSender = null
      return

    _addEvent = (event) ->
      events.push event
      _setEvents events
      return

    _addEvents = (eventsToAdd) ->
      events = events.concat(eventsToAdd)
      _setEvents events
      return

    _resetEvents = ->
      events = []
      _setEvents events
      return

    _setEvents = (events) ->
      if localStorage
        localStorage.setItem config.scheduler.storageKey, JSON.stringify(events)
      return

    _getEvents = ->
      if localStorage
        return JSON.parse(localStorage.getItem(config.scheduler.storageKey))
      return

    {
    init: init
    schedule: schedule
    send: send
    }
  config =
    storagePrefix: Config.storagePrefix
    backendUrl: Config.backendUrl
    verbose: Config.verbose
    debug: Config.debug
    track: Config.track
    async: true
    scheduler:
      storageKey: 'tracking-events-cache'
      interval: 3000
  cache =
    currentEventId: null
    userId: null
    deviceId: null
  Scheduler.init()
  { track: track }
# catch exceptions

window.onerror = (message, url, line, col, error) ->
  'use strict'
  stopPropagation = false
  data = type: 'javascript'
  if message
    data.message = message
  if url
    data.fileName = url
  if line
    data.lineNumber = line
  if col
    data.columnNumber = col
  if error
    if error.name
      data.name = error.name
    if error.stack
      data.stack = error.stack
  if navigator
    if navigator.userAgent
      data['navigator.userAgent'] = navigator.userAgent
    if navigator.platform
      data['navigator.platform'] = navigator.platform
    if navigator.vendor
      data['navigator.vendor'] = navigator.vendor
    if navigator.appCodeName
      data['navigator.appCodeName'] = navigator.appCodeName
    if navigator.appName
      data['navigator.appName'] = navigator.appName
    if navigator.appVersion
      data['navigator.appVersion'] = navigator.appVersion
    if navigator.product
      data['navigator.product'] = navigator.product
  Logger.track 'exception', data: data
  return stopPropagation
