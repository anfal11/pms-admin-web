import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    CheckSquare, Share, XSquare, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import ServiceservicePointRuleList from './ServicePointRuleList'
import PendingList from './PendingList'
const MySwal = withReactContent(Swal)
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'

const AllTabs = () => {
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [servicePointRuleList, setservicePointRuleList] = useState([])
    const [pendingServicePointRuleList, setpendingServicePointRuleList] = useState([])
    const [tierList, settierList] = useState([])
    const [ServiceList, setserviceList] = useState([])
    const toggleReset = () => {
        setReset(!resetData)
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.getServicePointRules().then(res => {
        //     console.log(res)
        //     setservicePointRuleList(res.data.data)
        //     localStorage.setItem('usePMStoken', false)
        //     setTableDataLoading(false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        // })

        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.pendingServicePointRules().then(res => {
        //     setpendingServicePointRuleList(res.data.data)
        //     console.log('pendingServicePointRules', res.data.data)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        // }).finally(() => {
        //     localStorage.setItem('usePMStoken', false)
        //     setTableDataLoading(false)
        // })
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.tierList().then(res => {
            console.log('tierList', res.data)
            settierList(res.data.payload)
            // setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            // setTableDataLoading(false)
        })

        localStorage.setItem('useBMStoken', true)
        await useJwt.getServiceList().then(res => {
            console.log('getServiceList', res)
            setserviceList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                    localStorage.setItem('BMStoken', res.data.jwtToken)
                    localStorage.setItem("BMSCall", false)
                    setReset(!reset)
                }).catch(err => {
                    localStorage.setItem("BMSCall", false)
                    console.log(err)
                })
            } else {
                Error(err)
                localStorage.setItem('useBMStoken', false)
            }
        })
    }, [resetData])

    return (
        <>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > List
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >Pending List
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <ServiceservicePointRuleList TableDataLoading={TableDataLoading} servicePointRuleList={servicePointRuleList} toggleReset={toggleReset} tierList={tierList} ServiceList={ServiceList}/>
                    </TabPane>
                    <TabPane tabId="2">
                        <PendingList TableDataLoading={TableDataLoading} pendingServicePointRuleList={pendingServicePointRuleList} tierList={tierList} ServiceList={ServiceList}/>
                    </TabPane>
                </TabContent>
            </Card>
        </>
    )
}

export default AllTabs