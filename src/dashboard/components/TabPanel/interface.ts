export interface Tab {
  label: string
  content: React.ReactNode
}

export interface TabPanelProps {
  tabs: Tab[]
}
