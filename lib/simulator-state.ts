'use client'

import { ShortcutMode } from '@/data/shortcuts'

export type SimulatorMode = ShortcutMode | 'pane' | 'tab' | 'scroll' | 'session' | 'resize' | 'search' | 'locked' | 'normal'

export interface Pane {
  id: string
  x: number
  y: number
  w: number
  h: number
  command: string
  focused: boolean
  floating: boolean
  zIndex: number
}

export interface Tab {
  id: string
  name: string
  panes: Pane[]
  active: boolean
}

export interface MissionStep {
  id: string
  instruction: string
  keyCombo: string[]
  hint?: string
  completed: boolean
}

export interface Mission {
  id: string
  name: string
  description: string
  steps: MissionStep[]
}

export type MissionId = 'basics' | 'tabs' | 'sessions' | 'floating' | 'free'

export interface MissionState {
  activeMission: MissionId | null
  currentStep: number
  completedMissions: MissionId[]
}

export interface SimulatorState {
  mode: SimulatorMode
  panes: Pane[]
  tabs: Tab[]
  sessionName: string
  missionState: MissionState
  focusedPaneId: string | null
  focusedTabId: string | null
}

export type SimulatorAction =
  | { type: 'SET_MODE'; mode: SimulatorMode }
  | { type: 'PANE_SPLIT_HORIZONTAL' }
  | { type: 'PANE_SPLIT_VERTICAL' }
  | { type: 'PANE_CLOSE' }
  | { type: 'PANE_TOGGLE_FULLSCREEN' }
  | { type: 'PANE_FLOAT' }
  | { type: 'PANE_EMBED' }
  | { type: 'PANE_FOCUS'; paneId: string }
  | { type: 'PANE_NAVIGATE'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'TAB_CREATE' }
  | { type: 'TAB_CLOSE' }
  | { type: 'TAB_FOCUS'; tabId: string }
  | { type: 'TAB_NAVIGATE'; direction: 'left' | 'right' }
  | { type: 'TAB_RENAME'; tabId: string; name: string }
  | { type: 'TAB_MOVE'; direction: 'left' | 'right' }
  | { type: 'SESSION_DETACH' }
  | { type: 'SESSION_RENAME'; name: string }
  | { type: 'RESET_SIMULATOR' }
  | { type: 'SET_MISSION'; missionId: MissionId | null }
  | { type: 'COMPLETE_STEP' }
  | { type: 'SKIP_STEP' }
  | { type: 'NEXT_STEP' }

