// utils/formatPrice.ts

export const formatPrice = (v: any) => {
    if (v === null || v === undefined) return "";

    const num = String(v).replace(/,/g, "");

    if (num === "" || isNaN(Number(num))) return "";

    return Number(num).toLocaleString("en-NG");
};

export const unformatPrice = (v: any) => {
    if (v === null || v === undefined) return 0;

    const num = String(v).replace(/,/g, "");

    if (num === "" || isNaN(Number(num))) return 0;

    return Number(num);
};