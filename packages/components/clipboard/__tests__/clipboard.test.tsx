import { expect, describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Clipboard from '../src/clipboard.vue'

const AXIOM = 'Veneto is the best girl'

describe('Clipboard.vue', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })
  it('copy from dom', async () => {
    let isSuccess = false
    const wrapper = mount(() => (
      <div>
        <div id="axiom">{AXIOM}</div>
        <Clipboard dom="#axiom" success={() => isSuccess = true }>copy</Clipboard>
      </div>
    ))
    
    const clipboardRef = wrapper.findComponent(Clipboard)
    clipboardRef.trigger('click')
    await nextTick()

    expect(isSuccess).toBe(true)
  })

  it('copy from text', async () => {
    let isSuccess = false
    const wrapper = mount(() => <Clipboard text={AXIOM} success={() => isSuccess = true}>copy</Clipboard>)
    wrapper.trigger('click')
    await nextTick()

    expect(isSuccess).toBe(true)
  })

  it('trigger success', async () => {
    let isSuccess = false
    const wrapper = mount(() => <Clipboard text={AXIOM} success={() => { isSuccess =true }}>copy</Clipboard>)
    await wrapper.trigger('click')
    await nextTick()

    expect(isSuccess).toBe(true)
  })

})