// Mission definitions
export const missions: Record<MissionId, Mission> = {
  basics: {
    id: 'basics',
    name: 'Basics',
    description: 'Learn pane splitting, navigation, and closing',
    steps: [
      { id: 'b1', instruction: 'Press Ctrl+p to enter Pane mode', keyCombo: ['Ctrl', 'p'], hint: 'Pane mode lets you split, close, and resize panes', completed: false },
      { id: 'b2', instruction: 'Press d to split the pane horizontally', keyCombo: ['d'], hint: 'This creates a new pane below the focused pane', completed: false },
      { id: 'b3', instruction: 'Press r to split the pane vertically', keyCombo: ['r'], hint: 'This creates a new pane to the right', completed: false },
      { id: 'b4', instruction: 'Press x to close a pane', keyCombo: ['x'], hint: 'Close the pane you no longer need', completed: false },
    ],
  },
  tabs: {
    id: 'tabs',
    name: 'Tabs',
    description: 'Create, rename, navigate, and close tabs',
    steps: [
      { id: 't1', instruction: 'Press Ctrl+t to enter Tab mode', keyCombo: ['Ctrl', 't'], hint: 'Tab mode lets you manage your tabs', completed: false },
      { id: 't2', instruction: 'Press n to create a new tab', keyCombo: ['n'], hint: 'A new tab appears in the tab bar', completed: false },
      { id: 't3', instruction: 'Press h to navigate to the left tab', keyCombo: ['h'], hint: 'You can also use arrow keys', completed: false },
      { id: 't4', instruction: 'Press l to navigate to the right tab', keyCombo: ['l'], hint: 'Or use the right arrow key', completed: false },
      { id: 't5', instruction: 'Press x to close a tab', keyCombo: ['x'], hint: 'Close the current tab', completed: false },
    ],
  },
  sessions: {
    id: 'sessions',
    name: 'Sessions',
    description: 'Detach, list, and reattach sessions',
    steps: [
      { id: 's1', instruction: 'Press Ctrl+o to enter Session mode', keyCombo: ['Ctrl', 'o'], hint: 'Session mode manages your Zellij sessions', completed: false },
      { id: 's2', instruction: 'Press d to detach from the session', keyCombo: ['d'], hint: 'This detaches from the current session', completed: false },
      { id: 's3', instruction: 'Press w to open the session manager', keyCombo: ['w'], hint: 'View and manage all active sessions', completed: false },
    ],
  },
  floating: {
    id: 'floating',
    name: 'Floating Panes',
    description: 'Open, move, and embed floating panes',
    steps: [
      { id: 'f1', instruction: 'Press Ctrl+p to enter Pane mode', keyCombo: ['Ctrl', 'p'], hint: 'Floating panes are managed in pane mode', completed: false },
      { id: 'f2', instruction: 'Press d to split and create a pane', keyCombo: ['d'], hint: 'First create a pane to float', completed: false },
      { id: 'f3', instruction: 'Press w to make the pane floating', keyCombo: ['w'], hint: 'The pane becomes a floating overlay', completed: false },
      { id: 'f4', instruction: 'Press e to embed the floating pane', keyCombo: ['e'], hint: 'Embed it back into the tiled layout', completed: false },
    ],
  },
  free: {
    id: 'free',
    name: 'Free Mode',
    description: 'Explore freely with no guidance',
    steps: [],
  },
}

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Initial pane
const initialPane: Pane = {
  id: 'pane-1',
  x: 0,
  y: 0,
  w: 100,
  h: 100,
  command: 'user@host:~$',
  focused: true,
  floating: false,
  zIndex: 1,
}

// Initial state
export const initialState: SimulatorState = {
  mode: 'normal',
  panes: [initialPane],
  tabs: [
    {
      id: 'tab-1',
      name: 'Terminal 1',
      panes: [initialPane],
      active: true,
    },
  ],
  sessionName: 'main',
  missionState: {
    activeMission: null,
    currentStep: 0,
    completedMissions: [],
  },
  focusedPaneId: 'pane-1',
  focusedTabId: 'tab-1',
}

