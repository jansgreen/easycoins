import * as kucoins from "./kucoin.js"


// CREAMOS ELEMENTOS DINAMICO DE LOADING

const spinnerLoadBlue = document.getElementById('spinnerLoadingBlue')
const spinnerLoadGreen = document.getElementById('spinnerLoadingGreen')
const spinnerLoadYelow = document.getElementById('spinnerLoadingYelow')


$(document).ready(function () {
    setTimeout(()=>{
        spinnerLoadBlue.classList.add('not-visible')
        spinnerLoadGreen.classList.add('not-visible')
        spinnerLoadYelow.classList.add('not-visible')


    },500);

    setTimeout(()=>{
        document.getElementById('USDList').style.display = "block"
        document.getElementById('EURList').style.display = "block"
        document.getElementById('DOPList').style.display = "block"


    },500)

    
})

const coins = kucoins.kucoins()

console.log("entrando a la consola");
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
   }};