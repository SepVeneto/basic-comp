import MarkdownItContainer from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'
import { createDemoContainer } from './demo'

export const mdPlugin = (md: MarkdownIt) => {
  md.use(MarkdownItContainer, 'demo', createDemoContainer(md))
}
