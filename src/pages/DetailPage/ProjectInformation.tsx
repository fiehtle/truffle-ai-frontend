import { StarIcon } from '@primer/octicons-react'
import Button from '../../components/Button'

type ProjectInformationProps = {
  name: string
  eli5: string
  tags: string[]
}

const ProjectInformation = ({ name, eli5, tags }: ProjectInformationProps) => (
  <div className="border-b border-border px-7 py-4">
    <div className="mb-4 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <h1 className="mr-3">{name}</h1>
        {tags.map((text) => (
          <p
            key={text}
            className="mx-1 rounded-lg bg-bgSecondary px-2 py-0.5 text-12 font-light text-textSecondary"
          >
            {text}
          </p>
        ))}
      </div>
      <Button
        variant="highlighted"
        text="Bookmark"
        Icon={StarIcon}
        onClick={() => {
          console.log('clicked')
        }}
        textColor="text-textPrimary"
        iconColor="text-textPrimary"
      />
    </div>
    <p className="text-12 font-light">{eli5}</p>
  </div>
)

export default ProjectInformation
