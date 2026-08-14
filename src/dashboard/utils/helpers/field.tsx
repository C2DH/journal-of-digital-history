import StatusButton from '../../components/Buttons/StatusButton/StatusButton'
import { useActionStore } from '../../store'
import { DefaultAction, FieldRowType } from '../../utils/types'

export const FieldRow = ({ label, value, pid, isArticle, isAbstract }: FieldRowType) => {
  const { getDetailActions } = useActionStore()
  if (label === 'Email') {
    value = (
      <a className="value" href={`mailto:${value}`}>
        {value}
      </a>
    )
  } else if (label === 'Status' && isArticle !== undefined && isAbstract !== undefined) {
    let actions: any = []
    actions = getDetailActions(pid, isArticle, isAbstract)

    //Remove current status from list of status actions
    const index = actions
      .map((actions: DefaultAction) => actions.action.toUpperCase())
      .indexOf(String(value))
    actions.splice(index, 1)

    value = <StatusButton actions={actions} value={String(value)} />
  } else {
    value = <span className="value">{value}</span>
  }

  return (
    <div className="item">
      <span className="label">{label}</span>
      {value}
    </div>
  )
}
