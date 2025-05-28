# EV Charger Usage Application

A React Native application that helps users locate and manage electric vehicle charging stations. The app provides real-time information about charging station availability, pricing, and navigation.

## Features

- 📍 Interactive map showing nearby charging stations
- 🔍 Real-time station availability status
- 💰 Pricing information for each charging station
- 🚗 Navigation to selected charging stations
- 📊 Station details including:
  - Charging type (DC Fast, Level 2)
  - Power output
  - Number of available ports
  - User ratings
  - Distance from current location
- 🌓 Dark/Light theme support
- 📱 Responsive design for both iOS and Android

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- React Native development environment setup
- Expo CLI
- Google Maps API key (for map functionality) (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SuryaSriramD/EV-Charger-Usage.git
cd EV-Charger_Usage
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the frontend directory
   - Add your Google Maps API key: (Not required if you are not using backend)
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Start the development server:
```bash
# From the frontend directory
npm start
or
npx expo start -c
```

## Project Structure

```
EV-Charger_Usage/
├── frontend/                 # React Native application
│   ├── app/                 # Main application code
│   │   ├── (tabs)/         # Tab-based navigation screens
│   │   └── _layout.js      # Root layout configuration
│   ├── assets/             # Images, fonts, and other static files
│   ├── constants/          # Theme and color configurations
│   └── components/         # Reusable UI components
└── README.md               # Project documentation
```

## Dependencies

### Frontend Dependencies
- `react-native-maps`: For map functionality
- `expo-location`: For location services
- `@expo/vector-icons`: For UI icons
- `react-native`: Core React Native library
- `expo`: Expo framework
- `react-navigation`: For navigation between screens

## Development

To run the application in development mode:

```bash
cd frontend
npm start
or
npx expo start -c
```

Then:
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator
- Scan the QR code with Expo Go app on your physical device

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Maps Platform for mapping services
- Expo team for the development framework
- React Native community for the amazing tools and libraries 
