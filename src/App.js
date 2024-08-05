import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";

import HomePage from "../src/pages/Home/Home";
import Asana from './pages/Asana/Asana';
import Contact from './pages/Asana/Contact';

function App() {
  return (
    <div className="App">
      {/* <HomePage /> */}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/asana/:id" element={<Asana />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
