import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
const Header = () => {
  const handleLogout = () => {
    console.log("Logout clicked");
  };
  return (
    <AppBar color="primary" justifyContent="center" alignItems="center">
      <Toolbar style={{ justifyContent: "center" }}>
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
          justifyContent="flex-start"
        >
          {}
        </Box>
        <Typography variant="h6" align="center" style={{ flexGrow: 0 }}>
          LiveChat
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
          justifyContent="flex-end"
        >
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
