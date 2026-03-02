import { useEffect, useState } from 'react';
import { useLeadsStore } from '@/stores/leadsStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  DollarSign,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import type { Lead, LeadStatus } from '@/types';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/types';

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  ...Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

const industryOptions = [
  { value: '', label: 'Todas las industrias' },
  { value: 'healthcare', label: 'Salud' },
  { value: 'fintech', label: 'Finanzas' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Educación' },
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'other', label: 'Otra' },
];

export function Leads() {
  const { leads, isLoading, fetchLeads, selectLead, filters, setFilters } = useLeadsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.email?.toLowerCase().includes(query) ||
      lead.companyName?.toLowerCase().includes(query) ||
      lead.industry?.toLowerCase().includes(query)
    );
  });

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 mt-1">
          Gestiona los prospectos generados por el chatbot
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por email, empresa o industria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select
                options={statusOptions}
                value={filters.status || ''}
                onChange={(e) => setFilters({ status: e.target.value || undefined })}
                className="w-48"
              />
              <Select
                options={industryOptions}
                value={filters.industry || ''}
                onChange={(e) => setFilters({ industry: e.target.value || undefined })}
                className="w-48"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-resolver-600" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No se encontraron leads</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isSelected={lead.id === selectedLeadId}
                onClick={() => setSelectedLeadId(lead.id)}
              />
            ))
          )}
        </div>

        {/* Lead Detail */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <LeadDetail lead={selectedLead} onClose={() => setSelectedLeadId(null)} />
          ) : (
            <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500">Selecciona un lead para ver detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadCard({ 
  lead, 
  isSelected, 
  onClick 
}: { 
  lead: Lead; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const statusColor = LEAD_STATUS_COLORS[lead.status];
  const statusLabel = LEAD_STATUS_LABELS[lead.status];

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-resolver-500 border-resolver-500' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {lead.companyName || 'Sin empresa'}
              </h3>
              <Badge className={statusColor}>{statusLabel}</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {lead.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {lead.email}
                </span>
              )}
              {lead.industry && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {lead.industry}
                </span>
              )}
            </div>

            {(lead.estimatedCostMin || lead.estimatedCostMax) && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-900">
                  ${lead.estimatedCostMin?.toLocaleString()} - ${lead.estimatedCostMax?.toLocaleString()}
                </span>
                <span className="text-gray-400">•</span>
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">
                  {lead.estimatedWeeksMin}-{lead.estimatedWeeksMax} semanas
                </span>
              </div>
            )}
          </div>

          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
            isSelected ? 'rotate-90' : ''
          }`} />
        </div>
      </CardContent>
    </Card>
  );
}

function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { updateLead } = useLeadsStore();
  const [notes, setNotes] = useState(lead.internalNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await updateLead(lead.id, { internalNotes: notes });
    setIsSaving(false);
  };

  const handleStatusChange = async (status: LeadStatus) => {
    await updateLead(lead.id, { status });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Detalle del Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <Select
            options={Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Información de contacto</h4>
          {lead.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${lead.email}`} className="text-resolver-600 hover:underline">
                {lead.email}
              </a>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Información del proyecto</h4>
          {lead.problemDescription && (
            <p className="text-sm text-gray-600">{lead.problemDescription}</p>
          )}
          {lead.timeline && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Timeline: {lead.timeline}</span>
            </div>
          )}
        </div>

        {/* Estimation */}
        {(lead.estimatedCostMin || lead.estimatedCostMax) && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Estimación</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">Inversión</span>
                <p className="font-medium text-gray-900">
                  ${lead.estimatedCostMin?.toLocaleString()} - ${lead.estimatedCostMax?.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Tiempo</span>
                <p className="font-medium text-gray-900">
                  {lead.estimatedWeeksMin}-{lead.estimatedWeeksMax} semanas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas internas
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-resolver-500/20 focus:border-resolver-500 outline-none resize-none"
            placeholder="Agrega notas sobre este lead..."
          />
          <Button
            size="sm"
            onClick={handleSaveNotes}
            isLoading={isSaving}
            className="mt-2"
          >
            Guardar notas
          </Button>
        </div>
      </div>
    </div>
  );
}
