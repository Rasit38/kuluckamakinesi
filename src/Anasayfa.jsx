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
import Giris from "./sayfalar/Giris";

function App() {
    const [girisYapildi, setGirisYapildi] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const giris = localStorage.getItem("giris");
            if (!giris || new Date().getTime() - +giris >= 86400000) {
                setGirisYapildi(false);
                localStorage.removeItem("giris");
            } else {
                setGirisYapildi(true);
            }
        };

        // İlk yüklemede kontrol
        checkAuth();

        // Route değişikliklerini dinle
        const handleRouteChange = () => {
            checkAuth();
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    if (!girisYapildi) {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Giris />} />
                    <Route path="*" element={<Giris />} />
                </Routes>
            </Router>
        );
    }

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
