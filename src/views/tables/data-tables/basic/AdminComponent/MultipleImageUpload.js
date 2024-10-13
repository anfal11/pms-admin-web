import { useState, useEffect } from 'react'
import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import useJwt from '@src/auth/jwt/useJwt'
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import { XCircle } from 'react-feather'
import { Error, ErrorMessage } from '../../../../viewhelper'

const MultipleFileUploader = ({ Image_Urls, setImage_Urls, mobile_img }) => {
    const [previewArr, setPreviewArr] = useState([])

    // useEffect(() => {
    //     console.log(Image_Urls)
    // }, [Image_Urls])

    const uppy = new Uppy({
        meta: { type: 'avatar' },
        autoProceed: true,
        restrictions: { maxNumberOfFiles: 10, allowedFileTypes: ['image/*'] },
        onBeforeUpload: (files) => {
            // console.log(Object.values(files).map(x => x.data))
            const FileObjects = Object.values(files).map(x => x.data)
            FileObjects.forEach(element => {
                if (mobile_img) {
                    let img = HTMLImageElement
                    img = document.createElement("img")
                    img.onload = async function () {
                      console.log({ width: img.width, height: img.height })
                      if ((img.width / img.height) === 4) {
                            const formData1 = new FormData()
                            formData1.append('image', element)
                            useJwt.singleFileupload(formData1).then(res => {
                            // console.log(res.data.payload)
                            setImage_Urls(x => [...x || [], res.data.payload])
                            }).catch(e => {
                                console.log(e.response)
                                ErrorMessage(e)
                            })
                        } else {
                            console.log('Invalid mobile ratio! please check the ratio')
                            ErrorMessage({response : {status: 400, data: {message: 'Invalid mobile ratio! please check the image ratio'}}})
                        }
                    }
                    img.src = URL.createObjectURL(element)
                } else {
                    const formData1 = new FormData()
                    formData1.append('image', element)
                    useJwt.singleFileupload(formData1).then(res => {
                    // console.log(res.data.payload)
                    setImage_Urls(x => [...x, res.data.payload])
                    }).catch(e => {
                        console.log(e.response)
                        ErrorMessage(e)
                    })
                }
            })
        }
    })

    // uppy.use(thumbnailGenerator)
    // uppy.on('thumbnail:generated', (file, preview) => {
    //     // console.log(file)
    //     const arr = previewArr
    //     arr.push(preview)
    //     setPreviewArr([...arr])
    // })

    const renderPreview = () => {
        if (Image_Urls?.length) {
            return Image_Urls.map((src, index) => <div key={index} className="d-flex flex-column">
                <img className='rounded mt-2 mr-1' src={src} alt='avatar' height={150} />
                <div className="text-center" style={{ marginTop: '5px' }}>
                    <XCircle size={18}
                        color='red'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => setImage_Urls(Image_Urls.filter((img, i) => i !== index))}
                    />
                </div>
            </div>)
        } else {
            return null
        }
    }

    return (
        <>
            <DragDrop uppy={uppy} />
            <div className="d-flex flex-wrap">
                {renderPreview()}
            </div>
        </>
    )
}

export default MultipleFileUploader