export type MilestoneItem = {
  date: string
  title: string
}

export interface MilestoneYear {
  articles: MilestoneItem[]
  issues: MilestoneItem[]
  callForPapers: MilestoneItem[]
  conferences: MilestoneItem[]
  releases: MilestoneItem[]
}

export type MilestoneData = Record<string, MilestoneYear>

export interface MilestoneProps {
  data: MilestoneData
}
