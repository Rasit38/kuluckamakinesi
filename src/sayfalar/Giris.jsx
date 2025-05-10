import { House, NotebookPen, Settings, User } from "lucide-react"
import { useEffect, useRef, useState } from "react";

function Giris() {

    const kullaniciRef = useRef();
    const sifreRef = useRef();

    const [hata, setHata] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                if (!kullaniciRef.current || !sifreRef.current) return
                if (kullaniciRef.current.value === "Admin" && sifreRef.current.value === "muhammed38") {
                    localStorage.setItem("giris", new Date().getTime())

                    window.location.href = "/"
                } else {
                    setHata("Kullanıcı adı veya şifre yanlış")

                    kullaniciRef.current.value = ""
                    sifreRef.current.value = ""

                    setTimeout(() => {
                        setHata(null)
                    }, 2000)
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <div class="flex flex-col items-center">
                <h1 class="text-center font-bold text-4xl mt-8">Kuluçka Makinesi Kontrol Paneli Giriş Sayfası</h1>
                <div class="flex flex-col items-center justify-center gap-4 mt-8 mx-6 px-6 w-screen md:w-1/2 lg:w-1/3">
                    <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                        <span class="font-bold text-center">👤 Kullanıcı Adı</span>
                        <input ref={kullaniciRef} class="border bg-white border-gray-300 rounded-md p-2" type="text" />
                    </div>
                    <div class="flex flex-col bg-gray-100 border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                        <span class="font-bold text-center">🔑 Şifre</span>
                        <input ref={sifreRef} class="border bg-white border-gray-300 rounded-md p-2" type="password" />
                    </div>

                    <button
                        class="border rounded-lg border-blue-900 bg-blue-500 text-white px-3 py-2 text-2xl w-full"
                        onClick={() => {
                            if (!kullaniciRef.current || !sifreRef.current) return
                            if (kullaniciRef.current.value === "Admin" && sifreRef.current.value === "muhammed38") {
                                localStorage.setItem("giris", new Date().getTime())

                                window.location.href = "/"
                            } else {
                                setHata("Kullanıcı adı veya şifre yanlış")

                                kullaniciRef.current.value = ""
                                sifreRef.current.value = ""

                                setTimeout(() => {
                                    setHata(null)
                                }, 2000)
                            }
                        }}>
                        <div class="flex items-center gap-2 justify-center">
                            <User />
                            Giriş Yap
                        </div>
                    </button>

                    {
                        hata &&
                        <div class="flex flex-col bg-white border rounded-xl border-gray-300 p-6 w-full text-2xl gap-2">
                            <span class="font-bold text-center text-red-500">{hata}</span>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Giris
