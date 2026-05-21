'use client'

import { useState } from 'react'
import { WorkflowStep as WorkflowStepType } from '@/data/workflows'
import { Kbd } from '@/components/ui/Kbd'

interface WorkflowStepperProps {
  steps: WorkflowStepType[]
  onComplete?: () => void
}

export function WorkflowStepper({ steps, onComplete }: WorkflowStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(currentStep)
    setCompletedSteps(newCompleted)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete?.()
    }
  }

  const handleStepClick = (index: number) => {
    // Allow clicking on completed steps or the current step
    if (completedSteps.has(index) || index === currentStep) {
      setCurrentStep(index)
    }
  }

  const allCompleted = completedSteps.size === steps.length

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span className="font-mono">
          {completedSteps.size}/{steps.length}
        </span>
        <div className="flex-1 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
            style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isCurrent = index === currentStep
          const isAccessible = isCompleted || index === currentStep

          return (
            <div
              key={index}
              onClick={() => handleStepClick(index)}
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${isAccessible ? 'hover:bg-[var(--bg-secondary)]' : 'opacity-50 cursor-default'}
                ${isCurrent && !isCompleted ? 'border-l-4 border-l-[var(--accent)] border-[var(--border)] bg-[var(--bg-secondary)]' : ''}
                ${isCompleted ? 'border-[var(--border)] bg-[var(--bg-primary)]' : ''}
              `}
            >
              {/* Step number and status */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-sm font-mono font-bold
                    ${isCompleted ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'bg-[var(--bg-terminal)] text-[var(--text-secondary)]'}
                    ${isCurrent && !isCompleted ? 'ring-2 ring-[var(--accent)]' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-sm text-[var(--text-secondary)] font-medium">
                  {isCurrent && !isCompleted ? 'Current step' : isCompleted ? 'Completed' : 'Locked'}
                </span>
              </div>

              {/* Instruction */}
              <p className="text-[var(--text-primary)] font-medium mb-2">
                {step.instruction}
              </p>

              {/* Command */}
              {step.command && (
                <div className="mb-2">
                  <Kbd keys={step.command.split(' ')} className="bg-[var(--bg-terminal)]" />
                </div>
              )}

              {/* Explanation */}
              {step.explanation && (
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  {step.explanation}
                </p>
              )}

              {/* Tip */}
              {step.tip && (
                <div className="flex items-start gap-2 mt-3 p-2 bg-[var(--accent)]/10 rounded border border-[var(--accent)]/20">
                  <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-[var(--accent)]">{step.tip}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Action button */}
      {!allCompleted && (
        <button
          onClick={handleStepComplete}
          className="w-full py-3 px-4 bg-[var(--accent)] text-[var(--accent-text)] font-mono font-bold rounded-lg
            hover:bg-[var(--accent-muted)] transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
        >
          {currentStep === steps.length - 1 ? 'Complete Workflow' : 'Next Step'}
        </button>
      )}

      {/* Completion celebration */}
      {allCompleted && (
        <div className="p-4 bg-[var(--accent)]/20 rounded-lg border border-[var(--accent)] text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-[var(--accent)] font-mono font-bold">Workflow Complete!</p>
        </div>
      )}
    </div>
  )
}