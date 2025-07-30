"use client";

import { useState } from "react";

interface UseIdeaEnhancementProps {
  onEnhancementAccepted?: (enhancedContent: string) => void;
}

interface EnhancementResult {
  enhancedContent: string;
  originalContent: string;
  originalTitle: string;
}

export function useIdeaEnhancement({ onEnhancementAccepted }: UseIdeaEnhancementProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enhanceIdea = async (title: string, content: string) => {
    // Validar entrada vacía con más detalle
    if (!content || content.trim().length === 0) {
      setError("El contenido no puede estar vacío. Escribe algo antes de mejorar la idea.");
      return;
    }

    // Validar contenido mínimo
    if (content.trim().length < 10) {
      setError("El contenido es muy corto. Escribe al menos 10 caracteres para obtener una mejora significativa.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsModalOpen(true);

    try {
      const response = await fetch("/api/enhance-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al mejorar la idea");
      }

      const result: EnhancementResult = await response.json();
      setEnhancementResult(result);
    } catch (err) {
      console.error("Error al mejorar idea:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptEnhancement = (enhancedContent: string) => {
    if (onEnhancementAccepted) {
      onEnhancementAccepted(enhancedContent);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEnhancementResult(null);
    setError(null);
  };

  return {
    enhanceIdea,
    acceptEnhancement,
    closeModal,
    isLoading,
    isModalOpen,
    enhancementResult,
    error,
  };
}
