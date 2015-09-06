
# for Toast plugin : https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin

ToastPlugin = ($window, PluginUtils) ->
  pluginName = 'Toast'

  pluginTest = ->
    $window.plugins and $window.plugins.toast

  service =
    show: show
    showShortTop: (message, successCb, errorCb) ->
      show message, 'short', 'top', successCb, errorCb

    showShortCenter: (message, successCb, errorCb) ->
      show message, 'short', 'center', successCb, errorCb

    showShortBottom: (message, successCb, errorCb) ->
      show message, 'short', 'bottom', successCb, errorCb

    showLongTop: (message, successCb, errorCb) ->
      show message, 'long', 'top', successCb, errorCb

    showLongCenter: (message, successCb, errorCb) ->
      show message, 'long', 'center', successCb, errorCb

    showLongBottom: (message, successCb, errorCb) ->
      show message, 'long', 'bottom', successCb, errorCb


  show = (message, duration, position, successCb, errorCb) ->
    if !duration
      duration = 'short'
    # possible values : 'short', 'long'
    if !position
      position = 'bottom'
    # possible values : 'top', 'center', 'bottom'
    if !successCb

      successCb = (status) ->

    if !errorCb

      errorCb = (error) ->

    PluginUtils.onReady(pluginName, pluginTest).then ->
      $window.plugins.toast.show message, duration, position, successCb, errorCb


  service

'use strict'
angular.module('app').factory 'ToastPlugin', ToastPlugin

###*************************
#                        *
#      Browser Mock      *
#                        *
#************************
###

ionic.Platform.ready ->
  if !(ionic.Platform.isAndroid() or ionic.Platform.isIOS() or ionic.Platform.isIPad())
    if !window.plugins
      window.plugins = {}
    if !window.plugins.toast
      window.plugins.toast =
        show: (message, duration, position, successCallback, errorCallback) ->
# durations : short, long
# positions : top, center, bottom
# default: short bottom
          console.log 'Toast: ' + message
          if successCallback
            window.setTimeout successCallback('OK'), 0

        showShortTop: (message, successCallback, errorCallback) ->
          @show message, 'short', 'top', successCallback, errorCallback

        showShortCenter: (message, successCallback, errorCallback) ->
          @show message, 'short', 'center', successCallback, errorCallback

        showShortBottom: (message, successCallback, errorCallback) ->
          @show message, 'short', 'bottom', successCallback, errorCallback

        showLongTop: (message, successCallback, errorCallback) ->
          @show message, 'long', 'top', successCallback, errorCallback

        showLongCenter: (message, successCallback, errorCallback) ->
          @show message, 'long', 'center', successCallback, errorCallback

        showLongBottom: (message, successCallback, errorCallback) ->
          @show message, 'long', 'bottom', successCallback, errorCallback
