'use client'

import { motion } from 'framer-motion'
import { 
  Code2, 
  Bot, 
  Smartphone, 
  Globe, 
  Database, 
  Cloud,
  ArrowRight
} from 'lucide-react'

const services = [
  {
    icon: Code2,
    title: 'Software a Medida',
    description: 'Aplicaciones web y sistemas empresariales desarrollados con las últimas tecnologías. Desde MVPs hasta plataformas enterprise.',
    features: ['Web Apps', 'Sistemas ERP/CRM', 'APIs REST', 'Microservicios'],
    color: 'blue',
  },
  {
    icon: Bot,
    title: 'Agentes IA',
    description: 'Asistentes inteligentes personalizados que automatizan procesos, atienden clientes y potencian tu equipo.',
    features: ['Chatbots avanzados', 'Automatización', 'Integración LLMs', 'Procesamiento NLP'],
    color: 'purple',
  },
  {
    icon: Smartphone,
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas y multiplataforma para iOS y Android que tus usuarios van a amar usar.',
    features: ['React Native', 'Flutter', 'iOS Nativo', 'Android Nativo'],
    color: 'green',
  },
  {
    icon: Globe,
    title: 'Landing Pages',
    description: 'Sitios de alta conversión diseñados para captar leads y vender tus productos o servicios.',
    features: ['Diseño UX/UI', 'Optimización SEO', 'A/B Testing', 'Analytics'],
    color: 'orange',
  },
  {
    icon: Database,
    title: 'Data & Analytics',
    description: 'Soluciones de datos que transforman información en insights accionables para tu negocio.',
    features: ['Data Warehousing', 'Dashboards', 'ETL Pipelines', 'Machine Learning'],
    color: 'red',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'Infraestructura escalable y pipelines de CI/CD que permiten deployar sin fricciones.',
    features: ['AWS/Azure/GCP', 'Docker/K8s', 'CI/CD', 'Monitoreo'],
    color: 'cyan',
  },
]

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-resolver-50', text: 'text-resolver-600', border: 'border-resolver-200' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
}

export function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Servicios que impulsan tu negocio
          </h2>
          <p className="text-lg text-slate-600">
            Desde una simple landing page hasta una plataforma completa con IA. 
            Tenemos la expertise para llevar tu idea a producción.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = colorClasses[service.color]
            const Icon = service.icon
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-resolver-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('50', '400')}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-1 text-sm font-medium ${colors.text} hover:gap-2 transition-all`}
                >
                  Consultar
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
