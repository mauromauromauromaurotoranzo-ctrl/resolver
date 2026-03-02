import { useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { useLeadsStore } from '@/stores/leadsStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const { stats, fetchStats, isLoading } = useLeadsStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-resolver-600" />
      </div>
    );
  }

  const statusData = Object.entries(stats.leadsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const industryData = Object.entries(stats.topIndustries).map(([industry, count]) => ({
    name: industry,
    value: count,
  }));

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      change: `+${stats.newLeadsThisWeek} esta semana`,
      icon: Users,
      trend: 'up',
      color: 'blue',
    },
    {
      title: 'Tasa de Conversión',
      value: `${stats.conversionRate}%`,
      change: '+2.5% vs mes pasado',
      icon: Target,
      trend: 'up',
      color: 'green',
    },
    {
      title: 'Valor Promedio',
      value: `$${Math.round(stats.avgProjectValue / 1000)}k`,
      change: '+12% vs mes pasado',
      icon: DollarSign,
      trend: 'up',
      color: 'purple',
    },
    {
      title: 'Nuevos Leads',
      value: stats.newLeadsThisWeek,
      change: 'Esta semana',
      icon: TrendingUp,
      trend: 'neutral',
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen de métricas y rendimiento</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : stat.trend === 'down' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                ) : null}
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads por Estado</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Industrias</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Próximamente: Timeline de actividad de leads, conversaciones recientes, 
            y notificaciones importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
