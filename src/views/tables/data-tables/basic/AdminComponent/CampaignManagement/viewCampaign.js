import useJwt from '@src/auth/jwt/useJwt'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, Badge, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import jwtDefaultConfig from '../../../../../../@core/auth/jwt/jwtDefaultConfig'
import { BMS_PASS1, BMS_USER1 } from "../../../../../../Configurables"
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const ViewCampaign = () => {
    const [campaignInfo, setcampaignInfo] = useState(JSON.parse(localStorage.getItem('campaignInfo')) || {})
    console.log(campaignInfo)
    const [ruleExpiry, setRuleExpiry] = useState({})
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [isServiceVisible, setIsServiceVisible] = useState(true)
    const [realtimeRuleList, setrealtimeRuleList] = useState([])
    const [serviceList, setserviceList] = useState([])
    const [groupList, setgroupList] = useState([])
    const [serviceLogic, setServiceLogic] = useState({})
    const [senderGroup, setSenderGroup] = useState({})
    const [receiverGroup, setReceiverGroup] = useState({})
    const [senderGroupList, setSenderGroupList] = useState([])
    const [receiverGroupList, setReceiverGroupList] = useState([])
    const [hierarchyList, setHierarchyList] = useState([])
    const [hierarchyObj, setHierarchyObj] = useState(JSON.parse(JSON.parse(localStorage.getItem('campaignInfo'))?.hrchyPercentage || '{}'))
    
    const senderReward = (row) => {
        if (row['is_voucher_reward']) {
            if (row.commissionType === 'flexible') {
                return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e['snreward_voucherid'] || '--'}</div>)
            } else {
                return row['snreward_voucherid'] || 'N/A'
            }
        } else if (row['is_datapack_reward']) {

            if (row.commissionType === 'flexible') {
                return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e['snreward_datapack_groupid'] ? `GroupId-${e['snreward_datapack_groupid']}` : '--'}</div>)
            } else {
                return row['snreward_datapack_groupid'] ? `GroupId-${row['snreward_datapack_groupid']}` : "--"
            }
        } else {
            if (row.commissionType === 'flexible') {
                return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.snAmount || '--'}</div>)
            } else {
                return row.snAmount || 0
            }
        }
    }

    const receiverReward = row => {
        if (row['is_voucher_reward']) {
            if (row.commissionType === 'flexible') {
                return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e['rxreward_voucherid'] || '--'}</div>)
            } else {
                return row['rxreward_voucherid'] || 'N/A'
            }
        } else if (row['is_datapack_reward']) {

            if (row.commissionType === 'flexible') {
                return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e['rxreward_datapack_groupid'] ? `GroupId-${e['rxreward_datapack_groupid'] }` : '--'}</div>)
            } else {
                return row['rxreward_datapack_groupid'] ? `GroupId-${row['rxreward_datapack_groupid']}` : "--"
            }
        } else {
            if (row.commissionType === 'flexible') {
                return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.rxAmount || '--'}</div>)
            } else {
                return row.rxAmount || 0
            }
        }
    }

    const column = [

        {
            name: 'Voucher-Reward',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                if (row['is_voucher_reward']) {
                    return 'True'
                } else {
                    return 'False'
                }
            }
        },
        {
            name: 'Datapack-Reward',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                if (row['is_datapack_reward']) {
                    return 'True'
                } else {
                    return 'False'
                }
            }
        },
        {
            name: 'Cashback-Reward',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                if (!row['is_datapack_reward'] && !row['is_voucher_reward']) {
                    return 'True'
                } else {
                    return 'False'
                }
            }
        },
        {
            name: 'Reward Type',
            minWidth: '50px',
            sortable: true,
            selector: 'commissionType'
        },
        {
            name: 'Transaction Amount',
            minWidth: '180px',
            sortable: true,
            selector: row => {
                if (row.commissionType === 'flexible') {
                    return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.startRange === e.endRange ? `${e.startRange}` : `${e.startRange} - ${e.endRange}`}
                    </div>)
                } else {
                    return 'Any'
                }
            }
        },
        {
            name: 'Sender Reward',
            minWidth: '100px',
            sortable: true,
            wrap: true,
            selector: row => senderReward(row)
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            sortable: true,
            wrap: true,
            selector: row => receiverReward(row)
        },
        {
            name: 'Reward Value',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                if (row.commissionType === 'flexible') {
                    return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e?.isPercentage ? 'Percentage' : 'Flat'}</div>)
                } else {
                    return row?.isPercentage ? 'Percentage' : 'Flat'
                }
            }
        },
        {
            name: 'Reward Range',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                if (row.commissionType === 'flexible') {
                    return row.flexibleRules.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e?.isPercentage ? `${e.min} - ${e.max}` : '---'}</div>)
                } else if (row.commissionType === 'fixed' && row?.isPercentage) {
                    return `${row.min} - ${row.max}`
                } else {
                    return '---'
                }
            }
        }
    ]
    useEffect(() => {
        if (campaignInfo?.isMultiService) {
            setIsServiceVisible(false)
        }
        const callApis = async () => {
            localStorage.setItem('useBMStoken', true)
            await useJwt.currentRealtimeRuleList().then(res => {
                console.log(res)
                setrealtimeRuleList(res.data.filter(df => !df.isDefault)?.sort((a, b) => parseInt(b.commissionId) - parseInt(a.commissionId)))
                setRuleExpiry(res.data.find(rl => parseInt(rl.commissionId) === campaignInfo?.commissionId))
            }).catch(err => {
                Error(err)
                console.log(err)
            })
            localStorage.setItem('useBMStoken', false)
            await useJwt.getServiceList().then(res => {
                console.log(res)
                setserviceList(res.data.payload)
                localStorage.setItem('useBMStoken', false)
            }).catch(err => {
                Error(err)
                console.log(err)
                localStorage.setItem('useBMStoken', false)
            })
            localStorage.setItem('useBMStoken', false)
            localStorage.setItem('usePMStoken', false)
            await useJwt.getCentralGroup().then(res => {
                console.log(res)
                const allGroup = []
                for (const q of res.data.payload) {
                    if (q.is_approved && q.type !== 4 && q.group_member_count) {
                        allGroup.push(q)
                    }
                }
                setgroupList(allGroup)
            }).catch(err => {
                Error(err)
                console.log(err.response)
            })

            const h = new Headers()
            h.append('Accept', 'application/json')
            const encoded = window.btoa(`${BMS_USER1}:${BMS_PASS1}`)
            const auth = `Basic ${encoded}`
            h.append('Authorization', auth)
            // await fetch(new Request(jwtDefaultConfig.hierarchyEndpoint, {
            //     method: 'GET',
            //     headers: h,
            //     credentials: 'include'
            // })).then(async response => {
            //     const data = await response.json()
            //     console.log('hierarchyList', data)
            //     setHierarchyList(data)
            // }).catch(err => {
            //     Error(err)
            //     console.log(err)
            // })
        }
        callApis()
    }, [])
    const checkAgent = (serviceLogic) => {
        if (campaignInfo.receiver === 's') {
            if (serviceLogic.senGroupType === 2 || serviceLogic.senGroupType === 0) {
                // setShowHierarchy(true)
            } else {
                // setShowHierarchy(false)
                setcampaignInfo({...campaignInfo, isHierarchy: false})
                setHierarchyObj({})
            }
        } else if (campaignInfo.receiver === 'r') {
            if (serviceLogic.recGroupType === 2 || serviceLogic.senGroupType === 0) {
                // setShowHierarchy(true)
            } else {
                // setShowHierarchy(false)
                setcampaignInfo({...campaignInfo, isHierarchy: false})
                setHierarchyObj({})
            }
        } else if (campaignInfo.receiver === 'b') {
            if (serviceLogic.recGroupType === 2 || serviceLogic.senGroupType === 0) {
                // setShowHierarchy(true)
            } else if (serviceLogic.senGroupType === 2 || serviceLogic.senGroupType === 0) {
                // setShowHierarchy(true)
            } else {
                setShowHierarchy(false)
                setcampaignInfo({...campaignInfo, isHierarchy: false})
                setHierarchyObj({})
            }
        }
    }
    useEffect(() => {
        if (Object.keys(campaignInfo).length !== 0) {
            if (campaignInfo?.serviceId !== "0") {
                // setcampaignInfo({...campaignInfo, isHierarchy: false, receiver:''})
                // setShowHierarchy(false)
                // setHierarchyObj({})
                localStorage.setItem('useBMStoken', true)
                useJwt.getServiceLogicByServiceId(campaignInfo?.serviceId).then(res => {
                    console.log(res)
                    setServiceLogic(res.data)
                    if (res.data?.ruleProvider === 's') {
                        setSenderGroup({groupId:campaignInfo?.mapGroupId, groupType: campaignInfo?.mapGroupType})
                        setReceiverGroup({groupId:campaignInfo?.groupId, groupType: campaignInfo?.groupType})
                    } else if (res.data?.ruleProvider === 'r') {
                        setReceiverGroup({groupId:campaignInfo?.mapGroupId, groupType: campaignInfo?.mapGroupType})
                        setSenderGroup({groupId:campaignInfo?.groupId, groupType: campaignInfo?.groupType})
                    }
                    if (res.data.recGroupType === 0) {
                        setReceiverGroupList(groupList)
                    } else {
                        setReceiverGroupList([...groupList?.filter(d => d.type === res.data.recGroupType)])
                    }
                    if (res.data.senGroupType === 0) {
                        setSenderGroupList(groupList)
                    } else {
                        setSenderGroupList([...groupList?.filter(d => d.type === res.data.senGroupType)])
                    }
                    checkAgent(res.data)
                    localStorage.setItem('useBMStoken', false)
                }).catch(err => {
                    // Error(err)
                    console.log(err)
                    localStorage.setItem('useBMStoken', false)
                })
            } else {
                setSenderGroup({groupId:campaignInfo?.mapGroupId, groupType: campaignInfo?.mapGroupType})
                setReceiverGroup({groupId:campaignInfo?.groupId, groupType: campaignInfo?.groupType})
            }
        }
    }, [campaignInfo])
   
    useEffect(() => {
        if (Object.keys(serviceLogic).length !== 0) {
            checkAgent(serviceLogic)
        }
    }, [campaignInfo.receiver])

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allCampaigns' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={() => {}} autoComplete="off">
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Online Campaign Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm='5'>
                                <Card style={{border: '1px solid grey'}}>
                                    <CardBody>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Campaign Name:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.campaignName}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Multi Service Allow?:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.isMultiService ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Allow Subtype?:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.isSubCategory ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    {
                                        campaignInfo?.isMultiService ? null : <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Service Type:</h6>
                                        <h6 style={{margin:'0'}}><b>{serviceList.find(s => s.service_id === campaignInfo?.serviceId)?.service_keyword}</b></h6>
                                    </div>
                                    }
                                    
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Subtypes:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.subTypes?.length !== 0 ? campaignInfo?.subTypes : 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Services: </h6>
                                        <h6 style={{margin:'0'}}><b>{
                                            serviceList.map(ser => {
                                                    for (const sser of campaignInfo?.multiService) {
                                                        if (sser === ser.service_id) {
                                                            return ser.service_keyword
                                                        }
                                                    }
                                                })
                                        }</b></h6>
                                    </div>
                                    </CardBody>
                                   
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Allow Dynamic Campaign?:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.isDynamicCamp ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Dynamic Campaign Expiry:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.dynamicCampExpire || 0}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Allow Same user?:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.isSameUser ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Sender Group:</h6>
                                        <h6 style={{margin:'0'}}><b>{groupList.find(s => parseInt(s.id) === senderGroup.groupId)?.group_name || 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Receiver Group:</h6>
                                        <h6 style={{margin:'0'}}><b>{groupList.find(s => parseInt(s.id) === receiverGroup.groupId)?.group_name || 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Campaign Rule:</h6>
                                        <h6 style={{margin:'0'}}><b>{realtimeRuleList.find(camp => camp.commissionId === campaignInfo?.commissionId)?.commissionRuleName || 'N/A'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='7'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{marginBottom:'5px'}}>Campaign Alert Date?:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.alertDate ? formatReadableDate(campaignInfo?.alertDate) : 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{marginBottom:'5px'}}>Campaign Message:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.campaignMsg || 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{marginBottom:'5px'}}>Quota Expire Message:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.qtExpireMsg || 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{marginBottom:'5px'}}>Quota Partial Message:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.qtPartialMsg || 'N/A'}</b></h6>
                                    </div>
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Reward Receiver:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.receiver === 's' ? 'Sender' : campaignInfo?.receiver === 'r' ? 'Receiver' : campaignInfo?.receiver === 'b' ? 'Both' : ''}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Allow Hierarchy?:</h6>
                                        <h6 style={{margin:'0'}}><b>{campaignInfo?.isHierarchy ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                </Card>
                                {/* <Card style={{border: '1px solid grey'}}>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h5'>Hierarchy List</CardTitle>
                                    </CardHeader>
                                {
                                       hierarchyList.length === 0 ? <Col sm='4' className='p-1'><Spinner color='blue' /></Col> : hierarchyList.map(hierarchy =>   <div className='d-flex justify-content-between p-1'>
                                       <h6 style={{margin:'0'}}>{hierarchy}:</h6>
                                       <h6 style={{margin:'0'}}><b>{hierarchyObj[hierarchy] || 0}</b></h6>
                                   </div>)
                                    }
                                </Card> */}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

{/* Start of campaign rule details */}
                {
                    ruleExpiry?.commissionId && <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Campaign Rule Details</CardTitle>
                        </CardHeader>
                        <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm='4'>
                                <Card style={{border: '1px solid grey'}}> 
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Campaign Rule Name:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.commissionRuleName}</b></h6>
                                    </div>
                                    
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                                <h6 style={{margin:'0'}}>Default Campaign Id:</h6>
                                                <h6 style={{margin:'0'}}><b>{ruleExpiry?.returnCommissionId}</b></h6>
                                    </div>

                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Is Default?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isDefault ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Distribute Reward Point?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isPoint ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Start Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.startDate ? formatReadableDate(ruleExpiry?.startDate) : 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>End Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.endDate ? formatReadableDate(ruleExpiry?.endDate) : 'N/A'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='4'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Recurring Timeline?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isCertainTimeline ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Recurring Type:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.timelineType === 'w' ? 'Weekly' : 'Monthly' }</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Recurring Type 2:</h6>
                                        <h6 style={{margin:'0'}}><b>{(ruleExpiry?.timelineType === 'w' && ruleExpiry?.isTimelineRange) ? 'Day Range' : (ruleExpiry?.timelineType === 'w' && !ruleExpiry?.isTimelineRange) ? 'Specific Day' : (ruleExpiry?.timelineType === 'm' && ruleExpiry?.isTimelineRange) ? 'Date Range' : (ruleExpiry?.timelineType === 'm' && !ruleExpiry?.isTimelineRange) ? 'Specific Date' : ''}</b></h6>
                                    </div>
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Campaign Quota?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isQuota ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Quota Type:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.quotaType === 0 ? 'On Amount' : ruleExpiry?.quotaType === 1 ? 'On Transaction Count' : ruleExpiry?.quotaType === 2 ? 'Both' : ''}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Quota Count:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.quotaCount}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Quota Amount Limit:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.quotaAmount}</b></h6>
                                    </div>
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Reward Receivers's Quota?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isRxQuota ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Quota Type:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.rxQuotaType === 0 ? 'On Amount' : ruleExpiry?.quotaType === 1 ? 'On Transaction Count' : ruleExpiry?.quotaType === 2 ? 'Both' : ''}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Quota Count:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.rxQuotaCount}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Set Quota Amount Limit:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.rxQuotaAmount}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='4'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Is Time?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isTime ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Start Hour:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.startHour}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>End Hour:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.endHour}</b></h6>
                                    </div>
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Add Transaction Condition?:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.isFinBasedOffer ? 'Yes' : 'No'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Define TXN no.:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.offerCount}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Reward Amount:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.offerAmount}</b></h6>
                                    </div>
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Created By:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.createBy}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Created Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.createDate ? formatReadableDate(ruleExpiry?.createDate) : 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Modify By:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.modifyBy}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Modify Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.modifyDate ? formatReadableDate(ruleExpiry?.modifyDate) : 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Approved By:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.approvedBy}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Approve Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{ruleExpiry?.approveDate ? formatReadableDate(ruleExpiry?.approveDate) : 'N/A'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='12'>
                                <Card style={{border: '1px solid grey'}}>
                                    <CardBody>
                                    <CommonDataTable column={column} TableData={[ruleExpiry]} /> 
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                    }    
                  {
                    location.pathname !== '/campaignDetails' && <Card>
                    <Col sm="12" className='text-center m-1'>
                        {
                            pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                <span >Update</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Card>
                  }
            </Form>
        </Fragment>
    )
}

export default ViewCampaign