'use client'

import { useState } from 'react'
import { Mission, MissionStep, MissionId, missions } from '@/lib/simulator-state'

interface MissionStepperProps {
  mission: Mission
  currentStep: number
  onCompleteStep: () => void
  onSkipStep: () => void
  onMissionComplete: () => void
}

export function MissionStepper({
  mission,
  currentStep,
  onCompleteStep,
  onSkipStep,
  onMissionComplete,
}: MissionStepperProps) {
  const [showHint, setShowHint] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)

  if (mission.id === 'free') {
    return (
      <div className="p-6 text-center">
        <div className="text-[var(--text-secondary)]">
          <p className="text-lg mb-2">Free Mode</p>
          <p className="text-sm">Explore the simulator freely. Press shortcuts and see what happens!</p>
        </div>
      </div>
    )
  }

  if (currentStep >= mission.steps.length && !completed) {
    setCompleted(true)
  }

  if (completed || currentStep >= mission.steps.length) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <div className="text-lg font-medium text-[var(--accent)] mb-2">Mission Complete!</div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Great job! You&apos;ve completed the {mission.name} mission.
        </p>
        <button
          onClick={onMissionComplete}
          className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-text)] rounded font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Try Another Mission
        </button>
      </div>
    )
  }

  const step = mission.steps[currentStep]

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">{mission.name}</h3>
        <p className="text-xs text-[var(--text-secondary)]">{mission.description}</p>
      </div>

      <div className="mb-4 text-xs text-[var(--text-secondary)]">
        Step {currentStep + 1} of {mission.steps.length}
      </div>

      <div className="space-y-3">
        {mission.steps.map((s, i) => {
          const isCompleted = i < currentStep
          const isCurrent = i === currentStep
          const isFuture = i > currentStep

          return (
            <div
              key={s.id}
              className={`p-3 rounded border transition-all ${
                isCompleted
                  ? 'border-green-500/30 bg-green-500/10'
                  : isCurrent
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                  : 'border-[var(--border)] bg-[var(--bg-secondary)]/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <span className="text-green-500 text-sm">✓</span>
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] inline-block" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-[var(--border)] inline-block" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${isFuture ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                    {s.instruction}
                  </p>
                  {isCurrent && (
                    <div className="mt-2 flex items-center gap-2">
                      {s.keyCombo.map((key, ki) => (
                        <kbd
                          key={ki}
                          className="px-2 py-1 rounded bg-[var(--kbd-bg)] border border-[var(--kbd-border)] text-[var(--kbd-text)] text-xs font-mono shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                  {isCurrent && s.hint && (
                    <button
                      onClick={() => setShowHint(showHint === currentStep ? null : currentStep)}
                      className="mt-2 text-xs text-[var(--accent)] hover:underline"
                    >
                      {showHint === currentStep ? 'Hide hint' : 'Show hint'}
                    </button>
                  )}
                  {isCurrent && showHint === currentStep && s.hint && (
                    <p className="mt-2 text-xs text-[var(--text-secondary)] p-2 bg-[var(--bg-terminal)] rounded">
                      💡 {s.hint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onSkipStep}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline"
        >
          Skip step
        </button>
      </div>
    </div>
  )
}