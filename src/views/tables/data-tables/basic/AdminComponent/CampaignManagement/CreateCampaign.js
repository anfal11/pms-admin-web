import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import jwtDefaultConfig from '../../../../../../@core/auth/jwt/jwtDefaultConfig'
import { BMS_PASS1, BMS_USER1 } from "../../../../../../Configurables"
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import CampaignLogic from './campaignLogic'
import RealTimeCommisionRuleLogic from '../RealTimeCommisionRule/RealTimeCommisionRuleLogic'
import {BeatLoader} from "react-spinners"   

const MySwal = withReactContent(Swal)


const CreateCampaignLogic = ({ setrerender, rerender, setruleDetailsInfo, ruleDetailsInfo, stepper, createRule, setCreateRule, type, ruleInfo, setruleInfo, ruleSelectType }) => {

    const history = useHistory()

    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [ruleDataLoading, setRuledataloading] = useState(false)

    const [cashbackFlexibleData, setCashbackFlexibleData] = useState([{ startRange: 0, isPercentage: false }])
    const [voucherFlexibleData, setVoucherFlexibleData] = useState([{ startRange: 0 }])
    const [datapackFlexibleData, setDatapackFlexibleData] = useState([{ startRange: 0 }])
    const [pointFlexibleData, setPointFlexibleData] = useState([{ startRange: 0 }])
    const [ruleInfobackup, setruleInfobackup] = useState({...ruleInfo})
    /**
     * anyservice = true then multiService = [1]
     * anysendergroup = true then sendergroup = 1
     * anyreceivergroup = true then receivergroup = 1
     * / startDate = startDate.replace(/T/, ' ')
    //     // endDate = endDate.replace(/T/, ' ')
     */

    const [userInput, setUserInput] = useState({
        campaignName: '',
        anyservice: false,
        multiService: [],

        receiver: 's',
        anysendergroup: false,
        sendergroup: 0,
        anyreceivergroup: false,
        receivergroup: 0,

        reward_priority:'s',

        commissionId: 0,

        startDate: "",
        endDate: "",

        isDynamicCamp: false,
        dynamicCampExpire: 0
    })

    // const [userInput, setUserInput] = useState({
    //     campaignName: 'test camp',
    //     anyservice: true,
    //     multiService:  ['133127', '369820'],

    //     receiver: 'b',
    //     anysendergroup: true,
    //     sendergroup: 101,
    //     anyreceivergroup: true,
    //     receivergroup: 101,

    //     reward_priority:'r',

    //     commissionId: 43,

    //     startDate: "2024-05-29T15:49",
    //     endDate: "2024-05-31T15:49",

    //     isDynamicCamp: true,
    //     dynamicCampExpire: 110
    // })

    const onSubmit = (e) => {
        e.preventDefault()

        /**
         * ruleSelectType = 1 => select from created rule ruleSelectType = 2 => create rule with campaign
         */
        const data = {
            ruleSelectType,
            onlineRuleInfo: ruleSelectType === 1 ? {} : ruleInfo,
            campaignName: userInput.campaignName,
            anyservice : userInput.anyservice,
            multiService: userInput.anyservice ? [1] : userInput.multiService,

            receiver: userInput.receiver,
            anysendergroup: userInput.anysendergroup,
            sendergroup: userInput.anysendergroup ? 1 : userInput.sendergroup,
            anyreceivergroup: userInput.anyreceivergroup,
            receivergroup: userInput.anyreceivergroup ? 1 : userInput.receivergroup,
    
            reward_priority: userInput.reward_priority,
    
            commissionId: ruleSelectType === 1 ? userInput.commissionId : 0,
    
            startDate: userInput.startDate,
            endDate: userInput.endDate,
    
            isDynamicCamp: userInput.isDynamicCamp,
            dynamicCampExpire: userInput.dynamicCampExpire
        }
        setPointRuleloading(true)
        useJwt2.onlineCampaignCreate(data).then(response => {

            setPointRuleloading(false)
            Success(response)
            history.push('/allCampaigns')

        }).catch(err => {
                Error(err)
                setPointRuleloading(false)
            })
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })    
    }, [rerender])

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Campaign Details</h5>
        <small className='text-muted'>Enter Your Campaign Details.</small>
      </div>
      <Form onSubmit={onSubmit} autoComplete="off">

        <CampaignLogic 
           userInput={userInput}
           setUserInput={setUserInput}
           ruleSelectType={ruleSelectType}
           onlyView={false}
           setruleInfobackup={setruleInfobackup}
           setRuledataloading={setRuledataloading}
           setruleDetailsInfo={setruleDetailsInfo}
           ruleDetailsInfo={ruleDetailsInfo}
        />
        {
            rerender ? <Fragment>
                { (ruleSelectType === 2 && createRule) || (userInput.commissionId && !ruleDataLoading) ? <Card style={{border: '2px solid #f2b9b9'}} className="RealTimeCommisionRuleLogicViewInCampaignPage">
                    <CardBody className="cardBody">
                        <CardHeader className="cardHeader" >
                            <CardTitle>
                                Online Rule Info
                            </CardTitle>
                        </CardHeader>
                        <RealTimeCommisionRuleLogic 
                            userInput={ruleSelectType === 2 && createRule ? ruleInfo : ruleDetailsInfo}
                            setUserInput={setruleInfobackup}
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
                </Card> :  null
                }
            </Fragment> : null
        }
        {
            ruleDataLoading && <BeatLoader color="#6610f2" size={10}/>
        }
        
        <div className='d-flex justify-content-between'>
          {/* <Button.Ripple color='primary' className='btn-prev' onClick={() => {
                setCreateRule(false)
                setrerender(false)
                stepper.previous()
            }}>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button.Ripple> */}
          <div></div>
          {
            pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled>
                <Spinner color='white' size='sm' />
                <span className='ml-50'>Loading...</span>
            </Button.Ripple> :  <Button.Ripple color='primary' className='btn-next' type="submit">
            <span className='align-middle d-sm-inline-block d-none'>Submit</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
          }
         
        </div>

      </Form>
    </Fragment>
  )
}

export default CreateCampaignLogic