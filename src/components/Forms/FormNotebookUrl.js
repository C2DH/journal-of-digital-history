import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form , Button} from 'react-bootstrap'
import { Link2 } from 'react-feather'

const FormNotebookUrl = ({initialValue = '', onSubmit}) => {
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
      onSubmit({
        value,
        domain,
        proxyValue: `/proxy-githubusercontent/${username}/${repo}/${filepath}`,
        origin: 'github'
      })
    } else {
      // error
      console.warn('Origin is not fully supported, things can go wrong... value:', value)
      onSubmit({ value, origin: 'unknown' })
    }
    e.preventDefault();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-5 mb-3" controlId="">
        <Form.Label>{t('forms.FormNotebookUrl.notebookUrl')}</Form.Label>
        <Form.Control
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          type="url"
          placeholder="https://"
        />
        <Form.Text className="text-muted" dangerouslySetInnerHTML={{
          __html: t('forms.FormNotebookUrl.notebookUrlDescription')
        }}/>
        <p className="mt-2">
          Check our notebooks
          <Button className="d-inline mx-2" variant="link" onClick={() => setValue("https://github.com/C2DH/jdh-notebook/blob/master/author_guideline_template.ipynb")}>
            guideline template
          </Button>
          or
          <Button className="d-inline mx-2" variant="link" onClick={() => setValue("https://github.com/C2DH/jdh-notebook/blob/master/examples/cite_figures.ipynb")}>
            how to cite figures
          </Button>
        </p>


      </Form.Group>
      <Button onClick={handleSubmit}
        variant="primary" type="submit"
        style={{
          borderRadius: '1.25rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <span className="mr-2">{t('FormNotebookUrl_GenerateLink')}</span>
        <Link2 size="16"/>
      </Button>

    </Form>
  )
}

export default FormNotebookUrl
