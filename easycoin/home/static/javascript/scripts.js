const config = {
  apiKey: '621d6f9927c8800001b3e408',
  secretKey: '7906e97b-853e-4408-af59-79c7ac1c0d76',
  passphrase: '624973',
//  environment: 'live'
}


var token = $("#TokenId").val();
var connectId = $("#connectId").val();


urlSocket = "wss://ws-api.kucoin.com/endpoint/token="+token+"&[connectId="+connectId+"]"

let socket = new WebSocket(urlSocket);

socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  socket.send(
    {
      "id": connectId,
      "type": "subscribe",
      "topic": "/market/ticker:BTC-USDT",
      "response": true
  }
  );
};

socket.onmessage = function(event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.log();(`[error] ${error.message}`);
};

function URLbase(config) {
  let url = ''
  if (config.environment === 'live') {
      url = 'https://api.kucoin.com'
  } else {
      url = 'https://openapi-sandbox.kucoin.com'
  }
  this.environment = config.environment
  this.baseURL = url
  this.secretKey = config.secretKey
  this.apiKey = config.apiKey
  this.passphrase = config.passphrase

}

function name(params) {
  
}




// Promise based approach for getting account information (private & signed)

  
  // Async/Await get account info example (private & signed)
  


  const Kucoin = {
    init: function(config) {
        let url = ''
        if (config.environment === 'live') {
            url = 'https://api.kucoin.com'
        } else {
            url = 'https://openapi-sandbox.kucoin.com'
        }
        this.environment = config.environment
        this.baseURL = url
        this.secretKey = config.secretKey
        this.apiKey = config.apiKey
        this.passphrase = config.passphrase

    },
    sign: function(endpoint, params, method) {
        let header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let nonce = Date.now() + ''
        let strForSign = ''
        if (method === 'GET' || method === 'DELETE') {
            strForSign = nonce + method + endpoint + this.formatQuery(params)
        } else {
            strForSign = nonce + method + endpoint + JSON.stringify(params)
        }
        let signatureResult = CryptoJS.SHA512(this.secretKey)
            .update(strForSign)
            .digest('base64')
        let passphraseResult = CryptoJS.SHA512(this.secretKey)
            .update(this.passphrase)
            .digest('base64')
        header.headers['KC-API-SIGN'] = signatureResult
        header.headers['KC-API-TIMESTAMP'] = nonce
        header.headers['KC-API-KEY'] = this.apiKey
        header.headers['KC-API-PASSPHRASE'] = passphraseResult
        header.headers['KC-API-KEY-VERSION'] = 2
        return header
    },
    formatQuery: function(queryObj) {
        if (JSON.stringify(queryObj).length !== 2) {
            return '?' + qs.stringify(queryObj)
        } else {
            return ''
        }
    }
}

const api = Kucoin

api.init(config)



const ws = WebSocket

const Sockets = {}
Sockets.ws = {}
Sockets.heartbeat = {}

getPublicWsToken = async function(baseURL) {
  let endpoint = '/api/v1/bullet-public'
  let url = baseURL + endpoint
  let result = await fetch.post(url, {})
  return result.data
}

getPrivateWsToken = async function(baseURL, sign) {
  let endpoint = '/api/v1/bullet-private'
  let url = baseURL + endpoint
  let result = await fetch.post(url, {}, sign)
  return result.data
}

getSocketEndpoint = async function(type, baseURL, environment, sign) {
  let r
  if (type == 'private') {
    r = await getPrivateWsToken(baseURL, sign)
  } else { 
    r = await getPublicWsToken(baseURL)
  }
  let token = r.data.token
  let instanceServer = r.data.instanceServers[0]

  if(instanceServer){
    if (environment === 'sandbox') {
      return `${instanceServer.endpoint}?token=${token}&[connectId=${Date.now()}]`
    } else if (environment === 'live') {
      return `${instanceServer.endpoint}?token=${token}&[connectId=${Date.now()}]`
    }
  }else{
    throw Error("No Kucoin WS servers running")
  }
}

