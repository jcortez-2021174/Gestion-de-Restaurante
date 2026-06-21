// src/features/profile/ProfileScreen.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../shared/store/authStore';
import restaurantClient from '../../shared/api/restaurantClient';
import { Button } from '../../shared/components/common/Button';
import { Input } from '../../shared/components/common/Input';
import { Card, LoadingSpinner } from '../../shared/components/common/Common';
import { COLORS, SPACING } from '../../shared/constants/theme';

export function ProfileScreen() {
  const { user, logout, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      surname: user?.surname || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.get('/cliente/perfil');
      const data = response.data?.data || response.data;
      if (data) {
        updateUser(data);
        reset({
          name: data.name || '',
          surname: data.surname || '',
          phone: data.phone || '',
          email: data.email || '',
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [updateUser, reset]);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    } else {
      reset({
        name: user.name || '',
        surname: user.surname || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user, fetchProfile, reset]);

  const handleSave = async (values) => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantClient.put('/cliente/perfil', values);
      const data = response.data?.data || response.data;
      updateUser(data);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al actualizar el perfil');
      Alert.alert('Error', error || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      surname: user?.surname || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const avatarUri = user?.avatar && user.avatar.startsWith('http') ? user.avatar : null;

  if (loading && !user) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Image source={require('../../../assets/avatarDefault.png')} style={styles.avatar} />
          )}
        </View>
        <Text style={styles.name}>{user?.name || ''} {user?.surname || ''}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Información personal</Text>

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
              editable={isEditing}
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
              editable={isEditing}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Teléfono"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{ required: 'El correo es obligatorio', pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Correo electrónico"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        {isEditing ? (
          <View style={styles.buttonRow}>
            <Button title="Cancelar" variant="secondary" onPress={handleCancel} style={styles.button} />
            <Button title="Guardar" onPress={handleSubmit(handleSave)} loading={loading} style={styles.button} />
          </View>
        ) : (
          <Button title="Editar perfil" onPress={() => setIsEditing(true)} />
        )}
      </Card>

      <Button title="Cerrar sesión" variant="secondary" onPress={handleLogout} style={styles.logoutButton} />
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  email: {
    color: COLORS.textLight,
    fontSize: 14,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  button: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  logoutButton: {
    marginTop: SPACING.lg,
  },
});
