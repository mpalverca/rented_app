import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection,
  query,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Función para mapear errores comunes de Firebase Auth
const mapAuthError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'El correo electrónico ya está en uso. Intenta iniciar sesión.';
    case 'auth/invalid-email':
      return 'Formato de correo electrónico inválido.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/user-not-found':
      return 'Credenciales inválidas. Usuario no encontrado.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential': // Para versiones más recientes de Firebase
      return 'Credenciales inválidas. La contraseña es incorrecta.';
    case 'auth/too-many-requests':
      return 'Acceso bloqueado temporalmente debido a demasiados intentos fallidos. Intenta más tarde.';
    default:
      console.error('Firebase Auth Error:', error);
      return error.message || 'Ocurrió un error desconocido durante la autenticación.';
  }
};

export const authService = {
  
  // 1. Validaciones
  validateCI(ci) {
    const ciRegex = /^\d{10}$/; // Implementar validación de dígito verificador para mayor robustez
    return ciRegex.test(ci);
  },

  validatePhone(phone) {
    const phoneRegex = /^\d{9,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // 2. Registro de Usuario
  async register(userData) {
  const { email, password, nombre, ci, telefono } = userData;

  // Validaciones de negocio (CI y Teléfono)
  if (!this.validateCI(ci)) {
    throw new Error('La cédula debe tener 10 dígitos (Verificar formato).');
  }
  if (!this.validatePhone(telefono)) {
    throw new Error('Número de teléfono inválido.');
  }

  // Verificar si CI ya existe en Firestore
  const ciExists = await this.checkCIExists(ci);
  if (ciExists) {
    throw new Error('Esta cédula ya está registrada.');
  }

  try {
    // 1. Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    //console.log('👤 Objeto user:', user);
    //console.log('📧 Email:', user.email);
    console.log('🔑 UID:', user.uid);
// 2. Actualizar perfil con nombre
    console.log('🔄 ACTUALIZANDO PERFIL...');
    try {
      await updateProfile(user, {
        displayName: nombre
      });
      console.log('✅ PERFIL ACTUALIZADO');
      //console.log('👤 DisplayName después de update:', user.displayName);
    } catch (profileError) {
      console.error('❌ ERROR ACTUALIZANDO PERFIL:', profileError);
      throw profileError;
    }

    // 3. Guardar datos adicionales en Firestore
    //console.log('💾 GUARDANDO EN FIRESTORE...');
    //console.log('📁 Ruta: users/', user.uid);
    
    const userDataForFirestore = {
      nombre,
      ci,
      telefono,
      email,
      createdAt: new Date(),
      role: 'user',
      active: true
    };
    
    // console.log('📄 Datos para Firestore:', userDataForFirestore);
    
    try {
      await setDoc(doc(db, 'users', user.uid), userDataForFirestore);
      //console.log('✅ DATOS GUARDADOS EN FIRESTORE');
    } catch (firestoreError) {
     // console.error('❌ ERROR GUARDANDO EN FIRESTORE:', firestoreError);
      throw firestoreError;
    }

    //console.log('🎉 REGISTRO COMPLETADO EXITOSAMENTE');
   
    return user;
  } catch (error) {
    //console.error('❌ Error en registro:', error);
   // console.error('Código de error:', error.code);
   // console.error('Mensaje de error:', error.message);
    throw new Error(this.mapAuthError(error));
  }
},



  // 3. Iniciar sesión con CI (Busca Email -> Login)
  async loginWithCI(ci, password) {
    // 1. Buscar email asociado a la CI
    const email = await this.getEmailByCI(ci);
    if (!email) {
      throw new Error('Cédula no registrada.');
    }

    // 2. Iniciar sesión con email y password
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  },

  // 4. Iniciar sesión con email
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  },
  
  // 5. Cerrar sesión
  async logout() {
    await signOut(auth);
  },

  // 6. Helpers de Firestore
  async checkCIExists(ci) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('ci', '==', ci));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  async getEmailByCI(ci) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('ci', '==', ci));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Debería haber solo un documento si 'ci' es único
      return querySnapshot.docs[0].data().email;
    }
    return null;
  },

  async getUserData(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  },

  // Obtener usuario actual (solo devuelve el objeto si ya está autenticado)
  getCurrentUser() {
    return auth.currentUser;
  }
};

export default authService;