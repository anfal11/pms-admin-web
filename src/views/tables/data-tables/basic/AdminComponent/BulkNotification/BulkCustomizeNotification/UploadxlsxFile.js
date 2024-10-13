import React, { Fragment, useEffect, useState } from 'react'
import { FileText, UploadCloud } from 'react-feather'
import { Link } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { FILE_UPLOAD_BASE_URl } from "../../../../../../../Configurables"
import { Upload, message, Progress } from "antd"
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import "antd/dist/antd.css"
import socketIOClient from "socket.io-client"
import XLSX from 'xlsx'

let socket = null, fileObj = null
const { Dragger } = Upload

const UploadFile = ({ setcustomcodecsvurl, handleFile, flag }) => {

    const [isCancel, setisCancel] = useState(false)
    const [ipAddress, setIPAddress] = useState(Math.floor(100000 + (Math.random() * 900000)))
    const [percent, setpercent] = useState(null)

    const readChunk = (chunk) => {
        return new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = (event) => {
                const arrayBuffer = event.target.result
                resolve(arrayBuffer)
            }

            reader.readAsArrayBuffer(chunk)
        })
    }

    useEffect(() => {
        socket = socketIOClient(`${FILE_UPLOAD_BASE_URl}/bulk-sms-file-upload`, {
            extraHeaders: {
                Authorization: localStorage.getItem('accessToken') // Replace YOUR_TOKEN with the actual token value
            },
            reconnectionAttempts: 3,
            reconnectionDelay: 1000, // in milliseconds
            reconnectionDelayMax: 5000 // in milliseconds
        })

        const chunkSize = 131072
        socket.on('disconnect', () => {
            console.log('Socket disconnected=>')
            fileObj = null
            // Handle file upload stop or pause logic here
        })
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIPAddress(data.ip))
            .catch(error => {
                console.log(error)
            })

        socket.on('MoreData', async ({ Percent, Place }) => {

            if (fileObj) {
                const start = Place
                // onProgress({ percent: Percent })
                setpercent(parseFloat(Percent.toFixed(2)))
                const end = Math.min(start + chunkSize, fileObj.file.size)
                const chunk = fileObj.file.slice(start, end)
                const arrayBuffer = await readChunk(chunk)
                if (fileObj) {
                    socket.emit('Upload', { Name: fileObj.Name, Data: arrayBuffer, Place: end })
                }
            } else {
                console.log('File Object Not Found')
            }
        })
        // CLEAN UP THE EFFECT
        return () => {
            console.log('socket-disconnect => useEffect[]')
            return socket.disconnect()
        }
    }, [])

    useEffect(() => {

        console.log('isCancel => ', isCancel)

        if (isCancel) {

            socket.disconnect()
            socket.connect()

            console.log('socket-reconnect => ')
            setisCancel(false)
        }

    }, [isCancel])

    const handleFileChange = (info) => {

        if (info.file.status === 'uploading') {
            setisCancel(false)
        } else if (info.file.status === 'done') {
            message.success(`${info.file.name} uploaded successfully`)
            // handleFile(info.file.originFileObj)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload failed`)
            setcustomcodecsvurl(null)
            fileObj = null
            setpercent(0)
        } else if (info.file.status === 'removed') {
            setisCancel(true)
            setcustomcodecsvurl(null)
            fileObj = null
            setpercent(0)
        }
    }

    const handleBeforeUpload = (file) => {

        console.log('handleBeforeUpload file ', file)

        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        if (!isXLSX) {
            message.error('You can only upload XLSX files!')
        }

        return isXLSX
    }

    const handleChunkUpload = async ({ file, onSuccess, onError, onProgress }) => {
        setcustomcodecsvurl(null)
        const File = file
        let { name } = File
        const { size } = File
        console.log('size => ', size)
        name = `${ipAddress}_${File.uid}_${name}`
        name = name.split(' ').join('_')

        fileObj = { Name: name, file }
        socket.emit('Start', { Name: name, Size: size })

        socket.on("Done", data => {
            onProgress({ percent: 100 })
            setpercent(100)
            console.log("File uploaded successfully, access url: ", data['file_access_url'])
            setcustomcodecsvurl(data['file_access_url'])
            onSuccess(data)
            setisCancel(true)
            fileObj = null
        })

        socket.on('uploadError', (message) => {
            setcustomcodecsvurl(null)
            onError(message)
            fileObj = null
            setpercent(null)
        })

    }

    const props = {
        accept: ".xlsx",
        name: 'file',
        multiple: false,
        maxCount: 1,
        beforeUpload: handleBeforeUpload,
        customRequest: handleChunkUpload,
        onChange: handleFileChange,
        progress: {
            format: () => percent && `${parseFloat(percent.toFixed(2))}%`
        }
    }

    return (
        <Fragment>
            {
                flag === 1 ? <Row className='pb-2'>
                    <Col sm='12' className='text-right mb-1'>
                        <Link to="/bulk_sms.xlsx" target="_blank" download>
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
                                Bulk-SMS File upload.
                            </p>
                        </Dragger>
                        {/* <Progress percent={percent || 0}  /> */}
                    </Col>
                </Row> : <Row className='pb-2'>
                    <Col sm='12' className='text-right mb-1'>
                        <Link to="/bulk_email.xlsx" target="_blank" download>
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
                                Bulk-Email File upload.
                            </p>
                        </Dragger>
                        {/* <Progress percent={percent || 0}  /> */}
                    </Col>
                </Row>
            }
        </Fragment>
    )
}

export default UploadFile