// components/FormInput.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet,
  KeyboardTypeOptions, TouchableOpacity, Modal,
  FlatList, SafeAreaView, Pressable,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export type InputType = "text" | "email" | "phone" | "password" | "number" | "address" | "name";

export interface ButtonOption {
  value: string;
  label: string;
}

interface BaseProps {
  label: string;
  optional?: boolean;
  error?: string;
}

interface TextInputProps extends BaseProps {
  variant?: "text";
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  iconName: string;
  type?: InputType;
  maxLength?: number;
  minLength?: number;
  secureText?: boolean;
}

interface ButtonGroupProps extends BaseProps {
  variant: "buttons";
  options: ButtonOption[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  multiple?: boolean;
  buttonsPerRow?: number;
}

type FormInputProps = TextInputProps | ButtonGroupProps;

// ── Country codes ─────────────────────────────────────────────────────────────

export interface CountryCode {
  name: string;
  flag: string;
  code: string; // e.g. "+234"
  iso: string;  // e.g. "NG"
}

export const COUNTRY_CODES: CountryCode[] = [
  { name: "Nigeria",        flag: "🇳🇬", code: "+234", iso: "NG" },
  { name: "United Kingdom", flag: "🇬🇧", code: "+44",  iso: "GB" },
  { name: "United States",  flag: "🇺🇸", code: "+1",   iso: "US" },
  { name: "Ghana",          flag: "🇬🇭", code: "+233", iso: "GH" },
  { name: "Kenya",          flag: "🇰🇪", code: "+254", iso: "KE" },
  { name: "South Africa",   flag: "🇿🇦", code: "+27",  iso: "ZA" },
  { name: "Canada",         flag: "🇨🇦", code: "+1",   iso: "CA" },
  { name: "Germany",        flag: "🇩🇪", code: "+49",  iso: "DE" },
  { name: "France",         flag: "🇫🇷", code: "+33",  iso: "FR" },
  { name: "India",          flag: "🇮🇳", code: "+91",  iso: "IN" },
  { name: "Australia",      flag: "🇦🇺", code: "+61",  iso: "AU" },
  { name: "UAE",            flag: "🇦🇪", code: "+971", iso: "AE" },
  { name: "Saudi Arabia",   flag: "🇸🇦", code: "+966", iso: "SA" },
  { name: "Brazil",         flag: "🇧🇷", code: "+55",  iso: "BR" },
  { name: "Egypt",          flag: "🇪🇬", code: "+20",  iso: "EG" },
  { name: "Ethiopia",       flag: "🇪🇹", code: "+251", iso: "ET" },
  { name: "Tanzania",       flag: "🇹🇿", code: "+255", iso: "TZ" },
  { name: "Uganda",         flag: "🇺🇬", code: "+256", iso: "UG" },
  { name: "Cameroon",       flag: "🇨🇲", code: "+237", iso: "CM" },
  { name: "Senegal",        flag: "🇸🇳", code: "+221", iso: "SN" },
];

// ── Validation ────────────────────────────────────────────────────────────────

export function validateField(
  value: string,
  label: string,
  type: InputType = "text",
  optional = false,
  minLength?: number,
  maxLength?: number
): string {
  const trimmed = value.trim();
  if (optional && trimmed === "") return "";
  if (!optional && trimmed === "") return `${label} is required.`;
  switch (type) {
    case "email": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
        return "Please enter a valid email address.";
      break;
    }
    case "phone": {
      // Strip leading country code prefix (+xxx) and common separators before validating digits
      const stripped = trimmed.replace(/^\+\d{1,4}\s?/, "").replace(/[\s\-\(\)]/g, "");
      if (!/^[0-9]{6,15}$/.test(stripped))
        return "Please enter a valid phone number.";
      break;
    }
    case "number": {
      if (isNaN(Number(trimmed))) return `${label} must be a number.`;
      break;
    }
    case "name": {
      if (trimmed.length < 2) return `${label} must be at least 2 characters.`;
      break;
    }
    case "password": {
      if (trimmed.length < 6) return "Password must be at least 6 characters.";
      break;
    }
  }
  if (minLength && trimmed.length < minLength)
    return `${label} must be at least ${minLength} characters.`;
  if (maxLength && trimmed.length > maxLength)
    return `${label} must be no more than ${maxLength} characters.`;
  return "";
}

// ── Country picker modal ───────────────────────────────────────────────────────

