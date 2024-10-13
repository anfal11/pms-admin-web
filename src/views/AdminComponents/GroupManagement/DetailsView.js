import React, { Fragment, useEffect, useRef, useState, useMemo } from 'react'
import { ChevronLeft, FileText, Search, UploadCloud, X } from 'react-feather'
import useJwt2 from '@src/auth/jwt/useJwt2'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, InputGroup, InputGroupAddon, InputGroupText, Form, FormGroup, Input, Label, Row, Spinner, Table } from 'reactstrap'
import { Skeleton } from 'antd'
import { Error } from '../../viewhelper'

// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import "antd/dist/antd.css"

const ViewDetails = ({userInput, toggleDetailsView, isMain}) => {

    const [isloading, setloading] = useState(true)
    const [groupRules, setgroupRules] = useState([])

    useEffect(() => {

        if (isMain) {
            useJwt2.groupV3Details({group_id: userInput.id}).then(res => {
                setgroupRules(res.data.payload.conditions || [])
                setloading(false)
            }).catch(err => {
                Error(err)
            })
        } else {
            useJwt2.groupV3TempDetails({group_id: userInput.id}).then(res => {
                setgroupRules(res.data.payload.conditions || [])
                setloading(false)
            }).catch(err => {
                Error(err)
            })
        }
        
    }, [])

    console.log('groupRules==> ', groupRules)
    return ( 
        isloading ? <Fragment> <Skeleton active /> <Skeleton active /> <Skeleton active /> </Fragment> : <Fragment>
            <Button.Ripple className='mb-1' color='primary' onClick={() => toggleDetailsView()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Group Details Info</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="group_name">Group Name<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="group_name"
                                        id='group_name'
                                        value={userInput.group_name}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
        
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="type">Group Creation Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="creationtype"
                                        id='creationtype'
                                        value={userInput.creation_type === 1 ? 'Bulk-Upload' : 'Group-Profiling'}
                                        disabled
                                    />
                                </FormGroup>
        
                            </Col>
                    
                            {
                                userInput.creation_type === 2 && <GroupProfilingView userInput={userInput} />
                            }
                       
                            {
                                userInput.creation_type === 1 &&  <Col sm="10" >
                                <FormGroup>
                                    <Label for="type">File-Url</Label>
                                    <h6><a href={userInput.csv_file_name} target='_blank' > {userInput.csv_file_name} </a></h6>
                                </FormGroup>
        
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>

                {
                   userInput.creation_type === 2 && <GroupProfilingItemDetails groupRules={groupRules}/>
                }

            </Form>
        </Fragment>
    )
}

const GroupProfilingView = ({userInput}) => {

    return (
        <Fragment>

                <Col sm="4" >
                    <FormGroup>
                        <Label for="sync-type">Sync-Type<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text"
                            name="sync-type"
                            id='sync-type'
                            value={userInput.sync_type}
                            disabled
                        />
                    </FormGroup>
                </Col>
                {
                    userInput.sync_type !== 'One-Time' &&  <Col sm="4" >
                    <FormGroup>
                        <Label for="sync_expire_days">Sync-Expiry Days<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="number"
                            name="sync_expire_days"
                            id='sync_expire_days'
                            value={userInput.sync_expire_days}
                            disabled
                        />
                    </FormGroup>
                </Col> 
                }

        </Fragment>
    )
}

const TeaxtRange = ({keyword1, keyword2, value1, value2}) => {
    return   <InputGroup >
        <Input 
            type="text" 
            name={keyword1} 
            value={value1}
            disabled
        />
        <InputGroupAddon addonType='append'>
          <InputGroupText>~</InputGroupText>
        </InputGroupAddon>
        <Input 
            type="text" 
            name={keyword2} 
            value={value2}
            disabled
        />  
    </InputGroup>
}

const GroupProfilingItemDetails = ({groupRules}) => {
    return <Fragment>
        <Row>
            {
                groupRules.map((item2) => {
                    const itemmatchvalue = item2
                    const item = item2.id
                    return  <Col sm='4' style={{padding: '5px'}} key={item}>
                    <Card style={{margin: 0}}>
                        <CardBody style={{padding: '.7rem'}}>
                        <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>{itemmatchvalue['target_column_label_name']} </h6></div>
                    <FormGroup>
                            <Label for={item}>{itemmatchvalue['input_label_name']}-{itemmatchvalue['condition_type']}-{itemmatchvalue['condition_subtype']}</Label>
                            {(() => {
                                switch (itemmatchvalue['condition_type']) {
                                case 'number':
                                case 'text':
                                    return  <Input type="text"
                                    name={item}
                                    id={item}
                                    value={itemmatchvalue['data_values']}
                                    disabled
                               />
                                case 'dropdown':
                                    if (itemmatchvalue['condition_subtype'] !== 'multiple') {
                                        return  <Input type="text"
                                        name={item}
                                        id={item}
                                        value={(itemmatchvalue['condition_value'].filter(ii => ii.value === itemmatchvalue['data_values']))?.[0]['label']}
                                        disabled
                                     />
                                    } else {
                                        return <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={itemmatchvalue['condition_value'].filter(ii => itemmatchvalue['data_values'].includes(ii.value))}
                                                options={itemmatchvalue['condition_value']}
                                                isMulti={true}
                                                isDisabled={true}
                                            />
                                    }

                                case 'date-time':
                                    return <Input type="text"
                                    name={item}
                                    id={item}
                                    value={itemmatchvalue['data_values']}
                                    disabled
                                 />
                                    
                                case 'range':
                                    return <TeaxtRange 
                                    keyword1={item}
                                    keyword2={`${item}--`} 
                                    value1={itemmatchvalue['data_values']['min']}
                                    value2={itemmatchvalue['data_values']['max']}
                                 />

                                }
                            })()}
                        </FormGroup>
                        
                        </CardBody>
                    </Card>
                
                  </Col>
                })
                        
            }
        </Row>
    </Fragment>
}

export default ViewDetails