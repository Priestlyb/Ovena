import { useEffect, useMemo, useState } from "react";
import {
  generateYears,
  getDaysInMonth,
} from "@/src/utils/date";

export const useDobPicker = () => {
  const years = useMemo(generateYears, []);

  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(years[0]);
  const [showPicker, setShowPicker] = useState(false);

  const daysInMonth = useMemo(
    () => getDaysInMonth(month, year),
    [month, year],
  );

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [daysInMonth]);

  return {
    day,
    month,
    year,
    setDay,
    setMonth,
    setYear,
    showPicker,
    setShowPicker,
    days,
    years,
  };
};