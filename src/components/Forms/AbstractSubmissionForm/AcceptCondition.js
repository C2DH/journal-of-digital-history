import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import LangLink from '../../LangLink'

const AcceptConditionSection = ({ handleChange, temporaryAbstractSubmission }) => {
  const { t } = useTranslation()

  return (
    <>
        <Form.Group
            size='md'
            onChange={(e) =>
            handleChange({
                id: 'acceptConditions',
                value: e.target.checked,
                isValid: e.target.checked,
            })
            }
            controlId='formBasicCheckbox'
        >
            <Form.Check size='md'>
            <Form.Check.Input
                type='checkbox'
                defaultChecked={temporaryAbstractSubmission.acceptConditions}
            />
            <Form.Check.Label>
                <span
                dangerouslySetInnerHTML={{
                    __html: t('labels.acceptConditions'),
                }}
                />
                &nbsp;
                <LangLink to='/terms' target='_blank'>
                Terms of Use
                </LangLink>
            </Form.Check.Label>
            </Form.Check>
        </Form.Group>
    </>
  )
}

export default AcceptConditionSection