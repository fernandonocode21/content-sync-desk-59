import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LogOut, ExternalLink } from 'lucide-react';

interface Video {
  video_id: string;
  titulo: string;
  status: string;
  canal_nome: string;
  data_criacao: string;
  data_agendada?: string;
  hora_agendada?: string;
  thumbnail_pronta: boolean;
  google_drive_link?: string;
}

const MemberDashboard = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [driveLinks, setDriveLinks] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadMemberData();
  }, []);

  const loadMemberData = async () => {
    const memberSession = localStorage.getItem('member_session');
    if (!memberSession) {
      navigate('/member-auth');
      return;
    }

    try {
      const sessionData = JSON.parse(memberSession);
      setMemberInfo(sessionData);

      const { data, error } = await supabase.rpc('get_member_videos', {
        p_session_token: sessionData.session_token
      });

      if (error) throw error;
      setVideos(data || []);

      // Initialize drive links
      const initialLinks: { [key: string]: string } = {};
      data?.forEach((video: Video) => {
        if (video.google_drive_link) {
          initialLinks[video.video_id] = video.google_drive_link;
        }
      });
      setDriveLinks(initialLinks);
    } catch (error) {
      console.error('Error loading member data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados. Faça login novamente.",
        variant: "destructive"
      });
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const memberSession = localStorage.getItem('member_session');
    if (memberSession) {
      const sessionData = JSON.parse(memberSession);
      await supabase.rpc('logout_member', {
        p_session_token: sessionData.session_token
      });
    }
    localStorage.removeItem('member_session');
    navigate('/member-auth');
  };

  const updateVideoStatus = async (videoId: string, newStatus: string) => {
    const memberSession = localStorage.getItem('member_session');
    if (!memberSession) return;

    try {
      const sessionData = JSON.parse(memberSession);
      const { data, error } = await supabase.rpc('update_member_video_status', {
        p_session_token: sessionData.session_token,
        p_video_id: videoId,
        p_new_status: newStatus
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Status atualizado!",
          description: `Vídeo movido para ${newStatus}`
        });
        loadMemberData();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating video status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  };

  const updateDriveLink = async (videoId: string) => {
    const link = driveLinks[videoId];
    if (!link) return;

    try {
      const { error } = await supabase
        .from('videos')
        .update({ google_drive_link: link })
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Link atualizado!",
        description: "Link do Google Drive salvo com sucesso"
      });
    } catch (error) {
      console.error('Error updating drive link:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar link",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'edicao': return 'bg-yellow-500';
      case 'pronto': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    if (currentStatus === 'edicao') return 'pronto';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Área do Colaborador</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {memberInfo?.member_name}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.video_id} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  {video.titulo}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{video.canal_nome}</Badge>
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Criado em: {new Date(video.data_criacao).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`drive-${video.video_id}`}>
                    Link do Google Drive
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`drive-${video.video_id}`}
                      value={driveLinks[video.video_id] || ''}
                      onChange={(e) => setDriveLinks(prev => ({
                        ...prev,
                        [video.video_id]: e.target.value
                      }))}
                      placeholder="Cole o link da pasta aqui"
                    />
                    <Button
                      size="sm"
                      onClick={() => updateDriveLink(video.video_id)}
                      disabled={!driveLinks[video.video_id]}
                    >
                      Salvar
                    </Button>
                  </div>
                  {video.google_drive_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(video.google_drive_link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Pasta
                    </Button>
                  )}
                </div>

                {getNextStatus(video.status) && (
                  <Button
                    className="w-full"
                    onClick={() => updateVideoStatus(video.video_id, getNextStatus(video.status)!)}
                  >
                    Mover para {getNextStatus(video.status)}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum vídeo atribuído a você no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;