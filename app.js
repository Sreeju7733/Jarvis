// Get elements from the DOM
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
let jarvis_t = document.getElementById('jarvis_t');




// Function to update date and time
function updateTimeAndDate() {
    // Get the current date and time
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure minutes are always two digits
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Adjust hours for 12-hour clock
    const day = now.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdayNames[now.getDay()];

    // Combine the formatted components into the desired string
    const formattedTimeAndDate = `${hours}:${minutes} ${amPm} ${day} ${month} ${year}, ${weekday}`;

    // Update the paragraph element with the formatted time and date
    document.getElementById('dateandtime').textContent = formattedTimeAndDate;
}
// Function to check internet connectivity
function checkConnectivity() {
    const online = navigator.onLine;
    if (online) {
        document.getElementById('internet-on').style.display = 'block';
        document.getElementById('internet-off').style.display = 'none';
    } else {
        document.getElementById('internet-on').style.display = 'none';
        document.getElementById('internet-off').style.display = 'block';
    }
}

// Initial display
updateTimeAndDate();
checkConnectivity();

// Update time and date and Check connectivity status every 5 second
setInterval(updateTimeAndDate, 5000);
setInterval(checkConnectivity, 5000);
// Function  to update battery status
function updateBatteryInfo(battery) {
    const statusElement = document.getElementById('battery-status');
    const charging = battery.charging;
    const percentage = Math.round(battery.level * 100) + "%";

    // Define icons based on charging status
    const iconClass = charging ? "bolt" : "battery-empty";
    const iconHTML = `<i class="fas fa-${iconClass}"></i>`;

    // Display battery status with icons
    statusElement.innerHTML = `${iconHTML} Battery: ${percentage}, ${charging ? 'Charging' : 'Not Charging'}`;
}

navigator.getBattery().then((battery) => {
    updateBatteryInfo(battery);

    // Update battery status every 5 seconds
    setInterval(() => {
        updateBatteryInfo(battery);
    }, 5000);

    battery.addEventListener('chargingchange', () => {
        updateBatteryInfo(battery);
    });

    battery.addEventListener('levelchange', () => {
        updateBatteryInfo(battery);
    });
});





// Function to speak given text
function speak(text) {
	
    const text_speak = new SpeechSynthesisUtterance(text);
	jarvis_t.textContent = text;
	

    // Speech synthesis settings
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Boss...");
    } else {
        speak("Good Evening Sir...");
    }
}


window.addEventListener('load', () => {
    speak("Initializing JARVIS..");
	var audio = new Audio(src);
	audio.play('power up.mp3');
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = async (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    await processCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});


const OPENAI_API_KEY = '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'; // Replace with your actual OpenAI API key
const OPENWEATHER_API_KEY = '48ddfe8c9cf29f95b7d0e54d6e171008'; // Replace with your OpenWeatherMap API key

async function askOpenAI(prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 50, // Adjust token count as needed
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].text.trim();
        } else {
            throw new Error('Failed to fetch response from OpenAI');
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (response.ok) {
            const data = await response.json();
            const weatherDesc = data.weather[0].description;
            const temperature = data.main.temp;
            return `The weather in ${city} is currently ${weatherDesc} with a temperature of ${temperature} degrees Celsius.`;
        } else {
            throw new Error('Failed to fetch weather information');
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error while fetching weather information.';
    }
}

async function processCommand(message) {
    const speech = new SpeechSynthesisUtterance();
    let finalText = '';

    // Check for AI-related commands
    if (message.includes('ask gpt')) {
        const prompt = message.replace('ask gpt', '').trim();
        finalText = await askOpenAI(prompt);
    }

    // Check for weather-related commands
    else if (message.includes('weather in')) {
        const city = message.split('weather in')[1].trim();
        finalText = await fetchWeather(city);
    }

	// Basic
    else if (message.includes('hey') || message.includes('hello') || message.includes('hi')) {
        finalText = "Hello Boss";
    }
	else if (message.includes('how are you')) {
        finalText = "I am fine boss, tell me how can I help you?";
	}
	else if (message.includes('fuck you')) {
        finalText = "Fuck you";
	}
	else if (message.includes('who are you')) {
			var audio = new Audio(src);
			audio.play('jarvis.mp3');
	}
	else if (message.includes('do you know who am i')) {
        finalText = "Yep got it You're the boss Sreeju";
    }
	else if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        finalText = "Opening Google";
    }
	else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        finalText = `The time is ${time}`;
    }
	else if (message.includes('date')) {
        const date = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        finalText = `Today is ${date}`;
    }
	else if (message.includes('day of the week')) {
        const dayOfWeek = new Date().toLocaleDateString(undefined, { weekday: 'long' });
        finalText = `Today is ${dayOfWeek}`;
    }
	else if (message.includes('news')) {
        finalText = await fetchNews();
    }
	else if (message.includes('calculate')) {
        const expression = message.replace('calculate', '').trim();
        try {
            const result = eval(expression); // Caution: using eval - consider safer alternatives for production
            finalText = `The result is ${result}`;
        } catch (error) {
            finalText = "Sorry, I couldn't calculate that.";
        }
    }
	else if (message.includes('open website')) {
        const url = message.split('open website')[1].trim();
        window.open(`https://${url}`, "_blank");
        finalText = `Opening ${url}`;
    }
	else if (message.includes('search')) {
        const searchTerm = message.replace('search', '').trim();
        window.open(`https://www.google.com/search?q=${searchTerm}`, "_blank");
        finalText = `Searching for ${searchTerm} on Google`;
    }
	else if (message.includes('my location')) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const locationResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                if (locationResponse.ok) {
                    const locationData = await locationResponse.json();
                    finalText = `You are currently in ${locationData.city}, ${locationData.countryName}`;
                } else {
                    throw new Error('Failed to fetch location information');
                }
            });
        } else {
            finalText = "Geolocation is not supported in your browser.";
        }
    }
	else if (message.includes('set a reminder')) {
        // Code to set a reminder, possibly using browser notifications or other reminder services
        finalText = "Reminder set successfully!";
    }
	else if (message.includes('send email')) {
        // Code to send an email or open a draft in a mail client
        // Example code using mailto (opens default email client)
        const email = message.split('send email')[1].trim();
        window.open(`mailto:${email}`);
        finalText = `Opening email client to send an email to ${email}`;
    }
	else if (message.includes('call')) {
        // Code to send an email or open a draft in a mail client
        // Example code using mailto (opens default email client)
        const email = message.split('call')[1].trim();
        window.open(`mailto:${email}`);
        finalText = `Opening email client to send an email to ${email}`;
    }
	else {
		speech.text = finalText || "I did not understand what you said. Please try again.";
	}
 
    speech.volume = 1;
    speech.pitch = 1;
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}
