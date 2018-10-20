// _ = helper functions
let _calculateTimeDistance = (startTime, endTime) => {
	// Bereken hoeveel tijd er tussen deze twee periodes is.
	const start = new Date('0001-01-01 ' + startTime);
	const end = new Date('0001-01-01 ' + endTime);
	// Tip: werk met minuten.
	const startMinutes = (start.getHours() * 60) + start.getMinutes();
	const endMinutes = (end.getHours() * 60) + end.getMinutes();


	return (endMinutes - startMinutes);

}

// Deze functie kan een am/pm tijd omzetten naar een 24u tijdsnotatie, deze krijg je dus al. Alsjeblieft, veel plezier ermee.
let _convertTime = (t) => {
	/* Convert 12 ( am / pm ) naar 24HR */
	let time = new Date('0001-01-01 ' + t);
	let formatted = ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2);
	return formatted;
}

// 5 TODO: maak updateSun functie
let updateSun = (sun, left, bottom, today) => {
	sun.style.left = `${left}%`
	sun.style.bottom = `${bottom}%`
	sun.setAttribute('data-time', ('0' + today.getHours()).slice(-2) + ':' + ('0' + today.getMinutes()).slice(-2));

}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.

	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.


	updateData(totalMinutes, sunrise);

	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector('body').classList.add('isloaded')
	// Vergeet niet om het resterende aantal minuten in te vullen.

	// Nu maken we een functie die de zon elke minuut zal updaten
	let t = setInterval(() => {
		//update sun
		updateData(totalMinutes, sunrise);
	}, 60000)




}
let updateData = (totalMinutes, sunrise) => {
	const myHtml = document.querySelector('html');
	const sun = document.querySelector(".js-sun");
	const minutesLeft = document.querySelector(".js-time-left");
	const today = new Date();
	const sunRise = new Date('0001-01-01 ' + sunrise);

	// Bepaal het aantal minuten dat de zon al op is.
	const minutesSunUp = ((today.getHours() * 60) + today.getMinutes()) - (sunRise.getHours() * 60 + sunRise.getMinutes());

	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	let percentage = (100 / totalMinutes) * minutesSunUp;
	let sunLeft = percentage;
	let sunButton = (percentage < 50) ? (percentage * 2) : (100 - percentage) * 2;

	// Bekijk of de zon niet nog onder of reeds onder is


	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
	updateSun(sun, sunLeft, sunButton, today)

	const sunMinutesLeft = totalMinutes - minutesSunUp



	if (sunMinutesLeft > 0) {
		minutesLeft.innerHTML = sunMinutesLeft
		myHtml.className = "is-day";
	}
	else {
		minutesLeft.innerHTML = 0
		myHtml.className = "is-night";
	}

}
// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	const sunRise = document.querySelector('.js-sunrise');
	const sunSet = document.querySelector('.js-sunset');
	const location = document.querySelector('.js-location');

	const sunRiseValue = _convertTime(queryResponse.astronomy.sunrise);
	const sunSetValue = _convertTime(queryResponse.astronomy.sunset);
	sunRise.innerHTML = sunRiseValue;
	sunSet.innerHTML = sunSetValue;
	location.innerHTML = `${queryResponse.location.city},  ${queryResponse.location.country}`;
	// Hier gaan we een functie oproepen die de zon een bepaalde postie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	placeSunAndStartMoving(_calculateTimeDistance(sunRiseValue, sunSetValue), sunRiseValue);


};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	const ENDPOINT = 'https://query.yahooapis.com/v1/public/yql?q=';
	// en doen we een query met de Yahoo query language
	let query = `select astronomy, location from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text="(${lat},${lon})")`;

	// Met de fetch API proberen we de data op te halen.
	fetch(`${ENDPOINT}${query}&format=json`)
		.then(result => {

			return result.json()
		})
		// Als dat gelukt is, gaan we naar onze showResult functie.
		.then(data => {
			console.log(data);
			showResult(data.query.results.channel)
		})
		.catch(err => { console.log(err) })
}

document.addEventListener('DOMContentLoaded', function () {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
