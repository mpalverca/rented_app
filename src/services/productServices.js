import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  arrayUnion,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { data } from "react-router-dom";

export const productService = {
  async createProduct(productData, userId, storeId) {
    try {
      const storeWithOwner = {
        ...productData,
        store: storeId,
        addby: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(db, "Products"), storeWithOwner);
      console.log("✅ [creaste Producto] Producto creado con ID:", docRef.id);
      return { id: docRef.id, ...storeWithOwner };
    } catch (error) {
      console.error("❌ [createStore] Error creando producto:", error);
      throw new Error("No se pudo crear el producto: " + error.message);
    }
  },

  async addProductToStore(productId, storeId) {
    try {
      // Referencia al documento de la tienda
      const storeRef = doc(db, "stores", storeId);

      // Actualizar el campo inventary usando arrayUnion
      await updateDoc(storeRef, {
        inventary: arrayUnion(productId),
      });
      console.log("✅ Producto agregado al inventario exitosamente");
      return true;
    } catch (error) {
      console.error("❌ [addProductToStore] Error agregando producto:", error);
      console.error("📋 Error code:", error.code);
      console.error("📝 Error message:", error.message);
      throw new Error(
        "No se pudo agregar el producto al inventario: " + error.message
      );
    }
  },
  // Obtener items por categoría
  async getAllProductItem(storeId) {
    try {
      if (!storeId) {
        throw new Error("Id Store requerida");
      }

      const q = query(
        collection(db, "Products"),
        where("store", "==", storeId)
        //select("name", "rate", "image", "tags", "price", "category", "store")
      );

      const querySnapshot = await getDocs(q);
      const items = [];

      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return items;
    } catch (error) {
      console.error("Error obteniendo items por categoría:", error);
      throw error;
    }
  },
  async getProductItemById(itemId) {
    try {
      if (!itemId) {
        throw new Error("ID del item es requerido");
      }

      const docRef = doc(db, "Products", itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        console.log("No se encontró el documento con ID:", itemId);
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo item del store:", error);
      throw error;
    }
  },
  async addProductToCart(productId, userId, storeId) {
    try {
      // Validaciones iniciales
      if (!productId || !userId) {
        throw new Error("Product ID y User ID son requeridos");
      }

      // Referencia al documento de usuario
      const userRef = doc(db, "users", userId);

      // Verificar que el usuario existe
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Usuario no encontrado");
      }

      const userData = userSnap.data();
      const userCart = userData.cart || [];

      // ✅ VALIDACIÓN: Solo verificar store si el carrito no está vacío
      if (userCart.length > 0) {
        const firstProductRef = doc(db, "Products", userCart[0]);
        const productSnap = await getDoc(firstProductRef);

        if (productSnap.exists()) {
          const firstProductStore = productSnap.data().store;
          console.log("Store del primer producto:", firstProductStore);
          console.log("Store del nuevo producto:", storeId);

          if (storeId !== firstProductStore) {
            throw new Error(
              "No puedes mezclar productos de diferentes tiendas. Este producto pertenece a otra tienda."
            );
          }
        }
      }
      // Si el carrito está vacío, no hay problema - agregar directamente

      // Verificar si el producto ya está en el carrito
      if (userCart.includes(productId)) {
        throw new Error("El producto ya está en el carrito");
      }

      // Actualizar SOLO el campo cart usando arrayUnion
      await updateDoc(userRef, {
        cart: arrayUnion(productId),
      });

      console.log("✅ Producto agregado al carrito exitosamente");
      return true;
    } catch (error) {
      console.error("❌ Error agregando producto al carrito:", error);
      console.error("📋 Error code:", error.code);
      console.error("📝 Error message:", error.message);
      throw new Error(
        "No se pudo agregar el producto al carrito: " + error.message
      );
    }
  },
  async getProductItemsPaginated(lastVisible = null, storeId) {
    const PAGE_SIZE = 10;
    try {
      let q;

      if (lastVisible) {
        // Si hay un último documento visible, empezar después de él
        q = query(
          collection(db, "Products"),
          where("store", "==", storeId),
          where("extra", "==", false),
          orderBy("name"), // Necesitas ordenar por algún campo para la paginación
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else {
        // Primera página
        q = query(
          collection(db, "Products"),
          where("extra", "==", false),
          orderBy("name"),
          limit(PAGE_SIZE)
        );
      }

      const querySnapshot = await getDocs(q);
      const items = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
        lastDoc = doc; // Guardar el último documento para la próxima paginación
      });
      return {
        products: items,
        lastVisible: lastDoc,
        hasMore: items.length === PAGE_SIZE, // Si hay más productos por cargar
      };
    } catch (error) {
      console.error("Error obteniendo productos paginados:", error);
      throw error;
    }
  },
  async getProductItemsPaginatedExtra(lastVisible = null, storeId) {
    const PAGE_SIZE = 10;
    try {
      let q;

      if (lastVisible) {
        // Si hay un último documento visible, empezar después de él
        q = query(
          collection(db, "Products"),
          where("store", "==", storeId),
          where("extra", "==", true),
          orderBy("name"), // Necesitas ordenar por algún campo para la paginación
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else {
        // Primera página
        q = query(
          collection(db, "Products"),
          where("extra", "==", true),
          orderBy("name"),
          limit(PAGE_SIZE)
        );
      }

      const querySnapshot = await getDocs(q);
      const items = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
        lastDoc = doc; // Guardar el último documento para la próxima paginación
      });
      console.log(items)
      return {
        products: items,
        lastVisible: lastDoc,
        hasMore: items.length === PAGE_SIZE, // Si hay más productos por cargar
      };
    } catch (error) {
      console.error("Error obteniendo productos paginados:", error);
      throw error;
    }
  },
   async productScroll(storeId, lastDoc = null, searchTerm = "", category = "") {
    try {
      const productRef = collection(db, "Products");
      
      // Construir la consulta base
      let constraints = [];
      
      // Filtro por tienda
      if (storeId) {
        constraints.push(where("store", "==", storeId));
      }
      
      // Filtro por categoría
      if (category && category !== "all") {
        constraints.push(where("category", "==", category));
      }
      
      // Ordenamiento por fecha de creación (para paginación consistente)
      constraints.push(orderBy("createdAt", "desc"));
      
      // Paginación
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }
      
      constraints.push(limit(PAGE_SIZE));
      
      const q = query(productRef, ...constraints);
      const snapshot = await getDocs(q);
      
      // Si hay término de búsqueda, filtrar localmente
      let productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Aplicar filtro de búsqueda por nombre si existe
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        productList = productList.filter(product => 
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const hasMore = snapshot.docs.length === PAGE_SIZE;
      
      return {
        productList: productList,
        lastDoc: lastVisible,
        hasMore: hasMore,
      };
    } catch (error) {
      console.error("Error cargando productos:", error);
      throw error;
    }
  },

  // Método para búsqueda con infinite scroll
  async searchProducts(storeId, searchTerm, category = "", lastDoc = null) {
    try {
      const productRef = collection(db, "Products");
      
      let constraints = [];
      
      // Filtro por tienda
      if (storeId) {
        constraints.push(where("store", "==", storeId));
      }
      
      // Filtro por categoría
      if (category && category !== "all") {
        constraints.push(where("category", "==", category));
      }
      
      // Para búsquedas, podrías usar array-contains si tienes tags
      // o hacer filtrado local como en el ejemplo anterior
      
      constraints.push(orderBy("createdAt", "desc"));
      
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }
      
      constraints.push(limit(PAGE_SIZE));
      
      const q = query(productRef, ...constraints);
      const snapshot = await getDocs(q);
      
      let productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Filtrado local para búsqueda (si no usas índices de Firestore)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        productList = productList.filter(product =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const hasMore = snapshot.docs.length === PAGE_SIZE;
      
      return {
        productList: productList,
        lastDoc: lastVisible,
        hasMore: hasMore,
      };
    } catch (error) {
      console.error("Error en búsqueda de productos:", error);
      throw error;
    }
  }
};
// Tamaño de página - cuántos productos cargar por vez
const PAGE_SIZE = 10;

