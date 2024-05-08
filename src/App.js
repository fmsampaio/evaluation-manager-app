import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import EvaluationPage from './Pages/EvaluationPage';
import EvaluationViewPage from './Pages/EvaluationViewPage';
import NoPage from './Pages/NoPage';
import HomePage from './Pages/HomePage';
import Layout from './Pages/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="evaluate" element={<EvaluationPage/>} />
          <Route path="view" element={<EvaluationViewPage/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
