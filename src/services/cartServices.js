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

// Obtener solo los datos del carrito del usuario
export const cartService = {
async getUserCart (userId) {
  try {
    if (!userId) {
      throw new Error('User ID es requerido');
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userSnap.data();
    
    return {
      cart: userData.cart || [],
      userInfo: {
        name: userData.name || '',
        email: userData.email || ''
      }
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo carrito:', error);
    throw error;
  }
},

// Obtener información detallada de los productos en el carrito
async getCartProductsDetails (productIds = []) {
  try {
    if (!productIds.length) return [];
    const productsPromises = productIds.map(async (productId) => {
      const productRef = doc(db, "Products",  productId);
      const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
      
        return {
          id:  productId,
          //...productSnap.data()
          name:productSnap.data().name,
          price:productSnap.data().price,
          image:productSnap.data().image[0],
          store:productSnap.data().store,
          quantity:1
        };
      }
      return null;
    });

    const products = await Promise.all(productsPromises);
    return products.filter(product => product !== null);
    
  } catch (error) {
    console.error('❌ Error obteniendo detalles de productos:', error);
    throw error;
  }
},

async deleteProductCart  (userId, productId) {
   try {
    const userRef = doc(db, 'users', userId);

    // Actualizar el documento
    await updateDoc(userRef, {
     cart: arrayRemove(productId)
    });
 
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
},

}
