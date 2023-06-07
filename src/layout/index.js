import { Box } from "../components/Box";
import Navbar from "./Navbar";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export const Layout = ({ children }) => (
  <Box
    css={{
      maxW: "100%"
    }}
  >
    <Navbar />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  </Box>
);
