import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';
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

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    ci: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    if (!authService.validateCI(formData.ci)) {
      setError('La cédula debe tener exactamente 10 dígitos');
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
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
              Crear Cuenta
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item size={{ xs:12, sm:6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Nombre Completo"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    autoComplete="name"
                    autoFocus
                  />
                </Grid>
                
                <Grid item size={{ xs:12, sm:6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Cédula de Identidad"
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    inputProps={{ maxLength: 10 }}
                    placeholder="10 dígitos"
                    error={formData.ci && !authService.validateCI(formData.ci)}
                    helperText={
                      formData.ci && !authService.validateCI(formData.ci) 
                        ? 'La cédula debe tener 10 dígitos' 
                        : ''
                    }
                  />
                </Grid>
                
                <Grid item size={{ xs:12, sm:6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 0987654321"
                  />
                </Grid>
                
                <Grid item size={{ xs:1, sm:6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </Grid>
                
                <Grid item size={{ xs:12, sm:6 }}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </Grid>
                
                <Grid item size={{ xs:12, sm:6 }}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Repetir Contraseña"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                    helperText={
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'Las contraseñas no coinciden' 
                        : ''
                    }
                  />
                </Grid>
                
                <Grid item size={{ xs:1, sm:6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Acepto los{' '}
                        <Link href="/terminos" target="_blank">
                          términos y condiciones
                        </Link>
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color=''
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Registrarse'}
              </Button>

              <Box textAlign="center">
                <Link component={RouterLink} to="/login" variant="body2">
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;