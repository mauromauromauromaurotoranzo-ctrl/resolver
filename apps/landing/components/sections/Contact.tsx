'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Clock, MessageCircle } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-resolver-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              ¿Listo para transformar tu idea en realidad?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Empezá a chatear con nuestro asistente virtual ahora mismo. 
              En minutos vas a tener una estimación preliminar y podés agendar 
              una llamada gratuita con nuestro equipo.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-white/70">hola@resolver.tech</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Teléfono</h3>
                  <p className="text-white/70">+54 11 1234-5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Horario de atención</h3>
                  <p className="text-white/70">Lun - Vie: 9:00 - 18:00 (GMT-3)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ubicación</h3>
                  <p className="text-white/70">Buenos Aires, Argentina</p>
                  <p className="text-sm text-white/50">Trabajamos remotamente con clientes de todo el mundo</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Chat CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 text-slate-900"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-resolver-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                Habla con Resolver Assistant
              </h3>
              
              <p className="text-slate-600 mb-8">
                Nuestro asistente virtual está disponible 24/7 para:
              </p>

              <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
                {[
                  'Entender tu proyecto y necesidades',
                  'Darte una estimación de inversión',
                  'Explicarte nuestro proceso de trabajo',
                  'Agendarte una llamada con el equipo',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  // Dispatch custom event to open chat widget
                  window.dispatchEvent(new CustomEvent('openResolverChat'))
                }}
                className="w-full py-4 bg-resolver-600 text-white text-lg font-semibold rounded-xl hover:bg-resolver-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Iniciar conversación
              </button>

              <p className="text-sm text-slate-400 mt-4">
                Respuesta típica en menos de 1 minuto
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
