import { useEffect, useRef, useState } from 'react'
import supabase from '../utils/supabase'

function Notlar() {
  let [yumurtaSayisi, setYumurtaSayisi] = useState("")
  let [cikanYumurtaSayisi, setCikanYumurtaSayisi] = useState("")
  let [cikmayanYumurtaSayisi, setCikmayanYumurtaSayisi] = useState("")
  let [loading, setLoading] = useState(true)
  let [kaydedildi, setKaydedildi] = useState(null)
  let [bilinenHata, setBilinenHata] = useState(null)

  const yumurtaSayisiInputRef = useRef(null);
  const cikanYumurtaSayisiInputRef = useRef(null);
  const cikmayanYumurtaSayisiInputRef = useRef(null);

  let [cikanYumurtaPlaceholder, setCikanYumurtaPlaceholder] = useState("");

  async function kaydet() {
    setBilinenHata(null)
    setKaydedildi(null)

    if (
      (yumurtaSayisiInputRef.current && yumurtaSayisiInputRef.current.value.length > 0 && !Number.isInteger(+yumurtaSayisiInputRef.current.value))
      || (cikanYumurtaSayisiInputRef.current && cikanYumurtaSayisiInputRef.current.value.length > 0 && !Number.isInteger(+cikanYumurtaSayisiInputRef.current.value))
      || (cikmayanYumurtaSayisiInputRef.current && cikmayanYumurtaSayisiInputRef.current.value.length > 0 && !Number.isInteger(+cikmayanYumurtaSayisiInputRef.current.value))) {
      setBilinenHata("Sadece sayı giriniz!")
      setKaydedildi(false)
    } else if (yumurtaSayisiInputRef.current && cikanYumurtaSayisiInputRef.current && (+cikanYumurtaSayisiInputRef.current.value > +yumurtaSayisiInputRef.current.value)) {
      setBilinenHata("Çıkan yumurta sayısı, yumurta adedinden büyük olamaz!")
      setKaydedildi(false)
    } else if (yumurtaSayisiInputRef.current && cikmayanYumurtaSayisiInputRef.current && (+cikmayanYumurtaSayisiInputRef.current.value > +yumurtaSayisiInputRef.current.value)) {
      setBilinenHata("Çıkmayan yumurta sayısı, yumurta adedinden büyük olamaz!")
      setKaydedildi(false)
    } else {
      const { error } = await supabase.from('detaylar').update({
        yumurtaSayisi: yumurtaSayisiInputRef.current.value || null,
        cikanYumurtaSayisi: cikanYumurtaSayisiInputRef.current.value || null,
        cikmayanYumurtaSayisi: cikmayanYumurtaSayisiInputRef.current.value || null
      }).eq('id', 1)

      setKaydedildi(!error)
    }

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

  async function notlariCek() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data: notlar } = await supabase.from('detaylar').select().eq('id', 1).single()

    console.log(notlar)

    setYumurtaSayisi(notlar.yumurtaSayisi || "")
    setCikanYumurtaSayisi(notlar.cikanYumurtaSayisi || "")
    setCikmayanYumurtaSayisi(notlar.cikmayanYumurtaSayisi || "")

    setLoading(false)
  }

  useEffect(() => {
    notlariCek()
  }, [])

  useEffect(() => {
    if (loading == false) {
      if (yumurtaSayisiInputRef.current && cikanYumurtaSayisiInputRef.current) {
        cikanYumurtaSayisiInputRef.current.disabled = yumurtaSayisiInputRef.current.value.length == 0
        if (cikanYumurtaSayisiInputRef.current.disabled) {
          cikanYumurtaSayisiInputRef.current.value = ""
          cikmayanYumurtaSayisiInputRef.current.value = ""
          setCikanYumurtaPlaceholder("");
        } else {
          setCikanYumurtaPlaceholder("Yumurta adedini giriniz...");
        }
      }
    }
  }, [loading])

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
            <h1 class="text-center font-bold text-4xl mt-8">Notlar</h1>
            <div class="flex flex-col items-center justify-center gap-4 mt-8 mx-6 px-6 w-screen md:w-1/2 lg:w-1/3">
              <span class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4">
                <span class="font-bold whitespace-nowrap text-center">
                  🥚 Yumurta Sayısı
                </span>
                <input
                  ref={yumurtaSayisiInputRef}
                  defaultValue={yumurtaSayisi}
                  class="w-full bg-white border border-black/50 rounded-sm px-2 py-1"
                  placeholder='Yumurta adedini giriniz...'
                  maxLength="2"
                  onChange={async (event) => {
                    if (yumurtaSayisiInputRef.current) {
                      if (
                        yumurtaSayisiInputRef.current.value.length > 0
                        && cikanYumurtaSayisiInputRef.current.value.length > 0
                        && Number.isInteger(+yumurtaSayisiInputRef.current.value)
                        && Number.isInteger(+cikanYumurtaSayisiInputRef.current.value)
                        && cikmayanYumurtaSayisiInputRef.current) {
                        cikmayanYumurtaSayisiInputRef.current.value =
                          +yumurtaSayisiInputRef.current.value - +cikanYumurtaSayisiInputRef.current.value
                      } else if (cikanYumurtaSayisiInputRef.current.value.length == 0) {
                        cikmayanYumurtaSayisiInputRef.current.value = ""
                      }


                      if (!cikanYumurtaSayisiInputRef.current) return;
                      cikanYumurtaSayisiInputRef.current.disabled = yumurtaSayisiInputRef.current.value.length == 0
                      if (cikanYumurtaSayisiInputRef.current.disabled) {
                        cikanYumurtaSayisiInputRef.current.value = ""
                        cikmayanYumurtaSayisiInputRef.current.value = ""
                        setCikanYumurtaPlaceholder("");
                      } else {
                        setCikanYumurtaPlaceholder("Yumurta adedini giriniz...");
                      }
                    }
                  }}>
                </input>
              </span>

              <span class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4">
                <span class="font-bold whitespace-nowrap text-center">
                  🐣 Çıkan Yumurta
                </span>
                <input
                  ref={cikanYumurtaSayisiInputRef}
                  defaultValue={cikanYumurtaSayisi}
                  class="w-full bg-white disabled:bg-gray-100 border border-black/50 rounded-sm px-2 py-1"
                  placeholder={cikanYumurtaPlaceholder}
                  maxLength="2"
                  onChange={async (event) => {
                    if (yumurtaSayisiInputRef.current) {
                      if (
                        yumurtaSayisiInputRef.current.value.length > 0
                        && cikanYumurtaSayisiInputRef.current.value.length > 0
                        && Number.isInteger(+yumurtaSayisiInputRef.current.value)
                        && Number.isInteger(+cikanYumurtaSayisiInputRef.current.value)
                        && cikmayanYumurtaSayisiInputRef.current) {
                        cikmayanYumurtaSayisiInputRef.current.value =
                          +yumurtaSayisiInputRef.current.value - +cikanYumurtaSayisiInputRef.current.value
                      } else if (cikanYumurtaSayisiInputRef.current.value.length == 0) {
                        cikmayanYumurtaSayisiInputRef.current.value = ""
                      }
                    }
                  }}>
                </input>
              </span>

              <span class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-4">
                <span class="font-bold whitespace-nowrap text-center">
                  😔 Çıkmayan Yumurta
                </span>
                <input
                  disabled
                  ref={cikmayanYumurtaSayisiInputRef}
                  defaultValue={cikmayanYumurtaSayisi}
                  class="w-full bg-gray-100 border border-black/50 rounded-sm px-2 py-1"
                  maxLength="2"
                  onChange={async (event) => {
                  }}>
                </input>
              </span>

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

export default Notlar
