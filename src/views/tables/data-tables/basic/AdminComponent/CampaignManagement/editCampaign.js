import useJwt from '@src/auth/jwt/useJwt'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import jwtDefaultConfig from '../../../../../../@core/auth/jwt/jwtDefaultConfig'
import { BMS_PASS1, BMS_USER1 } from "../../../../../../Configurables"
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const EditCampaign = () => {
    const [campaignInfo, setcampaignInfo] = useState(JSON.parse(localStorage.getItem('campaignInfo')) || {})
    console.log(campaignInfo)
    const [ruleExpiry, setRuleExpiry] = useState({})
    const history = useHistory()
    const serviceRef = useRef()
    const groupRef = useRef()
    const groupRef1 = useRef()
    const rulRef = useRef()
    const crRef = useRef()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [isServiceVisible, setIsServiceVisible] = useState(true)
    const [realtimeRuleList, setrealtimeRuleList] = useState([])
    const [serviceList, setserviceList] = useState([])
    const [groupList, setgroupList] = useState(null)
    const [serviceLogic, setServiceLogic] = useState({})
    const [senderGroup, setSenderGroup] = useState({})
    const [receiverGroup, setReceiverGroup] = useState({})
    const [senderGroupList, setSenderGroupList] = useState([])
    const [receiverGroupList, setReceiverGroupList] = useState([])
    const [subTypes, setSubtypes] = useState([])
    const [hierarchyList, setHierarchyList] = useState([])
    const [hierarchyObj, setHierarchyObj] = useState(JSON.parse(JSON.parse(localStorage.getItem('campaignInfo'))?.hrchyPercentage || '{}'))
    const [showHierarchy, setShowHierarchy] = useState(false)
    
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
    const handleChange = (e) => {
        setcampaignInfo({ ...campaignInfo, [e.target.name]: e.target.value })
    }
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
                setShowHierarchy(true)
            } else {
                setShowHierarchy(false)
                setcampaignInfo({...campaignInfo, isHierarchy: false})
                setHierarchyObj({})
            }
        } else if (campaignInfo.receiver === 'r') {
            if (serviceLogic.recGroupType === 2 || serviceLogic.senGroupType === 0) {
                setShowHierarchy(true)
            } else {
                setShowHierarchy(false)
                setcampaignInfo({...campaignInfo, isHierarchy: false})
                setHierarchyObj({})
            }
        } else if (campaignInfo.receiver === 'b') {
            if (serviceLogic.recGroupType === 2 || serviceLogic.senGroupType === 0) {
                setShowHierarchy(true)
            } else if (serviceLogic.senGroupType === 2 || serviceLogic.senGroupType === 0) {
                setShowHierarchy(true)
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
    }, [campaignInfo, groupList])
   
    useEffect(() => {
        if (Object.keys(serviceLogic).length !== 0) {
            checkAgent(serviceLogic)
        }
    }, [campaignInfo.receiver])
    const onSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('usePMStoken', false)
        localStorage.setItem('useBMStoken', true)
        setPointRuleloading(true)
        let {groupId, mapGroupId, groupType, mapGroupType, hrchyPercentage} = campaignInfo
        if (campaignInfo?.isMultiService) {
            mapGroupId = senderGroup.groupId ? senderGroup.groupId : 0
            mapGroupType = senderGroup.groupType ? senderGroup.groupType : ' '
            groupId = receiverGroup.groupId ? receiverGroup.groupId : 0 
            groupType = receiverGroup.groupType ? receiverGroup.groupType : ' '
        } else if (serviceLogic.ruleProvider === 's') {
            mapGroupId = senderGroup.groupId ? senderGroup.groupId : 0
            mapGroupType = senderGroup.groupType ? senderGroup.groupType : ' '
            groupId = receiverGroup.groupId ? receiverGroup.groupId : 0 
            groupType = receiverGroup.groupType ? receiverGroup.groupType : ' '
        } else if (serviceLogic.ruleProvider === 'r') {
            mapGroupId = receiverGroup.groupId ? receiverGroup.groupId : 0
            mapGroupType = receiverGroup.groupType ? receiverGroup.groupType : ' '
            groupId = senderGroup.groupId ? senderGroup.groupId : 0
            groupType = senderGroup.groupType ? senderGroup.groupType : ' '
        }
        hrchyPercentage = JSON.stringify(hierarchyObj)
        console.log({...campaignInfo, mapGroupId, groupType, groupId, mapGroupType, hrchyPercentage})
        useJwt.updateCampaign(campaignInfo?.id, {...campaignInfo, mapGroupId, groupType, groupId, mapGroupType, hrchyPercentage}).then((response) => {
            setPointRuleloading(false)
            localStorage.setItem('useBMStoken', false)
            Success(response)
            history.push('/allCampaigns')
          }).catch((error) => {
            setPointRuleloading(false)
            localStorage.setItem('useBMStoken', false)
            Error(error)
            console.log(error.response)
          })
    }
    const charLimit = (field) => {
        let charCount = 0
        let actualCharReduce = 0
        let tempField = field
        while (tempField?.match(/<TransactionTime>/) || tempField?.match(/<TransactionId>/) || tempField?.match(/<RewordAmount>/) || tempField?.match(/<Msisdn>/) || tempField?.match(/<TransactionAmount>/) || tempField?.match(/<CampaignName>/)) {
            if (tempField?.match(/<TransactionTime>/)) { 
                charCount += 19
                actualCharReduce += 2
                tempField = tempField?.replace(/<TransactionTime>/, '') 
            }
            if (tempField?.match(/<TransactionId>/)) { 
                charCount += 30
                actualCharReduce += 15 
                tempField = tempField?.replace(/<TransactionId>/, '') 
            }
            if (tempField?.match(/<RewordAmount>/)) {  
                charCount += 10
                actualCharReduce -= 4 
                tempField = tempField?.replace(/<RewordAmount>/, '') 
            }
            if (tempField?.match(/<Msisdn>/)) { 
                charCount += 11
                actualCharReduce -= 3 
                tempField = tempField?.replace(/<Msisdn>/, '')  
            }
            if (tempField?.match(/<TransactionAmount>/)) {  
                charCount += 10
                actualCharReduce -= 9 
                tempField = tempField?.replace(/<TransactionAmount>/, '')  
            }
            if (tempField?.match(/<CampaignName>/)) { 
                actualCharReduce += (campaignInfo?.campaignName?.length - 14)
                charCount += campaignInfo?.campaignName?.length 
                tempField = tempField?.replace(/<CampaignName>/, '')  
            }
        }
        charCount += tempField?.length
        return {charCount, actualCharReduce}
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allCampaigns' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Update Campaign</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                 <Row>
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="campaignName">Campaign Name<span style={{ color: 'red' }}>*</span></Label>
                            <Input
                                type="text"
                                name="campaignName"
                                id='campaignName'
                                value={campaignInfo?.campaignName}
                                onChange={handleChange}
                                required
                                placeholder="name here..."
                            />
                        </FormGroup>
                    </Col>
                    {
                        !campaignInfo.isDynamicCamp && <Col sm='4' className='mt-1 mb-1'>
                                <CustomInput
                                type='switch'
                                label='Multi Service Alow?'
                                id='isMultiService'
                                checked={campaignInfo?.isMultiService}
                                onChange= {e => {
                                    if (e.target.checked) {
                                        setcampaignInfo({ ...campaignInfo, isMultiService: true, serviceId: 0, isSubCategory: false, subTypes: []})
                                        setIsServiceVisible(false)
                                    } else {
                                        setcampaignInfo({ ...campaignInfo, isMultiService: false, multiService: []})
                                        setIsServiceVisible(true)
                                    }
                                }}
                                />
                            </Col>
                        }
                     {
                        isServiceVisible && <Col sm="4" >
                            <FormGroup>
                                <Label for="Businesses">Service Type<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={serviceRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: campaignInfo?.serviceId, label: serviceList?.map(d => { return {value: {id: d.service_id, subTypes: d.sub_types}, label: `${d.service_keyword}: ${d.keyword_description}`} }).find(s => s.value.id === campaignInfo?.serviceId)?.label}}
                                    onChange={(selected) => {
                                        setcampaignInfo({ ...campaignInfo, serviceId: selected.value.id})
                                        setSubtypes(selected.value.subTypes)
                                    }}
                                    options={serviceList?.map(d => { return {value: {id: d.service_id, subTypes: d.sub_types}, label: `${d.service_keyword}: ${d.keyword_description}`} })}
                                    isLoading={serviceList.length === 0}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => serviceRef.current.select.focus()}
                                    value={campaignInfo?.serviceId || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>  
                     }
                     {
                        isServiceVisible && <Col sm='4' className='mt-1 mb-1'>
                        <CustomInput
                           type='switch'
                           label='Allow Subtype'
                           id='isSubcategory'
                           checked={campaignInfo?.isSubCategory}
                           onChange= {e => {
                               if (e.target.checked) {
                                   setcampaignInfo({ ...campaignInfo, isSubCategory: true})
                               } else {
                                   setcampaignInfo({ ...campaignInfo, isSubCategory: false, subTypes: []})
                               }
                           }}
                        />
                    </Col>
                     }
                     {
                        (isServiceVisible && campaignInfo?.isSubCategory) && <Col sm="4" >
                          <FormGroup>
                            <Label for="max_age">Subtypes<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                theme={selectThemeColors}
                                isClearable={true}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                menuPlacement='auto'
                                isMulti
                                value={campaignInfo?.subTypes}
                                onChange={ e => {
                                    const a = e.map(ee => ee.value)
                                    setcampaignInfo({ ...campaignInfo, subTypes: a })
                                }}
                                name='user_os'
                                isLoading={subTypes?.length === 0}
                                required
                                options={ subTypes?.map(o => { return {value: o, label: o} })}
                            />
                            </FormGroup> 
                        </Col>
                     }  
                     {
                        campaignInfo?.isMultiService && <Col sm="4" >
                        <FormGroup>
                            <Label for="service id">Select Services<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                ref={serviceRef}
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                isClearable={true}
                                menuPlacement='auto'
                                isMulti
                                className='react-select'
                                classNamePrefix='select'
                                value={
                                    serviceList.map(ser => {
                                            for (const sser of campaignInfo?.multiService) {
                                                if (sser === ser.serviceId) {
                                                    return {value: sser, label: ser.serviceKeyword}
                                                }
                                            }
                                        })
                                }
                                onChange={ e => {
                                    const a = e.map(ee => ee.value)
                                    setcampaignInfo({ ...campaignInfo, multiService: a })
                                }}
                                options={serviceList?.map(d => { return {value: d.serviceId, label: d.serviceKeyword} })}
                                isLoading={serviceList.length === 0}
                            />
                              <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => serviceRef.current.select.focus()}
                                value={campaignInfo?.multiService || []}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                     }
                     
                     <Col sm='12'></Col>
                     <Col sm='4' className='mt-1 mb-1'>
                         <CustomInput
                            type='switch'
                            label='Allow Dynamic Campaign?'
                            id='isDynamicCamp'
                            checked={campaignInfo?.isDynamicCamp}
                            onChange= {e => {
                                if (e.target.checked) {
                                    setcampaignInfo({ ...campaignInfo, isDynamicCamp: true, isMultiService: true})
                                    setIsServiceVisible(true)
                                } else {
                                    setcampaignInfo({ ...campaignInfo, isDynamicCamp: false, isMultiService: false, isSubCategory: false})
                                }
                            }}
                         />
                     </Col>
                     {
                        campaignInfo?.isDynamicCamp && <Col sm="4" >
                            <FormGroup>
                                <Label for="dynamicCampExpire">Dynamic Campaign Expiry<span style={{ color: 'red' }}>*</span></Label>
                                <Input 
                                    type="number"
                                    name="dynamicCampExpire"
                                    id='dynamicCampExpire'
                                    value={campaignInfo?.dynamicCampExpire}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                     }
                     <Col sm='4' className='mt-1 mb-1'>
                         <CustomInput
                            type='switch'
                            label='Allow SameUser'
                            id='isSameUser'
                            checked={campaignInfo?.isSameUser}
                            onChange= {e => {
                                if (e.target.checked) {
                                    setcampaignInfo({ ...campaignInfo, isSameUser: true})
                                } else {
                                    setcampaignInfo({ ...campaignInfo, isSameUser: false})
                                }
                            }}
                         />
                     </Col>
                    <Col sm='12'></Col>
                      <Col sm="4" >
                            <FormGroup>
                                <Label for="Businesses">Sender Group ({[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === (serviceLogic.senGroupType ? serviceLogic.senGroupType : 0))?.label}) { (serviceLogic.ruleProvider === 's' || campaignInfo?.isMultiService) ? <span className='text-danger'>*</span> : serviceLogic.ruleProvider === 'r' ? ' (optional)' : ''}</Label>
                                <Select
                                    ref={groupRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: senderGroup.groupId, label: groupList?.find(s => parseInt(s.id) === senderGroup.groupId)?.group_name}}
                                    onChange={(selected) => {
                                        // setcampaignInfo({ ...campaignInfo,  groupId: selected.value.id, groupType: selected.value.type})
                                        if (selected) {
                                            setSenderGroup({ groupId: parseInt(selected.value.id), groupType: selected.value.type})
                                        } else {
                                            setSenderGroup({ groupId: 0, groupType: 0})
                                        }
                                    }}
                                    options={senderGroupList?.map(d => { return {value: {id: d.id, type: d.type}, label: `${d.id}. ${d.group_name}`} })}
                                    isLoading={groupList?.length === 0}
                                    isClearable={serviceLogic.ruleProvider === 'r'}
                                />
                            </FormGroup>
                            {
                               (serviceLogic.ruleProvider === 's' || campaignInfo?.isMultiService)  &&  <Input
                                 required
                                 style={{
                                     opacity: 0,
                                     width: "100%",
                                     height: 0
                                     // position: "absolute"
                                 }}
                                 onFocus={e => groupRef.current.select.focus()}
                                 value={senderGroup.groupId || ''}
                                 onChange={e => ''}
                             />
                            }
                            </Col>
                            <Col sm="4" >
                                    <FormGroup>
                                        <Label for="Businesses">Receiver Group ({[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value ===  (serviceLogic.recGroupType ? serviceLogic.recGroupType : 0))?.label}) { (serviceLogic.ruleProvider === 'r' || campaignInfo?.isMultiService)  ? <span className='text-danger'>*</span> : serviceLogic.ruleProvider === 's' ? ' (optional)' : ''}</Label>
                                        <Select
                                            ref={groupRef1}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={{ value: receiverGroup.groupId, label: groupList?.find(s => parseInt(s.id) === receiverGroup.groupId)?.group_name}}
                                            onChange={(selected) => {
                                                if (selected) {
                                                    setReceiverGroup({ groupId: parseInt(selected.value.id), groupType: selected.value.type})
                                                } else {
                                                    setSenderGroup({ groupId: 0, groupType: 0})
                                                }
                                            }}
                                            options={receiverGroupList?.map(d => { return {value: {id: d.id, type: d.type}, label: `${d.id}. ${d.group_name}`} })}
                                            isLoading={groupList?.length === 0}
                                            isClearable={serviceLogic.ruleProvider === 's'}
                                        />
                                    </FormGroup>
                                    {
                                        (serviceLogic.ruleProvider === 'r' || campaignInfo?.isMultiService)  && <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => groupRef1.current.select.focus()}
                                            value={receiverGroup.groupId || ''}
                                            onChange={e => ''}
                                        />
                                    }
                                    </Col>
                         <Col sm="4" >
                            <FormGroup>
                                <Label for="Businesses">Campaign Rule<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={rulRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: campaignInfo?.commissionId, label: realtimeRuleList.find(camp => camp.commissionId === campaignInfo?.commissionId)?.commissionRuleName}}
                                    onChange={(selected) => {
                                        setcampaignInfo({ ...campaignInfo, commissionId: selected.value.commissionId, alertDate: selected.value.endDate.replace(/ .*/g, '')})
                                        setRuleExpiry({...selected.value})
                                    }}
                                    options={realtimeRuleList?.map(d => { return {value: {...d}, label: `${d.commissionId}. ${d.commissionRuleName}`} })}
                                    isLoading={realtimeRuleList.length === 0}
                                    menuPlacement='auto'
                                />
                            </FormGroup>
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => rulRef.current.select.focus()}
                                value={campaignInfo?.commissionId || ''}
                                onChange={e => ''}
                            />
                            </Col>
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="alertDate">Alert Date</Label>
                                    <Input 
                                        type="date"
                                        min={new Date(ruleExpiry?.startDate?.replace(/ .*/g, '')).toLocaleDateString('fr-CA')}
                                        max={new Date(ruleExpiry?.endDate?.replace(/ .*/g, '')).toLocaleDateString('fr-CA')}
                                        name="alertDate"
                                        id='alertDate'
                                        value={campaignInfo?.alertDate}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
                                    />
                                </FormGroup>
                            </Col>
                    <Col sm="4" >
                            <FormGroup>
                                <Label for="receiver">Reward Receiver<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={crRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={{value:campaignInfo?.receiver, label: campaignInfo?.receiver === 's' ? 'Sender' : campaignInfo?.receiver === 'r' ? 'Receiver' : campaignInfo?.receiver === 'b' ? 'Both' : ''}}
                                    onChange={(selected) => {
                                            setcampaignInfo({...campaignInfo, receiver: selected.value})
                                    }}
                                    options={[{value:'s', label:'Sender'}, {value:'r', label:'Receiver'}, {value:'b', label:'both'}]}
                                />
                            </FormGroup>
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => crRef.current.select.focus()}
                                value={campaignInfo?.receiver || ''}
                                onChange={e => ''}
                            />
                        </Col>
                        <Col sm="4" >
                            <FormGroup>
                                <Label for="campaignMsg">Campaign Message<span style={{ color: 'red' }}>*</span></Label>
                                <Input 
                                    type="textarea"
                                    name="campaignMsg"
                                    id='campaignMsg'
                                    value={campaignInfo?.campaignMsg}
                                    onChange={handleChange}
                                    maxLength={(160 - charLimit(campaignInfo?.campaignMsg).actualCharReduce).toString()}
                                    required
                                    placeholder="message here..."
                                />
                                <p className='text-right' style={charLimit(campaignInfo?.campaignMsg).charCount === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - charLimit(campaignInfo?.campaignMsg).charCount} characters remaining</p>
                            </FormGroup>
                        </Col>
                        {
                            (ruleExpiry?.isRxQuota || ruleExpiry?.isQuota) && <Col sm="4" >
                                <FormGroup>
                                    <Label for="qtExpireMsg">Quota Expire Message</Label>
                                    <Input 
                                        type="textarea"
                                        name="qtExpireMsg"
                                        id='qtExpireMsg'
                                        value={campaignInfo?.qtExpireMsg}
                                        onChange={handleChange}
                                        placeholder="message here..."
                                        maxLength={(160 - charLimit(campaignInfo?.qtExpireMsg).actualCharReduce).toString()}
                                    />
                                    <p className='text-right' style={charLimit(campaignInfo?.qtExpireMsg).charCount === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - charLimit(campaignInfo?.qtExpireMsg).charCount} characters remaining</p>
                                </FormGroup>
                            </Col>
                        }
                        {
                            (ruleExpiry?.isRxQuota || ruleExpiry?.isQuota) && <Col sm="4" >
                                <FormGroup>
                                    <Label for="qtPartialMsg">Quota Partial Message</Label>
                                    <Input 
                                        type="textarea"
                                        name="qtPartialMsg"
                                        id='qtPartialMsg'
                                        value={campaignInfo?.qtPartialMsg}
                                        onChange={handleChange}
                                        placeholder="message here..."
                                        maxLength={(160 - charLimit(campaignInfo?.qtPartialMsg).actualCharReduce).toString()}
                                    />
                                    <p className='text-right' style={charLimit(campaignInfo?.qtPartialMsg).charCount === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - charLimit(campaignInfo?.qtPartialMsg).charCount} characters remaining</p>
                                </FormGroup>
                            </Col>
                        }

