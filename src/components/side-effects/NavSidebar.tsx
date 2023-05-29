import { useState } from 'react'
import {
  FiBookOpen as BookOpen,
  FiCompass as Compass,
  FiBookmark as Bookmark,
  FiFolder as Folder
} from 'react-icons/fi'
import { RxDot as Dot } from 'react-icons/rx'
import { withRouter, NextRouter } from 'next/router'
import Sidebar from '@/components/pure/Sidebar'

const getRedirectFunction = (router: NextRouter, path: string) => () => {
  void router.push(`/${path}`)
}
const nullFunc = () => null

const renderFooter = (router: NextRouter) => (
  <Sidebar.Section.Item
    id={0}
    Icon={BookOpen}
    text="Help & Support"
    onClick={getRedirectFunction(router, '/documentation')}
    showIcon
  />
)

const initialSections = [
  {
    title: 'Overview',
    items: [
      { id: 1, Icon: Compass, text: 'Trending projects', onClick: nullFunc, showIcon: true },
      { id: 2, Icon: Bookmark, text: 'All bookmarks', onClick: nullFunc, showIcon: true }
    ]
  },
  {
    title: 'Categories',
    items: [
      {
        id: 3,
        Icon: Folder,
        text: 'Infrastructure',
        onClick: nullFunc,
        showIcon: true,
        highlighted: true
      },
      { id: 4, Icon: Folder, text: 'Dev Tools', onClick: nullFunc, showIcon: true },
      {
        id: 5,
        Icon: Dot,
        text: 'vercel / next.js',
        onClick: nullFunc,
        showIcon: true,
        secondaryItem: true
      },
      {
        id: 6,
        Icon: Dot,
        text: 'microsfot / playwright',
        onClick: nullFunc,
        showIcon: true,
        secondaryItem: true
      },
      { id: 7, Icon: Folder, text: 'Machine Learning', onClick: nullFunc, showIcon: true },
      { id: 8, Icon: Folder, text: 'Artificial Intelligence', onClick: nullFunc, showIcon: true }
    ]
  }
]

const NavSidebar = ({ router }: { router: NextRouter }) => {
  const [sections, setSections] = useState(initialSections)

  const handleSave = (id: number, newText: string) => {
    setSections(
      sections.map((section) => ({
        ...section,
        items: section.items.map((item) => (item.id === id ? { ...item, text: newText } : item))
      }))
    )
  }

  const handleDelete = (id: number) => {
    setSections(
      sections.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.id !== id)
      }))
    )
  }

  return (
    <Sidebar title="TruffleAI" footer={renderFooter(router)}>
      {sections.map((section) => (
        <Sidebar.Section title={section.title}>
          {section.items.map((item) => (
            <Sidebar.Section.Item
              key={item.id}
              id={item.id}
              Icon={item.Icon}
              text={item.text}
              onSave={handleSave}
              onDelete={handleDelete}
              onClick={item.onClick}
              showIcon={item.showIcon}
              highlighted={item.highlighted}
              secondaryItem={item.secondaryItem}
            />
          ))}
        </Sidebar.Section>
      ))}
    </Sidebar>
  )
}

export default withRouter(NavSidebar)
