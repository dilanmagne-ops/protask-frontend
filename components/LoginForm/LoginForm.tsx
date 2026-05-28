"use client";

import { useState } from "react";
import "./LoginForm.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {

    const router = useRouter();

    const [email, setEmail] =
    useState("");

    const [password, setPassword] =
    useState("");

    const [error, setError] =
    useState("");

    async function handleLogin(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");

        try {

            const response =
            await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json",
                },

                body:
                JSON.stringify({
                    email,
                    password,
                }),
            });

            const data =
            await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Error al iniciar sesión"
                );

                return;
            }

            const token =
            data.data.token;

            const user =
            data.data.user;

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            if (
            user.role ===
            "administrador"
            ) {

                router.push(
                "/menuAdmin"
                );

            }

            else if (
            user.role ===
            "cliente"
            ) {

                router.push(
                "/menuCliente"
                );

            }

            else if (
            user.role ===
            "freelancer"
            ) {

                router.push(
                "/menuFreelancer"
                );

            }

            else {

                router.push("/");

            }

        }
        catch(error){

            console.log(error);

            setError(
            "Error de conexión con el servidor"
            );

        }

    }

    return (

    <main className=
    "login-page">

        <section className=
        "login-layout">

            <div className=
            "login-info">

                <Link
                href="/"
                className=
                "brand-link"
                >

                    ProTask

                </Link>

                <span className=
                "login-badge">

                    Plataforma freelance segura

                </span>

                <h1 className=
                "info-title">

                    Gestiona tus proyectos con mayor confianza

                </h1>

                <p className=
                "info-text">

                    Inicia sesión para publicar proyectos, enviar propuestas,
                    revisar entregas y trabajar de forma profesional.

                </p>

                <div className=
                "info-stats">

                    <div>
                        <strong>01</strong>
                        <span>Proyectos claros</span>
                    </div>

                    <div>
                        <strong>02</strong>
                        <span>Freelancers verificados</span>
                    </div>

                    <div>
                        <strong>03</strong>
                        <span>Pagos más seguros</span>
                    </div>

                </div>

            </div>

            <div className=
            "login-card">

                <div className=
                "login-header">

                    <div className=
                    "logo-box">

                        PT

                    </div>

                    <div>
                        <h2 className=
                        "title">

                            Iniciar Sesión

                        </h2>

                        <p className=
                        "login-subtitle">

                            Ingresa tus datos para continuar.

                        </p>
                    </div>

                </div>

                <form
                className=
                "login-form"

                onSubmit=
                {handleLogin}
                >

                    <div className=
                    "input-group">

                        <label>
                            Correo Electrónico
                        </label>

                        <input
                            type="email"

                            placeholder=
                            "ejemplo@correo.com"

                            value={email}

                            onChange={(e)=>
                            setEmail(
                            e.target.value
                            )}

                            required
                        />

                    </div>

                    <div className=
                    "input-group">

                        <label>
                            Contraseña
                        </label>

                        <input
                            type="password"

                            placeholder=
                            "Ingresa tu contraseña"

                            value={password}

                            onChange={(e)=>
                            setPassword(
                            e.target.value
                            )}

                            required
                        />

                    </div>

                    {error && (

                    <p className=
                    "error-message">

                        {error}

                    </p>

                    )}

                    <button
                        type="submit"

                        className=
                        "login-button"
                    >

                        Iniciar Sesión

                    </button>

                    <div className=
                    "login-footer">

                        <p>
                            ¿No tienes una cuenta?
                        </p>

                        <Link
                        href="/register"
                        className=
                        "register-link"
                        >

                            Crear cuenta

                        </Link>

                    </div>

                    <Link
                    href="/"
                    className=
                    "back-link"
                    >

                        Volver al inicio

                    </Link>

                </form>

            </div>

        </section>

    </main>

    );

}