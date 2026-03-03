'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Clock, DollarSign } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-resolver-50 via-white to-resolver-100" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-resolver-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-resolver-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-resolver-100 mb-8"
          >
            <Sparkles className="w-4 h-4 text-resolver-600" />
            <span className="text-sm font-medium text-slate-700">
              Desarrollo potenciado por IA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6"
          >
            Tu proyecto de software,{' '}
            <span className="gradient-text">3x más rápido</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
          >
            Usamos inteligencia artificial para desarrollar software y agentes IA 
            de alta calidad. Más velocidad, menor costo, sin sacrificar excelencia.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-resolver-600 text-white text-lg font-semibold rounded-full hover:bg-resolver-700 transition-all hover:shadow-lg hover:shadow-resolver-600/25"
            >
              Charlemos de tu proyecto
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 text-lg font-semibold rounded-full border border-slate-200 hover:border-resolver-300 hover:bg-resolver-50 transition-all"
            >
              Cómo trabajamos
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-bold text-slate-900">
                <Clock className="w-6 h-6 text-resolver-600" />
                3x
              </div>
              <p className="text-sm text-slate-500 mt-1">Más rápido</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-bold text-slate-900">
                <DollarSign className="w-6 h-6 text-green-600" />
                40%
              </div>
              <p className="text-sm text-slate-500 mt-1">Menor costo</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900">
                50+
              </div>
              <p className="text-sm text-slate-500 mt-1">Proyectos entregados</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
