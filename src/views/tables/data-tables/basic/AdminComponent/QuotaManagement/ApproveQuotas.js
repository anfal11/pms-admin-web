import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, Modal, ModalHeader, ModalBody, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'
import classnames from 'classnames'

const PendingQuotaList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const user = JSON.parse(localStorage.getItem('userData')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const [reset, setReset] = useState(false)
    const [modal, setmodal] = useState(false)
    const toggleModal = () => setmodal(m => !m)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableData, setTableData] = useState([])

    const [SelectedMerchantLoading, setSelectedMerchantLoading] = useState(false)
    const [budgetpercentage, setbudgetpercentage] = useState(1)
    const [budgets, setBudgets] = useState([])
    const [pendingBudgets, setPendingBudgets] = useState([])
    const [businessList, setBusinessList] = useState([])

    useEffect(async () => {
        await useJwt.campaignBudgetList().then(res => {
            const { payload } = res.data
            console.log('campaignBudgetList', payload)
            setBudgets(payload)
            setTableDataLoading(false)
        }).catch(err => {
            console.log(err.response)
            setTableDataLoading(false)
            Error(err)
        })
        await useJwt.campaignBudgetPendingList().then(res => {
            const { payload } = res.data
            console.log('campaignBudgetPendingList', payload)
            setPendingBudgets(payload)
            setTableDataLoading(false)
        }).catch(err => {
            console.log(err.response)
            setTableDataLoading(false)
            Error(err)
        })
        await useJwt.customerBusinessList().then(async res => {
            console.log(res)
            const { payload } = res.data
            setBusinessList(payload)
          }).catch(err => {
            console.log(err.response)
            Error(err)
          })
    }, [reset])
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handlePoPupActions = (id, status, message) => {
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
                    budget_id:id,
                    action_id:status
                }
                console.log(data)
                return useJwt.campaign_budget_approve_reject_delete(data).then(res => {
                    Success(res)
                    console.log(res)
                    setPendingBudgets(pendingBudgets.filter(x => x.id !== id))
                    setReset(!reset)
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
    const column = [
        {
            name: 'Proposed By',
            minWidth: '150px',
            sortable: true,
            selector: row => {
                return businessList.find(b => b.id === row.created_by)?.businessname
            }
        },
        {
            name: 'Current Balance',
            minWidth: '100px',
            sortable: true,
            selector: 'current_balance'
        },
        {
            name: 'Previous Balance',
            minWidth: '100px',
            sortable: true,
            selector: 'previous_balance'
        },
        {
            name: 'Proposed Budget',
            minWidth: '120px',
            sortable: true,
            selector: 'proposed_budget'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: row => formatReadableDate(row.created_at)
        }
    ]
    const action1 = [
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return user.id === parseInt(row.action_by) ? 'pending' : <>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?')}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 2, 'Do you want to reject?')}
                        />
                    </span>
                </>
            }
        }
    ]
    const action2 = [
        {
            name: 'Action',
            minWidth: '100px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
                        />
                    </span>
                </>
            }
        }
    ]


    const onSelectedMerchantSubmit = (e) => {
        e.preventDefault()
        const body = { proposed_budget: budgetpercentage }
        console.log(body)
        // return 0
        setSelectedMerchantLoading(true)
        useJwt.createCampaignBudget(body).then((response) => {
            setReset(!reset)
            setSelectedMerchantLoading(false)
            Success(response)
            setbudgetpercentage(0)
            toggleModal()
        }).catch((error) => {
            setSelectedMerchantLoading(false)
            Error(error)
            console.log(error)
        })
    }
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    return (
        <>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Quota Request List
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >Pending Quota Request List
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Card>
                            <CardHeader></CardHeader>
                            <CardBody>
                                <CommonDataTable column={[...column, ...action2]} TableData={searchValue.length ? filteredData : budgets} TableDataLoading={TableDataLoading} />
                            </CardBody>
                        </Card>
                    </TabPane>
                    <TabPane tabId="2">
                        <Card>
                            <CardBody>
                                <CommonDataTable column={[...column, ...action1]} TableData={searchValue.length ? filteredData : pendingBudgets} TableDataLoading={TableDataLoading} />
                            </CardBody>
                        </Card>
                    </TabPane>
                </TabContent>
            </Card>
            <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
                <ModalHeader toggle={toggleModal}>Request For Quota</ModalHeader>
                <ModalBody>
                    <Form style={{ width: '100%' }} onSubmit={onSelectedMerchantSubmit} autoComplete="off">
                        <Row>
                            <Col md='12'>
                                <FormGroup>
                                    <Label>Quota Amount</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        // max={100}
                                        step='0.01'
                                        name={budgetpercentage}
                                        id={budgetpercentage}
                                        value={budgetpercentage}
                                        onChange={e => {
                                            setbudgetpercentage(e.target.value)
                                        }}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='12' className='text-center' style={{ paddingTop: '23px' }}>
                                {
                                    SelectedMerchantLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default PendingQuotaList