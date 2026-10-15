export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TODAY = new Date();

export const generateYears = () =>
  Array.from({ length: 100 }, (_, i) => TODAY.getFullYear() - i);

export const isLeapYear = (y: number) =>
  (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export const getDaysInMonth = (m: number, y: number) =>
  m === 1 ? (isLeapYear(y) ? 29 : 28) : [3, 5, 8, 10].includes(m) ? 30 : 31;

export const is18Plus = (date: Date) => {
  const min = new Date(
    TODAY.getFullYear() - 18,
    TODAY.getMonth(),
    TODAY.getDate(),
  );

  return date <= min;
};