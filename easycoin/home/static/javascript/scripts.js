const api = require('user')

const config = {
  apiKey: 'xXXXXXXXXXXXXXXXXXXXXxxxxxxxxxxxxxxxxxxxxxXXX',
  secretKey: 'xxxxxxxxXXXXXXXXXXXXXxxXXXXXXXXXXXXXxxxXXX',
  passphrase: 'xxxxxx',
  environment: 'live'
}

api.init(config)

// Promise based approach for getting account information (private & signed)

  
  // Async/Await get account info example (private & signed)
  async function getAccounts() {
    try {
      let r = await api.getAccounts()
      console.log(r.data)
    } catch(err) {
      console.log(err)
    } 
  }