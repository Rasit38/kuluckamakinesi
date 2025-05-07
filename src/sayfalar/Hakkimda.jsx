import { useEffect, useRef, useState } from 'react'
import supabase from '../utils/supabase'
import { Settings } from 'lucide-react'

function Hakkimda() {

  let [loading, setLoading] = useState(true)


  async function ayarlariCek() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoading(false)
  }

  useEffect(() => {
    ayarlariCek()
  }, [])

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
          <div class="flex flex-col items-center pb-8">
            <h1 class="text-center font-bold text-4xl mt-8">Hakkımda</h1>
            <div class="flex flex-col items-center justify-center gap-4 mt-8 mx-6 px-6 w-screen md:w-1/2 lg:w-1/3">
              <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                <span class="font-bold text-center">👤 İsim</span>
                <span class="text-center">Muhammet Raşit Ağkuş</span>
              </div>

              <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                <span class="font-bold text-center">📧 Email</span>
                <span class="text-center">magkus22@posta.pau.edu.tr</span>
              </div>

              <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                <span class="font-bold text-center">📌 Proje Başlığı</span>
                <span class="text-center">Kuluçka Makinesi Kontrol Paneli</span>
              </div>

              <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                <span class="font-bold text-center">📝 Proje Açıklaması</span>
                <span class="text-center">Bu proje, kuluçka makinesi parametrelerini izlemek ve kontrol etmek için geliştirilmiş bir kontrol panelidir.</span>
              </div>
            </div>
          </div >
      }
    </>
  )
}

export default Hakkimda
