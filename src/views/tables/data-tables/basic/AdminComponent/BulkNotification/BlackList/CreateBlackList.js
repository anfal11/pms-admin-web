import useJwt from '@src/auth/jwt/useJwt'
import '@styles/react/libs/editor/editor.scss'
import { Upload } from "antd"
import "antd/dist/antd.css"
import React, { Fragment, useEffect, useState } from 'react'
import { ChevronLeft, FileText, UploadCloud } from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label, Spinner } from 'reactstrap'
import XLSX from "xlsx"
import { API_BASE_URL } from "../../../../../../../Configurables"
import { Error, Success } from '../../../../../../viewhelper'
const { Dragger } = Upload

const CreateBlackList = () => {
    const history = useHistory()
    const { id } = useParams()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const user = JSON.parse(localStorage.getItem('userData'))
    const [ShowUpload, setShowUpload] = useState(true)
    const [rowNumber, setRowNumber] = useState(0)
    const [userInput, setUserInput] = useState({
        group_name: "",
        black_list_file: ""
      })
    useEffect(() => {
        if (id) {
            useJwt.blackListById(id).then((response) => {
                console.log(response)
                setUserInput({...response.data.payload})
            }).catch((error) => {
                console.log(error.response)
                Error(error)
                console.log(error)
            })
        }
    }, [id])
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const [File, setFile] = useState(null)
    // const [Filename, setFilename] = useState('')
    const handleFile = (file /*:File*/) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader()
        const rABS = !!reader.readAsBinaryString
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" })
            /* Get first worksheet */
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {
                header: 1
            })
            setRowNumber(data.length - 1)
            console.log(
                "data",
                data.map((x) => { return { MSISDN: x[0] } }).filter(y => !!y).splice(1)
            )
            // setModalMSISDN(data.map((x) => { return { MSISDN: x[0] } }).filter(y => !!y).splice(1))
            /* Update state */
            //   this.setState({ data: data, cols: make_cols(ws["!ref"]) })
        }
        if (rABS) reader.readAsBinaryString(file)
        else reader.readAsArrayBuffer(file)
    }

    function beforeUpload(file) {
        console.log(file)
        const isCSV = file.type === 'application/vnd.ms-excel' || file.type === 'text/csv'
        if (!isCSV) {
            toast.error("Only CSV file can be uploaded", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            toast.error("File must smaller than 2MB!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })
        }
        return isCSV && isLt2M
    }

    function getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

    const props = {
        name: 'file',
        multiple: false,
        action: `${API_BASE_URL}/fackupload`,
        beforeUpload,
        async onChange(info) {
            console.log('info', info)
            if (info.file.status === 'uploading') {
                // setloading(true)
                return
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                await getBase64(info.file.originFileObj, imageUrl => {
                    console.log(info.file.originFileObj, imageUrl)
                    handleFile(info.file.originFileObj)
                    setFile(imageUrl)
                })
            } else if (info.file.status === 'error') {
                toast.error(`${info.file.name} file upload failed.`)
            }
        }
    }
    const onSubmit = (e) => {
        e.preventDefault()
        if (!File) {
            return
        }
        console.log({ ...userInput, black_list_file: File })
        setPointRuleloading(true)
        if (id) {
            useJwt.editBlackList({ ...userInput, black_list_file: File }).then((response) => {
                console.log(response)
                setPointRuleloading(false)
                Success(response)
                history.push('/blacklist')
            }).catch((error) => {
                setPointRuleloading(false)
                console.log(error.response)
                Error(error)
                console.log(error)
            })
        } else {
            useJwt.createBlackList({ ...userInput, black_list_file: File }).then((response) => {
                console.log(response)
                setPointRuleloading(false)
                Success(response)
                history.push('/blacklist')
            }).catch((error) => {
                setPointRuleloading(false)
                console.log(error.response)
                Error(error)
                console.log(error)
            })
        }
    }
    const downloadCSV = async () => {
        await useJwt.exportBlackListCSV({id}).then((response) => {
            console.log(response)
            window.location.href = response.data.payload.csv_url
            Success(response)
        }).catch((error) => {
            console.log(error.response)
            Error(error)
            console.log(error)
        })
    }
    return (
        <Fragment>
            {
                user.role === 'vendor' ? <Button.Ripple className='mb-1' color='primary' tag={Link} to='/blackListVendor' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple> : <Button.Ripple className='mb-1' color='primary' tag={Link} to='/blackList' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple>
            }

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{id ? 'Edit Black List' : 'Create Black List'}</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="group_name">Group Name<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text"
                                    name="group_name"
                                    id='group_name'
                                    value={userInput.group_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="group name here..."
                                />
                            </FormGroup>
                        </Col>
                        {
                            id && <Col sm='12'>
                                <div onClick={downloadCSV} className='d-flex align-items-center justify-content-end cursor-pointer'>
                                    <FileText size='17px' color='#006496' style={{ marginRight: '5px' }} />
                                    <h6 className='text-primary m-0'>DOWNLOAD CSV of Existing Black List</h6>
                                </div>
                            </Col>
                        }
                        <Col sm='12' className='mt-1'>
                            <h5 for="group_name">Upload Black List<span style={{ color: 'red' }}>*</span></h5>
                        </Col>
                        <Col sm='12' className='text-right mb-1'>
                                <Link to="/black_list.csv" target="_blank" download>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <FileText size='17px' color='#006496' style={{ marginRight: '5px' }} />
                                        <h6 className='text-primary m-0'>DOWNLOAD TEMPLATE</h6>
                                    </div>
                                </Link>
                            </Col>
                            <Col sm='12'>
                                {/* <FormGroup>
                            <Label>Upload File</Label>
                            <Input type='file'/>
                        </FormGroup> */}
                                {ShowUpload && <Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                        <UploadCloud />
                                    </p>
                                    <p className="ant-upload-text">  Click / Drag file to this area to upload<span style={{ color: 'red' }}>*</span></p>
                                    <p className="ant-upload-hint">
                                        Black list upload.
                                    </p>
                                </Dragger>}
                            </Col>
                        
                        <Col sm="12" className='text-center'>
                            {
                                pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span >{id ? 'Update' : 'Submit'}</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default CreateBlackList