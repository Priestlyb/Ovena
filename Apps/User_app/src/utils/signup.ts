export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\s+/g, "");

    if (cleaned.startsWith("+")) {
        return cleaned;
    }

    if (cleaned.startsWith("0")) {
        return `+234${cleaned.slice(1)}`;
    }

    return cleaned;
};

export const formatBirthDate = (
    year: number,
    month: number,
    day: number
): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
    )}`;
};

export const validatePhone = (
    phone: string
): { valid: boolean; message?: string } => {
    const trimmed = phone.trim();

    if (!trimmed) {
        return {
            valid: false,
            message: "Phone number is required",
        };
    }

    const digits = trimmed.replace(/\D/g, "");

    if (digits.length < 10) {
        return {
            valid: false,
            message: "Enter a valid phone number",
        };
    }

    return {
        valid: true,
    };
};

export const trimOptional = (value?: string | null): string => {
    return value?.trim() ?? "";
};