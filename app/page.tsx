import { Navbar } from '@/components/nav/Navbar'
import { HeroSection } from '@/components/hero/HeroSection'
import { TmuxComparisonStrip } from '@/components/hero/TmuxComparisonStrip'
import { SimulatorSection } from '@/components/simulator/SimulatorSection'
import { QuickRefDrawer } from '@/components/ui/QuickRefDrawer'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Footer } from '@/components/footer/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CommandPalette />
      <HeroSection />
      <TmuxComparisonStrip />
      <div id="essentials" className="scroll-mt-20">
        <p className="text-center text-[var(--text-secondary)] py-20">Shortcut cheatsheet coming soon...</p>
      </div>
      <div id="simulator" className="scroll-mt-20">
        <SimulatorSection />
      </div>
      <div id="layouts" className="scroll-mt-20">
        <p className="text-center text-[var(--text-secondary)] py-20">Layouts coming soon...</p>
      </div>
      <div id="plugins" className="scroll-mt-20">
        <p className="text-center text-[var(--text-secondary)] py-20">Plugins coming soon...</p>
      </div>
      <div id="workflows" className="scroll-mt-20">
        <p className="text-center text-[var(--text-secondary)] py-20">Workflows coming soon...</p>
      </div>
      <QuickRefDrawer />
      <Footer />
    </main>
  )
}