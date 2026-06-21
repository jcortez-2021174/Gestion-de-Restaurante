// src/features/menu/screens/ProductDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Button } from '../../../shared/components/common/Button';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, SPACING } from '../../../shared/constants/theme';

export function ProductDetailScreen() {
  const route = useRoute();
  const { product } = route.params || {};

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {product.imagen ? (
          <Image source={{ uri: product.imagen }} style={styles.image} />
        ) : null}
        <Text style={styles.name}>{product.nombre}</Text>
        <Text style={styles.category}>{product.categoria}</Text>
        <Text style={styles.description}>{product.descripcion}</Text>
        <Text style={styles.price}>${product.precio}</Text>
      </Card>
      <Button title="Agregar al carrito" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  card: {
    marginBottom: SPACING.md,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  name: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  category: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  description: {
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
