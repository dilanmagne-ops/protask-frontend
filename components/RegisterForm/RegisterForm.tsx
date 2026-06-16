"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./RegisterForm.css";

export default function RegisterForm() {
    const router = useRouter();

    const [role, setRole] = useState("cliente");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const [darkMode, setDarkMode] = useState(true);

    
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3001/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role,
                    }),
                }
            );

            const data = await response.json();

            console.log("RESPUESTA REGISTRO:");
            console.log(data);

            if (response.ok) {
                alert("Usuario registrado correctamente");
                router.push("/login");
            } else {
                alert(JSON.stringify(data));
            }

        } catch (error) {
            console.log(error);
            alert("Error de conexión");
        }
    };

    return (



        <main className={
                darkMode
                    ? "register-page"
                    : "register-page light-mode"
            }
        >



            <section className="register-layout">

                <div className="register-info">

                    <Link href="/" className="brand-link">
                        ProTask
                    </Link>

                    <span className="register-badge">
                        Crea tu cuenta
                    </span>

                    <h1 className="info-title">
                        Empieza a trabajar en proyectos de forma segura
                    </h1>

                    <p className="info-text">
                        Regístrate como cliente para publicar proyectos o como freelancer
                        para encontrar oportunidades y enviar propuestas.
                    </p>

                    <div className="info-list">

                        <div>
                            <strong>Cliente</strong>
                            <span>Publica proyectos y encuentra talento.</span>
                        </div>

                        <div>
                            <strong>Freelancer</strong>
                            <span>Busca proyectos y ofrece tus servicios.</span>
                        </div>

                        <div>
                            <strong>ProTask</strong>
                            <span>Conecta ambas partes de manera profesional.</span>
                        </div>

                    </div>

                </div>

                <div className="register-card">

                    <div className="register-header">

                        <div className="logo-box">
                            PT
                        </div>

                        <div>
                            <h2 className="title">
                                Registrarse
                            </h2>

                            <p className="register-subtitle">
                                Completa tus datos para crear tu cuenta.
                            </p>




                            <button
                                type="button"
                                className="theme-button"
                                onClick={() =>
                                    setDarkMode(!darkMode)
                                }
                            >
                                {darkMode ? "Light Mode" : "Dark Mode"}
                            </button>






                        </div>

                    </div>

                    <div className="role-container">

                        <p>Selecciona tu rol:</p>

                        <div className="role-buttons">

                            <button
                                type="button"
                                className={
                                    role === "cliente"
                                        ? "active-role"
                                        : ""
                                }
                                onClick={() =>
                                    setRole("cliente")
                                }
                            >
                                Cliente
                            </button>

                            <button
                                type="button"
                                className={
                                    role === "freelancer"
                                        ? "active-role"
                                        : ""
                                }
                                onClick={() =>
                                    setRole("freelancer")
                                }
                            >
                                Freelancer
                            </button>

                        </div>

                    </div>

                    <form
                        className="register-form"
                        onSubmit={handleRegister}
                    >

                        <div className="input-group">
                            <label>Nombre completo</label>

                            <input
                                type="text"
                                placeholder="Ejemplo: Joel Delgado"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>

                            <input
                                type="password"
                                placeholder="Crea una contraseña"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirmar contraseña</label>

                            <input
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                        >
                            Crear cuenta
                        </button>

                    </form>

                    <div className="register-footer">

                        <p>
                            ¿Ya tienes cuenta?
                        </p>

                        <Link href="/login" className="login-link">
                            Iniciar sesión
                        </Link>

                    </div>

                    <Link href="/" className="back-link">
                        Volver al inicio
                    </Link>

                </div>

            </section>

        </main>
    );
}