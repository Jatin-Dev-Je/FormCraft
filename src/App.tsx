import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { store } from './store';
import { ROUTES } from './constants';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                upliance.ai Form Builder
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" href={ROUTES.CREATE}>
                  Create
                </Button>
                <Button color="inherit" href={ROUTES.PREVIEW}>
                  Preview
                </Button>
                <Button color="inherit" href={ROUTES.MY_FORMS}>
                  My Forms
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.MY_FORMS} replace />} />
            <Route path={ROUTES.CREATE} element={<CreateForm />} />
            <Route path={ROUTES.PREVIEW} element={<PreviewForm />} />
            <Route path={ROUTES.PREVIEW_WITH_ID} element={<PreviewForm />} />
            <Route path={ROUTES.MY_FORMS} element={<MyForms />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
