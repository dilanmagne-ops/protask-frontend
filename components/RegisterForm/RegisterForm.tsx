"use client";
import { useState } from "react";

import "./RegisterForm.css"


export default function RegisterForm(){
    const [role, setRole] =
     useState("cliente");

    const [name, setName] =
     useState("");

    const [email, setEmail] =
    useState("");

    const [password, setPassword] =
    useState("");

    const [confirmPassword,
    setConfirmPassword] =
    useState("");
    const handleRegister = async (
    e: React.FormEvent
    ) => {

    e.preventDefault();

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
            "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
            name,
            email,
            password,
            role,
            }),
        }
    );
    const data =
      await response.json();
    console.log(data);
    if (response.ok) {
      alert("Usuario registrado");
    } else {
      alert(data.message ||
        "Error al registrar");
    }
    } catch (error) {
    console.log(error);
    alert("Error de conexión");
    }

    };
    return(
        <div className="register-container">
            <h1 className="title">
                Formulario de registro
            </h1>
            <div className="logo-box">
                Protask Logo
        </div>
            <div className="role-container">
                <p>Selecciona tu rol: </p>
                <div className="role-buttons">
                    <button type="button" className={
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
                setName(e.target.value)}
            />
            </div>
            <div className="input-group">
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) =>
                setEmail(e.target.value)}
            />
            </div>
            <div className="input-group">
            <label>Contraseña</label>
            <input
                type="password"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)}
            />
            </div>
            <div className="input-group">
            <label>Confirmar contraseña</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                setConfirmPassword(
                e.target.value)}
            />
            </div>
            <button className="register-button">
                Registrarse
            </button>
        </form>
        <p className="login-text">
            ¿Ya tienes Cuenta?
            <span> Iniciar sesion</span>
        </p>
        </div>
    );
    
}