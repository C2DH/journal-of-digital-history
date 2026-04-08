import {
  AutoStories,
  AutoStoriesOutlined,
  Campaign,
  CampaignOutlined,
  Description,
  DescriptionOutlined,
  Home,
  HomeOutlined,
  Link as LinkIcon,
  LinkOutlined,
  Notes,
  NotesOutlined,
  Person,
  PersonOutlined,
} from '@mui/icons-material'

export const navbarItems = [
  {
    label: 'Home',
    href: '',
    iconOutlined: <HomeOutlined className="icon-outlined" />,
    iconFilled: <Home className="icon-filled" />,
  },
  {
    label: 'Abstracts',
    href: 'abstracts',
    iconOutlined: <NotesOutlined className="icon-outlined" />,
    iconFilled: <Notes className="icon-filled" />,
  },
  {
    label: 'Articles',
    href: 'articles',
    iconOutlined: <DescriptionOutlined className="icon-outlined" />,
    iconFilled: <Description className="icon-filled" />,
  },
  {
    label: 'Call for Papers',
    href: 'callforpapers',
    iconOutlined: <CampaignOutlined className="icon-outlined" />,
    iconFilled: <Campaign className="icon-filled" />,
  },
  {
    label: 'Issues',
    href: 'issues',
    iconOutlined: <AutoStoriesOutlined className="icon-outlined" />,
    iconFilled: <AutoStories className="icon-filled" />,
  },
  {
    label: 'Authors',
    href: 'authors',
    iconOutlined: <PersonOutlined className="icon-outlined" />,
    iconFilled: <Person className="icon-filled" />,
  },
  {
    label: 'Datasets',
    href: 'datasets',
    iconOutlined: <LinkOutlined className="icon-outlined" />,
    iconFilled: <LinkIcon className="icon-filled" />,
  },
]
