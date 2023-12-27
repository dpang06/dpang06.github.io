import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import homeMarkdown from './home.md';

export const HomePage = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(homeMarkdown)
      .then((resp) => resp.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div>
      <Markdown>{markdown}</Markdown>
    </div>
  )
}
