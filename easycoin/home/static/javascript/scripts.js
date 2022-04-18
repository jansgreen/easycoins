//import * as kucoins from "./kucoin.js"


// CREAMOS ELEMENTOS DINAMICO DE LOADING


const spinnerLoadGray = document.getElementById('spinnerLoadingGray')
const spinnerLoadBlue = document.getElementById('spinnerLoadingBlue')
const spinnerLoadGreen = document.getElementById('spinnerLoadingGreen')
const spinnerLoadYelow = document.getElementById('spinnerLoadingYelow')


$(document).ready(function () {
    setTimeout(()=>{
        spinnerLoadGray.classList.add('not-visible')
        spinnerLoadBlue.classList.add('not-visible')
        spinnerLoadGreen.classList.add('not-visible')
        spinnerLoadYelow.classList.add('not-visible')


    },500);

    setTimeout(()=>{
        document.getElementById('SymbolList').style.display = "block"
        document.getElementById('USDList').style.display = "block"
        document.getElementById('EURList').style.display = "block"
        document.getElementById('DOPList').style.display = "block"


    },500)

    
})

var myModal = document.getElementById('exampleModal')
// var myInput = document.getElementById('exampleModal')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})
/*



// VARIABLES
var burl = 'https://api.kucoin.com/api/v1/risk/limit/strategy?'
var api_key = "621d6f9927c8800001b3e408"
var api_secret = "7906e97b-853e-4408-af59-79c7ac1c0d76"
var api_passphrase = "624973"
var endPoint = 'risk/limit/strategy?';
var datas = "marginModel=corss"
var data_to_Json = JSON.stringify(datas);

// REST (Account)
// This signed GET request works
var now = Date.now().toString();
var string_to_sign = now + 'GET' + endPoint + data_to_Json


//========================================signature======================
//Encode UFT8
const API_secret_uft8 = CryptoJS.enc.Utf8.stringify(api_secret)
const API_sign_uft8 = CryptoJS.enc.Utf8.stringify(string_to_sign)

// signature 
var signature_Hmac = CryptoJS.HmacSHA256(API_secret_uft8, API_sign_uft8);
var signatureInBase64 = CryptoJS.enc.Base64.stringify(signature_Hmac);


//========================================passphrase======================
const API_passphrase_uft8 = CryptoJS.enc.Utf8.stringify(string_to_sign)


// passphrase 
var passphrase_Hmac = CryptoJS.HmacSHA256(API_secret_uft8, API_passphrase_uft8);
var passphraseInBase64 = CryptoJS.enc.Base64.stringify(passphrase_Hmac);

var headers = {
    "Access-Control-Allow-Origin": '*',
    "KC-API-SIGN": signatureInBase64,
    "KC-API-TIMESTAMP": String(now),
    "KC-API-KEY": api_key,
    "KC-API-PASSPHRASE": passphraseInBase64,
    "KC-API-KEY-VERSION": 2,
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",


}


var urls = burl + datas;
$.ajax({
    type: 'GET',
    url: urls,
    headers: headers,
    data: data_to_Json,
    success: function (data) {
        console.log(data);
    }
});

var url = "http://openapi-v2.kucoin.com/api/v1/risk/limit/strategy?marginModel=corss";

var xhr = new XMLHttpRequest();
xhr.open("POST", url);
xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("KC-API-KEY", "621d6f9927c8800001b3e408");
xhr.setRequestHeader("KC-API-TIMESTAMP", "1547015186532");
xhr.setRequestHeader("KC-API-PASSPHRASE", "QWIxMjM0NTY3OCkoKiZeJSQjQA==");
xhr.setRequestHeader("KC-API-SIGN", "7QP/oM0ykidMdrfNEUmng8eZjg/ZvPafjIqmxiVfYu4=");
xhr.setRequestHeader("KC-API-KEY-VERSION", "2");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }};

var data = '{"ticker:BTC-USDT}';

xhr.send(data);

//var socket = new WebSocket("wss://push1-v2.kucoin.com/api/v1/bullet-public/market/ticker:BTC-USDT");
const token = document.getElementById('Token')
const ConnectID = document.getElementById('ConnectID')
const tokenValue = token.value
const connectValue = ConnectID.value


const connectWel = {
    "id":ConnectID,
    "type":"welcome"
}

const PingSend = {
    "id":"1545910590801",
    "type":"ping"
}

var kucoinConnect = new WebSocket("wss://push1-v2.kucoin.com/endpoint?token="+String(token.value)+"&[connectId="+String(ConnectID.value)+connectWel+"]");
kucoinConnect.onopen = function (event) {
    kucoinConnect.send(PingSend);
  };

  kucoinConnect.onmessage = function (event) {
    console.log(event.data);
  }


const WS = WebSocket


fetch('http://openapi-v2.kucoin.com/api/v1/deposit-addresses', {
  body: "{currency:BTC}",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json",
    "Kc-Api-Key": "621d6f9927c8800001b3e408",
    "Kc-Api-Key-Version": "2",
    "Kc-Api-Passphrase": "624973",
    "Kc-Api-Sign": "7QP/oM0ykidMdrfNEUmng8eZjg/ZvPafjIqmxiVfYu4=",
    "Kc-Api-Timestamp": "1547015186532"
  },
  method: "POST"
}) 

fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data));

.then((resp) => console.log(resp.json()))
.then(function(data) {
    console.log(data);
  let authors = data.results;
  return authors.map(function(author) {
    let li = createNode('li');
    let img = createNode('img');
    let span = createNode('span');
    img.src = author.picture.medium;
    span.innerHTML = `${author.name.first} ${author.name.last}`;
    append(li, img);
    append(li, span);
    append(ul, li);
  })



const coins = kucoins.kucoins()

//console.log("entrando a la consola");
console.log(coins);
console.log("entrando a la consola");

var url = "https://api-sandbox.circle.com/v1/banks/wires";

var xhr = new XMLHttpRequest();
xhr.open("POST", url);

xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-type", "application/json");
xhr.setRequestHeader("Authorization", "Bearer ${YOUR_API_KEY}");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }};*/