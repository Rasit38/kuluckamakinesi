import { useContext, useEffect, useRef, useState } from 'react'
import supabase from '../utils/supabase'
import { Settings } from 'lucide-react'
import { MqttContext } from '../MqttContext';

function Ayarlar() {
  const { mqttClient, isMqttConnected } = useContext(MqttContext);

  useEffect(() => {
    if (!mqttClient || !isMqttConnected) {
      console.log("MQTT client hazır değil, bekleniyor...");
      return;
    }

    mqttClient.on("message", (topic, message) => {
      console.log("Mesaj:", message.toString());
    });

    return () => {
      mqttClient.removeAllListeners("message");
    };
  }, [mqttClient, isMqttConnected]);

  let [seciliMod, setSeciliMod] = useState(0) // 0 oto, 1 manuel
  let [fanHizi, setFanHizi] = useState(0.5)
  let [ampulDurum, setAmpulDurum] = useState(true)
  let [fanDurum, setFanDurum] = useState(true)

  let [loading, setLoading] = useState(true)
  let [kaydedildi, setKaydedildi] = useState(null)
  let [bilinenHata, setBilinenHata] = useState(null)

  async function kaydet() {
    setBilinenHata(null)
    setKaydedildi(null)

    const { error } = await supabase.from('detaylar').update(Object.assign({}, {
      mod: seciliMod,
      fanHizi: fanHizi
    }, seciliMod == 1 && {
      ampulDurum: ampulDurum,
      fanDurum: fanDurum
    })).eq('id', 1)

    setKaydedildi(!error)

    mqttClient.publish("kuluckamakinesikontrolpaneli/ayarlar", JSON.stringify({
      mod: seciliMod,
      ampul: ampulDurum,
      fan: fanDurum,
      fanHizi: fanHizi
    }));

    setTimeout(() => {
      setKaydedildi(null)
    }, 2000)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        kaydet()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function ayarlariCek() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data: ayarlar } = await supabase.from('detaylar').select().eq('id', 1).single()

    setSeciliMod(ayarlar.mod)
    setFanHizi(ayarlar.fanHizi)
    setAmpulDurum(ayarlar.ampulDurum)
    setFanDurum(ayarlar.fanDurum)

    console.log(ayarlar)

    setLoading(false)
  }

  useEffect(() => {
    ayarlariCek()
  }, [])

  useEffect(() => {
    if (loading == false) {

    }
  }, [loading])

  useEffect(() => {
    if (kaydedildi == true) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [kaydedildi]);

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
            <h1 class="text-center font-bold text-4xl mt-8">Ayarlar</h1>
            <div class="flex flex-col items-center justify-center gap-4 mt-8 mx-6 px-6 w-screen md:w-1/2 lg:w-1/3">
              <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4">
                <span class="font-bold whitespace-nowrap text-center">
                  ⚙️ Mod
                </span>

                <div class="flex flex-row justify-around">
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="0"
                      checked={seciliMod == 0}
                      onChange={(e) => setSeciliMod(e.target.value)}
                      class="accent-blue-600 w-4 h-4"
                    />
                    <span>Otomatik</span>
                  </label>

                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="1"
                      checked={seciliMod == 1}
                      onChange={(e) => setSeciliMod(e.target.value)}
                      class="accent-blue-600 w-4 h-4"
                    />
                    <span>Manuel</span>
                  </label>
                </div>

              </div>

              {seciliMod == 1 && (
                <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4">
                  <span class="font-bold whitespace-nowrap text-center">
                    💡 Ampul Kontrolü
                  </span>
                  <div class="flex flex-row justify-around">
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={ampulDurum}
                        onChange={() => setAmpulDurum(true)}
                        class="accent-blue-600 w-4 h-4"
                      />
                      <span>Açık</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={!ampulDurum}
                        onChange={() => setAmpulDurum(false)}
                        class="accent-blue-600 w-4 h-4"
                      />
                      <span>Kapalı</span>
                    </label>
                  </div>
                </div>
              )}

              {seciliMod == 1 && (
                <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4">
                  <span class="font-bold whitespace-nowrap text-center">
                    🌀 Fan Kontrolü
                  </span>
                  <div class="flex flex-row justify-around">
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={fanDurum}
                        onChange={() => setFanDurum(true)}
                        class="accent-blue-600 w-4 h-4"
                      />
                      <span>Açık</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={!fanDurum}
                        onChange={() => setFanDurum(false)}
                        class="accent-blue-600 w-4 h-4"
                      />
                      <span>Kapalı</span>
                    </label>
                  </div>
                </div>
              )}

              <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4"

                style={seciliMod == 1 && !fanDurum ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                <span class="font-bold whitespace-nowrap text-center">
                  𖣘 Fan Hızı
                </span>

                <div class="flex flex-col accent-blue-600">
                  <input
                    type="range"
                    class="w-full"
                    step="0.1"
                    max="1"
                    min="0"
                    value={fanHizi}
                    onChange={(e) => {
                      const inputVal = e.target.value;
                      if (inputVal >= 0.2) {
                        setFanHizi(inputVal)
                      } else {
                        setFanHizi(0.2)
                      }
                    }}
                  />

                  <div class="flex flex-row justify-between items-center text-sm -ml-1 -mr-1 text-center text-gray-600">
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0 && "font-bold text-blue-600 text-base"}`}>0</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.1 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.1 && "font-bold text-blue-600 text-base"}`}>10</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.2 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.2 && "font-bold text-blue-600 text-base"}`}>20</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.3 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.3 && "font-bold text-blue-600 text-base"}`}>30</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.4 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.4 && "font-bold text-blue-600 text-base"}`}>40</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.5 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.5 && "font-bold text-blue-600 text-base"}`}>50</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.6 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.6 && "font-bold text-blue-600 text-base"}`}>60</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.7 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.7 && "font-bold text-blue-600 text-base"}`}>70</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.8 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.8 && "font-bold text-blue-600 text-base"}`}>80</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 0.9 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 0.9 && "font-bold text-blue-600 text-base"}`}>90</span>
                    </span>
                    <span class="flex flex-col items-center">
                      <div className={`w-0 h-2 border mb-0.5 ${fanHizi == 1 ? "border-blue-600" : "border-gray-400"}`} />
                      <span class={`w-6 ${fanHizi == 1 && "font-bold text-blue-600 text-base"}`}>100</span>
                    </span>
                  </div>
                </div>

              </div>

              <span class=" w-full text-2xl gap-4 flex  flex-col justify-center">
                <button
                  class="border rounded-lg border-green-900 bg-green-500 text-white px-3 py-2"
                  onClick={kaydet}
                >
                  Kaydet
                </button>
                {kaydedildi === false
                  ? <a class="text-red-700 text-center">{bilinenHata || "Bir sorun oluştu!"}</a>
                  :
                  kaydedildi === true
                    ? <a class="text-green-700 text-center">Kaydedildi!</a>
                    : <></>}
              </span>
            </div >
          </div >
      }
    </>
  )
}

export default Ayarlar
