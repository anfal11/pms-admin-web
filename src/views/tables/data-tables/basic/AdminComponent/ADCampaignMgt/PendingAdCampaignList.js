import { Business } from '@mui/icons-material'
import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useState } from 'react'
import { CheckSquare, File, FileText, Grid, Share, XSquare } from 'react-feather'
import {
    Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown
} from 'reactstrap'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import DetailsModal from './ViewDetails'
const MySwal = withReactContent(Swal)

const PendingADCampaignList = ({quotalist, MerchantList, pendingadCampaignList, setPendingadCampaignList, resetData, setReset}) => {
    const [TableDataLoading, setTableDataLoading] = useState(false)
    // const [resetData, setReset] = useState(true)
    const user = JSON.parse(localStorage.getItem('userData'))

    const [modal, setModal] = useState(false)
    const [action, setAction] = useState(0)
    const toggleModal = () => {
        setModal(!modal)
    }
    const [campaignInfo, setCampaignInfo] = useState({})

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
                    campaign_type : type?.toLowerCase()
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
        updatedData = pendingadCampaignList.filter(item => {
            const startsWith =
            item.title.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toString().toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.title.toLowerCase().includes(value.toLowerCase()) ||
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
                    return MerchantList.find(i => i.value.toString() === row.business_id.toString())?.label
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
            name: 'Operation',
            minWidth: '170px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Action by',
            minWidth: '170px',
            sortable: true,
            selector: 'action_by_name'
        },
        {
            name: 'Action At',
            minWidth: '250px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.action_at) - new Date(a.action_at)
              },
            selector: row => {
                return row.action_at ? formatReadableDate(row.action_at) : ''
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return parseInt(row.action_by) === user.id ? 'Pending' : <>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?', row.type)}
                            onClick={() => {
                                setModal(true)
                                setAction(1)
                                setCampaignInfo(row)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 2, 'Do you want to reject?', row.type)}
                            onClick={() => {
                                setModal(true)
                                setAction(2)
                                setCampaignInfo(row)
                            }}
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
    doc.text('Pending ads', 14, 10) 
    doc.autoTable({
       body: [...list],
       columns: [{ header: 'title', dataKey: 'title' }, { header: 'body', dataKey: 'body' }, { header: 'created_by_name', dataKey: 'created_by_name' }, { header: 'created_at', dataKey: 'created_at' }],
        styles: { cellPadding: 1.5, fontSize: 8 }
      })
    doc.save('export.pdf')
}
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending AD Campaign</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(pendingadCampaignList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(pendingadCampaignList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(pendingadCampaignList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingadCampaignList} TableDataLoading={TableDataLoading} />
            <DetailsModal
            modal= {modal} toggleModal = {toggleModal} action= {action} setRefresh= {setReset} refresh= {resetData} campaignInfo ={campaignInfo}/>
        </Card>
    )
}

export default PendingADCampaignList