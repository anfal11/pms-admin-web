import React, { Fragment, useEffect, useState } from 'react'
import {ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Link, useHistory } from 'react-router-dom'
import { subMenuIDs } from '../../../../../utility/Utils'
import RuleList from './Rulelist'
import MyPendingRuleList from './MyPendingRuleList'
import NeedApproveRuleList from './NeedApproveRuleList'
import EditGlobalRule from './EditGlobalRule'
import ViewTempDetails from './ViewTempDetails'
import { Error, Success, ErrorMessage } from '../../../../viewhelper'

const GlobalPointRule = () => { 

    const [pointRuleList, setPointRuleList] = useState([])
    const [pendingList, setPendingList] = useState([])
    const [approvepending, setapprovepending] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [ruleeditdata, setruleeditdata] = useState(null)
    const [ruleidforview, setruleidforview] = useState(null)
    const [ref_id, setref_id] = useState(null)

    const [refresh, setrefresh] = useState(1)
    const [activeTab, setActiveTab] = useState('1')
    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    // is_sku_rule = true then rule_type = 1
    // is_global_rule = true then rule_type = 2
    // is_service_rule = true then rule_type = 3

    useEffect(async () => {

        await useJwt2.pmsPointRuleList({rule_type: 2}).then(res => {
            console.log(res)
            const { list, mypending, approvepending} = res.data.payload
            setPointRuleList(list)
            setPendingList(mypending)
            setapprovepending(approvepending)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })

    }, [refresh])

  
    return (
        <Fragment>
            {
                ruleeditdata ? <EditGlobalRule refresh={refresh} setrefresh={setrefresh}  ruleeditdata={ruleeditdata} setruleeditdata={setruleeditdata} /> : ruleidforview ? < ViewTempDetails setruleidforview={setruleidforview} ruleidforview={ruleidforview} ref_id={ref_id}/> : <Fragment>
                <Card>
               <CardHeader>
                   <Nav tabs>
                   <NavItem>
                       <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                       <span className='align-middle d-none d-sm-block'>Rule List</span>
                       </NavLink>
                   </NavItem>
                   <NavItem>
                       <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                       <span className='align-middle d-none d-sm-block'>My Pending</span>
                       </NavLink>
                   </NavItem>
                   <NavItem>
                       <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                       <span className='align-middle d-none d-sm-block'>Approve</span>
                       </NavLink>
                   </NavItem>
                   </Nav>
               </CardHeader>
               </Card>
               <Card>
               <TabContent activeTab={activeTab}>
                 <TabPane tabId='1'>
                   <Card>
                       <CardHeader className='border-bottom'>
                           <CardTitle tag='h4'>Global Rules</CardTitle>
                           <div>
                           <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createOverallPointRule' >
                               <div className='d-flex align-items-center'>
                                   <Plus size={17} style={{ marginRight: '5px' }} />
                                   <span >Create Global Rule</span>
                               </div>
                           </Button.Ripple>
                   
                           </div>
                       </CardHeader>
   
                           <RuleList pointRuleList={pointRuleList} rule_type={1} TableDataLoading={TableDataLoading} refresh={refresh} setrefresh={setrefresh} setruleeditdata={setruleeditdata}/>
                   </Card>
                 </TabPane>
                 <TabPane tabId='2'>
   
                      <MyPendingRuleList pointRuleList={pendingList} rule_type={1} TableDataLoading={TableDataLoading} setruleidforview={setruleidforview} setref_id={setref_id}/>
                
                 </TabPane>
   
                 <TabPane tabId='3'>
   
                   <NeedApproveRuleList pointRuleList={approvepending} rule_type={1} TableDataLoading={TableDataLoading} refresh={refresh} setrefresh={setrefresh} setruleidforview={setruleidforview} setref_id={setref_id}/>
   
                 </TabPane>
               </TabContent>
           </Card>
           </Fragment>
            }
        </Fragment>
        
    )
}


export default GlobalPointRule