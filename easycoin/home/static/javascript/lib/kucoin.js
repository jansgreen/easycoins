import {user} from "./lib"
import {trade} from "./lib"
import {websockets} from "./lib"
import {market} from "./lib"


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
        const User = require(user)
        const Market = require(market)
        const Trade = require(trade)
        const Sockets = require(websockets)
        Object.assign(this, User, Market, Trade, Sockets)
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

module.exports = Kucoin