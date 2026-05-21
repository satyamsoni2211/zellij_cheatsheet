import { Navbar } from '@/components/nav/Navbar'
import { HeroSection } from '@/components/hero/HeroSection'
import { TmuxComparisonStrip } from '@/components/hero/TmuxComparisonStrip'
import { EssentialsSection } from '@/components/cheatsheet/EssentialsSection'
import { SimulatorSection } from '@/components/simulator/SimulatorSection'
import { LayoutsSection } from '@/components/layouts/LayoutsSection'
import { PluginsSection } from '@/components/plugins/PluginsSection'
import { WorkflowsSection } from '@/components/workflows/WorkflowsSection'
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
        <EssentialsSection />
      </div>
      <div id="simulator" className="scroll-mt-20">
        <SimulatorSection />
      </div>
      <div id="layouts" className="scroll-mt-20">
        <LayoutsSection />
      </div>
      <div id="plugins" className="scroll-mt-20">
        <PluginsSection />
      </div>
      <div id="workflows" className="scroll-mt-20">
        <WorkflowsSection />
      </div>
      <QuickRefDrawer />
      <Footer />
    </main>
  )
}