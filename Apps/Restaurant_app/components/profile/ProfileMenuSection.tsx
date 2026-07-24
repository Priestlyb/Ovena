// components/profile/ProfileMenuSection.tsx

import React from "react";

import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";

import { IconName } from "@/components/ui/icon-symbol";

export interface MenuSectionItem {
  icon: IconName;
  label: string;
  onPress: () => void;
}

interface ProfileMenuSectionProps {
  title: string;
  items: MenuSectionItem[];
  defaultExpanded?: boolean;
}

export const ProfileMenuSection = ({
  title,
  items,
  defaultExpanded = true,
}: ProfileMenuSectionProps) => {
  return (
    <CollapsibleSection title={title} defaultExpanded={defaultExpanded}>
      {items.map((item) => (
        <ProfileMenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          onPress={item.onPress}
        />
      ))}
    </CollapsibleSection>
  );
};
