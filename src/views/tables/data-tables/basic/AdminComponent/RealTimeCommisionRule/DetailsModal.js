import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Button
} from 'reactstrap'
import { formatReadableDate } from '../../../../../helper'
import CommonDataTable from '../ClientSideDataTable'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Minus, Plus } from 'react-feather'
import RealTimeCommisionRuleLogic from './RealTimeCommisionRuleLogic'


const DetailsModal = ({ setModal, modal, commisionInfo, setReset, resetData, getRewardTypeName, campaignRewardType }) => {

    const [cashbackFlexibleData, setCashbackFlexibleData] = useState([{ startRange: 0, isPercentage: false }])
    const [voucherFlexibleData, setVoucherFlexibleData] = useState([{ startRange: 0 }])
    const [datapackFlexibleData, setDatapackFlexibleData] = useState([{ startRange: 0 }])
    const [pointFlexibleData, setPointFlexibleData] = useState([{ startRange: 0 }])
    const [userInput, setUserInput] = useState(commisionInfo)

    // const [userInput, setUserInput] = useState({

    //     commissionRuleName: '333',
    //     reward_type: 3,
    //     pointExpireDays: 365,

    //     isFinBasedOffer: true,
    //     offer_type: 4,
    //     offerCount: 10,
    //     offerAmount: 0,

    //     target: true,
    //     target_type: 3,
    //     target_count: 10,
    //     target_amount: 30,

    //     isQuota: true,
    //     quotaType: 2,
    //     quotaCount: 10,
    //     quotaAmount: 40,

    //     isRxQuota: true,
    //     rxQuotaType: 3,
    //     rxQuotaCount: 220,
    //     rxQuotaAmount: 440,

    //     isCertainTimeline: true,
    //     returnCertainTimelineId: 4,
    //     timelineType: 'm',
    //     isTimelineRange: false,
    //     staticTimeline: 5,
    //     startTimeline: 2,
    //     endTimeline: 5,

    //     isTime: true,
    //     outsideHourCommissionId: 4,
    //     startHour: '01:20',
    //     endHour: '19:50',

    //     commissionType: 'flexible',
    //     isPercentage: false,
    //     snAmount: 10,
    //     rxAmount: 10,
    //     min: 220,
    //     max: 330,
        
    //     snreward_datapack_groupid: 17,
    //     rxreward_datapack_groupid: 12,

    //     snreward_voucherid : "PD0044",
    //     rxreward_voucherid : "PD0044",
      
    //     flexibleRules: [
    //          {
    //                 startRange: '90', 
    //                 snAmount: '7', 
    //                 rxAmount: '8', 
    //                 endRange: '999'
    //             },  {
    //                 startRange: '90', 
    //                 snAmount: '7', 
    //                 rxAmount: '8', 
    //                 endRange: '999'
    //             }
    //     ]
    // })

    return (
        modal ? <Fragment>
            <Button.Ripple className='mb-1' color='primary' onClick={() => setModal(false)}>
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Row>
                    <Col md="12">
                      <RealTimeCommisionRuleLogic 
                            userInput={userInput}
                            setUserInput={setUserInput}
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
                    </Col>
                </Row>
        </Fragment> : null
    )
}
export default DetailsModal