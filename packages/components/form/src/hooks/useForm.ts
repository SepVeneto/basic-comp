import { formContextKey, formItemContextKey } from '../constants'
import { inject } from 'vue'

export function useForm() {
  const form = inject(formContextKey, undefined)
  const formItem = inject(formItemContextKey, undefined)
  return {
    form,
    formItem,
  }
}
