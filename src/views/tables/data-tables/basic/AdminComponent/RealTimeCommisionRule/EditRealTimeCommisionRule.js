import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Minus, Plus } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../DataTable'
import RealTimeCommisionRuleLogic from './RealTimeCommisionRuleLogic'
import './rStyle.css'
import { RuleDataReFormat } from './RuleDataReFormat'
const MySwal = withReactContent(Swal)

const EditRealTimeCommisionRule = ({
    setModal,
    editModal,
    seteditModal,
    commisionInfo,
    setReset,
    resetData
}) => {

    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)

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

    /**
     * Cash-back flexiable rule 
     *     flexibleRules: [
                {
                isPercentage: false,
                max: 0,
                min: 0,
                rxAmount: "10",
                snAmount: "11",
                startRange: "01",
                endRange: "100"
            }, {
                isPercentage: true,
                max: 10,
                min: 30,
                rxAmount: "10",
                snAmount: "11",
                startRange: "200",
                endRange: "500"
            }
        ]

        Point....
           flexibleRules: [
                {
                    startRange: '90', 
                    snAmount: '7', 
                    rxAmount: '8', 
                    endRange: '999'
                },  {
                    startRange: '90', 
                    snAmount: '7', 
                    rxAmount: '8', 
                    endRange: '999'
                }
        ]
        data-pack
        flexibleRules: [
            {startRange: '1', snreward_datapack_groupid: '17', rxreward_datapack_groupid: '12', endRange: '32'},
            {startRange: '1', snreward_datapack_groupid: '17', rxreward_datapack_groupid: '12', endRange: '32'}
        ]

        voucher..
         flexibleRules: [
            {startRange: '10', snreward_voucherid: 'PD0044', rxreward_voucherid: 'PD0044', endRange: '20'},
            {startRange: '10', snreward_voucherid: 'PD0044', rxreward_voucherid: 'PD0044', endRange: '20'}
        ]
     */

    const onSubmit = (e) => {
        e.preventDefault()

        const flexibleData = {
            cashbackFlexibleData,
            voucherFlexibleData,
            datapackFlexibleData,
            pointFlexibleData
        }
        const finalRequestData = RuleDataReFormat(userInput, flexibleData)
        const {commission_id, created_by, create_date } = userInput

        setPointRuleloading(true)
        useJwt2.commissionruleEdit({...finalRequestData, commission_id, created_by, create_date }).then(res => {
                Success(res)
                setReset(!resetData)
                setModal(false)
                seteditModal(false)
                setPointRuleloading(false)
        }).catch((error) => {
                setPointRuleloading(false)
                Error(error)
            })

    }


    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' onClick={() => {
                seteditModal(false)
                setModal(false)
            }} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Update Online Campaign Rule</CardTitle>
                </CardHeader>
            </Card>

            <Form  style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">

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
                            onlyView={false}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col sm="12" className='text-center'>
                        {
                            pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
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

export default EditRealTimeCommisionRule