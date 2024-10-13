import useJwt2 from '@src/auth/jwt/useJwt2'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import {BeatLoader} from "react-spinners"   

const rewardReceiver = [{value:'s', label:'Sender'}, {value:'r', label:'Receiver'}, {value:'b', label:'both'}]
const rewardPriority = [{value:'s', label:'Sender'}, {value:'r', label:'Receiver'}]

const CampaignLogic = ({
    setUserInput,
    userInput,
    ruleSelectType,
    setruleInfobackup,
    onlyView,
    setRuledataloading,
    setruleDetailsInfo,
    ruleDetailsInfo

}) => {

    const serviceRef = useRef()
    const groupRef = useRef()
    const groupRef1 = useRef()
    const rulRef = useRef()
    const crRef = useRef()

    const [groupList, setgroupList] = useState([])
    const [isGroupLoading, setisGroupLoading] = useState(true)
    const [realtimeRuleList, setrealtimeRuleList] = useState([])
    const [isrealtimeRuleLoading, setisrealtimeRuleLoading] = useState(true)
    const [serviceList, setserviceList] = useState([])
    const [isserviceLoading, setserviceLoading] = useState(true)

    const [ruleInput, setruleInput] = useState({

        commissionRuleName: '',
        reward_type: 0,
        pointExpireDays: 365,

        isFinBasedOffer: false,
        offer_type: 1,
        offerCount: 0,
        offerAmount: 0,

        target: false,
        target_type: 1,
        target_count: 0,
        target_amount: 0,

        isQuota: false,
        quotaType: 0,
        quotaCount: 0,
        quotaAmount: 0,

        isRxQuota: false,
        rxQuotaType: 0,
        rxQuotaCount: 0,
        rxQuotaAmount: 0,

        isTime: false,
        startHour: ' ',
        endHour: ' ',

        is_voucher_reward: false,
        reward_voucherid: null,
        statusFlag: false,
        isDefault: false,
        isPoint: false,
        startDate: '',
        endDate: '',
        isCertainTimeline: false,
        timelineType: ' ',
        isTimelineRange: false,
        staticTimeline: 0,
        startTimeline: 0,
        endTimeline: 0,
        commissionType: 'fixed',
        snAmount: 0,
        rxAmount: 0,
        isPercentage: false,
        min: 0,
        max: 0,
 
        flexibleRules: [],
        returnCommissionId: 0,
        outsideHourCommissionId: 0,
        returnCertainTimelineId: 0,
        isDailyOffer: false,
        is_voucher_reward: false,
        snreward_voucherid : "",
        rxreward_voucherid : "",
        is_datapack_reward: false,
        snreward_datapack_groupid : "",
        rxreward_datapack_groupid : ""
    })

    useEffect(() => {
        if (ruleSelectType === 1 && !realtimeRuleList.length) {
            // Fetch Campaign rule..
            useJwt2.commissionListDropdown().then(res => {
                setrealtimeRuleList(res.data.payload.map(i => { return {value: i.commission_id, label: i.commission_rule_name} }))
                setisrealtimeRuleLoading(false)
            }).catch(err => {
                Error(err)
            })
        }
    }, [ruleSelectType])

    useEffect(() => {
        Promise.all([
            useJwt2.getCentralGroup().then(res => {
                const allGroup = res.data.payload.map(item => {
                    return {value: item.id, label: item.group_name}
                })
                setgroupList(allGroup)
                setisGroupLoading(false)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.getServiceList().then(res => {
                const services = res.data.payload.map(item => {
                    return {value: item.service_id, label: item.keyword_description || item.service_keyword}
                })
                setserviceList(services)
                setserviceLoading(false)
            }).catch(err => {
                Error(err)        
            })
        ])
    }, [])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const handleChangeRule = (selected) => {
        setruleDetailsInfo(ruleInput)
        setUserInput({ ...userInput, commissionId: selected.value})
        setRuledataloading(true)
        useJwt2.commissionruleDetails({commission_id: selected.value}).then(res => {
            const row = res.data.payload
            row.flexiblerules = row.flexiblerules && row.flexiblerules.length ? row.flexiblerules : []
            const flexibleRules = row.flexiblerules.map(item => {
                return {
                    startRange: item['start_range'], 
                    snAmount: item['sn_amount'], 
                    rxAmount: item['rx_amount'], 
                    endRange: item['end_range'],
    
                    isPercentage: item['is_percentage'],
                    max: item['max'],
                    min: item['min'],
    
                    snreward_datapack_groupid: item['snreward_datapack_groupid'], 
                    rxreward_datapack_groupid: item['rxreward_datapack_groupid'], 
    
                    snreward_voucherid: item['snreward_voucherid'], 
                    rxreward_voucherid: item['rxreward_voucherid']
                }
            })
            const data = {
    
                commissionRuleName: row['commission_rule_name'],
                reward_type: +row['reward_type'],
                pointExpireDays: +row['point_expire_days'],
        
                isFinBasedOffer: row['is_fin_based_offer'],
                offer_type: +row['offer_type'],
                offerCount: +row['offer_count'],
                offerAmount: +row['offer_amount'],
        
                target: row['is_target'],
                target_type: +row['target_type'],
                target_count: +row['target_count'],
                target_amount: +row['target_amount'],
        
                isQuota: row['is_quota'],
                quotaType: +row['quota_type'],
                quotaCount: +row['quota_count'],
                quotaAmount: +row['quota_amount'],
        
                isRxQuota: row['is_rx_quota'],
                rxQuotaType: +row['rx_quota_type'],
                rxQuotaCount: +row['rx_quota_count'],
                rxQuotaAmount: +row['rx_quota_amount'],
        
                isCertainTimeline: row['is_certain_timeline'],
                returnCertainTimelineId: +row['return_certain_timeline_id'],
                timelineType: row['timeline_type'],
                isTimelineRange: row['is_timeline_range'],
                staticTimeline: row['static_timeline'],
                startTimeline: row['start_timeline'],
                endTimeline: row['end_timeline'],
        
                isTime: row['is_time'],
                outsideHourCommissionId: row['outside_hour_commission_id'],
                startHour: row['start_hour'],
                endHour: row['end_hour'],
        
                commissionType: row['commission_type'],
                isPercentage: row['is_percentage'],
                snAmount: row['sn_amount'],
                rxAmount: row['rx_amount'],
                min: row['min'],
                max: row['max'],
                
                snreward_datapack_groupid: row['snreward_datapack_groupid'],
                rxreward_datapack_groupid: row['rxreward_datapack_groupid'],
        
                snreward_voucherid : row['snreward_voucherid'],
                rxreward_voucherid : row['rxreward_voucherid'],
              
                flexibleRules
            }
            console.log('datadatadata => ', data)
            setruleDetailsInfo(data)
            setRuledataloading(false)

        }).catch(err => {
            Error(err)
        })
    }

    return (
        <Fragment>
               <Row>
                   <Col md="6">
                     <Row>
                        <Col sm="8" >
                            <FormGroup>
                                <Label for="campaignName">Campaign Name<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="textarea"
                                    rows={2}
                                    autoFocus={true}
                                    name="campaignName"
                                    id='campaignName'
                                    value={userInput.campaignName}
                                    onChange={handleChange}
                                    required
                                    maxLength='100'
                                    placeholder="name here..."
                                    disabled={onlyView}
                                />
                                <p className='text-right' style={userInput.campaignName.length === 100 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{100 - userInput.campaignName.length} characters remaining</p>
                            </FormGroup>
                        </Col>

                        <Col sm='4' className='mt-2 mb-1'>
                                    <CustomInput 
                                        type='switch'
                                        label='Any Service?'
                                        id='anyservice'
                                        checked={userInput.anyservice}
                                        disabled={onlyView}
                                        onChange= {e => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, anyservice: true})
                                            } else {
                                                setUserInput({ ...userInput, anyservice: false})
                                            }
                                        }}
                                    />
                        </Col>
                     </Row>
                  
                     <Row>
                     <Col sm="6" >
                            <FormGroup>
                                <Label for="receiver">Reward Receiver<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={crRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={
                                        userInput.receiver ? rewardReceiver.find(({ value }) => (value) === userInput.receiver) : rewardReceiver[0]
                                    }
                                    onChange={(selected) => {
                                            setUserInput({...userInput, receiver: selected.value})
                                    }}
                                    isDisabled={onlyView}
                                    options={rewardReceiver}
                                />
                            </FormGroup>
                            <Input
                                required
                                disabled={onlyView}
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => crRef.current.select.focus()}
                                value={userInput.receiver || ''}
                                onChange={e => ''}
                            />
                        </Col>

                        {
                            userInput.receiver === 'b' && <Col sm="6" >
                            <FormGroup>
                                <Label for="receiver">Reward Priority</Label>
                                <Select
                                    isDisabled={onlyView}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={
                                        userInput.reward_priority ? rewardPriority.find(({ value }) => (value) === userInput.reward_priority) : rewardPriority[0]
                                    }
                                    onChange={(selected) => {
                                            setUserInput({...userInput, reward_priority: selected.value})
                                    }}
                                    options={rewardPriority}
                                />
                            </FormGroup>
                        </Col>
                        }
                     </Row>
                   </Col>
                    {
                        !userInput.anyservice && <Col sm="6" >
                        <FormGroup>
                            {
                            !isserviceLoading ? <Card className="border p-1">
                                 <CardHeader className='border-bottom'>
                                    <CardTitle tag='h6' style={{fontSize:14}}>Select Services<span style={{ color: 'red' }}>*</span></CardTitle>
                                    <CardTitle tag='h6'><CustomInput
                                        type='checkbox'
                                        id={'All'}
                                        label={'Select All'}
                                        disabled={onlyView}
                                        inline
                                        checked={userInput.multiService.length === serviceList.length}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, multiService: serviceList.map(sr => sr.value), serviceId: serviceList[0]['value']})
                                            } else {
                                                setUserInput({ ...userInput, multiService: [], serviceId: null})
                                            }
                                        }}
                                    /></CardTitle>
                                </CardHeader>
                                <CardBody className='pt-1 pb-0 overflow-auto' style={{maxHeight: '130px'}}>
                                {
                                    serviceList.map(item => <CustomInput
                                            type='checkbox'
                                            id={item.value}
                                            label={item.label}
                                            disabled={onlyView}
                                            onChange={ e => {
                                                if (e.target.checked) {
                                                    setUserInput({ ...userInput, multiService: [...userInput.multiService, item.value], serviceId: item['value']})
                                                } else {
                                                    const newArr = userInput.multiService.filter(i => i !== item.value)
                                                    setUserInput({ ...userInput, multiService: [...newArr]})
                                                }
                                            }}
                                            checked={userInput.multiService.includes(item.value)}
                                        />)
                                }
                                </CardBody>
                            </Card> : <BeatLoader color="#6610f2" size={10}/>
                            }
                           
                              <Input
                                required
                                disabled={onlyView}
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => serviceRef.current.select.focus()}
                                value={userInput.multiService || []}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                    }

                        <Col md="12">
                            <Row>
                            {
                            (userInput.receiver === 's' || userInput.receiver === 'b') &&  <Col md="6">
                            <Card>
                                <CardHeader>
                                    <h5>Reward Sender Group</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                    <Col sm='4' className='mt-1 mb-1'>
                                    <CustomInput 
                                        type='switch'
                                        label='Any One?'
                                        id='anygroup'
                                        checked={userInput.anysendergroup}
                                        onChange= {e => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, anysendergroup: true})
                                            } else {
                                                setUserInput({ ...userInput, anysendergroup: false})
                                            }
                                        }}
                                        disabled={onlyView}
                                    />
                                </Col>
                                {
                                    !userInput.anysendergroup && <Col sm="8" >
                                    <FormGroup>
                                        <Label for="Businesses">Select Sender Group <span style={{ color: 'red' }}>*</span></Label>
                                       { !isGroupLoading ? <Select
                                            ref={groupRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            defaultValue={
                                                userInput.sendergroup ? groupList.find(({ value }) => (+value) === (+userInput.sendergroup)) : null
                                            }
                                            classNamePrefix='select'
                                            onChange={(selected) => {
                                                if (selected) {
                                                    setUserInput({...userInput, sendergroup: selected.value})
                                                } else {
                                                    setUserInput({...userInput, sendergroup: 0})
                                                }
                                            }}
                                            isDisabled={onlyView}
                                            options={groupList}
                                            isLoading={isGroupLoading}
                                            menuPlacement='top'
        
                                        /> : <BeatLoader color="#6610f2" size={10}/>
                                       }
                                    </FormGroup>
                                   <Input
                                         required
                                         disabled={onlyView}
                                         style={{
                                             opacity: 0,
                                             width: "100%",
                                             height: 0
                                             // position: "absolute"
                                         }}
                                         onFocus={e => groupRef.current.select.focus()}
                                         value={userInput.sendergroup || ''}
                                         onChange={e => ''}
        
                                     />
                                    
                                    </Col>
                                }
                                
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        
                        }
                          {
                            (userInput.receiver === 'r' || userInput.receiver === 'b') &&  <Col md="6">
                            <Card>
                                <CardHeader>
                                    <h5>Reward Receiver Group</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                    <Col sm='4' className='mt-1 mb-1'>
                                    <CustomInput 
                                        type='switch'
                                        label='Any One?'
                                        id='anyreceivergroup'
                                        checked={userInput.anyreceivergroup}
                                        disabled={onlyView}
                                        onChange= {e => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, anyreceivergroup: true})
                                            } else {
                                                setUserInput({ ...userInput, anyreceivergroup: false})
                                            }
                                        }}
                                    />
                                </Col>
                                {
                                    !userInput.anyreceivergroup && <Col sm="8" >
                                    <FormGroup>
                                     <Label for="Businesses">Select Receiver Group <span style={{ color: 'red' }}>*</span></Label>
                                     {
                                     !isGroupLoading ? <Select
                                         ref={groupRef1}
                                         theme={selectThemeColors}
                                         maxMenuHeight={200}
                                         className='react-select'
                                         classNamePrefix='select'
                                         defaultValue={
                                            userInput.receivergroup ? groupList.find(({ value }) => (+value) === (+userInput.receivergroup)) : null
                                        }
                                         onChange={(selected) => {
                                             if (selected) {
                                                setUserInput({...userInput, receivergroup: selected.value})
                                             } else {
                                                setUserInput({...userInput, receivergroup: 0})
                                             }
                                         }}
                                         isDisabled={onlyView}
                                         options={groupList}
                                         isLoading={isGroupLoading}
                                         menuPlacement='top'
     
                                     /> : <BeatLoader color="#6610f2" size={10}/> 
                                    }
                                 </FormGroup>
                                   <Input
                                         required
                                         disabled={onlyView}
                                         style={{
                                             opacity: 0,
                                             width: "100%",
                                             height: 0
                                             // position: "absolute"
                                         }}
                                         onFocus={e => groupRef1.current.select.focus()}
                                         value={userInput.receivergroup || ''}
                                         onChange={e => ''}
                                     />
                             </Col>
                                }
                                
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        
                        }

                         {
                                    ruleSelectType === 1 &&  <Col sm="6" >
                                    <FormGroup>
                                   <Label for="Businesses">Campaign Rule<span style={{ color: 'red' }}>*</span></Label>
                                   {
                                    !isrealtimeRuleLoading ? <Select
                                       ref={rulRef}
                                       theme={selectThemeColors}
                                       maxMenuHeight={200}
                                       className='react-select'
                                       classNamePrefix='select'
                                       onChange={(selected) => handleChangeRule(selected)}
                                       options={realtimeRuleList}
                                       isLoading={isrealtimeRuleLoading}
                                       menuPlacement='top'
                                       isDisabled={onlyView}
                                       defaultValue={
                                        userInput.commissionId ? realtimeRuleList.find(({ value }) => (+value) === (+userInput.commissionId)) : null
                                       }
                                   /> : <BeatLoader color="#6610f2" size={10}/> 
                                   }
                               </FormGroup>
                               <Input
                                   required
                                   disabled={onlyView}
                                   style={{
                                       opacity: 0,
                                       width: "100%",
                                       height: 0
                                       // position: "absolute"
                                   }}
                                   onFocus={e => rulRef.current.select.focus()}
                                   value={userInput.commissionId || ''}
                                   onChange={e => ''}
                               />
                           </Col>
                        }
                         <Col md="12">
                            <Row>
                            <Col sm='6'>
                                <Card>
                                    <CardHeader>SET EXPIRY</CardHeader>
                                    <CardBody>
                                        <Row>
                                        <Col md='6' >
                                            <FormGroup>
                                                <Label for="startDate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                                                <Input type="datetime-local"
                                                    min={new Date().toLocaleDateString('fr-CA')}
                                                    name="startDate"
                                                    id='startDate'
                                                    value={userInput.startDate}
                                                    onChange={e => {
                                                        const startDate = e.target.value
                                                        setUserInput({
                                                            ...userInput,
                                                            startDate,
                                                            // Reset endDate if it's before the new startDate
                                                            endDate: new Date(userInput.endDate) > new Date(startDate) ? userInput.endDate : ''
                                                        })
                                                    }}
                                                    required
                                                    placeholder='0'
                                                    disabled={onlyView}

                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='6' >
                                            <FormGroup>
                                                <Label for="endDate">End Date<span style={{ color: 'red' }}>*</span></Label>
                                                <Input type="datetime-local"
                                                    min={new Date().toISOString().slice(0, 16)}
                                                    name="endDate"
                                                    id='endDate'
                                                    value={userInput.endDate}
                                                    onChange={e => {
                                                        const endDate = e.target.value
                                                        setUserInput({
                                                            ...userInput,
                                                            endDate,
                                                            // Reset endDate if it's before the new startDate
                                                            startDate: new Date(endDate) > new Date(userInput.startDate) ? userInput.startDate : ''
                                                        })
                                                    }}
                                                    required
                                                    placeholder='0'
                                                    disabled={onlyView}

                                                />
                                            </FormGroup>
                                        </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>


                            <Col md="6">
                            <Card>
                                <CardHeader>
                                    <h5>Dynamic Campaign</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                    <Col sm='6' className='mt-1 mb-1'>
                                    <CustomInput 
                                        type='switch'
                                        label='Is Dynamic Campaign?'
                                        id='dynamiccampaign'
                                        checked={userInput.isDynamicCamp}
                                        onChange= {e => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, isDynamicCamp: true})
                                            } else {
                                                setUserInput({ ...userInput, isDynamicCamp: false})
                                            }
                                        }}
                                        disabled={onlyView}

                                    />
                                </Col>
                                {
                                    userInput.isDynamicCamp && <Col sm="6" >
                                         <FormGroup>
                                        <Label for="Businesses">Enter Campaign Expire(Days) <span style={{ color: 'red' }}>*</span></Label>
                                        <Input type="number"
                                            name="dynamicCampExpire"
                                            id="dynamicCampExpire"
                                            value={userInput.dynamicCampExpire}
                                            onChange={handleChange}
                                            required
                                            placeholder='0'
                                            onWheel={(e) => e.target.blur()}
                                            disabled={onlyView}

                                        />
                                        </FormGroup>
                                    </Col>
                                }
                                
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                            </Row>
                         </Col>

                            </Row>
                        </Col>
                      
                    
        </Row>
        </Fragment>
    )
    
}

export default CampaignLogic