import {React, useEffect, useState, useRef, Fragment } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { subMenuIDs } from '../../../../../../../utility/Utils'
import classnames from 'classnames'
import {Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import ServerSideDataTable from '../../../ServerSideDataTable'
import { Success, Error } from '../../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../../helper'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'
import { BMS_PASS, BMS_USER } from '../../../../../../../Configurables'
import CommonDataTable from '../../ClientSideDataTable'
import DatapackList from './DatapackList'
import MypendingDatapackList from './MypendingDatapackList'
import NeedApproveDatapackList from './NeedApproveDatapackList'

const DatapackListMain = () => {
const userName = localStorage.getItem('username')
const [datapackList, setDatapackList] = useState([])
const [penDatapackList, setPenDatapackList] = useState([])
const [myPenDatapackList, setMyPenDatapackList] = useState([])
const [TableDataLoading, setTableDataLoading] = useState(true)
const [filteredData, setFilteredData] = useState([])
const [ref_id, setref_id] = useState(null)

const [refresh, setrefresh] = useState(1)
const [activeTab, setActiveTab] = useState('1')
// ** Function to toggle tabs
const toggle = tab => setActiveTab(tab)

useEffect(async () => {
    await useJwt.datapackList().then(res => {
        console.log(res)
        setDatapackList(res.data.payload)
        setTableDataLoading(false)
    }).catch(err => {
        Error(err)
        console.log(err.response)
        setTableDataLoading(false)
    })
    await useJwt.datapackPendingList().then(res => {
        console.log(res)
        const pending = []
        const myPending = []
        for (const item of res.data.payload) {
            if (item.modifiedBy === userName) {
                myPending.push(item)
            } else {
                pending.push(item)
            }
        }
        setMyPenDatapackList(myPending)
        setPenDatapackList(pending)
        setTableDataLoading(false)
    }).catch(err => {
        Error(err)
        console.log(err.response)
        setTableDataLoading(false)
    })
}, [refresh])
    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <Nav tabs>
                        <NavItem>
                            <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                                <span className='align-middle d-none d-sm-block'>Datapack List</span>
                            </NavLink>
                        </NavItem>
                        {subMenuIDs.includes(34) && <NavItem>
                            <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                                <span className='align-middle d-none d-sm-block'>My Pending</span>
                            </NavLink>
                        </NavItem>}
                        {subMenuIDs.includes(34) && <NavItem>
                            <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                                <span className='align-middle d-none d-sm-block'>Approve</span>
                            </NavLink>
                        </NavItem>}
                    </Nav>
                </CardHeader>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId='1'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Datapack</CardTitle>
                                <div>
                                    {subMenuIDs.includes(16) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createDatapackList' >
                                        <div className='d-flex align-items-center'>
                                            <Plus size={17} style={{ marginRight: '5px' }} />
                                            <span >Create Datapack</span>
                                        </div>
                                    </Button.Ripple>}

                                </div>
                            </CardHeader>

                            <DatapackList datapackList={datapackList} TableDataLoading={TableDataLoading} refresh={refresh} setrefresh={setrefresh} />
                        </Card>
                    </TabPane>
                    <TabPane tabId='2'>

                        <MypendingDatapackList datapackList={myPenDatapackList} TableDataLoading={TableDataLoading}/>

                    </TabPane>

                    <TabPane tabId='3'>

                        <NeedApproveDatapackList datapackList={penDatapackList} TableDataLoading={TableDataLoading} refresh={refresh} setrefresh={setrefresh}/>

                    </TabPane>
                </TabContent>
            </Card>
        </Fragment>
    )
}

export default DatapackListMain