{
                            showHierarchy && <Col sm='4' className='mt-1 mb-1'>
                            <CustomInput
                                type='switch'
                                label='Allow Hierarchy?'
                                id='isHierarchy'
                                checked={campaignInfo?.isHierarchy}
                                onChange= {e => {
                                    if (e.target.checked) {
                                        setcampaignInfo({ ...campaignInfo, isHierarchy: true})
                                    } else {
                                        setcampaignInfo({ ...campaignInfo, isHierarchy: false})
                                        setHierarchyObj({})
                                    }
                                }}
                            />
                        </Col>
                         }
                            {
                                campaignInfo.isHierarchy && <Col sm='12'>
                                <Row>
                                    <Col sm='12'>
                                        <h5>Hierarchy List <span style={{color:'#F49D1A', fontSize:'12px'}}>( In total of all hierarchy percentage will not more than 100%! )</span></h5>
                                    </Col>
                                    {
                                       hierarchyList.length === 0 ? <Col sm='4'><Spinner color='blue' /></Col> : hierarchyList.map(hierarchy => <Col sm='4'>
                                            <FormGroup>
                                                <Label for="hierarchy">{hierarchy}</Label>
                                                <Input 
                                                    disabled= {location.pathname === '/campaignDetails'}
                                                    type="number"
                                                    name="hierarchy"
                                                    id='hierarchy'
                                                    value={hierarchyObj[hierarchy] || 0}
                                                    onChange={(e) => {
                                                        let sum = 0
                                                        for (const key in hierarchyObj) {
                                                            sum += parseInt(hierarchyObj[key])
                                                        }
                                                        sum += parseInt(e.target.value) - hierarchyObj[hierarchy]
                                                        if (sum > 100) {
                                                            setHierarchyObj({...hierarchyObj, [hierarchy]: 0})
                                                            e.target.value = null
                                                        } else {
                                                            setHierarchyObj({...hierarchyObj, [hierarchy]: e.target.value})
                                                        }
                                                    }}
                                                    placeholder="percentage here..."
                                                />
                                            </FormGroup>
                                        </Col>)
                                    }
                                      </Row>
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
                {
                    ruleExpiry.commissionId && <Card>
                            <CardBody>
                            <Row>
                                <Col sm='12'><h4>Campaign Rule Details</h4></Col>
                                <Col sm='4'>
                                    <Card style={{border: '1px solid grey'}}>
                                        <div className='d-flex justify-content-between border-bottom p-1'>
                                            <h6 style={{margin:'0'}}>Campaign Rule Name:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.commissionRuleName}</b></h6>
                                        </div>

                                        <div className='d-flex justify-content-between border-bottom p-1'>
                                            <h6 style={{margin:'0'}}>Default Campaign Id:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.returnCommissionId}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Is Default?:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isDefault ? 'True' : 'False'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Distribute Reward Point?:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isPoint ? 'True' : 'False'}</b></h6>
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
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isCertainTimeline ? 'True' : 'False'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Recurring Type:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.timelineType === 'w' ? 'Weekly' : 'Monthly' }</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Recurring Type 2:</h6>
                                            <h6 style={{margin:'0'}}><b>{(ruleExpiry.timelineType === 'w' && ruleExpiry.isTimelineRange) ? 'Day Range' : (ruleExpiry.timelineType === 'w' && !ruleExpiry.isTimelineRange) ? 'Specific Day' : (ruleExpiry.timelineType === 'm' && ruleExpiry.isTimelineRange) ? 'Date Range' : (ruleExpiry.timelineType === 'm' && !ruleExpiry.isTimelineRange) ? 'Specific Date' : ''}</b></h6>
                                        </div>
                                    </Card>
                                    <Card style={{border: '1px solid grey'}}>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Set Campaign Quota?:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isQuota ? 'True' : 'False'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Quota Type:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.quotaType === 0 ? 'On Amount' : ruleExpiry.quotaType === 1 ? 'On Transaction Count' : ruleExpiry.quotaType === 2 ? 'Both' : ''}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Set Quota Count:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.quotaCount}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Set Quota Amount Limit:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.quotaAmount}</b></h6>
                                        </div>
                                    </Card>
                                    <Card style={{border: '1px solid grey'}}>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Set Reward Receivers's Quota?:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isRxQuota ? 'True' : 'False'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Quota Type:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.rxQuotaType === 0 ? 'On Amount' : ruleExpiry.quotaType === 1 ? 'On Transaction Count' : ruleExpiry.quotaType === 2 ? 'Both' : ''}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Set Quota Count:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.rxQuotaCount}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Set Quota Amount Limit:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.rxQuotaAmount}</b></h6>
                                        </div>
                                    </Card>
                                </Col>
                                <Col sm='4'>
                                    <Card style={{border: '1px solid grey'}}>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Is Time?:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isTime ? 'True' : 'False'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Start Hour:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.startHour}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>End Hour:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.endHour}</b></h6>
                                        </div>
                                    </Card>
                                    <Card style={{border: '1px solid grey'}}>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Add Transaction Condition?:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.isFinBasedOffer ? 'True' : 'False'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Define TXN no.:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.offerCount}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Reward Amount:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.offerAmount}</b></h6>
                                        </div>
                                    </Card>
                                    <Card style={{border: '1px solid grey'}}>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Create By:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.createBy}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Create Date:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry?.createDate ? formatReadableDate(ruleExpiry?.createDate) : 'N/A'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Modify By:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.modifyBy}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Create Date:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry?.modifyDate ? formatReadableDate(ruleExpiry?.modifyDate) : 'N/A'}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Approved By:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry.approvedBy}</b></h6>
                                        </div>
                                        <div className='d-flex justify-content-between p-1'>
                                            <h6 style={{margin:'0'}}>Approve Date:</h6>
                                            <h6 style={{margin:'0'}}><b>{ruleExpiry?.approveDate ? formatReadableDate(ruleExpiry?.approveDate) : 'N/A'}</b></h6>
                                        </div>
                                    </Card>
                                </Col>
                                <Col sm='12'>
                                    <Card style={{border: '1px solid grey'}}>
                                        {/* <CardHeader>Flexible Rules</CardHeader> */}
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

export default EditCampaign