// Wait for the DOM to fully load before executing the script
console.log("script started");
var scoreValue = 0;
document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements where data will be displayed
  const startAppElement = document.getElementById("startapp-param");
  const telegramDataElement = document.getElementById("telegram-data");
  const versionSupportElement = document.getElementById("version-support-status");
  const statusElement = document.getElementById("home-screen-status");
  console.log("script loaded");
  // Check if Telegram WebApp API is available
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
	document.getElementById("Send").addEventListener("click", SendResult, false);
	document.getElementById("Get").addEventListener("click", ShowTopTen, false);
	document.getElementById("Store").addEventListener("click", BuyStars, false);

    // Mark the Mini App as ready
    tg.ready();
  }
});

async function SendResult() {
	console.log ("sending result");
	const tg = window.Telegram.WebApp;
	var telegram_id = tg.initDataUnsafe.user.id;
	var score = scoreValue;
	
	const formData = new FormData();
	formData.append("telegram_id", telegram_id);
	formData.append("score", score);

    try {
        const response = await fetch('https://telegramwebglbackend-production.up.railway.app/api/score', { 
            method: 'POST',
            body: formData, 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function ShowTopTen() {
	console.log ("getting result");
	
	const formData = new FormData();


    try {
        const response = await fetch('https://telegramwebglbackend-production.up.railway.app/api/top', { 
            method: 'GET', 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
		alert("Топ:10: " + result);
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

function BuyStars() {
	alert("оплата-заглушка");
}

function SetScoreValue(number)
{
	scoreValue = number;
	console.log(scoreValue);
}
