import { 
  collection, 
  addDoc,
  updateDoc,
  doc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const storeService = {
  async createStore(storeData, userId) {
    try {
      console.log('🔥 [createStore] Iniciando creación de tienda...');
      
      const storeWithOwner = {
        ...storeData,
        ownerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        activa: true,
        estado: 'activa'
      };

      const docRef = await addDoc(collection(db, 'stores'), storeWithOwner);
      console.log('✅ [createStore] Tienda creada con ID:', docRef.id);
      
      return { id: docRef.id, ...storeWithOwner };
      
    } catch (error) {
      console.error('❌ [createStore] Error creando tienda:', error);
      throw new Error('No se pudo crear la tienda: ' + error.message);
    }
  },

  async addStoreToUser(userId, storeId, storeName) {
    try {
      console.log('👤 [addStoreToUser] Iniciando actualización de usuario...');
      console.log('🆔 User ID:', userId);
      console.log('🏪 Store ID:', storeId);
      console.log('📛 Store Name:', storeName);
      
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        store: storeId
      });
      
      console.log(storeId,'✅Usuario actualizado exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ [addStoreToUser] Error actualizando usuario:', error);
      console.error('📋 Error code:', error.code);
      console.error('📝 Error message:', error.message);
      throw new Error('No se pudo actualizar el usuario: ' + error.message);
    }
  }
};