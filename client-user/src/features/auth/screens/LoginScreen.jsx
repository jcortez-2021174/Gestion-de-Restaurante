// src/features/auth/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../../shared/components/common/Input';
import { Button } from '../../../shared/components/common/Button';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen() {
  const navigation = useNavigation();
  const { handleLogin, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    const ok = await handleLogin(values);
    if (!ok) {
      Alert.alert('Error', error || 'No se pudo iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/aurea_logo.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <Controller
        control={control}
        name="username"
        rules={{ required: 'El usuario es obligatorio' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Usuario"
            placeholder="usuario"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.username?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'La contraseña es obligatoria' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
          />
        )}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button title="Entrar" loading={loading} onPress={handleSubmit(onSubmit)} />

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: SPACING.xl,
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
