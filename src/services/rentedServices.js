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
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { data } from "react-router-dom";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const rentedServices = {
  async createRented(productData, userId, storeId) {
    try {
      const cartData = {
        ...productData,
      };

      const cartRef = await addDoc(collection(db, "rented"), cartData);
      console.log("✅ [creaste Producto] Producto creado con ID:", cartRef.id);

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        rented: arrayUnion(cartRef.id),
        cart: [],
      });
      const storeRef = doc(db, "stores", storeId);
      await updateDoc(storeRef, {
        rented: arrayUnion(cartRef.id),
        notifications: arrayUnion({
          user: userId,
          rentedId: cartRef.id,
          message: `un usuario ha realizado un pedido, revisa tu rented`,
          type: "new_order",
          read: false,
          createdAt: new Date(),
        }),
      });
      return true;
    } catch (error) {
      console.error("❌ [createStore] Error creando producto:", error);
      throw new Error("No se pudo crear el producto: " + error.message);
    }
  },
  async getAllUserRented(userId) {
    try {
      if (!userId) {
        throw new Error("Usuario requerido");
      }

      const q = query(collection(db, "rented"), where("client", "==", userId));

      const querySnapshot = await getDocs(q);
      const items = [];

      // Usar Promise.all para obtener todas las tiendas en paralelo
      const rentedPromises = querySnapshot.docs.map(async (docSnap) => {
        const rentedData = docSnap.data();
        console.log("Datos del rented:", rentedData);
        console.log("Store ID:", rentedData.store);

        try {
          // Obtener información de la tienda - ✅ CORREGIDO
          const storeRef = doc(db, "stores", rentedData.store);
          const storeDoc = await getDoc(storeRef);

          // console.log("Datos de la tienda:", storeDoc.data());

          let storeInfo = {};
          if (storeDoc.exists()) {
            storeInfo = {
              id: storeDoc.id,
              name:
                storeDoc.data().nombre ||
                storeDoc.data().name ||
                "Tienda sin nombre", // ✅ Ambos posibles nombres
              email: storeDoc.data().email || "",
              phone: storeDoc.data().phone || "",
              address: storeDoc.data().address || "",
              image: storeDoc.data().image || "",
              rate: storeDoc.data().rate || 0,
            };
          } else {
            storeInfo = {
              id: rentedData.store,
              name: "Tienda no encontrada",
              email: "",
              phone: "",
              address: "",
              image: "",
              rate: 0,
            };
          }

          return {
            id: docSnap.id,
            //...rentedData,
            state: rentedData.state,
            length: rentedData.product.length,
            date: rentedData.dates.dateInit,
            total: rentedData.total,
            store: storeInfo,
          };
        } catch (storeError) {
          console.error(
            `Error obteniendo tienda ${rentedData.store}:`,
            storeError
          );
          return {
            id: docSnap.id,
            ...rentedData, // ✅ Mantener todos los datos del rented
            store: {
              id: rentedData.store,
              name: "Error cargando tienda",
              email: "",
              phone: "",
              address: "",
              image: "",
              rate: 0,
            },
          };
        }
      });

      const itemsWithStoreInfo = await Promise.all(rentedPromises);
      console.log("Items con información de tienda:", itemsWithStoreInfo);
      return itemsWithStoreInfo;
    } catch (error) {
      console.error("Error obteniendo alquileres del usuario:", error);
      throw error;
    }
  },
  async getRentedDetail(rentedId) {
    try {
      if (!rentedId) {
        throw new Error("Rentado requerido");
      }
      /* const q = query(
        collection(db, "rented"),
        where("client", "==", storeId)
        //select("name", "rate", "image", "tags", "price", "category", "store")
      ); */

      const docRef = doc(db, "rented", rentedId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        console.log("No se encontró el documento con ID:", rentedId);
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo items por categoría:", error);
      throw error;
    }
  },

  async getAllStoreRented(storeId) {
    try {
      if (!storeId) {
        throw new Error("tienda requerido");
      }
      const q = query(collection(db, "rented"), where("store", "==", storeId));

      const querySnapshot = await getDocs(q);
      const items = [];

      const rentedPromises = querySnapshot.docs.map(async (docSnap) => {
        const rentedData = docSnap.data();
        //console.log("Datos del rented:", rentedData);
        //console.log("user:", rentedData.client);

        try {
          // Obtener información de la tienda - ✅ CORREGIDO
          const userRef = doc(db, "users", rentedData.client);
          const userDoc = await getDoc(userRef);
          //        console.log("Datos de la tienda:", userDoc.data());
          let userInfo = {};
          if (userDoc.exists()) {
            userInfo = {
              id: userDoc.id,
              name: userDoc.data().nombre || userDoc.data().name,
              ci: userDoc.data().ci || "",
              phone: userDoc.data().phone || "",
              address: userDoc.data().address || "",
              image: userDoc.data().image || "",
              rate: userDoc.data().review.review || 0,
            };
          }

          return {
            id: docSnap.id,
            //...rentedData,
            state: rentedData.state,
            length: rentedData.product.length,
            date: rentedData.dates.dateInit,
            total: rentedData.total,
            client: userInfo,
          };
        } catch (storeError) {
          console.error(
            `Error obteniendo tienda ${rentedData.store}:`,
            storeError
          );
          return {
            id: docSnap.id,
            ...rentedData, // ✅ Mantener todos los datos del rented
            store: {
              id: rentedData.store,
              name: "Error cargando tienda",
              email: "",
              phone: "",
              address: "",
              image: "",
              rate: 0,
            },
          };
        }
      });
      /* console.log(rentedPromises)
       querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...rentedPromises
        });
      }); */
      const itemsWithStoreInfo = await Promise.all(rentedPromises);

      return itemsWithStoreInfo;
    } catch (error) {
      console.error("Error obteniendo items por categoría:", error);
      throw error;
    }
  },
  async addNoteRented(rentedId, note) {
    try {
      const rentedRef = doc(db, "rented", rentedId);
      await updateDoc(rentedRef, {
        notes: arrayUnion(note),
      });
    } catch (error) {
      console.error("error agregando nota;", error);
    }
  },
  async addproductRented(rentedId, product, store) {
    try {
      const rentedRef = doc(db, "rented", rentedId);
      await updateDoc(rentedRef, {
        product: arrayUnion(product),
        note: arrayUnion({
          by: store,
          date: new Date(),
          note: `Se ha agregado un nuevo producto de alquiler ${product.name}`,
        }),
      });
    } catch (error) {
      console.error("error agregando nota;", error);
    }
  },
  async acceptRented(rentedId, products, storeName) {
    try {
      const rentedRef = doc(db, "rented", rentedId);

      // Preparar los datos para la actualización
      const updateData = {
        state: "aceptado",
        updatedAt: new Date(),
      };

      // Si hay productos editados, actualizar el array de productos
      if (products && products.length > 0) {
        updateData.product = products; // Reemplaza todo el array de productos
      }

      // Agregar la nota de aceptación
      if (storeName) {
        updateData.notes = arrayUnion({
          id: Date.now().toString(),
          note: "El pedido ha sido aceptado por la tienda",
          by: storeName,
          date: new Date().toISOString(),
        });
      }

      // Ejecutar la actualización en Firebase
      await updateDoc(rentedRef, updateData);

      console.log("Pedido aceptado exitosamente");
      return { success: true, message: "Pedido aceptado correctamente" };
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      return {
        success: false,
        message: "Error al aceptar el pedido: " + error.message,
      };
    }
  },
  async changeDatesRented(rentedId, dates, days, storeName, motivo) {
    try {
      const rentedRef = doc(db, "rented", rentedId);
      // Preparar los datos para la actualización
      const updateData = {
        state: "aceptado",
        dates: dates,
        days: days,
      };
      // Agregar la nota de aceptación
      if (storeName) {
        updateData.notes = arrayUnion({
          id: Date.now().toString(),
          note:
            "la fecha ha sido cambiada de fecha" +
            formatDate(dates.datesInit) +
            "a la fecha" +
            formatDate(dates.dateEnd) +
            "con los dias" +
            days +
            ",por motivo de" +
            motivo,
          by: storeName,
          date: new Date().toISOString(),
        });
      }
      // Ejecutar la actualización en Firebase
      await updateDoc(rentedRef, updateData);

      console.log("Pedido aceptado exitosamente");
      return { success: true, message: "Pedido aceptado correctamente" };
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      return {
        success: false,
        message: "Error al aceptar el pedido: " + error.message,
      };
    }
  },
  async addCarInRented(rentedId, carInit, storeName, motivo) {
    try {
      const rentedRef = doc(db, "rented", rentedId);
      // Preparar los datos para la actualización
      const updateData = {
        carInt: carInit,
      };
      // Agregar la nota de aceptación
      if (storeName) {
        updateData.notes = arrayUnion({
          id: Date.now().toString(),
          note:
            "se ha agregado a" +
            carInit.own +
            "para la carrera, con vehiculo de placas" +
            carInit.placa,
          by: storeName,
          date: new Date().toISOString(),
        });
      }
      // Ejecutar la actualización en Firebase
      await updateDoc(rentedRef, updateData);

      console.log("Pedido aceptado exitosamente");
      return { success: true, message: "Pedido aceptado correctamente" };
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      return {
        success: false,
        message: "Error al aceptar el pedido: " + error.message,
      };
    }
  },
  async addCarOutRented(rentedId, carEnd, storeName, motivo) {
    try {
      const rentedRef = doc(db, "rented", rentedId);
      // Preparar los datos para la actualización
      const updateData = {
        carInt: carEnd,
      };
      // Agregar la nota de aceptación
      if (storeName) {
        updateData.notes = arrayUnion({
          id: Date.now().toString(),
          note:
            "se ha agregado a" +
            carEnd.own +
            "para la carrera, con vehiculo de placas" +
            carEnd.placa,
          by: storeName,
          date: new Date().toISOString(),
        });
      }
      // Ejecutar la actualización en Firebase
      await updateDoc(rentedRef, updateData);

      console.log("Pedido aceptado exitosamente");
      return { success: true, message: "Pedido aceptado correctamente" };
    } catch (error) {
      console.error("Error al aceptar el pedido:", error);
      return {
        success: false,
        message: "Error al aceptar el pedido: " + error.message,
      };
    }
  },
};

export default rentedServices;
