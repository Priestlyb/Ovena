export const formatTime = (iso: string) => {
    if (!iso) return "12:00 AM";

    let [h, m] = iso.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
};

export const convertToISO = (time: string) => {
    const [t, mod] = time.split(" ");
    let [h, m] = t.split(":").map(Number);

    if (mod === "PM" && h !== 12) h += 12;
    if (mod === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
};

export const timeToNumber = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};