import React from 'react'
import { Container } from "react-bootstrap";
import EditorWrapper from '../components/EditorWrapper'

export default function Home(){
  return (
    <div>
      <Container>
        <h1>A simple editor</h1>
      </Container>
      <EditorWrapper />
    </div>
  );
}
