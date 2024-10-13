import React, { useEffect, useState, useRef, Fragment } from 'react'
import { ChevronLeft} from 'react-feather'
import {Table, Card, CardHeader, CardTitle, Button, CardBody, Badge} from 'reactstrap'

import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error } from '../../../../viewhelper'

import { Skeleton } from 'antd'

const dataLabel = ['Rule Name', 'Service Name', 'Is Range', 'Data', 'Start Date', 'End Date', 'Tier Name', 'Point Expiry Interval(days)', 'Active']

const dataKey = ['rule_name', 'servicename', 'is_range', 'data', 'start_date', 'end_date', 'tier_name', 'point_expiry_interval_days', 'is_active']

const TempDetailsView = ({setruleidforview, ruleidforview, ref_id}) => {

    const [isLoading, setisLoading] = useState(true)

    const [newdata, setnewdata] = useState({})
    const [operation, setoperation] = useState('')

    const [userInput, setUserInput] = useState({})

    const back = () => {

        setruleidforview(null)
    }


    useEffect(async() => {

        setisLoading(true)

        const [details, tempdetails] = await Promise.all([ 
                useJwt2.pmsPointRuleDetail({rule_id: ref_id || -1}).then(async res => {
                const { payload } = res.data
                console.log('main ', payload)
                if (payload) {

                    const modifyData = {
                        ...payload,
                        servicename: payload.map_item.length ? payload.map_item[0]['service_keyword'] : '--',
                        is_range: payload.is_range ? 'True' : 'False',
                        data: null,
                        start_date: payload.start_date ? (payload.start_date).split('T')[0] : '--',
                        end_date: payload.end_date ? (payload.end_date).split('T')[0] : '--',
                        is_active: payload.is_active ? 'True' : 'False'

                    }
                    //setUserInput(modifyData)

                    //return payload.map_item.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.start_range || '--'}</div>)
                   
                    return modifyData

                } else {

                    //setUserInput({})
                    return {}
                }
            
            }).catch(err => {

                console.log(err.response)
                Error(err)
                return {}
            }),

            useJwt2.pmsTempPointRuleDetail({rule_id: ruleidforview}).then(async res => {
                const { payload } = res.data
                console.log('temp payload ', payload)
                const modifyData = {
                    ...payload,
                    servicename: payload.map_item.length ? payload.map_item[0]['service_keyword'] : '--',
                    is_range: payload.is_range ? 'True' : 'False',
                    data: null,
                    start_date: payload.start_date ? (payload.start_date).split('T')[0] : '--',
                    end_date: payload.end_date ? (payload.end_date).split('T')[0] : '--',
                    is_active: payload.is_active ? 'True' : 'False'
                }
                return modifyData
            
            }).catch(err => {
                console.log(err.response)
                Error(err)
                return {}
            })
        ])
        
        if (tempdetails['action'] !== 'Insert') {

            let issame = true
            console.log('details ', details)
            tempdetails['map_item'].map((item, index) => {
                const start_range = details['map_item'][index] ? details['map_item'][index]['start_range'] : -1
                const end_range = details['map_item'][index] ? details['map_item'][index]['end_range'] : -1
                const point_receiver_type = details['map_item'][index] ? details['map_item'][index]['point_receiver_type'] : ""
                const sender_reward_point = details['map_item'][index] ? details['map_item'][index]['sender_reward_point'] : -1
                const receiver_reward_point = details['map_item'][index] ? details['map_item'][index]['receiver_reward_point'] : -1

                console.log('item ', item)
                console.log('raw ', { start_range, end_range, sender_reward_point})
                if (item['start_range'] !== start_range) {
                    issame = false
                } else if (item['end_range'] !== end_range) {
                    issame = false
                } else if (item['sender_reward_point'] !== sender_reward_point) {
                    issame = false
                } else if (item['point_receiver_type'] !== point_receiver_type) {
                    issame = false
                } else if (item['receiver_reward_point'] !== receiver_reward_point) {
                    issame = false
                }
            })

            if (!issame) {
                tempdetails['data'] = " "
            }

        }

        setUserInput(details)
        setoperation(tempdetails['action'])
        setnewdata(tempdetails)

        setisLoading(false)
        
    }, [])

    return (
        <Fragment>
            {
                isLoading ? <Fragment> <Skeleton active /> <Skeleton active /> <Skeleton active /> </Fragment> :    <Fragment> <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Service Point Rule Temp Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                   <Table hover responsive> 
                    <thead>
                        <tr>
                        <th>Parameter</th>
                        <th>Old Data</th>
                        <th>New Data</th>
                        </tr>
                    </thead>
                    {/* background-color: #f9c9c9 */}
                    <tbody>
                        {
                            dataLabel.map((item, index) => <tr key={index + 1} style={{backgroundColor: (userInput[dataKey[index]] !== newdata[dataKey[index]] && operation !== 'Insert') ? '#f9c9c9' : null}}>
                                <td style={{fontWeight: 'bold'}}>{item}</td>
                                <td>
                                {
                                    dataKey[index] === 'data' && operation !== 'Insert' ? <Fragment>
                                        <Table responsive>
                                        <thead>
                                            <tr>
                                            <th>Start Range</th>
                                            <th>End Range</th>
                                            <th>Point Receiver Type</th>
                                            <th>Sender Point Per Amount</th>
                                            <th>Receiver Point Per Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                         <tr>
                                            {
                                                <Fragment>
                                                    <td>
                                                    {
                                                        userInput['map_item'].map((e, i) => <div key={i + 1} style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.start_range}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        userInput['map_item'].map((e, i) => <div key={i + 1} style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.end_range || '--'}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        userInput['map_item'].map((e, i) => <div key={i + 1} style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.point_receiver_type || '--'}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        userInput['map_item'].map((e, i) => <div key={i + 1} style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.sender_reward_point || '--'}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        userInput['map_item'].map((e, i) => <div key={i + 1} style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.receiver_reward_point || '--'}</div>)
                                                    }
                                                </td>
                                                </Fragment>
                                                
                                                
                                            }
                                            </tr>
                                            
                                        </tbody>
                                        </Table>
                                    </Fragment> : userInput[dataKey[index]]
                                }
                                </td>
                                <td>
                                {
                                    dataKey[index] === 'data' ? <Fragment>
                                        <Table responsive>
                                        <thead>
                                            <tr>
                                            <th>Start Range</th>
                                            <th>End Range</th>
                                            <th>Point Receiver Type</th>
                                            <th>Sender Point Per Amount</th>
                                            <th>Receiver Point Per Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            {
                                                <Fragment>
                                                    <td>
                                                    {
                                                        newdata['map_item'].map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.start_range}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        newdata['map_item'].map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.end_range || '--'}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        newdata['map_item'].map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.point_receiver_type || '--'}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        newdata['map_item'].map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.sender_reward_point || '--'}</div>)
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        newdata['map_item'].map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.receiver_reward_point || '--'}</div>)
                                                    }
                                                </td>
                                                </Fragment>
                                            }
                                            </tr>
                                            
                                        </tbody>
                                        </Table>
                                    </Fragment> : newdata[dataKey[index]]
                                }
                                </td>
                            </tr>
                            )
                        }
                    </tbody>
                   </Table>
                </CardBody>
            </Card>
            </Fragment>
            }
         
        </Fragment>
    )
}

export default TempDetailsView