import { Print, Share } from "@mui/icons-material";
import { Box, Card, Chip, Grid, IconButton, Paper, Step, StepLabel, Stepper, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import React from "react";

const Head = ({
    rentedItem,
    getActiveStep,
    isMobile,
    ORDER_STEPS,
    handleShare,
    handlePrint,
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, p: { xs: 2, md: 3 } }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
        >
          {/* Título */}
          <Grid item size={{ xs: 12, md: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ 
                  whiteSpace: { xs: "normal", md: "nowrap" },
                  color: theme.palette.text.primary,
                }}
              >
                Detalle del Alquiler
              </Typography>
              <Chip
                label={`#${String(rentedItem.id).slice(-8).toUpperCase()}`}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                }}
              />
            </Box>
          </Grid>

          {/* Stepper - Ocupa el espacio central */}
          <Grid item size={{ xs: 12, md: "grow" }} sx={{ px: { md: 2 } }}>
            <Card
              sx={{
                overflow: "hidden",
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 5,
                py: 0.5,
                px: 1.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Stepper
                activeStep={getActiveStep()}
                alternativeLabel={!isMobile}
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{
                  "& .MuiStepConnector-line": {
                    borderColor: alpha(theme.palette.divider, 0.3),
                  },
                  "& .MuiStepLabel-label": {
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  },
                  "& .Mui-active .MuiStepLabel-label": {
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                  },
                  "& .Mui-completed .MuiStepLabel-label": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                {ORDER_STEPS.map((step, index) => (
                  <Step key={step.key}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            borderRadius: "50%",
                            bgcolor: index <= getActiveStep()
                              ? step.color
                              : alpha(theme.palette.action.disabled, 0.3),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            transition: "all 0.3s ease",
                            boxShadow: index <= getActiveStep()
                              ? `0 2px 8px ${alpha(step.color, 0.3)}`
                              : "none",
                          }}
                        >
                          {React.cloneElement(step.icon, {
                            sx: { fontSize: { xs: 16, sm: 20 } },
                          })}
                        </Box>
                      )}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          display: { xs: "none", sm: "block" },
                          fontSize: { sm: "0.7rem", md: "0.8rem" },
                        }}
                      >
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Card>
          </Grid>

          {/* Botones de acción */}
          <Grid item size={{ xs: 12, md: "auto" }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Tooltip title="Compartir">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    color: theme.palette.text.primary,
                    bgcolor: alpha(theme.palette.action.hover, 0.1),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: "translateY(-2px)",
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Imprimir">
                <IconButton
                  onClick={handlePrint}
                  sx={{
                    color: theme.palette.text.primary,
                    bgcolor: alpha(theme.palette.action.hover, 0.1),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: "translateY(-2px)",
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <Print />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Head;