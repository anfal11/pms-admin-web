import React, { useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import { Slide, toast } from 'react-toastify'
import useJwt from '@src/auth/jwt/useJwt'
import { Camera } from 'react-feather'
import { Error } from '../../viewhelper'

const ProductImgUpload = ({ fileUrls, setFileUrls, state, setState, setimgUpLoading }) => {
    // const [fileUrls, setFileUrls] = useState([])
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }
    // const [state, setState] = useState({
    //     previewVisible: false,
    //     previewImage: '',
    //     previewTitle: '',
    //     fileList: []
    // })
    const { previewVisible, previewImage, fileList, previewTitle } = state
    const handleCancel = () => setState({ ...state, previewVisible: false })

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setState({
            ...state,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        })
    }
    const handleChange = ({ fileList, file }) => {
        // console.log(fileList, fileUrls)
        if (file.size / 1024 / 1024 > 2) {
            return 0
        }
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            return 0
        }
        setFileUrls(fileUrls.filter(a => fileList.some(b => a.uid === b.uid)))
        setState({ ...state, fileList: fileList.filter(x => x.type.includes('image')) })
    }
    const uploadButton = (
        <div className='text-center p-1' style={{ height: '102px', width: '102px' }}>
            <span ><Camera size={20} className='my-1' /></span> <br />
            <span>Add Image</span>
        </div>
        // <div>
        //     <PlusOutlined />
        //     <div style={{ marginTop: 8 }}>Upload</div>
        // </div>
    )
    const props = {
        beforeUpload: file => {
            const isLt2M = file.size / 1024 / 1024 < 2
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                toast.error(`${file.name} is not a Image file`)
            } else if (!isLt2M) {
                toast.error('Image must smaller than 2MB!')
            } else {
                const formData = new FormData()
                formData.append('image', file)
                setimgUpLoading(true)
                useJwt.singleFileupload(formData).then(res => {
                    // alert("upload done")
                    setimgUpLoading(false)
                    setFileUrls([
                        ...fileUrls,
                        {
                            uid: file.uid,
                            name: 'image.png',
                            status: 'done',
                            type: "image/jpeg",
                            url: res.data.payload
                        }
                    ])
                }).catch(err => {
                    setimgUpLoading(false)
                    console.log(err)
                    Error(err)
                })
                return isJpgOrPng && isLt2M
            }
        }
    }
    return (
        <>
            <Upload
                {...props}
                action={`${window.API_BASE_URL}/api/fackupload`}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default ProductImgUpload