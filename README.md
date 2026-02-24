# Muslim-Sky 🌙

A beautiful and accurate Islamic prayer times app built with Expo and React Native. Get precise prayer times based on your current location with support for multiple calculation methods.

## Features

✨ **Location-Based Prayer Times** - Automatically detects your location and shows accurate prayer times
🕌 **5 Daily Prayers + Sunrise** - Fajr, Dhuhr, Asr, Maghrib, Isha, and Sunrise times
🌍 **Multiple Calculation Methods** - Support for MWL, ISNA, Egyptian, Makkah, and more
🌓 **Dark Mode Support** - Beautiful UI that adapts to your system theme
📅 **Hijri Calendar** - Shows both Gregorian and Islamic dates
⏰ **Next Prayer Indicator** - Highlights the upcoming prayer time
🔄 **Pull to Refresh** - Easy refresh to update prayer times

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
   pnpm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Prayer Time API

The app uses the [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api) to fetch accurate prayer times.

### Available Calculation Methods

- **MWL** (Muslim World League) - Default
- **ISNA** (Islamic Society of North America)
- **Egyptian** (Egyptian General Authority of Survey)
- **Makkah** (Umm Al-Qura University, Makkah)
- **Karachi** (University of Islamic Sciences, Karachi)
- **Tehran** (Institute of Geophysics, University of Tehran)
- **Jafari** (Shia Ithna-Ashari, Leva Institute, Qum)

You can change the calculation method in the `getPrayerTimesForCurrentLocation()` function by passing a different `CalculationMethod` enum value.

## Location Permissions

The app requires location permissions to determine your coordinates for accurate prayer times:

- **iOS**: The app will request "When In Use" location permission
- **Android**: The app requests ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION permissions

If permission is denied, the app will display an error message with a retry button.

## Project Structure

```
Muslim-Sky/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Prayer Times screen
│   │   ├── explore.tsx        # Explore screen
│   │   └── _layout.tsx        # Tab navigation layout
│   └── _layout.tsx            # Root layout
├── components/
│   ├── prayer-times-card.tsx  # Main prayer times component
│   └── ui/                    # UI components
├── services/
│   └── prayerTimeApi.ts       # Prayer time API service
└── hooks/                     # Custom hooks
```

## API Service Functions

### `getPrayerTimesForCurrentLocation(method?)`

Fetches prayer times for the user's current location.

### `getUserLocation()`

Gets the user's current GPS coordinates.

### `formatPrayerTime(time)`

Converts 24-hour format to 12-hour AM/PM format.

### `getNextPrayer(timings)`

Determines which prayer is coming next.

## Technologies Used

- **Expo** - React Native framework
- **TypeScript** - Type-safe development
- **expo-location** - Location services
- **NativeWind** - Tailwind CSS for React Native
- **Aladhan API** - Prayer times data

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
