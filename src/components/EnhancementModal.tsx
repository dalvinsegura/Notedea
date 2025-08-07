"use client";

import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface EnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent: string;
  enhancedContent: string;
  onAccept: (enhancedContent: string) => void;
  isLoading?: boolean;
}

export default function EnhancementModal({
  isOpen,
  onClose,
  originalContent,
  enhancedContent,
  onAccept,
  isLoading = false,
}: EnhancementModalProps) {
  const [selectedTab, setSelectedTab] = useState<"enhanced" | "comparison">("enhanced");

  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept(enhancedContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" id="enhancement-modal">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              🤖 Idea Mejorada con IA
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab("enhanced")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedTab === "enhanced"
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              ✨ Versión Mejorada
            </button>
            <button
              onClick={() => setSelectedTab("comparison")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedTab === "comparison"
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🔄 Comparación
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Mejorando tu idea con IA...</p>
                <p className="text-sm text-gray-400 mt-2">Esto puede tomar unos segundos</p>
              </div>
            </div>
          ) : selectedTab === "enhanced" ? (
            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  💡 Mejoras aplicadas por IA:
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Mejor estructura y organización</li>
                  <li>• Mayor claridad en la expresión</li>
                  <li>• Formato Markdown mejorado</li>
                  <li>• Detalles y contexto adicional</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <MarkdownRenderer content={enhancedContent} />
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    📝 Versión Original
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-80 overflow-y-auto">
                    <MarkdownRenderer content={originalContent} />
                  </div>
                </div>
                
                {/* Enhanced */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    ✨ Versión Mejorada
                  </h3>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50 max-h-80 overflow-y-auto">
                    <MarkdownRenderer content={enhancedContent} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              id="cancel-enhancement-button"
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
              id="accept-enhancement-button"
            >
              Aceptar Mejoras
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
