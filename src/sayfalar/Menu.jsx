import { House, NotebookPen, Settings, User } from "lucide-react"
import { useNavigate } from "react-router-dom";

function Menu() {
    const navigate = useNavigate();

    return (
        <>
            <div class="flex flex-col items-center">
                <h1 class="text-center font-bold text-4xl mt-8">Kuluçka Makinesi Kontrol Paneli</h1>
                <div class="flex justify-center text-white font-bold text-xl w-full  mt-6">
                    <div class="w-screen md:w-1/2 lg:w-1/3 h-[calc(100vh-7rem)] grid grid-cols-2 grid-rows-2 gap-2 p-2">
                        <div class="
                      bg-blue-500
                        rounded-lg
                        flex
                        justify-center
                        items-center
                        flex-col
                        gap-2
                        cursor-pointer
                        shadow-md
                        hover:scale-102
                        transition
                        "
                            onClick={() => {
                                navigate("/detaylar")
                            }}
                        >
                            <House className="w-16 h-16" />
                            Ana Sayfa
                        </div>
                        <div class="
                      bg-amber-300
                        rounded-lg
                        flex
                        justify-center
                        items-center
                        flex-col
                        gap-2
                        cursor-pointer
                        shadow-md
                        hover:scale-102
                        transition"
                            onClick={() => {
                                navigate("/notlar")
                            }}>
                            <NotebookPen className="w-16 h-16" />
                            Notlar
                        </div>
                        <div class="
                      bg-red-500
                        rounded-lg
                        flex
                        justify-center
                        items-center
                        flex-col
                        gap-2
                        cursor-pointer
                        shadow-md
                        hover:scale-102
                        transition"
                            onClick={() => {
                                navigate("/ayarlar")
                            }}>
                            <Settings className="w-16 h-16" />
                            Ayarlar
                        </div>
                        <div class="
                      bg-green-500
                        rounded-lg
                        flex
                        justify-center
                        items-center
                        flex-col
                        gap-2
                        cursor-pointer
                        shadow-md
                        hover:scale-102
                        transition"
                            onClick={() => {
                                navigate("/hakkimda")
                            }}>
                            <User className="w-16 h-16" />
                            Hakkımda
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu
