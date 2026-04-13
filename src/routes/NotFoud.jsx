import { Box, Typography } from "@mui/material";
import React, { PureComponent } from "react";

export default class NotFoud extends PureComponent {
  render() {
    return (
      <Box
        sx={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: "80vh",
        }}
      >
     <Typography variant="h3" color="text.secondary">
         404 NotFoud
     </Typography>
      </Box>
    );
  }
}
