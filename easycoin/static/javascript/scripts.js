console.log("test")
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
        const User = require('./lib/user')
        const Market = require('./lib/market')
        const Trade = require('./lib/trade')
        const Sockets = require('./lib/websockets')
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

        let signatureResult = Crypto.SHA256('sha256', this.secretKey)
            .update(strForSign)
            .digest('base64')
        let passphraseResult = Crypto.SHA256('sha256', this.secretKey)
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

            var vars = [], hash;
            var hashes = queryObj;
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }

            console.log('?' + vars)

            return '?' + vars
        } else {
            return ''
        }
    }
}

console.log(Kucoin)

function getUrlVars()
{

    return vars;
}