export const getProductItemsPaginated = async (lastVisible = null) => {
  try {
    let q;

    if (lastVisible) {
      // Si hay un último documento visible, empezar después de él
      q = query(
        collection(db, "Products"),
        where("extra", "==", false),
        orderBy("name"), // Necesitas ordenar por algún campo para la paginación
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
    } else {
      // Primera página
      q = query(
        collection(db, "Products"),
        where("extra", "==", false),
        orderBy("name"),
        limit(PAGE_SIZE)
      );
    }

    const querySnapshot = await getDocs(q);
    const items = [];
    let lastDoc = null;

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
      lastDoc = doc; // Guardar el último documento para la próxima paginación
    });

    console.log("Productos paginados:", items.length);
    return {
      products: items,
      lastVisible: lastDoc,
      hasMore: items.length === PAGE_SIZE, // Si hay más productos por cargar
    };
  } catch (error) {
    console.error("Error obteniendo productos paginados:", error);
    throw error;
  }
};
// Obtener un objeto específico por ID desde la colección 'store'

// Obtener múltiples objetos por sus IDs
export const getStoreItemsByIds = async (itemIds) => {
  try {
    if (!itemIds || !Array.isArray(itemIds)) {
      throw new Error("Array de IDs es requerido");
    }

    // Filtrar IDs válidos
    const validIds = itemIds.filter((id) => id && typeof id === "string");

    if (validIds.length === 0) {
      return [];
    }

    const items = await Promise.all(
      validIds.map(async (id) => {
        try {
          return await productService.getProductItemById(id);
        } catch (error) {
          console.error(`Error obteniendo item ${id}:`, error);
          return null;
        }
      })
    );

    // Filtrar items nulos
    return items.filter((item) => item !== null);
  } catch (error) {
    console.error("Error obteniendo múltiples items:", error);
    throw error;
  }
};

