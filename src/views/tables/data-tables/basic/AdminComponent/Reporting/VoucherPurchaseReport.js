import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    Eye, ChevronLeft, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import ServerSideDataTable from '../../ServerSideDataTable'
import { Success, Error } from '../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'

const VoucherPurchaseReport = ({voucherid, setgotoPurchaseReport}) => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [loadingPurchaseReport, setloadingPurchaseReport] = useState(false)
    //const [VoucherReport, setVoucherReport] = useState(data)
    const [VoucherReport, setVoucherReport] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    function addDays(numDays) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() + numDays)
        const dd = String(nowDate.getDate()).padStart(2, '0')
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0')
        const y = nowDate.getFullYear()
        return `${y}-${mm}-${dd}`
    }
    function minDays(numDays) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() - numDays)
        const dd = String(nowDate.getDate()).padStart(2, '0')
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0')
        const y = nowDate.getFullYear()
        return `${y}-${mm}-${dd}`
    }
    const [userInput, setUserInput] = useState({
        startDate: minDays(1),
        endDate: addDays(0)
    })
    const { startDate, endDate } = userInput

    const getData = (page, limit, startDate, endDate) => {
        useJwt2.pmsVoucherPurchaseReportList({voucherid}).then(res => {
            setVoucherReport(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err.response)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        // getData(page.selected + 1, 50, startDate, endDate)
        // setCurrentPage(page.selected)
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50, startDate, endDate)
    }, [])

    const back = () => {

        setgotoPurchaseReport(false)
    }

    const column = [
        {
            name: 'Voucher Code',
            minWidth: '200px',
            selector: 'voucher_code',
            wrap: true
        },
        {
            name: 'Receiver-Mobile',
            minWidth: '100px',
            selector: 'mobile',
            wrap: true
        },
        {
            name: 'Reedem At',
            minWidth: '100px',
            selector: item => {
                if (item['reedemat']) {
                    return formatReadableDate(item['reedemat'])
                } else {
                    return 'N/A'
                }
            }
        }
    ]


    return (
        <>
         <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader>
                    <CardTitle>Voucher-Purchase-Report</CardTitle>
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={VoucherReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
        </>
    )
}

export default VoucherPurchaseReport