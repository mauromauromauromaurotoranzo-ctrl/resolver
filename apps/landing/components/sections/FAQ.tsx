'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: '¿Cómo funciona el "desarrollo potenciado por IA"?',
    answer: 'Usamos inteligencia artificial en todas las etapas del desarrollo: desde el análisis de requisitos hasta la generación de código, testing y documentación. Sin embargo, siempre hay un developer senior humano supervisando cada paso. La IA nos da velocidad y consistencia; el humano garantiza calidad y toma decisiones técnicas estratégicas.',
  },
  {
    question: '¿El código es mío al finalizar el proyecto?',
    answer: 'Absolutamente. Todo el código fuente, documentación, assets y bases de datos son 100% tuyos. No hay licencias restrictivas ni vendor lock-in. Te entregamos acceso completo a repositorios y te transferimos todo el ownership. Podés seguir con tu propio equipo, contratar a otro proveedor, o continuar trabajando con nosotros para mantenimiento y evolutivos.',
  },
  {
    question: '¿Cuánto tiempo toma desarrollar mi proyecto?',
    answer: 'Depende del alcance y complejidad. Un MVP simple puede estar listo en 2-3 semanas, mientras que una plataforma completa puede llevar 2-3 meses. Durante la fase de discovery te damos un timeline detallado con hitos claros. Lo bueno de nuestro modelo es que somos 3x más rápidos que agencias tradicionales gracias al uso estratégico de IA.',
  },
  {
    question: '¿Qué tecnologías usan?',
    answer: 'Elegimos la stack tecnológica según las necesidades de cada proyecto. Para frontend preferimos React/Next.js o Vue/Nuxt. Para backend usamos Laravel (PHP), Node.js o Python según el caso. Para apps móviles trabajamos con React Native o Flutter. Siempre priorizamos tecnologías modernas, mantenibles y con buena comunidad.',
  },
  {
    question: '¿Cómo manejan la comunicación durante el proyecto?',
    answer: 'Tenemos un canal de Slack dedicado para comunicación diaria, hacemos standups semanales por video llamada, y usamos Notion para documentación y tracking de tareas. Vas a tener visibilidad completa del progreso en tiempo real. También organizamos demos periódicas para mostrar avances y recibir feedback.',
  },
  {
    question: '¿Qué pasa si necesito cambios después del lanzamiento?',
    answer: 'Ofrecemos un período de garantía post-lanzamiento (30-90 días según el plan) donde corregimos bugs sin costo adicional. Después de eso, podés contratar un plan de mantenimiento mensual o solicitar desarrollo de nuevas features cuando las necesites. Muchos clientes nos eligen como su equipo de producto de largo plazo.',
  },
  {
    question: '¿Trabajan con startups o solo empresas grandes?',
    answer: '¡Ambos! Tenemos paquetes adaptados a diferentes etapas. Para startups ofrecemos MVPs ágiles que permiten validar ideas rápido. Para scale-ups ayudamos a construir features que aceleran el crecimiento. Y para empresas establecidas desarrollamos soluciones de transformación digital y agentes IA internos.',
  },
  {
    question: '¿Cómo empiezo?',
    answer: 'Simple: hacé clic en el botón "Charlemos" y empezá a chatear con nuestro asistente virtual. Te va a hacer algunas preguntas sobre tu proyecto y te dará una estimación preliminar. Si hay fit, agendamos una llamada gratuita de 30 minutos para profundizar y armar una propuesta formal.',
  },
]

function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="text-lg font-semibold text-slate-900 pr-8">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-slate-600">
            Todo lo que necesitás saber antes de empezar.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-50 rounded-2xl p-6 md:p-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 mb-4">¿Tenés otras preguntas?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-resolver-600 text-white font-semibold rounded-full hover:bg-resolver-700 transition-colors"
          >
            Charlemos
          </a>
        </motion.div>
      </div>
    </section>
  )
}
