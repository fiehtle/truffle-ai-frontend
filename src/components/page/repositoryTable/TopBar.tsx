import { Fragment, useState } from 'react'

import { Column } from '@tanstack/react-table'
import { VscSettings } from 'react-icons/vsc'
import { TbColumns2 } from 'react-icons/tb'
import { AiOutlinePlus, AiOutlineCalendar } from 'react-icons/ai'
import { RiCheckboxBlankLine, RiCheckboxFill } from 'react-icons/ri'
import { Menu, Transition } from '@headlessui/react'
import Button from '@/components/pure/Button'
import { Repository } from './columns'

type TopBarProps = {
  columns: Column<Repository, unknown>[]
  nullFunc: () => void
}

const TopBar = ({ columns, nullFunc }: TopBarProps) => {
  const [selectedSortItem, setSelectedSortItem] = useState<string | null>(null)

  const handleItemClick = (item: string) => {
    setSelectedSortItem(item)
  }

  const handleClick = (item: string) => () => handleItemClick(item)

  const sortItems = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Most Stars', label: 'Most Stars' },
    { value: 'Most Forks', label: 'Most Forks' },
    { value: 'Fastest Growth', label: 'Fastest Growth' }
  ]

  const sortClassName = 'flex items-center bg-blue-500 text-white'
  const [projectName, setProjectName] = useState('')

  return (
    <div className="flex flex-row justify-between border-b border-gray-800 px-6 pb-3.5">
      {/* Filter, Sort, Edit Columns buttons */}
      <div className="flex flex-row gap-3">
        <div className="inline-block">
          <Button
            onClick={nullFunc}
            variant="normal"
            text="This week"
            Icon={AiOutlineCalendar}
            order="ltr"
            iconColor="white"
            textColor="white"
          />
        </div>

        <div className="inline-block">
          <Button
            onClick={nullFunc}
            variant="filter"
            text="Add Filter"
            Icon={AiOutlinePlus}
            order="ltr"
            iconColor="white"
            textColor="white"
          />
        </div>
      </div>

      <div className="flex flex-row gap-3">
        <div className="mb-8 flex flex-row space-x-2">{/* Dropdown */}</div>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex flex-row items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-3 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700">
              <VscSettings />

              <p>Sort</p>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 focus:outline-none">
              <div className="px-4 py-3">
                {sortItems.map((item) => (
                  <Menu.Item key={item.value}>
                    <div
                      className={sortClassName}
                      onClick={handleClick(item.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          handleItemClick(item.value)
                        }
                      }}
                      tabIndex={0}
                      role="button"
                    >
                      {selectedSortItem === item.value ? (
                        <RiCheckboxFill className="mr-2" />
                      ) : (
                        <RiCheckboxBlankLine className="mr-2" />
                      )}
                      {item.label}
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {selectedSortItem && <div>{selectedSortItem}</div>}

        <div />

        <div className="mb-8 flex flex-row space-x-2">{/* Dropdown */}</div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex flex-row items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-3 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700">
              <TbColumns2 />
              <p>Edit Columns</p>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 focus:outline-none">
              <div className="py-1">
                {columns.map((column) => (
                  <Menu.Item key={column.id}>
                    <button
                      type="button"
                      onClick={() => column.toggleVisibility()}
                      className="flex w-44 flex-row items-center space-x-2 px-4 py-2 hover:bg-gray-600"
                    >
                      {column.getIsVisible() ? (
                        <RiCheckboxFill className="text-indigo-600" />
                      ) : (
                        <RiCheckboxBlankLine />
                      )}

                      <p
                        className={
                          column.getIsVisible() ? 'text-14 text-gray-100' : 'text-14 text-gray-400'
                        }
                      >
                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : ''}
                      </p>
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/*          <div className="inline-block">
          <Button
            onClick={nullFunc}
            variant="highlighted"
            text="Add Project"
            Icon={AiOutlinePlus}
            order="ltr"
            iconColor="white"
            textColor="white"
          />
        </div>  */}

        <div className="mb-8 flex flex-row space-x-2">{/* Dropdown */}</div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <div>
              <Menu.Button className="flex flex-row items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-3 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700">
                <AiOutlinePlus />
                <p>Add Project</p>
              </Menu.Button>
            </div>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="w-70 absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 focus:outline-none">
              <div className="p-4">
                <h3 className="mb-4 text-lg font-medium">Add Project</h3>
                <input
                  type="text"
                  placeholder="github.com/"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mb-4 border border-gray-300 bg-gray-700 px-4 py-2 text-white"
                />
                <div className="flex justify-end">
                  <Menu.Button
                    className="flex flex-row items-center space-x-2 rounded-[5px] border border-gray-800 bg-gray-850 px-3 py-1.5 text-14 transition-colors duration-100 hover:bg-gray-700"
                    onClick={nullFunc}
                  >
                    Add Project
                  </Menu.Button>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default TopBar
