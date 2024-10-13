import React, { Fragment, useEffect, useState } from 'react'
import { FileText, UploadCloud } from 'react-feather'
import { Link } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { FILE_UPLOAD_BASE_URl } from "../../../Configurables"
import { Upload, message } from "antd"
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import "antd/dist/antd.css"
import socketIOClient from "socket.io-client"

const { Dragger } = Upload

const UploadVoucherCustomCode = ({setcustomcodecsvurl}) => {

    const [isCancel, setisCancel] = useState(false)
    const [ipAddress, setIPAddress] = useState(Math.floor(100000 + (Math.random() * 900000)))

    const socket = socketIOClient(`${FILE_UPLOAD_BASE_URl}/voucher-custom-code`, {
        extraHeaders: {
          Authorization: localStorage.getItem('accessToken') // Replace YOUR_TOKEN with the actual token value
        }
    })

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIPAddress(data.ip))
            .catch(error => {
                console.log(error)
            })
    }, [])

    console.log('ipAddress ', ipAddress)

    useEffect(() => {
        // const socket = socketIOClient('http://localhost:5001/fsapi/voucher-custom-code', {
        //     extraHeaders: {
        //       Authorization: localStorage.getItem('accessToken') // Replace YOUR_TOKEN with the actual token value
        //     }
        //   })

        if (isCancel) {

            socket.disconnect()
            socket.connect()
        }
 
        // CLEAN UP THE EFFECT
        return () => socket.disconnect()

    }, [isCancel])

    const handleFileChange = (info) => {
        console.log('info ', info)
        if (info.file.status === 'uploading') {
            setisCancel(false)
        } else if (info.file.status === 'done') {
          message.success(`${info.file.name} uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} upload failed`)
        } else if (info.file.status === 'remove') {
            setisCancel(true)
            setcustomcodecsvurl(null)
        }
      }

    const handleBeforeUpload = (file) => {

        console.log('handleBeforeUpload file ', file)

        //file.chunkCount = totalChunks
    
        return true
    }

    const handleChunkUpload = async ({ file, onSuccess, onError, onProgress  }) => {
        setcustomcodecsvurl(null)
        const File = file
        const FReader = new FileReader()
        let { name } = File
        const { size } = File
        name = `${ipAddress}_${File.uid}_${name}`
        name = name.split(' ').join('_')

        FReader.onload = (evnt) => {
            console.log('evnt ')
            socket.emit('Upload', { Name: name, Data: evnt.target.result })
        }

        socket.emit('Start', { Name: name, Size: size })

        socket.on('MoreData', function (data) {
            // UpdateBar(data['Percent'])
                onProgress({ percent: data['Percent'] })
                const Place = data['Place'] * 131072 //The Next Blocks Starting Position
                // const NewFile //The constiable that will hold the new Block of Data
                const NewFile = File.slice(Place, Place + Math.min(131072, (File.size - Place)))
                FReader.readAsBinaryString(NewFile)
        })

        socket.on("Done", data => {
            //UpdateBar(data['Percent'])
            onProgress({ percent: 100 })
            //setproduct_video_link(data['file_access_url'])
            console.log("File uploaded successfully, access url: ", data['file_access_url'])
            setcustomcodecsvurl(data['file_access_url'])
            onSuccess(data)
        })

        socket.on('uploadError', (message) => {
            setcustomcodecsvurl(null)
            onError(message)
        })

    }

    const props = {
        accept: ".csv",
        name: 'file',
        multiple: false,
        maxCount: 1,
        beforeUpload: handleBeforeUpload,
        customRequest: handleChunkUpload,
        progress: {
            format: (percent) => {

                return percent && `${parseFloat(percent.toFixed(2))}%`
            }
          },
          onChange: handleFileChange
    }

    return (
        <Fragment>
                <Row className='pb-2'>
                    <Col sm='12' className='text-right mb-1'>
                        <Link to="/voucher-custom-code.csv" target="_blank" download>
                            <div className='d-flex align-items-center justify-content-end'>
                                <FileText size='17px' color='#006496' style={{ marginRight: '5px' }} />
                                <h6 className='text-primary m-0'>DOWNLOAD TEMPLATE</h6>
                            </div>
                        </Link>
                    </Col>
                    <Col sm='12'>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <UploadCloud />
                            </p>
                            <p className="ant-upload-text">  Click / Drag file to this area to upload<span style={{ color: 'red' }}>*</span></p>
                            <p className="ant-upload-hint">
                                Voucher Custom Code upload.
                            </p>
                        </Dragger>
                    </Col>
                </Row>
        </Fragment>
    )
}

export default UploadVoucherCustomCode