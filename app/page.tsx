import { Navbar } from '@/components/nav/Navbar'
import { HeroSection } from '@/components/hero/HeroSection'
import { TmuxComparisonStrip } from '@/components/hero/TmuxComparisonStrip'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TmuxComparisonStrip />
      <div id="essentials" className="scroll-mt-20">
        <p className="text-center text-[var(--text-secondary)] py-20">Shortcut cheatsheet coming soon...</p>
      </div>
      <div id="simulator" className="scroll-mt-20">
        <p className="text-center text-[var(--text-secondary)] py-20">Simulator coming soon...</p>
      </div>
    </main>
  )
}