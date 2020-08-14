import React from 'react';
import { RemirrorProvider, useManager, useRemirror } from 'remirror/react';
import { CorePreset } from 'remirror/preset/core';
import { BoldExtension } from 'remirror/extension/bold';
import { ItalicExtension } from 'remirror/extension/italic';
import { UnderlineExtension } from 'remirror/extension/underline';
import { HeadingExtension } from 'remirror/extension/heading';
import { ListItemExtension } from "remirror/preset/list";
import { Container, Row, Col } from 'react-bootstrap';
import EditorTableOfContents from '../EditorTableOfContents';
import styles from './EditorWrapper.module.scss';

const Menu = () => {
  const { commands, active } = useRemirror({ autoUpdate: true });

  return (
    <div>
      <div className="btn-group" role="group" aria-label="Bold, Italic, Underlined">
        <button
          className="btn btn-light"
          onClick={() => commands.toggleBold()}
          style={{ fontWeight: active.bold() ? 'bold' : undefined }}
        >
          B
        </button>
        <button
          className="btn btn-light"
          onClick={() => commands.toggleItalic()}
          style={{ fontWeight: active.italic() ? 'bold' : undefined }}
        >
          I
        </button>
        <button
          className="btn btn-light"
          onClick={() => commands.toggleUnderline()}
          style={{ fontWeight: active.underline() ? 'bold' : undefined }}
        >
          U
        </button>
      </div>
    </div>
  );
};


const Editor = () => {
  const { getRootProps } = useRemirror();
  return <div className={`shadow-sm ${styles.editor}`} {...getRootProps()} />;
};

export default function EditorWrapper() {
  const manager = useManager([
    new CorePreset(),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new HeadingExtension(),
    new ListItemExtension(),
  ]);

  return (
    <RemirrorProvider manager={manager}>
      <Container>
        <Row>
          <Col>
            <Menu />
            <Editor />
          </Col>
          <Col md="4" className="col-xxl-3">
            <EditorTableOfContents />
          </Col>
        </Row>
      </Container>
    </RemirrorProvider>
  );
};
