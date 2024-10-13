import React, { Fragment, useEffect, useState } from 'react'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput } from 'reactstrap'
import classnames from 'classnames'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory, Link } from 'react-router-dom'
import { Skeleton } from 'antd'
import ListView from './listView'
import OtherPending from './pendingView'
import ApprovedList from './approvedList'
import PendingListViewV2 from './pendingViewV2'

const skipMenuIds = []

const RoleBasePermission = () => {

    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const history = useHistory()
    const [allMenuList, setallMenuList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [pendingRoleList, setPendingRoleList] = useState([])
    const [mypendingRoleList, setMyPendingRoleList] = useState([]) 
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [ismpLoading, setmpLoading] = useState(true)

    const [refresh, setRefresh] = useState(false)
    const [activeTab, setActiveTab] = useState('1')

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    useEffect(async() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        
        await Promise.all([
            useJwt.roleList().then(res => {
                console.log('roleList', res.data.payload)
                setRoleList(res.data.payload.List)
                setTableDataLoading(false)
            }).catch(err => {
                Error(err)
                console.log(err)
                setTableDataLoading(false)
            }),
            useJwt2.rilacModuleList().then(res => {
                // setaddUserloading(false)
                const workableDataList = []
                console.log('getAdminMenuSubmenuList', res)
                res.data.payload.map(item => {
                    if (!skipMenuIds.includes(item['id'])) {
                        workableDataList.push(item)
                    }
                })
                setallMenuList(workableDataList)
                // Success(res)
            }).catch(err => {
                // setaddUserloading(false)
                Error(err)
                console.log(err)
            })

        ])
        setmpLoading(false)

    }, [])

    return (
        <Fragment>
        <Card>
        <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>Role Based Permission</CardTitle>
        </CardHeader>
            <CardBody>
                <Nav tabs>
                    {/* <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1' })}
                            onClick={() => { toggle('1') }}
                        > Approved List
                        </NavLink>
                    </NavItem> */}
                    {subMenuIDs.includes(72) && <NavItem>
                       <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                       <span className='align-middle d-none d-sm-block'>Permission</span>
                       </NavLink>
                   </NavItem>}
                    {subMenuIDs.includes(72) && <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '2' })}
                            onClick={() => { toggle('2') }}
                        > Pending
                        </NavLink>
                    </NavItem>}
                </Nav>
            </CardBody>
        </Card>
        <Card>
            <TabContent activeTab={activeTab}>
                {/* <TabPane tabId="1">
                    <ApprovedList TableDataLoading={TableDataLoading} setTableDataLoading={setTableDataLoading} roleList={roleList} allMenuList={allMenuList} history={history} setRefresh={setRefresh} refresh={refresh} />
                </TabPane> */}
                <TabPane tabId="1">
                    {
                        !ismpLoading ? <ListView TableDataLoading={TableDataLoading} setTableDataLoading={setTableDataLoading} roleList={roleList} allMenuList={allMenuList} history={history} setRefresh={setRefresh} refresh={refresh} /> : <Fragment> <Skeleton active /> <Skeleton active /> </Fragment>

                    }
                </TabPane>
                <TabPane tabId="2">
                   {/* <OtherPending TableDataLoading={TableDataLoading} roleList={pendingRoleList} history={history} setRefresh={setRefresh} refresh={refresh}/> */}
                   {
                        !ismpLoading ? <PendingListViewV2  TableDataLoading={TableDataLoading} setTableDataLoading={setTableDataLoading} roleList={roleList} allMenuList={allMenuList} history={history} setRefresh={setRefresh} refresh={refresh} /> : <Fragment> <Skeleton active /> <Skeleton active /> </Fragment>

                    }

                </TabPane>

            </TabContent>
        </Card>
    </Fragment>
    )
}

export default RoleBasePermission