// Wait for the DOM to fully load before executing the script
console.log("script started");
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
    // Check API version support
    if (!tg.isVersionAtLeast("8.0")) {
      console.error("Home Screen Shortcut API is not supported on this device.");
      return;
    } else {
      console.log("Home Screen Shortcut API is supported!");
    }

    // Mark the Mini App as ready
    tg.ready();

    if (!tg.isVersionAtLeast("8.0")) {
      console.error("Home Screen Shortcut API is not supported on this device.");
    }

    // Get the start_param from Telegram WebApp
    const startParam = tg.initDataUnsafe?.start_param || "No start_param available";
    console.log (startParam);

    // Get and parse the initialization data provided by Telegram
    const initData = tg.initData || "No Telegram Data available";
    console.log (JSON.stringify(parseTelegramInitData(initData), null, 2));

    // Check the home screen status using a callback
    tg.checkHomeScreenStatus((status) => {
      console.log(`Home Screen Status (Callback): ${status}`);

      if (status === "unsupported") {
        statusElement.textContent = "Home Screen shortcuts are not supported on this device.";
      } else if (status === "unknown") {
        statusElement.textContent = "The shortcut status is unknown.";
      } else if (status === "added") {
        statusElement.textContent = "Shortcut already added to Home Screen.";
      } else if (status === "missed") {
        statusElement.textContent = "Shortcut not yet added. Tap on the menu to add.";
      } else {
        statusElement.textContent = `Unexpected Status: ${status}`;
      }
    });

    // Optionally prompt the user to add the Mini App to the home screen
    tg.onEvent("homeScreenAdded", () => {
      statusElement.textContent = "Shortcut added to Home Screen successfully!";
      console.log("Home Screen Shortcut added!");
    });
  } else {
    // Handle case where Telegram WebApp API is not available
    console.log("Telegram WebApp is not available.");
  }
});

/**
 * Parses the Telegram initialization data string into a readable object.
 * @param {string} initData - The raw initialization data string from Telegram.
 * @returns {object} A parsed object containing the Telegram initialization data.
 */
function parseTelegramInitData(initData) {
  const parsedData = {};

  // Convert the initData string into key-value pairs
  const params = new URLSearchParams(initData);

  // Loop through each parameter and decode its value
  params.forEach((value, key) => {
    try {
      // Attempt to parse JSON-encoded values
      parsedData[key] = JSON.parse(decodeURIComponent(value));
    } catch {
      // Fallback for non-JSON values
      parsedData[key] = decodeURIComponent(value);
    }
  });

  return parsedData;
}

function SendResult() {
	console.log ("sending result");
	const formData = new FormData();
	const tg = window.Telegram.WebApp;
	
	var telegram_id = tg.initDataUnsafe.user.id;
	formData.append("telegram_id", telegram_id);
	formData.append("score", score);
	
	try {
    const response = await fetch("https://telegramwebglbackend-production.up.railway.app/api/score", {
      method: "POST",
      body: formData,
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
};
	
}

