# Jarvis Voice Assistant

This project implements a voice assistant named Jarvis using JavaScript and browser APIs for speech recognition and synthesis.

## Files

**app.js**

This file contains the main JavaScript code for Jarvis. It includes:

- Speech recognition using SpeechRecognition API
- Text-to-speech synthesis using SpeechSynthesis API
- Functions to handle commands and provide responses
- Integration with OpenAI's GPT-3 and OpenWeatherMap APIs
- Event handlers for microphone button clicks

**index.html** 

The main HTML page that loads app.js and contains the UI elements like:

- Microphone button to trigger speech recognition
- Container elements to display recognized text and Jarvis' responses
- UI indicators for date/time, internet and battery status

**style.css**

CSS stylesheet that contains styling for the elements in index.html like: 

- Page layout
- Colors
- Typography 
- Animations

## Features

Some of the key features implemented in this voice assistant include:

- Speech recognition to convert user's voice input to text
- Natural language processing to interpret text commands
- Responses and actions based on recognized commands:
  - Basic conversations and greetings
  - Get time, date, day, etc.
  - Open websites like Google, YouTube in new tab 
  - Search Google
  - Get weather reports
  - Calculate math expressions
  - Set timers and reminders
  - Tell jokes/facts
  - Flip coin or roll dice
  - Translate text
  - And more...



## Setup

To run this project locally:

1. Clone the repository

```
git clone https://github.com/sreeju7733/Jarvis.git
```

2. Get API keys for OpenAI and OpenWeatherMap APIs

3. Add the API keys in app.js file

```js
const OPENAI_API_KEY = '<YOUR_OPENAI_KEY>'; 

const OPENWEATHER_API_KEY = '<YOUR_OPENWEATHER_KEY>';
```

4. Run index.html in a web browser to launch the app

5. Click mic button and allow browser to access your microphone

6. Give voice commands like "Hey Jarvis" to interact with the assistant

This voice assistant showcases some of the capabilities of web speech APIs and natural language processing. The code can be extended and customized further based on requirements.



## License
This project is licensed under the MIT License. See the LICENSE file for details.

#### MIT License

Copyright (c) 2023 Sreeju

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
