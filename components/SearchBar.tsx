import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { Row } from '@/components/Row';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  value: string;
  onChange: (s: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const colors = useThemeColors();
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (text: string) => {
    setLocalValue(text);
    onChange(text);
  };

  return (
    <Row
      style={[styles.wrapper, { backgroundColor: colors.grayWhite }]}
      gap={8}
    >
      <Image
        style={styles.image}
        source={require('@/assets/images/search.png')}
      />
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        value={localValue}
        placeholder="Search..."
        placeholderTextColor={colors.grayMedium}
      />
    </Row>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,
    alignItems: 'center', // Assurez-vous que les éléments sont alignés au centre
  },
  image: {
    width: 16,
    height: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    paddingVertical: 4, // Ajoutez un padding vertical pour centrer le texte verticalement
    justifyContent: 'flex-start',
  },
});
