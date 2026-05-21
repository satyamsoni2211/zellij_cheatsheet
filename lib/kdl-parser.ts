export interface KDLNode {
  name: string
  args: string[]
  props: Record<string, string>
  children: KDLNode[]
}

export interface KDLError {
  message: string
  line: number
  column: number
}

export interface KDLParseResult {
  nodes: KDLNode[]
  errors: KDLError[]
}

export function parseKDL(input: string): KDLParseResult {
  const nodes: KDLNode[] = []
  const errors: KDLError[] = []
  const lines = input.split('\n')

  let i = 0

  const peek = () => lines[i]
  const advance = () => lines[i++]

  const skipWhitespaceAndComments = () => {
    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()
      if (trimmed === '' || trimmed.startsWith('//')) {
        i++
      } else {
        break
      }
    }
  }

  const parseString = (s: string): string => {
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      return s.slice(1, -1)
    }
    return s
  }

  const parseIdentifier = (token: string): string => {
    return token.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
  }

  const parseValue = (token: string): string => {
    if (token.startsWith('"') || token.startsWith("'")) {
      return parseString(token)
    }
    return token
  }

  const parseProps = (line: string): Record<string, string> => {
    const props: Record<string, string> = {}
    const propRegex = /([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*("[^"]*"|'[^']*'|[^s]+)/g
    let match
    while ((match = propRegex.exec(line)) !== null) {
      const key = match[1]
      const rawValue = match[2]
      let value = rawValue.trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      props[key] = value
    }
    return props
  }

  const parseLine = (line: string): KDLNode | null => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//')) return null

    // Check if line ends with { meaning it has children on subsequent lines
    const hasChildrenBlock = trimmed.endsWith('{')

    // Simple parsing: split by whitespace but respect quotes
    const tokens: string[] = []
    let current = ''
    let inQuote = false
    let quoteChar = ''

    for (let j = 0; j < trimmed.length; j++) {
      const char = trimmed[j]
      if ((char === '"' || char === "'") && !inQuote) {
        inQuote = true
        quoteChar = char
        current += char
      } else if (char === quoteChar && inQuote) {
        inQuote = false
        quoteChar = ''
        current += char
      } else if (char === ' ' && !inQuote) {
        if (current) {
          tokens.push(current)
          current = ''
        }
      } else {
        current += char
      }
    }
    if (current) tokens.push(current)

    if (tokens.length === 0) return null

    const firstToken = tokens[0]

    // Check if this is a closing brace
    if (firstToken === '}') return null

    // If first token ends with {, it's a node with children
    const name = firstToken.replace(/\{$/, '')
    if (!name) return null

    const args: string[] = []
    const props: Record<string, string> = {}
    let childrenStart = -1

    for (let j = 1; j < tokens.length; j++) {
      const token = tokens[j]
      if (token === '{' || (token.endsWith('{') && childrenStart === -1)) {
        childrenStart = j
        break
      }
      if (token.includes('=')) {
        // This is a prop
        const [key, ...rest] = token.split('=')
        let value = rest.join('=')
        // Handle case where value is attached to key like key=value
        if (!value && j + 1 < tokens.length) {
          value = tokens[j + 1]
          j++
        }
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        props[key] = value
      } else {
        args.push(parseValue(token))
      }
    }

    return {
      name,
      args,
      props,
      children: [],
    }
  }

  // Build AST tree structure
  const rootNodes: KDLNode[] = []
  const nodeStack: KDLNode[] = [{ name: 'root', args: [], props: {}, children: rootNodes }]

  while (i < lines.length) {
    skipWhitespaceAndComments()
    if (i >= lines.length) break

    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    if (trimmed === '}') {
      nodeStack.pop()
      i++
      continue
    }

    const node = parseLine(line)
    if (node) {
      const currentParent = nodeStack[nodeStack.length - 1]
      if (currentParent) {
        currentParent.children.push(node)
      }
      if (trimmed.endsWith('{') || trimmed.endsWith('{}')) {
        nodeStack.push(node)
      }
    }
    i++
  }

  return { nodes: rootNodes, errors }
}

export function kdlToLayout(kdl: string): {
  tabs: Array<{
    name: string
    panes: Array<{ name?: string; command?: string; cwd?: string }>
  }>
  error?: string
} {
  const result = parseKDL(kdl)
  if (result.errors.length > 0) {
    return {
      tabs: [],
      error: result.errors[0].message,
    }
  }

  const tabs: Array<{
    name: string
    panes: Array<{ name?: string; command?: string; cwd?: string }>
  }> = []

  // Find tab definitions in root children
  for (const node of result.nodes) {
    if (node.name === 'tab' || node.name === 'layout') {
      const tabName = node.args[0] || 'Tab'
      const panes: Array<{ name?: string; command?: string; cwd?: string }> = []

      // Recursively extract panes from layout structure
      const extractPanes = (n: KDLNode) => {
        if (n.name === 'pane') {
          const pane: { name?: string; command?: string; cwd?: string } = {}
          if (n.args[0]) pane.name = n.args[0]
          if (n.props.command) pane.command = n.props.command
          if (n.props.cwd) pane.cwd = n.props.cwd
          panes.push(pane)
        }
        for (const child of n.children) {
          extractPanes(child)
        }
      }

      for (const child of node.children) {
        extractPanes(child)
      }

      tabs.push({ name: tabName, panes })
    }
  }

  // If no tabs found, create a default tab
  if (tabs.length === 0) {
    tabs.push({ name: 'Main', panes: [] })
  }

  return { tabs }
}