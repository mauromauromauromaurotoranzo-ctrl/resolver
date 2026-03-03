'use client'

import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Process } from '@/components/sections/Process'
import { Models } from '@/components/sections/Models'
// import { CaseStudies } from '@/components/sections/CaseStudies'
// import { Pricing } from '@/components/sections/Pricing'
import { FAQ } from '@/components/sections/FAQ'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Models />
      {/* <CaseStudies /> */}
      {/* <Pricing /> */}
      <FAQ />
      <Contact />
      <Footer />
      
      {/* Chat Widget Container - Will be injected by the widget script */}
      <div id="resolver-chat-container" />
    </main>
  )
}
