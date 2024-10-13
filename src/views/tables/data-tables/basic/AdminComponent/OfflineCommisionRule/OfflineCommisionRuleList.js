import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useEffect, useState } from 'react'
import { Edit, File, FileText, Grid, Plus, Share, Trash, Eye } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import DetailsModal from './DetailsModal'
import PendingOfflineCommisionRuleList from './PendingOfflineCommisionRuleList'
const MySwal = withReactContent(Swal)

const OfflineCommisionRuleList = () => {
    const history = useHistory()
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const username = localStorage.getItem('username')

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [offlineRuleList, setofflineRuleList] = useState([])
    const [pendingOfflineRuleList, setpendingOfflineRuleList] = useState([])
    const [offlineRuleInfo, setOfflineRuleInfo] = useState({})
    const [serviceList, setserviceList] = useState([])

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    useEffect(() => {
       const callApi = async () => {
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        await useJwt.offlineRuleList().then(res => {
            console.log(res)
            setofflineRuleList(res.data)
            localStorage.setItem('useBMStoken', false)
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
            console.log(err)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
        localStorage.setItem('useBMStoken', true)
        await useJwt.pendingOfflineRuleList().then(res => {
            console.log(res)
            setpendingOfflineRuleList(res.data)
            localStorage.setItem('useBMStoken', false)
            setTableDataLoading(false)
        }).catch(err => {
            // Error(err)
            console.log(err)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
        // localStorage.setItem('useBMStoken', false)
        // await useJwt.getServiceList().then(res => {
        //     console.log(res)
        //     setserviceList(res.data.payload)
        //     localStorage.setItem('useBMStoken', false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     localStorage.setItem('useBMStoken', false)
        // })
       }
       callApi()
    }, [resetData])
    const handlePoPupActions = (id, message) => {
        localStorage.setItem('useBMStoken', true)
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
                return useJwt.deleteOfflineRule(id).then(res => {
                    Success(res)
                    console.log(res)
                    localStorage.setItem('useBMStoken', false)
                    setReset(!resetData)
                }).catch(err => {
                    localStorage.setItem('useBMStoken', false)
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
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = offlineRuleList.filter(item => {
            const startsWith =
            item.offlineRuleName.toLowerCase().startsWith(value.toLowerCase()) ||
            item.bonusAmount.toString().toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.offlineRuleName.toLowerCase().includes(value.toLowerCase()) ||
            item.bonusAmount.toString().toLowerCase().includes(value.toLowerCase())

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
            name: 'Rule Name',
            minWidth: '250px',
            sortable: true,
            selector: 'offlineRuleName'
        },
        {
            name: 'Amount',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.bonusAmount || '---'
            }
        },
        {
            name: 'Is Active?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                 return row.isActive ? <Badge pill color='success' className='badge-center'>True
                </Badge>  : <Badge pill color='danger' className='badge-center'>False</Badge>
             }
        },
        {
            name: 'Reward Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => { return row.userType === 's' ? 'Sender' : row.userType === 'r' ? 'Receiver' : row.userType === 'b' ? 'Both' : '' }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="view">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setOfflineRuleInfo(row)
                                setModal(true)
                            }}
                        /> 
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                localStorage.setItem('useBMStoken', true)
                                useJwt.checkOfflineRule(row.id, 2).then(res => {
                                    console.log(res)
                                    localStorage.setItem('useBMStoken', false)
                                    if (res.data.status) {
                                        localStorage.setItem('offlineRule', JSON.stringify(row))
                                        history.push('/editOfflineRules')
                                    } else {
                                        return MySwal.fire({
                                            title: 'You can not update!',
                                            text: `The rule has already requested for ${res.data.term === 2 ? 'UPDATE' : res.data.term === 3 ? 'DELETE' : ''} by ${res.data.user.toUpperCase() === username.toUpperCase() ? 'you' : res.data.user.toUpperCase()}.`,
                                            icon: 'warning',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            showCancelButton: false,
                                            confirmButtonText: 'Ok',
                                            customClass: {
                                                confirmButton: 'btn btn-primary',
                                                cancelButton: 'btn btn-danger ml-1'
                                            },
                                            showLoaderOnConfirm: true,
                                            preConfirm: () => {
                                                return 0
                                            },
                                            buttonsStyling: false,
                                            allowOutsideClick: () => !Swal.isLoading()
                                        }).then(function (result) {
                                            if (result.isConfirmed) {}
                                        })
                                    }
                                }).catch(err => {
                                    console.log(err)
                                    Error(err)
                                    localStorage.setItem('useBMStoken', false)
                                })
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                localStorage.setItem('useBMStoken', true)
                                useJwt.checkOfflineRule(row.id, 3).then(res => {
                                    console.log(res)
                                    localStorage.setItem('useBMStoken', false)
                                    if (res.data.status) {
                                        return handlePoPupActions(row.id, 'Do you want to delete?')
                                    } else {
                                        return MySwal.fire({
                                            title: 'You can not delete!',
                                            text: `The rule has already requested for ${res.data.term === 2 ? 'UPDATE' : res.data.term === 3 ? 'DELETE' : ''} by ${res.data.user.toUpperCase() === username.toUpperCase() ? 'you' : res.data.user.toUpperCase()}.`,
                                            icon: 'warning',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            showCancelButton: false,
                                            confirmButtonText: 'Ok',
                                            customClass: {
                                                confirmButton: 'btn btn-primary',
                                                cancelButton: 'btn btn-danger ml-1'
                                            },
                                            showLoaderOnConfirm: true,
                                            preConfirm: () => {
                                                return 0
                                            },
                                            buttonsStyling: false,
                                            allowOutsideClick: () => !Swal.isLoading()
                                        }).then(function (result) {
                                            if (result.isConfirmed) {}
                                        })
                                    }
                                }).catch(err => {
                                    console.log(err)
                                    Error(err)
                                    localStorage.setItem('useBMStoken', false)
                                })
                            }}
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
        doc.text('Offline Campaign Rules', 14, 10) 
        doc.autoTable({
        body: [...list],
        columns: [
            { header: 'Rule Name', dataKey: 'offlineRuleName' }, { header: 'Is Active?', dataKey: 'isActive' }, { header: 'Amount', dataKey: 'bonusAmount' },
                { header: 'Commision Reciever', dataKey: 'userType' }
            ],
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
                  <span className='align-middle d-none d-sm-block'>Offline Rules</span>
                </NavLink>
              </NavItem>
              {subMenuIDs.includes(21) && <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                  <span className='align-middle d-none d-sm-block'>Approve Offline Rules</span>
                </NavLink>
              </NavItem>}
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Offline Campaign Rules</CardTitle>
                        <div>
                            {subMenuIDs.includes(20) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createOfflineRules' >
                            <div className='d-flex align-items-center'>
                                    <Plus size={17} style={{marginRight:'5px'}}/>
                                    <span >Add Offline Rule</span>
                            </div>
                                </Button.Ripple>}
                        <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(offlineRuleList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(offlineRuleList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(offlineRuleList)}>
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
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : offlineRuleList} TableDataLoading={TableDataLoading} />
                        <DetailsModal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            commisionInfo={offlineRuleInfo}
                            serviceList={serviceList}
                        />
                </Card>
              </TabPane>
              <TabPane tabId='2'>
                <PendingOfflineCommisionRuleList setReset={setReset} resetData={resetData} TableDataLoading={TableDataLoading} pendingOfflineRuleList={pendingOfflineRuleList} setpendingOfflineRuleList={setpendingOfflineRuleList} serviceList={serviceList}/>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
    )
}

export default OfflineCommisionRuleList