import useJwt from '@src/auth/jwt/useJwt'
import { selectThemeColors } from '@utils'
import { Upload } from "antd"
import "antd/dist/antd.css"
import { useEffect, useState } from 'react'
import { ChevronLeft, FileText, Search, UploadCloud } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner, Table } from 'reactstrap'
import XLSX from "xlsx"
import { API_BASE_URL } from "../../../../../../Configurables"
import { Error, Success } from '../../../../../viewhelper'
const { Dragger } = Upload
import { toast, Slide } from 'react-toastify'

const GroupEdit = () => {
    const history = useHistory()
    const [groupInfo, setgroupInfo] = useState(JSON.parse(localStorage.getItem('groupInfo')))
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [csvloading, setcsvloading] = useState(false)
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [divisions, setDivision] = useState([])
    const [districts, setDistrict] = useState([])
    const [thanas, setThana] = useState([])
    const [countries, setCountries] = useState([])
    const [countryCode, setCountryCode] = useState('')
    const [regions, setRegions] = useState([])
    const [businessList, setBusinessList] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [cusAgentList, setCusAgentList] = useState([])
    const [searchObj, setSearchObj] = useState({
        division_name: '',
        district_name: '',
        thana_name: '',
        gender_name: '',
        is_agent: 0 //1 for agent, 0 for customer
    })
    console.log(groupInfo)
    const [userInput, setUserInput] = useState([])
    // religions: [],
    //     marital_status: [],
    //     occupation: [],
    //     branch_name: '',
    //     ca_sa_product_description: '',
    //     casa_acct_status: '',
    //     account_opening_date: null,
    //     last_login_type:null,
    //     has_loan: [],
    //     has_credit_card: [],
    //     has_debit_card: [],
    //     customer_type: []
    const handleChange = (e) => {
        setgroupInfo({ ...groupInfo, [e.target.name]: e.target.value })
    }
    function contactCSVDownload() {
        setcsvloading(true)
        useJwt.contactCSVDownload({ group_id: parseInt(groupInfo.id) }).then(res => {
            window.open(res.data.payload.image_url, "_blank")
            setcsvloading(false)
            console.log(res.data.payload.image_url)
        }).catch(err => {
            console.log(err.response)
            Error(err)
            setcsvloading(false)
        })
    }

    useEffect(() => {
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
            setFilteredData(payload)
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
    const onSubmit = (e) => {
        e.preventDefault()
        seteditPointRuleloading(true)
        useJwt.editCampaignGroup({ ...groupInfo, report_file: File }).then(res => {
            seteditPointRuleloading(false)
            console.log(res)
            Success(res)
            history.goBack()
        }).catch(err => {
            seteditPointRuleloading(false)
            Error(err)
            console.log(err)
        })
    }
    return (
        <>
            <Button.Ripple className='mb-1' color='primary' onClick={() => history.goBack()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="group_name">Group Name</Label>
                                    <Input type="text"
                                        name="group_name"
                                        id='group_name'
                                        value={groupInfo.group_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="group name..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="type">Group Type</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: groupInfo.type, label: groupInfo.type === 1 ? 'Customer' : groupInfo.type === 2 ? 'Agent' : groupInfo.type === 3 ? 'Merchant' : 'select...' }}
                                        onChange={(selected) => {
                                            if (selected.value !== 1 && selected.value !== 2 && selected.value !== 4) {
                                                setgroupInfo({ ...groupInfo, type: selected.value, creation_type: 3 })
                                                setCusAgentList([])
                                            } else {
                                                setCusAgentList([])
                                                setgroupInfo({ ...groupInfo, type: selected.value, creation_type: 2 })
                                                if (selected.value === 1) {
                                                    setSearchObj({ ...searchObj, is_agent: 0, division_name: '', district_name: '', thana_name: '', gender_name: '' })
                                                } else if (selected.value === 2) {
                                                    setSearchObj({ ...searchObj, is_agent: 1, division_name: '', district_name: '', thana_name: '', gender_name: '' })
                                                }
                                            }
                                        }}
                                        options={[{ value: 4, label: 'All' }, { value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }]}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup className='mt-2 text-center'>
                                    <CustomInput
                                        type='switch'
                                        id='isDefault'
                                        name='isDefault'
                                        label='Default'
                                        checked={groupInfo.isDefault}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setgroupInfo({ ...groupInfo, isDefault: true })
                                            } else {
                                                setgroupInfo({ ...groupInfo, isDefault: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                {
                    (groupInfo.type) && <>
                        <Row>
                            <Col sm="12" className='mb-1'>
                                <Label className='d-block'><h6>Group Creation<span style={{ color: 'red' }}>*</span></h6></Label>
                                {
                                    (groupInfo.type === 1 || groupInfo.type === 2 || groupInfo.type === 4) && <FormGroup check inline className='mr-3'>
                                        <CustomInput type='radio' name='gp' id='gp' checked={groupInfo.creation_type === 2} label='Group Profiling'
                                            onChange={() => {
                                                setgroupInfo({ ...groupInfo, creation_type: 2 })
                                            }}
                                        />
                                    </FormGroup>
                                }
                                {/* {
                                    groupInfo.type !== 4 && <FormGroup check inline className='mr-3'>
                                        <CustomInput type='radio' name='abp' id='abp' checked={groupInfo.creation_type === 3} label='Account Base Profiling'
                                            onChange={() => {
                                                setgroupInfo({ ...groupInfo, creation_type: 3 })
                                            }}
                                        />
                                    </FormGroup>
                                } */}
                                <FormGroup check inline>
                                    <CustomInput type='radio' name='bp' id='bp' checked={groupInfo.creation_type === 1} label='Bulk Upload'
                                        onChange={() => {
                                            setgroupInfo({ ...groupInfo, creation_type: 1 })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Card>
                            <CardBody>
                                {
                                    (groupInfo.creation_type === 3 && groupInfo.type === 3) && <Row>
                                        <Col sm='12' className='d-flex justify-content-end'>
                                            <Button.Ripple className='text-dark' color='light' onClick={e => {
                                                ExportCSV(businessList.map(cal => { return { MSISDN: cal.v_mobile, EMAIL: cal.email, 'DEVICE ID': '' } }), Object.keys(cusAgentList.map(cal => { return { MSISDN: cal.MobileNumber, EMAIL: cal.Email, 'DEVICE ID': 0 } })[0]), 'Merchant List')
                                            }}
                                            >
                                                Export CSV
                                            </Button.Ripple>
                                        </Col>
                                        <Col sm='12' className='mb-1 mt-1'>
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
                                                    <tr>
                                                        <td>
                                                            <CustomInput
                                                                type='checkbox'
                                                                id="checkAll"
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        groupInfo.member_list = filteredData.map(m => m.id)
                                                                        setgroupInfo({ ...groupInfo })
                                                                    } else {
                                                                        setgroupInfo({ ...groupInfo, member_list: [] })
                                                                    }
                                                                }
                                                                }
                                                            />
                                                        </td>
                                                        <td></td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                name="division"
                                                                onChange={e => {
                                                                    let updatedData = []
                                                                    updatedData = filteredData.filter(item => item.city.toLowerCase() === e.target.value.toLowerCase())
                                                                    if (updatedData.length !== 0) {
                                                                        setFilteredData(updatedData)
                                                                    } else {
                                                                        setFilteredData(businessList)
                                                                    }
                                                                }
                                                                }
                                                                placeholder="search by division..."
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                name="district"
                                                                onChange={e => {
                                                                    let updatedData = []
                                                                    updatedData = filteredData.filter(item => item.district?.toLowerCase() === e.target.value.toLowerCase())
                                                                    if (updatedData.length !== 0) {
                                                                        setFilteredData(updatedData)
                                                                    } else {
                                                                        setFilteredData(businessList)
                                                                    }
                                                                }
                                                                }
                                                                placeholder="search by district..."
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                name="thana"
                                                                onChange={e => {
                                                                    let updatedData = []
                                                                    updatedData = filteredData.filter(item => item.thana?.toLowerCase() === e.target.value.toLowerCase())
                                                                    if (updatedData.length !== 0) {
                                                                        setFilteredData(updatedData)
                                                                    } else {
                                                                        setFilteredData(businessList)
                                                                    }
                                                                }
                                                                }
                                                                placeholder="search by thana..."
                                                            />
                                                        </td>
                                                    </tr>
                                                    {
                                                        filteredData.map((row, index) => <tr key={index}>
                                                            <td>
                                                                <CustomInput
                                                                    type='checkbox'
                                                                    id={row.id}
                                                                    checked={groupInfo.member_list?.find(m => m === row.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            groupInfo.member_list.push(row.id)
                                                                            setgroupInfo({ ...groupInfo })
                                                                        } else {
                                                                            groupInfo.member_list.pop(groupInfo.member_list.indexOf(row.id))
                                                                            setgroupInfo({ ...groupInfo })
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
                                    (groupInfo.creation_type === 3 && groupInfo.type === 2) && <Row>
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
                                                            // value={groupInfo.gender?.map(e => { return { value: e, label: e } }) || []}
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
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, division_name: selected.label })
                                                                setDistrict(selected.value.dis)
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
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, district_name: selected.label })
                                                                setThana(selected.value.thana)
                                                            }
                                                            }
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
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, thana_name: selected.label })
                                                            }
                                                            }
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
                                                                        checked={groupInfo.member_list?.find(m => m === row.MembershipId)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                groupInfo.member_list.push(row.MembershipId)
                                                                                setgroupInfo({ ...groupInfo })
                                                                            } else {
                                                                                groupInfo.member_list.pop(groupInfo.member_list.indexOf(row.MembershipId))
                                                                                setgroupInfo({ ...groupInfo })
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
                                    (groupInfo.creation_type === 3 && groupInfo.type === 1) && <Row>
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
                                                            value={groupInfo.gender?.map(e => { return { value: e, label: e } }) || []}
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
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, division_name: selected.label })
                                                                setDistrict(selected.value.dis)
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
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, district_name: selected.label })
                                                                setThana(selected.value.thana)
                                                            }
                                                            }
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
                                                            classNamePrefix='select'
                                                            name="serchfield"
                                                            onChange={selected => {
                                                                setSearchObj({ ...searchObj, thana_name: selected.label })
                                                            }
                                                            }
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
                                    groupInfo.creation_type === 2 && <Row>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Gender</h6>
                                            </div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    value={groupInfo.gender?.map(e => { return { value: e, label: e } }) || []} // Set default value based on groupInfo.gender
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, gender: a })
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
                                         value = {groupInfo.carrier?.map(e => { return {value: e, label: e} })}
                                         onChange={ e => {
                                            const a = e.map(ee => ee.value)
                                            setgroupInfo({ ...groupInfo, carrier: a })
                                        }}
                                        options={[{value: '2g', label: '2G'}, {value: '3g', label: '3G'}, {value: '4g', label: '4G'}]}
                                    />
                                </FormGroup>
                            </Col> */}
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Hand Set Type</h6></div>
                                            <FormGroup>
                                                <CustomInput onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setgroupInfo({ ...groupInfo, hand_set_type: 'android' })
                                                    } else {
                                                        setgroupInfo({ ...groupInfo, hand_set_type: '' })
                                                    }
                                                }
                                                } type='checkbox' inline id='hand_set_type' label='Android' checked={groupInfo.hand_set_type === 'android'} />
                                            </FormGroup>
                                            <FormGroup>
                                                <CustomInput onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setgroupInfo({ ...groupInfo, hand_set_type: 'ios' })
                                                    } else {
                                                        setgroupInfo({ ...groupInfo, hand_set_type: '' })
                                                    }
                                                }
                                                } type='checkbox' inline id='hand_set_type1' label='IOS' checked={groupInfo.hand_set_type === 'ios'} />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Age (years)</h6>
                                            </div>
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
                                                    value={groupInfo.age?.map(e => { return { value: e, label: e } }) || []} // Set default value based on groupInfo.age
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, age: a })
                                                    }}
                                                    options={[
                                                        { value: '18 - 25', label: '18 - 25' },
                                                        { value: '26 - 35', label: '26 - 35' },
                                                        { value: '36 - 45', label: '36 - 45' },
                                                        { value: '46 - 55', label: '46 - 55' },
                                                        { value: '56 - 65', label: '56 - 65' },
                                                        { value: '66 - 75', label: '66 - 75' },
                                                        { value: '76 - 85', label: '76 - 85' },
                                                        { value: '86 - 95', label: '86 - 95' }
                                                    ]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>Per Month Income</h6></div>
                                            <Row>
                                                <Col sm='12'>
                                                    <FormGroup>
                                                        <Input type="text"
                                                            name="income"
                                                            id='income'
                                                            rows='4'
                                                            value={groupInfo.income}
                                                            onChange={handleChange}
                                                            // required
                                                            placeholder="per month income here..."
                                                        />
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
                                                                setgroupInfo({ ...groupInfo, connection_type: 'Gold' })
                                                            } else {
                                                                setgroupInfo({ ...groupInfo, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type1' label='Gold' checked={groupInfo.connection_type === 'Gold'} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setgroupInfo({ ...groupInfo, connection_type: 'Silver' })
                                                            } else {
                                                                setgroupInfo({ ...groupInfo, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type2' label='Silver' checked={groupInfo.connection_type === 'Silver'} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setgroupInfo({ ...groupInfo, connection_type: 'General' })
                                                            } else {
                                                                setgroupInfo({ ...groupInfo, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type3' label='General' checked={groupInfo.connection_type === 'General'} />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm='6'>
                                                    <FormGroup>
                                                        <CustomInput onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setgroupInfo({ ...groupInfo, connection_type: 'Others' })
                                                            } else {
                                                                setgroupInfo({ ...groupInfo, connection_type: '' })
                                                            }
                                                        }
                                                        } type='checkbox' inline id='connection_type4' label='Others' checked={groupInfo.connection_type === 'Others'} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col> */}
                                        
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Location</h6>
                                            </div>
                                            {/* <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={false}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    placeholder='select country'
                                                    value={groupInfo.division?.map(e => { return { value: e, label: e } }) || []}
                                                    // onChange={e => {
                                                    //     setCountryCode(e.value)
                                                    // }}
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, location: a })
                                                    }}
                                                    // isLoading={countries.length === 0}
                                                    name='country'
                                                    options={countries.map(o => { return { value: o.key, label: o.name } })}
                                                />
                                            </FormGroup> */}
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
                                                    value={groupInfo.division?.map(e => { return { value: e, label: e } }) || []}
                                                    onChange={e => {
                                                        if (!e) {
                                                            setDistrict([])
                                                        } else {
                                                            const a = e.map(ee => ee.label)
                                                            setgroupInfo({ ...groupInfo, division: a })
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
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    isLoading={regions.length === 0}
                                                    isMulti
                                                    value={groupInfo.location?.map(e => { return { value: e, label: e } }) || []} 
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, location: a })
                                                    }}
                                                    name='region'
                                                    options={regions.map(o => { return { value: o.name, label: o.name } })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Religion</h6>
                                            </div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    isMulti
                                                    value={groupInfo.religions?.map(religion => ({ value: religion, label: religion })) || []}
                                                    onChange={e => {
                                                        const selectedValues = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, religions: selectedValues })
                                                    }}
                                                    options={[
                                                        { value: 'MUSLIMS', label: 'Muslim' },
                                                        { value: 'HINDU', label: 'Hindu' },
                                                        { value: 'CHRISTIAN', label: 'Christian' }
                                                    ]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Marital Status</h6>
                                            </div>
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
                                                        const selectedValues = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, marital_status: selectedValues })
                                                    }}
                                                    value={groupInfo.marital_status?.map(status => ({ value: status, label: status })) || []}
                                                    options={[
                                                        { value: 'MARRIED', label: 'Married' },
                                                        { value: 'UNMARRIED', label: 'Unmarried' },
                                                        { value: 'WIDOWER', label: 'Widower' }
                                                    ]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Occupation</h6>
                                            </div>
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
                                                        const selectedValues = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, occupation: selectedValues })
                                                    }}
                                                    value={groupInfo.occupation?.map(occupation => ({ value: occupation, label: occupation })) || []}
                                                    options={[
                                                        { value: 'BUSINESS', label: 'Business' },
                                                        { value: 'SERVICE HOLDER', label: 'Service-Holder' },
                                                        { value: 'PVT EMPLOYEE', label: 'Private Employee' },
                                                        { value: 'BANKER', label: 'Banker' },
                                                        { value: 'OTHERS', label: 'Others' }
                                                    ]}
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
                                                    // value={groupInfo.customer_type ? { value: groupInfo.customer_type, label: groupInfo.customer_type } : null} 
                                                    value={groupInfo.customer_type?.map(customer_type => ({ value: customer_type, label: customer_type })) || []}
                                                    onChange={e => {
                                                        const a = e.map(ee => ee.value)
                                                        setgroupInfo({ ...groupInfo, customer_type: a })
                                                    }}
                                                    options={[{ value: 'MASS', label: 'MASS' }, { value: 'PB', label: 'PB' }, { value: 'TARA', label: 'TARA' }]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Has Loan</h6>
                                            </div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    value={groupInfo.has_loan ? { value: groupInfo.has_loan, label: groupInfo.has_loan } : null}
                                                    onChange={e => {
                                                        setgroupInfo({ ...groupInfo, has_loan: e.value })
                                                    }}
                                                    options={[
                                                        { value: 'Yes', label: 'Yes' },
                                                        { value: 'No', label: 'No' }
                                                    ]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Has Credit Card</h6>
                                            </div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    value={groupInfo.has_debit_card ? { value: groupInfo.has_debit_card, label: groupInfo.has_debit_card } : null} 
                                                    onChange={e => {
                                                        setgroupInfo({ ...groupInfo, has_debit_card: e.value })
                                                    }}
                                                    options={[
                                                        { value: 'Yes', label: 'Yes' },
                                                        { value: 'No', label: 'No' }
                                                    ]}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm='3' className='mb-1'>
                                            <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}>
                                                <h6 className='m-0 text-white'>Has Debit Card</h6>
                                            </div>
                                            <FormGroup>
                                                <Select
                                                    theme={selectThemeColors}
                                                    isClearable={true}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    name='behavior'
                                                    value={groupInfo.has_debit_card ? { value: groupInfo.has_debit_card, label: groupInfo.has_debit_card } : null} 
                                                    onChange={e => {
                                                        setgroupInfo({ ...groupInfo, has_debit_card: e.value })
                                                    }}
                                                    options={[
                                                        { value: 'Yes', label: 'Yes' },
                                                        { value: 'No', label: 'No' }
                                                    ]}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <FormGroup>
                                                <Label for="startdate">Account Opening Date</Label>
                                                <Input
                                                    type="date"
                                                    max={new Date().toLocaleDateString('fr-CA')}
                                                    name="account_opening_date"
                                                    id='account_opening_date'
                                                    value={groupInfo.account_opening_date || new Date().toLocaleDateString('fr-CA')}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder='0'
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm='3' className='mb-1'>
                                            <FormGroup>
                                                <Label for="last_login_type">Last Login Date</Label>
                                                <Input
                                                    type="date"
                                                    max={new Date().toLocaleDateString('fr-CA')}
                                                    name="last_login_type"
                                                    id='last_login_type'
                                                    value={groupInfo.last_login_type || new Date().toLocaleDateString('fr-CA')}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder='0'
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                }
                                {
                                    groupInfo.creation_type === 1 && <Row className='pb-2'>
                                        <Col sm='12' className='text-right mb-1'>
                                            <div className='d-flex align-items-center justify-content-end cursor-pointer' onClick={contactCSVDownload}>
                                                <FileText size='17px' color='#006496' style={{ marginRight: '5px' }} />
                                                <h6 className='text-primary m-0'>DOWNLOAD EXISTING CONTACTS</h6>
                                                {
                                                    csvloading && <Spinner style={{ color: '#006496', marginLeft: '5px' }} size='sm' />
                                                }
                                            </div>
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
                                                    Group members upload.
                                                </p>
                                            </Dragger>}
                                        </Col>
                                    </Row>
                                }
                            </CardBody>
                        </Card>
                        {
                            groupInfo.creation_type === 1 && <Row>
                                <Col sm='12' className='text-center mt-1'>
                                    <h6>Total Item</h6>
                                    <h1>{rowNumber}</h1>
                                </Col>
                            </Row>
                        }
                    </>
                }

                <Col sm="12" className='text-center'>
                    {
                        editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                            <Spinner color='white' size='sm' />
                            <span className='ml-50'>Loading...</span>
                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                            <span >Update</span>
                        </Button.Ripple>
                    }
                </Col>
            </Form>
        </>
    )
}
export default GroupEdit