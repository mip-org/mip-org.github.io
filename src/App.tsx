import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import { Box } from "@mui/material";

export default function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}
