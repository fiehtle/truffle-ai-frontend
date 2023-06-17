import { Fragment, ReactNode, useState } from 'react'
import { Column } from '@tanstack/react-table'
import { TbArrowsSort, TbColumns2 } from 'react-icons/tb'
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineNumber, AiOutlinePlus } from 'react-icons/ai'
import { RiCheckboxBlankLine, RiCheckboxFill } from 'react-icons/ri'
import { Menu, Transition } from '@headlessui/react'
import Button from '@/components/pure/Button'
import { Project } from '@/graphql/generated/gql'
import { IoTextOutline } from 'react-icons/io5'
import {
  NumberTableFilterOperator,
  StringTableFilterOperator,
  TableFilter
} from '@/components/page/overview/TableFilter'
import { TableSort } from '@/components/page/overview/TableSort'
import TableSortModal from '@/components/page/overview/TableSortModal'

type TopBarProps = {
  columns: Column<Project, unknown>[]
  nullFunc: () => void
  addFilter: (filter: TableFilter) => void
  filters: TableFilter[]
  comparePage: boolean
  tableSort: TableSort | null
  setTableSort: (sort: TableSort | null) => void
}

const timeFrameOptions = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
]

type TransitionMenuItemsProps = {
  children: ReactNode
}

const TransitionMenuItems = ({ children }: TransitionMenuItemsProps) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
)

/**
 * Top navigation for the table view, including filter, sort, edit columns and add project buttons
 */
