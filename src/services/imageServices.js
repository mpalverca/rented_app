// services/imageUploadService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";
//import { Storage } from "../config/firebase"; // Ajusta la ruta según tu configuración

export const uploadImageToFirebase = async (file, folder = 'products') => {
  try {
    // Crear un nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${folder}/${timestamp}_${randomString}_${file.name}`;
    
    // Crear referencia al archivo en Firebase Storage
    const storageRef = ref(storage, fileName);
    
    // Subir el archivo
    const snapshot = await uploadBytes(storageRef, file);
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("✅ Imagen subida exitosamente:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Error subiendo imagen:", error);
    throw new Error("No se pudo subir la imagen: " + error.message);
  }
};

export const uploadMultipleImages = async (files, folder = 'products') => {
  try {
    const uploadPromises = files.map(file => uploadImageToFirebase(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("❌ Error subiendo múltiples imágenes:", error);
    throw error;
  }
};