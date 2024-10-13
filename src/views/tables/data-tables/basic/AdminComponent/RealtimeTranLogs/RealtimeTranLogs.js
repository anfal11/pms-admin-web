import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useEffect, useState } from 'react'
import { Eye, File, FileText, Grid, RefreshCw, Share } from 'react-feather'
import { Badge, Button, Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Spinner, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { formatReadableDate } from '../../../../../helper'
import { Error } from '../../../../../viewhelper'
import ServerSideDataTable from './ServerSIdeDataTable'
import ViewModal from './ViewModal'
const MySwal = withReactContent(Swal)

const RealtimeTranLogs = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [tranLogs, setTranLogs] = useState([])
    const [serviceList, setserviceList] = useState([])
    const [modalData, setModalData] = useState({})
    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

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
        startDate: minDays(30),
        endDate: addDays(0)
    })
    const { startDate, endDate } = userInput

    const getData = (page, limit, startDate, endDate) => {
        setTableDataLoading(true)
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        useJwt.realtimeTranLogs(page, limit, startDate, endDate).then(res => {
            console.log(res)
            setTranLogs(res.data.content)
            setRowCount(res.data.totalElements)
            localStorage.setItem('useBMStoken', false)
            setTableDataLoading(false)
        }).catch(err => {
            console.log(err)
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
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
    }
    const handlePagination = page => {
        getData((page.selected - 1) + 1, 10, startDate, endDate)
        setCurrentPage(page.selected)
    }

    useEffect(async () => {
        getData(0, 10, startDate, endDate)
        localStorage.setItem('useBMStoken', true)
        await useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data)
            setTableDataLoading(false)
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
            console.log(err.response)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
    }, [resetData])

    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        getData(0, 50, startDate, endDate)
    }

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = tranLogs.filter(item => {
                const startsWith =
                    item.tranId.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.tranAmount.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.sourceAcct.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.destAcct.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.commissionId.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.tranDate).toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.serviceId.toString().toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.tranId.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.tranAmount.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.sourceAcct.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.destAcct.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.commissionId.toString().toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.tranDate).toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.serviceId.toString().toLowerCase().includes(value.toLowerCase())

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
            name: 'Transaction ID',
            minWidth: '250px',
            sortable: true,
            selector: 'tranId'
        },
        {
            name: 'Voucher-Reward',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                if (row['is_voucher']) {
                    return 'True'
                } else {
                    return 'False'
                }
            }
        },
        {
            name: 'Datapack-Reward',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                if (row['is_datapack']) {
                    return 'True'
                } else {
                    return 'False'
                }
            }
        },
        {
            name: 'Cashback-Reward',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                if (!row['is_datapack'] && !row['is_voucher']) {
                    return 'True'
                } else {
                    return 'False'
                }
            }
        },
        {
            name: 'Campaign Rule',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: row => {
                return row.campaignInfo?.ruleInfo?.commissionRuleName
            }
        },
        {
            name: 'Campaign Name',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: row => {
                return row.campaignInfo?.campaignName
            }
        },
        {
            name: 'Service',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: row => {
                return serviceList.find(s => s.serviceId === row.serviceId)?.serviceKeyword
            }
        },
        {
            name: 'TXN Amount',
            minWidth: '100px',
            sortable: true,
            selector: 'tranAmount'
        },
        {
            name: 'Sender MSISDN',
            minWidth: '150px',
            sortable: true,
            selector: 'sourceAcct'
        },
        {
            name: 'Receiver MSISDN',
            minWidth: '150px',
            sortable: true,
            selector: 'destAcct'
        },
        {
            name: 'Exterior',
            minWidth: '150px',
            sortable: true,
            selector: 'exteriorAcct'
        },
        {
            name: 'Reward',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.amount ? row.amount : 0
            }
        },
        {
            name: 'Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.receiver === 's' ? 'Sender' : row.receiver === 'r' ? 'Receiver' :  row.receiver === 'e' ? 'Exterior' : row.receiver === 'b' ? 'Both' : ''
            }
        },
        {
            name: 'Disbursed?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.status === 1 ? <Badge pill color='success' className='badge-center'>
                    Successful
                </Badge> : row.status === 0 ? <Badge pill color='danger' className='badge-center'>
                    Failed
                </Badge> : row.status === -1 ? <Badge pill color='primary' className='badge-center'>
                    Submitted
                </Badge> : <Badge pill color='danger' className='badge-center'>
                    Failed
                </Badge>
            }
        },
        {
            name: 'Timestamp',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.tranDate ? formatReadableDate(item.tranDate) : null
            }
        },
        {
            name: 'Request Details',
            minWidth: '100px',
            wrap: true,
            selector: row => {
                return <>
                    <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setModalData({ key: 'Request Details', body: row.requestBody })
                                setModal(true)
                            }}
                        />
                    </span>
                </>
            }
        },
        {
            name: 'Disbursement Response Details',
            minWidth: '200px',
            wrap: true,
            selector: row => {
                return <>
                    <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setModalData({ key: 'Response Details', body: row.responseBody })
                                setModal(true)
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Realtime Transaction Logs', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Service', dataKey: 'serviceId' }, { header: 'TXN Amount', dataKey: 'tranAmount' }, { header: 'Sender', dataKey: 'sourceAcct' }, { header: 'Reciever', dataKey: 'destAcct' }, { header: 'Commision', dataKey: 'commissionAmount' },
                { header: 'Commision Rule', dataKey: 'commissionId' }, { header: 'Receiver', dataKey: 'receiver' }, { header: 'Status', dataKey: 'status' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <>
            <Card>
                <Form className="row p-1" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col md="3" >
                        <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <Input
                                type="date"
                                name="startDate"
                                id='startDate'
                                value={userInput.startDate}
                                onChange={onChange}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md="3" >
                        <FormGroup>
                            <Label for="endDate">Expiry Date</Label>
                            <Input
                                type="date"
                                name="endDate"
                                id='endDate'
                                value={userInput.endDate}
                                onChange={onChange}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="3" className='text-center'>
                        {
                            TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Search</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                        {/* <Label className='mr-1' for='search-input'>
                            Search
                        </Label> */}
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            placeholder='Search...'
                            id='search-input'
                            value={searchValue}
                            onChange={handleFilter}
                        />
                        <Button.Ripple className='ml-2' color='primary' size='sm'>
                            <RefreshCw
                                size={15}
                                // color='teal'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    getData(0, 10, startDate, endDate)
                                }} />
                        </Button.Ripple>

                    </Col>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(tranLogs)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(tranLogs)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(tranLogs)}>
                                <File size={15} />
                                <span className='align-middle ml-50'>
                                    PDF
                                </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={column}
                    TableData={searchValue.length ? filteredData.sort((a, b) => parseInt(b.tranId) - parseInt(a.tranId)) : tranLogs.sort((a, b) => parseInt(b.tranId) - parseInt(a.tranId))}
                    TableDataLoading={TableDataLoading} />
                {/* <CommonDataTable column={column} TableData={tranLogs.sort((a, b) => parseInt(b.tranId) - parseInt(a.tranId))} TableDataLoading={TableDataLoading} /> */}
                <ViewModal
                    toggleModal={toggleModal}
                    modal={modal}
                    resetData={resetData}
                    setReset={setReset}
                    modalData={modalData}
                />
            </Card>
        </>
    )
}

export default RealtimeTranLogs