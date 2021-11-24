
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import DynamoUI from './pages/DynamoUI';
import { createTheme, ThemeProvider } from '@mui/material';
import DynamoImport from './pages/DynamoImport';
import DynamoCreateItem from './pages/DynamoCreateItem';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: "#fd7e14",
      light: "#ffc107",
      dark: "#ffc107"
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Layout>
      <Switch>
        <Route exact path="/" component={DynamoUI} />
        <Route path="/import" component={DynamoImport} />
        <Route path="/create-item" component={DynamoCreateItem} />
      </Switch>
      </Layout>
    </Router>
    </ThemeProvider>
  );
}

export default App;
