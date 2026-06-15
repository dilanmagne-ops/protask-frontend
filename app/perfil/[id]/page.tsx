"use client";

import { useParams } from "next/navigation";
import UserProfile from "@/components/UserProfile/UserProfile";

export default function PerfilPage() {
  const params = useParams();

  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!userId) {
    return <p>No se encontró el ID del usuario.</p>;
  }
  return <UserProfile userId={userId} />;
}