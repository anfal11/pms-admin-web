import useJwt from '@src/auth/jwt/useJwt'
import { selectThemeColors } from '@utils'
import * as FileSaver from 'file-saver'
import 'jspdf-autotable'
import React, { useEffect, useRef, useState } from 'react'
import { Edit, FileText, Grid, Share, Trash, X } from 'react-feather'
import Select from 'react-select'
import { Badge, Button, Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row, Spinner, UncontrolledButtonDropdown } from 'reactstrap'
import CardBody from 'reactstrap/lib/CardBody'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)
import EditModal from './EditModal'

const CampAlertScreen = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const RuleRef = useRef()
    const [resetData, setReset] = useState(false)
    const [TableDataLoading, setTableDataLoading] = useState(false)
    const [emailReqMsg, setEmailReqMsg] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [keyword, setKeyword] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [campaignList, setCampaignList] = useState([])
    const [campaignAlertList, setCampaignAlertList] = useState([])
    const [campaignAlertInfo, setCampaignAlertInfo] = useState({})
    const [userInput, setUserInput] = useState({
        campaign_id : 0,
        email: []
    })
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    useEffect(async () => {
        setTableDataLoading(true)
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        await useJwt.campaignList().then(res => {
            console.log(res)
            setCampaignList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                    localStorage.setItem('BMStoken', res.data.jwtToken)
                    localStorage.setItem("BMSCall", false)
                    setReset(!resetData)
                }).catch(err => {
                    localStorage.setItem("BMSCall", false)
                    console.log(err)
                })
            } else {
                Error(err)
            }
            console.log(err)
            localStorage.setItem('useBMStoken', false)
        })
        await useJwt.campaignAlertList().then(res => {
            console.log(res)
            setCampaignAlertList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })
    }, [resetData])
    const onSubmit = (e) => {
        e.preventDefault()
        if (userInput.email.length === 0) {
            setEmailReqMsg(true)
            return
        } else {
            setEmailReqMsg(false)
        }

        setTableDataLoading(true)
        useJwt.campaignAlertCreate(userInput).then((response) => {
            console.log(response)
            setTableDataLoading(false)
            Success(response)
            setUserInput({
                campaign_id : 0,
                email: []
            })
            setReset(!resetData)
        }).catch((error) => {
            setTableDataLoading(false)
            Error(error)
            console.log(error.response)
        })
    }
    const handlePoPupActions = (id, message) => {
        return MySwal.fire({
            title: message,
            text: `You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const data = {
                    campaign_id: parseInt(id)
                }
                return useJwt.deleteCampaignAlert(data).then(res => {
                    Success(res)
                    console.log(res)
                    setReset(!resetData)
                }).catch(err => {
                    console.log(err)
                    Error(err)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })

    }
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = campaignAlertList.filter(item => {
            const startsWith =
            item.campaign_name.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.campaign_name.toLowerCase().includes(value.toLowerCase())

            if (startsWith) {
            return startsWith
            } else if (!startsWith && includes) {
            return includes
            } else return null
        })
        setFilteredData(updatedData)
        setSearchValue(value)
        }
    }
    const column = [
        {
            name: 'SL',
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Campaign Name',
            minWidth: '200px',
            sortable: true,
            selector: 'campaign_name'
        },
        {
            name: 'Email',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.emails ? row.emails.map((e, index) => <Badge key={index} style={{marginBottom:'5px', marginRight:'5px'}} pill color='warning' className='badge-center'>{e.email}</Badge>) : '---'
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.CreatedBy === user.username ? <h6 style={{margin:'0', color:'orange'}}>Pending</h6> : <>
                    <span title="edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setCampaignAlertInfo({
                                    campaign_id : parseInt(row.emails[0].campaign_id),
                                    email: row.emails.map(e => e.email)
                                })
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 'Are you sure?')}
                        />
                    </span>
                </>
            }
        }
    ]

    // ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result

        const columnDelimiter = ','
        const lineDelimiter = '\n'
        const keys = [...Object.keys(array[0])]
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
        let ctr = 0
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter
    
            result += item[key]
    
            ctr++
          })
        result += lineDelimiter
        })

        return result
    }
    // ** Downloads CSV
    function downloadCSV(array) {
        const link = document.createElement('a')
        const ta = array.map(a => {
            return {...a, emails: a.emails.map(el => el.email).toString().replace(/,/g, "   ")}
        })
        let csv = convertArrayOfObjectsToCSV(ta)
        if (csv === null) return

        const filename = 'export.csv'

        if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`
        }

        link.setAttribute('href', encodeURI(csv))
        link.setAttribute('download', filename)
        link.click()
    }
    return (
        <>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Set Campaign Alert</CardTitle>
                </CardHeader>
                <CardBody>
                <Form className="row" style={{ width: '100%', marginTop:'15px' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="4" >
                        <FormGroup>
                            <Label for="groups">Select Campaign<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                id='group'
                                classNamePrefix='select'
                                value={{ value: userInput.campaign_id, label: campaignList.find(rl => rl.id === userInput.campaign_id)?.campaignName || 'select...' }}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, campaign_id: selected.value })
                                }}
                                options={campaignList?.map(rl => { return { value: rl.id, label: rl.campaignName } })}
                                ref={RuleRef}
                            />
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => RuleRef.current.select.focus()}
                                value={userInput.campaign_id || ''}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                            <FormGroup>
                                <Label for="keyword">Email<span style={{ color: 'red' }}>*</span></Label>
                                <div className='d-flex align-items-center'>
                                    <InputGroup>
                                        <Input type="text"
                                            name="keyword"
                                            id='keyword'
                                            value={keyword}
                                            onChange={e => setKeyword(e.target.value)}
                                            placeholder="your answer"
                                        />
                                        <InputGroupAddon addonType='append'>
                                            <Button style={{ zIndex: '0' }} color='primary' outline onClick={() => {
                                                if (keyword) {
                                                    setUserInput({ ...userInput, email: [...userInput.email, keyword] })
                                                    setKeyword('')
                                                    setEmailReqMsg(false)
                                                }
                                            }}>
                                                Add
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                {emailReqMsg && <span style={{ fontSize: '12px', color: 'red' }}>This is a required field!</span>}
                                <div className='d-flex mt-1 flex-wrap'>
                                    {userInput.email?.map((k, index) => <InputGroup key={index} style={{ width: '250px', marginBottom: '10px', marginRight: '10px' }}>
                                        <InputGroupAddon addonType='prepend'>
                                            <Button style={{ width: '35px', padding: '5px' }} color='primary' outline onClick={() => {
                                                userInput.email.splice(userInput.email.indexOf(k), 1)
                                                setUserInput({ ...userInput, email: [...userInput.email] })
                                            }}>
                                                <X size={12} />
                                            </Button>
                                        </InputGroupAddon>
                                        <Input type="text"
                                            name="keyword"
                                            id='keyword'
                                            style={{ fontSize: '12px', padding: '5px' }}
                                            value={k}
                                            disabled
                                            onChange={() => { }}
                                        />
                                    </InputGroup>)}
                                </div>
                            </FormGroup>
                        </Col>
                        <Col sm="12" className='text-center'>
                            {
                                TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span >Submit</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form>
                </CardBody>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Campaign Alert List</CardTitle>
                    <div>
                        <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(campaignAlertList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                        <Label className='mr-1' for='search-input'>
                        Search
                        </Label>
                        <Input
                        className='dataTable-filter mb-50'
                        type='text'
                        bsSize='sm'
                        id='search-input'
                        value={searchValue}
                        onChange={handleFilter}
                        />
                    </Col>
                </Row>
                <CommonDataTable column={column} TableData={searchValue.length ? filteredData : campaignAlertList} TableDataLoading={TableDataLoading} />
                <EditModal
                    toggleModal={toggleModal}
                    modal={modal}
                    resetData={resetData}
                    setReset={setReset}
                    setCampaignAlertInfo={setCampaignAlertInfo}
                    campaignAlertInfo={campaignAlertInfo}
                    campaignList={campaignList}
                />
            </Card>
        </>
    )
}

export default CampAlertScreen