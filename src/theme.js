import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Grandstander",
    h2: {
      fontSize: 34,
      fontWeight: 700,
      lineHeight: "34px",
      '@media (min-width: 600px)': {
        fontSize: 60,
        lineHeight: "60px"
      }
    },
    h3: {
      fontSize: 28,
      fontWeight: 700,
      color: "#fff",
      '@media (min-width: 600px)': {
        fontSize: 35,
      }
    },
    h4: {
      fontSize: 40,
      fontWeight: 700,
      color: "#fff",
    },
    h5: {
      color: "#fff",
      fontWeight: 600,
      fontSize: 16,
      '@media (min-width: 600px)': {
        fontSize: 30,
      }
    },
    body2: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: "23px",
      color: "#fff",
    },
    body1: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: "130%",
      fontFamily: "WorkSans",
      '@media (min-width: 600px)': {
        fontSize: 24,
      }
    },
    caption: {
      fontSize: 22,
      color: "#fff",
      fontWeight: 600,
      lineHeight: 1
    }
  },
});
