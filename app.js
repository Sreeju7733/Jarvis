// // Get elements from the DOM
const btn = document.querySelector('.talk'); // Select the button element for speech recognition
const content = document.querySelector('.content'); // Select the content area for displaying speech input
const jarvis_t = document.getElementById('jarvis_t'); // Select the element to display Jarvis' speech output





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
    const internetOn = document.getElementById('internet-on');
    const internetOff = document.getElementById('internet-off');

    // Display the appropriate internet connectivity indicator
    if (online) {
        internetOn.style.display = 'block'; // Show 'Internet On' indicator
        internetOff.style.display = 'none'; // Hide 'Internet Off' indicator
    } else {
        internetOn.style.display = 'none'; // Hide 'Internet On' indicator
        internetOff.style.display = 'block'; // Show 'Internet Off' indicator
    }
}

// Initial display of time, date, and internet connectivity
updateTimeAndDate();
checkConnectivity();

// Update time and date, and check connectivity status every 5 seconds
setInterval(updateTimeAndDate, 5000);
setInterval(checkConnectivity, 5000);






// Function to update battery status
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





// Get battery information and update status
navigator.getBattery().then((battery) => {
    updateBatteryInfo(battery);

    // Update battery status every 5 seconds
    setInterval(() => {
        updateBatteryInfo(battery);
    }, 5000);

    // Event listeners for battery status changes
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
    jarvis_t.textContent = text; // Display the spoken text in the designated element

    // Speech synthesis settings
    text_speak.rate = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak); // Speak the provided text
}





// Function to greet based on time
function wishMe() {
    const hour = new Date().getHours();

    // Greet based on the time of day
    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Boss...");
    } else {
        speak("Good Evening Sir...");
    }
}




/* // Event listener when the window loads
window.addEventListener('load', () => {
	
	var song = new Audio();// Initialize an audio element
	song.src = 'power up.mp3';
	song.play(); // Play the 'power up.mp3' audio file
	
    speak("Initializing JARVIS..");
    wishMe(); // Greet the user based on the time
}); */




// Create a SpeechRecognition object based on browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();





// Event handling when speech recognition detects a result
recognition.onresult = async (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript; // Display the recognized speech content
    await processCommand(transcript.toLowerCase()); // Process the recognized text as a command
};





let musicPlayed = false;
let speechInitialized = false;
let recognitionStarted = false;

btn.addEventListener('click', () => {
    if (!musicPlayed) {
        var song = new Audio(); // Initialize an audio element
        song.src = 'power up.mp3';
        song.play(); // Play the 'power up.mp3' audio file
        musicPlayed = true; // Update the flag to indicate music has been played
    }

    if (!speechInitialized) {
        speak("Initializing JARVIS..");
        wishMe(); // Greet the user based on the time
        speechInitialized = true; // Update the flag to indicate speech initialized
		
		// Set recognitionStarted = true; after 5 seconds
        setTimeout(() => {
            recognitionStarted = true; // Update the flag to indicate recognition started
        }, 3000);
    }
	
	setTimeout(() => {
		if (recognitionStarted) {
			content.textContent = "Listening...."; // Update content to "Listening...."
			recognition.start(); // Start speech recognition immediately
			recognitionStarted = true; // Update the flag to indicate recognition started
		}
	}, 5000);
});





// OpenAI and Weather API keys
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
                max_tokens: 50,
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





// Function to fetch weather information for a specified city
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





