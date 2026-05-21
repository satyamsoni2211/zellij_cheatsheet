'use client'

import { MissionId, missions } from '@/lib/simulator-state'

interface MissionSelectorProps {
  activeMission: MissionId | null
  onSelectMission: (missionId: MissionId) => void
  completedMissions: MissionId[]
}

const missionColors: Record<MissionId, string> = {
  basics: 'border-[var(--mode-normal)]',
  tabs: 'border-[var(--mode-tab)]',
  sessions: 'border-[var(--mode-session)]',
  floating: 'border-[var(--mode-pane)]',
  free: 'border-[var(--border)]',
}

export function MissionSelector({ activeMission, onSelectMission, completedMissions }: MissionSelectorProps) {
  const missionList: MissionId[] = ['basics', 'tabs', 'sessions', 'floating', 'free']

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {missionList.map((id) => {
        const mission = missions[id]
        const isActive = activeMission === id
        const isCompleted = completedMissions.includes(id)

        return (
          <button
            key={id}
            onClick={() => onSelectMission(id)}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
              ${isActive
                ? `${missionColors[id]} bg-[var(--bg-secondary)] text-[var(--text-primary)]`
                : 'border-[var(--border)] bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {mission.name}
              {id !== 'free' && (
                <span className={`text-xs ${isCompleted ? 'text-green-500' : 'text-[var(--text-secondary)]'}`}>
                  {isCompleted ? '✓' : `${mission.steps.length} steps`}
                </span>
              )}
              {id === 'free' && (
                <span className="text-xs text-[var(--text-secondary)]">∞</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}