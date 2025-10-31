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
} from "firebase/firestore";
import { db } from "../firebase/config";

export const productService = {
  async createProduct(productData, userId, storeId) {
    try {
      console.log("🔥 [createStore] Iniciando creación de tienda...");

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
      console.log("🔄 [addProductToStore] Agregando producto al inventario...");
      console.log("📦 Product ID:", productId);
      console.log("🏪 Store ID:", storeId);

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
   async getProductItemById (itemId) {
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
    const q = query(
      collection(db, "Products"),
      where("extra", "==", false)
    );
    
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
