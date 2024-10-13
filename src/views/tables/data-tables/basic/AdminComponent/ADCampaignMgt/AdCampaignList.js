import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import PendingADCampaignList from './PendingAdCampaignList'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import {formatReadableDate} from '../../../../../helper'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ADCampaignList = () => {
    const history = useHistory()
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const userData = JSON.parse(localStorage.getItem('userData'))
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [adCampaignList, setadCampaignList] = useState([])
    const [pendingadCampaignList, setPendingadCampaignList] = useState([])
    const [quotalist, setQuotaList] = useState([])
    const [MerchantList, setMerchantLists] = useState([])
    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt.getQuotaList().then(res => {
            console.log(res)
            const allQuotas = []
            for (const q of res.data.payload) {
                if (q.is_approved === true) {
                    allQuotas.push(q)
                } 
            }
            setQuotaList(allQuotas)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            setMerchantLists(payload.map(x => { return { value: x.id, label: x.businessname } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    useEffect(async() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt2.adCampaignList().then(res => {
            console.log(res)
            const allAds = []
            const allPendingAds = []
            for (const q of res.data.payload) {
                if (q.common_data.is_approved === true || q.common_data.is_rejected === true) {
                    allAds.push({...q.common_data, ...q.facebook_data, ...q.google_data})
                } else if (q.common_data.is_approved === false && q.common_data.is_rejected === false) {
                    allPendingAds.push({...q.common_data, ...q.facebook_data, ...q.google_data})
                }
            }
            setadCampaignList(allAds)
            setPendingadCampaignList(allPendingAds)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err.response)
            setTableDataLoading(false)
        })
    }, [resetData])
    const handlePoPupActions = (id, status, message, type) => {
        
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
                    rule_id: parseInt(id),
                    action_id: status,
                    reject_msg : "",
                    campaign_type : type
                }
                return useJwt.actionAdCampaign(data).then(res => {
                    console.log(res)
                    Success(res)
                    setPendingadCampaignList(pendingadCampaignList.filter(x => x.id !== id))
                    setReset(!resetData)
                }).catch(err => {
                    console.log(err.response)
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = adCampaignList.filter(item => {
            const startsWith =
            item.title.toLowerCase().startsWith(value.toLowerCase()) ||
            item.approved_by.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toString().toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.approved_by.toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toString().toLowerCase().includes(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().includes(value.toLowerCase())

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
            minWidth: '170px',
            sortable: true,
            selector: 'name'
        },
        {
            name: 'Type',
            minWidth: '170px',
            sortable: true,
            selector: 'campaign_type'
        },
        {
            name: 'Budget',
            minWidth: '170px',
            sortable: true,
            selector: row => {
                return quotalist.find(i => i.id === row.budget_id.toString())?.title
            }
        },
        {
            name: 'Business Name',
            minWidth: '170px',
            sortable: true,
            selector: row => {
                if (row.business_id === 'self') {
                    return 'Self'
                } else {
                    return MerchantList.find(i => i.value === row.business_id.toString())?.label
                }
            }
        },
        {
            name: 'Google Advertising Channel Type',
            minWidth: '170px',
            sortable: true,
            selector: 'google_advertising_channel_type'
        },
        {
            name: 'Objective',
            minWidth: '170px',
            sortable: true,
            selector: 'objective'
        },
        {
            name: 'Special Ad Categories',
            minWidth: '170px',
            sortable: true,
            selector: 'special_ad_categories'
        },
        {
            name: 'Created by',
            minWidth: '170px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'Approved At',
            minWidth: '250px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.approved_at) - new Date(a.approved_at)
              },
            selector: row => {
                return row.approved_at ? formatReadableDate(row.approved_at) : ''
            }
        },
        {
            name: 'Status',
            minWidth: '200px',
            sortable: true,
            selector: row => {
                if (row.campaign_type === 'facebook') {
                    return row.facebook_status ? <Badge pill color='success' className='badge-center'>
                        Facebook Campaing: ON
                    </Badge> : <Badge pill color='danger' className='badge-center'>
                        Facebook Campaing: OFF
                    </Badge>
                } else if (row.campaign_type === 'google') {
                    return row.google_status ? <Badge pill color='success' className='badge-center'>
                        Google Campaing: ON
                    </Badge> : <Badge pill color='danger' className='badge-center'>
                        Google Campaing: OFF
                    </Badge>
                } else if (row.campaign_type === 'both') {
                    return (row.facebook_status && row.google_status) ? <Badge pill color='success' className='badge-center'>
                        Both Campaing: ON
                    </Badge> : <Badge pill color='danger' className='badge-center'>
                        Both Campaing: OFF
                    </Badge>
                }
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                 {
                      row.is_approved && <span title="Edit">
                         <Edit size={15}
                             color='teal'
                             style={{ cursor: 'pointer' }}
                             onClick={(e) => {
                                 history.push(userData?.role === 'vendor' ? '/editAdCampaignVendor' : '/editAdCampaign')
                                 localStorage.setItem('adCampaignInfo', JSON.stringify(row))
                             }}
                         />
                     </span>
                     }&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?', row.type)}
                        />
                    </span>
                </>
            }
        }
    ]
    const [activeTab, setActiveTab] = useState('1')

  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)

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
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
}
// ** Export XL file
const exportToXL = (arr) => {
    const ws = XLSX.utils.json_to_sheet(arr)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'})
    FileSaver.saveAs(data, 'export.xlsx')
}
const exportPDF = (list) => {
    const doc = new jsPDF()
    doc.text('All ADs', 14, 10) 
    doc.autoTable({
       body: [...list],
       columns: [{ header: 'title', dataKey: 'title' }, { header: 'body', dataKey: 'body' }, { header: 'created_by_name', dataKey: 'created_by_name' }, { header: 'created_at', dataKey: 'created_at' }], 
    styles: { cellPadding: 1.5, fontSize: 8 }
      })
    doc.save('export.pdf')
}

    return (
        <Card>
          <CardBody className='pt-2'>
            <Nav pills>
              <NavItem>
                <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                  <span className='align-middle d-none d-sm-block'>AD Campaigns</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                  <span className='align-middle d-none d-sm-block'>Approve AD Campaigns</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>All AD Campaigns</CardTitle>
                        <div>
                            {(subMenuIDs.includes(31) || userData?.role === 'vendor') && <Button.Ripple className='ml-2' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/creatAdCampaignVendor' : '/creatAdCampaign'} >
                            <div className='d-flex align-items-center'>
                                    <Plus size={17} style={{marginRight:'5px'}}/>
                                    <span >Create AD Campaign</span>
                            </div>
                            </Button.Ripple>}
                            <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(adCampaignList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(adCampaignList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(adCampaignList)}>
                                    <File size={15} />
                                    <span className='align-middle ml-50'>
                                        PDF
                                    </span>
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
                    <CommonDataTable column={column} TableData={searchValue.length ? filteredData : adCampaignList} TableDataLoading={TableDataLoading} />
                </Card>
              </TabPane>
              <TabPane tabId='2'>
                <PendingADCampaignList pendingadCampaignList={pendingadCampaignList} setPendingadCampaignList={setPendingadCampaignList} resetData={resetData} setReset={setReset} quotalist={quotalist} MerchantList={MerchantList} />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
    )
}

export default ADCampaignList