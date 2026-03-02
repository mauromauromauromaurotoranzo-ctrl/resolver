'use client'

import { motion } from 'framer-motion'
import { Check, Clock, Users, Zap } from 'lucide-react'

const models = [
  {
    icon: Clock,
    title: 'Project Based',
    subtitle: 'Para proyectos definidos',
    description: 'Ideal cuando tenés un alcance claro y querés saber exactamente cuánto vas a invertir.',
    features: [
      'Presupuesto cerrado',
      'Alcance definido',
      'Entregables claros',
      'Garantía post-lanzamiento',
    ],
    bestFor: 'MVPs, landing pages, features específicas',
    cta: 'Solicitar presupuesto',
    popular: false,
  },
  {
    icon: Users,
    title: 'Dedicated Team',
    subtitle: 'Para relaciones largo plazo',
    description: 'Un equipo dedicado que trabaja exclusivamente en tu producto, como si fueran parte de tu empresa.',
    features: [
      'Equipo asignado 100%',
      'Horas mensuales incluidas',
      'Priorización flexible',
      'Daily/weekly standups',
    ],
    bestFor: 'Startups en crecimiento, productos evolutivos',
    cta: 'Conocer más',
    popular: true,
  },
  {
    icon: Zap,
    title: 'AI Agent Subscription',
    subtitle: 'Agentes IA listos para usar',
    description: 'Desarrollamos un agente IA personalizado para tu negocio y lo mantenemos por una suscripción mensual.',
    features: [
      'Agente entrenado custom',
      'Integración con tus sistemas',
      'Monitoreo 24/7',
      'Mejoras continuas',
    ],
    bestFor: 'Automatización de soporte, ventas, operaciones',
    cta: 'Ver ejemplos',
    popular: false,
  },
]

export function Models() {
  return (
    <section id="models" className="py-24 bg-white">
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
            Modelos de trabajo
          </h2>
          <p className="text-lg text-slate-600">
            Elegí el modelo que mejor se adapte a tus necesidades y etapa de negocio.
          </p>
        </motion.div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {models.map((model, index) => {
            const Icon = model.icon
            
            return (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  model.popular
                    ? 'bg-gradient-to-br from-resolver-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-slate-50 border border-slate-200 hover:border-resolver-300 transition-colors'
                }`}
              >
                {/* Popular Badge */}
                {model.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">
                      Más popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  model.popular ? 'bg-white/20' : 'bg-white shadow-sm'
                }`}>
                  <Icon className={`w-7 h-7 ${model.popular ? 'text-white' : 'text-resolver-600'}`} />
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-1 ${model.popular ? 'text-white' : 'text-slate-900'}`}>
                  {model.title}
                </h3>
                <p className={`text-sm mb-4 ${model.popular ? 'text-white/80' : 'text-slate-500'}`}>
                  {model.subtitle}
                </p>
                <p className={`mb-6 ${model.popular ? 'text-white/90' : 'text-slate-600'}`}>
                  {model.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        model.popular ? 'text-white' : 'text-green-500'
                      }`} />
                      <span className={model.popular ? 'text-white/90' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Best For */}
                <div className={`mb-6 p-3 rounded-lg ${
                  model.popular ? 'bg-white/10' : 'bg-white'
                }`}>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    model.popular ? 'text-white/60' : 'text-slate-400'
                  }`}>
                    Ideal para:
                  </span>
                  <p className={`text-sm mt-1 ${model.popular ? 'text-white' : 'text-slate-700'}`}>
                    {model.bestFor}
                  </p>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                    model.popular
                      ? 'bg-white text-resolver-600 hover:bg-white/90'
                      : 'bg-resolver-600 text-white hover:bg-resolver-700'
                  }`}
                >
                  {model.cta}
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
