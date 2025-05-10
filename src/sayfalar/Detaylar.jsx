import { useContext, useEffect, useState } from 'react'
import supabase from '../utils/supabase'
import { MqttContext } from '../MqttContext'
import { LoaderCircle } from 'lucide-react';

function Detaylar() {
  const { mqttClient, isMqttConnected } = useContext(MqttContext);

  useEffect(() => {
    if (!mqttClient || !isMqttConnected) {
      console.log("MQTT client hazır değil, bekleniyor...");
      return;
    }

    console.log("MQTT client bağlı, subscribe ediliyor...");

    mqttClient.subscribe("kuluckamakinesikontrolpaneli/sensor");

    mqttClient.on("message", (topic, message) => {
      console.log("Mesaj:", message.toString());

      if (topic === "kuluckamakinesikontrolpaneli/sensor") {
        const mesaj = JSON.parse(message);
        if (mesaj?.sicaklik !== undefined) setSicaklik(mesaj.sicaklik);
        if (mesaj?.nem !== undefined) setNem(mesaj.nem);
      }
    });

    detaylariCek();

    mqttClient.publish("kuluckamakinesikontrolpaneli/sensoristek", JSON.stringify({}));

    const interval = setInterval(() => {
      mqttClient.publish("kuluckamakinesikontrolpaneli/sensoristek", JSON.stringify({}));
    }, 10000);

    return () => {
      clearInterval(interval);
      mqttClient.unsubscribe("kuluckamakinesikontrolpaneli/sensor");
      mqttClient.removeAllListeners("message");
    };
  }, [mqttClient, isMqttConnected]);

  let [sicaklik, setSicaklik] = useState()
  let [nem, setNem] = useState()
  let [gun, setGun] = useState()
  let [maksGun, setMaksGun] = useState()
  let [hayvan, setHayvan] = useState()
  let [calisiyor, setCalisiyor] = useState(false)
  let [loading, setLoading] = useState(true)

  const hayvanBilgiler = {
    tavuk: {
      gun: 21,
      idealSicaklik: 37.6,
      idealCikisSicaklik: 37.2,
      sicaklikSapma: 0.4,
      idealNem: 55,
      idealCikisNem: 75,
      nemSapma: 5,
      cikisGunu: 2.5
    },
    hindi: {
      gun: 28,
      idealSicaklik: 37.4,
      idealCikisSicaklik: 36.9,
      sicaklikSapma: 0.4,
      idealNem: 55,
      idealCikisNem: 75,
      nemSapma: 5,
      cikisGunu: 3
    },
    ordek: {
      gun: 28,
      idealSicaklik: 37.5,
      idealCikisSicaklik: 37.1,
      sicaklikSapma: 0.4,
      idealNem: 55,
      idealCikisNem: 75,
      nemSapma: 5,
      cikisGunu: 3
    },
    kaz: {
      gun: 31,
      idealSicaklik: 37.4,
      idealCikisSicaklik: 36.9,
      sicaklikSapma: 0.4,
      idealNem: 55,
      idealCikisNem: 75,
      nemSapma: 5,
      cikisGunu: 3.5
    },
    bildircin: {
      gun: 17,
      idealSicaklik: 37.4,
      idealCikisSicaklik: 37.2,
      sicaklikSapma: 0.4,
      idealNem: 55,
      idealCikisNem: 75,
      nemSapma: 5,
      cikisGunu: 2.5
    }
  }

  // Check if current day is in exit period (last cikisGunu days)
  function isExitPeriod() {
    return hayvan && hayvanBilgiler[hayvan] &&
      gun > (hayvanBilgiler[hayvan].gun - hayvanBilgiler[hayvan].cikisGunu);
  }

  // Calculate image based on incubation progress
  function resimHesapla() {
    const step1 = 0;
    const step2 = Math.floor(maksGun * 0.25);
    const step3 = Math.floor(maksGun * 0.5);
    const step4 = Math.floor(maksGun * 0.825);

    if (gun >= step4) {
      return "/step4.png"
    } else if (gun >= step3) {
      return "/step3.png"
    } else if (gun >= step2) {
      return "/step2.png"
    } else if (gun >= step1) {
      return "/step1.png"
    }
  }

  async function detaylariCek() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data: detaylar } = await supabase.from('detaylar').select().eq('id', 1).single()

    console.log(detaylar)

    setCalisiyor(detaylar.calismaDurumu)
    setHayvan(detaylar.hayvan)

    if (detaylar.calismaDurumu) {
      const gecenZaman = Date.now() - new Date(detaylar.baslangicZamani).getTime()
      const gecenGun = Math.floor(gecenZaman / (1000 * 60 * 60 * 24))
      setGun(gecenGun)
    } else {
      setGun(0)
    }


    setLoading(false)
  }

  useEffect(() => {
    if (hayvan == "tavuk" || hayvan == "hindi" || hayvan == "kaz" || hayvan == "ordek" || hayvan == "bildircin") {
      setMaksGun(hayvanBilgiler[hayvan].gun)
    }
  }, [hayvan])

  return (
    <>
      {
        loading ?
          <div class="flex justify-center items-center h-screen w-screen">
            <div class="animate-spin text-8xl">
              🐣
            </div>
          </div>
          :
          <div class="flex flex-col items-center">
            <h1 class="text-center font-bold text-4xl mt-8">Ana Sayfa</h1>
            <div class="flex flex-col items-center justify-center gap-4 mt-8 mx-6 px-6 w-screen md:w-1/2 lg:w-1/3">
              <span class="flex flex-row bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl">
                <span class="font-bold whitespace-nowrap">
                  🐔 Hayvan:
                </span>
                <select
                  class="w-full ml-2"
                  disabled={calisiyor}
                  value={hayvan}
                  onChange={async (event) => {
                    const secilenHayvan = event.target.value;
                    const { error } = await supabase.from('detaylar').update({
                      hayvan: secilenHayvan
                    }).eq('id', 1)
                    setHayvan(secilenHayvan);
                  }}>
                  <option value="tavuk">Tavuk</option>
                  <option value="hindi">Hindi</option>
                  <option value="ordek">Ördek</option>
                  <option value="kaz">Kaz</option>
                  <option value="bildircin">Bıldırcın</option>
                </select>
              </span>

              <span class="relative flex flex-row bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl">
                <span class="font-bold whitespace-nowrap">
                  📅 Gün:
                </span>&nbsp;{gun}/{maksGun}
              </span>

              <span class="bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl flex flex-row">
                <span class="font-bold whitespace-nowrap">
                  🌡️ Sıcaklık:
                </span>
                {sicaklik == undefined ? <LoaderCircle class="animate-spin inline ml-2" /> :
                  <span class="ml-2 flex flex-row w-full">
                    {sicaklik}°C
                    {hayvan && hayvanBilgiler[hayvan] && (
                      // Use exit temperature values if in exit period, otherwise use ideal values
                      (isExitPeriod() ?
                        (sicaklik >= (hayvanBilgiler[hayvan].idealCikisSicaklik - hayvanBilgiler[hayvan].sicaklikSapma) &&
                          sicaklik <= (hayvanBilgiler[hayvan].idealCikisSicaklik + hayvanBilgiler[hayvan].sicaklikSapma))
                        :
                        (sicaklik >= (hayvanBilgiler[hayvan].idealSicaklik - hayvanBilgiler[hayvan].sicaklikSapma) &&
                          sicaklik <= (hayvanBilgiler[hayvan].idealSicaklik + hayvanBilgiler[hayvan].sicaklikSapma))) ?
                        <span class="ml-auto bg-blue-500 shadow-lg text-white text-sm py-1.5 px-2 rounded-lg">ideal</span>
                        : sicaklik < (hayvanBilgiler[hayvan].idealSicaklik - hayvanBilgiler[hayvan].sicaklikSapma) ?
                          <span class="ml-auto bg-red-500 shadow-lg text-white text-sm py-1 px-1.5 rounded-lg">sıcaklık düşük</span>
                          :
                          <span class="ml-auto bg-red-500 text-white text-sm py-1.5 px-2 rounded-lg">sıcaklık yüksek</span>
                    )}
                  </span>
                }
              </span>
              <span class="bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl flex flex-row">
                <span class="font-bold whitespace-nowrap">
                  💧 Nem:
                </span>  {nem == undefined ? <LoaderCircle class="animate-spin inline" /> :
                  <span class="ml-2 flex flex-row w-full">
                    %{nem}
                    {hayvan && hayvanBilgiler[hayvan] && (
                      // Use exit humidity values if in exit period, otherwise use ideal values
                      (isExitPeriod() ?
                        (nem >= (hayvanBilgiler[hayvan].idealCikisNem - hayvanBilgiler[hayvan].nemSapma) &&
                          nem <= (hayvanBilgiler[hayvan].idealCikisNem + hayvanBilgiler[hayvan].nemSapma))
                        :
                        (nem >= (hayvanBilgiler[hayvan].idealNem - hayvanBilgiler[hayvan].nemSapma) &&
                          nem <= (hayvanBilgiler[hayvan].idealNem + hayvanBilgiler[hayvan].nemSapma))) ?
                        <span class="ml-auto bg-blue-500 shadow-lg text-white text-sm py-1.5 px-2 rounded-lg">nem oranı normal</span>
                        : nem < (hayvanBilgiler[hayvan].idealNem - hayvanBilgiler[hayvan].nemSapma) ?
                          <span class="ml-auto bg-red-500 shadow-lg text-white text-sm py-1 px-1.5 rounded-lg">nem oranı düşük, su ekleyin</span>
                          :
                          <span class="ml-auto bg-red-500 shadow-lg text-white text-sm py-1.5 px-2 rounded-lg">nem oranı yükselmiş, kapağı açın</span>
                    )}
                  </span>
                }
              </span>

              <span class="w-full h-60 flex justify-center pt-8">
                <img src={resimHesapla()} class="h-full"></img>
              </span>

              <span class="mb-8 w-full">
                {
                  !calisiyor ?
                    <button
                      class="border rounded-lg border-green-900 bg-green-500 text-white px-3 py-2 text-2xl w-full"
                      onClick={async () => {
                        const { error } = await supabase.from('detaylar').update({
                          calismaDurumu: true,
                          baslangicZamani: new Date().toISOString()
                        }).eq('id', 1)
                        if (!error) {
                          setCalisiyor(true)
                        }
                      }}
                    >Başlat</button>
                    :
                    <button
                      class="border rounded-lg border-red-900 bg-red-500 text-white px-3 py-2 text-2xl  w-full"
                      onClick={async () => {
                        const { error } = await supabase.from('detaylar').update({
                          calismaDurumu: false,
                          baslangicZamani: null,
                          hayvan: "tavuk"
                        }).eq('id', 1)
                        if (!error) {
                          setCalisiyor(false)
                          setGun(0)
                          setHayvan("tavuk")
                        }
                      }}
                    >Sıfırla</button>
                }

              </span>
            </div >
          </div >
      }
    </>
  )
}

export default Detaylar
