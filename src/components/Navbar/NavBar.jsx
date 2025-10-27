import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/AuthContext"; // 👈 Importar el contexto

const pages = [
  { name: "Productos", path: "/rented_app" },
  { name: "Tiendas", path: "/analisis" },
];

const userSettings = [
  { name: "Perfil", path: "/perfil" },
  { name: "Cuenta", path: "/perfil/cuenta" },
  { name: "Panel", path: "/perfil/panel" },
  { name: "Mi Tienda", path: "/Store" },
];

export default function ResponsiveNavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // 👇 Usar el contexto de autenticación
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // 👇 Función de logout mejorada
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      handleCloseUserMenu();
      navigate("/login"); // Redirigir al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleSettingClick = (path) => {
    console.log(
      "userdat",
      userData.store == null ? "mover a create" : "no mover a create"
    );
    userData?.store == null ||
    (userData?.store == undefined && path == "/store")
      ? navigate("/create_store")
      : navigate(path);
    handleCloseUserMenu();
  };

  // Si está cargando, mostrar un loading sutil
  if (loading) {
    return (
      <AppBar
        position="static"
        style={{
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                color: "inherit",
              }}
            >
              Cargando...
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="static"
      style={{ background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Título - versión desktop */}
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              mr: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            AL-CON
          </Typography>
          {/* Menú hamburguesa - versión mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <NavLink
                    to={page.path}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Logo y título - versión mobile */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: "2rem",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              AL-CON
            </Typography>
          </Box>
          {/* Menú principal - versión desktop */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={NavLink}
                to={page.path}
                sx={{
                  my: 0.5,
                  color: "white",
                  display: "block",
                  mx: 1,
                  "&.active": {
                    borderBottom: "2px solid white",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          {/* Menú de usuario */}
          <Box
            sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
          >
            {user ? (
              <>
                {/* Bienvenida en desktop */}
                <Typography
                  variant="body1"
                  sx={{
                    display: { xs: "none", md: "block" },
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ¡Hola, {userData?.nombre || user.displayName || "Usuario"}!
                </Typography>

                <Tooltip title="Abrir menú de usuario">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={userData?.nombre || user.displayName}
                      src="/static/images/avatar/2.jpg"
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: "white",
                        color: "#FF5733",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      {(userData?.nombre || user.displayName || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* Información del usuario */}
                  <MenuItem disabled>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {userData?.nombre || user.displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                      {userData?.ci && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          CI: {userData.ci}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>

                  <MenuItem divider />

                  {/* Opciones del usuario */}
                  {userSettings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={() => handleSettingClick(setting.path)}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}

                  <MenuItem divider />

                  {/* Botón de cerrar sesión */}
                  <MenuItem
                    onClick={handleLogout}
                    disabled={loggingOut}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "white",
                      },
                    }}
                  >
                    {loggingOut ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        <Typography textAlign="center">Cerrando...</Typography>
                      </Box>
                    ) : (
                      <Typography
                        textAlign="center"
                        sx={{ fontWeight: "bold" }}
                      >
                        🚪 Cerrar Sesión
                      </Typography>
                    )}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Botones cuando NO está autenticado
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={handleLogin}
                  sx={{
                    backgroundColor: "white",
                    color: "#FF5733",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    fontWeight: "bold",
                  }}
                >
                  INICIAR SESIÓN
                </Button>

                <Button
                  onClick={handleRegister}
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                    },
                    fontWeight: "bold",
                  }}
                >
                  REGISTRARSE
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
