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
    CardTitle
} from 'reactstrap'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Minus, Plus } from 'react-feather'
import CampaignLogic from './campaignLogic'
import RealTimeCommisionRuleLogic from '../RealTimeCommisionRule/RealTimeCommisionRuleLogic'
import { Skeleton } from 'antd'

const DetailsView = ({ setModal, userInput, setUserInput, isdataloading, setruleInfo, ruleInfo }) => {

    const [cashbackFlexibleData, setCashbackFlexibleData] = useState([{ startRange: 0, isPercentage: false }])
    const [voucherFlexibleData, setVoucherFlexibleData] = useState([{ startRange: 0 }])
    const [datapackFlexibleData, setDatapackFlexibleData] = useState([{ startRange: 0 }])
    const [pointFlexibleData, setPointFlexibleData] = useState([{ startRange: 0 }])
    const [ruleDataLoading, setRuledataloading] = useState(false)


    return (
        isdataloading ? <Skeleton avatar paragraph={{ rows: 10 }} /> : <Fragment>
            <Button.Ripple className='mb-1' color='primary' onClick={() => setModal(false)}>
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Row>
                    <Col md="12">
                       <CampaignLogic 
                            userInput={userInput}
                            setUserInput={setUserInput}
                            ruleSelectType={2}
                            onlyView={true}
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
        </Fragment>
    )
}
export default DetailsView