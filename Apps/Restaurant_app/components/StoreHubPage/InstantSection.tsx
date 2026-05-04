import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { StoreHubTimeSelector } from "@/components/StoreHub_TimeSelector";
import { BranchHour } from "@/types/storeHub";
import { convertToISO, formatTime, timeToNumber } from "@/utils/time";
import React from "react";
import { View } from "react-native";

type Props = {
  hours: BranchHour[];
  setHours: React.Dispatch<React.SetStateAction<BranchHour[]>>;
};

export const InstantSection: React.FC<Props> = ({ hours, setHours }) => {
  return (
    <>
      <Text
        variant="label"
        style={{ fontSize: 18, fontWeight: "bold", marginBottom: 25 }}
      >
        Working Hours
      </Text>

      <Spacer size="sm" />

      {hours.map((dayHour) => (
        <View key={dayHour.day} style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 20 }}
            >
              {
                [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ][dayHour.day]
              }
            </Text>
          </View>

          <StoreHubTimeSelector
            openingTime={formatTime(dayHour.open_time)}
            closingTime={formatTime(dayHour.close_time)}
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
