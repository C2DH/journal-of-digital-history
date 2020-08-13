import React from 'react';
import { RemirrorProvider, useManager, useRemirror } from 'remirror/react';
import { CorePreset } from 'remirror/preset/core';
import { BoldExtension } from 'remirror/extension/bold';
import { ItalicExtension } from 'remirror/extension/italic';
import { UnderlineExtension } from 'remirror/extension/underline';


const Menu = () => {
  const { commands, active } = useRemirror({ autoUpdate: true });

  return (
    <div>
      <button
        onClick={() => commands.toggleBold()}
        style={{ fontWeight: active.bold() ? 'bold' : undefined }}
      >
        B
      </button>
      <button
        onClick={() => commands.toggleItalic()}
        style={{ fontWeight: active.italic() ? 'bold' : undefined }}
      >
        I
      </button>
      <button
        onClick={() => commands.toggleUnderline()}
        style={{ fontWeight: active.underline() ? 'bold' : undefined }}
      >
        U
      </button>
    </div>
  );
};


const Editor = () => {
  const { getRootProps } = useRemirror();
  return <div {...getRootProps()} />;
};

export default function EditorWrapper() {
  const manager = useManager([
    new CorePreset(),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension()
  ]);

  return (
    <RemirrorProvider manager={manager}>
      <div>
        <Menu />
        <Editor />
      </div>
    </RemirrorProvider>
  );
};
