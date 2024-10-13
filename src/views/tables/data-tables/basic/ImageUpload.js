import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { API_BASE_URL } from '../../../../Configurables'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 6
  if (!isLt2M) {
    message.error('Image must smaller than 6MB!')
  }
  return isJpgOrPng && isLt2M
}

function Avatar (props) {

    const [state, setState] = useState({
        loading: false
    })

 const handleChange = info => {
    if (info.file.status === 'uploading') {
      setState({...state, loading: true })
      return 0
        }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
          setState({...state, imageUrl, loading: false})
          props.parentCallback(info.file.originFileObj, imageUrl)
        })
    }
  }

  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <div className="imageupload" >
     <Upload
    name="avatar"
    listType="picture-card"
    className="avatar-uploader"
    showUploadList={false}
    action={`${API_BASE_URL}/fackupload`}
    beforeUpload={beforeUpload}
    onChange={handleChange}
  >

    {props.imgurl || (state.imageUrl && !props.imageclear2) ? <img src={props.imgurl || state.imageUrl} alt="avatar" style={{ width: '100%', maxHeight: '120px'}} /> : uploadButton}
  </Upload>
  </div>
)

}

export default Avatar