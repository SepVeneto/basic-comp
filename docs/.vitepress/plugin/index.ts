import MarkdownItContainer from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'
import { createDemoContainer } from './demo'
import TableWrapper from './table-wrapper'
import { ApiTableContainer } from './api-table'

export const mdPlugin = (md: MarkdownIt) => {
  md.use(MarkdownItContainer, 'demo', createDemoContainer(md))
  md.use(TableWrapper)
  md.use(ApiTableContainer)
}