const TopBar = ({
  columns,
  nullFunc,
  addFilter,
  filters,
  comparePage,
  tableSort,
  setTableSort
}: TopBarProps) => {
  const [open, setOpen] = useState(false)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrameOptions[1])
  const visibleColumnTextStyle = 'text-14 text-gray-100'
  const hiddenColumnTextStyle = 'text-14 text-gray-500'
  return (
    <div className="flex h-[60px] flex-row items-center justify-between border-b border-gray-800 px-6">
      {/* Filter, Sort, Edit Columns buttons */}
      <div className="flex flex-row gap-3">
        {!comparePage && (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex h-[30px] flex-row items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-2 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700">
                <AiOutlineCalendar className="text-gray-500" />
                <p className="leading-none">{selectedTimeFrame.label}</p>
              </Menu.Button>
            </div>

            <TransitionMenuItems>
              <Menu.Items className="absolute right-0 z-30 mt-2 w-44 origin-top-right rounded-md bg-gray-700 shadow-lg focus:outline-none">
                <div className="py-1">
                  {timeFrameOptions.map((option) => (
                    <Menu.Item key={option.value}>
                      {/* @TODO Change time frame */}
                      <button
                        type="button"
                        className="flex w-44 flex-row items-center space-x-2 px-4 py-2 hover:bg-gray-600"
                        onClick={() => setSelectedTimeFrame(option)}
                      >
                        <p className="text-14 text-gray-100">{option.label}</p>
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </TransitionMenuItems>
          </Menu>
        )}

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            onClick={() => setOpen(!open)}
            className="flex h-[30px] flex-row items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-2 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700"
          >
            <TbColumns2 className="text-gray-500" />
            <p className="leading-none">Edit Columns</p>
          </Menu.Button>

          <TransitionMenuItems>
            <Menu.Items
              static
              className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-gray-700 shadow-lg focus:outline-none"
            >
              <div className="py-1">
                {columns.map((column) => (
                  <Menu.Item key={column.id}>
                    <button
                      type="button"
                      onClick={column.getToggleVisibilityHandler()}
                      className="flex w-44 flex-row items-center space-x-2 px-4 py-2 hover:bg-gray-600"
                    >
                      {column.getIsVisible() ? (
                        <RiCheckboxFill className="text-indigo-600" />
                      ) : (
                        <RiCheckboxBlankLine />
                      )}

                      <p
                        className={
                          column.getIsVisible() ? visibleColumnTextStyle : hiddenColumnTextStyle
                        }
                      >
                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : ''}
                      </p>
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </TransitionMenuItems>
        </Menu>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className={`flex h-[30px] flex-row items-center space-x-2 rounded-[5px] border border-gray-800 px-2 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700 ${
                filters.length > 0 ? 'bg-gray-850' : ''
              }`}
            >
              <AiOutlineFilter className="text-gray-500" />
              <p className={`leading-none ${filters.length > 0 ? '' : 'text-gray-500'}`}>Filters</p>
            </Menu.Button>
          </div>

          <TransitionMenuItems>
            <Menu.Items className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-gray-700 shadow-lg focus:outline-none">
              <div className="py-1">
                {filters.length === 7 && (
                  <p className="py-1 pl-2 text-14">No more filters can be applied.</p>
                )}
                {columns
                  .filter(
                    (column) =>
                      column.getIsVisible() &&
                      column.columnDef.header !== 'Logo' &&
                      !filters.some(
                        (filter) => filter.column.columnDef.header === column.columnDef.header
                      )
                  )
                  .map((column) => (
                    <Menu.Item key={column.id}>
                      <button
                        type="button"
                        className="flex w-44 flex-row items-center space-x-2 px-4 py-2 hover:bg-gray-600"
                        onClick={() =>
                          addFilter({
                            column,
                            operator:
                              column.columnDef.header === 'Name'
                                ? StringTableFilterOperator.CONTAINS
                                : NumberTableFilterOperator.EQUALS
                          })
                        }
                      >
                        {column.columnDef.header === 'Name' ? (
                          <IoTextOutline className="text-gray-500" />
                        ) : (
                          <AiOutlineNumber className="text-gray-500" />
                        )}

                        <p
                          className={
                            column.getIsVisible()
                              ? 'text-14 text-gray-100'
                              : 'text-14 text-gray-400'
                          }
                        >
                          {typeof column.columnDef.header === 'string'
                            ? column.columnDef.header
                            : ''}
                        </p>
                      </button>
                    </Menu.Item>
                  ))}
              </div>
            </Menu.Items>
          </TransitionMenuItems>
        </Menu>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className={`flex h-[30px] flex-row items-center space-x-2 rounded-[5px] border border-gray-800 px-2 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700 ${
                tableSort ? 'bg-gray-850' : ''
              }`}
            >
              <TbArrowsSort className="text-gray-500" />
              <p className={`leading-none ${tableSort ? '' : 'text-gray-500'}`}>Sorting</p>
            </Menu.Button>
          </div>

          <TransitionMenuItems>
            <Menu.Items className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-gray-700 shadow-lg focus:outline-none">
              <div className="py-1">
                {tableSort ? (
                  <TableSortModal sort={tableSort} setSort={setTableSort} />
                ) : (
                  <>
                    {columns
                      .filter(
                        (column) => column.getIsVisible() && column.columnDef.header !== 'Logo'
                      )
                      .map((column) => (
                        <Menu.Item key={column.id}>
                          <button
                            type="button"
                            className="flex w-44 flex-row items-center space-x-2 px-4 py-2 hover:bg-gray-600"
                            onClick={() => {
                              setTableSort({
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                column: column.columnDef.header!.toString(),
                                direction: 'desc'
                              })
                            }}
                          >
                            {column.columnDef.header === 'Name' ? (
                              <IoTextOutline className="text-gray-500" />
                            ) : (
                              <AiOutlineNumber className="text-gray-500" />
                            )}

                            <p
                              className={
                                column.getIsVisible()
                                  ? visibleColumnTextStyle
                                  : hiddenColumnTextStyle
                              }
                            >
                              {typeof column.columnDef.header === 'string'
                                ? column.columnDef.header
                                : ''}
                            </p>
                          </button>
                        </Menu.Item>
                      ))}
                  </>
                )}
              </div>
            </Menu.Items>
          </TransitionMenuItems>
        </Menu>
      </div>

      <div className="flex flex-row gap-3">
        <div className="inline-block">
          <Button
            onClick={nullFunc}
            variant="highlighted"
            text="Add Project"
            Icon={AiOutlinePlus}
            order="ltr"
            iconColor="white"
            textColor="white"
          />
        </div>
      </div>
    </div>
  )
}

export default TopBar
export { TransitionMenuItems }
