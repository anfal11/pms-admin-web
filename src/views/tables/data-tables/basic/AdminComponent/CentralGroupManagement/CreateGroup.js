import { useRTL } from '@hooks/useRTL'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState, useMemo } from 'react'
import { ChevronLeft, FileText, Search, UploadCloud } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner, Table } from 'reactstrap'
import XLSX from "xlsx"
import { API_BASE_URL } from "../../../../../../Configurables"
import { ExportCSV } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import { Upload } from "antd"
const { Dragger } = Upload
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import "antd/dist/antd.css"
import { toast } from 'react-toastify'
import UploadCsvGroup from './UploadCsvGroup'

const CreateGroup = () => {
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const typeRef = useRef()
    const history = useHistory()
    const [selectRuleProvider, setRuleProvider] = useState({})
    // const [file, setFile] = useState(null)
    const [filePrevw, setFilePrevw] = useState(null)
    const [isRtl, setIsRtl] = useRTL()
    const [divisions, setDivision] = useState([])
    const [districts, setDistrict] = useState([])
    const [thanas, setThana] = useState([])
    const [businessList, setBusinessList] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [cusAgentList, setCusAgentList] = useState([])
    const [countries, setCountries] = useState([])
    const [countryCode, setCountryCode] = useState('')
    const [regions, setRegions] = useState([])
    const [customcodecsvurl, setcustomcodecsvurl] = useState(null)
    const [userInput, setUserInput] = useState({
        group_name: '',
        type: null, //int
        isDefault: false,
        status: true,
        creation_type: 3,
        member_list: [],
        gender: [],
        carrier: [],
        hand_set_type: '',
        age: [],
        division: [],
        location: [],
        religions: [],
        marital_status: [],
        occupation: [],
        branch_name: '',
        ca_sa_product_description: '',
        casa_acct_status: '',
        account_opening_date: "",
        last_login_type: "",
        has_loan: '', //Yes or No
        has_credit_card: '', //Yes or No
        has_debit_card: '', //Yes or No
        customer_type: [],
        connection_type: '',
        income: 0,
        csv_file_name: '',
        objective: ''
    })
    const [searchObj, setSearchObj] = useState({
        division_name: '',
        district_name: '',
        thana_name: '',
        gender_name: '',
        is_agent: 0 //1 for agent, 0 for customer
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    console.log(userInput)

    useEffect(() => {
        // useJwt.countryList().then((response) => {
        //     setCountries(response.data.payload.data)
        //   }).catch((error) => {
        //     Error(error)
        //     console.log(error)
        //   })
        useJwt.BDAddressList().then(res => {
            setDivision(res.data.payload)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
        useJwt.customerBusinessList().then(async res => {
            const { payload } = await res.data
            console.log(payload)
            setBusinessList(payload)
            // setFilteredData(payload)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    // useEffect(() => {
    //     setRegions([])
    //     useJwt.regionList({countryCode}).then((response) => {
    //         setRegions(response.data.payload.data)
    //       }).catch((error) => {
    //         Error(error)
    //         console.log(error)
    //       })
    // }, [countryCode])

    const handleSearch = () => {
        // setPointRuleloading(true)
        // console.log(searchObj)
        setCusAgentList([])
        // useJwt.getCustomerAgentFilter(searchObj).then(res => {
        //     const { payload } = res.data
        //     console.log(res)
        //     setCusAgentList(payload)
        //     setPointRuleloading(false)
        // }).catch(err => {
        //     console.log(err.response)
        //     setPointRuleloading(false)
        //     Error(err)
        // })
    }
    const [ShowUpload, setShowUpload] = useState(true)
    const [rowNumber, setRowNumber] = useState(0)
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
    const onSubmit = async (e) => {
        e.preventDefault()
        if (!customcodecsvurl && userInput.creation_type === 1) {
            Error({response: { status : 404, data: { message: 'Please wait for file upload'} }})
            return 0
        }
        setPointRuleloading(true)
        console.log({ ...userInput, report_file: customcodecsvurl })
        useJwt2.createCentralGroupV2({ ...userInput, report_file: customcodecsvurl }).then((response) => {
            setPointRuleloading(false)

            console.log(response)
            Success(response)
            history.push('/AllCentralGroups')
        }).catch((error) => {
            Error(error)
            setPointRuleloading(false)
            console.log(error.response)
        })
    }
   
    const uploadCsvGroupMemo = useMemo(() => {

        return  userInput.creation_type === 1 ? (
            // <UploadVoucherCustomCode setcustomcodecsvurl={setcustomcodecsvurl}/>
            <UploadCsvGroup setcustomcodecsvurl={setcustomcodecsvurl} handleFile={handleFile}/>
        ) : null
      }, [userInput.creation_type, setcustomcodecsvurl])
    //   userInput.creation_type === 1 &&  
    //   <UploadCsvGroup setcustomcodecsvurl={setcustomcodecsvurl} handleFile={handleFile}/>
      
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/AllCentralGroups' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Create Group</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="group_name">Group Name<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="group_name"
                                        id='group_name'
                                        value={userInput.group_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="group name..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="type">Group Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={typeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        // value={[{ value: 4, label: 'All' }, { value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }].find(i => i.value === userInput.type)}
                                        value={[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }].find(i => i.value === userInput.type)}
                                        onChange={(selected) => {
                                            if (selected.value !== 1 && selected.value !== 2 && selected.value !== 4) {
                                                setUserInput({ ...userInput, type: selected.value, creation_type: 1 })
                                                setCusAgentList([])
                                            } else {
                                                setUserInput({ ...userInput, type: selected.value, creation_type: 2 })
                                                setCusAgentList([])
                                                if (selected.value === 1) {
                                                    setSearchObj({ ...searchObj, is_agent: 0, division_name: '', district_name: '', thana_name: '', gender_name: '' })
                                                } else if (selected.value === 2) {
                                                    setSearchObj({ ...searchObj, is_agent: 1, division_name: '', district_name: '', thana_name: '', gender_name: '' })
                                                }
                                            }
                                        }}
                                        // options={[{ value: 4, label: 'All' }, { value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }]}
                                        // options={[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }]}
                                        options={[{ value: 1, label: 'Customer' }]}
                                    />
                                    {
                                        userInput.type === 4 && <span style={{ fontSize: '12px', color: 'blue' }} className='d-flex justify-content-end'>'All' type targets only agent and customer group.</span>
                                    }
                                </FormGroup>
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => typeRef.current.select.focus()}
                                    value={userInput.type || ''}
                                    onChange={e => ''}
                                />
                            </Col>
                            {/* <Col sm="4" >
                                <FormGroup className='mt-2 text-center'>
                                    <CustomInput
                                        type='switch'
                                        id='isDefault'
                                        name='isDefault'
                                        label='Default'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, isDefault: true })
                                            } else {
                                                setUserInput({ ...userInput, isDefault: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col> */}
                        </Row>
                    </CardBody>
                </Card>
                {
                    (userInput.type) && <>
                        <Row>
                            <Col sm="12" className='mb-1'>
                                <Label className='d-block'><h6>Group Creation<span style={{ color: 'red' }}>*</span></h6></Label>
                                {
                                    (userInput.type === 1 || userInput.type === 2 || userInput.type === 4) && <FormGroup check inline className='mr-3'>
                                        <CustomInput type='radio' name='gp' id='gp' checked={userInput.creation_type === 2} label='Group Profiling'
                                            onChange={() => {
                                                setUserInput({ ...userInput, creation_type: 2 })
                                            }}
                                        />
                                    </FormGroup>
                                }
                                {/* {
                                    userInput.type !== 4 && <FormGroup check inline className='mr-3'>
                                        <CustomInput type='radio' name='abp' id='abp' checked={userInput.creation_type === 3} label='Account Base Profiling'
                                            onChange={() => {
                                                setUserInput({ ...userInput, creation_type: 3 })
                                            }}
                                        />
                                    </FormGroup>
                                } */}
                                <FormGroup check inline>
                                    <CustomInput type='radio' name='bp' id='bp' checked={userInput.creation_type === 1} label='Bulk Upload'
                                        onChange={() => {
                                            setUserInput({ ...userInput, creation_type: 1 })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Card>
                            <CardBody>
                                {
                                    (userInput.creation_type === 3 && userInput.type === 3) && <Row>
                                        <Col sm='12' className='d-flex justify-content-end'>
                                            <Button.Ripple className='text-dark' color='light' onClick={e => {
                                                ExportCSV(businessList.map(cal => { return { MSISDN: cal.v_mobile, EMAIL: cal.email, 'DEVICE ID': '' } }), Object.keys(cusAgentList.map(cal => { return { MSISDN: cal.MobileNumber, EMAIL: cal.Email, 'DEVICE ID': 0 } })[0]), 'Merchant List')
                                            }}
                                            >
                                                Export CSV
                                            </Button.Ripple>
                                        </Col>
                                        <Col sm='12' className='mb-1 mt-1'>
                                            <Row>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Division</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.division_name !== ''}
                                                            value={{ value: searchObj.division_name, label: searchObj.division_name || 'Select...' }}
                                                            onChange={selected => {
                                                                // console.log(selected)
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, division_name: '', district_name: '', thana_name: '' })
                                                                    setDistrict([])
                                                                    setThana([])
                                                                } else {
                                                                    setSearchObj({ ...searchObj, division_name: selected.label, district_name: '', thana_name: '' })
                                                                    setDistrict(selected.value.dis)
                                                                    setThana([])
                                                                }
                                                            }
                                                            }
                                                            options={divisions.map(d => { return { value: { id: d.id, dis: d.districts }, label: d.name } })}
                                                            isLoading={divisions.length === 0}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">District</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.district_name !== ''}
                                                            value={{ value: searchObj.district_name, label: searchObj.district_name || 'Select...' }}
                                                            onChange={selected => {
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, district_name: '', thana_name: '' })
                                                                    setThana([])
                                                                } else {
                                                                    setSearchObj({ ...searchObj, district_name: selected.label, thana_name: '' })
                                                                    setThana(selected.value.thana)
                                                                }
                                                            }}
                                                            options={districts.map(d => { return { value: { id: d.id, thana: d.thana }, label: d.name } })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Thana</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.thana_name !== ''}
                                                            value={{ value: searchObj.thana_name, label: searchObj.thana_name || 'Select...' }}
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, thana_name: '' })
                                                                } else {
                                                                    setSearchObj({ ...searchObj, thana_name: selected.label })
                                                                }
                                                            }}
                                                            options={thanas.map(t => { return { value: t.id, label: t.name } })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <Button.Ripple className='ml-2' color='primary' onClick={() => {
                                                        console.log(searchObj)
                                                        let updatedData = []
                                                        updatedData = businessList.filter(item => {
                                                            if (searchObj.division_name && searchObj.district_name && searchObj.thana_name) {
                                                                return item.city?.toLowerCase() === searchObj.division_name.toLowerCase() && item.district?.toLowerCase() === searchObj.district_name.toLowerCase() && item.thana?.toLowerCase() === searchObj.thana_name.toLowerCase()
                                                            } else if (searchObj.division_name && searchObj.district_name && !searchObj.thana_name) {
                                                                return item.city?.toLowerCase() === searchObj.division_name.toLowerCase() && item.district?.toLowerCase() === searchObj.district_name.toLowerCase()
                                                            } else if (searchObj.division_name && !searchObj.district_name && !searchObj.thana_name) {
                                                                return item.city?.toLowerCase() === searchObj.division_name.toLowerCase()
                                                            }
                                                        }
                                                        )
                                                        if (updatedData.length !== 0) {
                                                            setFilteredData(updatedData)
                                                        } else {
                                                            setFilteredData([])
                                                        }
                                                    }} style={{ marginTop: '25px' }}>
                                                        <Search size={10} />
                                                        <span className='align-middle ml-50'>Search</span>
                                                    </Button.Ripple>
                                                </Col>
                                            </Row>
                                            <Table bordered responsive>
                                                <thead style={{ background: 'white' }}>
                                                    <tr>
                                                        <th style={{ background: 'white' }}>Check</th>
                                                        <th style={{ background: 'white' }}>Merchant Name</th>
                                                        <th style={{ background: 'white' }}>Division</th>
                                                        <th style={{ background: 'white' }}>district</th>
                                                        <th style={{ background: 'white' }}>Thana</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        filteredData.map((row, index) => <tr key={index}>
                                                            <td>
                                                                <CustomInput
                                                                    type='checkbox'
                                                                    id={row.id}
                                                                    checked={userInput.member_list?.find(m => m === row.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            userInput.member_list.push(row.id)
                                                                            setUserInput({ ...userInput })
                                                                        } else {
                                                                            userInput.member_list.pop(userInput.member_list.indexOf(row.id))
                                                                            setUserInput({ ...userInput })
                                                                        }
                                                                    }
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                {row.businessname}
                                                            </td>
                                                            <td>
                                                                {row.city}
                                                            </td>
                                                            <td>
                                                                {row.district}
                                                            </td>
                                                            <td>
                                                                {row.thana}
                                                            </td>
                                                        </tr>)
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                }
                                {
                                    (userInput.creation_type === 3 && userInput.type === 2) && <Row>
                                        <Col sm='12' className='d-flex justify-content-end'>
                                            <Button.Ripple className='text-dark' color='light' onClick={e => {
                                                ExportCSV(cusAgentList.map(cal => { return { MSISDN: cal.MobileNumber, EMAIL: cal.Email, 'DEVICE ID': '' } }), Object.keys(cusAgentList.map(cal => { return { MSISDN: cal.MobileNumber, EMAIL: cal.Email, 'DEVICE ID': 0 } })[0]), 'Agent List')
                                            }}
                                            >
                                                Export CSV
                                            </Button.Ripple>
                                        </Col>
                                        <Col sm='12' className='mb-1 mt-1'>
                                            <Row>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Gender</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, gender_name: selected.value })
                                                            }
                                                            }
                                                            options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Division</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.division_name !== ''}
                                                            value={{ value: searchObj.division_name, label: searchObj.division_name || 'Select...' }}
                                                            onChange={selected => {
                                                                // console.log(selected)
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, division_name: '', district_name: '', thana_name: '' })
                                                                    setDistrict([])
                                                                    setThana([])
                                                                } else {
                                                                    setSearchObj({ ...searchObj, division_name: selected.label, district_name: '', thana_name: '' })
                                                                    setDistrict(selected.value.dis)
                                                                    setThana([])
                                                                }
                                                            }
                                                            }
                                                            options={divisions.map(d => { return { value: { id: d.id, dis: d.districts }, label: d.name } })}
                                                            isLoading={divisions.length === 0}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">District</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.district_name !== ''}
                                                            value={{ value: searchObj.district_name, label: searchObj.district_name || 'Select...' }}
                                                            onChange={selected => {
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, district_name: '', thana_name: '' })
                                                                    setThana([])
                                                                } else {
                                                                    setSearchObj({ ...searchObj, district_name: selected.label, thana_name: '' })
                                                                    setThana(selected.value.thana)
                                                                }
                                                            }}
                                                            options={districts.map(d => { return { value: { id: d.id, thana: d.thana }, label: d.name } })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Thana</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.thana_name !== ''}
                                                            value={{ value: searchObj.thana_name, label: searchObj.thana_name || 'Select...' }}
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, thana_name: '' })
                                                                } else {
                                                                    setSearchObj({ ...searchObj, thana_name: selected.label })
                                                                }
                                                            }}
                                                            options={thanas.map(t => { return { value: t.id, label: t.name } })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <Button.Ripple className='ml-2' color='primary' onClick={() => handleSearch()} style={{ marginTop: '25px' }}>
                                                        <Search size={10} />
                                                        <span className='align-middle ml-50'>Search</span>
                                                    </Button.Ripple>
                                                </Col>
                                            </Row>
                                            {
                                                cusAgentList.length !== 0 ? <Table bordered responsive>
                                                    <thead style={{ background: 'white' }}>
                                                        <tr>
                                                            <th style={{ background: 'white' }}>Check</th>
                                                            <th style={{ background: 'white' }}>FullName</th>
                                                            <th style={{ background: 'white' }}>Email</th>
                                                            <th style={{ background: 'white' }}>gender_name</th>
                                                            <th style={{ background: 'white' }}>division_name</th>
                                                            <th style={{ background: 'white' }}>district_name</th>
                                                            <th style={{ background: 'white' }}>thana_name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            cusAgentList.map((row, index) => <tr key={index}>
                                                                <td>
                                                                    <CustomInput
                                                                        type='checkbox'
                                                                        id={row.MembershipId}
                                                                        checked={userInput.member_list?.find(m => m === row.MembershipId)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                userInput.member_list.push(row.MembershipId)
                                                                                setUserInput({ ...userInput })
                                                                            } else {
                                                                                userInput.member_list.pop(userInput.member_list.indexOf(row.MembershipId))
                                                                                setUserInput({ ...userInput })
                                                                            }
                                                                        }
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {row.FullName}
                                                                </td>
                                                                <td>
                                                                    {row.Email}
                                                                </td>
                                                                <td>
                                                                    {row.gender_name}
                                                                </td>
                                                                <td>
                                                                    {row.division_name}
                                                                </td>
                                                                <td>
                                                                    {row.district_name}
                                                                </td>
                                                                <td>
                                                                    {row.thana_name}
                                                                </td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table> : pointRuleloading ? <span className='d-flex justify-content-center' style={{ color: 'red', marginTop: '30px' }}><Spinner style={{ color: 'blue' }} size='md' /></span> : <span className='d-flex justify-content-center' style={{ color: 'red', marginTop: '30px' }}>There are no records to display!</span>
                                            }
                                        </Col>
                                    </Row>
                                }
                                {
                                    (userInput.creation_type === 3 && userInput.type === 1) && <Row>
                                        <Col sm='12' className='d-flex justify-content-end'>
                                            <Button.Ripple className='text-dark' color='light' onClick={e => {
                                                ExportCSV(cusAgentList.map(cal => { return { MSISDN: cal.MobileNumber, EMAIL: cal.Email, 'DEVICE ID': '' } }), Object.keys(cusAgentList.map(cal => { return { MSISDN: cal.MobileNumber, EMAIL: cal.Email, 'DEVICE ID': 0 } })[0]), 'Customer List')
                                            }}
                                            >
                                                Export CSV
                                            </Button.Ripple>
                                        </Col>
                                        <Col sm='12' className='mb-1 mt-1'>
                                            <Row>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Gender</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, gender_name: selected.value })
                                                            }
                                                            }
                                                            options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Division</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.division_name !== ''}
                                                            value={{ value: searchObj.division_name, label: searchObj.division_name || 'Select...' }}
                                                            onChange={selected => {
                                                                // console.log(selected)
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, division_name: '', district_name: '', thana_name: '' })
                                                                    setDistrict([])
                                                                    setThana([])
                                                                } else {
                                                                    setSearchObj({ ...searchObj, division_name: selected.label, district_name: '', thana_name: '' })
                                                                    setDistrict(selected.value.dis)
                                                                    setThana([])
                                                                }
                                                            }
                                                            }
                                                            options={divisions.map(d => { return { value: { id: d.id, dis: d.districts }, label: d.name } })}
                                                            isLoading={divisions.length === 0}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">District</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.district_name !== ''}
                                                            value={{ value: searchObj.district_name, label: searchObj.district_name || 'Select...' }}
                                                            onChange={selected => {
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, district_name: '', thana_name: '' })
                                                                    setThana([])
                                                                } else {
                                                                    setSearchObj({ ...searchObj, district_name: selected.label, thana_name: '' })
                                                                    setThana(selected.value.thana)
                                                                }
                                                            }}
                                                            options={districts.map(d => { return { value: { id: d.id, thana: d.thana }, label: d.name } })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <FormGroup>
                                                        <Label for="exampleSelect2">Thana</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            maxMenuHeight={150}
                                                            isClearable={searchObj.thana_name !== ''}
                                                            value={{ value: searchObj.thana_name, label: searchObj.thana_name || 'Select...' }}
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                if (!selected) {
                                                                    setSearchObj({ ...searchObj, thana_name: '' })
                                                                } else {
                                                                    setSearchObj({ ...searchObj, thana_name: selected.label })
                                                                }
                                                            }}
                                                            options={thanas.map(t => { return { value: t.id, label: t.name } })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="2" >
                                                    <Button.Ripple className='ml-2' color='primary' onClick={() => handleSearch()} style={{ marginTop: '25px' }}>
                                                        <Search size={10} />
                                                        <span className='align-middle ml-50'>Search</span>
                                                    </Button.Ripple>
                                                </Col>
                                            </Row>
                                            {
                                                cusAgentList.length !== 0 ? <Table bordered responsive>
                                                    <thead style={{ background: 'white' }}>
                                                        <tr>
                                                            <th style={{ background: 'white' }}>FullName</th>
                                                            <th style={{ background: 'white' }}>Email</th>
                                                            <th style={{ background: 'white' }}>gender_name</th>
                                                            <th style={{ background: 'white' }}>division_name</th>
                                                            <th style={{ background: 'white' }}>district_name</th>
                                                            <th style={{ background: 'white' }}>thana_name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            cusAgentList.map((row, index) => <tr key={index}>
                                                                <td>
                                                                    {row.FullName}
                                                                </td>
                                                                <td>
                                                                    {row.Email}
                                                                </td>
                                                                <td>
                                                                    {row.gender_name}
                                                                </td>
                                                                <td>
                                                                    {row.division_name}
                                                                </td>
                                                                <td>
                                                                    {row.district_name}
                                                                </td>
                                                                <td>
                                                                    {row.thana_name}
                                                                </td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table> : pointRuleloading ? <span className='d-flex justify-content-center' style={{ color: 'red', marginTop: '30px' }}><Spinner style={{ color: 'blue' }} size='md' /></span> : <span className='d-flex justify-content-center' style={{ color: 'red', marginTop: '30px' }}>There are no records to display!</span>
                                            }
                                        </Col>
                                    </Row>
                                }
                                {
                                    userInput.creation_type === 2 && <Row>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Gender</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setUserInput({ ...userInput, gender: a })
                                                    }}
                                                    options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        {/* <Col sm='3' className='mb-1'>
                                <div style={{backgroundColor:'#006496', padding:'6px 15px', marginBottom:'15px'}}><h6 className='m-0 text-white'>Carrier</h6></div>
                              
                                <FormGroup>
                                    <Select
                                         theme={selectThemeColors}
                                         isClearable={true}
                                         maxMenuHeight={200}
                                         className='react-select'
                                         classNamePrefix='select'
                                         name='behavior'
                                         isMulti
                                         onChange={ e => {
                                            const a = e.map(ee => ee.value)
                                            setUserInput({ ...userInput, carrier: a })
                                        }}
                                        options={[{value: '2g', label: '2G'}, {value: '3g', label: '3G'}, {value: '4g', label: '4G'}]}
                                    />
                                </FormGroup>
                            </Col> */}
                                        {/* <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Hand Set Type</h6></div>
                                            <FormGroup>
                                                <CustomInput onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUserInput({ ...userInput, hand_set_type: 'android' })
                                                    } else {
                                                        setUserInput({ ...userInput, hand_set_type: '' })
                                                    }
                                                }
                                                } type='checkbox' inline id='hand_set_type' label='Android' checked={userInput.hand_set_type === 'android'} />
                                            </FormGroup>
                                            <FormGroup>
                                                <CustomInput onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUserInput({ ...userInput, hand_set_type: 'ios' })
                                                    } else {
                                                        setUserInput({ ...userInput, hand_set_type: '' })
                                                    }
                                                }
                                                } type='checkbox' inline id='hand_set_type1' label='IOS' checked={userInput.hand_set_type === 'ios'} />
                                            </FormGroup>
                                        </Col> */}
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Age (years)</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    style={{ width: '200px' }}
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setUserInput({ ...userInput, age: a })
                                                    }}
                                                    options={[{ value: '18 - 25', label: '18 - 25' }, { value: '26 - 35', label: '26 - 35' }, { value: '36 - 45', label: '36 - 45' }, { value: '46 - 55', label: '46 - 55' }, { value: '56 - 65', label: '56 - 65' }, { value: '66 - 75', label: '66 - 75' }, { value: '76 - 85', label: '76 - 85' }, { value: '86 - 95', label: '86 - 95' }]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Minimum Casa-Balance</h6></div>
                                            <Row>
                                                <Col sm='12'>
                                                    <FormGroup>
                                                        <Input type="text"
                                                            name="income"
                                                            id='income'
                                                            rows='4'
                                                            value={userInput.income}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="per month income here..."
                                                        />
                                                        {/* <Nouislider
                                                style={{zIndex:'0'}}
                                                className='range-slider mt-2'
                                                direction={isRtl ? 'rtl' : 'ltr'}
                                                start={[100000, 300000]}
                                                connect={true}
                                                tooltips={[true, true]}
                                                format={wNumb({
                                                decimals: 0
                                                })}
                                                range={{
                                                min: 5000,
                                                max: 500000
                                                }}
                                                onChange={(e) => {
                                                    setUserInput({ ...userInput, income: `${e[0]} - ${e[1]}` })
                                                }}
                                            /> */}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                        {/* <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Connection Type</h6></div>
                                            <Row>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setUserInput({ ...userInput, connection_type: 'Gold' })
                                                            } else {
                                                                setUserInput({ ...userInput, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type1' label='Gold' checked={userInput.connection_type === 'Gold'} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setUserInput({ ...userInput, connection_type: 'Silver' })
                                                            } else {
                                                                setUserInput({ ...userInput, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type2' label='Silver' checked={userInput.connection_type === 'Silver'} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setUserInput({ ...userInput, connection_type: 'General' })
                                                            } else {
                                                                setUserInput({ ...userInput, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type3' label='General' checked={userInput.connection_type === 'General'} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setUserInput({ ...userInput, connection_type: 'Others' })
                                                            } else {
                                                                setUserInput({ ...userInput, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type4' label='Others' checked={userInput.connection_type === 'Others'} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col> */}
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Location</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={false}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    placeholder='select division'
                                                    isMulti
                                                    menuPlacement='auto'
                                                    onChange={e => {
                                                        if (!e) {
                                                            setDistrict([])
                                                        } else {
                                                            const a = e.map(ee => ee.label)
                                                            setUserInput({ ...userInput, division: a })
                                                            setDistrict(() => {
                                                                const dist = []
                                                                for (const se of e) {
                                                                    for (const d of se.value.dis) {
                                                                        dist.push(d)
                                                                    }
                                                                }
                                                                return dist
                                                            })
                                                        }
                                                    }}
                                                    options={divisions.map(d => { return { value: { id: d.id, dis: d.districts }, label: d.name } })}
                                                    isLoading={divisions.length === 0}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={false}
                                                    maxMenuHeight={200}
                                                    menuPlacement='auto'
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    isLoading={districts.length === 0}
                                                    isMulti
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.label)
                                                        setUserInput({ ...userInput, location: a })
                                                    }}
                                                    name='region'
                                                    options={districts.map(d => { return { value: { id: d.id, thana: d.thana }, label: d.name } })}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Religion</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setUserInput({ ...userInput, religions: a })
                                                    }}
                                                    options={[{ value: 'MUSLIMS', label: 'Muslim' }, { value: 'HINDU', label: 'Hindu' }, { value: 'CHRISTIAN', label: 'Christian' }]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Marital Status</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setUserInput({ ...userInput, marital_status: a })
                                                    }}
                                                    options={[{ value: 'MARRIED', label: 'Married' }, { value: 'UNMARRIED', label: 'Unmarried' }, { value: 'WIDOWER', label: 'Widower' }]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Occupation</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setUserInput({ ...userInput, occupation: a })
                                                    }}
                                                    options={[{ value: 'BUSINESS', label: 'Business' }, { value: 'SERVICE HOLDER', label: 'Service-Holder' }, { value: 'PVT EMPLOYEE', label: 'Private Employee' }, { value: 'BANKER', label: 'Banker' }, { value: 'OTHERS', label: 'Others' }]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Customer Type</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setUserInput({ ...userInput, customer_type: a })
                                                    }}
                                                    // onChange={e => {
                                                    //     setUserInput({ ...userInput, customer_type: e.value })
                                                    // }}
                                                    // onChange={e => {
                                                    //     const a = e.map(ee => ee.value)
                                                    //     console.log(a[0])
                                                    //     setUserInput({ ...userInput, customer_type: a })
                                                    // }}
                                                    options={[{ value: 'MASS', label: 'MASS' }, { value: 'PB', label: 'PB' }, { value: 'TARA', label: 'TARA' }]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Has Loan</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    
                                                    // isMulti
                                                    // onChange={e => {
                                                    //     const a = e.map(ee => ee.value)
                                                    //     setUserInput({ ...userInput, has_loan: a })
                                                    // }}
                                                    onChange={e => {
                                                        setUserInput({ ...userInput, has_loan: e.value })
                                                    }}
                                                    options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Has Credit Card</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    // isMulti
                                                    // onChange={e => {
                                                    //     const a = e.map(ee => ee.value)
                                                    //     setUserInput({ ...userInput, has_credit_card: a })
                                                    // }}
                                                    onChange={e => {
                                                        setUserInput({ ...userInput, has_credit_card: e.value })
                                                    }}
                                                    options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Has Debit Card</h6></div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    // isMulti
                                                    // onChange={e => {
                                                    //     const a = e.map(ee => ee.value)
                                                    //     setUserInput({ ...userInput, has_debit_card: a })
                                                    // }}
                                                    onChange={e => {
                                                        setUserInput({ ...userInput, has_debit_card: e.value })
                                                    }}
                                                    options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Account Opening Date</h6></div>
                                            <FormGroup>
                                                <Input
                                                    type="date"
                                                    max={new Date().toLocaleDateString('fr-CA')}
                                                    name="account_opening_date"
                                                    id='account_opening_date'
                                                    value={userInput.account_opening_date}
                                                    onChange={handleChange}
                                                    // required
                                                    placeholder='0'
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Last Login Date</h6></div>
                                            <FormGroup>
                                                <Input type="date"
                                                    max={new Date().toLocaleDateString('fr-CA')}
                                                    name="last_login_type"
                                                    id='last_login_type'
                                                    value={userInput.last_login_type}
                                                    onChange={handleChange}
                                                    // required
                                                    placeholder='0'
                                                />
                                            </FormGroup>
                                        </Col>
                                        {/* <Col sm='12'>
                                <hr />
                                <div className='d-flex justify-content-between'>
                                    <h6 onClick={e => {
                                        setUserInput({
                                            group_name: '',
                                            type: '',
                                            isDefault: '',
                                            creation_type: '1',
                                            gender: [],
                                            carrier: [],
                                            hand_set_type: '',
                                            age: [],
                                            location: [],
                                            connection_type: '',
                                            income: ''
                                        })
                                    } } className='m-0 text-danger cursor-pointer'>CLEAR ALL FILTERS</h6>
                                </div>
                            </Col> */}
                                    </Row>
                                }
                                 {uploadCsvGroupMemo}
                                {
                                    // userInput.creation_type === 1 &&  <UploadCsvGroup setcustomcodecsvurl={setcustomcodecsvurl} handleFile={handleFile}/>
                                    
                                }
                            </CardBody>
                        </Card>
                        {
                            userInput.creation_type === 1 && <Row>
                                <Col sm='12' className='text-center mt-1'>
                                    <h6>Total Item</h6>
                                    <h1>{rowNumber}</h1>
                                </Col>
                            </Row>
                        }
                    </>
                }
                <Row>
                    <Col sm="12" className='text-center'>
                        {
                            pointRuleloading ? <Button.Ripple color='primary' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Row>

            </Form>
        </Fragment>
    )
}

export default CreateGroup