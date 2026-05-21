'use client'

import { useEffect, useReducer, useCallback, useState } from 'react'
import {
  SimulatorState,
  SimulatorAction,
  simulatorReducer,
  initialState,
  missions,
  MissionId,
  SimulatorMode,
} from '@/lib/simulator-state'
import { PaneLayout } from './PaneLayout'
import { StatusBar } from './StatusBar'
import { TabBar } from './TabBar'
import { MissionStepper } from './MissionStepper'
import { MissionSelector } from './MissionSelector'

export function ZellijSimulator() {
  const [state, dispatch] = useReducer(simulatorReducer, initialState)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check if we're in a mission step
      if (state.missionState.activeMission && state.missionState.activeMission !== 'free') {
        const mission = missions[state.missionState.activeMission]
        const currentStep = state.missionState.currentStep
        if (mission && currentStep < mission.steps.length) {
          const step = mission.steps[currentStep]
          const requiredKeys = step.keyCombo.map((k) => k.toLowerCase())

          // Check if the pressed key matches what's expected
          const pressedKey = e.key.toLowerCase()
          const ctrlPressed = e.ctrlKey

          // Handle Ctrl+key combos
          if (ctrlPressed && pressedKey === 'p' && requiredKeys.includes('ctrl') && requiredKeys.includes('p')) {
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'pane' })
            dispatch({ type: 'COMPLETE_STEP' })
            return
          }
          if (ctrlPressed && pressedKey === 't' && requiredKeys.includes('ctrl') && requiredKeys.includes('t')) {
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'tab' })
            dispatch({ type: 'COMPLETE_STEP' })
            return
          }
          if (ctrlPressed && pressedKey === 'o' && requiredKeys.includes('ctrl') && requiredKeys.includes('o')) {
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'session' })
            dispatch({ type: 'COMPLETE_STEP' })
            return
          }
          if (ctrlPressed && pressedKey === 's' && requiredKeys.includes('ctrl') && requiredKeys.includes('s')) {
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'scroll' })
            return
          }

          // Handle non-Ctrl keys
          if (!ctrlPressed && requiredKeys.includes(pressedKey)) {
            e.preventDefault()
            // Execute the action based on mode
            if (state.mode === 'pane') {
              if (pressedKey === 'd') {
                dispatch({ type: 'PANE_SPLIT_HORIZONTAL' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'r') {
                dispatch({ type: 'PANE_SPLIT_VERTICAL' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'x') {
                dispatch({ type: 'PANE_CLOSE' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'f') {
                dispatch({ type: 'PANE_TOGGLE_FULLSCREEN' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'w') {
                dispatch({ type: 'PANE_FLOAT' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'e') {
                dispatch({ type: 'PANE_EMBED' })
                dispatch({ type: 'COMPLETE_STEP' })
              }
            } else if (state.mode === 'tab') {
              if (pressedKey === 'n') {
                dispatch({ type: 'TAB_CREATE' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'x') {
                dispatch({ type: 'TAB_CLOSE' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'h') {
                dispatch({ type: 'TAB_NAVIGATE', direction: 'left' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'l') {
                dispatch({ type: 'TAB_NAVIGATE', direction: 'right' })
                dispatch({ type: 'COMPLETE_STEP' })
              }
            } else if (state.mode === 'session') {
              if (pressedKey === 'd') {
                dispatch({ type: 'SESSION_DETACH' })
                dispatch({ type: 'COMPLETE_STEP' })
              } else if (pressedKey === 'w') {
                dispatch({ type: 'COMPLETE_STEP' })
              }
            }
            return
          }
        }
      }

      // Normal shortcut handling
      const ctrlKey = e.ctrlKey
      const shiftKey = e.shiftKey
      const key = e.key

      // ESC always returns to normal mode
      if (key === 'Escape') {
        e.preventDefault()
        dispatch({ type: 'SET_MODE', mode: 'normal' })
        return
      }

      // Ctrl+key shortcuts
      if (ctrlKey) {
        switch (key.toLowerCase()) {
          case 'p':
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'pane' })
            return
          case 't':
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'tab' })
            return
          case 'o':
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'session' })
            return
          case 's':
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'scroll' })
            return
          case 'n':
            e.preventDefault()
            dispatch({ type: 'SET_MODE', mode: 'resize' })
            return
        }
        return
      }

      // Mode-specific shortcuts
      if (state.mode === 'pane') {
        switch (key.toLowerCase()) {
          case 'd':
            e.preventDefault()
            dispatch({ type: 'PANE_SPLIT_HORIZONTAL' })
            return
          case 'r':
            e.preventDefault()
            dispatch({ type: 'PANE_SPLIT_VERTICAL' })
            return
          case 'x':
            e.preventDefault()
            dispatch({ type: 'PANE_CLOSE' })
            return
          case 'f':
            e.preventDefault()
            dispatch({ type: 'PANE_TOGGLE_FULLSCREEN' })
            return
          case 'w':
            e.preventDefault()
            dispatch({ type: 'PANE_FLOAT' })
            return
          case 'e':
            e.preventDefault()
            dispatch({ type: 'PANE_EMBED' })
            return
          case 'arrowup':
            e.preventDefault()
            dispatch({ type: 'PANE_NAVIGATE', direction: 'up' })
            return
          case 'arrowdown':
            e.preventDefault()
            dispatch({ type: 'PANE_NAVIGATE', direction: 'down' })
            return
          case 'arrowleft':
            e.preventDefault()
            dispatch({ type: 'PANE_NAVIGATE', direction: 'left' })
            return
          case 'arrowright':
            e.preventDefault()
            dispatch({ type: 'PANE_NAVIGATE', direction: 'right' })
            return
        }
      } else if (state.mode === 'tab') {
        switch (key.toLowerCase()) {
          case 'n':
            e.preventDefault()
            dispatch({ type: 'TAB_CREATE' })
            return
          case 'x':
            e.preventDefault()
            dispatch({ type: 'TAB_CLOSE' })
            return
          case 'h':
            e.preventDefault()
            dispatch({ type: 'TAB_NAVIGATE', direction: 'left' })
            return
          case 'l':
            e.preventDefault()
            dispatch({ type: 'TAB_NAVIGATE', direction: 'right' })
            return
          case 'arrowleft':
            e.preventDefault()
            dispatch({ type: 'TAB_NAVIGATE', direction: 'left' })
            return
          case 'arrowright':
            e.preventDefault()
            dispatch({ type: 'TAB_NAVIGATE', direction: 'right' })
            return
        }
      }
    },
    [state.mode, state.missionState]
  )

  useEffect(() => {
    if (focused) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [focused, handleKeyDown])

  const handlePaneClick = useCallback((paneId: string) => {
    dispatch({ type: 'PANE_FOCUS', paneId })
  }, [])

  const handleTabClick = useCallback((tabId: string) => {
    dispatch({ type: 'TAB_FOCUS', tabId })
  }, [])

  const handleSelectMission = useCallback((missionId: MissionId) => {
    dispatch({ type: 'SET_MISSION', missionId })
  }, [])

  const handleCompleteStep = useCallback(() => {
    dispatch({ type: 'COMPLETE_STEP' })
  }, [])

  const handleSkipStep = useCallback(() => {
    dispatch({ type: 'SKIP_STEP' })
  }, [])

  const handleMissionComplete = useCallback(() => {
    dispatch({ type: 'SET_MISSION', missionId: null })
  }, [])

  const activeTab = state.tabs.find((t) => t.id === state.focusedTabId)
  const activeMission = state.missionState.activeMission
    ? missions[state.missionState.activeMission]
    : null

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Simulator area */}
      <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-[500px]">
        {/* Terminal chrome */}
        <div
          className={`flex-1 flex flex-col rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl transition-all
            ${focused ? 'ring-2 ring-[var(--accent)]' : ''}
          `}
          onClick={() => setFocused(true)}
          tabIndex={0}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 text-center text-xs font-mono text-[var(--text-secondary)]">
              zellij — {state.sessionName || 'session'} — 120×40
            </div>
            {!focused && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFocused(true)
                }}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Click to focus
              </button>
            )}
          </div>

          {/* Tab bar */}
          <TabBar
            tabs={state.tabs}
            focusedTabId={state.focusedTabId}
            onTabClick={handleTabClick}
            onTabClose={() => dispatch({ type: 'TAB_CLOSE' })}
          />

          {/* Main content area */}
          <div className="flex-1 relative">
            <PaneLayout
              panes={state.panes}
              focusedPaneId={state.focusedPaneId}
              onPaneClick={handlePaneClick}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Status bar */}
          <StatusBar
            mode={state.mode}
            tabs={state.tabs}
            focusedTabId={state.focusedTabId}
            sessionName={state.sessionName}
            onTabClick={handleTabClick}
          />
        </div>
      </div>

      {/* Mission panel */}
      <div className="w-full lg:w-80 flex flex-col">
        <MissionSelector
          activeMission={state.missionState.activeMission}
          onSelectMission={handleSelectMission}
          completedMissions={state.missionState.completedMissions}
        />

        {activeMission && (
          <div className="flex-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
            <MissionStepper
              mission={activeMission}
              currentStep={state.missionState.currentStep}
              onCompleteStep={handleCompleteStep}
              onSkipStep={handleSkipStep}
              onMissionComplete={handleMissionComplete}
            />
          </div>
        )}

        {!activeMission && (
          <div className="flex-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Select a mission above to get started, or try Free mode to explore.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}