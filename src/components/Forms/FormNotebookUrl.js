import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form , Button} from 'react-bootstrap'

const FormNotebookUrl = ({initialValue = '', onChange}) => {
  const { t } = useTranslation()
  const [value, setValue] = useState(initialValue)
  const handleSubmit = (e) => {
    const isGithub = value.match(/https?:\/\/(github\.com|raw\.githubusercontent\.com)\/([A-Za-z0-9-_]+)\/([A-Za-z0-9-_]+)\/(blob\/)?(.*)/)
    if (isGithub) {
      const [, domain, username, repo,, filepath] = isGithub
      console.info('isGithub', isGithub)
      // use JDH proxy url
      // // rewrite URL from
      // https://github.com/C2DH/jdh-notebook/blob/features/template/author_guideline_template.ipynb
      // to
      // https://raw.githubusercontent.com/C2DH/jdh-notebook/features/template/author_guideline_template.ipynb
      // /proxy-githubusercontent/C2DH/jdh-notebook/features/template/author_guideline_template.ipynb
      onChange({
        value,
        domain,
        proxyValue: `/proxy-githubusercontent/${username}/${repo}/${filepath}`,
        origin: 'github'
      })
    } else {
      onChange({ value, origin: 'unknown' })
    }
    e.preventDefault();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="my-5" controlId="formBasicEmail">
        <Form.Label>Public notebook url</Form.Label>
        <Form.Control
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          type="url"
          placeholder="https://"
        />
        <Form.Text className="text-muted">
          {t('FormNotebookUrl_HelpText')}
        </Form.Text>
        <Button variant="link" onClick={() => setValue("https://github.com/C2DH/jdh-notebook/blob/features/template/author_guideline_template.ipynb")}>
          use guideline template
        </Button>
      </Form.Group>
      <Button onClick={handleSubmit} className="border border-dark" variant="primary" type="submit">
        {t('FormNotebookUrl_GenerateLink')}
      </Button>
    </Form>
  )
}

export default FormNotebookUrl