// Obtener todos los items del store
export const getAllProductItems = async () => {
  try {
    // ✅ CORRECTO: Usar query() para combinar collection y where
    const q = query(collection(db, "Products"), where("extra", "==", false));

    const querySnapshot = await getDocs(q);
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Productos con extra=false:", items);
    return items;
  } catch (error) {
    console.error("Error obteniendo todos los items del store:", error);
    throw error;
  }
};

// Obtener items con filtros avanzados
export const getProductItemsWithFilters = async (filters = {}) => {
  try {
    let q = query(collection(db, "store"));

    // Aplicar filtros dinámicos
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    if (filters.isActive !== undefined) {
      q = query(q, where("isActive", "==", filters.isActive));
    }

    if (filters.minPrice !== undefined) {
      q = query(q, where("price", ">=", filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      q = query(q, where("price", "<=", filters.maxPrice));
    }

    if (filters.orderBy) {
      q = query(
        q,
        orderBy(filters.orderBy.field, filters.orderBy.direction || "asc")
      );
    }

    const querySnapshot = await getDocs(q);
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error obteniendo items con filtros:", error);
    throw error;
  }
};

// Agregar nuevo item al store
export const addProductItem = async (itemData) => {
  try {
    if (!itemData) {
      throw new Error("Datos del item son requeridos");
    }

    const docRef = await addDoc(collection(db, "store"), {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: docRef.id,
      ...itemData,
    };
  } catch (error) {
    console.error("Error agregando item al store:", error);
    throw error;
  }
};

// Actualizar item existente
export const updateProductItem = async (itemId, updateData) => {
  try {
    if (!itemId) {
      throw new Error("ID del item es requerido");
    }

    const docRef = doc(db, "store", itemId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    return {
      id: itemId,
      ...updateData,
    };
  } catch (error) {
    console.error("Error actualizando item:", error);
    throw error;
  }
};

// Eliminar item del store
export const deleteProductItem = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error("ID del item es requerido");
    }

    await deleteDoc(doc(db, "store", itemId));
    return true;
  } catch (error) {
    console.error("Error eliminando item:", error);
    throw error;
  }
};

// Verificar si un item existe
export const checkStoreItemExists = async (itemId) => {
  try {
    if (!itemId) {
      return false;
    }

    const docRef = doc(db, "store", itemId);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  } catch (error) {
    console.error("Error verificando existencia del item:", error);
    return false;
  }
};
