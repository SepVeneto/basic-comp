import type { ExtractPropTypes, PropType } from 'vue'
import type { UploadRequestOptions } from 'element-plus'

export type UploadCallbackType = File | UploadRequestOptions | FormData
type UploadApiFn<T extends UploadCallbackType> = (data: T) => Promise<any>
type UploadApi = UploadApiFn<File> | UploadApiFn<UploadRequestOptions> | UploadApiFn<FormData>
export const uploadProps = {
  /**
   * 是否展示
   */
  modelValue: Boolean,
  /**
   * 调用模板的下载接口
   */
  templateApi: Function as PropType<() => void>,
  /**
   * 调用文件的上传接口
   */
  uploadApi: Function as PropType<UploadApi>,
  callbackType: {
    type: String,
    default: 'form',
  },
  drag: {
    type: Boolean,
    default: true,
  },
  noFooter: {
    type: Boolean,
    default: true,
  },
  manualUpload: Boolean,
  title: {
    type: String,
    default: '文件导入',
  },
  accept: {
    type: String,
    default: '.xlsx,.xls',
  },
  limit: {
    type: Number,
    default: 1,
  },
}

export type UploadProps = ExtractPropTypes<typeof uploadProps>
