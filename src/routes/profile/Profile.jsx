import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import {
  Person,
  Edit,
  ShoppingBag,
  Favorite,
  LocationOn,
  Email,
  Phone,
  CalendarToday
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

// Datos de ejemplo - en una app real estos vendrían de tu API
const mockUserData = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  phone: '+1 234 567 8900',
  joinDate: '2024-01-15',
  avatar: '/static/images/avatar/1.jpg',
  address: 'Calle Principal 123, Ciudad, País',
  bio: 'Apasionado por la tecnología y las compras online.',
  stats: {
    orders: 12,
    favorites: 8,
    reviews: 5
  },
  recentOrders: [
    { id: 'ORD-001', date: '2024-03-15', total: 150.00, status: 'Entregado' },
    { id: 'ORD-002', date: '2024-03-10', total: 89.99, status: 'En camino' },
    { id: 'ORD-003', date: '2024-03-05', total: 45.50, status: 'Entregado' }
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const { userId } = useParams(); // Obtener el ID del usuario de la URL
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del usuario
    const loadUserData = async () => {
      setLoading(true);
      try {
        // En una app real, aquí harías una llamada a tu API
        // const userData = await userService.getUserById(userId);
        setTimeout(() => {
          setUser(mockUserData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Cargando perfil...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Usuario no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      {/* Header del Perfil */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 3,
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
          }
        }}
      >
        <Box position="relative" zIndex={1}>
          <Grid container spacing={3} alignItems="center">
            <Grid item size={{xs:12, md:3}} sx={{ textAlign: 'center' }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'white',
                  boxShadow: 3
                }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Button
                variant="contained"
                startIcon={<Edit />}
                sx={{ 
                  mt: 1,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                Editar Foto
              </Button>
            </Grid>

            <Grid item size={{xs:12, md:6}}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                {user.bio}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<ShoppingBag />}
                  label={`${user.stats.orders} Pedidos`}
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
                <Chip
                  icon={<Favorite />}
                  label={`${user.stats.favorites} Favoritos`}
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
              </Box>
            </Grid>

            <Grid item size={{xs:12, md:3}}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<Edit />}
                sx={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#FF5733',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Editar Perfil
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Información de Contacto */}
      <Grid container spacing={3}>
        <Grid item size={{xs:12,}}>
          <Card 
            elevation={2}
            sx={{
              border: '2px solid transparent',
              background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #FF5733 20%, #FFD700 90%) border-box',
            }}
          >
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{
                  background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 'bold'
                }}
              >
                Información de Contacto
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: '#FF5733' }} />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone sx={{ color: '#FF5733' }} />
                  </ListItemIcon>
                  <ListItemText primary="Teléfono" secondary={user.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn sx={{ color: '#FF5733' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dirección" secondary={user.address} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday sx={{ color: '#FF5733' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Miembro desde" 
                    secondary={new Date(user.joinDate).toLocaleDateString('es-ES')} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

       
      </Grid>

      {/* Estadísticas rápidas */}
      
    </Container>
  );
}