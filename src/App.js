import styles from './App.module.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./routes/Home.js";
import Data from "./routes/Data.js";
import SystemHome from "./routes/SystemHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/data/:id" element={<Data />} />
        <Route path="/" element={<Home />} /> 
        <Route path="/system" element={<SystemHome />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
