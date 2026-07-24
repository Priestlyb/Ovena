import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { StoreHubTimeSelector } from "@/components/StoreHub_TimeSelector";
import { BranchHour } from "@/types/storeHub";
import { convertToISO, formatTime, timeToNumber } from "@/utils/time";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  hours: BranchHour[];
  setHours: React.Dispatch<React.SetStateAction<BranchHour[]>>;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const InstantSection: React.FC<Props> = ({ hours, setHours }) => {
  const copyMondayToAll = () => {
    const monday = hours.find((h) => h.day === 0);

    if (!monday) return;

    setHours((prev) =>
      prev.map((day) => ({
        ...day,
        open_time: monday.open_time,
        close_time: monday.close_time,
        is_closed: monday.is_closed,
      })),
    );
  };

  return (
    <>
      <View style={localStyles.headerRow}>
        <Text variant="label" style={{ fontSize: 18, fontWeight: "bold" }}>
          Working Hours
        </Text>

        <TouchableOpacity style={localStyles.copyBtn} onPress={copyMondayToAll}>
          <Text style={localStyles.copyText}>Copy Monday to All</Text>
        </TouchableOpacity>
      </View>

      <Spacer size="md" />

      {hours.map((dayHour) => (
        <View key={dayHour.day} style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 12,
            }}
          >
            {DAYS[dayHour.day]}
          </Text>

          <StoreHubTimeSelector
            openingTime={formatTime(dayHour.open_time)}
            closingTime={formatTime(dayHour.close_time)}
            isClosed={dayHour.is_closed}
            onClosedChange={(closed) => {
              setHours((prev) =>
                prev.map((h) =>
                  h.day !== dayHour.day
                    ? h
                    : {
                        ...h,
                        is_closed: closed,
                      },
                ),
              );
            }}
            onOpeningTimeChange={(newTime) => {
              const newISO = convertToISO(newTime);

              setHours((prev) =>
                prev.map((h) =>
                  h.day !== dayHour.day
                    ? h
                    : {
                        ...h,
                        open_time: newISO,
                        close_time:
                          timeToNumber(newISO) >= timeToNumber(h.close_time)
                            ? newISO
                            : h.close_time,
                      },
                ),
              );
            }}
            onClosingTimeChange={(newTime) => {
              const newISO = convertToISO(newTime);

              setHours((prev) =>
                prev.map((h) =>
                  h.day !== dayHour.day
                    ? h
                    : {
                        ...h,
                        close_time: newISO,
                        open_time:
                          timeToNumber(newISO) <= timeToNumber(h.open_time)
                            ? newISO
                            : h.open_time,
                      },
                ),
              );
            }}
          />
        </View>
      ))}
    </>
  );
};

/* ================= LOCAL STYLES ================= */
const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFB47E",
    borderRadius: 8,
  },
  copyText: { fontSize: 12, fontWeight: "600", color: "#000" },
});
