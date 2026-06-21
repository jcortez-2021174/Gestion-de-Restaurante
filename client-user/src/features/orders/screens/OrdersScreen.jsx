// src/features/orders/screens/OrdersScreen.jsx
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useOrders } from '../hooks/useOrders';

export function OrdersScreen() {
  const navigation = useNavigation();
  const { orders, loading, error, fetchOrders } = useOrders();

  if (loading && !orders.length) {
    return <LoadingSpinner message="Cargando pedidos..." />;
  }

  if (error && !orders.length) {
    return <EmptyState title="No se pudieron cargar los pedidos" message={error} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id || item._id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('OrderDetail', { order: item })}>
            <Text style={styles.title}>#{item.id || item._id}</Text>
            <Text style={styles.status}>Estado: {item.estado || item.status}</Text>
            <Text style={styles.total}>Total: ${item.total || item.amount}</Text>
          </Card>
        )}
        ListEmptyComponent={<EmptyState title="Sin pedidos" message="Aún no tienes pedidos." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  total: {
    color: COLORS.primary,
    marginTop: SPACING.sm,
    fontWeight: '700',
  },
});
