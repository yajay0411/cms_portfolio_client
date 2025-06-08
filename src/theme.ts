import { createTheme } from '@mui/material/styles';

const mobileFactor = 0.85;

export const themeVars = {
  // Light Mode
  primaryLight: '#7F00FF',
  secondaryLight: '#2196f3',
  backgroundLight: '#FFFFFF',
  paperLight: '#F8F5FF',
  textPrimaryLight: '#1A1A1A',
  textSecondaryLight: '#4A4A4A',

  // Dark Mode
  primaryDark: '#B388FF',
  secondaryDark: '#90caf9',
  backgroundDark: '#121212',
  paperDark: '#1E1A24',
  textPrimaryDark: '#F5F5F5',
  textSecondaryDark: '#B0A8B9',

  // Typography
  fontFamily: `'DM Sans', sans-serif`,
  fontSizeBase: '14px', // Slightly larger base for readability
  fontSizeH1: '40px',
  fontSizeH2: '32px',
  fontSizeH3: '24px',
  fontSizeH4: '20px',
  fontSizeH5: '16px',
  fontSizeH6: '14px',
};

// Helper function to create responsive typography
const createResponsiveTypography = (isMobile = false) => {
  const factor = isMobile ? mobileFactor : 1;

  return {
    fontFamily: themeVars.fontFamily,
    fontSize: parseInt(themeVars.fontSizeBase) * factor,
    h1: {
      fontFamily: themeVars.fontFamily,
      fontSize: `calc(${themeVars.fontSizeH1} * ${factor})`,
      fontWeight: 700,
    },
    h2: {
      fontFamily: themeVars.fontFamily,
      fontSize: `calc(${themeVars.fontSizeH2} * ${factor})`,
      fontWeight: 600,
    },
    h3: {
      fontFamily: themeVars.fontFamily,
      fontSize: `calc(${themeVars.fontSizeH3} * ${factor})`,
      fontWeight: 500,
    },
    h4: {
      fontFamily: themeVars.fontFamily,
      fontSize: `calc(${themeVars.fontSizeH4} * ${factor})`,
      fontWeight: 500,
    },
    h5: {
      fontFamily: themeVars.fontFamily,
      fontSize: `calc(${themeVars.fontSizeH5} * ${factor})`,
      fontWeight: 400,
    },
    h6: {
      fontFamily: themeVars.fontFamily,
      fontSize: `calc(${themeVars.fontSizeH6} * ${factor})`,
      fontWeight: 400,
    },
  };
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: themeVars.primaryLight,
    },
    secondary: {
      main: themeVars.secondaryLight,
    },
    background: {
      default: themeVars.backgroundLight,
      paper: themeVars.paperLight,
    },
    text: {
      primary: themeVars.textPrimaryLight,
      secondary: themeVars.textSecondaryLight,
    },
  },
  typography: createResponsiveTypography(false),
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition:
            'background-color 0.5s ease-in-out, color 0.5s ease-in-out',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: themeVars.primaryDark,
    },
    secondary: {
      main: themeVars.secondaryDark,
    },
    background: {
      default: themeVars.backgroundDark,
      paper: themeVars.paperDark,
    },
    text: {
      primary: themeVars.textPrimaryDark,
      secondary: themeVars.textSecondaryDark,
    },
  },
  typography: createResponsiveTypography(false),
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition:
            'background-color 0.5s ease-in-out, color 0.5s ease-in-out',
        },
      },
    },
  },
});

// Function to get responsive theme based on dark mode and screen size
export const getTheme = (isDarkMode: boolean, isMobile: boolean) => {
  // Create the base theme based on light/dark preference
  const baseTheme = isDarkMode ? darkTheme : lightTheme;

  // Apply responsive typography based on screen size
  return createTheme({
    ...baseTheme,
    typography: createResponsiveTypography(isMobile),
  });
};
