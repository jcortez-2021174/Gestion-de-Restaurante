// src/features/points/screens/PointsScreen.jsx
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { usePoints } from '../hooks/usePoints';

export function PointsScreen() {
  const { points, loading, error, fetchPoints } = usePoints();

  if (loading && !points) {
    return <LoadingSpinner message="Cargando puntos..." />;
  }

  if (error && !points) {
    return <EmptyState title="No se pudieron cargar los puntos" message={error} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPoints} />}
    >
      <Card style={styles.card}>
        <Text style={styles.label}>Puntos disponibles</Text>
        <Text style={styles.points}>{points?.total || points?.puntos || 0}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Recompensas disponibles</Text>
        <Text style={styles.rewardText}>Próximamente</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.md,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  points: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  rewardText: {
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
});
