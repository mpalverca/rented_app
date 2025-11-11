import {

  updateDoc,
  doc,
  getDoc,

  arrayUnion,
 
} from "firebase/firestore";
import { db } from "../firebase/config";


export const notificationServices = {
  async addStoreNotification(storeId, notificationData) {
    try {
      const storeRef = doc(db, "stores", storeId);
      await updateDoc(storeRef, {
        notifications: arrayUnion({
          id: Date.now().toString(), // ID único
          ...notificationData,
          createdAt: new Date()
        })
      });
    } catch (error) {
      console.error("❌ Error agregando notificación:", error);
      throw error;
    }
  },

  async markNotificationAsRead(storeId, notificationId) {
    const storeRef = doc(db, "stores", storeId);
    const storeDoc = await getDoc(storeRef);
    const notifications = storeDoc.data().notifications || [];
    
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );

    await updateDoc(storeRef, {
      notifications: updatedNotifications
    });
  }
};