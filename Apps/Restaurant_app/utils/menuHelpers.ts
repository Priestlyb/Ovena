export const cleanText = (text: string) => text.trim();

export const formatPrice = (value: string) => {
  const num = value.replace(/,/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-NG");
};

export const parsePrice = (value: string) => {
  return Number(value.replace(/,/g, "")) || 0;
};