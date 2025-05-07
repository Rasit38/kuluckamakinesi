import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SayfaYok from "./sayfalar/hatalar/SayfaYok";
import Detaylar from "./sayfalar/Detaylar";
import Menu from "./sayfalar/Menu";
import Notlar from "./sayfalar/Notlar";
import Ayarlar from "./sayfalar/Ayarlar";
import Hakkimda from "./sayfalar/Hakkimda";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/detaylar" element={<Detaylar />} />
                <Route path="/notlar" element={<Notlar />} />
                <Route path="/ayarlar" element={<Ayarlar />} />
                <Route path="/hakkimda" element={<Hakkimda />} />
                <Route path="*" element={<SayfaYok />} />
            </Routes>
        </Router>
    );
}

export default App;