/*  
  Initiate a websocket
  params = {
    topic: enum 
    symbols: array [optional depending on topic]
  }
  eventHanlder = function
*/
Sockets.initSocket = async function(params, eventHandler) {
  try {
    if ( !params.sign ) params.sign = false;
    if ( !params.endpoint ) params.endpoint = false;
    let [topic, endpoint, type] = Sockets.topics( params.topic, params.symbols, params.endpoint, params.sign )
    let sign = this.sign('/api/v1/bullet-private', {}, 'POST')
    let websocket = await getSocketEndpoint(type, this.baseURL, this.environment, sign)
    let ws = new WebSocket(websocket)
    Sockets.ws[topic] = ws
    ws.on('open', () => {
      console.log(topic + ' opening websocket connection... ')
      Sockets.subscribe(topic, endpoint, type, eventHandler)
      Sockets.ws[topic].heartbeat = setInterval(Sockets.socketHeartBeat, 20000, topic)
    })
    ws.on('error', (error) => {
      Sockets.handleSocketError(error)
      console.log(error)
    })
    ws.on('ping', () => {
      return
    })
    ws.on('close', () => {
      clearInterval(Sockets.ws[topic].heartbeat)
      console.log(topic + ' websocket closed...')
    })
  } catch (err) {
    console.log(err)
  }
}

Sockets.handleSocketError = function(error) {
  console.log('WebSocket error: ' + (error.code ? ' (' + error.code + ')' : '') +
  (error.message ? ' ' + error.message : ''))
}

Sockets.socketHeartBeat = function(topic) {
  let ws = Sockets.ws[topic]
  ws.ping()
}

Sockets.subscribe = async function(topic, endpoint, type, eventHandler) {
  let ws = Sockets.ws[topic]
  if (type === 'private') {
    ws.send(JSON.stringify({
      id: Date.now(),
      type: 'subscribe',
      topic: endpoint,
      privateChannel: true,
      response: true
    }))
  } else {
    ws.send(JSON.stringify({
      id: Date.now(),
      type: 'subscribe',
      topic: endpoint,
      response: true
    }))
  }
  ws.on('message', eventHandler)
}

Sockets.unsubscribe = async function(topic, endpoint, type, eventHandler) {
  let ws = Sockets.ws[topic]
  ws.send(JSON.stringify({
    id: Date.now(),
    type: 'unsubscribe',
    topic: endpoint,
    response: true
  }))
  ws.on('message', eventHandler)
}

