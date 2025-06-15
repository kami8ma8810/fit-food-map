import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  value?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ 
  placeholder = "店舗名やメニューを検索", 
  onSearch, 
  onClear,
  value: externalValue,
  autoFocus = false 
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = externalValue !== undefined ? () => {} : setInternalValue;

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    if (onClear) {
      onClear();
    } else {
      onSearch('');
    }
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    if (text.trim() === '') {
      onSearch('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#6b7280" 
          style={styles.searchIcon}
          accessibilityLabel="検索アイコン"
        />
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={autoFocus}
          accessibilityLabel="検索入力フィールド"
          accessibilityHint="店舗名やメニュー名を入力して検索できます"
        />
        
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="検索クリア"
            accessibilityHint="検索文字列をクリアします"
          >
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});