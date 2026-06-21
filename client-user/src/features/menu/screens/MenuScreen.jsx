// src/features/menu/screens/MenuScreen.jsx
import React from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useMenu } from '../hooks/useMenu';

export function MenuScreen() {
  const navigation = useNavigation();
  const { items, loading, error, fetchMenu } = useMenu();

  const grouped = items.reduce((acc, item) => {
    const key = item.categoria || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (loading && !items.length) {
    return <LoadingSpinner message="Cargando menú..." />;
  }

  if (error && !items.length) {
    return <EmptyState title="No se pudo cargar el menú" message={error} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMenu} />}
    >
      {Object.entries(grouped).map(([category, list]) => (
        <View key={category} style={styles.section}>
          <Text style={styles.sectionTitle}>{category}</Text>
          {list.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <Card style={styles.card}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.description}>{item.descripcion}</Text>
                <View style={styles.row}>
                  <Text style={styles.price}>${item.precio}</Text>
                  <Text style={item.disponible ? styles.available : styles.unavailable}>
                    {item.disponible ? 'Disponible' : 'No disponible'}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  card: {
    marginBottom: SPACING.sm,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  price: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  available: {
    color: COLORS.success,
  },
  unavailable: {
    color: COLORS.error,
  },
});
