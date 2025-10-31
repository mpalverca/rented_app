import {
  Grid,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";

const FilterBarHome = ({searchTerm,setSearchTerm,categoryFilter,setCategoryFilter,categories,sortBy,setSortBy,filteredProducts}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Buscar productos, tiendas o categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item size={{ xs: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoryFilter}
              label="Categoría"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category === "all" ? "Todas" : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              label="Ordenar por"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="popular">Más populares</MenuItem>
              <MenuItem value="rating">Mejor valorados</MenuItem>
              <MenuItem value="price-low">Precio: Menor a Mayor</MenuItem>
              <MenuItem value="price-high">Precio: Mayor a Menor</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {filteredProducts.length} productos encontrados
            </Typography>
            <Chip
              icon={<FilterList />}
              label="Filtros"
              variant="outlined"
              onClick={() => {
                /* Aquí podrías agregar más filtros */
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBarHome