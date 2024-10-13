import useJwt2 from '@src/auth/jwt/useJwt2'
import { Upload, message } from 'antd'
import React, { useState } from 'react'

const ImageUpload = ({filePrevw2 = null, setFile}) => {

    const [fileList, setFileList] = useState(filePrevw2 ? [{uid: '1', status: 'done', url: filePrevw2}] : [])

      const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList)
      }

      const onPreview = async (file) => {
        let src = file.url
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file.originFileObj)
            reader.onload = () => resolve(reader.result)
          })
        }
        const image = new Image()
        image.src = src
        const imgWindow = window.open(src)
        imgWindow?.document.write(image.outerHTML)
      }

      const handleUpload = async ({ file, onSuccess, onError, onProgress  })  => {

                const formData = new FormData()
                formData.append('image', file)
                const onUploadProgress = data => {
                    const loading = Math.round((100 * data.loaded) / data.total)
                    onProgress({percent: loading})
                }

                useJwt2.singleFileupload(formData, { onUploadProgress }).then(res => {
                    if (res.data.payload) {
                        setFile(res.data.payload.image_url)
                        onSuccess(res.data.payload)
                    } else {
                        const error_data = {
                            response: {
                                status: 400,
                                data: {
                                    message: "File uploading error,Try again !"
                                }
                            }
                        }
                        Error(error_data)
                        onError('File uploading error,Try again !')
                    }

                }).catch(e => {

                    console.log(e.response)
                    Error(e)
                    onError('File uploading error,Try again !')
                })
      }
      const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!')
        }
        return isJpgOrPng && isLt2M
      }

      const props = {
            multiple:false,
            maxCount:1,
            listType:"picture-card",
            fileList,
            onChange,
            onPreview,
            beforeUpload,
            customRequest: handleUpload,
            progress: {
                format: (percent) => {
    
                    return percent && `${parseFloat(percent.toFixed(2))}%`
                }
              }
      }

      return (
        // <ImgCrop rotationSlider>
          <Upload {...props}>+ Upload</Upload>
        // </ImgCrop>
      )
}

export default ImageUpload