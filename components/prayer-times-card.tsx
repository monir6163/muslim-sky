import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  CalculationMethod,
  formatPrayerTime,
  getNextPrayer,
  getPrayerTimesForCurrentLocation,
  PrayerTimeData,
} from "@/services/prayerTimeApi";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function PrayerTimesCard() {
  const [prayerData, setPrayerData] = useState<PrayerTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const fetchPrayerTimes = async () => {
    try {
      setError(null);
      const result = await getPrayerTimesForCurrentLocation(
        CalculationMethod.MWL,
      );

      if (result) {
        setPrayerData(result.data);
        setIsFallback(result.isFallback);
      } else {
        setError("Unable to fetch prayer times. Please try again later.");
      }
    } catch (err) {
      setError("Failed to load prayer times");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrayerTimes();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator
          size="large"
          color={isDark ? "#4CAF50" : "#2E7D32"}
        />
        <Text style={[styles.loadingText, { color: isDark ? "#fff" : "#000" }]}>
          Loading prayer times...
        </Text>
      </View>
    );
  }

  if (error || !prayerData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text
          style={[styles.errorText, { color: isDark ? "#ff6b6b" : "#d32f2f" }]}
        >
          {error || "No data available"}
        </Text>
        <Pressable
          onPress={fetchPrayerTimes}
          style={[
            styles.retryButton,
            { backgroundColor: isDark ? "#4CAF50" : "#2E7D32" },
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const nextPrayer = getNextPrayer(prayerData.timings);
  const prayers = [
    { name: "Fajr", time: prayerData.timings.Fajr, icon: "🌅" },
    { name: "Sunrise", time: prayerData.timings.Sunrise, icon: "☀️" },
    { name: "Dhuhr", time: prayerData.timings.Dhuhr, icon: "🌞" },
    { name: "Asr", time: prayerData.timings.Asr, icon: "🌤️" },
    { name: "Maghrib", time: prayerData.timings.Maghrib, icon: "🌆" },
    { name: "Isha", time: prayerData.timings.Isha, icon: "🌙" },
  ];

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: isDark ? "#2d5f3f" : "#4CAF50" },
          ]}
        >
          <Text style={styles.headerTitle}>Prayer Times</Text>
          <Text style={styles.headerDate}>{prayerData.date.readable}</Text>
          <Text style={styles.headerHijri}>
            {prayerData.date.hijri.date} {prayerData.date.hijri.month.en}{" "}
            {prayerData.date.hijri.year}
          </Text>
        </View>

        {/* Fallback Location Warning */}
        {isFallback && (
          <View
            style={[
              styles.warningBanner,
              { backgroundColor: isDark ? "#4a3c1f" : "#fff3cd" },
            ]}
          >
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningTextContainer}>
              <Text
                style={[
                  styles.warningTitle,
                  { color: isDark ? "#ffc107" : "#856404" },
                ]}
              >
                Using Default Location
              </Text>
              <Text
                style={[
                  styles.warningMessage,
                  { color: isDark ? "#ccc" : "#856404" },
                ]}
              >
                Location services unavailable. Showing times for Mecca. Enable
                location permissions for accurate times.
              </Text>
            </View>
          </View>
        )}

        {/* Next Prayer */}
        {nextPrayer && (
          <View
            style={[
              styles.nextPrayerCard,
              { backgroundColor: isDark ? "#2a2a2a" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.nextPrayerLabel,
                { color: isDark ? "#aaa" : "#666" },
              ]}
            >
              Next Prayer
            </Text>
            <Text
              style={[
                styles.nextPrayerName,
                { color: isDark ? "#4CAF50" : "#2E7D32" },
              ]}
            >
              {nextPrayer.name}
            </Text>
            <Text
              style={[
                styles.nextPrayerTime,
                { color: isDark ? "#fff" : "#000" },
              ]}
            >
              {formatPrayerTime(nextPrayer.time)}
            </Text>
          </View>
        )}

        {/* Prayer Times List */}
        <View
          style={[
            styles.prayerList,
            { backgroundColor: isDark ? "#2a2a2a" : "#fff" },
          ]}
        >
          {prayers.map((prayer, index) => {
            const isNext = nextPrayer?.name === prayer.name;
            return (
              <View
                key={prayer.name}
                style={[
                  styles.prayerRow,
                  index !== prayers.length - 1 && styles.prayerRowBorder,
                  { borderBottomColor: isDark ? "#333" : "#e0e0e0" },
                  isNext && { backgroundColor: isDark ? "#1a3d2a" : "#e8f5e9" },
                ]}
              >
                <View style={styles.prayerNameContainer}>
                  <Text style={styles.prayerIcon}>{prayer.icon}</Text>
                  <Text
                    style={[
                      styles.prayerName,
                      { color: isDark ? "#fff" : "#000" },
                    ]}
                  >
                    {prayer.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.prayerTime,
                    { color: isDark ? "#4CAF50" : "#2E7D32" },
                  ]}
                >
                  {formatPrayerTime(prayer.time)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Location Info */}
        <Text
          style={[styles.locationText, { color: isDark ? "#888" : "#666" }]}
        >
          📍 Lat: {prayerData.meta.latitude.toFixed(4)}, Lon:{" "}
          {prayerData.meta.longitude.toFixed(4)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  headerHijri: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginTop: 4,
  },
  nextPrayerCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextPrayerLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  nextPrayerName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nextPrayerTime: {
    fontSize: 36,
    fontWeight: "300",
  },
  prayerList: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  prayerRowBorder: {
    borderBottomWidth: 1,
  },
  prayerNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  prayerIcon: {
    fontSize: 24,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: "700",
  },
  locationText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 16,
  },
  warningBanner: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.3)",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
    marginTop: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  warningMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
});
