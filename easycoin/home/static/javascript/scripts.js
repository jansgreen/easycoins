// Cicle
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