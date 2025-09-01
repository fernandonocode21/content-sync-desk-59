import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Plus, ExternalLink, Star, Trash2, Edit } from 'lucide-react';

interface CompetitorChannel {
  id: string;
  nome: string;
  endereco_canal: string;
  nicho: string;
  observacao?: string;
  detalhes?: string;
  favorito: boolean;
  created_at: string;
  updated_at: string;
}

const CompetitorChannels = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<CompetitorChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState<CompetitorChannel | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    endereco_canal: '',
    nicho: '',
    observacao: '',
    detalhes: '',
    favorito: false
  });

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_competitor_channels', { user_uuid: user.id });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Error loading competitor channels:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar canais concorrentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingChannel) {
        const { error } = await supabase
          .rpc('update_competitor_channel', {
            channel_id: editingChannel.id,
            channel_data: formData
          });

        if (error) throw error;

        toast({
          title: "Canal atualizado!",
          description: "Canal concorrente atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .rpc('create_competitor_channel', {
            user_uuid: user.id,
            channel_data: formData
          });

        if (error) throw error;

        toast({
          title: "Canal adicionado!",
          description: "Canal concorrente adicionado com sucesso"
        });
      }

      resetForm();
      loadChannels();
    } catch (error) {
      console.error('Error saving competitor channel:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar canal concorrente",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (channelId: string) => {
    if (!user || !confirm('Tem certeza que deseja excluir este canal?')) return;

    try {
      const { error } = await supabase
        .rpc('delete_competitor_channel', {
          channel_id: channelId,
          user_uuid: user.id
        });

      if (error) throw error;

      toast({
        title: "Canal excluído!",
        description: "Canal concorrente excluído com sucesso"
      });
      loadChannels();
    } catch (error) {
      console.error('Error deleting competitor channel:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir canal concorrente",
        variant: "destructive"
      });
    }
  };

  const toggleFavorite = async (channel: CompetitorChannel) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('toggle_competitor_favorite', {
          channel_id: channel.id,
          user_uuid: user.id
        });

      if (error) throw error;
      loadChannels();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar favorito",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco_canal: '',
      nicho: '',
      observacao: '',
      detalhes: '',
      favorito: false
    });
    setEditingChannel(null);
    setShowForm(false);
  };

  const editChannel = (channel: CompetitorChannel) => {
    setFormData({
      nome: channel.nome,
      endereco_canal: channel.endereco_canal,
      nicho: channel.nicho,
      observacao: channel.observacao || '',
      detalhes: channel.detalhes || '',
      favorito: channel.favorito
    });
    setEditingChannel(channel);
    setShowForm(true);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Canais Concorrentes</h1>
          <p className="text-muted-foreground">
            Mantenha um banco de dados de canais para inspiração e análise
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Canal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChannel ? 'Editar Canal' : 'Adicionar Canal Concorrente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Canal</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do canal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco_canal">Link do Canal</Label>
                <Input
                  id="endereco_canal"
                  value={formData.endereco_canal}
                  onChange={(e) => setFormData({ ...formData, endereco_canal: e.target.value })}
                  placeholder="https://youtube.com/@canal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nicho">Nicho</Label>
                <Input
                  id="nicho"
                  value={formData.nicho}
                  onChange={(e) => setFormData({ ...formData, nicho: e.target.value })}
                  placeholder="Ex: Tech, Gaming, Educação"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao">Observações</Label>
                <Textarea
                  id="observacao"
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Observações sobre o canal"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detalhes">Detalhes</Label>
                <Textarea
                  id="detalhes"
                  value={formData.detalhes}
                  onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                  placeholder="Detalhes adicionais, estratégias, etc."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="favorito"
                  checked={formData.favorito}
                  onChange={(e) => setFormData({ ...formData, favorito: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="favorito">Marcar como favorito</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingChannel ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2 flex-1">
                  {channel.nome}
                  {channel.favorito && (
                    <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current inline" />
                  )}
                </CardTitle>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(channel)}
                  >
                    <Star 
                      className={`w-4 h-4 ${channel.favorito ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editChannel(channel)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(channel.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <Badge variant="secondary">{channel.nicho}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(channel.endereco_canal, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visitar Canal
              </Button>
              
              {channel.observacao && (
                <div>
                  <p className="text-sm font-medium mb-1">Observações:</p>
                  <p className="text-sm text-muted-foreground">{channel.observacao}</p>
                </div>
              )}
              
              {channel.detalhes && (
                <div>
                  <p className="text-sm font-medium mb-1">Detalhes:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{channel.detalhes}</p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Adicionado em: {new Date(channel.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {channels.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum canal concorrente cadastrado ainda.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Canal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompetitorChannels;