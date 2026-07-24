import { styles } from "@/constants/foodTab";
import { MessageCircle } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  onSupportPress: () => void;
};

export default function FloatingButtons({ onSupportPress }: Props) {
  return (
    <>
      <TouchableOpacity style={styles.chatFab} onPress={onSupportPress}>
        <MessageCircle color="#FFF" size={24} />
      </TouchableOpacity>
    </>
  );
}
