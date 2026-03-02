'use client'

import { motion } from 'framer-motion'
import { Quote, ArrowUpRight } from 'lucide-react'

const cases = [
  {
    company: 'Clínica SonrisaPerfecta',
    industry: 'HealthTech',
    problem: '40% de cancelaciones de última hora y agenda subutilizada.',
    solution: 'Agente MediBot para recordatorios inteligentes y reagendamiento automático.',
    results: [
      '60% reducción en cancelaciones',
      '25% aumento en ocupación',
      '3 semanas de desarrollo',
    ],
    testimonial: {
      text: 'El agente no solo redujo cancelaciones, sino que nuestros pacientes lo prefieren sobre llamadas telefónicas.',
      author: 'Dra. María González',
      role: 'Directora Médica',
    },
    tags: ['Agente IA', 'WhatsApp', 'Automatización'],
  },
  {
    company: 'PréstamoRápido',
    industry: 'FinTech',
    problem: 'Onboarding tardaba 45 minutos promedio, muchos abandonos.',
    solution: 'FinanceBot para pre-calificación + verificación documental con IA.',
    results: [
      'Onboarding de 45 a 8 minutos',
      '70% aprobación instantánea',
      '3x más conversiones',
    ],
    testimonial: {
      text: 'Transformamos la experiencia del cliente. Ahora compiten con los neobancos en velocidad.',
      author: 'Carlos Mendez',
      role: 'CTO',
    },
    tags: ['FinTech', 'KYC', 'Integración bancaria'],
  },
  {
    company: 'EduLearn',
    industry: 'EdTech',
    problem: 'Estudiantes necesitaban soporte 24/7, equipo humano insuficiente.',
    solution: 'Tutor virtual con RAG que responde desde la base de conocimientos.',
    results: [
      '90% preguntas resueltas automáticamente',
      'Soporte 24/7 sin costo extra',
      'Satisfacción 4.8/5',
    ],
    testimonial: {
      text: 'Nuestros estudiantes tienen un tutor personal disponible siempre. Cambió completamente el engagement.',
      author: 'Ana Lucero',
      role: 'Head of Product',
    },
    tags: ['EdTech', 'RAG', 'Tutor IA'],
  },
]

export function CaseStudies() {
  return (
    <section id="cases" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Casos de éxito
          </h2>
          <p className="text-lg text-slate-300">
            Historias reales de clientes que transformaron sus negocios con nuestras soluciones.
          </p>
        </motion.div>

        {/* Cases */}
        <div className="space-y-12">
          {cases.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Case Info */}
                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-resolver-600/20 text-resolver-400 text-sm font-medium rounded-full">
                      {caseStudy.industry}
                    </span>
                    {caseStudy.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{caseStudy.company}</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-sm font-semibold text-red-400 uppercase tracking-wide">Problema</span>
                      <p className="text-slate-300 mt-1">{caseStudy.problem}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">Solución</span>
                      <p className="text-slate-300 mt-1">{caseStudy.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">Resultados</span>
                    <ul className="mt-2 space-y-1">
                      {caseStudy.results.map((result) => (
                        <li key={result} className="flex items-center gap-2 text-slate-300">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Testimonial */}
                <div className="flex flex-col justify-center">
                  <div className="relative bg-gradient-to-br from-resolver-600/20 to-purple-600/20 rounded-xl p-6 border border-resolver-500/20">
                    <Quote className="absolute top-4 left-4 w-8 h-8 text-resolver-500/30" />
                    
                    <blockquote className="relative z-10 text-lg text-slate-200 italic mb-6 pt-4">
                      "{caseStudy.testimonial.text}"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-resolver-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {caseStudy.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{caseStudy.testimonial.author}</p>
                        <p className="text-sm text-slate-400">{caseStudy.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 text-lg font-semibold rounded-full hover:bg-slate-100 transition-colors"
          >
            Sumate a estos casos de éxito
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
