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
} from "firebase/firestore";
import { db } from "../firebase/config";

export const storeService = {
  async createStore(storeData, userId) {
    try {
      console.log("🔥 [createStore] Iniciando creación de tienda...");

      const storeWithOwner = {
        ...storeData,
        ownerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        activa: true,
        estado: "activa",
        Schedule: getDefaultSchedule(),
      };

      const docRef = await addDoc(collection(db, "stores"), storeWithOwner);
      console.log("✅ [createStore] Tienda creada con ID:", docRef.id);

      return { id: docRef.id, ...storeWithOwner };
    } catch (error) {
      console.error("❌ [createStore] Error creando tienda:", error);
      throw new Error("No se pudo crear la tienda: " + error.message);
    }
  },
  async addStoreToUser(userId, storeId, storeName) {
    try {
      console.log("👤 [addStoreToUser] Iniciando actualización de usuario...");
      console.log("🆔 User ID:", userId);
      console.log("🏪 Store ID:", storeId);
      console.log("📛 Store Name:", storeName);

      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        store: storeId,
      });

      console.log(storeId, "✅Usuario actualizado exitosamente");
      return true;
    } catch (error) {
      console.error("❌ [addStoreToUser] Error actualizando usuario:", error);
      console.error("📋 Error code:", error.code);
      console.error("📝 Error message:", error.message);
      throw new Error("No se pudo actualizar el usuario: " + error.message);
    }
  },
  async getStoreItemById(itemId) {
    try {
      if (!itemId) {
        throw new Error("ID del item es requerido");
      }

      const docRef = doc(db, "stores", itemId);
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
  async getStoreItem(itemId) {
    try {
      if (!itemId) {
        throw new Error("ID del item es requerido");
      }

      const docRef = doc(db, "stores", itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          nombre: docSnap.data().nombre,
          ubicacion: docSnap.data().ubicacion,
          social: docSnap.data().social,
          schedule: docSnap.data().schedule,
          imagen: docSnap.data().imagen,
          telefono: docSnap.data().telefono,
          desc: docSnap.data().descripcion,
          email: docSnap.data().email,
          direccion: docSnap.data().direccion,
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
  async getStoreName(storeId){
    try {
      if (!storeId) {
        throw new Error("ID del item es requerido");
      }

      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          nombre: docSnap.data().nombre,
          ubicacion: docSnap.data().ubicacion,         
          imagen: docSnap.data().imagen,
          telefono: docSnap.data().telefono,
          direccion: docSnap.data().direccion,
        };
      } else {
        console.log("No se encontró el documento con ID:", storeId);
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo item del store:", error);
      throw error;
    }
  },
  async getAllStores(){
    try {
      const storeDoc = collection(db,"stores");
      const storeSnap = await getDocs(storeDoc);
      const storeList = storeSnap.docs.map(doc=>(
        {
          id: doc.id,
          ...doc.data()
        }
      ));
      return storeList;
    }catch(error){
      console.log("error:",error)
    }
  }
};

export const timerStoreServices = {
  async getStoreSchedule(storeId) {
    try {
      if (!storeId) {
        throw new Error("ID de la tienda es requerido");
      }

      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(docSnap.data().schedule);
        return data.schedule || getDefaultSchedule(); // Retorna horario o uno por defecto
      } else {
        throw new Error("Tienda no encontrada");
      }
    } catch (error) {
      console.error("Error obteniendo horario de la tienda:", error);
      throw error;
    }
  },
  async updateStoreSchedule(storeId, schedule) {
    try {
      if (!storeId) {
        throw new Error("ID de la tienda es requerido");
      }

      const docRef = doc(db, "stores", storeId);
      await updateDoc(docRef, {
        schedule: schedule,
        updatedAt: new Date(),
      });

      console.log("Horario actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error actualizando horario:", error);
      throw error;
    }
  },
};
export const getDefaultSchedule = () => [
  {
    day: "Lunes",
    time_am: ["08:00", "12:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
  {
    day: "Martes",
    time_am: ["08:00", "12:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
  {
    day: "Miércoles",
    time_am: ["08:00", "12:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
  {
    day: "Jueves",
    time_am: ["08:00", "12:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
  {
    day: "Viernes",
    time_am: ["08:00", "12:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
  {
    day: "Sábado",
    time_am: ["08:00", "13:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
  {
    day: "Domingo",
    time_am: ["08:00", "13:00"],
    time_pm: ["13:00", "18:00"],
    enabled: true,
  },
];
// Obtener un objeto específico por ID desde la colección 'store'

// Obtener un objeto específico por ID desde la colección 'store'
export const getStoreNameById = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error("ID del item es requerido");
    }
    const docRef = doc(db, "stores", itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        //...docSnap.data()
        nombre: docSnap.data().nombre,
      };
    } else {
      console.log("No se encontró el documento con ID:", itemId);
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo item del store:", error);
    throw error;
  }
};

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
          return await storeService.getStoreItemById(id);
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
export const getAllStoreItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "store"));
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error obteniendo todos los items del store:", error);
    throw error;
  }
};

// Obtener items por categoría
export const getStoreItemsByCategory = async (category) => {
  try {
    if (!category) {
      throw new Error("Categoría es requerida");
    }

    const q = query(collection(db, "store"), where("category", "==", category));

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
};

// Obtener items con filtros avanzados
export const getStoreItemsWithFilters = async (filters = {}) => {
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
export const addStoreItem = async (itemData) => {
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
export const updateStoreItem = async (itemId, updateData) => {
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
export const deleteStoreItem = async (itemId) => {
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