// Reducer
export function simulatorReducer(
  state: SimulatorState,
  action: SimulatorAction
): SimulatorState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode }

    case 'PANE_SPLIT_HORIZONTAL': {
      if (state.mode !== 'pane') return state
      const focusedPane = state.panes.find((p) => p.id === state.focusedPaneId)
      if (!focusedPane || focusedPane.floating) return state

      const newPaneId = generateId()
      const splitH = focusedPane.h / 2

      const updatedPanes = state.panes.map((p) => {
        if (p.id === state.focusedPaneId) {
          return { ...p, h: splitH }
        }
        if (!p.floating && p.y > focusedPane.y) {
          return { ...p, y: p.y + splitH }
        }
        return p
      })

      const newPane: Pane = {
        id: newPaneId,
        x: focusedPane.x,
        y: focusedPane.y + splitH,
        w: focusedPane.w,
        h: splitH,
        command: 'user@host:~$',
        focused: true,
        floating: false,
        zIndex: Math.max(...state.panes.map((p) => p.zIndex)) + 1,
      }

      const reFocused = updatedPanes.map((p) => ({ ...p, focused: p.id === state.focusedPaneId }))

      return {
        ...state,
        panes: [...reFocused, newPane],
        focusedPaneId: newPaneId,
      }
    }

    case 'PANE_SPLIT_VERTICAL': {
      if (state.mode !== 'pane') return state
      const focusedPane = state.panes.find((p) => p.id === state.focusedPaneId)
      if (!focusedPane || focusedPane.floating) return state

      const newPaneId = generateId()
      const splitW = focusedPane.w / 2

      const updatedPanes = state.panes.map((p) => {
        if (p.id === state.focusedPaneId) {
          return { ...p, w: splitW }
        }
        if (!p.floating && p.x > focusedPane.x) {
          return { ...p, x: p.x + splitW }
        }
        return p
      })

      const newPane: Pane = {
        id: newPaneId,
        x: focusedPane.x + splitW,
        y: focusedPane.y,
        w: splitW,
        h: focusedPane.h,
        command: 'user@host:~$',
        focused: true,
        floating: false,
        zIndex: Math.max(...state.panes.map((p) => p.zIndex)) + 1,
      }

      const reFocused = updatedPanes.map((p) => ({ ...p, focused: p.id === state.focusedPaneId }))

      return {
        ...state,
        panes: [...reFocused, newPane],
        focusedPaneId: newPaneId,
      }
    }

    case 'PANE_CLOSE': {
      if (state.mode !== 'pane') return state
      const tiledPanes = state.panes.filter((p) => !p.floating)
      if (tiledPanes.length <= 1) return state

      const closingPane = state.panes.find((p) => p.id === state.focusedPaneId)
      if (!closingPane || closingPane.floating) return state

      const remainingPanes = state.panes.filter((p) => p.id !== state.focusedPaneId)
      const newFocusedId = remainingPanes.find((p) => p.id !== state.focusedPaneId)?.id || null

      return {
        ...state,
        panes: remainingPanes.map((p) => ({ ...p, focused: p.id === newFocusedId })),
        focusedPaneId: newFocusedId,
      }
    }

    case 'PANE_TOGGLE_FULLSCREEN': {
      if (state.mode !== 'pane') return state
      const focusedPane = state.panes.find((p) => p.id === state.focusedPaneId)
      if (!focusedPane || focusedPane.floating) return state

      const isFullscreen = focusedPane.w === 100 && focusedPane.h === 100

      if (isFullscreen) {
        // Restore previous dimensions (simplified - just reset to 50x50 split)
        return {
          ...state,
          panes: state.panes.map((p) => {
            if (p.id === state.focusedPaneId) {
              return { ...p, w: 50, h: 100, x: 50, y: 0 }
            }
            if (p.id !== state.focusedPaneId && !p.floating) {
              return { ...p, w: 50, h: 100, x: 0, y: 0 }
            }
            return p
          }),
        }
      }

      return {
        ...state,
        panes: state.panes.map((p) => {
          if (p.id === state.focusedPaneId) {
            return { ...p, x: 0, y: 0, w: 100, h: 100 }
          }
          if (!p.floating) {
            return { ...p, w: 0, h: 0, x: 0, y: 0 }
          }
          return p
        }),
      }
    }

    case 'PANE_FLOAT': {
      if (state.mode !== 'pane') return state
      const focusedPane = state.panes.find((p) => p.id === state.focusedPaneId)
      if (!focusedPane || focusedPane.floating) return state

      return {
        ...state,
        panes: state.panes.map((p) => {
          if (p.id === state.focusedPaneId) {
            return {
              ...p,
              floating: true,
              w: 40,
              h: 30,
              x: 30 + Math.random() * 20,
              y: 20 + Math.random() * 20,
              zIndex: Math.max(...state.panes.map((pane) => pane.zIndex)) + 1,
            }
          }
          return p
        }),
      }
    }

    case 'PANE_EMBED': {
      if (state.mode !== 'pane') return state
      const floatingPane = state.panes.find((p) => p.floating && p.id === state.focusedPaneId)
      if (!floatingPane) return state

      const tiledPanes = state.panes.filter((p) => !p.floating)
      const lastTiled = tiledPanes[tiledPanes.length - 1]

      return {
        ...state,
        panes: state.panes.map((p) => {
          if (p.id === state.focusedPaneId) {
            return {
              ...p,
              floating: false,
              x: lastTiled ? lastTiled.x + lastTiled.w : 0,
              y: lastTiled ? lastTiled.y : 0,
              w: lastTiled ? lastTiled.w : 50,
              h: lastTiled ? lastTiled.h : 100,
              zIndex: 1,
            }
          }
          return p
        }),
      }
    }

    case 'PANE_FOCUS': {
      return {
        ...state,
        panes: state.panes.map((p) => ({
          ...p,
          focused: p.id === action.paneId,
        })),
        focusedPaneId: action.paneId,
      }
    }

    case 'PANE_NAVIGATE': {
      const focused = state.panes.find((p) => p.id === state.focusedPaneId)
      if (!focused) return state

      const tiledPanes = state.panes.filter((p) => !p.floating)
      if (tiledPanes.length <= 1) return state

      // Find the best pane in the direction
      let bestPane: Pane | null = null
      let bestScore = Infinity

      for (const p of tiledPanes) {
        if (p.id === focused.id) continue
        let score = Infinity

        switch (action.direction) {
          case 'up':
            if (p.y < focused.y) {
              score = (focused.y - p.y) + Math.abs((focused.x + focused.w / 2) - (p.x + p.w / 2))
            }
            break
          case 'down':
            if (p.y > focused.y) {
              score = (p.y - focused.y) + Math.abs((focused.x + focused.w / 2) - (p.x + p.w / 2))
            }
            break
          case 'left':
            if (p.x < focused.x) {
              score = (focused.x - p.x) + Math.abs((focused.y + focused.h / 2) - (p.y + p.h / 2))
            }
            break
          case 'right':
            if (p.x > focused.x) {
              score = (p.x - focused.x) + Math.abs((focused.y + focused.h / 2) - (p.y + p.h / 2))
            }
            break
        }

        if (score < bestScore) {
          bestScore = score
          bestPane = p
        }
      }

      if (bestPane) {
        return {
          ...state,
          panes: state.panes.map((p) => ({
            ...p,
            focused: p.id === bestPane!.id,
          })),
          focusedPaneId: bestPane.id,
        }
      }

      return state
    }

    case 'TAB_CREATE': {
      if (state.mode !== 'tab') return state
      const newTabId = generateId()
      const newPaneId = generateId()

      const newTab: Tab = {
        id: newTabId,
        name: `Terminal ${state.tabs.length + 1}`,
        panes: [
          {
            id: newPaneId,
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            command: 'user@host:~$',
            focused: true,
            floating: false,
            zIndex: 1,
          },
        ],
        active: true,
      }

      return {
        ...state,
        tabs: [
          ...state.tabs.map((t) => ({ ...t, active: false })),
          newTab,
        ],
        panes: [
          ...state.panes.map((p) => ({ ...p, focused: false })),
          ...newTab.panes,
        ],
        focusedPaneId: newPaneId,
        focusedTabId: newTabId,
      }
    }

    case 'TAB_CLOSE': {
      if (state.mode !== 'tab') return state
      if (state.tabs.length <= 1) return state

      const activeTabIndex = state.tabs.findIndex((t) => t.id === state.focusedTabId)
      const remainingTabs = state.tabs.filter((t) => t.id !== state.focusedTabId)
      const newActiveIndex = Math.max(0, activeTabIndex - 1)
      const newActiveTab = remainingTabs[newActiveIndex]

      const panesToRemove = state.panes.filter((p) =>
        state.tabs.find((t) => t.id === state.focusedTabId)?.panes.some((tp) => tp.id === p.id)
      )
      const remainingPanes = state.panes.filter((p) => !panesToRemove.some((pr) => pr.id === p.id))

      return {
        ...state,
        tabs: remainingTabs.map((t, i) => ({
          ...t,
          active: i === newActiveIndex,
        })),
        panes: remainingPanes.length > 0 ? remainingPanes : [{
          id: 'pane-1',
          x: 0,
          y: 0,
          w: 100,
          h: 100,
          command: 'user@host:~$',
          focused: true,
          floating: false,
          zIndex: 1,
        }],
        focusedTabId: newActiveTab?.id || null,
        focusedPaneId: newActiveTab?.panes[0]?.id || null,
      }
    }

    case 'TAB_FOCUS': {
      const tab = state.tabs.find((t) => t.id === action.tabId)
      if (!tab) return state

      return {
        ...state,
        tabs: state.tabs.map((t) => ({
          ...t,
          active: t.id === action.tabId,
        })),
        focusedTabId: action.tabId,
        focusedPaneId: tab.panes[0]?.id || null,
      }
    }

    case 'TAB_NAVIGATE': {
      const activeIndex = state.tabs.findIndex((t) => t.id === state.focusedTabId)
      let newIndex = activeIndex

      if (action.direction === 'left') {
        newIndex = activeIndex > 0 ? activeIndex - 1 : state.tabs.length - 1
      } else {
        newIndex = activeIndex < state.tabs.length - 1 ? activeIndex + 1 : 0
      }

      const newTab = state.tabs[newIndex]
      if (!newTab) return state

      return {
        ...state,
        tabs: state.tabs.map((t) => ({
          ...t,
          active: t.id === newTab.id,
        })),
        focusedTabId: newTab.id,
        focusedPaneId: newTab.panes[0]?.id || state.focusedPaneId,
      }
    }

    case 'TAB_RENAME': {
      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id === action.tabId) {
            return { ...t, name: action.name }
          }
          return t
        }),
      }
    }

    case 'TAB_MOVE': {
      const activeIndex = state.tabs.findIndex((t) => t.id === state.focusedTabId)
      let newIndex = activeIndex

      if (action.direction === 'left' && activeIndex > 0) {
        newIndex = activeIndex - 1
      } else if (action.direction === 'right' && activeIndex < state.tabs.length - 1) {
        newIndex = activeIndex + 1
      } else {
        return state
      }

      const newTabs = [...state.tabs]
      const [movedTab] = newTabs.splice(activeIndex, 1)
      newTabs.splice(newIndex, 0, movedTab)

      return {
        ...state,
        tabs: newTabs,
      }
    }

    case 'SESSION_DETACH':
      return {
        ...state,
        sessionName: '',
      }

    case 'SESSION_RENAME':
      return {
        ...state,
        sessionName: action.name,
      }

    case 'RESET_SIMULATOR':
      return initialState

    case 'SET_MISSION':
      return {
        ...state,
        missionState: {
          ...state.missionState,
          activeMission: action.missionId,
          currentStep: 0,
        },
      }

    case 'COMPLETE_STEP': {
      if (!state.missionState.activeMission || state.missionState.activeMission === 'free') {
        return state
      }

      const mission = missions[state.missionState.activeMission]
      if (!mission) return state

      const newCompletedSteps = [...mission.steps.map((s) => ({ ...s, completed: true }))]

      return {
        ...state,
        missionState: {
          ...state.missionState,
          currentStep: state.missionState.currentStep + 1,
          completedMissions: state.missionState.currentStep >= mission.steps.length - 1
            ? [...state.missionState.completedMissions, state.missionState.activeMission]
            : state.missionState.completedMissions,
        },
      }
    }

    case 'SKIP_STEP': {
      if (!state.missionState.activeMission || state.missionState.activeMission === 'free') {
        return state
      }

      const mission = missions[state.missionState.activeMission]
      if (!mission) return state

      return {
        ...state,
        missionState: {
          ...state.missionState,
          currentStep: Math.min(state.missionState.currentStep + 1, mission.steps.length - 1),
        },
      }
    }

    case 'NEXT_STEP': {
      if (!state.missionState.activeMission || state.missionState.activeMission === 'free') {
        return state
      }

      const mission = missions[state.missionState.activeMission]
      if (!mission) return state

      return {
        ...state,
        missionState: {
          ...state.missionState,
          currentStep: Math.min(state.missionState.currentStep + 1, mission.steps.length - 1),
        },
      }
    }

    default:
      return state
  }
}

// Mode-specific shortcut hints (as shown in real Zellij status bar)
export const modeHints: Record<SimulatorMode, string[]> = {
  normal: ['Ctrl+p Pane', 'Ctrl+t Tab', 'Ctrl+s Scroll', 'Ctrl+o Session', 'Ctrl+n Resize'],
  pane: ['d SplitH', 'r SplitV', 'x Close', 'f Fullscreen', 'w Float', 'e Embed', 'Esc Exit'],
  tab: ['n New', 'x Close', 'h/l Left/Right', 'r Rename', 'H/L Move', 'Esc Exit'],
  scroll: ['j/k Up/Down', 'Ctrl+u/d Page', 'e Copy', '/ Search', 'y Copy', 'Esc Exit'],
  session: ['d Detach', 'w Manager', 'r Rename', 'n New', 'x Kill', 'Esc Exit'],
  resize: ['Arrows Resize', '+/- Size', 'Esc Exit'],
  search: ['/ Find', 'n/N Next/Prev', 'Esc Exit'],
  locked: ['Ctrl+g Unlock'],
  cli: ['zellij -s <name>', 'zellij list-sessions', 'zellij attach <name>'],
}