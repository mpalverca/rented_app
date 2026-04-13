import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Container,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    ci: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { ci, password, remember } = JSON.parse(savedCredentials);
      if (remember) {
        setFormData({ ci, password });
        setRememberMe(true);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  // Guardar datos en localStorage
  const saveCredentials = (ci, password, remember) => {
    if (remember) {
      localStorage.setItem('savedCredentials', JSON.stringify({
        ci,
        password,
        remember: true
      }));
    } else {
      localStorage.removeItem('savedCredentials');
    }
  };

  // Guardar sesión actual
  const saveCurrentSession = (userData) => {
    const sessionData = {
      user: userData,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  // Verificar si la sesión ha expirado
  const isSessionValid = () => {
    const sessionData = localStorage.getItem('currentSession');
    if (sessionData) {
      const { expiresAt } = JSON.parse(sessionData);
      return new Date(expiresAt) > new Date();
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!authService.validateCI(formData.ci)) {
      setError('La cédula debe tener exactamente 10 dígitos');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.loginWithCI(formData.ci, formData.password);
      
      // Guardar credenciales si "Recordarme" está activado
      saveCredentials(formData.ci, formData.password, rememberMe);
      
      // Guardar sesión actual
      saveCurrentSession(userData);
      
      // Redirigir según el rol o página anterior
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo);
      
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
      // Limpiar cualquier dato de sesión inválido
      localStorage.removeItem('currentSession');
      sessionStorage.removeItem('isLoggedIn');
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar datos guardados
  const clearSavedCredentials = () => {
    localStorage.removeItem('savedCredentials');
    setFormData({ ci: '', password: '' });
    setRememberMe(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
              Usa tu cédula de identidad
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            {/* Indicador de sesión activa */}
            {isSessionValid() && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Tienes una sesión activa. ¿Deseas continuar?
                <Button 
                  size="small" 
                  onClick={() => navigate('/')}
                  sx={{ ml: 1 }}
                >
                  Ir al inicio
                </Button>
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Cédula de Identidad"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                placeholder="10 dígitos"
                error={formData.ci && !authService.validateCI(formData.ci)}
                helperText={
                  formData.ci && !authService.validateCI(formData.ci) 
                    ? 'La cédula debe tener 10 dígitos' 
                    : ''
                }
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Recordarme"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
              </Button>

              {/* Botón para limpiar datos guardados */}
              {localStorage.getItem('savedCredentials') && (
                <Box textAlign="center" sx={{ mb: 2 }}>
                  <Button
                    size="small"
                    onClick={clearSavedCredentials}
                    color="secondary"
                  >
                    Limpiar datos guardados
                  </Button>
                </Box>
              )}

              <Box textAlign="center">
                <Link component={RouterLink} to="/register" variant="body2">
                  ¿No tienes cuenta? Regístrate
                </Link>
              </Box>
              
              <Box textAlign="center" sx={{ mt: 2 }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Box>
          </Paper>
          
          {/* Indicador de almacenamiento local */}
          <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
            Tus datos de inicio de sesión se guardan de forma segura en tu navegador
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

// Servicio auxiliar para manejar localStorage
export const storageService = {
  // Guardar datos del usuario
  setUserData: (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },
  
  // Obtener datos del usuario
  getUserData: () => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  },
  
  // Guardar token de autenticación
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  
  // Obtener token
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },
  
  // Cerrar sesión (limpiar todo)
  logout: () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('isLoggedIn');
    // Opcional: mantener credenciales guardadas si "Recordarme" está activado
    // No removemos 'savedCredentials' para mantener la funcionalidad de "Recordarme"
  },
  
  // Verificar si hay sesión activa
  hasActiveSession: () => {
    const sessionData = localStorage.getItem('currentSession');
    if (sessionData) {
      const { expiresAt } = JSON.parse(sessionData);
      return new Date(expiresAt) > new Date();
    }
    return false;
  }
};

export default Login;