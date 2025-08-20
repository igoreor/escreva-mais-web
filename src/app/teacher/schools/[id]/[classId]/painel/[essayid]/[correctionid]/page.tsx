"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation"; 

type Competencia = {
  id: number;
  titulo: string;
  descricao: string;
  pontos: string;
  total: string;
  feedback: string;
};

type PopupData =
  | {
      type: "competencia";
      titulo: string;
      descricao: string;
      pontos: string;
      total: string;
      feedback: string;
    }
  | {
      type: "geral";
      feedback: string;
    }
  | null;

const competencias: Competencia[] = [
  {
    id: 1,
    titulo: "Competência 1",
    descricao: "Domínio da norma padrão",
    pontos: "160",
    total: "1.0",
    feedback:
      "Você demonstrou um bom domínio da norma padrão, mas cometeu alguns deslizes gramaticais que prejudicaram a clareza em alguns trechos.",
  },
  {
    id: 2,
    titulo: "Competência 2",
    descricao: "Compreensão da proposta",
    pontos: "100",
    total: "1.0",
    feedback:
      "Sua redação atende parcialmente à proposta, mas poderia aprofundar melhor a relação com o tema central.",
  },
  {
    id: 3,
    titulo: "Competência 3",
    descricao: "Capacidade de argumentação",
    pontos: "100",
    total: "1.0",
    feedback:
      "Sua argumentação apresenta bons pontos, mas carece de exemplos mais concretos para sustentar a tese apresentada.",
  },
  {
    id: 4,
    titulo: "Competência 4",
    descricao: "Conhecimento dos mecanismos linguísticos",
    pontos: "100",
    total: "1.6",
    feedback:
      "Você usou conectivos básicos, mas precisa variar mais e explorar melhor recursos coesivos.",
  },
  {
    id: 5,
    titulo: "Competência 5",
    descricao: "Proposta de intervenção",
    pontos: "100",
    total: "1.0",
    feedback:
      "A proposta de intervenção está presente, mas faltam agentes claros e detalhamento das ações.",
  },
];

const geralFeedback =
  "No geral, sua redação apresenta boa estrutura, mas ainda precisa de ajustes em argumentação e detalhamento da proposta de intervenção.";

