"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./UserProfile.css";

type UserProfileData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  const router = useRouter();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    obtenerUsuario();
  }, [userId]);

  async function obtenerUsuario() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo obtener el perfil");
      }

      // Por si tu backend devuelve { data: usuario } o directamente usuario
      const userData = data.data ?? data;

      setUser(userData);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el perfil del usuario.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <p>Cargando perfil...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.back()}>Volver</button>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <p>No se encontró el usuario.</p>
          <button onClick={() => router.back()}>Volver</button>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <button className="back-button" onClick={() => router.back()}>
          ← Volver
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span>Rol</span>
            <strong>{user.role}</strong>
          </div>

          {user.status && (
            <div className="profile-row">
              <span>Estado</span>
              <strong>{user.status}</strong>
            </div>
          )}

          {user.createdAt && (
            <div className="profile-row">
              <span>Registrado</span>
              <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
            </div>
          )}
        </div>

        {user.role === "freelancer" && (
          <div className="profile-extra">
            <h3>Perfil Freelancer</h3>
            <p>
              Aquí luego puedes mostrar sus propuestas, trabajos aceptados,
              reputación, KYC o calificación.
            </p>
          </div>
        )}

        {user.role === "cliente" && (
          <div className="profile-extra">
            <h3>Perfil Cliente</h3>
            <p>
              Aquí luego puedes mostrar sus proyectos publicados, proyectos en
              progreso o historial de pagos.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}