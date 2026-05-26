"use client";

import { useState } from "react";
import "./LoginForm.css";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    async function handleLogin(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");

        try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email,
                password,
            }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(
            data.message ||
            "Error al iniciar sesión"
            );

            return;
        }

        console.log("LOGIN EXITOSO");
        console.log(data);

        const token = data.data.token;
        const user = data.data.user;

        // Guardar en localStorage
        localStorage.setItem("token", token);

        localStorage.setItem(
        "user",
        JSON.stringify(user)
        );

        // Redireccionar según rol
        if (user.role === "administrador") {
        router.push("/menuAdmin");
        }
        else if (user.role === "cliente")
        {
            router.push("/menuCliente");
        }

        else if (user.role === "freelancer")
        {
            router.push("/menuFreelancer");
        }
        } catch (error) {

        setError(
            "Error de conexión con el servidor"
        );

        }
    }

    return (

        <div className="login-container">

        <h1 className="title">
            Iniciar Sesión
        </h1>

        <div className="logo-box">
            LOGO
        </div>

        <form
            className="login-form"
            onSubmit={handleLogin}
        >

            <div className="input-group">

            <label>
                Correo Electrónico
            </label>

            <input
                type="email"
                placeholder="Ingrese su correo"
                value={email}

                onChange={(e) =>
                setEmail(e.target.value)
                }
            />

            </div>

            <div className="input-group">

            <label>
                Contraseña
            </label>

            <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}

                onChange={(e) =>
                setPassword(e.target.value)
                }
            />

            </div>

            {error && (
            <p className="error-message">
                {error}
            </p>
            )}

            <button
            type="submit"
            className="login-button"
            >
            Iniciar Sesión
            </button>
            <Link href="/" className="back-link">
                <button className="back-button">
                    Volver al menú
                </button>
            </Link>
        </form>

        </div>
    );
}