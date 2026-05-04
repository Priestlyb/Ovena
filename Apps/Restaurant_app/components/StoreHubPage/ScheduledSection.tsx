import { CustomDropdown } from "@/components/CustomDropDown";
import { Spacer } from "@/components/atoms/Spacer";
import React from "react";

const TIME_OPTIONS = [
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];

type Props = {
  preOrderTime: string;
  finalOrderTime: string;
  setPreOrderTime: React.Dispatch<React.SetStateAction<string>>;
  setFinalOrderTime: React.Dispatch<React.SetStateAction<string>>;
};

export const ScheduledSection: React.FC<Props> = ({
  preOrderTime,
  finalOrderTime,
  setPreOrderTime,
  setFinalOrderTime,
}) => (
  <>
    <CustomDropdown
      placeholder="Opening Scheduled Period"
      label="Opening Scheduled Period"
      options={TIME_OPTIONS}
      value={preOrderTime}
      onChange={setPreOrderTime}
    />

    <Spacer size="md" />

    <CustomDropdown
      placeholder="Final Order Time"
      label="Final Order Time"
      options={TIME_OPTIONS}
      value={finalOrderTime}
      onChange={setFinalOrderTime}
    />
  </>
);
