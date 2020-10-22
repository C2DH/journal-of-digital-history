import React, { Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {Row, Col, Button} from 'react-bootstrap'
import FormGroupWrapper from './FormGroupWrapper'
import arrayMove from 'array-move';

const FormAuthorItem = ({ index, author }) => {
  const handleChange = ({ id, value, isValid }) => {
    console.info('FormAuthorItem handleChange', { id, value, isValid })
  }
  return (
    <div className="d-flex">
      <div className="p-3 mb-2 border bg-white shadow-sm w-100" style={{borderRadius: '4px'}}>
        <Row>
          <Col><FormGroupWrapper
            id='firstname'
            schemaId='#/properties/authors/items/anyOf/author/properties/firstname'
            label='pages.abstractSubmission.authorFirstName' ignoreWhenLengthIslessThan={5}
            onChange={handleChange}
          /></Col>
          <Col>
          <FormGroupWrapper
            id='lastname'
            schemaId='#/properties/authors/items/anyOf/author/properties/lastname'
            label='pages.abstractSubmission.authorLastName' ignoreWhenLengthIslessThan={5}
            onChange={handleChange}
          /></Col>
        </Row>
        <Row>
        <Col>
          <FormGroupWrapper placeholder='your email' type='email'
            id='email'
            schemaId='#/properties/authors/items/anyOf/author/properties/email'
            label='pages.abstractSubmission.authorEmail' ignoreWhenLengthIslessThan={5}
            onChange={handleChange}
          />
          </Col>
          <Col>
            <FormGroupWrapper
              id='affiliation'
              schemaId='#/properties/authors/items/anyOf/author/properties/affiliation'
              label='pages.abstractSubmission.authorAffiliation' ignoreWhenLengthIslessThan={5}  
              onChange={handleChange}
            />
            </Col>
        </Row>
      </div>
      <div class="flex-shrink-1 ml-2">remove {index}</div>
    </div>
  )
}

class Author {
  constructor({ firstname = '', lastname = '', email = '', affiliation = '', id } = {}) {
    this.id = id
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.affiliation = affiliation
  }
}

const SortableItem = SortableElement(({value}) => (<FormAuthorItem index={value.index} author={value.author} />))

const SortableList = SortableContainer(({ items, onChange }) => {
  const handleClick = () => {
    onChange({ items: items.concat(new Author({ id: items.length + 1})) })
  }
  return (
    <div>
      {items.map((author, index) => (
        <SortableItem key={`item-${author.id}`} index={index} value={{ index, author }}/>
      ))}
      <div className="text-center"><Button size="sm" variant="secondary" onClick={handleClick}>add another author</Button></div>
    </div>
  );
});

class FormAuthorsList extends Component {
  state = {
    items: [new Author({ id: 1 })],
  };
  handleSortEnd = ({oldIndex, newIndex}) => {
    console.info(oldIndex, newIndex)
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };
  handleChange = (event) => {
    this.setState(({items}) => ({
      items: event.items
    }));
  }
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.handleSortEnd} onChange={this.handleChange}/>;
  }
}

export default FormAuthorsList