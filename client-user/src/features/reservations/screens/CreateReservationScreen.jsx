// src/features/reservations/screens/CreateReservationScreen.jsx
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../shared/components/common/Button';
import { Input } from '../../../shared/components/common/Input';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useReservations } from '../hooks/useReservations';

export function CreateReservationScreen() {
  const navigation = useNavigation();
  const { createReservation, loading, error } = useReservations();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: '',
      hora: '',
      personas: '',
    },
  });

  const onSubmit = async (values) => {
    const ok = await createReservation({
      fecha: values.fecha,
      hora: values.hora,
      personas: Number(values.personas),
    });
    if (ok) {
      Alert.alert('Éxito', 'Reserva creada correctamente.');
      navigation.goBack();
      return;
    }
    Alert.alert('Error', error || 'No se pudo crear la reserva');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="fecha"
        rules={{ required: 'La fecha es obligatoria' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Fecha"
            placeholder="YYYY-MM-DD"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.fecha?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="hora"
        rules={{ required: 'La hora es obligatoria' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Hora"
            placeholder="HH:MM"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.hora?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="personas"
        rules={{ required: 'Las personas son obligatorias' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Personas"
            keyboardType="number-pad"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.personas?.message}
          />
        )}
      />
      <Button title="Guardar reserva" loading={loading} onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
});
