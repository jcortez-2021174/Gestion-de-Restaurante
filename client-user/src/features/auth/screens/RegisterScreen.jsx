// src/features/auth/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../../shared/components/common/Input';
import { Button } from '../../../shared/components/common/Button';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useAuth } from '../hooks/useAuth';

export function RegisterScreen() {
  const navigation = useNavigation();
  const { handleRegister, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (values) => {
    const ok = await handleRegister(values);
    if (ok) {
      Alert.alert('Éxito', 'Registro correcto. Ya puedes iniciar sesión.');
      navigation.navigate('Login');
      return;
    }
    Alert.alert('Error', error || 'No se pudo completar el registro');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear cuenta</Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'El nombre es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="surname"
          rules={{ required: 'El apellido es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Apellido"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.surname?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="username"
          rules={{ required: 'El usuario es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Usuario"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo inválido',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Correo"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{ required: 'El teléfono es obligatorio' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Teléfono"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
            />
          )}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button title="Registrarme" loading={loading} onPress={handleSubmit(onSubmit)} />

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  link: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontWeight: '600',
  },
});
