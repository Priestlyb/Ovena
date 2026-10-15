import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function RoomDetailsScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [adults, setAdults] = useState(1);

  const increase = () => setAdults((prev) => prev + 1);
  const decrease = () => {
    if (adults > 1) setAdults((prev) => prev - 1);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <IconSymbol name="BedRoomIcon" size={45} color="#ddd" />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.favBtn}>
          <Ionicons name="heart" size={22} />
        </TouchableOpacity>
      </View>

      {/* Room Info */}
      <View style={styles.roominfo}>
        <View style={styles.roomTitleRow}>
          <Text style={styles.roomTitle}>Diplomatic Suites</Text>
          <Text style={styles.roomNumber}>Room No. 25</Text>
        </View>

        <Text style={{ marginBottom: 10 }}>
          The Diplomatic Suites are stately with ostentatious designs and
          breath-taking views of the Atlantic. The suite has a DVD Player, Hi
          Definition LED TVs, and a separate lounge, bar and dining area for
          guests.
        </Text>

        <Text
          style={{ fontWeight: "bold", color: "#D9502E", marginBottom: 20 }}
        >
          View room details
        </Text>

        {/* Date Picker Button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 25,
          }}
        >
          <View style={styles.datePickerRow}>
            <Text style={styles.label}>Check In Date</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                style={styles.calendarIconBtn}
                onPress={() => setCalendarVisible(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#D9502E" />
              </TouchableOpacity>
              <Text>{selectedDate || "Add date"}</Text>
            </View>
          </View>

          <View style={styles.datePickerRow}>
            <Text style={styles.label}>Check Out Date</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                style={styles.calendarIconBtn}
                onPress={() => setCalendarVisible(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#D9502E" />
              </TouchableOpacity>
              <Text>{selectedDate || "Add date"}</Text>
            </View>
          </View>
        </View>

        {/* Calendar Modal */}
        <Modal
          visible={calendarVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setCalendarVisible(false);
                }}
                markedDates={
                  selectedDate
                    ? {
                        [selectedDate]: {
                          selected: true,
                          selectedColor: "#D9502E",
                        },
                      }
                    : {}
                }
              />
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                style={styles.closeBtn}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Adults Counter */}

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={styles.countercontainer}>
            <Text style={styles.counterlabel}>Adults</Text>

            <View style={styles.counterRow}>
              <TouchableOpacity
                style={[styles.button, adults === 1 && styles.disabled]}
                onPress={decrease}
                disabled={adults === 1}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.value}>{adults}</Text>

              <TouchableOpacity style={styles.button} onPress={increase}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.countercontainer}>
            <Text style={styles.counterlabel}>Children</Text>

            <View style={styles.counterRow}>
              <TouchableOpacity
                style={[styles.button, adults === 1 && styles.disabled]}
                onPress={decrease}
                disabled={adults === 1}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.value}>{adults}</Text>

              <TouchableOpacity style={styles.button} onPress={increase}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.countercontainer}>
          <Text style={styles.counterlabel}>Rooms</Text>

          <View style={styles.counterRow}>
            <TouchableOpacity
              style={[styles.button, adults === 1 && styles.disabled]}
              onPress={decrease}
              disabled={adults === 1}
            >
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.value}>{adults}</Text>

            <TouchableOpacity style={styles.button} onPress={increase}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra Additional */}
        <View>
          <Text style={{ fontWeight: "medium", marginTop: 10, fontSize: 18 }}>
            Add Extra Additional
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <View style={styles.redcirle} />
            <Text style={{ fontSize: 16, marginTop: 10 }}>
              Prep Room For Val’s Day
            </Text>
            <Text>$0.50</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookbutton}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Book | $336,870
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  headerWrapper: {
    height: 258,
    position: "relative",
  },

  headerImage: {
    position: "absolute",
    width: "100%",
    height: 258,
    resizeMode: "cover",
  },

  backBtn: {
    position: "absolute",
    top: 80,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },

  favBtn: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },

  roominfo: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },

  roomTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  roomTitle: { fontWeight: "bold", fontSize: 25 },
  roomNumber: { fontWeight: "bold", fontSize: 16, color: "#D9502E" },

  label: { fontSize: 16 },

  datePickerRow: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  calendarIconBtn: {
    padding: 8,
    backgroundColor: "#FFECE6",
    borderRadius: 8,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  closeBtn: {
    marginTop: 10,
    backgroundColor: "#D9502E",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  /* Counter Styles */

  countercontainer: {
    alignItems: "center",
    margin: 25,
  },

  counterlabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#D9502E",
    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    backgroundColor: "#ccc",
  },

  value: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "700",
  },

  redcirle: {
    width: 20,
    height: 20,
    backgroundColor: "#D9502E",
    borderRadius: 20,
    marginRight: 10,
  },

  bookbutton: {
    marginTop: 30,
    backgroundColor: "#D9502E",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
  },
});
