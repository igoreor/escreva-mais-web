'use client';

import RouteGuard from "@/components/auth/RouterGuard";
import { useAuth } from "@/hooks/userAuth";
import Sidebar, { SidebarItem } from "@/components/common/SideBar";
import { FiHome, FiBookOpen, FiUser, FiFileMinus, FiArrowLeft } from "react-icons/fi";

export default function TemaDetalhesPage() {
  const { logout } = useAuth();

  const menuItems: SidebarItem[] = [
    { id: 'home', label: 'Início', icon: <FiHome size={34} />, href: '/teacher/home' },
    { id: 'management', label: 'Minhas Turmas', icon: <FiBookOpen size={34} />, href: '/teacher/schools' },
    { id: 'temas', label: 'Meus Temas', icon: <FiFileMinus size={34} />, href: '/teacher/themes' },
    { id: 'profile', label: 'Meu Perfil', icon: <FiUser size={34} />, href: '/teacher/profile' },
  ];

  const tema = {
    titulo: "O impacto das redes sociais na sociedade moderna",
    textos: [
      {
        titulo: "TEXTO I",
        conteudo: `O trabalho de cuidado não remunerado e mal pago é essencial para nossas sociedades e para a economia. 
Ele inclui o trabalho de cuidar de crianças, idosos e pessoas com doenças e deficiências físicas e mentais, 
bem como o trabalho doméstico diário que inclui cozinhar, limpar, lavar, consertar coisas e buscar água e lenha. 
Se ninguém investisse tempo, esforços e recursos nessas tarefas diárias, economias inteiras ficariam estagnadas...`,
        fonte: "Documento informativo - Tempo de Cuidar. Oxfam, 2023."
      },
      {
        titulo: "TEXTO II",
        conteudo: `Média de horas dedicadas pelas pessoas de 14 anos ou mais de idade aos afazeres domésticos e/ou às tarefas de cuidado de pessoas, por sexo.`,
        imagem: "https://via.placeholder.com/300x150", 
        fonte: "Fonte: IBGE, 2023."
      },
      {
        titulo: "TEXTO III",
        conteudo: `A sociedade brasileira tem passado por inúmeras transformações sociais ao longo das últimas décadas. 
Entre elas as percepções sociais a respeito dos valores e das convenções de gênero e a forma como mulheres têm se inserido na sociedade.`,
        fonte: "Disponível em: https://repositorio.ipea.gov.br"
      },
      {
        titulo: "TEXTO IV",
        imagem: "https://via.placeholder.com/300x400",
        fonte: "Capa da revista Pesquisa FAPESP, 2023."
      },
    ]
  };

  return (
    <RouteGuard allowedRoles={['teacher']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar menuItems={menuItems} onLogout={logout} />

        <main className="flex-1 lg:ml-[270px] p-6 lg:p-10">
          {/* Voltar */}
          <button
            onClick={() => window.location.href = `/teacher/themes`}
            className="flex items-center text-blue-600 mb-4 hover:underline"
          >
            <FiArrowLeft className="mr-1" /> Voltar
          </button>

          {/* Título */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{tema.titulo}</h1>

            <h2 className="text-lg font-semibold text-blue-700 mb-4">Textos motivadores</h2>

            <div className="flex flex-col gap-6">
              {tema.textos.map((t, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-bold mb-2">{t.titulo}</h3>
                  {t.conteudo && <p className="text-gray-700 mb-2 whitespace-pre-line">{t.conteudo}</p>}
                  {t.imagem && (
                    <img src={t.imagem} alt={t.titulo} className="rounded-lg border mb-2 max-w-md" />
                  )}
                  {t.fonte && <p className="text-sm text-gray-500">📖 {t.fonte}</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Excluir tema
              </button>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
