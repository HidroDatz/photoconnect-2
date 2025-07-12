import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getBookingsForUser } from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Card from '../../components/shared/Card';

const BookingsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = getBookingsForUser(user.uid, (data) => {
        setBookings(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: theme.colors.primary, ...styles.statusText };
      case 'pending':
        return { color: 'orange', ...styles.statusText };
      case 'cancelled':
      case 'declined':
        return { color: theme.colors.error, ...styles.statusText };
      default:
        return styles.statusText;
    }
  };

  const renderBooking = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Booking', { bookingId: item.id })}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.photographerName}>{item.photographerName}</Text>
          <Text style={getStatusStyle(item.status)}>{item.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.serviceName}>{item.service?.name || 'No service selected'}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      {bookings.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You have no bookings.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  photographerName: {
    ...theme.typography.h3,
  },
  statusText: {
    ...theme.typography.body2,
    fontWeight: 'bold',
  },
  serviceName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  date: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  }
});

export default BookingsScreen;
