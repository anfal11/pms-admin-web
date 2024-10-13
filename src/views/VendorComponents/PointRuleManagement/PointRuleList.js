import useJwt from '@src/auth/jwt/useJwt'
import React, { useEffect, useState } from 'react'
import { Edit, File, FileText, Grid, Plus, Share, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { Button, Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { formatReadableDate } from '../../helper'
import { Error, Success } from '../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import EditModal from './EditModal'
const MySwal = withReactContent(Swal)
import PendingPointRuleList from './PendingPointRuleList'

const PointRuleList = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableDataLoading1, setTableDataLoading1] = useState(false)
    const [resetData, setReset] = useState(true)
    const [pointRuleList, setPointRuleList] = useState([])
    const [pointRuleInfo, setPointRuleInfo] = useState({})
    const [businessList, setBusinessList] = useState([])
    const [pendingPointRuleList, setPendingPointRuleList] = useState([])

    const [activeTab, setActiveTab] = useState('1')
    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))

    const getPendingPointRuleList = async (pms_merchantid) => {
        // setTableDataLoading1(true)
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.getPendingRules(pms_merchantid).then(res => {
        //     setTableDataLoading1(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     setPendingPointRuleList(res.data.data)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     // Error(err)
        //     setPendingPointRuleList([])
        //     console.log(err.response)
        //     setTableDataLoading1(false)
        // })
    }
    const handleBusinessChange = (value) => {
        getPendingPointRuleList(value)
    }

    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // const merchantId = BusinessList[0].pms_merchantid
        // await useJwt.getMyRules(merchantId).then(res => {
        //     console.log(res)
        //     setPointRuleList(res.data.data)
        //     localStorage.setItem('usePMStoken', false)
        //     setTableDataLoading(false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        // })
        await useJwt.customerBusinessList().then(async res => {
            console.log(res)
            const { payload } = res.data
            setBusinessList(payload.filter(e => e.id !== user.id))
            await getPendingPointRuleList(payload[0].pms_merchantid)
          }).catch(err => {
            console.log(err)
            Error(err)
          })
    }, [resetData])
    const handlePoPupActions = (id, message) => {
        localStorage.setItem('usePMStoken', true)
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
                // return true
                // const merchantId = BusinessList[0].pms_merchantid
                // const ruleId = parseInt(id)
                // return useJwt.deleteMyRule(merchantId, { rule_id: ruleId, createdby: user.id }).then(res => {
                //     Success(res)
                //     console.log(res)
                //     setPointRuleList(pointRuleList.filter(x => x.Id !== id))
                //     localStorage.setItem('usePMStoken', false)
                // }).catch(err => {
                //     localStorage.setItem('usePMStoken', false)
                //     console.log(err.response)
                //     Error(err)
                // })

                localStorage.setItem('usePMStoken', false)
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
        updatedData = pointRuleList.filter(item => {
            const startsWith =
            item.SKUPoints.toLowerCase().startsWith(value.toLowerCase()) ||
            item.SKUAmount.toLowerCase().startsWith(value.toLowerCase()) || 
            item.SKUStartRange.toLowerCase().startsWith(value.toLowerCase()) || 
            item.SKUEndRange.toLowerCase().startsWith(value.toLowerCase()) || 
            formatReadableDate(item.CreatedAt).toLowerCase().startsWith(value.toLowerCase()) ||
            item.product_id?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.CreatedBy?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.SKUPoints.toLowerCase().includes(value.toLowerCase()) ||
            item.SKUAmount.toLowerCase().includes(value.toLowerCase()) ||
            item.SKUStartRange.toLowerCase().includes(value.toLowerCase()) || 
            item.SKUEndRange.toLowerCase().includes(value.toLowerCase()) || 
            formatReadableDate(item.CreatedAt).toLowerCase().includes(value.toLowerCase()) ||
            item.product_id?.toLowerCase().includes(value.toLowerCase()) ||
            item.CreatedBy?.toLowerCase().includes(value.toLowerCase())

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
            name: 'SL.',
            minWidth: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
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
            selector: (item) => {
                return item.IsRange ? 'True' : 'False'
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
            minWidth: '100px',
            sortable: true,
            selector: 'product_id'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.CreatedAt ? formatReadableDate(item.CreatedAt) : null
               }
        },
        // {
        //     name: 'SKU End Range',
        //     minWidth: '100px',
        //     // sortable: true,
        //     selector: row => {
        //         const statusBG = {
        //             0: { title: 'Inactive', color: 'light-danger' },
        //             1: { title: 'Active', color: 'light-success' }
        //         }
        //         return <Badge color={statusBG[row.userstatus].color} pill className='px-1'>
        //             {statusBG[row.userstatus].title}
        //         </Badge>
        //     }
        // },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setPointRuleInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.Id, 'Do you want to delete?')}
                        />
                    </span>
                </>
            }
        }
    ]
    return (
        <Card>
            <CardHeader>
                <Nav tabs>
                <NavItem>
                    <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                    <span className='align-middle d-none d-sm-block'>SKU Rules</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                    <span className='align-middle d-none d-sm-block'>Pending SKU Rules</span>
                    </NavLink>
                </NavItem>
                </Nav>
            </CardHeader>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>SKU Rules</CardTitle>
                        <div>
                        <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createPointRule' >
                            <div className='d-flex align-items-center'>
                                <Plus size={17} style={{ marginRight: '5px' }} />
                                <span >Create SKU Rule</span>
                            </div>
                        </Button.Ripple>
                        <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(pointRuleList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(pointRuleList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(pointRuleList)}>
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
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pointRuleList} TableDataLoading={TableDataLoading} />
                        
                        <EditModal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            pointRuleInfo={pointRuleInfo}
                            setPointRuleInfo={setPointRuleInfo}
                        />
                </Card>
              </TabPane>
              <TabPane tabId='3'>
                <PendingPointRuleList pendingPointRuleList={pendingPointRuleList} setPendingPointRuleList={setPendingPointRuleList} businessList={businessList} handleBusinessChange={handleBusinessChange} TableDataLoading1={TableDataLoading1} resetData={resetData} setReset={setReset} />
              </TabPane>
            </TabContent>
        </Card>

        // <Card>
        //     <CardHeader className='border-bottom'>
        //         <CardTitle tag='h4'>SKU Rules</CardTitle>
        //         <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createPointRule' >
        //            <div className='d-flex align-items-center'>
        //                 <Plus size={17} style={{marginRight:'5px'}}/>
        //                 <span >Create SKU Rule</span>
        //            </div>
        //          </Button.Ripple>
        //     </CardHeader>
        //     <CardBody>
        //         <Row>
        //             <Col md='12'>
        //                 <CommonDataTable column={column} TableData={pointRuleList} TableDataLoading={TableDataLoading} />
        //             </Col>
        //         </Row>
        //         <EditModal
        //             toggleModal={toggleModal}
        //             modal={modal}
        //             resetData={resetData}
        //             setReset={setReset}
        //             pointRuleInfo={pointRuleInfo}
        //             setPointRuleInfo={setPointRuleInfo}
        //         />
        //     </CardBody>
        // </Card>
    )
}

export default PointRuleList