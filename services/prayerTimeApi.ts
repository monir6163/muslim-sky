import * as Location from "expo-location";

// Types for prayer time data
export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

export interface PrayerTimeData {
  timings: PrayerTimes;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: {
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

// Prayer time calculation methods
export enum CalculationMethod {
  MWL = 3, // Muslim World League
  ISNA = 2, // Islamic Society of North America
  Egyptian = 5, // Egyptian General Authority of Survey
  Makkah = 4, // Umm Al-Qura University, Makkah
  Karachi = 1, // University of Islamic Sciences, Karachi
  Tehran = 7, // Institute of Geophysics, University of Tehran
  Jafari = 0, // Shia Ithna-Ashari, Leva Institute, Qum
}

// Default fallback location (Mecca, Saudi Arabia)
const FALLBACK_LOCATION: LocationData = {
  latitude: 21.4225,
  longitude: 39.8262,
};

/**
 * Get fallback location (Mecca)
 */
export function getFallbackLocation(): LocationData {
  return FALLBACK_LOCATION;
}

/**
 * Request location permissions from the user
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
}

/**
 * Get the user's current location
 */
export async function getUserLocation(): Promise<LocationData | null> {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      console.warn("Location permission denied");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000,
      distanceInterval: 0,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting user location:", error);
    return null;
  }
}

/**
 * Get user location with fallback to default location
 */
export async function getUserLocationWithFallback(): Promise<{
  location: LocationData;
  isFallback: boolean;
}> {
  try {
    const location = await getUserLocation();

    if (location) {
      return { location, isFallback: false };
    }

    console.log("Using fallback location (Mecca)");
    return { location: FALLBACK_LOCATION, isFallback: true };
  } catch (error) {
    console.error("Error in getUserLocationWithFallback:", error);
    return { location: FALLBACK_LOCATION, isFallback: true };
  }
}

/**
 * Fetch prayer times for a specific location
 */
export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = CalculationMethod.MWL,
): Promise<PrayerTimeData | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 200 || !data.data) {
      throw new Error("Invalid API response");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
}

/**
 * Get prayer times based on user's current location (with fallback)
 */
export async function getPrayerTimesForCurrentLocation(
  method: CalculationMethod = CalculationMethod.MWL,
): Promise<{ data: PrayerTimeData; isFallback: boolean } | null> {
  try {
    const { location, isFallback } = await getUserLocationWithFallback();
    const prayerData = await getPrayerTimes(
      location.latitude,
      location.longitude,
      method,
    );

    if (!prayerData) {
      return null;
    }

    return { data: prayerData, isFallback };
  } catch (error) {
    console.error("Error getting prayer times for current location:", error);
    return null;
  }
}

/**
 * Format prayer time from 24-hour to 12-hour format
 */
export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

/**
 * Get the next prayer name and time
 */
export function getNextPrayer(
  timings: PrayerTimes,
): { name: string; time: string } | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: "Fajr", time: timings.Fajr },
    { name: "Sunrise", time: timings.Sunrise },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(":");
    const prayerTime = parseInt(hours) * 60 + parseInt(minutes);

    if (prayerTime > currentTime) {
      return prayer;
    }
  }

  // If no prayer is found for today, return Fajr (next day)
  return { name: "Fajr", time: timings.Fajr };
}