interface CountryPickerModalProps {
  visible: boolean;
  selected: CountryCode;
  onSelect: (c: CountryCode) => void;
  onClose: () => void;
}

function CountryPickerModal({ visible, selected, onSelect, onClose }: CountryPickerModalProps) {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={[cpStyles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]} onPress={onClose} />
      <SafeAreaView style={[cpStyles.sheet, { backgroundColor: colors.card }]}>
        {/* Handle bar */}
        <View style={[cpStyles.handle, { backgroundColor: colors.separatorColor }]} />

        <Text style={[cpStyles.sheetTitle, { color: colors.textPrimary }]}>Select Country Code</Text>

        {/* Search */}
        <View style={[cpStyles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.separatorColor }]}>
          <IconSymbol name="SearchIcon" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={[cpStyles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search country or code..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <IconSymbol name="DeleteEmptyIcon" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.iso}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isActive = item.iso === selected.iso;
            return (
              <TouchableOpacity
                style={[
                  cpStyles.countryRow,
                  { borderBottomColor: colors.separatorColor },
                  isActive && { backgroundColor: colors.inputBg },
                ]}
                onPress={() => { onSelect(item); onClose(); setSearch(""); }}
                activeOpacity={0.7}
              >
                <Text style={cpStyles.flag}>{item.flag}</Text>
                <Text style={[cpStyles.countryName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[cpStyles.countryCode, { color: isActive ? colors.accentOrange : colors.textMuted }]}>
                  {item.code}
                </Text>
                {isActive && (
                  <IconSymbol name="CheckmarkIcon" size={16} color={colors.accentOrange} style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const cpStyles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 16,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: "center", marginTop: 10, marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 17, fontWeight: "700",
    textAlign: "center", paddingVertical: 12,
  },
  searchBox: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 16, marginBottom: 8,
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 15 },
  countryRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flag: { fontSize: 22, marginRight: 12 },
  countryName: { flex: 1, fontSize: 15, fontWeight: "500" },
  countryCode: { fontSize: 15, fontWeight: "600" },
});

// ── Phone input with country code ─────────────────────────────────────────────
//
// DESIGN:  [🇳🇬 +234 ▾]  [  phone number input field  ]
//          ──separate pill──  ──────────────────────────
//
// STATE CONTRACT:
//   • `PhoneInput` owns the local digits in its OWN internal state.
//     The `value` prop is used only as the initial value (via useState initialiser).
//     This prevents the country-code-duplication bug where the parent stores
//     the full "+234 xxx" string and passes it back as `value`, causing the
//     country code to appear inside the text field.
//   • `onChange(full)` fires on every keystroke / country change with the
//     assembled full number, e.g. "+234 08012345678".  Parents store ONLY this.

interface PhoneInputProps {
  value: string;              // initial local digits (no country code) — read once
  onChange: (full: string) => void; // emits full number including country code
  placeholder?: string;
  error?: boolean;
  defaultCountry?: string;    // ISO, e.g. "NG" — defaults to Nigeria
}

export function PhoneInput({
  value: initialValue,
  onChange,
  placeholder,
  error,
  defaultCountry = "NG",
}: PhoneInputProps) {
  const { colors } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.iso === defaultCountry) ?? COUNTRY_CODES[0]
  );
  // Local digits live here — never polluted by the full number from the parent
  const [localDigits, setLocalDigits] = useState(initialValue ?? "");

  const handleSelect = (c: CountryCode) => {
    setCountry(c);
    onChange(`${c.code} ${localDigits}`);
  };

  const handleDigitsChange = (text: string) => {
    setLocalDigits(text);
    onChange(`${country.code} ${text}`);
  };

  const borderColor = error ? "#e53935" : colors.separatorColor;
  const borderWidth = error ? 1.5 : 1;

  return (
    <>
      <View style={phoneStyles.row}>
        {/* ── Country code pill ── */}
        <TouchableOpacity
          style={[
            phoneStyles.codePill,
            {
              backgroundColor: colors.inputBg,
              borderColor,
              borderWidth,
            },
          ]}
          onPress={() => setPickerOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={phoneStyles.flag}>{country.flag}</Text>
          <Text style={[phoneStyles.codeText, { color: colors.textPrimary }]}>
            {country.code}
          </Text>
          <IconSymbol name="ChevronDownIcon" size={13} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ── Number input field ── */}
        <View style={[
          phoneStyles.inputBox,
          {
            backgroundColor: colors.card,
            borderColor,
            borderWidth,
          },
        ]}>
          <TextInput
            style={[phoneStyles.input, { color: colors.textPrimary }]}
            placeholder={placeholder ?? "Phone number"}
            placeholderTextColor={colors.textMuted}
            value={localDigits}
            onChangeText={handleDigitsChange}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={15}
          />
        </View>
      </View>

      <CountryPickerModal
        visible={pickerOpen}
        selected={country}
        onSelect={handleSelect}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}