// Function to process commands based on recognized speech
async function processCommand(message) {
    // Initialize a SpeechSynthesisUtterance object for speech synthesis
    const speech = new SpeechSynthesisUtterance();
    let finalText = '';

    // Check for different types of commands and perform actions accordingly

    // Check for AI-related commands
    if (message.includes('gpt')) {
        const prompt = message.replace('gpt', '').trim();
        finalText = await askOpenAI(prompt); // Call function to query OpenAI's GPT-3 engine
    }

    // Check for weather-related commands
    else if (message.includes('weather in')) {
        const city = message.split('weather in')[1].trim();
        finalText = await fetchWeather(city); // Call function to fetch weather information
    }

    // Handle basic greetings
    else if (message.includes('hey') || message.includes('hello') || message.includes('hi')) {
        finalText = "Hi Boss How are you doing?";
    }
	
	// Handle basic greetings
    else if (message.includes('fine') || message.includes('doing good') || message.includes('doing well')) {
        finalText = "Sounds good!";
    }
	
    // Respond to a query about well-being
    else if (message.includes('how are you')) {
        finalText = "I'm doing great boss Tell me how I can assist you.";
    }
    // Handle inappropriate language
    else if (message.includes('f** you')) {
        finalText = "Fuck you";
    }
    // Respond to inquiries about its identity
    else if (message.includes('who are you')) {
		let finalText = '';
        var audio = new Audio(src); // Play audio file
        audio.play('jarvis.mp3');
    }
    // Identify the user
    else if (message.includes('do you know who am i') || message.includes('who am i')) {
        finalText = "In reality you are my boss, Sreeju.";
    }
    // Open Google in a new tab
    else if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        finalText = "Opening Google";
    }
    // Fetch and provide the current time
    else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        finalText = `The time is ${time}`;
    }
    // Fetch and provide the current date
    else if (message.includes('date')) {
        const date = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        finalText = `Today is ${date}`;
    }
    // Fetch and provide the current day of the week
    else if (message.includes('day of the week')) {
        const dayOfWeek = new Date().toLocaleDateString(undefined, { weekday: 'long' });
        finalText = `Today is ${dayOfWeek}`;
    }

    // Calculate a mathematical expression
    else if (message.includes('calculate')) {
        const expression = message.replace('calculate', '').trim();
        try {
            const result = eval(expression); // Caution: using eval - consider safer alternatives for production
            finalText = `The result is ${result}`;
        } catch (error) {
            finalText = "Sorry I couldn't calculate that.";
        }
    }
    // Open a website in a new tab
    else if (message.includes('open website')) {
        const url = message.split('open website')[1].trim();
        window.open(`https://${url}`, "_blank");
        finalText = `Opening ${url}`;
    }
    // Search for a term on Google
    else if (message.includes('search for')) {
        const searchTerm = message.replace('search for', '').trim();
        window.open(`https://www.google.com/search?q=${searchTerm}`, "_blank");
        finalText = `Searching for ${searchTerm} on Google`;
    }
    // Fetch user's location based on geolocation
    else if (message.includes('my location')) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                // Fetch and display user's current location
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
    // Set a reminder (functionality not implemented)
    else if (message.includes('set a reminder')) {
        // Code to set a reminder, possibly using browser notifications or other reminder services
        finalText = "Reminder set successfully!";
    }
    // Open email client or initiate email sending
    else if (message.includes('send email')) {
        // Code to send an email or open a draft in a mail client
        const email = message.split('send email')[1].trim();
        window.open(`mailto:${email}`);
        finalText = `Opening email client to send an email to ${email}`;
    }
    // Open dialer to call
    else if (message.includes('call')) {
        // Code to open a dialer to call
        const call = message.split('call')[1].trim();
        window.open(`tel:${call}`);
        finalText = `Opening dialer to call.`;
    }
    // General questions
    else if (message.includes('what is your fathers name') || message.includes('who is your father') || message.includes('who created you')) {
        finalText = `Sreeju was the one who gave me life.`;
    }
	// Birthday
    else if (message.includes('when is your birthday')) {
        finalText = `On December 29 2023 around midnight I existed as an idea in Sreeju's mind.`;
    }
    // Handle a command for Wikipedia search
    else if (message.includes('search on Wikipedia for')) {
        const searchTerm = message.replace('search on Wikipedia for', '').trim();
        // Code to search and retrieve information from Wikipedia
        const wikiInfo = await searchWikipedia(searchTerm);
        finalText = wikiInfo.summary || "Sorry, I couldn't find information on that.";
    }

    // Handle a command to tell a fact
    else if (message.includes('tell me a fact')) {
        // Code to fetch and present a random interesting fact
        finalText = "Did you know that a group of flamingos is called a flamboyance?";
    }
    // Handle a command to tell a joke
    else if (message.includes('tell me a joke')) {
        finalText = "Why don't scientists trust atoms? Because they make up everything!";
    }
    // Handle a command to read a specific webpage content
    else if (message.includes('read page')) {
        const pageURL = message.replace('read page', '').trim();
        // Code to fetch the content of the webpage from the URL
        const pageContent = await fetchPageContent(pageURL);
        finalText = pageContent || "Sorry, I couldn't fetch the content of the page.";
    }

    // Handle a command to set a timer
    else if (message.includes('set a timer')) {
        const timeInSeconds = parseInt(message.match(/\d+/)); // Extract time in seconds from the command
        setTimeout(() => {
            finalText = "Your timer is up!";
            speech.text = finalText;
            jarvis_t.textContent = speech.text;
            window.speechSynthesis.speak(speech);
        }, timeInSeconds * 1000); // Convert seconds to milliseconds
        finalText = `Timer set for ${timeInSeconds} seconds.`;
    }

    // Handle a command to provide motivational quotes
    else if (message.includes('motivate me')) {
        // Code to fetch and present a motivational quote
        finalText = "Success is not final, failure is not fatal: It is the courage to continue that counts.";
    }

    // Handle a command to flip a coin
    else if (message.includes('flip a coin')) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        finalText = `The result is ${result}.`;
    }

    // Handle a command to roll a dice
    else if (message.includes('roll a dice')) {
        const result = Math.floor(Math.random() * 6) + 1;
        finalText = `You rolled a ${result}.`;
    }

    // Handle a command to tell a riddle
    else if (message.includes('tell me a riddle')) {
        finalText = "What has keys but can't open locks? A piano!";
    }
	
    // Handle a command to provide a fun fact
    else if (message.includes('fun fact')) {
        // Code to fetch and present a random interesting fact
        finalText = "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!";
    }

    // Handle a command to share a programming tip
    else if (message.includes('programming tip')) {
        // Code to fetch and present a programming tip or advice
        finalText = "Remember, naming conventions and code readability are crucial for maintainable and understandable code. Choose descriptive names for variables and functions!";
    }

    // Handle a command to generate a random joke
    else if (message.includes('random joke')) {
        // Code to fetch and present a random joke from an API or predefined jokes list
        finalText = "Why don't we ever tell secrets on a farm? Because the potatoes have eyes and the corn has ears!";
    }

    // Handle a command to suggest a book
    else if (message.includes('recommend a book')) {
        // Code to suggest a book based on predefined recommendations or an API
        finalText = "I recommend 'The Hitchhiker's Guide to the Galaxy' by Douglas Adams. It's a fantastic and humorous science fiction book!";
    }

    // Handle a command to provide a daily quote
    else if (message.includes('daily quote')) {
        // Code to fetch and present a quote of the day
        finalText = "Every moment is a fresh beginning. - T.S. Eliot";
    }

    // Handle a command to simulate a magic 8-ball response
    else if (message.includes('magic 8 ball')) {
        const responses = [
            "It is certain.",
            "Without a doubt.",
            "Outlook not so good.",
            "Reply hazy, try again.",
            "Cannot predict now."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        finalText = `Magic 8-ball says: ${randomResponse}`;
    }
    // Handle a command to generate a random quote
    else if (message.includes('random quote')) {
        // Code to fetch and present a random quote from an API or predefined list
        finalText = "The best way to predict the future is to create it. - Peter Drucker";
    }

    // Handle a command to provide health tips
    else if (message.includes('health tips')) {
        // Code to fetch and present a health tip or advice
        finalText = "Remember to drink plenty of water and get at least 30 minutes of physical activity every day to maintain good health.";
    }

    // Handle a command to suggest a movie
    else if (message.includes('recommend a movie')) {
        // Code to suggest a movie based on predefined recommendations or an API
        finalText = "I recommend watching 'The Shawshank Redemption'. It's a powerful and inspiring movie!";
    }

    // Handle a command to perform a language translation
    else if (message.includes('translate to')) {
        const textToTranslate = message.replace('translate to', '').trim();
        // Code to perform translation to the specified language using an API
        // Assuming the translated text is retrieved as translatedText
        const translatedText = await translateToLanguage(textToTranslate, 'Spanish');
        finalText = `The translation to Spanish is: ${translatedText}`;
    }

    // Handle a command to provide a cooking tip
    else if (message.includes('cooking tip')) {
        // Code to fetch and present a cooking tip or advice
        finalText = "When baking, always preheat your oven before placing your dish inside for the best results.";
    }

    // Handle a command to offer a brain teaser
    else if (message.includes('brain teaser')) {
        // Code to present a brain teaser or riddle
        finalText = "I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I? Answer: Pencil lead.";
    }
    // Handle a command to provide productivity tips
    else if (message.includes('productivity tips')) {
        // Code to fetch and present a productivity tip or advice
        finalText = "One effective productivity tip is to break tasks into smaller, manageable chunks and prioritize them.";
    }

    // Handle a command to suggest a podcast
    else if (message.includes('recommend a podcast')) {
        // Code to suggest a podcast based on predefined recommendations or an API
        finalText = "I recommend listening to 'The Joe Rogan Experience'. It covers a wide range of topics and has interesting discussions!";
    }

    // Handle a command to play a specific genre of music
    else if (message.includes('play genre')) {
        const genre = message.replace('play genre', '').trim();
        // Code to play music of the specified genre using an audio player
        finalText = `Playing ${genre} music for you.`;
    }

    // Handle a command to offer a daily affirmation
    else if (message.includes('daily affirmation')) {
        // Code to fetch and present a positive affirmation or motivational message
        finalText = "You are capable of achieving amazing things. Keep moving forward!";
    }

    // Handle a command to provide study tips
    else if (message.includes('study tips')) {
        // Code to fetch and present a study tip or advice
        finalText = "To improve study sessions, try using the Pomodoro Technique: study for 25 minutes, then take a 5-minute break.";
    }

    // Handle a command to recommend a TV show
    else if (message.includes('recommend a TV show')) {
        // Code to suggest a TV show based on predefined recommendations or an API
        finalText = "I recommend watching 'Stranger Things'. It's a thrilling and captivating TV series!";
    }
	
    // Handle a command to offer gardening tips
    else if (message.includes('gardening tips')) {
        // Code to fetch and present a gardening tip or advice
        finalText = "Water your plants in the morning to avoid evaporation loss, and consider composting for healthier soil.";
    }

    // Handle a command to recommend a documentary
    else if (message.includes('recommend a documentary')) {
        // Code to suggest a documentary based on predefined recommendations or an API
        finalText = "I recommend watching 'Planet Earth II'. It's a stunning documentary series showcasing the beauty of our planet.";
    }

    // Handle a command to suggest a travel destination
    else if (message.includes('recommend a travel destination')) {
        // Code to suggest a travel destination based on predefined recommendations or an API
        finalText = "Consider visiting Kyoto, Japan. It's a city rich in history, culture, and beautiful landscapes.";
    }

    // Handle a command to offer meditation tips
    else if (message.includes('meditation tips')) {
        // Code to fetch and present meditation tips or advice
        finalText = "Find a quiet space, focus on your breath, and let go of distracting thoughts for a more effective meditation session.";
    }

    // Handle a command to recommend a board game
    else if (message.includes('recommend a board game')) {
        // Code to suggest a board game based on predefined recommendations or an API
        finalText = "I recommend playing 'Ticket to Ride'. It's a fun and strategic board game involving train adventures!";
    }

    // Handle a command to provide pet care tips
    else if (message.includes('pet care tips')) {
        // Code to fetch and present pet care tips or advice
        finalText = "Regularly groom your pet to keep their coat healthy and visit the vet for routine check-ups to ensure their well-being.";
    }
	
	
	
	
	
	
	
    // Default response if no recognized command is found
    else {
        speech.text = finalText || "Could you just repeat it again?";
    }
	speech.text = finalText;
	jarvis_t.textContent = speech.text; // Display text spoken by Jarvis in the designated element
	
 
    // Set speech synthesis parameters
    speech.pitch = 1;
    speech.rate = 1;

    // Speak the final text response
    window.speechSynthesis.cancel(); // Cancel any ongoing speech synthesis
    window.speechSynthesis.speak(speech);
}
