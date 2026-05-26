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
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/register",
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
        <div className="register-container">
            <h1 className="title">
                Formulario de registro
            </h1>

            <div className="logo-box">
                Protask Logo
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
                    Registrarse
                </button>
            </form>

            <Link href="/">
                <button
                    type="button"
                    className="back-button"
                >
                    Volver al menú
                </button>
            </Link>

            <p className="login-text">
                ¿Ya tienes Cuenta?
                <Link href="/login">
                    <span> Iniciar sesión</span>
                </Link>
            </p>
        </div>
    );
}