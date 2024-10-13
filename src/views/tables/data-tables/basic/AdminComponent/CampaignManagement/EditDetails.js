import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Button,
    CardTitle,
    Form,
    Spinner
} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Minus, Plus } from 'react-feather'
import CampaignLogic from './campaignLogic'
import RealTimeCommisionRuleLogic from '../RealTimeCommisionRule/RealTimeCommisionRuleLogic'
import { Skeleton } from 'antd'
import { Error, Success } from '../../../../../viewhelper'

const EditDetails = ({ setModal, userInput, setUserInput, isdataloading, setruleInfo, ruleInfo, resetData, setReset }) => {

    const [cashbackFlexibleData, setCashbackFlexibleData] = useState([{ startRange: 0, isPercentage: false }])
    const [voucherFlexibleData, setVoucherFlexibleData] = useState([{ startRange: 0 }])
    const [datapackFlexibleData, setDatapackFlexibleData] = useState([{ startRange: 0 }])
    const [pointFlexibleData, setPointFlexibleData] = useState([{ startRange: 0 }])
    const [ruleDataLoading, setRuledataloading] = useState(false)

    const [isLoading, setisLoading] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        /**
         * ruleSelectType = 1 => select from created rule ruleSelectType = 2 => create rule with campaign
         */
        const data = {
            foreign_id: userInput.campaign_id,
            createdby: userInput.create_by,
            ruleSelectType: 1,
            onlineRuleInfo: ruleInfo,
            campaignName: userInput.campaignName,
            anyservice : userInput.anyservice,
            multiService: userInput.anyservice ? [1] : userInput.multiService,

            receiver: userInput.receiver,
            anysendergroup: userInput.anysendergroup,
            sendergroup: userInput.anysendergroup ? 1 : userInput.sendergroup,
            anyreceivergroup: userInput.anyreceivergroup,
            receivergroup: userInput.anyreceivergroup ? 1 : userInput.receivergroup,
    
            reward_priority: userInput.reward_priority,
    
            commissionId: userInput.commissionId,
    
            startDate: userInput.startDate,
            endDate: userInput.endDate,
    
            isDynamicCamp: userInput.isDynamicCamp,
            dynamicCampExpire: userInput.dynamicCampExpire
        }
        // console.log('data => ', data)
        setisLoading(true)
        useJwt2.onlineCampaignEdit(data).then(response => {
            setReset(!resetData)
            Success(response)
            setModal(false)
            setisLoading(false)

        }).catch(err => {
            Error(err)
            setisLoading(false)
        })
    }

    return (
        isdataloading ? <Skeleton avatar paragraph={{ rows: 10 }} /> : <Fragment>
            <Button.Ripple className='mb-1' color='primary' onClick={() => setModal(false)}>
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form  style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">

            <Row>
                    <Col md="12">
                       <CampaignLogic 
                            userInput={userInput}
                            setUserInput={setUserInput}
                            ruleSelectType={2}
                            onlyView={false}
                            setruleInfobackup={setruleInfo}
                            setRuledataloading={setRuledataloading}
                            setruleDetailsInfo={setruleInfo}
                            ruleDetailsInfo={ruleInfo}
                        />
                    </Col>

                    <Col md="12">
                    <Fragment>
                       <Card style={{border: '2px solid #f2b9b9'}} className="RealTimeCommisionRuleLogicViewInCampaignPage">
                        <CardBody className="cardBody">
                            <CardHeader className="cardHeader" >
                                <CardTitle>
                                    Online Rule Info
                                </CardTitle>
                            </CardHeader>
                            <RealTimeCommisionRuleLogic 
                                userInput={ruleInfo}
                                setUserInput={setruleInfo}
                                cashbackFlexibleData={cashbackFlexibleData}
                                setCashbackFlexibleData={setCashbackFlexibleData}
                                voucherFlexibleData={voucherFlexibleData}
                                setVoucherFlexibleData={setVoucherFlexibleData}

                                datapackFlexibleData={datapackFlexibleData}
                                setDatapackFlexibleData={setDatapackFlexibleData}
                                pointFlexibleData={pointFlexibleData}
                                setPointFlexibleData={setPointFlexibleData}
                                onlyView={true}
                            />
                        
                        </CardBody>
                </Card> 
            </Fragment>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" className='text-center'>
                        {
                            isLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Update</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
export default EditDetails