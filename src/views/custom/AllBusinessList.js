import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    CheckSquare, Share, XSquare, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import classnames from 'classnames'
import Select from 'react-select'
import { formatReadableDate } from '../helper'
import BusinessTable from './BussinessTable'
import PendingBusinessList from './PendingBusinessList'

const AllBusinessList = () => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableDataLoading1, setTableDataLoading1] = useState(false)
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    // useEffect(() => {
    //     const asyncApiCall = async () => {
    //         await useJwt.customerBusinessList().then(async res => {
    //             console.log(res)
    //             const { payload } = res.data
    //             setBusinessList(payload)
    //             setpms_merchantid(payload[0].pms_merchantid)
    //             await getPendingVoucherList(payload[0].pms_merchantid)
    //           }).catch(err => {
    //             console.log(err.response)
    //             Error(err)
    //           })
    //         getVoucherList(/* pms_merchantid */)
    //     }
    //     asyncApiCall()
    // }, [/* pms_merchantid */resetData])


    return (
        <Fragment>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Business List
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >Pending Business List
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                       <BusinessTable />
                    </TabPane>
                    <TabPane tabId="2">
                        <PendingBusinessList />
                    </TabPane>
                </TabContent>
            </Card>
        </Fragment>
    )
}

export default AllBusinessList