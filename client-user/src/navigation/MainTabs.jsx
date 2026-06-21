// src/navigation/MainTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuScreen } from '../features/menu/screens/MenuScreen';
import { ProductDetailScreen } from '../features/menu/screens/ProductDetailScreen';
import { ReservationsScreen } from '../features/reservations/screens/ReservationsScreen';
import { CreateReservationScreen } from '../features/reservations/screens/CreateReservationScreen';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
import { PointsScreen } from '../features/points/screens/PointsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { COLORS } from '../shared/constants/theme';

const Tab = createBottomTabNavigator();
const MenuStackNav = createNativeStackNavigator();
const ReservationsStackNav = createNativeStackNavigator();
const OrdersStackNav = createNativeStackNavigator();
const PointsStackNav = createNativeStackNavigator();

function MenuStack() {
  return (
    <MenuStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MenuStackNav.Screen name="MenuList" component={MenuScreen} />
      <MenuStackNav.Screen name="ProductDetail" component={ProductDetailScreen} />
    </MenuStackNav.Navigator>
  );
}

function ReservationsStack() {
  return (
    <ReservationsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ReservationsStackNav.Screen name="ReservationsList" component={ReservationsScreen} />
      <ReservationsStackNav.Screen name="CreateReservation" component={CreateReservationScreen} />
    </ReservationsStackNav.Navigator>
  );
}

function OrdersStack() {
  return (
    <OrdersStackNav.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStackNav.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStackNav.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStackNav.Navigator>
  );
}

function PointsStack() {
  return (
    <PointsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <PointsStackNav.Screen name="PointsScreen" component={PointsScreen} />
    </PointsStackNav.Navigator>
  );
}


export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'restaurant';
          if (route.name === 'Menu') iconName = 'restaurant-menu';
          if (route.name === 'Reservas') iconName = 'event';
          if (route.name === 'Pedidos') iconName = 'receipt-long';
          if (route.name === 'Puntos') iconName = 'stars';
          if (route.name === 'Perfil') iconName = 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuStack} options={{ title: 'Menú' }} />
      <Tab.Screen name="Reservas" component={ReservationsStack} options={{ title: 'Reservas' }} />
      <Tab.Screen name="Pedidos" component={OrdersStack} options={{ title: 'Pedidos' }} />
      <Tab.Screen name="Puntos" component={PointsStack} options={{ title: 'Puntos' }} />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.text,
        }}
      />
    </Tab.Navigator>
  );
}
