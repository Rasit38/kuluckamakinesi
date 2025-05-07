import { useEffect, useState } from 'react'
import supabase from '../utils/supabase'

function Detaylar() {
  let [sicaklik, setSicaklik] = useState(25)
  let [nem, setNem] = useState(72)
  let [gun, setGun] = useState()
  let [maksGun, setMaksGun] = useState()
  let [hayvan, setHayvan] = useState()
  let [calisiyor, setCalisiyor] = useState(false)
  let [loading, setLoading] = useState(true)

  const hayvanBilgiler = {
    tavuk: {
      gun: 21
    },
    hindi: {
      gun: 28
    },

    ordek: {
      gun: 28
    },

    kaz: {
      gun: 31
    },
    bildircin: {
      gun: 17
    }
  }

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
    setGun(detaylar.gun)

    setLoading(false)
  }

  useEffect(() => {
    detaylariCek()
  }, [])

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
                {
                  !calisiyor ?
                    <button
                      class="absolute bottom-2 right-2 border rounded-lg border-green-900 bg-green-500 text-white px-2 py-0.5 text-xl"
                      onClick={async () => {
                        const { error } = await supabase.from('detaylar').update({
                          calismaDurumu: true
                        }).eq('id', 1)
                        if (!error) {
                          setCalisiyor(true)
                        }
                      }}
                    >Başlat</button>
                    :
                    <button
                      class="absolute bottom-2 right-2 border rounded-lg border-red-900 bg-red-500 text-white px-2 py-0.5 text-xl"
                      onClick={async () => {
                        const { error } = await supabase.from('detaylar').update({
                          calismaDurumu: false,
                          gun: 0,
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

              <span class="bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl">
                <span class="font-bold">🌡️ Sıcaklık:
                </span>  {sicaklik}°
              </span>
              <span class="bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl">
                <span class="font-bold">
                  💧 Nem:
                </span> %{nem}
              </span>

              <span class="w-full h-60 flex justify-center pt-8">
                <img src={resimHesapla()} class="h-full"></img>
              </span>
            </div >
          </div>
      }
    </>
  )
}

export default Detaylar
