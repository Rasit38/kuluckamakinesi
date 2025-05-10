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
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const mqttClient = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");
        setClient(mqttClient);

        mqttClient.on("connect", () => {
            console.log("Bağlandı");
            setIsConnected(true);
        });

        mqttClient.on("disconnect", () => {
            setIsConnected(false);
        });

        return () => {
            mqttClient.end();
        };
    }, [])

    return (
        <Router>
            <MqttProvider value={{ mqttClient: client, isMqttConnected: isConnected }}>
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
