"use client";

import { useParams } from "next/navigation";
import ProposalProfile from "@/components/ProposalProfile/ProposalProfile";
import "./proposalProfile.css";
export default function ProposalPage()
{
    const params = useParams();

    const proposalId = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    if (!proposalId)
    {
        return <p>No se encontró la propuesta.</p>;
    }

    return <ProposalProfile proposalId={proposalId} />;
}