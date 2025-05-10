// Contextler.js
import React, { createContext, useEffect, useState } from "react";
import mqtt from "mqtt";

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

        setClient(mqttClient);

        mqttClient.on("connect", () => {
            console.log("MQTT bağlandı");
            setIsConnected(true);
        });

        mqttClient.on("disconnect", () => {
            setIsConnected(false);
        });

        mqttClient.on("error", (err) => {
            console.error("MQTT Hatası:", err);
        });

        return () => {
            mqttClient.end();
        };
    }, []);

    return (
        <MqttContext.Provider value={{ mqttClient: client, isMqttConnected: isConnected }}>
            {children}
        </MqttContext.Provider>
    );
};
