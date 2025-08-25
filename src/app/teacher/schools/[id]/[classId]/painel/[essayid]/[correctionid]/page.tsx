'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EssayService, { EssayDetailsForTeacherResponse } from '@/services/EssayService';

type PopupData =
  | {
      type: 'competencia';
      titulo: string;
      descricao: string;
      pontos: number;
      total: number;
      feedback: string;
    }
  | {
      type: 'geral';
      feedback: string;
    }
  | null;

export default function RedacaoPage() {
  const [popup, setPopup] = useState<PopupData>(null);
  const [essayData, setEssayData] = useState<EssayDetailsForTeacherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { id: schoolId, classId, essayid, correctionid } = useParams();

  const handleSendComment = async () => {
    if (!comment.trim()) {
      setMessage("Escreva um comentário antes de enviar.");
      return;
    }

    try {
      setMessage("Enviando...");
      await EssayService.updateEssayFeedbackWithPermissionCheck(
        correctionid as string,
        { general_feedback: comment }
      );
      setMessage("Feedback enviado com sucesso! ✅");

      setEssayData((prev) =>
        prev ? { ...prev, general_feedback: comment } : prev
      );

      setComment("");
    } catch (err: any) {
      console.error("Erro ao enviar feedback:", err);
      setMessage(err.message || "Erro ao enviar feedback.");
    }
  };

  // Fetch dos dados da redação
  useEffect(() => {
    const fetchEssayData = async () => {
      if (!essayid || typeof essayid !== 'string') {
        setError('ID da redação não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await EssayService.getEssayDetailsForTeacherWithPermissionCheck(correctionid as string);
        setEssayData(data);
      } catch (err: any) {
        console.error('Erro ao carregar dados da redação:', err);
        setError(err.message || 'Erro ao carregar dados da redação');
      } finally {
        setLoading(false);
      }
    };

    fetchEssayData();
  }, [essayid]);

  // Função para mapear competências para formato do componente
  const getCompetenciaDisplay = (competency: string) => {
    const competencyMap: { [key: string]: string } = {
      C1: 'Domínio da norma padrão',
      C2: 'Compreensão da proposta',
      C3: 'Capacidade de argumentação',
      C4: 'Conhecimento dos mecanismos linguísticos',
      C5: 'Proposta de intervenção',
    };

    return {
      titulo: `Competência ${competency.replace('C', '')}`,
      descricao: competencyMap[competency] || 'Descrição não disponível',
    };
  };

  // Preview atualizado
  const preview = (text: string) => {
    if (text.length > 50) {
      return { text: text.substring(0, 50) + '...', truncated: true };
    }
    return { text, truncated: false };
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Carregando dados da redação...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erro:</strong> {error}
        </div>
      </div>
    );
  }

  if (!essayData) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center text-gray-600">Dados da redação não encontrados</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* BOTÃO VOLTAR */}
      <div className="w-full mb-4">
        <button
          onClick={() => router.push(`/teacher/schools/${schoolId}/${classId}/painel/${essayid}`)}
          className="flex items-center text-black hover:text-gray-600 font-medium"
        >
          <span className="mr-1">{'<'}</span> Voltar
        </button>
      </div>

      {/* REDAÇÃO */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {essayData.student.first_name} {essayData.student.last_name}
        </h2>
        <div className="bg-white border rounded-md h-[600px] overflow-y-scroll">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">{essayData.title}</h3>
            <div className="text-gray-700 whitespace-pre-wrap">{essayData.content}</div>
          </div>
        </div>
      </div>

      {/* COMPETÊNCIAS */}
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Desempenho por competência</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {essayData.competency_feedbacks.map((competency) => {
          const display = getCompetenciaDisplay(competency.competency);
          return (
            <div
              key={competency.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[200px] flex flex-col justify-between"
            >
              {/* HEADER */}
              <div className="bg-blue-50 px-4 py-3 border-b">
                <h4 className="text-sm font-bold text-blue-900">{display.titulo}</h4>
                <p className="text-xs text-gray-600">{display.descricao}</p>
              </div>

              {/* BODY */}
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-2xl font-normal text-blue-900">
                  {competency.score}{' '}
                  <span className="text-sm text-gray-400 font-normal">pontos</span>
                </p>

                <button
                  type="button"
                  className="text-blue-600 text-sm mt-2 text-left"
                  onClick={() =>
                    setPopup({
                      type: 'competencia',
                      titulo: display.titulo,
                      descricao: display.descricao,
                      pontos: competency.score,
                      total: 200, // Valor máximo padrão, você pode ajustar conforme necessário
                      feedback: competency.feedback,
                    })
                  }
                >
                  Feedback da IA
                </button>

                <p className="text-sm text-gray-700 mt-1">
                  {preview(competency.feedback).text}{' '}
                  {preview(competency.feedback).truncated && (
                    <button
                      type="button"
                      onClick={() =>
                        setPopup({
                          type: 'competencia',
                          titulo: display.titulo,
                          descricao: display.descricao,
                          pontos: competency.score,
                          total: 200,
                          feedback: competency.feedback,
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
          );
        })}

        {/* COMENTÁRIO GERAL */}
        <div className="bg-blue-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[200px] flex flex-col justify-between">
          <div className="bg-white border px-4 py-3 border-b">
            <h4 className="text-sm font-bold text-blue-900">Comentário geral</h4>
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <button
              type="button"
              className="text-blue-600 text-sm mt-2 text-left"
              onClick={() => setPopup({ type: 'geral', feedback: essayData.general_feedback })}
            >
              Feedback do professor
            </button>
            <p className="text-sm text-gray-700 mt-2 flex-grow">
              {preview(essayData.general_feedback).text}{' '}
              {preview(essayData.general_feedback).truncated && (
                <button
                  type="button"
                  onClick={() => setPopup({ type: 'geral', feedback: essayData.general_feedback })}
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
          <h4 className="text-sm font-bold text-blue-900">Comentário do professor</h4>
        </div>
        <div className="bg-blue-50 p-4">
          <textarea
            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none resize-none h-40"
            placeholder="Dê feedback ao aluno."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSendComment}
              className="mt-2 bg-blue-600 text-white px-8 py-1.5 rounded-md opacity-80 hover:opacity-100"
            >
              Enviar
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
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
              ${popup.type === 'geral' ? 'bg-white border-blue-300' : 'bg-white border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div
              className={`px-5 py-3 border-b rounded-t-2xl 
                ${popup.type === 'geral' ? 'bg-white' : 'bg-blue-50'}`}
            >
              <h3 className="text-lg font-bold text-blue-900">
                {popup.type === 'competencia' ? popup.titulo : 'Comentário geral'}
              </h3>
              {popup.type === 'competencia' && (
                <p className="text-sm text-gray-600">{popup.descricao}</p>
              )}
            </div>

            {/* BODY */}
            <div className={`p-6 ${popup.type === 'geral' ? 'bg-blue-50' : 'bg-white'}`}>
              {popup.type === 'competencia' ? (
                <>
                  <p className="text-3xl font-normal text-blue-900 mb-4">
                    {popup.pontos}{' '}
                    <span className="text-base text-gray-400 font-normal">pontos</span>{' '}
                    <span className="text-sm font-normal text-blue-900">/</span>
                    <span className="text-base font-normal text-blue-900">{popup.total}</span>
                    <span className="text-base text-gray-400 font-normal">pontos</span>
                  </p>

                  {/* Feedback da IA */}
                  <div className="mb-6">
                    <h4 className="text-sm font-normal text-blue-600 mb-1">Feedback da IA</h4>
                    <p className="text-sm text-gray-900">{popup.feedback}</p>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <h4 className="text-sm font-normal text-blue-600 mb-1">Feedback do professor</h4>
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