Sockets.topics = function( topic, symbols = [], endpoint = false, sign = false ) {
    if ( endpoint ) return [topic, endpoint + ( symbols.length > 0 ? ':' : '' ) + symbols.join( ',' ), sign ? 'private' : 'public']
    if ( topic === 'ticker' ) {
        return [topic, "/market/ticker:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'allTicker' ) {
        return [topic, "/market/ticker:all", 'public']
    } else if ( topic === 'symbolSnapshot' ) {
        return [topic, "/market/snapshot:" + symbols[0], 'public']
    } else if ( topic === 'marketSnapshot' ) {
        return [topic, "/market/snapshot:" + symbols[0], 'public']
    } else if ( topic === 'orderbook' ) {
        return [topic, "/market/level2:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'match' ) {
        return [topic, "/market/match:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'fullMatch' ) {
        return [topic, "/spotMarket/level3:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'orders' ) {
        return [topic, "/spotMarket/tradeOrders", 'private']
    } else if ( topic === 'balances' ) {
        return [topic, "/account/balance", 'private']
    } else if ( topic === 'depth50' ) {
        return [topic, "/spotMarket/level2Depth50:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'depth5' ) {
        return [topic, "/spotMarket/level2Depth5:" + symbols.join( ',' ), 'public']
    }
}


class User{
  

/* 
  List Accounts
  GET /api/v1/accounts
  params = {
    currency: string [optional]
    type: string [optional]
  }
*/
getAccounts = async function(params = {}) {
  let endpoint = '/api/v1/accounts'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Account
  GET /api/v1/accounts/<accountId>
  params {
    id: accountId
  }
*/
getAccountById = async function(params) {
  let endpoint = '/api/v1/accounts/' + params.id
  delete params.id
  let url = this.baseURL + endpoint
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Create Account
  POST /api/v1/accounts
  params = {
    type: string ['main' || 'trade']
    currency: string
  }
*/
createAccount = async function(params) {
  let endpoint = '/api/v1/accounts'
  let url = this.baseURL + endpoint
  let result = await fetch.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/*  
  Get Account Ledgers
  GET /api/v1/accounts/<accountId>/ledgers
  params = {
    id: string
    startAt: long (unix time)
    endAt: long (unix time)
  }
*/
getAccountLedgers = async function(params) {
  let endpoint = `/api/v1/accounts/${params.id}/ledgers`
  delete params.accountId
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Holds
  GET /api/v1/accounts/<accountId>/holds
  params = {
    id: string
  }
*/
getHolds = async function(params) {
  let endpoint = `/api/v1/accounts/${params.id}/holds`
  delete params.id
  let url = this.baseURL + endpoint
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/*  
  Inner Transfer
  POST /api/accounts/inner-transfer
  params = {
    clientOid: string
    currency: string,
    from: string
    to: string
    amount: string
  }
*/
innerTransfer = async function(params) {
  let endpoint = '/api/v2/accounts/inner-transfer'
  let url = this.baseURL + endpoint
  let result = await fetch.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/*  
  Create Deposit Address
  POST /api/v1/deposit-addresses
  params = {
    currency: string
  }
*/
createDepositAddress = async function(params) {
  let endpoint = '/api/v1/deposit-addresses'
  let url = this.baseURL + endpoint
  let result = await fetch.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/* 
  Get Deposit Address
  GET /api/v1/deposit-addresses?currency=<currency>
  params = {
    currency: string
  }
*/
getDepositAddress = async function(params) {
  let endpoint = `/api/v2/deposit-addresses?currency=${params.currency}`
  delete params.currency
  let url = this.baseURL + endpoint
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Repay Record
  GET /api/v1/margin/borrow/outstanding
  params = {
    currency: string [optional]
    currentPage: string [optional (default 1)]
    pageSize: string [optional (default 50)]
  }
*/
getRepayRecord = async function(params = {}) {
  let endpoint = `/api/v1/margin/borrow/outstanding`
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}


/* 
  Get Deposit List
  GET /api/v1/deposits
  params = {
    currency: string [optional]
    startAt: long (unix time)
    endAt: long (unix time)
    status: string [optional]
  }
*/
getDepositList = async function(params = {}) {
  let endpoint = '/api/v1/deposits'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Margin Account
  GET /api/v1/margin/account
*/
getMarginAccount = async function() {
  const endpoint = '/api/v1/margin/account'
  const url = this.baseURL + endpoint
  const result = await fetch.get(url, this.sign(endpoint, "", 'GET'))
  return result.data
}

/*  
  Get Withdrawals List
  GET /api/v1/withdrawals
  params = {
    currency: string [optional]
    startAt: long (unix time)
    endAt: long (unix time)
    status: string [optional]
  }
*/
getWithdrawalsList = async function(params = {}) {
  let endpoint = '/api/v1/withdrawals'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Withdrawal Quotas
  GET /api/v1/withdrawals/quotas
  params = {
    currency: string
  }
*/
getWithdrawalQuotas = async function(params) {
  let endpoint = '/api/v1/withdrawals/quotas'
  let url = this.baseURL + endpoint  + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Apply Withdrawal
  POST /api/v1/withdrawals
  params = {
    currency: string
    address: string
    amount: number
    memo: string [optional]
    isInner: boolean [optional]
    remark: string [optional]
  }
*/
applyForWithdrawal = async function(params) {
  let endpoint = '/api/v1/withdrawals'
  let url = this.baseURL + endpoint
  let result = await fetch.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/* 
  Cancel Withdrawal
  DELETE /api/v1/withdrawls/<withdrawlId>
  params = {
    withdrawalId: string
  }
*/
cancelWithdrawal = async function(params) {
  let endpoint = '/api/v1/withdrawls/' + params.withdrawalId
  delete params.withdrawalId
  let url = this.baseURL + endpoint
  let result = await fetch.delete(url, this.sign(endpoint, params, 'DELETE'))
  return result.data
}

/* 
  Get V1 Historical Withdrawals List
  GET /api/v1/hist-withdrawals
  params = {
    currentPage: integer [optional]
    pageSize: integer [optional]
    currency: string [optional - currency code]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    status: string [optional] Available value: PROCESSING, SUCCESS, and FAILURE
  }
*/
getV1HistoricalWithdrawals = async function(params) {
  let endpoint = '/api/v1/hist-withdrawals'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get V1 Historical Deposits List
  GET /api/v1/hist-deposits
  params = {
    currentPage: integer [optional]
    pageSize: integer [optional]
    currency: string [optional - currency code]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    status: string [optional] Available value: PROCESSING, SUCCESS, and FAILURE
  }
*/
getV1HistoricalDeposits = async function(params) {
  let endpoint = '/api/v1/hist-deposits'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}
}

userInf = new User()

function getAccounts() {
  try {
    let r = Kucoin.userInf.getV1HistoricalDeposits()
    console.log(r.data)
  } catch(err) {
    console.log(err)
  } 
}
test = getAccounts()
test

const Trade = {}

/* 
  Place a new order
  POST /api/v1/orders
  Details for market order vs. limit order and params see https://docs.kucoin.com/#place-a-new-order
  General params
  params = {
    clientOid: string
    side: string ['buy' || 'sell]
    symbol: string
    type: string [optional, default: limit]
    remark: string [optional]
    stop: string [optional] - either loss or entry and needs stopPrice
    stopPrice: string [optional] - needed for stop 
    stp: string [optional] (self trade prevention)
    price: string,
    size: string,
    timeInForce: string [optional, default is GTC]
    cancelAfter: long (unix time) [optional]
    hidden: boolean [optional]
    Iceberg: boolean [optional]
    visibleSize: string [optional]
  }
*/
Trade.placeOrder = async function(params) {
  let endpoint = '/api/v1/orders'
  let url = this.baseURL + endpoint
  let result = await fetch.post(url, params, this.sign(endpoint, params,'POST'))
  return result.data
}

/* 
  Cancel an order
  DELETE /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
Trade.cancelOrder = async function(params) {
  let endpoint = '/api/v1/orders/' + params.id 
  delete params.id
  let url = this.baseURL + endpoint
  let result = await fetch.delete(url, this.sign(endpoint, params, 'DELETE'))
  return result.data
}

/* 
  Cancel all orders
  DELETE /api/v1/orders
  params = {
    symbol: string [optional]
  }
*/
Trade.cancelAllOrders = async function(params) {
  let endpoint = '/api/v1/orders'
  let url = this.baseURL + endpoint
  let result = await fetch.delete(url, this.sign(endpoint, params, 'DELETE'))
  return result.data
}

/* 
  List orders
  GET /api/v1/orders
  params = {
    status: string [optional, default: dealt, alt: active]
    symbol: string [optional]
    side: string [optional, 'buy' || 'sell]
    type: string [optional, limit || limit_stop || market_stop]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
  }
*/
Trade.getOrders = async function(params = {}) {
  let endpoint = '/api/v1/orders' 
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get an order
  GET /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
Trade.getOrderById = async function(params) {
  let endpoint = '/api/v1/orders/' + params.id
  delete params.id
  let url = this.baseURL + endpoint
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  List Fills
  GET /api/v1/fills
  params: {
    orderId: string [optional]
    symbol: string [optional]
    side: string [optional, 'buy' || 'sell]
    type: string [optional]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
  }
*/
Trade.listFills = async function(params = {}) {
  let endpoint = '/api/v1/fills'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  List Your Recent Fills: max 1000 fills in the last 24 hours, all symbols
  GET /api/v1/limit/fills
*/
Trade.recentFills = async function( params = {} ) {
  let endpoint = '/api/v1/limit/fills'
  let url = this.baseURL + endpoint + this.formatQuery( params )
  let result = await fetch.get( url, this.sign( endpoint, params, 'GET' ) )
  return result.data
}

/* 
  Get V1 Historical Orders List
  GET /api/v1/hist-orders
  params: {
    currentPage: integer [optional]
    pageSize: integer [optional]
    symbol: string [optional]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    side: string (buy || sell) [optional]
  }
*/
Trade.getV1HistoricalOrders = async function(params = {}) {
  let endpoint = '/api/v1/hist-orders'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

const Market = {}

/* 
  Get Symbols List
  GET /api/v1/symbols
  market = string [optional]
*/
Market.getSymbols = async function(market = "") {
  let endpoint = ""
  if (market != "") {
    endpoint = `/api/v1/symbols?market=${market}`
  } else {
    endpoint = "/api/v1/symbols"
  }
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/*  
  Get Ticker
  GET /api/v1/market/orderbook/level1?symbol=<symbol>
  symbol = string
*/
Market.getTicker = async function(symbol) {
  let endpoint = `/api/v1/market/orderbook/level1?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get All Tickers
  GET /api/v1/market/allTickers
*/
Market.getAllTickers = async function() {
  let endpoint = '/api/v1/market/allTickers'
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get 24hr Stats
  GET /api/v1/market/stats?symbol=<symbol>
  symbol = string
*/
Market.get24hrStats = async function(symbol) {
  let endpoint = `/api/v1/market/stats?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Market List
  GET /api/v1/markets
*/
Market.getMarketList = async function() {
  let endpoint = '/api/v1/markets'
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Part Order Book (aggregated) 
  GET /api/v1/market/orderbook/level2_20?symbol=<symbol>
  GET /api/v1/market/orderbook/level2_100?symbol=<symbol>
  params = {
    amount: integer (20 || 100) 
    symbol: string
  }
*/
Market.getPartOrderBook = async function(params) {
  let endpoint = `/api/v1/market/orderbook/level2_${params.amount}?symbol=${params.symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Full Order Book (aggregated)
  GET /api/v1/market/orderbook/level2?symbol=<symbol>
  symbol = string
*/
Market.getOrderBook = async function(symbol) {
  let endpoint = `/api/v1/market/orderbook/level2?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Full Order Book (aggregated)
  GET /api/v2/market/orderbook/level2?symbol=<symbol> 
  symbol = string
*/
Market.getFullOrderBook = async function(symbol) {
  let endpoint = `/api/v3/market/orderbook/level2?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Full Order Book (atomic) 
  GET /api/v1/market/orderbook/level3?symbol=<symbol>
  symbol = string
*/
Market.getFullOrderBookAtomic = async function(symbol) {
  let endpoint = `/api/v3/market/orderbook/level3?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Trade Histories
  GET /api/v1/market/histories?symbol=<symbol>
  symbol = string
*/
Market.getTradeHistories = async function(symbol) {
  let endpoint = `/api/v1/market/histories?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Klines
  GET /api/v1/market/candles?symbol=<symbol>
  params = {
    symbol: string
    startAt: long (unix time)
    endAt: long (unix time)
    type: enum [1min, 3min, 5min, 15min, 30min, 1hour, 2hour, 4hour, 6hour, 8hour, 12hour 1day, 1week]
  }
*/
Market.getKlines = async function(params) {
  let endpoint = '/api/v1/market/candles'
  params.startAt = params.startAt.toString().slice(0, 10)
  params.endAt = params.endAt.toString().slice(0, 10)
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get currencies
  GET /api/v1/currencies
*/
Market.getCurrencies = async function() {
  let endpoint = '/api/v1/currencies'
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get currency detail
  GET /api/v1/currencies/{currency}
  currency = string
*/
Market.getCurrency = async function(currency) {
  let endpoint = `/api/v1/currencies/${currency}`
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}

/* 
  Get Fiat Price
  GET /api/v1/prices
  params = {
    base: string (e.g. 'USD') [optional]
    currencies: array
  }
*/
Market.getFiatPrice = async function(params) {
  let endpoint = '/api/v1/prices'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await fetch.get(url)
  return result.data
}

/* 
  Server Time
  GET /api/v1/timestamp
*/
Market.getServerTime = async function() {
  let endpoint = '/api/v1/timestamp'
  let url = this.baseURL + endpoint
  let result = await fetch.get(url)
  return result.data
}
