import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Badge
} from '@mui/material';
import {
  Search,
  Favorite,
  FavoriteBorder,
  LocationOn,
  Store,
  CalendarToday,
  FilterList
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo - luego los reemplazarás con datos de Firestore
const sampleProducts = [
  {
    id: '1',
    nombre: 'Cámara Profesional Canon EOS R5',
    descripcion: 'Cámara mirrorless full-frame perfecta para fotografía profesional y video 8K',
    precio: 45.99,
    imagen: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    tienda: {
      id: 'store1',
      nombre: 'FotoRent Pro',
      ubicacion: 'Loja Centro'
    },
    categoria: 'Electrónicos',
    tags: ['fotografía', 'profesional', '8k'],
    rating: 4.8,
    reviews: 124,
    disponible: true
  },
  {
    id: '2',
    nombre: 'Drone DJI Mavic 3',
    descripcion: 'Drone profesional con cámara Hasselblad, ideal para tomas aéreas',
    precio: 89.99,
    imagen: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop',
    tienda: {
      id: 'store2',
      nombre: 'SkyTech Rentals',
      ubicacion: 'Loja Norte'
    },
    categoria: 'Drones',
    tags: ['aéreo', 'video', 'profesional'],
    rating: 4.9,
    reviews: 89,
    disponible: true
  },
  {
    id: '3',
    nombre: 'Laptop MacBook Pro 16"',
    descripcion: 'Laptop de alto rendimiento para trabajo y creatividad',
    precio: 65.50,
    imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    tienda: {
      id: 'store3',
      nombre: 'TechRent Solutions',
      ubicacion: 'Loja Sur'
    },
    categoria: 'Computación',
    tags: ['trabajo', 'diseño', 'programación'],
    rating: 4.7,
    reviews: 203,
    disponible: true
  },
  {
    id: '4',
    nombre: 'Equipo de Camping Completo',
    descripcion: 'Kit completo para camping incluye carpa, sleeping bags y más',
    precio: 35.00,
    imagen: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
    tienda: {
      id: 'store4',
      nombre: 'Aventura Outdoors',
      ubicacion: 'Loja Este'
    },
    categoria: 'Outdoor',
    tags: ['aventura', 'naturaleza', 'camping'],
    rating: 4.5,
    reviews: 67,
    disponible: true
  },
  {
    id: '5',
    nombre: 'Herramientas Profesionales',
    descripcion: 'Set completo de herramientas para proyectos de construcción',
    precio: 25.75,
    imagen: 'https://images.unsplash.com/photo-1572981779307-38f8b0456222?w=400&h=300&fit=crop',
    tienda: {
      id: 'store5',
      nombre: 'ConstruRent',
      ubicacion: 'Loja Oeste'
    },
    categoria: 'Herramientas',
    tags: ['construcción', 'bricolaje', 'hogar'],
    rating: 4.6,
    reviews: 156,
    disponible: false
  },
  {
    id: '6',
    nombre: 'Bicicleta Mountain Bike',
    descripcion: 'Bicicleta todo terreno para aventuras extremas',
    precio: 22.99,
    imagen: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    tienda: {
      id: 'store6',
      nombre: 'BikeRent Adventures',
      ubicacion: 'Loja Centro'
    },
    categoria: 'Deportes',
    tags: ['deporte', 'aventura', 'naturaleza'],
    rating: 4.4,
    reviews: 98,
    disponible: true
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const productsPerPage = 6;

  // Categorías únicas de los productos
  const categories = ['all', ...new Set(products.map(product => product.categoria))];

  // Filtros y búsqueda
  useEffect(() => {
    setLoading(true);
    
    let filtered = products;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tienda.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.categoria === categoryFilter);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.precio - b.precio);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.precio - a.precio);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
    setLoading(false);
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manejar favoritos
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Navegar al detalle del producto
  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
  };

  // Navegar a la tienda
  const handleStoreClick = (storeId, e) => {
    e.stopPropagation();
    navigate(`/tienda/${storeId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          borderRadius: 3,
          p: 6,
          mb: 6,
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🛍️ AL-CON
        </Typography>
         
        <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
          Encuentra todo lo que necesitas para alquilar en un solo lugar
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
         Todo lo que necesitas para tu construcción
        </Typography>
      </Box>

      {/* Filtros y Búsqueda */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Buscar productos, tiendas o categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoría"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'Todas' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="popular">Más populares</MenuItem>
                <MenuItem value="rating">Mejor valorados</MenuItem>
                <MenuItem value="price-low">Precio: Menor a Mayor</MenuItem>
                <MenuItem value="price-high">Precio: Mayor a Menor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} productos encontrados
              </Typography>
              <Chip 
                icon={<FilterList />} 
                label="Filtros" 
                variant="outlined" 
                onClick={() => {/* Aquí podrías agregar más filtros */}}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Grid de Productos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : currentProducts.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No se encontraron productos que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    },
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  {/* Badge de No Disponible */}
                  {!product.disponible && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}
                    >
                      NO DISPONIBLE
                    </Box>
                  )}

                  {/* Botón de Favoritos */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    {favorites.has(product.id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>

                  {/* Imagen del Producto */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imagen}
                    alt={product.nombre}
                    sx={{ objectFit: 'cover' }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Categoría */}
                    <Chip 
                      label={product.categoria} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />

                    {/* Nombre del Producto */}
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {product.nombre}
                    </Typography>

                    {/* Descripción */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {product.descripcion}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography>
                    </Box>

                    {/* Información de la Tienda */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        cursor: 'pointer'
                      }}
                      onClick={(e) => handleStoreClick(product.tienda.id, e)}
                    >
                      <Store fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {product.tienda.nombre}
                      </Typography>
                    </Box>

                    {/* Ubicación */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {product.tienda.ubicacion}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>

                    {/* Precio y Botón */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          ${product.precio}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /día
                        </Typography>
                      </Box>
                      
                      <Button
                        variant="contained"
                        disabled={!product.disponible}
                        sx={{
                          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                          '&:hover': {
                            background: "linear-gradient(45deg, #E64A19 30%, #FBC02D 90%)",
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Aquí iría la lógica para agregar al carrito o alquilar
                        }}
                      >
                        {product.disponible ? 'Alquilar' : 'No Disponible'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Sección de Categorías Populares */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Categorías Populares
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {categories.filter(cat => cat !== 'all').slice(0, 6).map((category) => (
            <Grid item size={{ xs: 6, sm: 4, md: 2 }} key={category}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setCategoryFilter(category)}
              >
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {category}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;