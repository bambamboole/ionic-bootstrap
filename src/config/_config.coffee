Config = do ->
  'use strict'
  cfg =
    appVersion: '~'
    debug: true
    verbose: true
    track: false
    storage: true
    storagePrefix: 'app-'
    emailSupport: 'exemple@mail.com'
    backendUrl: 'data'
    parse:
      applicationId: ''
      restApiKey: ''
    gcm:
      senderID: '263462318850'
      apiServerKey: 'AIzaSyDzM4XzyW9HWJNol9OePz4cAXi7QbVANOs'
  return cfg

