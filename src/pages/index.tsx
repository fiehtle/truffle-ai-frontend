import Page from '@/components/side-effects/Page'
import withAuth from '@/components/side-effects/withAuth'
import { useEffect, useState } from 'react'
import CommandInterface from '@/components/CommandInterface/CommandInterface'
import ProjectsTable from '@/components/pure/ProjectsTable'

const Home = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setOpenModal(true)
      } else if (event.key === 'Escape') {
        setOpenModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  const closeModel = () => {
    setOpenModal(false)
  }
  return (
    <Page>
      {openModal && <CommandInterface action={closeModel} />}
      <ProjectsTable />
    </Page>
  )
}

export default withAuth(Home)
