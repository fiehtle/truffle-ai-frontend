/* eslint-disable react/jsx-props-no-spreading */
import Button from '@/components/Button'
import Sidebar from '@/components/Sidebar'
import { founderListMock, githubStatListMock, socialMediaListMock } from '@/data/detailPageMocks'
import { FaSlack } from 'react-icons/fa'

const SmallSidebar = () => (
  <Sidebar.Small>
    <Sidebar.Box title="GitHub Stats">
      {githubStatListMock.map((data) => (
        <Sidebar.Box.GithubStatItem {...data} />
      ))}
    </Sidebar.Box>
    <Sidebar.Box title="SocialMedia">
      {socialMediaListMock.map((data) => (
        <Sidebar.Box.SocialMediaItem {...data} />
      ))}
    </Sidebar.Box>
    <Sidebar.Box title="Founder">
      {founderListMock.map((data) => (
        <Sidebar.Box.FounderItem {...data} />
      ))}
    </Sidebar.Box>
    <Sidebar.Box title="Integrations">
      <div className="flex flex-col justify-between">
        <div className="inline-flex px-7 py-2.5 transition-colors duration-100 hover:bg-gray-850">
          <div className="flex flex-row items-center justify-center gap-[15px]">
            <Button variant="normal" onClick={() => null} text="Add to CRM" />
            <button type="button" onClick={() => null}>
              <FaSlack className=" h-[14px] w-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </Sidebar.Box>
  </Sidebar.Small>
)

export default SmallSidebar
