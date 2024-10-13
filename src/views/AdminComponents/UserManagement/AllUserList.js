import React, { Fragment, useEffect, useState } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import useJwt  from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import List from './List'
import MyPendingList from './MyPendingList'
import Approve from './Approve'

const AllUserList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const history = useHistory()
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [AdminUsersListData, setUserList] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [activeTab, setActiveTab] = useState('1')
    const [menuSubmenus, setMenuSubmenus] = useState([])
    const [isloading, setisloading] = useState(true)
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    useEffect(() => {
        useJwt.getAdminMenuSubmenuList().then(res => {
            console.log(`menu submenu list `, res.data.payload)
            setMenuSubmenus(res.data.payload)
            setisloading(false)
        }).catch(err => {
           // handle401(err.response.status)
            console.log('get_menu_sub_menu', err.response)
            setisloading(false)
        })

    }, [])

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt2.AdminUsersList().then(res => {
            console.log('AdminUsersList', res.data.payload)
            setUserList(res.data.payload)
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
                <CardBody>
                    <Nav tabs>
                        <><NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > User List
                            </NavLink>
                        </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2') }}
                                >My Pending Users
                                </NavLink>
                            </NavItem></>
                        {subMenuIDs.includes(45) && <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '3' })}
                                onClick={() => { toggle('3') }}
                            > Approve User
                            </NavLink>
                        </NavItem>}
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <>
                        <TabPane tabId="1">
                            <List isloading={isloading} menuSubmenus={menuSubmenus} refresh={refresh} history={history} setRefresh={setRefresh} UserList={AdminUsersListData.List} TableDataLoading={TableDataLoading} />
                        </TabPane>
                        <TabPane tabId="2">
                            <MyPendingList isloading={isloading} menuSubmenus={menuSubmenus} refresh={refresh} setRefresh={setRefresh} UserList={AdminUsersListData.MyPendingList} TableDataLoading={TableDataLoading} />
                        </TabPane>
                    </>
                    <TabPane tabId="3">
                        <Approve isloading={isloading} menuSubmenus={menuSubmenus} refresh={refresh} setRefresh={setRefresh} UserList={AdminUsersListData.PendingList} TableDataLoading={TableDataLoading} />
                    </TabPane>
                </TabContent>
            </Card>
        </Fragment>
    )
}

export default AllUserList