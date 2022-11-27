import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Veiculos from './views/pages/veiculos';
import Veiculo from './views/pages/veiculo';
import NotFound from './views/pages/404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Veiculos />}/>
        <Route path="/veiculos" element={<Veiculos />}/>
        <Route path="/veiculo" element={<Veiculo />}/>
        <Route path="/veiculo/:id" element={<Veiculo />}/>
        <Route path="/*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