const phoneStyles = StyleSheet.create({
  // Outer row — two sibling boxes with a gap between them
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 55,
  },
  // Left pill — flag + code + chevron
  codePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    height: "100%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  flag: { fontSize: 20 },
  codeText: { fontSize: 14, fontWeight: "600" },
  // Right box — the actual text input
  inputBox: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  input: { paddingHorizontal: 14, fontSize: 15, height: "100%" },
});

// ── Main FormInput component ───────────────────────────────────────────────────

export default function FormInput(props: FormInputProps) {
  const { colors } = useTheme();

  // ── Button group variant ──────────────────────────────────────────────────
  if (props.variant === "buttons") {
    const {
      label, optional, error,
      options, selected, onSelect,
      multiple = false,
      buttonsPerRow = 2,
    } = props;

    const handlePress = (value: string) => {
      if (multiple) {
        onSelect(
          selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value]
        );
      } else {
        onSelect([value]);
      }
    };

    const buttonWidthPct = `${Math.floor(100 / buttonsPerRow) - 2}%` as any;

    return (
      <View style={styles.wrapper}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
          {optional && <Text style={[styles.optional, { color: colors.textMuted }]}> (optional)</Text>}
        </Text>
        <View style={styles.buttonGrid}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionBtn,
                  {
                    width: buttonWidthPct,
                    backgroundColor: isSelected ? colors.accentOrange : colors.card,
                    borderColor: isSelected ? colors.accentOrange : colors.separatorColor,
                  },
                  error ? { borderColor: "#e53935" } : null,
                ]}
                onPress={() => handlePress(opt.value)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.optionBtnText,
                  { color: isSelected ? "#fff" : colors.textPrimary },
                  isSelected && { fontWeight: "700" },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  // ── Text input variant ────────────────────────────────────────────────────
  const {
    label, placeholder, value, onChange, iconName,
    type = "text", maxLength, optional = false, error, secureText = false,
  } = props as TextInputProps;

  const keyboardMap: Record<InputType, KeyboardTypeOptions> = {
    text: "default", email: "email-address", phone: "phone-pad",
    password: "default", number: "numeric", address: "default", name: "default",
  };

  const hasError = !!error;

  // Phone type: delegate to PhoneInput — it owns its own digit state internally.
  // `value` seeds the initial digits; `onChange` receives the full number string.
  if (type === "phone") {
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
          {optional && <Text style={[styles.optional, { color: colors.textMuted }]}> (optional)</Text>}
        </Text>
        <PhoneInput
          value={value}
          onChange={(full) => onChange(full)}
          placeholder={placeholder}
          error={hasError}
        />
        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>
        {label}
        {optional && <Text style={[styles.optional, { color: colors.textMuted }]}> (optional)</Text>}
      </Text>
      <View style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: hasError ? "#e53935" : colors.separatorColor,
          borderWidth: hasError ? 1.5 : 1,
        },
      ]}>
        <IconSymbol
          name={iconName as any}
          size={22}
          color={hasError ? "#e53935" : colors.textMuted}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardMap[type]}
          secureTextEntry={secureText || type === "password"}
          maxLength={maxLength}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          autoCorrect={false}
        />
        {maxLength && (
          <Text style={[
            styles.counter,
            { color: colors.textMuted },
            value.length === maxLength && { color: "#e53935" },
          ]}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { marginVertical: 10 },
  label: { marginBottom: 8, fontWeight: "600", fontSize: 16 },
  optional: { fontWeight: "400", fontSize: 14 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  input: { flex: 1, height: "100%", fontSize: 15 },
  counter: { fontSize: 11 },
  buttonGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  optionBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  optionBtnText: { fontSize: 13, fontWeight: "500" },
  errorText: { color: "#e53935", fontSize: 12, marginTop: 4, marginLeft: 4 },
});