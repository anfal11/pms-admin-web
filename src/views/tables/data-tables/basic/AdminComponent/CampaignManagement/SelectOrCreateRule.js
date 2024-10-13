
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Wizard from '@components/wizard'
import { Link, useHistory } from 'react-router-dom'
import { ChevronLeft, ArrowLeft } from 'react-feather'
import OnlineRuleCreateOrSelect from './online-rule'
import CreateCampaignLogic from './CreateCampaign'

const SelectOrCreateRule = () => {

    const history = useHistory()
    const [stepper, setStepper] = useState(null)
    const ref = useRef(null)
    const ref2 = useRef(null)

    const [rerender, setrerender] = useState(false)
    const [ruleSelectType, setruleSelectType] = useState(1)
    const [createRule, setCreateRule] = useState(false)
    const [ruleInfo, setruleInfo] = useState({

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
    const [ruleDetailsInfo, setruleDetailsInfo] = useState(ruleInfo)


    const steps = [
        {
          id: 'select-rule',
          title: 'Online Rule Info',
          subtitle: 'Select or create online rule',
          content: <OnlineRuleCreateOrSelect 
            stepper={stepper} 
            type='wizard-horizontal' 
            setruleSelectType={setruleSelectType} 
            ruleSelectType={ruleSelectType}
            setruleInfo={setruleInfo}
            setCreateRule={setCreateRule}
            setrerender={setrerender}
          />
        },
        {
          id: 'campaign-info',
          title: 'Campaign Info',
          subtitle: 'Add Campaign Info',
          content: <CreateCampaignLogic 
            stepper={stepper} 
            type='wizard-horizontal' 
            setruleSelectType={setruleSelectType} 
            ruleSelectType={ruleSelectType} 
            ruleInfo={ruleInfo}
            setruleInfo={setruleInfo}
            createRule={createRule}
            setruleDetailsInfo={setruleDetailsInfo}
            ruleDetailsInfo={ruleDetailsInfo}
            setCreateRule={setCreateRule}
            setrerender={setrerender}
            rerender={rerender}
          />
        }
    ]
     

    return (
        <Fragment>
          {
            (stepper?._currentIndex || 0) === 0 ?  <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allCampaigns' >
            <div className='d-flex align-items-center'>
                <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                <span >Back</span>
            </div>
        </Button.Ripple> :  <Button.Ripple color='primary' className='btn-prev mb-1' onClick={() => {
                setCreateRule(false)
                setrerender(false)
                stepper.previous()
            }}>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button.Ripple>
          }
           
          <Row>
              <Col sm='12'>
                  <div className='horizontal-wizard'>
                    <Wizard 
                      instance={el => setStepper(el)} 
                      ref={ref} 
                      steps={steps} 
                      options={{ linear: true }}
                    />
                  </div>
              </Col>
          </Row>
        </Fragment>
    )
}

export default SelectOrCreateRule