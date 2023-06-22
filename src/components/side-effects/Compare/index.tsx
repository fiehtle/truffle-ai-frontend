import { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  ColumnOrderState,
  getFilteredRowModel
} from '@tanstack/react-table'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaSlack } from 'react-icons/fa'
import Error from '@/components/pure/Error'
import Button from '@/components/pure/Button'
import Loading from '@/components/pure/Loading'
import Chart from '@/components/page/details/Chart'
import Table from '@/components/page/overview/Table'
import TopBar from '@/components/page/overview/TopBar'
import FilterBar from '@/components/page/overview/FilterBar'
import { defaultFilters, defaultSort } from '@/components/page/overview/types'
import {
  Project,
  ProjectFilter,
  ProjectOrderBy,
  useTrendingProjectsQuery
} from '@/graphql/generated/gql'
import Banner from '@/components/page/settings/Banner'
import sendSlackNotification from '@/util/sendSlackNotification'
import createColumns from '@/components/side-effects/ProjectsTable/columns'

// Constants
const NUMERIC_FIELDS = [
  'contributorCount',
  'forkCount',
  'issueCount',
  'pullRequestCount',
  'starCount'
]

// Utility Functions
const getPercentileValue = (projects: Project[], percentile: number, sortDescending = true) => {
  const result = {}
  NUMERIC_FIELDS.forEach((field) => {
    const sortedData = projects
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map((item) => item[field])
      .filter((item) => !!item)
      .sort((a, b) => (sortDescending ? b - a : a - b))

    const percentileIndex = Math.floor(sortedData.length * percentile)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    result[field] =
      percentileIndex < sortedData.length && sortedData.length > 0
        ? sortedData[percentileIndex]
        : null
  })

  return result
}

const Compare = () => {
  // States
  const [data, setData] = useState<Project[]>([])
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
  const [filters, setFilters] = useState<ProjectFilter>(defaultFilters)
  const [sorting, setSorting] = useState<ProjectOrderBy | null>(defaultSort)
  const [columnVisibility, setColumnVisibility] = useState({})
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'error' | ''>('')
  const [slackLoading, setSlackLoading] = useState(false)
  const [percentileStats, setPercentileStats] = useState({
    topTenPercent: {},
    topTwentyPercent: {},
    bottomTenPercent: {},
    bottomTwentyPercent: {}
  })

  const { topTenPercent, topTwentyPercent, bottomTenPercent, bottomTwentyPercent } = percentileStats

  const [columns, setColumns] = useState(() =>
    createColumns(bottomTenPercent, topTenPercent, topTwentyPercent, bottomTwentyPercent)
  )

  // Fetch Data
  const [{ data: urqlData, fetching, error }] = useTrendingProjectsQuery({
    variables: {
      orderBy: sorting || defaultSort,
      filter: filters || defaultFilters
    }
  })

  // Effect Hooks
  useEffect(() => {
    if (urqlData) {
      const projectData = urqlData?.projectCollection?.edges?.map((edge) => edge.node) as Project[]
      setData(projectData)

      setPercentileStats({
        topTenPercent: getPercentileValue(projectData, 0.1),
        bottomTenPercent: getPercentileValue(projectData, 0.1, false),
        topTwentyPercent: getPercentileValue(projectData, 0.2),
        bottomTwentyPercent: getPercentileValue(projectData, 0.2, false)
      })
    }
  }, [urqlData])

  useEffect(() => {
    setColumns(() =>
      createColumns(bottomTenPercent, topTenPercent, topTwentyPercent, bottomTwentyPercent)
    )
  }, [bottomTenPercent, topTenPercent, topTwentyPercent, bottomTwentyPercent])

  // TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder
    },
    enableColumnFilters: true,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  // Handlers
  const handleNotificationWrapper = async (message: string) => {
    setNotificationStatus(await sendSlackNotification(message))
  }

  const sendSlackMessage = () => {
    setSlackLoading(true)
    const savedMessage = localStorage.getItem('slackMessageMultiple') || ''
    const message = `${savedMessage}\n${table
      .getRowModel()
      .rows.map(
        (row) =>
          `- <${row.original.githubUrl as string}|${row.original.name}>, ${
            row.original.starCount as number
          } stars`
      )
      .join('\n')}\n`

    void handleNotificationWrapper(message)
    setSlackLoading(false)
  }

  const displayChart = () => !fetching && !error && data.length > 0

  // Component Return
  return (
    <>
      <TopBar
        columns={table.getAllLeafColumns()}
        filters={filters}
        comparePage={false}
        sorting={sorting}
        setSorting={setSorting}
        updateFilters={setFilters}
      />

      {(Object.keys(filters).length > 0 || sorting) && (
        <FilterBar
          filters={filters}
          updateFilters={setFilters}
          currentEntries={data.length}
          totalEntries={data.length}
          sorting={sorting}
          setSorting={setSorting}
        />
      )}

      <div className="flex w-full flex-col pt-[120px]">
        <div className="flex flex-row items-center justify-between px-6 pt-3.5">
          <div className="flex flex-col">
            <p className="text-12 font-medium uppercase text-gray-500">Compare</p>
            <h1 className="text-24 font-medium">Infrastructure</h1>
          </div>

          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              onClick={sendSlackMessage}
              variant="normal"
              text={slackLoading ? 'Loading...' : 'Send to Slack'}
              Icon={FaSlack}
              order="ltr"
              textColor="white"
            />

            {notificationStatus === 'success' && (
              <Banner variant="success" message="Slack notification sent" />
            )}

            {notificationStatus === 'error' && (
              <Banner variant="error" message="Error sending notification" />
            )}

            <Button
              variant="normal"
              text="Add project to compare"
              Icon={AiOutlinePlus}
              order="ltr"
              textColor="white"
            />
          </div>
        </div>

        {displayChart() && (
          <>
            <Chart
              datasets={data.map((project) => ({
                id: project.id,
                name: project.name,
                data: project.starHistory as React.ComponentProps<
                  typeof Chart
                >['datasets'][0]['data']
              }))}
              multipleLines
            />

            <div className="flex flex-row items-center justify-between px-6 py-3.5">
              <div className="flex flex-col">
                <p className="font-medium">All projects in this category</p>
              </div>
            </div>
          </>
        )}

        {fetching && <Loading />}

        {error && <Error />}

        {data.length === 0 && !error && !fetching && (
          <p className="w-full p-12 text-center text-14 text-gray-300">No projects found</p>
        )}

        {data.length > 0 && !error && <Table table={table} />}
      </div>
    </>
  )
}

export default Compare
