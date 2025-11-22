import { useState, useEffect, useCallback } from 'react';
import { productService,getProductItemsPaginated } from '../../services/productServices';
import { getStoreNameById } from '../../services/storeServices';

export const useInfiniteProductsStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [error, setError] = useState(null);

  // Cargar primera página
  const loadInitialProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await productService.getProductItemsPaginated();
      setProducts(result.products);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar más productos
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || !lastVisible) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const result = await productService.getProductItemsPaginated(lastVisible);
      setProducts(prev => [...prev, ...result.products]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastVisible]);

  // Detectar cuando el usuario llega al final de la página
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop 
        !== document.documentElement.offsetHeight || loadingMore) {
      return;
    }
    loadMoreProducts();
  }, [loadingMore, loadMoreProducts]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    refresh: loadInitialProducts,
    loadMore: loadMoreProducts
  };
};
export const useInfiniteProductsExtra = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [error, setError] = useState(null);

  // Cargar primera página
  const loadInitialProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await productService.getProductItemsPaginatedExtra();
      setProducts(result.products);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar más productos
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || !lastVisible) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const result = await productService.getProductItemsPaginated(lastVisible);
      setProducts(prev => [...prev, ...result.products]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastVisible]);

  // Detectar cuando el usuario llega al final de la página
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop 
        !== document.documentElement.offsetHeight || loadingMore) {
      return;
    }
    loadMoreProducts();
  }, [loadingMore, loadMoreProducts]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    refresh: loadInitialProducts,
    loadMore: loadMoreProducts
  };
};
export const useInfiniteProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [error, setError] = useState(null);

  // Cargar primera página
  const loadInitialProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProductItemsPaginated();
      /* if (result.product && Array.isArray(result.product)) {
        // Enriquecer productos con datos de la tienda
        const productsWithStoreData = await Promise.all(
          result.product.map(async (product) => {
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
        //etFilteredProducts(productsWithStoreData);

        // Extraer categorías únicas
        const uniqueCategories = [
          "all",
          ...new Set(productsWithStoreData.map((product) => product.categoria)),
        ];
        //setCategories(uniqueCategories);
      } else {
        setError("No se pudieron cargar los productos");
        setProducts([]);
        //setFilteredProducts([]);
      } */
      setProducts(result.products);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar más productos
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || !lastVisible) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const result = await getProductItemsPaginated(lastVisible);
      setProducts(prev => [...prev, ...result.products]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastVisible]);

  // Detectar cuando el usuario llega al final de la página
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop 
        !== document.documentElement.offsetHeight || loadingMore) {
      return;
    }
    loadMoreProducts();
  }, [loadingMore, loadMoreProducts]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    refresh: loadInitialProducts,
    loadMore: loadMoreProducts
  };
};