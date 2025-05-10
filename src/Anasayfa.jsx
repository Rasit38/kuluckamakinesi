//Uygulamadaki sayfların belirlendiği dosya. Yani rotalar.
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SayfaYok from "./sayfalar/hatalar/SayfaYok";
import Detaylar from "./sayfalar/Detaylar";
import Menu from "./sayfalar/Menu";
import Notlar from "./sayfalar/Notlar";
import Ayarlar from "./sayfalar/Ayarlar";
import Hakkimda from "./sayfalar/Hakkimda";
import mqtt from "mqtt";
import { MqttProvider } from "./MqttContext";

function App() {
    return (
        <Router>
            <MqttProvider>
                <Routes>
                    <Route path="/" element={<Menu />} />
                    <Route path="/detaylar" element={<Detaylar />} />
                    <Route path="/notlar" element={<Notlar />} />
                    <Route path="/ayarlar" element={<Ayarlar />} />
                    <Route path="/hakkimda" element={<Hakkimda />} />
                    <Route path="*" element={<SayfaYok />} />
                </Routes>
            </MqttProvider>
        </Router>
    );
}

export default App;
