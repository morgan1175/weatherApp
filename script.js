//Constantes globales
const apiKey = '17cf1933e00b0b55212bfcb60cea28c4';
const urlJson = "json/essouvert.json"; //URL du json de la ville
const timeUpdate = 60; //Mise a jour donnees en minutes

// Variables globales
let jsonVille; //fichier Json des coordonnees GPS de la ville
let apiWeatherUrl; //URL de requete a l'API
let jsonMeteo; //fichier Json donnees meteo de la ville
main();
setInterval(main,timeUpdate*60*1000);
function main() {
infoMaj();
//Requete de lecture du fichier JSON de la ville
    fetch(urlJson) 
        .then(response => response.json())
        .then(data=>{
            jsonVille = data;
         weatherApi(jsonVille);
    })
    .catch(error => {
    console.error('Erreur de chargement ville.json'+ error);
    })
}
//Requete à l'API OpenWeatherMap 
function weatherApi(jsonVille) {
    apiWeatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${jsonVille.latitude}&lon=${jsonVille.longitude}&units=metric&lang=fr&appid=${apiKey}`;
    fetch(apiWeatherUrl)
        .then(response=> {
            if(response.status === 200){
                return response.json();  //Conversion de la reponse en fichier json
            } else {
                throw new Error('Echec de requete à l\'API');
            }
        })
        .then(data => {
            jsonMeteo = data;
            dataProcessing(jsonMeteo);
            
        })
        .catch(error => {
            console.error('Erreur:',error);
        })
}
//Traitement et affichage des donnees meteo json
function dataProcessing(jsonMeteo) {
    document.getElementById("city").innerHTML = jsonVille.ville; //affichage ville
    document.getElementById("temp").innerHTML = parseFloat(jsonMeteo.current.temp).toFixed(1)+"°C"; //affichage Temperature
    document.getElementById("description").innerHTML = jsonMeteo.current.weather[0].description;
    document.getElementById("feellike").innerHTML = parseFloat(jsonMeteo.current.feels_like).toFixed(1)+"°C"; //affichage Temperature
    document.getElementById("humidity").innerHTML = parseFloat(jsonMeteo.current.humidity).toFixed(1)+"%"; //affichage Temperature

    //Chargement icone de temps
    let iconCode = jsonMeteo.current.weather[0].icon;
    let weatherIconDiv = document.getElementById("weathericon");
    let iconExist = weatherIconDiv.querySelector('img');
    if (iconExist !== null) {
        weatherIconDiv.removeChild(iconExist);
    }
    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    let iconImg = document.createElement('img')
    iconImg.src = iconUrl;
    weatherIconDiv.appendChild(iconImg);
}
//fonction de verification et affichage des heures de mise à jour
function infoMaj() {
const maintenant = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
const dateEtHeure = maintenant.toLocaleDateString(undefined,options);
document.getElementById("miseajour").innerHTML = "Donnees du "+dateEtHeure;
}   

