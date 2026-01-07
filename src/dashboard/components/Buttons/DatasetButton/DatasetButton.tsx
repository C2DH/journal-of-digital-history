import './DatasetButton.css'

import CustomTooltip from '../../../../components/Tooltip'
import LinkButton from '../LinkButton/LinkButton'

const DatasetButton = ({ url, description }: { url: string; description: string }) => {
  return (
    <div className="dataset">
      <LinkButton url={url} />
      <CustomTooltip fieldname="description" index={0} text={description} icon="info" />
    </div>
  )
}

export default DatasetButton
