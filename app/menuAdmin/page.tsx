"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar/Navbar";

import "./menuAdmin.css";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};


export default function MenuAdmin() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userGuardado = localStorage.getItem("user");
        // No existe usuario
        if (!userGuardado) 
        {
            router.push("/login");
            return;
        }
        const userParseado = JSON.parse(userGuardado);
        // No es admin
        if (userParseado.role !== "administrador") 
        {

            router.push("/login");
            return;
        }

        setUser(userParseado);
    }, [router]);
    function cerrarSesion() {
        // Eliminar datos
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Volver al login
        router.push("/login");
    }
    return (
        <div>
            <Navbar
                title={`Bienvenido ${user?.name}`}
                items={[
                    "Usuarios Pendientes",
                    "Usuarios Aprobados",
                ]}
            />
            <div className="admin-container">

                <h1>
                    Panel Administrador
                </h1>

                <p>
                    Gestiona usuarios,
                    validaciones y cuentas
                    del sistema.
                </p>

                <div className="admin-buttons">

                    <button
                        onClick={() =>
                            router.push(
                                "/menuAdmin/pendientes"
                            )
                        }
                    >
                        Ver Pendientes
                    </button>

                    <button
                        onClick={() =>
                            router.push(
                                "/menuAdmin/aprobados"
                            )
                        }
                    >
                        Ver Aprobados
                    </button>

                    <button
                        onClick={cerrarSesion}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}