import React, { Fragment, useEffect, useState, useRef } from 'react'
import {CheckSquare, Share, XSquare, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../viewhelper'
import classnames from 'classnames'

import BulkPurchaseListView from './bulk-purchase-list-view'
import MyPendingListView from './mypending-list-view'
import NeedApprove from './need-approval'

const VoucherBulkPurchaseList = () => {

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [voucherBulkPurchaseList, setVoucherBulkPurchaseList] = useState([])
    const [voucherBulkPurchasePendingList, setVoucherBulkPurchasePendingList] = useState([])
    const [voucherBulkPurchaseApproveList, setVoucherBulkPurchaseApproveList] = useState([])
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    
    useEffect(() => {

        setTableDataLoading(true)
        useJwt2.pmsVoucherBulkPurchaseList().then(async res => {
            console.log('res ', res)
            const { payload } = res.data
            const { approvepending = [], mypending = [], list = []} = payload
            setVoucherBulkPurchaseList(list)
            setVoucherBulkPurchasePendingList(mypending)
            setVoucherBulkPurchaseApproveList(approvepending)
            setTableDataLoading(false)
        
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err.response)
            Error(err)
        })
        
    }, [])

    return (
        <Fragment>

            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Bulk Purchase List
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >My Pending
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '3' })}
                                onClick={() => { toggle('3') }}
                            >Approve
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                    <BulkPurchaseListView voucherBulkPurchaseList={voucherBulkPurchaseList} TableDataLoading={TableDataLoading}/>
                    </TabPane>
                    <TabPane tabId="2">
                    <MyPendingListView voucherBulkPurchasePendingList={voucherBulkPurchasePendingList} TableDataLoading={TableDataLoading}/>
                    </TabPane>
                    <TabPane tabId="3">
                    <NeedApprove TableDataLoading={TableDataLoading}/>
                    </TabPane>
                </TabContent>
            </Card>
        </Fragment>
    )
}

export default VoucherBulkPurchaseList