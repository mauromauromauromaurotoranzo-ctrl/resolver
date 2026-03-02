import { useEffect, useState } from 'react';
import { Plus, Save, Check, AlertCircle, Copy, RotateCcw } from 'lucide-react';
import { useConfigStore } from '@/stores/configStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const LLM_MODELS = [
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (Recomendado)' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'google/gemini-pro', label: 'Gemini Pro' },
  { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
];

const DEFAULT_SYSTEM_PROMPT = `Eres el asistente virtual de Resolver.tech, una agencia de desarrollo de software que usa inteligencia artificial para entregar proyectos más rápido, mejor y a menor costo.

Tu nombre: Resolver Assistant
Tu rol: Asistente de pre-venta y descubrimiento de requisitos
Tu misión: Ayudar a prospectos a entender si Resolver es el partner correcto para su proyecto, recolectar información clave, y guiarlos hacia el siguiente paso (diagnóstico gratuito).

Principios:
1. Transparencia sobre IA - Celebra las ventajas, enfatiza el modelo híbrido
2. Honestidad sobre capacidades - Las estimaciones son rangos preliminares
3. Enfoque en valor - Entiende primero el problema
4. Facilitar, no reemplazar - Tu trabajo es calificar y educar`;

export function BotConfig() {
  const { 
    configurations, 
    activeConfig, 
    isLoading, 
    fetchConfigurations, 
    fetchActiveConfig,
    createConfiguration,
    activateConfiguration 
  } = useConfigStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    defaultModel: 'anthropic/claude-3.5-sonnet',
  });
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    fetchConfigurations();
    fetchActiveConfig();
  }, [fetchConfigurations, fetchActiveConfig]);

  const handleCreate = async () => {
    if (!newConfig.name.trim()) return;
    
    await createConfiguration({
      name: newConfig.name,
      systemPrompt: newConfig.systemPrompt,
      isActive: false,
    });
    
    setIsCreating(false);
    setNewConfig({
      name: '',
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      defaultModel: 'anthropic/claude-3.5-sonnet',
    });
    setSavedMessage('Configuración creada exitosamente');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleActivate = async (id: string) => {
    await activateConfiguration(id);
    setSavedMessage('Configuración activada');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSavedMessage('Copiado al portapapeles');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Bot</h1>
          <p className="text-gray-500 mt-1">
            Gestiona los prompts y comportamiento de Resolver Assistant
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4" />
          Nueva configuración
        </Button>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
          <Check className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      {/* Active Configuration */}
      {activeConfig && (
        <Card className="border-resolver-200 bg-resolver-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Configuración Activa
                  <Badge variant="success">En uso</Badge>
                </CardTitle>
                <CardDescription>
                  Versión {activeConfig.version} • Creada el {new Date(activeConfig.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <p className="text-gray-900 font-medium">{activeConfig.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Prompt
              </label>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto">
                  {activeConfig.systemPrompt}
                </pre>
                <button
                  onClick={() => copyToClipboard(activeConfig.systemPrompt)}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Configuration Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Configuración</CardTitle>
            <CardDescription>
              Crea una nueva versión del comportamiento del bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nombre de la configuración"
              placeholder="Ej: Prompt v2.0 - Enfoque en enterprise"
              value={newConfig.name}
              onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
            />
            
            <Select
              label="Modelo LLM por defecto"
              options={LLM_MODELS}
              value={newConfig.defaultModel}
              onChange={(e) => setNewConfig({ ...newConfig, defaultModel: e.target.value })}
              helperText="Este modelo se usará cuando el usuario no seleccione uno específico"
            />
            
            <Textarea
              label="System Prompt"
              value={newConfig.systemPrompt}
              onChange={(e) => setNewConfig({ ...newConfig, systemPrompt: e.target.value })}
              rows={15}
              helperText="Define la personalidad, restricciones y comportamiento del asistente"
            />
          </CardContent>
          <CardFooter>
            <Button variant="secondary" onClick={() => setIsCreating(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} isLoading={isLoading}>
              <Save className="w-4 h-4" />
              Guardar configuración
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* All Configurations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Todas las configuraciones
        </h2>
        
        <div className="space-y-3">
          {configurations.map((config) => (
            <Card key={config.id} className={config.isActive ? 'border-resolver-300' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${config.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-500">
                        v{config.version} • {new Date(config.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {config.isActive ? (
                      <Badge variant="success">Activa</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivate(config.id)}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Activar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {configurations.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay configuraciones guardadas</p>
              <p className="text-sm text-gray-400 mt-1">
                Crea tu primera configuración para empezar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Consejos para mejores prompts
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Sé específico sobre el rol y personalidad del asistente</li>
            <li>Incluye ejemplos de respuestas deseadas</li>
            <li>Define claramente qué NO debe hacer el bot</li>
            <li>Mantén el prompt actualizado según aprendizajes</li>
            <li>Usa A/B testing para comparar versiones</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
