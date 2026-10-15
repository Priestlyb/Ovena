import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, type ThemeColors } from "@/constants/theme";

type SectionProps = {
  title: string;
  content: string[];
  theme: ThemeColors;
};

const Section = ({ title, content, theme }: SectionProps) => (
  <View style={styles.section}>
    <Text
      style={[
        styles.title,
        {
          color: theme.textPrimary,
        },
      ]}
    >
      {title}
    </Text>

    {content.map((item, index) => (
      <Text
        key={index}
        style={[
          styles.text,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        {item}
      </Text>
    ))}
  </View>
);

const PrivacyTab = () => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* Meta */}
      <Text
        style={[
          styles.meta,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        Effective Date: [Insert Date]
      </Text>

      <Text
        style={[
          styles.meta,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        Last Updated: [Insert Date]
      </Text>

      <Text
        style={[
          styles.paragraph,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        At Ovena, we respect your privacy and are committed to protecting your
        personal information. This Privacy Policy explains how we collect, use,
        share, and safeguard your data in compliance with NDPR 2019.
      </Text>

      {/* Sections */}
      <Section
        theme={theme}
        title="1. Definitions"
        content={[
          "“Platform” means the Ovena app, website, and related services.",
          "“Personal Data” means information that identifies an individual (e.g., name, phone, location).",
          "“Processing” means collection, storage, or use of personal data.",
        ]}
      />

      <Section
        theme={theme}
        title="2. Data We Collect"
        content={[
          "Users: Name, phone, email, address, order history, payment details.",
          "Drivers: Name, contact, license, bank details, GPS location, delivery photos (temporary).",
          "Restaurants: Business name, contact, menu, bank details.",
          "Platform Data: Device info, IP, logs, cookies, referral codes.",
        ]}
      />

      <Section
        theme={theme}
        title="3. How We Use Your Data"
        content={[
          "Process orders and manage payments.",
          "Enable real-time delivery tracking.",
          "Verify deliveries using photo proof & metadata.",
          "Issue Ovena Coins for refunds and promotions.",
          "Prevent fraud and misuse.",
          "Comply with Nigerian laws.",
        ]}
      />

      <Section
        theme={theme}
        title="4. Data Sharing"
        content={[
          "Payment processors (Paystack, Flutterwave).",
          "Third-party services (e.g., maps, SMS/email providers).",
          "Law enforcement when required by law.",
          "We do NOT sell your personal data.",
        ]}
      />

      <Section
        theme={theme}
        title="5. Data Retention"
        content={[
          "Delivery metadata is stored temporarily then deleted.",
          "Account data is retained while active.",
          "Some data may be kept for legal and fraud prevention purposes.",
        ]}
      />

      <Section
        theme={theme}
        title="6. Legal Basis for Processing"
        content={[
          "User consent (signup).",
          "Contractual necessity.",
          "Legal obligations.",
          "Legitimate business interests.",
        ]}
      />

      <Section
        theme={theme}
        title="7. Your Rights under NDPR"
        content={[
          "Access your personal data.",
          "Request correction or deletion.",
          "Withdraw consent.",
          "Restrict or object to processing.",
          "Lodge complaints with the NDPB.",
        ]}
      />

      <Section
        theme={theme}
        title="8. Security"
        content={[
          "We use encryption, firewalls, and secure servers.",
          "No system is 100% secure; usage is at your own risk.",
        ]}
      />

      <Section
        theme={theme}
        title="9. International Transfers"
        content={[
          "Data may be transferred outside Nigeria with proper safeguards.",
        ]}
      />

      <Section
        theme={theme}
        title="10. Children’s Data"
        content={[
          "Ovena is not intended for users under 18.",
          "We do not knowingly collect children’s data.",
        ]}
      />

      <Section
        theme={theme}
        title="11. Updates to Privacy Policy"
        content={[
          "We may update this Policy periodically.",
          "Continued use means acceptance of updates.",
        ]}
      />
    </View>
  );
};

export default PrivacyTab;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
  },

  meta: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 12,
  },

  section: {
    marginTop: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
