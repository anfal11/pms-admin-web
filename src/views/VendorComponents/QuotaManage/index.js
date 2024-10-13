import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput, Modal, ModalHeader, ModalBody
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { formatReadableDate } from '../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import 'jspdf-autotable'
import classnames from 'classnames'

const MrchntBudgetTable = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
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

    useEffect(async () => {
        await useJwt.campaignBudgetList().then(res => {
            const { payload } = res.data
            console.log(payload)
            setBudgets(payload)
            setTableDataLoading(false)
        }).catch(err => {
            console.log(err.response)
            setTableDataLoading(false)
            Error(err)
        })
        await useJwt.campaignBudgetPendingList().then(res => {
            const { payload } = res.data
            console.log(payload)
            setPendingBudgets(payload)
            setTableDataLoading(false)
        }).catch(err => {
            console.log(err.response)
            setTableDataLoading(false)
            Error(err)
        })
    }, [reset])
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const column = [
        {
            name: 'Merchant Phone',
            minWidth: '150px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'Proposed Budget',
            minWidth: '120px',
            sortable: true,
            selector: 'proposed_budget'
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
            name: 'Action',
            minWidth: '100px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Created At',
            minWidth: '220px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: row => formatReadableDate(row.created_at)
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
                            <CardHeader className='border-bottom'>
                                <CardTitle></CardTitle>
                                <CardTitle>
                                    <Button.Ripple className='ml-2' color='primary' onClick={toggleModal}>
                                        <span >Request For Quota</span>
                                    </Button.Ripple>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <CommonDataTable column={column} TableData={searchValue.length ? filteredData : budgets} TableDataLoading={TableDataLoading} />
                            </CardBody>
                        </Card>
                    </TabPane>
                    <TabPane tabId="2">
                        <Card>
                            <CardBody>
                                <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingBudgets} TableDataLoading={TableDataLoading} />
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

export default MrchntBudgetTable