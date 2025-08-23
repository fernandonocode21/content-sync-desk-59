import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Canal {
  id: string;
  nome: string;
  link: string;
  lingua: string;
  nicho: string;
  sub_nicho: string;
  micro_nicho: string;
  freq_postagem: string;
  cor: string;
  logo_url?: string;
  dias_postagem: string[];
  horarios_postagem: string[];
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export interface Video {
  id: string;
  titulo: string;
  status: 'ideias' | 'roteiro' | 'audio' | 'edicao' | 'pronto';
  canal_id: string;
  canal_nome: string;
  responsavel_id?: string;
  responsavel_nome?: string;
  data_criacao: Date;
  data_agendada?: Date;
  hora_agendada?: string;
  thumbnail_pronta: boolean;
}

export interface Idea {
  id: string;
  titulo: string;
  descricao: string;
  canal_id: string;
  canal_nome: string;
  canal_cor: string;
  data_criacao: Date;
  status: 'pendente' | 'aprovada' | 'rejeitada';
}

export interface ScheduledVideo {
  id: string;
  titulo: string;
  canal_nome: string;
  canal_cor: string;
  data_agendada: Date;
  hora_agendada: string;
  link_youtube?: string;
  status: 'agendado' | 'publicado';
}

// Initial Data
const initialCanais: Canal[] = [
  {
    id: '1',
    nome: 'Money Minds',
    link: 'https://youtube.com/@moneyminds',
    lingua: 'Português',
    nicho: 'Finanças',
    sub_nicho: 'Investimentos',
    micro_nicho: 'Ações & Fundos',
    freq_postagem: '3x por semana',
    cor: '#4ECDC4',
    logo_url: '/placeholder.svg',
    dias_postagem: ['Segunda', 'Quarta', 'Sexta'],
    horarios_postagem: ['09:00', '14:00', '19:00'],
  },
  {
    id: '2',
    nome: 'Tech Insights',
    link: 'https://youtube.com/@techinsights',
    lingua: 'Português',
    nicho: 'Tecnologia',
    sub_nicho: 'Inteligência Artificial',
    micro_nicho: 'IA no Cotidiano',
    freq_postagem: '2x por semana',
    cor: '#45B7D1',
    logo_url: '/placeholder.svg',
    dias_postagem: ['Terça', 'Quinta'],
    horarios_postagem: ['10:00', '16:00'],
  },
  {
    id: '3',
    nome: 'Lifestyle Hub',
    link: 'https://youtube.com/@lifestylehub',
    lingua: 'Português',
    nicho: 'Lifestyle',
    sub_nicho: 'Produtividade',
    micro_nicho: 'Hábitos Saudáveis',
    freq_postagem: '2x por semana',
    cor: '#96CEB4',
    logo_url: '/placeholder.svg',
    dias_postagem: ['Domingo', 'Quarta'],
    horarios_postagem: ['08:00', '20:00'],
  },
];

const initialUsuarios: Usuario[] = [
  { id: '1', nome: 'Ana Silva', email: 'ana@darkchannels.com', role: 'Roteirista' },
  { id: '2', nome: 'Carlos Santos', email: 'carlos@darkchannels.com', role: 'Editor' },
  { id: '3', nome: 'Pedro Costa', email: 'pedro@darkchannels.com', role: 'Narrador' },
  { id: '4', nome: 'Maria Oliveira', email: 'maria@darkchannels.com', role: 'Gerente' },
];

const initialVideos: Video[] = [
  {
    id: '1',
    titulo: '10 Segredos do Sucesso Financeiro',
    status: 'ideias',
    canal_id: '1',
    canal_nome: 'Money Minds',
    responsavel_id: '1',
    responsavel_nome: 'Ana Silva',
    data_criacao: new Date(),
    thumbnail_pronta: false,
  },
  {
    id: '2',
    titulo: 'Como Ganhar Dinheiro Online em 2024',
    status: 'roteiro',
    canal_id: '1',
    canal_nome: 'Money Minds',
    responsavel_id: '2',
    responsavel_nome: 'Carlos Santos',
    data_criacao: new Date(),
    thumbnail_pronta: true,
  },
  {
    id: '3',
    titulo: 'Investimentos para Iniciantes',
    status: 'audio',
    canal_id: '1',
    canal_nome: 'Money Minds',
    responsavel_id: '1',
    responsavel_nome: 'Ana Silva',
    data_criacao: new Date(),
    thumbnail_pronta: false,
  },
  {
    id: '4',
    titulo: 'Criptomoedas: Guia Completo',
    status: 'edicao',
    canal_id: '2',
    canal_nome: 'Tech Insights',
    responsavel_id: '3',
    responsavel_nome: 'Pedro Costa',
    data_criacao: new Date(),
    thumbnail_pronta: true,
  },
  {
    id: '5',
    titulo: 'Inteligência Artificial no Cotidiano',
    status: 'pronto',
    canal_id: '2',
    canal_nome: 'Tech Insights',
    responsavel_id: '4',
    responsavel_nome: 'Maria Oliveira',
    data_criacao: new Date(),
    thumbnail_pronta: true,
  },
  {
    id: '6',
    titulo: 'Como Criar Rotina Produtiva',
    status: 'pronto',
    canal_id: '3',
    canal_nome: 'Lifestyle Hub',
    responsavel_id: '1',
    responsavel_nome: 'Ana Silva',
    data_criacao: new Date(),
    thumbnail_pronta: true,
  },
  {
    id: '7',
    titulo: 'IA no Marketing Digital - ATRASADO',
    status: 'pronto',
    canal_id: '2',
    canal_nome: 'Tech Insights',
    responsavel_id: '2',
    responsavel_nome: 'Carlos Santos',
    data_criacao: new Date(),
    thumbnail_pronta: false,
  },
];

const initialIdeias: Idea[] = [
  {
    id: '1',
    titulo: '15 Dicas de Economia Doméstica',
    descricao: 'Como economizar dinheiro no dia a dia com dicas práticas',
    canal_id: '1',
    canal_nome: 'Money Minds',
    canal_cor: '#4ECDC4',
    data_criacao: new Date(),
    status: 'pendente',
  },
  {
    id: '2',
    titulo: 'Tendências de IA para 2024',
    descricao: 'As principais tendências de inteligência artificial',
    canal_id: '2',
    canal_nome: 'Tech Insights',
    canal_cor: '#45B7D1',
    data_criacao: new Date(),
    status: 'pendente',
  },
  {
    id: '3',
    titulo: 'Mindfulness para Produtividade',
    descricao: 'Como usar mindfulness para ser mais produtivo',
    canal_id: '3',
    canal_nome: 'Lifestyle Hub',
    canal_cor: '#96CEB4',
    data_criacao: new Date(),
    status: 'aprovada',
  },
];

// Context
interface AppContextType {
  // Data
  canais: Canal[];
  usuarios: Usuario[];
  videos: Video[];
  ideias: Idea[];
  scheduledVideos: ScheduledVideo[];
  
  // Canal Actions
  addCanal: (canal: Omit<Canal, 'id'>) => void;
  updateCanal: (id: string, canal: Partial<Canal>) => void;
  deleteCanal: (id: string) => void;
  
  // Usuario Actions
  addUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;
  
  // Video Actions
  updateVideo: (id: string, video: Partial<Video>) => void;
  addVideo: (video: Omit<Video, 'id'>) => void;
  deleteVideo: (id: string) => void;
  moveVideoToIdeas: (videoId: string) => void;
  scheduleVideo: (video: Video, data_agendada: Date, hora_agendada: string, link_youtube?: string) => void;
  unscheduleVideo: (id: string) => void;
  
  // Idea Actions
  addIdeia: (idea: Omit<Idea, 'id'>) => void;
  updateIdeia: (id: string, idea: Partial<Idea>) => void;
  deleteIdeia: (id: string) => void;
  approveIdeaToProduction: (ideaId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [canais, setCanais] = useState<Canal[]>(initialCanais);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [ideias, setIdeias] = useState<Idea[]>(initialIdeias);
  const [scheduledVideos, setScheduledVideos] = useState<ScheduledVideo[]>([
    {
      id: 'scheduled-1',
      titulo: 'Como Investir na Bolsa para Iniciantes',
      canal_nome: 'Money Minds',
      canal_cor: '#4ECDC4',
      data_agendada: new Date(2025, 0, 25), // 25 de janeiro de 2025
      hora_agendada: '09:00',
      status: 'agendado',
      link_youtube: ''
    },
    {
      id: 'scheduled-2',
      titulo: 'IA no Futuro do Trabalho',
      canal_nome: 'Tech Insights',
      canal_cor: '#45B7D1',
      data_agendada: new Date(2025, 0, 25), // 25 de janeiro de 2025
      hora_agendada: '14:00',
      status: 'agendado',
      link_youtube: 'https://www.youtube.com/watch?v=example'
    },
    {
      id: 'scheduled-3',
      titulo: 'Produtividade para Millennials',
      canal_nome: 'Lifestyle Hub',
      canal_cor: '#96CEB4',
      data_agendada: new Date(2025, 0, 26), // 26 de janeiro de 2025
      hora_agendada: '08:00',
      status: 'agendado',
      link_youtube: ''
    }
  ]);

  // Canal Actions
  const addCanal = (canal: Omit<Canal, 'id'>) => {
    const newCanal = { ...canal, id: Date.now().toString() };
    setCanais(prev => [...prev, newCanal]);
  };

  const updateCanal = (id: string, canalUpdate: Partial<Canal>) => {
    setCanais(prev => prev.map(canal => 
      canal.id === id ? { ...canal, ...canalUpdate } : canal
    ));
  };

  const deleteCanal = (id: string) => {
    setCanais(prev => prev.filter(canal => canal.id !== id));
    // Remove videos do canal deletado
    setVideos(prev => prev.filter(video => video.canal_id !== id));
    setIdeias(prev => prev.filter(idea => idea.canal_id !== id));
  };

  // Usuario Actions
  const addUsuario = (usuario: Omit<Usuario, 'id'>) => {
    const newUsuario = { ...usuario, id: Date.now().toString() };
    setUsuarios(prev => [...prev, newUsuario]);
  };

  const updateUsuario = (id: string, usuarioUpdate: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(usuario => 
      usuario.id === id ? { ...usuario, ...usuarioUpdate } : usuario
    ));
  };

  const deleteUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
    // Remove responsável dos vídeos
    setVideos(prev => prev.map(video => 
      video.responsavel_id === id 
        ? { ...video, responsavel_id: undefined, responsavel_nome: undefined }
        : video
    ));
  };

  // Video Actions
  const updateVideo = (id: string, videoUpdate: Partial<Video>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...videoUpdate } : video
    ));
  };

  const addVideo = (video: Omit<Video, 'id'>) => {
    const newVideo = { ...video, id: Date.now().toString() };
    setVideos(prev => [...prev, newVideo]);
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const moveVideoToIdeas = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const canal = canais.find(c => c.id === video.canal_id);
    if (!canal) return;

    // Create idea from video
    const newIdeia = {
      titulo: video.titulo,
      descricao: `Retornado da produção`,
      canal_id: video.canal_id,
      canal_nome: video.canal_nome,
      canal_cor: canal.cor,
      data_criacao: new Date(),
      status: 'pendente' as const,
    };

    addIdeia(newIdeia);
    deleteVideo(videoId);
  };

  const scheduleVideo = (video: Video, data_agendada: Date, hora_agendada: string, link_youtube?: string) => {
    // Remove do kanban (status pronto)
    setVideos(prev => prev.filter(v => v.id !== video.id));
    
    // Adiciona aos vídeos agendados
    const scheduledVideo: ScheduledVideo = {
      id: video.id,
      titulo: video.titulo,
      canal_nome: video.canal_nome,
      canal_cor: canais.find(c => c.id === video.canal_id)?.cor || 'channel-business',
      data_agendada,
      hora_agendada,
      link_youtube,
      status: 'agendado',
    };
    
    setScheduledVideos(prev => [scheduledVideo, ...prev]);
  };

  const unscheduleVideo = (id: string) => {
    const scheduled = scheduledVideos.find(v => v.id === id);
    if (!scheduled) return;

    // Remove dos agendados
    setScheduledVideos(prev => prev.filter(v => v.id !== id));
    
    // Volta para kanban como pronto
    const canal = canais.find(c => c.nome === scheduled.canal_nome);
    if (canal) {
      const backToVideo: Video = {
        id: scheduled.id,
        titulo: scheduled.titulo,
        status: 'pronto',
        canal_id: canal.id,
        canal_nome: scheduled.canal_nome,
        data_criacao: new Date(),
        thumbnail_pronta: true,
      };
      
      setVideos(prev => [backToVideo, ...prev]);
    }
  };

  // Idea Actions
  const addIdeia = (idea: Omit<Idea, 'id'>) => {
    const newIdeia = { ...idea, id: Date.now().toString() };
    setIdeias(prev => [newIdeia, ...prev]);
  };

  const approveIdeaToProduction = (ideaId: string) => {
    const idea = ideias.find(i => i.id === ideaId);
    if (!idea) return;

    // Create video from idea
    const newVideo = {
      titulo: idea.titulo,
      status: 'ideias' as const,
      canal_id: idea.canal_id,
      canal_nome: idea.canal_nome,
      responsavel_id: undefined,
      responsavel_nome: undefined,
      data_criacao: new Date(),
      data_agendada: undefined,
      hora_agendada: undefined,
      thumbnail_pronta: false,
    };

    addVideo(newVideo);
    deleteIdeia(ideaId);
  };

  const updateIdeia = (id: string, ideiaUpdate: Partial<Idea>) => {
    setIdeias(prev => prev.map(idea => 
      idea.id === id ? { ...idea, ...ideiaUpdate } : idea
    ));
  };

  const deleteIdeia = (id: string) => {
    setIdeias(prev => prev.filter(idea => idea.id !== id));
  };

  const value: AppContextType = {
    canais,
    usuarios,
    videos,
    ideias,
    scheduledVideos,
    addCanal,
    updateCanal,
    deleteCanal,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    updateVideo,
    addVideo,
    deleteVideo,
    moveVideoToIdeas,
    scheduleVideo,
    unscheduleVideo,
    addIdeia,
    updateIdeia,
    deleteIdeia,
    approveIdeaToProduction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
