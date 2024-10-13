import React, { Fragment, useEffect, useState } from 'react'
import {ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Link, useHistory } from 'react-router-dom'
import { subMenuIDs } from '../../../../../../../utility/Utils'
import GroupList from './GroupList'
import MyPendingGroupList from './MyPendingGroupList'
import NeedApproveGroupList from './NeedApproveGroupList'
// import SKURuleEditPage from './EditSkuRule'
// import ViewTempDetails from './ViewTempDetails'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
const DatapackGroup = () => {
    const userName = localStorage.getItem('username')
    const [datapackGroupList, setDatapackGroupList] = useState([])
    const [myPendingList, setMyPendingList] = useState([])
    const [approvepending, setapprovepending] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [groupEditData, setgroupEditData] = useState(null)
    const [groupIdForView, setgroupIdForView] = useState(null)
    const [ref_id, setref_id] = useState(null)

    const [refresh, setrefresh] = useState(false)
    const [activeTab, setActiveTab] = useState('1')
    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    // is_sku_rule = true then rule_type = 1
    // is_global_rule = true then rule_type = 2
    // is_service_rule = true then rule_type = 3

    useEffect(() => {

        Promise.all([
            useJwt.datapackGroupList().then(res => {
                console.log('datapack', res)
                setTableDataLoading(false)
                setDatapackGroupList(res.data.payload)
            }).catch(err => {
                Error(err)
                console.log(err)
                setTableDataLoading(false)
            }),
    
            useJwt2.datapackGroupMyPendingList().then(res => {
    
                setMyPendingList(res.data.payload)
            }).catch(err => {
                Error(err)
                console.log(err)
                setTableDataLoading(false)
            }),
            useJwt2.datapackGroupOtherPendingList().then(res => {
                setapprovepending(res.data.payload)
            }).catch(err => {
                Error(err)
                console.log(err)
                setTableDataLoading(false)
            })
        ])
  

        // useJwt.datapackGroupPendingList().then(res => {
        //     const myPending = []
        //     const othersPending = []
        //     for (const item of res.data.payload) {
        //         if (item.modified_by === userName) {
        //             myPending.push(item)
        //         } else {
        //             othersPending.push(item)
        //         }
        //     }
        //     setTableDataLoading(false)
        //     setMyPendingList([...myPending])
        //     setapprovepending([...othersPending])
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        // })

    }, [refresh])

  
    return (
        <Fragment>
            {
                groupEditData ? <SKURuleEditPage refresh={refresh} setrefresh={setrefresh}  groupEditData={groupEditData} setgroupEditData={setgroupEditData} /> : groupIdForView ? < ViewTempDetails setgroupIdForView={setgroupIdForView} groupIdForView={groupIdForView} ref_id={ref_id}/> : <Fragment>
                <Card>
               <CardHeader>
                   <Nav tabs>
                   <NavItem>
                       <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                       <span className='align-middle d-none d-sm-block'>Datapack Group List</span>
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
                           <CardTitle tag='h4'>Datapack-Group</CardTitle>
                           <div>
                           {subMenuIDs.includes(16) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createDatapack' >
                               <div className='d-flex align-items-center'>
                                   <Plus size={17} style={{ marginRight: '5px' }} />
                                   <span >Create Datapack Group</span>
                               </div>
                           </Button.Ripple>}
                   
                           </div>
                       </CardHeader>
   
                           <GroupList datapackGroupList={datapackGroupList} TableDataLoading={TableDataLoading} refresh={refresh} setrefresh={setrefresh} setgroupEditData={setgroupEditData}/>
                   </Card>
                 </TabPane>
                 <TabPane tabId='2'>
   
                      <MyPendingGroupList datapackGroupList={myPendingList} TableDataLoading={TableDataLoading} setgroupIdForView={setgroupIdForView} setref_id={setref_id}/>
                
                 </TabPane>
   
                 <TabPane tabId='3'>
   
                   <NeedApproveGroupList datapackGroupList={approvepending} TableDataLoading={TableDataLoading} refresh={refresh} setrefresh={setrefresh} setgroupIdForView={setgroupIdForView} setref_id={setref_id}/>
   
                 </TabPane>
               </TabContent>
           </Card>
           </Fragment>
            }
        </Fragment>
        
    )
}

export default DatapackGroup