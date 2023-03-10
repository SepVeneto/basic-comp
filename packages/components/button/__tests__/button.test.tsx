import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Button from '../src/button'
import { Edit as EditIcon } from '@element-plus/icons-vue'

const AXIOM = 'Veneto is the best girl'

describe('Button.vue', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })
  it('create', () => {
    const wrapper = mount(() => <Button type="primary" />)
    expect(wrapper.classes()).toContain('el-button--primary')
  })

  it('confirm', async () => {
    const wrapper = mount(() => <Button confirm />)
    await wrapper.trigger('click')

    const msgBox = document.querySelector('.el-overlay') as HTMLElement

    expect(msgBox).toBeDefined()

    await nextTick()

    expect(msgBox.querySelector('.el-message-box__title span').textContent).toEqual('警告')
    expect(msgBox.querySelector('.el-message-box__message p').textContent).toEqual('此操作无法撤销，是否继续？')

    const btn = msgBox.querySelector('.el-button--primary') as HTMLButtonElement
    btn.click()
    await nextTick()
    expect(msgBox.style.display).toBe('none')
  })

  it('set confirm message', async () => {
    const wrapper = mount(() => <Button confirm={AXIOM} />)
    await wrapper.trigger('click')

    const msgBox = document.querySelector('.el-overlay')
    await nextTick()
    expect(msgBox.querySelector('.el-message-box__message p').textContent).toEqual(AXIOM)
  })

  it('type danger', async () => {
    const wrapper = mount(() => <Button type="danger" />)

    expect(wrapper.classes()).toContain('el-button--danger')
    await wrapper.trigger('click')

    const msgBox = document.querySelector('.el-overlay') as HTMLElement
    expect(msgBox).toBeDefined()
  })

  it('button click trigger', async () => {
    let isTrigger = false
    const wrapper = mount(() => <Button confirm onClick={() => {
      isTrigger = true;
    }}/>)
    await wrapper.trigger('click')
    await nextTick()

    const msgBox = document.querySelector('.el-overlay') as HTMLElement
    const btn = msgBox.querySelector('.el-button--primary') as HTMLButtonElement
    btn.click()
    await rAF()
    expect(isTrigger).toBe(true)
  })

  it('reject', async () => {
    let isTrigger = false
    const wrapper = mount(() => <Button confirm onClick={() => { isTrigger = true }}/>)
    await wrapper.trigger('click')
    await nextTick()

    const btn = document.querySelector('.el-message-box__btns .el-button') as HTMLButtonElement
    btn.click()
    expect(isTrigger).toBe(false)
  })

  it('icon tooltip', async () => {
    const wrapper = mount(() => <Button tooltip icon={EditIcon}>{AXIOM}</Button>)
    await nextTick()
    const triggerBox = wrapper.element.querySelector('.el-tooltip__trigger')
    expect(triggerBox).toBeDefined()

    await wrapper.trigger('mouseenter')

    const popper = document.querySelector('.el-popper')
    expect(popper.textContent).toBe(AXIOM)
  })

  it('mini button', async () => {
    const wrapper = mount(() => <Button mini icon={EditIcon} />)
    expect(wrapper.classes()).toContain('mini')
  })
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null)
        await nextTick()
      })
    })
  })
}