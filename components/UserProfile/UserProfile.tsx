"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./UserProfile.css";

type UserProfileData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  rating?: number | string;
  totalReviews?: number;
  completedProjects?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ReviewUser = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type Review = {
  id: string;
  proposalId: string;
  reviewer: ReviewUser;
  reviewed: ReviewUser;
  rating: number;
  comment?: string;
  reviewerRole: "cliente" | "freelancer";
  createdAt: string;
};

type UserProfileProps = {
  userId: string;
};

const API_URL = "http://localhost:3001/api";

export default function UserProfile({ userId }: UserProfileProps) {
  const router = useRouter();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const averageRating = useMemo(() => {
    if (user?.rating !== undefined && user?.rating !== null) {
      return Number(user.rating);
    }

    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return total / reviews.length;
  }, [user, reviews]);

  useEffect(() => {
    if (!userId) return;
    obtenerPerfilCompleto();
  }, [userId]);

  async function obtenerPerfilCompleto() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const [userResponse, reviewsResponse] = await Promise.all([
        fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/reviews/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const userDataResponse = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userDataResponse.message ||
            userDataResponse.messages?.[0]?.description ||
            "No se pudo obtener el perfil"
        );
      }

      const userData = userDataResponse.data ?? userDataResponse;
      setUser(userData);

      const reviewsDataResponse = await reviewsResponse.json();

      if (reviewsResponse.ok) {
        setReviews(reviewsDataResponse.data ?? []);
      } else {
        console.log("No se pudieron cargar las reseñas:", reviewsDataResponse);
        setReviews([]);
      }
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el perfil del usuario.");
    } finally {
      setLoading(false);
    }
  }

  function renderStars(rating: number) {
    const rounded = Math.round(rating);

    return (
      <div className="profile-stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <span key={value} className={value <= rounded ? "star filled" : "star"}>
            ★
          </span>
        ))}
      </div>
    );
  }

  function formatearFecha(fecha: string) {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function textoRolCalificador(role: string) {
    if (role === "cliente") return "Cliente";
    if (role === "freelancer") return "Freelancer";
    return role;
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

            <div className="rating-summary-small">
              {renderStars(averageRating)}
              <span>
                {averageRating > 0 ? averageRating.toFixed(1) : "Sin calificación"}
              </span>
            </div>
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

          <div className="profile-row">
            <span>Calificación promedio</span>
            <strong>
              {averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : "Sin reseñas"}
            </strong>
          </div>

          <div className="profile-row">
            <span>Total de reseñas</span>
            <strong>{user.totalReviews ?? reviews.length}</strong>
          </div>

          {user.completedProjects !== undefined && (
            <div className="profile-row">
              <span>Proyectos completados</span>
              <strong>{user.completedProjects}</strong>
            </div>
          )}

          {user.isVerified !== undefined && (
            <div className="profile-row">
              <span>Verificado</span>
              <strong>{user.isVerified ? "Sí" : "No"}</strong>
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
              Aquí puedes ver su reputación, calificaciones recibidas de clientes
              y datos generales del perfil.
            </p>
          </div>
        )}

        {user.role === "cliente" && (
          <div className="profile-extra">
            <h3>Perfil Cliente</h3>
            <p>
              Aquí puedes ver su reputación como cliente y las calificaciones
              recibidas de freelancers.
            </p>
          </div>
        )}

        <div className="reviews-section">
          <div className="reviews-title-row">
            <div>
              <h3>Reseñas recibidas</h3>
              <p>
                {user.role === "freelancer"
                  ? "Opiniones de clientes que trabajaron con este freelancer."
                  : "Opiniones de freelancers que trabajaron con este cliente."}
              </p>
            </div>

            <div className="rating-box">
              <strong>{averageRating > 0 ? averageRating.toFixed(1) : "0.0"}</strong>
              <span>{reviews.length} reseña(s)</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="empty-reviews">
              Este usuario todavía no tiene reseñas.
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <article className="review-item" key={review.id}>
                  <div className="review-header">
                    <div>
                      <strong>{review.reviewer.name}</strong>
                      <small>
                        {textoRolCalificador(review.reviewerRole)} ·{" "}
                        {formatearFecha(review.createdAt)}
                      </small>
                    </div>

                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span>{review.rating}/5</span>
                    </div>
                  </div>

                  {review.comment ? (
                    <p>{review.comment}</p>
                  ) : (
                    <p className="no-comment">Sin comentario escrito.</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}