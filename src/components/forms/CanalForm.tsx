
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Canal } from '@/contexts/AppContext';

interface CanalFormProps {
  canal?: Canal;
  onSubmit: (canal: Omit<Canal, 'id'>) => void;
  onCancel: () => void;
}

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// Dezenas de cores disponíveis
const cores = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB', '#AED6F1',
  '#A9DFBF', '#F5B7B1', '#D2B4DE', '#A9CCE3', '#A3E4D7',
  '#F7DC6F', '#FADBD8', '#D5DBDB', '#AED6F1', '#A9DFBF',
  '#FF5733', '#C70039', '#900C3F', '#581845', '#2C3E50',
  '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1',
  '#1ABC9C', '#16A085', '#2ECC71', '#27AE60', '#3498DB',
  '#2980B9', '#9B59B6', '#8E44AD', '#F39C12', '#E67E22',
  '#E74C3C', '#C0392B', '#F1C40F', '#F39C12', '#E67E22',
  '#D35400', '#E74C3C', '#C0392B', '#9B59B6', '#8E44AD'
];

export const CanalForm: React.FC<CanalFormProps> = ({ canal, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: canal?.nome || '',
    link: canal?.link || '',
    lingua: canal?.lingua || '',
    nicho: canal?.nicho || '',
    sub_nicho: canal?.sub_nicho || '',
    micro_nicho: canal?.micro_nicho || '',
    freq_postagem: canal?.freq_postagem || '',
    cor: canal?.cor || '#FF6B6B',
    logo_url: canal?.logo_url || '',
    dias_postagem: canal?.dias_postagem || [],
    horarios_postagem: canal?.horarios_postagem || [],
  });

  const [novoHorario, setNovoHorario] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;
    
    // Validação: número de horários deve corresponder ao número de dias
    if (formData.dias_postagem.length !== formData.horarios_postagem.length) {
      alert(`Você selecionou ${formData.dias_postagem.length} dias, mas tem ${formData.horarios_postagem.length} horários. Por favor, adicione horários correspondentes aos dias selecionados.`);
      return;
    }
    
    // Gera freq_postagem baseado nos dias selecionados
    const freq = formData.dias_postagem.length === 7 ? 'Diário' : `${formData.dias_postagem.length}x por semana`;
    
    onSubmit({
      ...formData,
      freq_postagem: freq
    });
  };

  const toggleDia = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      dias_postagem: prev.dias_postagem.includes(dia)
        ? prev.dias_postagem.filter(d => d !== dia)
        : [...prev.dias_postagem, dia]
    }));
  };

  const addHorario = () => {
    if (novoHorario && !formData.horarios_postagem.includes(novoHorario)) {
      setFormData(prev => ({
        ...prev,
        horarios_postagem: [...prev.horarios_postagem, novoHorario].sort()
      }));
      setNovoHorario('');
    }
  };

  const removeHorario = (horario: string) => {
    setFormData(prev => ({
      ...prev,
      horarios_postagem: prev.horarios_postagem.filter(h => h !== horario)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-primary p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {canal ? 'Editar Canal' : 'Novo Canal'}
          </h2>
          <button onClick={onCancel} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome e Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome do Canal *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="input-primary w-full"
                placeholder="Ex: Money Minds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Link do Canal
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="input-primary w-full"
                placeholder="https://youtube.com/@canalname"
              />
            </div>
          </div>

          {/* Logo do Canal */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Logo do Canal
            </label>
            <div className="flex items-center gap-4">
              {formData.logo_url && (
                <img 
                  src={formData.logo_url} 
                  alt="Logo do canal" 
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
              )}
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="input-primary w-full"
                  placeholder="URL da logo do canal"
                />
              </div>
              <label className="btn-secondary cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        setFormData(prev => ({ ...prev, logo_url: result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Idioma e Cor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Idioma(s)
              </label>
              <input
                type="text"
                value={formData.lingua}
                onChange={(e) => setFormData(prev => ({ ...prev, lingua: e.target.value }))}
                className="input-primary w-full"
                placeholder="Ex: Português, Inglês, Espanhol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cor do Canal
              </label>
              <div className="grid grid-cols-10 gap-1 p-3 border border-border rounded-md max-h-32 overflow-y-auto">
                {cores.map((cor, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, cor }))}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                      formData.cor === cor 
                        ? 'border-foreground scale-110 ring-2 ring-primary ring-offset-1' 
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: cor }}
                    title={cor}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: formData.cor }}
                ></div>
                <span className="text-sm text-muted-foreground">{formData.cor}</span>
              </div>
            </div>
          </div>

          {/* Categorização */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Categorização</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nicho
                </label>
                <input
                  type="text"
                  value={formData.nicho}
                  onChange={(e) => setFormData(prev => ({ ...prev, nicho: e.target.value }))}
                  className="input-primary w-full"
                  placeholder="Ex: Finanças, Tecnologia, Lifestyle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sub-nicho
                </label>
                <input
                  type="text"
                  value={formData.sub_nicho}
                  onChange={(e) => setFormData(prev => ({ ...prev, sub_nicho: e.target.value }))}
                  className="input-primary w-full"
                  placeholder="Ex: Investimentos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forequer mb-2">
                  Micro-nicho
                </label>
                <input
                  type="text"
                  value={formData.micro_nicho}
                  onChange={(e) => setFormData(prev => ({ ...prev, micro_nicho: e.target.value }))}
                  className="input-primary w-full"
                  placeholder="Ex: Ações & Fundos"
                />
              </div>
            </div>
          </div>


          {/* Dias da Semana */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dias de Postagem
            </label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map(dia => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => toggleDia(dia)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    formData.dias_postagem.includes(dia)
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>

          {/* Horários */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Horários de Postagem
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="time"
                  value={novoHorario}
                  onChange={(e) => setNovoHorario(e.target.value)}
                  className="input-primary"
                />
                <button
                  type="button"
                  onClick={addHorario}
                  className="btn-primary px-4"
                >
                  Adicionar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.horarios_postagem.map(horario => (
                  <div
                    key={horario}
                    className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm flex items-center gap-2"
                  >
                    <span>{horario}</span>
                    <button
                      type="button"
                      onClick={() => removeHorario(horario)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {canal ? 'Atualizar Canal' : 'Criar Canal'}
            </button>
            <button type="button" onClick={onCancel} className="btn-ghost flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
