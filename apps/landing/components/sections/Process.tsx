'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Lightbulb, Code2, Rocket, HeadphonesIcon } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Discovery',
    description: 'Nos sentamos a entender tu problema, tus usuarios y tus objetivos. Sin templates, cada proyecto es único.',
    duration: '1-2 días',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Diseño & Arquitectura',
    description: 'Creamos wireframes, definimos la arquitectura técnica y planificamos el desarrollo en sprints.',
    duration: '3-5 días',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Desarrollo Potenciado',
    description: 'Nuestros developers senior trabajan junto con IA para escribir código de calidad en tiempo récord.',
    duration: '2-8 semanas',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deploy & Lanzamiento',
    description: 'CI/CD automatizado, monitoreo en tiempo real y un período de garantía post-lanzamiento.',
    duration: '1-2 días',
  },
  {
    number: '05',
    icon: HeadphonesIcon,
    title: 'Soporte Continuo',
    description: 'No te dejamos solo. Ofrecemos mantenimiento, mejoras y evolutivos según necesites.',
    duration: 'Continuo',
  },
]

export function Process() {
  return (
    <section id="process" className="py-24 bg-slate-50">
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
            Cómo trabajamos
          </h2>
          <p className="text-lg text-slate-600">
            Un proceso transparente y ágil, potenciado por IA pero siempre 
            con supervisión humana experta.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-resolver-500 to-resolver-400 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col md:flex-row items-start gap-6 md:gap-12"
                >
                  {/* Number & Icon (Desktop) */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center z-10">
                      <Icon className="w-7 h-7 text-resolver-600" />
                    </div>
                    <span className="mt-2 text-sm font-bold text-resolver-600">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 ${isEven ? 'md:mr-12' : 'md:ml-12'}`}>
                    {/* Mobile: Number & Icon */}
                    <div className="flex md:hidden items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-resolver-50 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-resolver-600" />
                      </div>
                      <span className="text-sm font-bold text-resolver-600">
                        Paso {step.number}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center px-3 py-1 bg-resolver-50 text-resolver-700 text-xs font-medium rounded-full whitespace-nowrap">
                        {step.duration}
                      </span>
                    </div>
                    
                    {/* Mobile duration */}
                    <span className="inline-flex sm:hidden items-center px-3 py-1 mt-4 bg-resolver-50 text-resolver-700 text-xs font-medium rounded-full">
                      {step.duration}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
