import { Fragment, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, FormGroup, Row, Col, CustomInput,  Input, Form, Button, Card, CardBody } from 'reactstrap'
import RealTimeCommisionRuleLogic from '../RealTimeCommisionRule/RealTimeCommisionRuleLogic'
import { RuleDataReFormat } from '../RealTimeCommisionRule/RuleDataReFormat'

const OnlineRuleCreateOrSelect = ({ setrerender, setCreateRule, stepper, type, setruleSelectType, ruleSelectType, setruleInfo }) => {

    const [isComponentLoaded, setIsComponentLoaded] = useState(false)

    const handleButtonClick = (id) => {
        setruleSelectType(id)
        if (!isComponentLoaded) {
          setIsComponentLoaded(true)
        }

        if (id === 1) {
          setCreateRule(false)
        }
    }

    // const [userInput, setUserInput] = useState({

    //     reward_type: 0,

    //     isFinBasedOffer: false,
    //     offer_type: 1,
    //     offerCount: 0,
    //     offerAmount: 0,

    //     target: false,
    //     target_type: 1,
    //     target_count: 0,
    //     target_amount: 0,

    //     isQuota: false,
    //     quotaType: 0,
    //     quotaCount: 0,
    //     quotaAmount: 0,


    //     is_voucher_reward: false,
    //     reward_voucherid: null,
    //     commissionRuleName: '',
    //     statusFlag: false,
    //     isDefault: false,
    //     isPoint: false,
    //     startDate: '',
    //     endDate: '',
    //     isCertainTimeline: false,
    //     timelineType: ' ',
    //     isTimelineRange: false,
    //     staticTimeline: 0,
    //     startTimeline: 0,
    //     endTimeline: 0,
    //     isTime: false,
    //     startHour: ' ',
    //     endHour: ' ',
    //     commissionType: 'fixed',
    //     snAmount: 0,
    //     rxAmount: 0,
    //     isPercentage: false,
    //     min: 0,
    //     max: 0,
 
    //     isRxQuota: false,
    //     rxQuotaType: 0,
    //     rxQuotaCount: 0,
    //     rxQuotaAmount: 0,
    //     flexibleRules: [],
    //     returnCommissionId: 0,
    //     outsideHourCommissionId: 0,
    //     returnCertainTimelineId: 0,
    //     isDailyOffer: false,
    //     pointExpireDays: 365,
    //     is_voucher_reward: false,
    //     snreward_voucherid : "",
    //     rxreward_voucherid : "",
    //     is_datapack_reward: false,
    //     snreward_datapack_groupid : "",
    //     rxreward_datapack_groupid : ""
    // })
    const [cashbackFlexibleData, setCashbackFlexibleData] = useState([{ startRange: 0, isPercentage: false }])
    const [voucherFlexibleData, setVoucherFlexibleData] = useState([{ startRange: 0 }])
    const [datapackFlexibleData, setDatapackFlexibleData] = useState([{ startRange: 0 }])
    const [pointFlexibleData, setPointFlexibleData] = useState([{ startRange: 0 }])

    const [userInput, setUserInput] = useState({

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

    const onSubmit = (e) => {
      const flexibleData = {
        cashbackFlexibleData,
        voucherFlexibleData,
        datapackFlexibleData,
        pointFlexibleData
      }
      const finalRequestData = RuleDataReFormat(userInput, flexibleData)

        e.preventDefault()
        setruleInfo(finalRequestData)
        setCreateRule(true)
        setrerender(true)
        stepper.next()
    }

    console.log('ruleSelectType ==> ', ruleSelectType)
  return (
    <Fragment>
      <Form onSubmit={onSubmit} autoComplete="off">
        
        <Card>
            <CardBody>
              <div class="row onlineruleselectorcreate">
                <div class="col-md mb-md-0 mb-2">
                    <div class="form-check custom-option custom-option-basic checked">
                    <label class="form-check-label custom-option-content" for="customRadioTemp1">
                       <CustomInput 
                        type='radio' 
                        id='customRadioTemp1' 
                        name='customRadioTemp' 
                        inline 
                        label='Online-Rule' 
                        defaultChecked 
                        onChange={() => handleButtonClick(1)}
                       />

                        {/* <input name="customRadioTemp" class="form-check-input" type="radio" value="" id="customRadioTemp1" checked="true" /> */}
                        <span class="custom-option-header">
                        {/* <span class="h6 mb-0">Online-Rule</span> */}
                        </span>
                        <span class="custom-option-body">
                        <small>Online Rule From Created List</small>
                        </span>
                    </label>
                    </div>
                </div>
                <div class="col-md">
                    <div class="form-check custom-option custom-option-basic">
                    <label class="form-check-label custom-option-content" for="customRadioTemp2">
                        <CustomInput 
                            type='radio' 
                            id='customRadioTemp2' 
                            name='customRadioTemp' 
                            inline 
                            label='Create Online-Rule' 
                            onChange={() => handleButtonClick(2)}

                        />
                        {/* <input name="customRadioTemp" class="form-check-input" type="radio" value="" id="customRadioTemp2" /> */}
                        <span class="custom-option-header">
                        {/* <span class="h6 mb-0">Create Online-Rule</span> */}
                        </span>
                        <span class="custom-option-body">
                        <small>Create New Online-Rule From Here</small>
                        </span>
                    </label>
                    </div>
                </div>
                </div>
            </CardBody>
        </Card>

        {isComponentLoaded && (
            <div style={{ display: ruleSelectType === 2 ? 'block' : 'none' }}>
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
            </div>
        )}
    
        <div className='d-flex justify-content-between'>
          {/* <Button.Ripple color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button.Ripple> */}
          <div></div>
          {
            ruleSelectType === 2 ? <Button.Ripple color='primary' className='btn-next' type="submit" >
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple> :  <Button.Ripple color='primary' className='btn-next' onClick={() => {
            setrerender(true)
            stepper.next()
          }} type="button" >
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
          }
        </div>
      </Form>
    </Fragment>
  )
}

export default OnlineRuleCreateOrSelect