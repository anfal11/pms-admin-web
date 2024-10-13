import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormPointRule, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputPointRule, InputPointRuleAddon, InputPointRuleText, CustomInput
} from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { formatReadableDate } from '../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const PendingPointRuleList = ({pendingPointRuleList, setPendingPointRuleList, businessList, handleBusinessChange, TableDataLoading1, resetData, setReset}) => {
    const user = JSON.parse(localStorage.getItem('userData'))

    const [searchValue, setSearchValue] = useState('')
    const [merId, setMerId] = useState('')
    const [filteredData, setFilteredData] = useState([])


    const handlePoPupActions = (merchantId, id, status, message) => {
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
                    rule_id: id,
                    createdby: user.id,
                    trigger: status
                }
                // localStorage.setItem('usePMStoken', true)
                // return useJwt.skuruleAction(merchantId, data).then(res => {
                //     Success(res)
                //     console.log(res)
                //     setPendingPointRuleList(pendingPointRuleList.filter(x => x.id !== id))
                //     localStorage.setItem('usePMStoken', false)
                //     setReset(!resetData)
                //     handleBusinessChange(merId)
                // }).catch(err => {
                //     console.log(err)
                //     localStorage.setItem('usePMStoken', false)
                //     Error(err)
                // })
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
        updatedData = pendingPointRuleList.filter(item => {
            const startsWith =
            item.operation.toLowerCase().startsWith(value.toLowerCase()) ||
            item.Id.toLowerCase().startsWith(value.toLowerCase()) ||
            item.CreatedBy.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.CreatedAt).toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.operation.toLowerCase().includes(value.toLowerCase()) ||
            item.Id.toLowerCase().includes(value.toLowerCase()) ||
            item.CreatedBy.toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.CreatedAt).toLowerCase().includes(value.toLowerCase())

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
            name: 'Business Name',
            minWidth: '160px',
            sortable: true,
            selector: row => {
                return businessList.find(b => b.pms_merchantid === row.merchantid)?.businessname || '---'
            }
        },
        {
            name: 'SKU Points',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUPoints'
        },
        {
            name: 'Is Range',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.IsRange ? <Badge pill color='success' className='badge-center'>
                True
              </Badge> : <Badge pill color='danger' className='badge-center'>
                False
              </Badge>
            }
        },
        {
            name: 'SKU Amount',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUAmount'
        },
        {
            name: 'SKU Start Range',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUStartRange'
        },
        {
            name: 'SKU End Range',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUEndRange'
        },
        {
            name: 'Product ID',
            minWidth: '250px',
            sortable: true,
            selector: 'product_id'
        },
        {
            name: 'Created By',
            minWidth: '160px',
            sortable: true,
            selector: 'CreatedBy'
        },
        {
            name: 'Operation',
            minWidth: '160px',
            sortable: true,
            selector: 'operation'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.CreatedAt ? formatReadableDate(item.CreatedAt) : null
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.CreatedBy === user.username ? <h6 style={{margin:'0', color:'orange'}}>Pending</h6> : <>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.merchantid, row.Id, 1, 'Do you want to approve?')}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.merchantid, row.Id, 2, 'Do you want to reject?')}
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
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending PointRules</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(pendingPointRuleList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(pendingPointRuleList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div>
            </CardHeader>
            {businessList.length > 1 && <Card>
                <CardBody style={{zIndex: '5'}}>
                    <Label for="Business">Select a Business</Label>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={businessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })[0]}
                        onChange={e => {
                            handleBusinessChange(e.value)
                            setMerId(e.value)
                        }}
                        options={businessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })}
                    />
                </CardBody>
            </Card>}
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingPointRuleList} TableDataLoading={TableDataLoading1} />
        </Card>
    )
}

export default PendingPointRuleList