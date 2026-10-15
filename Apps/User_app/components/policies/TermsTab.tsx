import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, type ThemeColors } from "@/constants/theme";

const TermsTab = () => {
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
      {/* Header Info */}
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
        Welcome to Ovena (“we,” “our,” “us”). Ovena is a delivery and logistics
        platform that connects Users (Customers), Drivers (Delivery Partners),
        and Restaurants (Merchants). By accessing or using our platform, you
        agree to these Terms & Conditions.
      </Text>

      {/* Section Renderer */}
      <Section
        theme={theme}
        title="1. Definitions & Interpretation"
        content={[
          "“Platform” means the Ovena mobile app, website, and related services.",
          "“User” means a person placing an order through Ovena.",
          "“Driver” means an independent contractor who accepts deliveries.",
          "“Restaurant” means a business providing goods or meals.",
          "“Ovena Coins” are digital in-app credits.",
          "“NDPR” refers to Nigeria Data Protection Regulation (2019).",
        ]}
      />

      <Section
        theme={theme}
        title="2. Acceptance of Terms"
        content={[
          "By using Ovena, you confirm that you:",
          "• Have read and understood these Terms.",
          "• Are legally capable of entering agreements.",
          "• Consent to data usage under our Privacy Policy.",
        ]}
      />

      <Section
        theme={theme}
        title="3. Eligibility & Account Registration"
        content={[
          "Minimum age: 18 years.",
          "Users must provide valid identity details.",
          "Drivers must have valid licenses, insurance, and bank details.",
          "Restaurants must have valid business registration.",
          "Accounts are personal and non-transferable.",
        ]}
      />

      <Section
        theme={theme}
        title="4. Services Provided by Ovena"
        content={[
          "Ovena acts only as a platform.",
          "We do not prepare food or employ drivers.",
          "Drivers and Restaurants are independent.",
          "We are not responsible for food quality or delays.",
        ]}
      />

      <Section
        theme={theme}
        title="5. User Responsibilities"
        content={[
          "Provide accurate delivery details.",
          "Be available to receive orders.",
          "Treat Drivers and Restaurants respectfully.",
        ]}
      />

      <Section
        theme={theme}
        title="6. Driver Obligations"
        content={[
          "Complete deliveries safely and promptly.",
          "Use registered vehicles with valid documents.",
          "Allow location tracking.",
          "Provide proof of delivery.",
          "Follow Nigerian traffic laws.",
        ]}
      />

      <Section
        theme={theme}
        title="7. Restaurant Obligations"
        content={[
          "Provide accurate menus and pricing.",
          "Maintain hygiene and food safety standards.",
          "Prepare orders on time.",
          "Handle product-related complaints.",
        ]}
      />

      <Section
        theme={theme}
        title="8. Fees, Payments & Subscriptions"
        content={[
          "Users must pay all applicable fees.",
          "Payments are processed via third parties.",
          "Commissions apply to Drivers and Restaurants.",
          "Subscription plans may be offered.",
        ]}
      />

      <Section
        theme={theme}
        title="9. Delivery, Proof & Risk Transfer"
        content={[
          "Risk transfers upon delivery.",
          "Drivers must provide proof of delivery.",
          "Metadata is stored temporarily.",
          "Ovena is not liable after delivery confirmation.",
        ]}
      />

      <Section
        theme={theme}
        title="10. Refunds & Ovena Coins"
        content={[
          "No cash refunds.",
          "Compensation is issued as Ovena Coins.",
          "Coins are non-redeemable for cash.",
        ]}
      />

      <Section
        theme={theme}
        title="11. Prohibited Conduct"
        content={[
          "No fraudulent orders or fake accounts.",
          "No harassment.",
          "No abuse of promotions.",
          "No reverse engineering.",
        ]}
      />

      <Section
        theme={theme}
        title="12. Intellectual Property"
        content={[
          "All Ovena assets belong to Ovena.",
          "Unauthorized use is prohibited.",
        ]}
      />

      <Section
        theme={theme}
        title="13. Data Protection & Privacy"
        content={[
          "We comply with NDPR 2019.",
          "See Privacy Policy for full details.",
        ]}
      />

      <Section
        theme={theme}
        title="14. Liability Limitations"
        content={[
          "We are not liable for delays, quality, or third-party failures.",
          "Liability is capped at payments made in the last 30 days.",
        ]}
      />

      <Section
        theme={theme}
        title="15. Indemnity"
        content={[
          "You agree to indemnify Ovena from claims arising from misuse.",
        ]}
      />

      <Section
        theme={theme}
        title="16. Force Majeure"
        content={["We are not responsible for events beyond our control."]}
      />

      <Section
        theme={theme}
        title="17. Dispute Resolution & Governing Law"
        content={[
          "Disputes go through Ovena Support first.",
          "Resolved via arbitration or courts in Abia State.",
          "Nigerian law applies.",
        ]}
      />

      <Section
        theme={theme}
        title="18. Changes to Terms"
        content={[
          "We may update these Terms.",
          "Continued use means acceptance.",
        ]}
      />
    </View>
  );
};

export default TermsTab;

const Section = ({
  title,
  content,
  theme,
}: {
  title: string;
  content: string[];
  theme: ThemeColors;
}) => (
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