export default function RedacaoPage() {
  const [popup, setPopup] = useState<PopupData>(null);
  const router = useRouter();
  const params = useParams<{
    id: string;
    classId: string;
    essayid: string;
    correctionid: string;
  }>();

  // Preview atualizado
  const preview = (text: string) => {
    if (text.length > 50) {
      return { text: text.substring(0, 50) + "...", truncated: true };
    }
    return { text, truncated: false };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* BOTÃO VOLTAR - vai para a tela anterior */}
      <div className="w-full mb-4">
        <button
          onClick={() =>
            router.push(
              `/teacher/schools/${params.id}/${params.classId}/painel/${params.essayid}`
            )
          }
          className="flex items-center text-black hover:text- font-medium"
        >
          <span className="mr-1">{"<"}</span> Voltar
        </button>
      </div>

      {/* REDAÇÃO */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
        {/* Esse título pode mudar dinamicamente via props ou query params */}
        <h2 className="text-lg font-semibold mb-4">Maria de Silva</h2>
        <div className="bg-white border rounded-md h-[600px] overflow-y-scroll">
          <p className="p-4 text-gray-600">
            [Redação do aluno aparecerá aqui]
          </p>
        </div>
      </div>

      {/* COMPETÊNCIAS */}
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Desempenho por competência
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {competencias.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[200px] flex flex-col justify-between"
          >
            {/* HEADER */}
            <div className="bg-blue-50 px-4 py-3 border-b">
              <h4 className="text-sm font-bold text-blue-900">{c.titulo}</h4>
              <p className="text-xs text-gray-600">{c.descricao}</p>
            </div>

            {/* BODY */}
            <div className="p-5 flex flex-col flex-grow">
              <p className="text-2xl font-normal text-blue-900">
                {c.pontos}{" "}
                <span className="text-sm text-gray-400 font-normal">pontos</span>{" "}
                <span className="text-sm font-normal text-gray-900">/</span>{""}
                <span className="text-sm font-normal text-blue-900">
                  {c.total}
                </span>
                {""}
                <span className="text-sm font-normal text-gray-400">pontos</span>
              </p>

              <button
                type="button"
                className="text-blue-600 text-sm mt-2 text-left"
                onClick={() =>
                  setPopup({
                    type: "competencia",
                    titulo: c.titulo,
                    descricao: c.descricao,
                    pontos: c.pontos,
                    total: c.total,
                    feedback: c.feedback,
                  })
                }
              >
                Feedback da IA
              </button>

              <p className="text-sm text-gray-700 mt-1">
                {preview(c.feedback).text}{" "}
                {preview(c.feedback).truncated && (
                  <button
                    type="button"
                    onClick={() =>
                      setPopup({
                        type: "competencia",
                        titulo: c.titulo,
                        descricao: c.descricao,
                        pontos: c.pontos,
                        total: c.total,
                        feedback: c.feedback,
                      })
                    }
                    className="text-sm font-normal text-gray-400"
                  >
                    Ver mais
                  </button>
                )}
              </p>
            </div>
          </div>
        ))}

        {/* COMENTÁRIO GERAL */}
        <div className="bg-blue-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[200px] flex flex-col justify-between">
          <div className="bg-white border px-4 py-3 border-b">
            <h4 className="text-sm font-bold text-blue-900">Comentário geral</h4>
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <button
              type="button"
              className="text-blue-600 text-sm mt-2 text-left"
              onClick={() => setPopup({ type: "geral", feedback: geralFeedback })}
            >
              Feedback da IA
            </button>
            <p className="text-sm text-gray-700 mt-2 flex-grow">
              {preview(geralFeedback).text}{" "}
              {preview(geralFeedback).truncated && (
                <button
                  type="button"
                  onClick={() => setPopup({ type: "geral", feedback: geralFeedback })}
                  className="text-sm font-normal text-gray-400"
                >
                  Ver mais
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* COMENTÁRIO DO PROFESSOR */}
      <div className="mt-6 border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-white px-4 py-2 border-b">
          <h4 className="text-sm font-bold text-blue-900">
            Comentário do professor
          </h4>
        </div>
        <div className="bg-blue-50 p-4">
          <textarea
            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none resize-none h-40"
            placeholder="Dê feedback ao aluno."
          />
          <div className="flex justify-end">
            <button className="mt-2 bg-blue-600 text-white px-8 py-1.5 rounded-md opacity-80 hover:opacity-100">
              Enviar
            </button>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setPopup(null)}
        >
          <div
            className={`rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border
              ${
                popup.type === "geral"
                  ? "bg-white border-blue-300"
                  : "bg-white border-gray-200"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div
              className={`px-5 py-3 border-b rounded-t-2xl 
                ${popup.type === "geral" ? "bg-white" : "bg-blue-50"}`}
            >
              <h3 className="text-lg font-bold text-blue-900">
                {popup.type === "competencia"
                  ? popup.titulo
                  : "Comentário geral"}
              </h3>
              {popup.type === "competencia" && (
                <p className="text-sm text-gray-600">{popup.descricao}</p>
              )}
            </div>

            {/* BODY */}
            <div
              className={`p-6 ${
                popup.type === "geral" ? "bg-blue-50" : "bg-white"
              }`}
            >
              {popup.type === "competencia" ? (
                <>
                  <p className="text-3xl font-normal text-blue-900 mb-4">
                    {popup.pontos}{" "}
                    <span className="text-base text-gray-400 font-normal">
                      ponto
                    </span>{" "}
                    <span className="text-sm font-normal text-blue-900">/</span>
                    {""}
                    <span className="text-base font-normal text-blue-900">
                      {popup.total}
                    </span>
                    {""}
                    <span className="text-base text-gray-400 font-normal">
                      pontos
                    </span>
                  </p>

                  {/* Feedback da IA */}
                  <div className="mb-6">
                    <h4 className="text-sm font-normal text-blue-600 mb-1">
                      Feedback da IA
                    </h4>
                    <p className="text-sm text-gray-900">{popup.feedback}</p>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <h4 className="text-sm font-normal text-blue-600 mb-1">
                    Feedback da IA
                  </h4>
                  <p className="text-sm text-gray-900">{popup.feedback}</p>
                </div>
              )}

              {/* BOTÃO FECHAR */}
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => setPopup(null)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:opacity-90"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}