import React, { Fragment, useEffect, useState } from 'react'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput } from 'reactstrap'
import classnames from 'classnames'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory, Link } from 'react-router-dom'

import ListView from './listView'
import OtherPending from './otherPendingList'
import MyPendingList from './mypendingList'

const UserRoleList = () => {

    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const history = useHistory()
    const [roleList, setRoleList] = useState([])
    const [pendingRoleList, setPendingRoleList] = useState([])
    const [mypendingRoleList, setMyPendingRoleList] = useState([]) 
    const [TableDataLoading, setTableDataLoading] = useState(true)

    const [refresh, setRefresh] = useState(false)
    const [activeTab, setActiveTab] = useState('1')

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt.roleList().then(res => {
            console.log('roleList', res.data.payload)
            setRoleList(res.data.payload.List)
            setPendingRoleList(res.data.payload.PendingList)
            setMyPendingRoleList(res.data.payload.MyPendingList)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })
    }, [refresh])

    return (
        <Fragment>
        <Card>
        <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>User Role</CardTitle>
                <div>
                    {subMenuIDs.includes(69) && <Button.Ripple className='ml-2' color='primary' tag={Link} to={'/createUserRole'} >
                    <div className='d-flex align-items-center'>
                        <Plus size={17} style={{marginRight:'5px'}}/>
                        <span >Create User Role</span>
                    </div>
                    </Button.Ripple>}
            </div>
        </CardHeader>
            <CardBody>
                <Nav tabs>
                <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1' })}
                            onClick={() => { toggle('1') }}
                        > Role List
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '2' })}
                            onClick={() => { toggle('2') }}
                        > My Pending
                        </NavLink>
                    </NavItem>
                    {subMenuIDs.includes(72) && <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '3' })}
                            onClick={() => { toggle('3') }}
                        > Approve Role
                        </NavLink>
                    </NavItem>}
                </Nav>
            </CardBody>
        </Card>
        <Card>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <ListView TableDataLoading={TableDataLoading} roleList={roleList} history={history} setRefresh={setRefresh} refresh={refresh} />
                </TabPane>
                <TabPane tabId="2">
                    <MyPendingList TableDataLoading={TableDataLoading} roleList={mypendingRoleList} history={history}   />
                </TabPane>
                <TabPane tabId="3">
                   <OtherPending TableDataLoading={TableDataLoading} roleList={pendingRoleList} history={history} setRefresh={setRefresh} refresh={refresh}/>
                </TabPane>

            </TabContent>
        </Card>
    </Fragment>
    )
}

export default UserRoleList