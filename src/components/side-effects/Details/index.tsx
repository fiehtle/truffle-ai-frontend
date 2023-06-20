import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FiX as X,
  FiChevronUp as ChevronUp,
  FiChevronDown as ChevronDown,
  FiArrowUpRight,
  FiChevronDown
} from 'react-icons/fi'
import { FaTwitter, FaHackerNews } from 'react-icons/fa'
import Loading from '@/components/pure/Loading'
import Button from '@/components/pure/Button'
import Card from '@/components/pure/Card'
import Error from '@/components/pure/Error'
import Chart from '@/components/page/details/Chart'
import ProjectInformation from '@/components/page/details/ProjectInformation'
import RightSidebar from '@/components/page/details/RightSidebar'
import { Project, useProjectDetailsQuery, useTrendingProjectsQuery } from '@/graphql/generated/gql'
import { hackerNewsListMock, tweetListMock } from '@/data/detailPageMocks'
import { Menu } from '@headlessui/react'
import { TransitionMenuItems } from '@/components/page/overview/TopBar'

const handleClick = () => ''

// @TODO Update social media buttons
const SomeButton = (
  <Button Icon={FiArrowUpRight} variant="normal" onClick={handleClick} text="Open" order="ltr" />
)

type DetailsProps = {
  id: string
}

/**
 * Project detail component
 */
const Details = ({ id }: DetailsProps) => {
  // @TODO Make list of projects dependent on where the user came from (trending, bookmarked, compare)
  const [{ data: tpData }] = useTrendingProjectsQuery()

  const projects = tpData?.projectCollection?.edges?.map((edge) => edge.node) as Project[]

  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>()
  const [previousProjectId, setPreviousProjectId] = useState<string>()
  const [nextProjectId, setNextProjectId] = useState<string>()
  const [selectedMetric, setSelectedMetric] = useState('Stars')

  const updateProjectIndices = (currentId: string, projectList: Project[]) => {
    const currentIndex = projectList.findIndex((project) => project.id === currentId)

    const newPreviousProjectId =
      currentIndex > 0 ? (projectList[currentIndex - 1].id as string) : undefined

    const newNextProjectId =
      currentIndex < projectList.length - 1
        ? (projectList[currentIndex + 1].id as string)
        : undefined

    setCurrentProjectIndex(currentIndex)
    setPreviousProjectId(newPreviousProjectId)
    setNextProjectId(newNextProjectId)
  }

  useEffect(() => {
    if (projects) {
      updateProjectIndices(id, projects)
    }
  }, [projects, id])

  /**
   * Get project details data using generated hook (returns array with 1 project if successful).
   * @param {string} id - The ID of the project for which to fetch details.
   * @returns {[{ data: any, fetching: boolean, error: any }]} Data is the data containing trending projects.
   * Fetching is a boolean flag indicating whether the data is currently being fetched or not.
   * Error contains any error information if the query encounters an error during the fetch.
   */
  const [{ data, fetching, error }] = useProjectDetailsQuery({ variables: { id } })

  // Get first entry of returned collection
  const project = data?.projectCollection?.edges?.map((edge) => edge.node)[0] as Project

  // Display loading/ error messages conditionally
  if (fetching) return <Loading message="Fetching project details for you..." />
  if (error || !project) return <Error />

  return (
    <>
      <div className="flex h-[59px] w-full items-center justify-between px-3 pl-7 text-gray-500">
        <div className="flex flex-row items-center gap-3">
          <Link href="/">
            <X key="2" className="h-4 w-4 text-gray-500" />
          </Link>

          {nextProjectId && (
            <Link href={`/details/${nextProjectId}`}>
              <Button variant="onlyIcon" onClick={handleClick} Icon={ChevronUp} />
            </Link>
          )}

          {previousProjectId && (
            <Link href={`/details/${previousProjectId}`}>
              <Button variant="onlyIcon" onClick={handleClick} Icon={ChevronDown} />
            </Link>
          )}

          <div className="flex flex-row items-center">
            <p className="text-14 text-white">
              {currentProjectIndex !== undefined ? currentProjectIndex + 1 : '0'}&nbsp;
            </p>
            <p className="text-14 text-gray-500">/&nbsp;{projects?.length}</p>
          </div>
        </div>
      </div>

      <div className="flex grow">
        <div className="w-4/5 flex-row border-t border-solid border-gray-800">
          <ProjectInformation
            image={
              (project.organization?.avatarUrl || project.associatedPerson?.avatarUrl) as string
            }
            name={`${
              (project.organization?.login || project.associatedPerson?.login) as string
            } / ${project.name as string}`}
            url={project.githubUrl as string}
            eli5={project.eli5 || project.about || 'No description'}
            tags={project.languages || []}
          />

          <div className="flex flex-col items-start">
            <Menu as="div" className="relative inline-block pl-7 pt-7">
              <Menu.Button className="flex h-[30px] flex-row items-center space-x-1 rounded-[5px] border border-gray-800 bg-gray-850 px-2 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700">
                <FiChevronDown className="text-gray-500" />
                <p className="leading-none">{selectedMetric}</p>
              </Menu.Button>

              <TransitionMenuItems>
                <Menu.Items
                  static
                  className="absolute z-10 mt-2 w-24 rounded-md bg-gray-700 shadow-lg focus:outline-none"
                >
                  <div className="py-1">
                    {['Stars', 'Forks'].map((metric) => (
                      <Menu.Item key={metric}>
                        <button
                          type="button"
                          onClick={() => setSelectedMetric(metric)}
                          className="flex w-24 flex-row items-center space-x-2 px-4 py-2 hover:bg-gray-600"
                        >
                          <p>{metric}</p>
                        </button>
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </TransitionMenuItems>
            </Menu>

            <Chart
              datasets={[
                {
                  id: project.id as string,
                  name: project.name as string,
                  data:
                    selectedMetric === 'Stars'
                      ? (project.starHistory as React.ComponentProps<
                          typeof Chart
                        >['datasets'][0]['data'])
                      : (project.forkHistory as React.ComponentProps<
                          typeof Chart
                        >['datasets'][1]['data'])
                }
              ]}
              multipleLines={false}
              selectedMetric={selectedMetric}
            />
          </div>

          {/* @TODO Add real data */}
          <div className="flex flex-row gap-4 border-t border-solid border-gray-800 py-2 pl-7 pr-3">
            <Card
              Icon={FaTwitter}
              name="Top Tweets"
              button={SomeButton}
              textFields={tweetListMock}
            />
            <Card
              Icon={FaHackerNews}
              name="Community Sentiment"
              button={SomeButton}
              textFields={hackerNewsListMock}
            />
          </div>
        </div>

        <RightSidebar project={project} />
      </div>
    </>
  )
}

export default Details
