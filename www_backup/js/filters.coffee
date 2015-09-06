angular.module 'app'

.filter 'date', date
.filter 'datetime', datetime
.filter 'time', time
.filter 'humanTime', humanTime
.filter 'duration', duration
.filter 'mynumber', mynumber
.filter 'rating', rating


date = (Utils, moment) ->
  (date, format) ->
    jsDate = Utils.toDate(date)
    if jsDate then moment(jsDate).format(if format then format else 'll') else '<date>'

datetime = (Utils, moment) ->
  (date, format) ->
    jsDate = Utils.toDate(date)
    if jsDate then moment(jsDate).format(if format then format else 'D MMM YYYY, HH:mm:ss') else '<datetime>'

time = (Utils, moment) ->
  (date, format) ->
    jsDate = Utils.toDate(date)
    if jsDate then moment(jsDate).format(if format then format else 'LT') else '<time>'

humanTime = (Utils, moment) ->
  (date) ->
    jsDate = Utils.toDate(date)
    if jsDate then moment(jsDate).fromNow(true) else '<humanTime>'

duration = ($log, moment) ->
  (seconds, humanize) ->
    if seconds or seconds == 0
      if humanize
        moment.duration(seconds, 'seconds').humanize()
      else
        prefix = if -60 < seconds and seconds < 60 then '00:' else ''
        prefix + moment.duration(seconds, 'seconds').format('hh:mm:ss')
    else
      $log.warn 'Unable to format duration', seconds
      '<duration>'

mynumber = ($filter) ->
  (number, round) ->
    mul = 10 ** (if round then round else 0)
    $filter('number') Math.round(number * mul) / mul

rating = ($filter) ->
  (rating, max, withText) ->
    stars = if rating then new Array(Math.floor(rating) + 1).join('★') else ''
    maxStars = if max then new Array(Math.floor(max) - Math.floor(rating) + 1).join('☆') else ''
    text = if withText then ' (' + $filter('mynumber')(rating, 1) + ' / ' + $filter('mynumber')(max, 1) + ')' else ''
    stars + maxStars + text

