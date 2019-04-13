import React, { PureComponent } from 'react'
import { Upload as AntUpload, Icon, Modal, Input, message } from 'antd'
import { UploadProps } from 'antd/lib/upload'
import extName from 'ext-name'
import isEqual  from 'lodash/isEqual'

import { FormItemProps } from '../types'
import { wrapField } from './utils'
import Video from './innerComponents/video'

type UploadFile = NonNullable<UploadProps['fileList']>[number]
type UploadStates = {
  fileList: UploadFile[]
  previewUrl: string
  previewVisible: boolean
  previewType: 'image' | 'video'
  preInitialValue?: Array<string>
}
type UploadFileStatus = NonNullable<UploadFile['status']>

/* 支持的文件类型 */
const imageTypes = ['image/png', 'image/jpeg']
const videoTypes = ['video/mp4', 'video/avi', 'video/wmv', 'video/mpeg', 'video/quicktime', 'video/x-ms-wmv']

const getFile = (url: string, status: UploadFileStatus) => {
  const ext = extName(url)[0]

  if (!ext) {
    throw new Error('无法解析的后缀名')
  }

  return {
    uid: '' + Math.random(),
    type: ext.mine,
    name: 'random',
    status,
    size: 0,
    url
  }
}

class Upload extends PureComponent<FormItemProps<'upload'>, UploadStates> {
  constructor (props: FormItemProps<'upload'>) {
    super(props)
    const { config = {} } = props
    const { initialValue = [] } = config
    this.state = {
      fileList: initialValue.map((url: string) => getFile(url, 'success')),
      previewUrl: '',
      previewVisible: false,
      previewType: 'image',
    }
  }

  uidMapUrl: genObject = {}

  static getDerivedStateFromProps (props: FormItemProps<'upload'>, state: UploadStates) {
    const { config = {} } = props
    const { initialValue = [] } = config
    if (
      !isEqual(state.preInitialValue, initialValue)
    ) {
      state.fileList = initialValue.map(url => getFile(url, 'success'))
    }

    state.preInitialValue = initialValue
    return state
  }

  syncInput = (validate: boolean = true) => {
    const input = this.state.fileList.reduce<any[]>((result, file) => {
      if (file.status === 'done')
        result.push(file.url)
      return result
    }, [])
    this.props.form.setFieldsValue({
      [this.props.name]: input
    })
    window.mytest = this.props.form.getFieldsValue
    validate && this.props.form.validateFields([this.props.name])
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file: UploadFile) => {
    const previewType = imageTypes.includes(file.type)
      ? 'image'
      : videoTypes.includes(file.type)
        ? 'video'
        : null
    if (previewType) {
      this.setState({
        previewUrl: file.url || '',
        previewVisible: true,
        previewType
      })
    }
  }

  customRequest = ({
    file, 
    onProgress,
    onSuccess,
    onError
  }: {
    file: UploadFile 
    onProgress: Function
    onSuccess: Function
    onError: Function
  }) => {
    const success = (url: string) => {
      this.uidMapUrl[file.uid] = url
      onSuccess('success')
    }
    const fail = () => {
      onError(new Error('file upload failed'), '文件上传失败')
    }

    /**
     * rc-upload中如果customRequest是同步函数
     * 则onSuccess和onError会先于onStart执行导致错乱
     * 这里必须保证请求时异步的
     */
    setTimeout(() => {
      this.props.config && this.props.config.onUpload && this.props.config.onUpload(file, success, fail, onProgress)
    })
  }

  handleChange = ({
    file,
    fileList
  }: {
    file: UploadFile,
    fileList: UploadFile[]
  }) => {
    fileList = fileList.filter(file => file.status !== undefined)
    if (file.status === 'done') {
      const fileIndex = fileList.findIndex(_file => _file.uid === file.uid)
      if (fileIndex < 0) return
      const mapUrl = this.uidMapUrl[fileList[fileIndex].uid]
      if (mapUrl) {
        fileList[fileIndex].url = mapUrl
      }   
    }
    this.setState({
      fileList
    })
    this.syncInput(true)
  }

  beforeUpload = (file: UploadFile) => {
    const { config = {} } = this.props
    let { maxSize, accept } = config
    accept = accept === 'image' 
      ? imageTypes 
      : accept === 'video'
        ? videoTypes
        : accept
    let passed = true

    if (maxSize && (file.size / 1024 > maxSize)) {
      message.error(`文件超过${maxSize}kb限制`)
      passed = false
    }

    if (accept && !accept.includes(file.type)) {
      message.error(`非法的文件后缀`)
      passed = false
    }
    
    return passed
  }

  renderPreview = (type: UploadStates['previewType'], url: string) => {
    if (type === 'image') {
      return <img alt="example" style={{ width: '100%' }} src={url} />
    }

    if (type === 'video') {
      return <Video url={url} />
    }
  }

  render () {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    const {
      name,
      label,
      props,
      styles = {},
      config = {},
      form: { getFieldDecorator }
    } = this.props

    const {
      initialValue = [],
      rules = [],
      maxNumber = 1,
    } = config

    const {
      fileList,
      previewVisible,
      previewUrl,
      previewType
    } = this.state

    const {
      customRequest,
      handleChange,
      beforeUpload,
      renderPreview,
      handlePreview
    } = this

    return wrapField((
      <div>
        <AntUpload
          listType="picture-card"
          fileList={fileList}
          customRequest={customRequest}
          onChange={handleChange}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          {...props}
        >
          { fileList.length < maxNumber && uploadButton }
        </AntUpload>
        {
          getFieldDecorator(name, {
            initialValue,
            rules
          })(
            <Input hidden placeholder={label} {...props} />
          )
        }
        <Modal destroyOnClose visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          { renderPreview(previewType, previewUrl) }  
        </Modal>
      </div>
    ), styles, name, label)
  }
}

export default Upload