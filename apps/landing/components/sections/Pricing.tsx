'use client'

import { motion } from 'framer-motion'
import { Check, HelpCircle } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Para proyectos pequeños y MVPs',
    price: 'Desde $3,000',
    features: [
      'Hasta 3 semanas de desarrollo',
      '1 developer senior',
      'Diseño UI básico',
      'Deploy incluido',
      '30 días de soporte',
    ],
    notIncluded: [
      'Agentes IA avanzados',
      'Integraciones complejas',
      'Soporte prioritario',
    ],
    cta: 'Consultar disponibilidad',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Para startups y empresas en crecimiento',
    price: 'Desde $10,000',
    features: [
      'Hasta 8 semanas de desarrollo',
      'Equipo de 2 developers',
      'Diseño UX/UI completo',
      'Testing automatizado',
      '90 días de soporte',
      '1 agente IA incluido',
    ],
    notIncluded: [
      'Soporte 24/7',
    ],
    cta: 'Empezar proyecto',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Para soluciones complejas y a gran escala',
    price: 'Desde $25,000',
    features: [
      'Timeline custom',
      'Equipo dedicado',
      'Arquitectura enterprise',
      'DevOps & CI/CD',
      '12 meses de soporte',
      'Múltiples agentes IA',
      'SLA garantizado',
    ],
    notIncluded: [],
    cta: 'Agendar llamada',
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
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
            Inversión transparente
          </h2>
          <p className="text-lg text-slate-600">
            Sin sorpresas ni costos ocultos. Cada plan incluye todo lo necesario 
            para llevar tu proyecto a producción.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-white shadow-xl border-2 border-resolver-500 scale-105 z-10'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 bg-resolver-600 text-white text-sm font-semibold rounded-full">
                    Recomendado
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <div className="text-3xl font-bold text-slate-900">{plan.price}</div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 opacity-50">
                    <HelpCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-sm line-through">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-resolver-600 text-white hover:bg-resolver-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          Todos los precios son estimativos. El presupuesto final depende del alcance específico del proyecto.{' '}
          <a href="#contact" className="text-resolver-600 hover:underline">
            Solicitá una cotización personalizada
          </a>.
        </motion.p>
      </div>
    </section>
  )
}
