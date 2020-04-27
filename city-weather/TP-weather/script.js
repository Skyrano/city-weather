//Programmé par Alistair Rameau

var showed = false; //booléen vrai si les informations supplémentaires sont affichées
var forecastshowed = false; //booléen vrai si la prévision des prochaines heures est affichée
var moreforecastshowed = false; //booléen vrai si les informations supplémentaires des prévisions sont affichées

//Cette fonction récupère la ville donnée et envoie les requêtes pour récupérer les informations météo actuelles et les prévisions
function sendRequest() {
    var name = document.getElementById("ville").value; //on récupère la ville rentrée dans l'élément de la page web
    if (name == "") { // si le champ est vide on prend Nantes comme exemple
        name = "Nantes";
    } 
    var APIKey = "ee07e2bf337034f905cde0bdedae3db8"; //on déclare la clé pour récupérer les données

    //On créé les 2 liens avec lequels on va récupérer les données
    var strReq = "https://api.openweathermap.org/data/2.5/weather?q=" + name.trim() + "&appid=" + APIKey + "&units=metric&lang=fr";
    var strReqForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + name.trim() + "&appid=" + APIKey + "&units=metric&lang=fr";

    //On créé la première requête HTTP en fonction du navigateur utilisé
    if (window.XMLHttpRequest) {  //La plupart des navigateurs
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { //Internet explorer
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else { //si aucune des 2 versions n'est possible alors on averti l'utilisateur
        alert("Navigateur non supporté");
        return;
    }
    
    xhr.open("GET", strReq, true); //On définit la requête avec un GET du premier lien créé précédemment, et on paramètre l'envoi en asymétrique

    xhr.onreadystatechange = function () { //On déclare la fonction lancée lorsque la requête change de statut
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) { //si on recoit une réponse positive
            parsing(xhr.response); //alors on parse la réponse obtenue
        }
        else {//si on obtient une erreur alors on créé un log dans la console avec la statut de la requête
            console.log("Request failed with: " + this.status);
            return;
        }
    }
    xhr.send("null"); //on envoie la première requête qui sera traitée de facon asynchrone


    if (window.XMLHttpRequest) { //on créé la deuxième requête en fonction du navigateur comme pour la première
        xhrforecast = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhrforecast = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else {
        alert("Navigateur non supporté");
        return;
    }

    xhrforecast.open("GET", strReqForecast, true); //On définit la deuxième requête avec le deuxième lien créé pour récupérer les informations de prévision

    xhrforecast.onreadystatechange = function () { //On définit les actions à effectuer en cas de changement de statut de la requête 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            parsingForecast(xhrforecast.response); //Si OK alors on parse la réponse obtenue
        }
        else { //sinon on créé un log dans la console
            console.log("Request failed with: " + this.status);
            return;
        }
    }
    xhrforecast.send("null");//on envoie la deuxième requête qui sera traitée de facon asynchrone
    return;
}

//Cette fonction permet de parser les données en entrée dans le tableau de la météo actuelle
function parsing(received) {
    var data = JSON.parse(received); //on parse les données obtenues au format JSON pour faciliter le traitement
    //On commence par mettre un lien au niveau du nom de la ville avec les coordonnées géographiques données et Google Maps
    document.getElementById("city").innerHTML = "<a href='https://www.google.com/maps/@" + data.coord.lat + "," + data.coord.lon + ",10z' target='_blank'>" + data.name + "</a>";
    //Ensuite on affiche le drapeau du pays dans lequel se situe la ville avec l'information recue et le site flags.fmcdn.net 
    document.getElementById("flag").innerHTML = "<img src=\"http://flags.fmcdn.net/data/flags/w580/" + data["sys"]["country"].toLowerCase() + ".png\" style=\"width:4vw\">";
    //On ajoute la description du temps actuel
    document.getElementById("weather").innerHTML = data.weather[0].description;
    //On ajoute à côté l'icone correspondant à ce temps à l'aide du site openweathermap
    document.getElementById("wicon").innerHTML = "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' style='display: inline; width: 5vw;'></img>";
    //On ajoute ensuite le reste des données obtenues dans les cases correspondantes
    document.getElementById("temp").innerHTML = data.main.temp + " °C";
    document.getElementById("feel").innerHTML = data.main.feels_like + " °C";
    document.getElementById("humidity").innerHTML = data.main.humidity + "%";
    document.getElementById("pressure").innerHTML = data.main.pressure + " hPa";
    document.getElementById("tmin").innerHTML = data.main.temp_min + " °C";
    document.getElementById("tmax").innerHTML = data.main.temp_max + " °C";

    document.getElementById("cityline").className = "showed"; //On affiche les 3 premières lignes du tableau de la météo actuelle
    document.getElementById("weatherline").className = "showed";
    document.getElementById("templine").className = "showed";
    document.getElementById("forecastline").className = "showed"; //Et on affiche la ligne permettant d'afficher les prévisions
}

//Cette fonction permet de parser les données en entrée dans le tableau des prévisions météo
function parsingForecast(received) {
    var data = JSON.parse(received); //on parse les données obtenues au format JSON pour faciliter le traitement
    document.getElementById("foreweather").innerHTML = data.list[0].weather[0].description; //on ajoute la description de la météo prévue et l'icone associée avec le site openweathermap
    document.getElementById("forewicon").innerHTML = "<img src='http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png' style='display: inline; width: 5vw;'></img>";
    //On ajoute ensuite le reste des données reçues dans les cases correspondantes
    document.getElementById("foretemp").innerHTML = data.list[0].main.temp + " °C";
    document.getElementById("forefeel").innerHTML = data.list[0].main.feels_like + " °C";
    document.getElementById("forehumidity").innerHTML = data.list[0].main.humidity + "%";
    document.getElementById("forepressure").innerHTML = data.list[0].main.pressure + " hPa";
    document.getElementById("foretmin").innerHTML = data.list[0].main.temp_min + " °C";
    document.getElementById("foretmax").innerHTML = data.list[0].main.temp_max + " °C";
}

//Cette fonction permet d'afficher les informations supplémentaires de la météo actuelle, ou les cacher si celles-ci sont déja affichées
function displayMore() {
    if (!showed) { //si les informations ne sont pas déja affichées
        document.getElementById("feelline").className = "showed"; //alors on affiche les 5 lignes cachées du premier tableau
        document.getElementById("humiline").className = "showed";
        document.getElementById("pressline").className = "showed";
        document.getElementById("tminline").className = "showed";
        document.getElementById("tmaxline").className = "showed";
        document.getElementById("displaymessage").innerHTML = "Afficher moins"; //et on change le message situé sur la 3eme ligne
        showed = true; //les données supplémentaires sont affichées
    }
    else { //si les données sont déjà affichées
        displayLess(); //alors on cache ces lignes
    }
}

//Cette fonction permet de cacher les informations supplémentaires de la météo actuelle
function displayLess() {
    document.getElementById("feelline").className = "hidden"; //On cache les 5 dernières lignes du premier tableau
    document.getElementById("humiline").className = "hidden";
    document.getElementById("pressline").className = "hidden";
    document.getElementById("tminline").className = "hidden";
    document.getElementById("tmaxline").className = "hidden";
    document.getElementById("displaymessage").innerHTML = "Afficher plus"; //et on change le message situé sur la 3eme ligne
    showed = false; //les données supplémentaires sont cachées
}

//Cette fonction permet d'afficher les prévisions météo si celles-ci ne sont pas déjà affichées, sinon on les cache
function displayForecast() {
    if (!forecastshowed) { //si les prévisions ne sont pas affichées
        document.getElementById("messageforecast").innerHTML = "Masquer la prévision pour les prochaines heures"; //alors on change le message en haut du tableau
        document.getElementById("foreweatherline").className = "showed"; //et on affiche les 2 premières lignes du tableau
        document.getElementById("foretempline").className = "showed";
        forecastshowed = true; //les prévisions sont affichées
    }
    else { //si les prévisions sont déjà affichées
        removeForecast(); //alors on cache les prévisions
    }
}

//Cette fonction permet de cacher les prévisions
function removeForecast() {
    document.getElementById("messageforecast").innerHTML = "Afficher la prévision pour les prochaines heures"; //on change le message affiché
    document.getElementById("foreweatherline").className = "hidden"; //On cache les 2 premières lignes du tableau
    document.getElementById("foretempline").className = "hidden";
    displayLessForecast(); //On cache le reste des lignes du tableau des prévisions
    forecastshowed = false; //les prévisions sont cachées
}

//Cette fonction permet d'afficher les informations supplémentaires des prévisions météo si celles-ci ne sont pas déjà affichées
function displayMoreForecast() {
    if (!moreforecastshowed) {//si les informations supplémentaires ne sont pas affichées
        document.getElementById("forefeelline").className = "showed"; //alors on affiche les 5 dernières lignes du tableau
        document.getElementById("forehumiline").className = "showed";
        document.getElementById("forepressline").className = "showed";
        document.getElementById("foretminline").className = "showed";
        document.getElementById("foretmaxline").className = "showed";
        document.getElementById("foredisplaymessage").innerHTML = "Afficher moins"; //et on change le message de la 3eme ligne
        moreforecastshowed = true; //les informations supplémentaires des prévisions sont affichées
    }
    else { //si les informations sont deja affichées
        displayLessForecast(); //alors on cache les informations supplémentaires de la prévision
    }
}

//Cette fonction cache les informations supplémentaires des prévisions météo
function displayLessForecast() {
    document.getElementById("forefeelline").className = "hidden"; //On cache les 5 dernières lignes du tableau de prévisions
    document.getElementById("forehumiline").className = "hidden";
    document.getElementById("forepressline").className = "hidden";
    document.getElementById("foretminline").className = "hidden";
    document.getElementById("foretmaxline").className = "hidden";
    document.getElementById("foredisplaymessage").innerHTML = "Afficher plus"; //et on change le message de la 3eme ligne
    moreforecastshowed = false; //les informations supplémentaires des prévisions sont cachées
}


//Cette fonction affiche la page home contenant les données méteo
function changeToHome() {
    document.getElementById("homebar").className = "active"; //on met l'onglet home en actif pour changer son apparence
    document.getElementById("contactbar").className = "wait"; //et les 2 autres en attente
    document.getElementById("aboutbar").className = "wait";

    document.getElementById("meteo").className = "showed noselect" //on affiche les données météo en non sélectionnable
    document.getElementById("contact").className = "hidden" //et on cache les page contact et about
    document.getElementById("about").className = "hidden"
}

//Cette fonction affiche la page contact contenant l'adresse mail
function changeToContact() {
    document.getElementById("homebar").className = "wait"; //on définit l'onglet contact en actif et les 2 autres en attente 
    document.getElementById("contactbar").className = "active";
    document.getElementById("aboutbar").className = "wait";

    document.getElementById("meteo").className = "hidden" //on affiche la page de contact avec l'adresse mail et on cache les 2 autres
    document.getElementById("contact").className = "showed"
    document.getElementById("about").className = "hidden"
}

//Cette fonction affiche la page contenant le descriptif du site
function changeToAbout() {
    document.getElementById("homebar").className = "wait";  //on définit l'onglet about comme actif et les 2 autres en attente
    document.getElementById("contactbar").className = "wait";
    document.getElementById("aboutbar").className = "active";
    
    document.getElementById("meteo").className = "hidden"  //on affiche la page about avec le descriptif du site web
    document.getElementById("contact").className = "hidden"
    document.getElementById("about").className = "showed"
}