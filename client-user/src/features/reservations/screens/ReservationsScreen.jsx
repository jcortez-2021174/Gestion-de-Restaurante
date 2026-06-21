// src/features/reservations/screens/ReservationsScreen.jsx
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/common/Button';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useReservations } from '../hooks/useReservations';

export function ReservationsScreen() {
  const navigation = useNavigation();
  const { reservations, loading, error, fetchReservations, cancelReservation } = useReservations();

  if (loading && !reservations.length) {
    return <LoadingSpinner message="Cargando reservas..." />;
  }

  if (error && !reservations.length) {
    return <EmptyState title="No se pudieron cargar las reservas" message={error} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Reservas</Text>
        <Button
          title="Nueva"
          variant="secondary"
          onPress={() => navigation.navigate('CreateReservation')}
        />
      </View>
      <FlatList
        data={reservations}
        keyExtractor={(item) => String(item.id || item._id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchReservations} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.label}>{item.fecha || item.date}</Text>
            <Text style={styles.label}>{item.hora || item.time}</Text>
            <Text style={styles.label}>Personas: {item.personas || item.people}</Text>
            <Text style={styles.status}>Estado: {item.estado || item.status}</Text>
            {(item.estado || item.status) !== 'cancelada' ? (
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => cancelReservation(item.id || item._id)}
              />
            ) : null}
          </Card>
        )}
        ListEmptyComponent={<EmptyState title="Sin reservas" message="Aún no tienes reservas." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  status: {
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
});
