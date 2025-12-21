import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSwitchProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[];
}

const TabSwitch: React.FC<TabSwitchProps> = ({ activeTab, onTabChange, tabs }) => (
  <View style={styles.tabContainer}>
    {tabs.map((tab) => (
      <TouchableOpacity
        key={tab}
        onPress={() => onTabChange(tab)}
        style={styles.tab}
      >
        <Text style={[
          styles.tabText,
          activeTab === tab && styles.activeTabText
        ]}>
          {tab}
        </Text>
        {activeTab === tab && <View style={styles.underline} />}
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000ff',
    marginBottom: 24,
    zIndex: 1,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#000',
  },
  underline: {
    position: 'absolute',
    zIndex: 2,
    bottom: -2,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#f6d44fff',
  },
});

export default TabSwitch;