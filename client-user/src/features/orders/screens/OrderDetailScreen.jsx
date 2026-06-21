// src/features/orders/screens/OrderDetailScreen.jsx
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, SPACING } from '../../../shared/constants/theme';

export function OrderDetailScreen() {
  const route = useRoute();
  const { order } = route.params || {};

  if (!order) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pedido no encontrado</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Pedido #{order.id || order._id}</Text>
        <Text style={styles.label}>Estado: {order.estado || order.status}</Text>
        <Text style={styles.label}>Total: ${order.total || order.amount}</Text>
        <Text style={styles.label}>Fecha: {order.fecha || order.date}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
});
