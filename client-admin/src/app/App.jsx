import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../src/app/routes/AppRoutes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;