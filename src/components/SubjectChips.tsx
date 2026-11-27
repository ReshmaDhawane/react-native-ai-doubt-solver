import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SUBJECTS, SubjectId } from '../types/chat';

interface Props {
  selected: SubjectId;
  onSelect: (id: SubjectId) => void;
}

export function SubjectChips({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {SUBJECTS.map((s) => {
        const active = s.id === selected;
        return (
          <Pressable
            key={s.id}
            onPress={() => onSelect(s.id)}
            style={[styles.chip, active && styles.active]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{s.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 8, paddingVertical: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#3f51b5', marginHorizontal: 4 },
  active: { backgroundColor: '#3f51b5' },
  label: { color: '#3f51b5' },
  activeLabel: { color: '#fff' },
});
