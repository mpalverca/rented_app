import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { getAllProductItems } from "../../services/productServices";
import FilterBarHome from "../../components/Navbar/barHome";
import ProductCard from "../../components/product/productCard";
import { getStoreNameById } from "../../services/storeServices";
import { useInfiniteProducts } from "../../components/product/infinityScroll";

const Home = () => {
  const navigate = useNavigate();
 // const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [categories, setCategories] = useState(["all"]);
  const productsPerPage = 6;

   const { 
      products, 
      loading, 
      loadingMore, 
      hasMore, 
      error: productsError,
      refresh 
    } = useInfiniteProducts();
console.log(products)
  // Cargar productos
 /*  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const itemData = await getAllProductItems();
      console.log("Datos crudos de productos:", itemData);

      if (itemData && Array.isArray(itemData)) {
        // Enriquecer productos con datos de la tienda
        const productsWithStoreData = await Promise.all(
          itemData.map(async (product) => {
            try {
              let storeData = null;

              // Obtener datos de la tienda si existe store
              if (product.store) {
                storeData = await getStoreNameById(product.store);
                //console.log(`Datos de tienda para ${product.store}:`, storeData);
              }

              // Si no hay storeData, usar valores por defecto
              if (!storeData) {
                storeData = {
                  nombre: "Tienda no disponible",
                  ubicacion: "Ubicación no especificada",
                  id: product.store || "default-store",
                };
              }

              // ✅ CORRECTO: Usar spread operator y mantener estructura consistente
              return {
                ...product,
                tienda: {
                  // ✅ Cambiar storeData a tienda para consistencia
                  id: storeData.id || product.store,
                  nombre:
                    storeData.nombre ||
                    storeData.name ||
                    "Tienda no disponible",
                },
              };
            } catch (error) {
              console.error("Error procesando producto:", product, error);
              // Retornar producto con datos básicos en caso de error
              return {
                ...product,
                tienda: {
                  id: product.store || "default-store",
                  nombre: "Tienda no disponible",
                  ubicacion: "Ubicación no disponible",
                },
                nombre: product.name || product.nombre || "Producto",
                descripcion: "Descripción no disponible",
                precio: 0,
                imagen:
                  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
                categoria: "Sin categoría",
                tags: [],
                rating: 4.0,
                reviews: 0,
                disponible: false,
              };
            }
          })
        );

        //console.log("Productos procesados:", productsWithStoreData);
        setProducts(productsWithStoreData);
        setFilteredProducts(productsWithStoreData);

        // Extraer categorías únicas
        const uniqueCategories = [
          "all",
          ...new Set(productsWithStoreData.map((product) => product.categoria)),
        ];
        setCategories(uniqueCategories);
      } else {
        setError("No se pudieron cargar los productos");
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("Error cargando productos: " + err.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }; */

  // Filtros y búsqueda
  useEffect(() => {
    if (products.length === 0) return;



    let filtered = [...products];

    // Filtro por búsqueda
   /*  if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          //(product.store?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) || // ✅ Buscar en tienda.nombre
          (product.tags &&
            product.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    } */

    // Filtro por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.categoria === categoryFilter
      );
    }

    // Ordenamiento
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.precio - b.precio);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.precio - a.precio);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Resetear a primera página al filtrar
    //setLoading(false);
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Cargar productos al montar el componente
  useEffect(() => {
    //loadProducts();
  }, []);

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manejar favoritos
  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
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
    navigate(`/product/${productId}`);
  };

 

  return (
    <Box  sx={{ py: 2, px:2}}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          borderRadius: 3,
          //p: 1,
          //mb: 1,
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          //gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          ALquiler-CONstrucción
        </Typography>
        <Typography variant="h5" sx={{ mb: 0, opacity: 0.9 }}>
          Encuentra todo lo que necesitas para alquilar en un solo lugar
        </Typography>
      </Box>

      {/* Filtros y Búsqueda */}
      {/* <FilterBarHome
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        filteredProducts={filteredProducts}
        sortBy={sortBy}
        setSortBy={setSortBy}
      /> */}

      {/* Mostrar error si existe */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Grid de Productos */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : currentProducts.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No se encontraron productos que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}  sx={{pt:2}}>
            {currentProducts.map((product) => (
              <Grid item size={{ xs: 12, sm: 6, md: 2 }} key={product.id}>
                {/* ✅ CORRECTO: Pasar todas las props correctamente */}

                <ProductCard
                  product={product} // ✅ Pasar como objeto
                  handleProductClick={handleProductClick} // ✅ Pasar función
                  toggleFavorite={toggleFavorite} // ✅ Pasar función
                  favorites={favorites} // ✅ Pasar Set
                 
                />
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
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
      {categories.length > 1 && (
        <Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {categories
              .filter((cat) => cat !== "all")
              .slice(0, 6)
              .map((category) => (
                <Grid item size={{ xs: 6, sm: 4, md: 2 }} key={category}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 0,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => setCategoryFilter(category)}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {category}
                    </Typography>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Home;
