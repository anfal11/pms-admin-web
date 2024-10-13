import useJwt2 from '@src/auth/jwt/useJwt2'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Minus, Plus, Info } from 'react-feather'
import Select from 'react-select'
import { UncontrolledPopover, PopoverHeader, PopoverBody, Button, Card, CardBody, InputGroup, InputGroupAddon, InputGroupText, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import {BeatLoader} from "react-spinners"   
import CommonDataTable from '../DataTable'
import './rStyle.css'

const conditionTypes = [
    { value: 1, label: 'On Transaction Count' }, 
    { value: 2, label: 'On Amount' }, 
    { value: 3, label: 'On Both' },
    { value: 4, label: 'Any Of Them' }
]

const rewardConditionTypes = [
    { value: 1, label: 'On Reward Count' }, 
    { value: 2, label: 'On Reward Amount' }, 
    { value: 3, label: 'On Both' },
    { value: 4, label: 'Any Of Them' }
]

const cumulativeConditionTypes = [
    { value: 1, label: 'On Transaction Count' }, 
    { value: 2, label: 'On Amount' }, 
    { value: 3, label: 'On Both' },
    { value: 7, label: 'On Both (Exact Amount)' },
    { value: 4, label: 'Any Of Them' },
    { value: 5, label: 'Per Transaction' },
    { value: 6, label: 'Top Transaction' }
]

const weekDaysName = [
    { value: 1, label: 'Monday' }, 
    { value: 2, label: 'Tuesday' }, 
    { value: 3, label: 'Wednesday' }, 
    { value: 4, label: 'Thursday' }, 
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }, 
    { value: 7, label: 'Sunday' }
]

const monthDays = [...Array(31)].map((_, i) => {
    return {value: i + 1, label: `${i + 1}`}
})

const RealTimeCommisionRuleLogic = ({
    setUserInput, 
    userInput,

    cashbackFlexibleData:tableData,
    setCashbackFlexibleData:setTableData,
    voucherFlexibleData:tableData1,
    setVoucherFlexibleData:setTableData1,

    datapackFlexibleData:tableData2,
    setDatapackFlexibleData:setTableData2,
    pointFlexibleData:tableData3,
    setPointFlexibleData:setTableData3,

    onlyView

}) => {

    const isFirstRender = useRef(true)

    const rewardTypeRef = useRef()
    const ref1 = useRef()
    const srRef = useRef()
    const rrRef = useRef()

    const recurringStartDateRef = useRef()
    const recurringEndDateRef = useRef()
    const recurringSpecificDateRef = useRef()


    // const [tableData, setTableData] = useState([{ startRange: 0, isPercentage: false }])
    // const [tableData1, setTableData1] = useState([{ startRange: 0 }])
    // const [tableData2, setTableData2] = useState([{ startRange: 0 }])
    // const [tableData3, setTableData3] = useState([{ startRange: 0 }])

    const [commissionRuleList, setcommissionRuleList] = useState([])
    const [isCommissionRuleListLoading, setCommissionRuleListLoading] = useState(true)
    const [error, setError] = useState(false)
    const [voucherList, setVoucherList] = useState([])
    const [isVoucherListLoading, setVoucherListLoading] = useState(true)
    const [datapackList, setDatapackList] = useState([])
    const [isDatapackLoading, setDatapackLoading] = useState(true)
    const [campaignRewardType, setcampaignRewardType] = useState([])
    const [campaignRewardTypeValueOption, setcampaignRewardTypeValueOption] = useState({})
    const [quotaConditionTypes, setquotaConditionTypes] = useState(rewardConditionTypes)
    const [campaignQuotaValue, setcampaignQuotaValue] = useState({})
    const [campaignReceiverQuotaValue, setcampaignReceiverQuotaValue] = useState({})

    const [needRefresh, setneedRefresh] = useState(0)

    const handleChange = (e) => {
        // console.log(e.target.value)
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleChange1 = (e, index) => {
        tableData[index] = { ...tableData[index], [e.target.name]: e.target.value }
        setTableData([...tableData])
    }
    const handleChange2 = (e, index) => {
        tableData1[index] = { ...tableData1[index], [e.target.name]: e.target.value }
        setTableData1([...tableData1])
    }
    const handleChange3 = (e, index) => {
        tableData2[index] = { ...tableData2[index], [e.target.name]: e.target.value }
        setTableData2([...tableData2])
    }
    const handleChange4 = (e, index) => {
        tableData3[index] = { ...tableData3[index], [e.target.name]: e.target.value }
        setTableData3([...tableData3])
    }

    const getVoucherList = () => {
        useJwt2.pmsVoucher().then(res => {
            setVoucherList(res.data.payload.map(i => { return {value: i.voucherid, label: i.title} }))
            setVoucherListLoading(false)
        }).catch(err => {
            setVoucherListLoading(false)
            Error(err)
        })
    }

    const getDatapack = () => {
        useJwt2.datapackGroupList().then(res => {
            setDatapackList(res.data.payload.map(i => { return {value: i.id, label: i.group_title} }))
            setDatapackLoading(false)
        }).catch(err => {
            setDatapackLoading(false)
            Error(err)
        })
    }

    const getCampaignRule = () => {
        // campaignListDropdown
        useJwt2.commissionListDropdown().then(res => {
            setcommissionRuleList(res.data.payload.map(i => { return {value: i.commission_id, label: i.commission_rule_name} }))
            setCommissionRuleListLoading(false)
        }).catch(err => {
            setCommissionRuleListLoading(false)
            Error(err)
        })
    }

    const resetQuotaSelectedValues = () => {
        setcampaignQuotaValue(rewardConditionTypes[0])
        setcampaignReceiverQuotaValue(rewardConditionTypes[0])
        setUserInput({...userInput, quotaType: 1, rxQuotaType: 1})
    }
    const recurringTypeOnChange = (selected) => {
        let staticTimeline = null, startTimeline = null, endTimeline = null
        if (selected.value === 'm') {
           if (!userInput.isTimelineRange) {
            staticTimeline = 1
            startTimeline = null
            endTimeline = null
           } else {
            staticTimeline = null
            startTimeline = null
            endTimeline = null
           }
            
        } else {

            staticTimeline = null
            startTimeline = null
            endTimeline = null
        }

        setUserInput({ 
            ...userInput, 
            timelineType: selected.value,
            staticTimeline,
            startTimeline,
            endTimeline
        })
    }

    // rewardlist....
    useEffect(() => {
        const rewardTypeid = userInput.reward_type
        if (isFirstRender.current) {
            // Skip the effect on the initial render
            isFirstRender.current = false
            switch (rewardTypeid) {
                // Voucher...
                case 1 :
                    getVoucherList()
                    break
    
                // Data-pack....
                case 2 :
                    getDatapack()
                    break
            }
            return
        }
        switch (rewardTypeid) {
            // Voucher...
            case 1 :
                if (!voucherList.length) {
                    getVoucherList()
                }
                setquotaConditionTypes([rewardConditionTypes[0]])
                resetQuotaSelectedValues()
                break

            // Data-pack....
            case 2 :
                if (!datapackList.length) {
                    getDatapack()
                }
                setquotaConditionTypes([rewardConditionTypes[0]])
                resetQuotaSelectedValues()
                break

            // Point....
            case 3 :
                setquotaConditionTypes(rewardConditionTypes)
                resetQuotaSelectedValues()
                break

            // cash-back..
            case 4 : 
                setquotaConditionTypes(rewardConditionTypes)
                resetQuotaSelectedValues()
                break

            // There have no other option..
            default : 
                setquotaConditionTypes(rewardConditionTypes)
                resetQuotaSelectedValues()
        }
    }, [userInput.reward_type])

    useEffect(() => {
        useJwt2.campaignRewardType().then(res => {
            const data = res.data.payload.map(item => {
                return { value: item['reward_id'], label:item['reward_type_name']}
            })
            setcampaignRewardType(data)
            if (data.length) {
                if (userInput.reward_type > 0) {
                    const rewardTypeObj = data.find(({ value }) => value === userInput.reward_type)
                    if (rewardTypeObj) {
                        setcampaignRewardTypeValueOption(rewardTypeObj)
                    } else {
                        setUserInput({ ...userInput, reward_type: 0})
                    }
                } else {
                    const rewardTypeFirstValue = data[0].value 
                    setUserInput({ ...userInput, reward_type: rewardTypeFirstValue})
                    setcampaignRewardTypeValueOption(data[0])
                }
            }

          }).catch(err => {
            Error(err)
        })

        // Set some default values...
        if (userInput.quotaType > 0) {
            setcampaignQuotaValue(rewardConditionTypes.find(({ value }) => value === userInput.quotaType))
        } else {
            setcampaignQuotaValue(rewardConditionTypes[0])
        }
        // setcampaignReceiverQuotaValue
        if (userInput.rxQuotaType > 0) {
            setcampaignReceiverQuotaValue(rewardConditionTypes.find(({ value }) => value === userInput.rxQuotaType))
        } else {
            setcampaignQuotaValue(rewardConditionTypes[0])
        }

        //reward type => 1=voucher,2=datapck,3=point,4=cashback
        if (userInput.commissionType === 'flexible') {
            switch (userInput.reward_type) {
                case 1 :
                    setTableData1(userInput.flexibleRules)
                    break
    
                case 2 :
                    setTableData2(userInput.flexibleRules)
                    break
    
                case 3 :
                    setTableData3(userInput.flexibleRules)
                    break
    
                case 4 :
                    setTableData(userInput.flexibleRules)
                    break
            }
        }

        setneedRefresh(needRefresh + 1)
    }, [])

    useEffect(() => {
        if (!commissionRuleList.length && (userInput.isCertainTimeline || userInput.isTime)) {
            getCampaignRule()
        }
    }, [userInput.isCertainTimeline, userInput.isTime])

    // Cash-back
    const column = useMemo(() => [
        {
            name: 'Reward Condition',
            minWidth: '150px',
            cell: (Row, index) => {
                return <Select ClassName='wid-100'
                    theme={selectThemeColors}
                    maxMenuHeight={200}
                    className='react-select'
                    classNamePrefix='select'
                    value={{ value: tableData[index]?.isPercentage, label: tableData[index]?.isPercentage ? 'Percentage' : tableData[index]?.isPercentage === undefined ? 'select' : 'Flat' }}
                    onChange={(selected) => {
                        if (selected.value) {
                            tableData[index] = { ...tableData[index], isPercentage: selected.value }
                            setTableData([...tableData])
                        } else {
                            tableData[index] = { ...tableData[index], isPercentage: selected.value, min: 0.00, max: 0.00 }
                            setTableData([...tableData])
                        }

                    }}
                    isDisabled={onlyView}
                    options={[{ value: true, label: 'Percentage' }, { value: false, label: 'Flat' }]}
                />
            }
        },
        {
            name: 'Sender Reward',
            minWidth: '130px',
            cell: (Row, index) => {
                return <div>
                    <InputGroup>
                    <Input type="number"
                        name="snAmount"
                        id={`${index}snAmount`}
                        value={tableData[index].snAmount}
                        onChange={e => {
                            handleChange1(e, index)
                        }}
                        required
                        style={(error && !tableData[index].snAmount) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder='0'
                        onWheel={(e) => e.target.blur()}
                        step={0.01}
                        min={0.01}
                        disabled={onlyView}

                    /> 
                    {
                        tableData[index]?.isPercentage &&   <InputGroupAddon addonType="append" >
                        <InputGroupText style={{padding: 1}}>%</InputGroupText>
                      </InputGroupAddon>
                    }
                      
                    </InputGroup>
                    {(error && !tableData[index].snAmount) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Sender Amount is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '130px',
            cell: (Row, index) => {
                return <div>
                     <InputGroup>
                    <Input type="number"
                        name="rxAmount"
                        id={`${index}rxAmount`}
                        value={tableData[index].rxAmount}
                        onChange={e => {
                            handleChange1(e, index)
                        }}
                        required
                        style={(error && !tableData[index].rxAmount) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder='0'
                        onWheel={(e) => e.target.blur()}
                        step={0.01}
                        min={0.01}
                        disabled={onlyView}
                    />
                     {
                        tableData[index]?.isPercentage &&   <InputGroupAddon addonType="append" >
                        <InputGroupText style={{padding: 1}}>%</InputGroupText>
                      </InputGroupAddon>
                    }
                    </InputGroup>
                    {(error && !tableData[index].rxAmount) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Receiver Amount is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Start Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="startRange"
                        id={`${index}startRange`}
                        value={tableData[index].startRange}
                        onChange={e => handleChange1(e, index)}
                        required
                        style={(error && !tableData[index].startRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={index === 0 ? 1 : (+tableData[index - 1].endRange + 0.01)}
                        step={0.01}
                        disabled={onlyView}

                    />
                    {(error && !tableData[index].startRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Start Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'End Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="endRange"
                        id={`${index}endRange`}
                        value={tableData[index].endRange}
                        onChange={e => handleChange1(e, index)}
                        required
                        style={(error && !tableData[index].endRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={index === 0 ? 1 : tableData[index].startRange}
                        step={0.01}
                        disabled={onlyView}

                    />
                    {(error && !tableData[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Minimum Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="min"
                        id={`${index}min`}
                        value={tableData[index].min}
                        onChange={e => handleChange1(e, index)}
                        required
                        style={(error && tableData[index].isPercentage && !tableData[index].min) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        disabled={onlyView ? onlyView : !tableData[index].isPercentage}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        step={0.01}
                        min={0.01}
                    />
                    {(error && tableData[index].isPercentage && !tableData[index].min) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-26px' }}>Min commision Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Maximum Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="max"
                        id={`${index}max`}
                        value={tableData[index].max}
                        onChange={e => handleChange1(e, index)}
                        required
                        style={(error && tableData[index].isPercentage && !tableData[index].max) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        disabled={onlyView ? onlyView : !tableData[index].isPercentage}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={tableData[index].min || 0.01}
                        step={0.01}
                    />
                    {(error && tableData[index].isPercentage && !tableData[index].max) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-26px' }}>Max commision Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',

            cell: (row, index) => {
                return !onlyView && <Fragment>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (tableData[index].snAmount && tableData[index].rxAmount && tableData[index].startRange && tableData[index].endRange && ((!tableData[index].isPercentage && (!tableData[index].min && !tableData[index].max)) || (tableData[index].isPercentage && (tableData[index].min && tableData[index].max)))) {
                                    setTableData([...tableData, { startRange: parseFloat(tableData[index].endRange) + 0.01, isPercentage: false }])
                                    setError(false)
                                } else { setError(true) }
                            }}
                        />
                    </span>
                    {index !== 0 && <span title="remove">
                        <Minus size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                tableData.splice(index, 1)
                                setTableData([...tableData])
                                setError(false)
                            }}
                        />
                    </span>}
                </Fragment>
            }
        }
    ], [tableData.length, userInput.commissionType, error, needRefresh])
    // Voucher..
    const column1 = useMemo(() => [
        {
            name: 'Sender Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                console.log('jjjjjjj000000')
                return <div style={{width:'100%', padding:'10px 0 0 0'}}>
                    <Select
                            name="country"
                            title="Country"

                            theme={selectThemeColors}
                            className='react-select wid-100'
                            classNamePrefix='select'
                            value={ voucherList.find(i => i.value === tableData1[index]?.snreward_voucherid) }
                            onChange={(e) => {
                                tableData1[index] = { ...tableData1[index], snreward_voucherid: e.value }
                                setTableData1([...tableData1])
                            }}
                            style={(error && !tableData1[index].snreward_voucherid) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                            options={voucherList}
                            menuPlacement={index > 3 ? "top" : "bottom"}
                            captureMenuScroll={true}
                            closeMenuOnSelect={true}
                            closeMenuOnScroll={true}
                            hideSelectedOptions={true}
                            defaultValue={
                                tableData1.length >= (index + 1) ? voucherList.find(({ value }) => (+value) === (+tableData1[index]['snreward_voucherid'])) : null
                            }
                            isDisabled={onlyView}
                         />
                         <Input
                            required
                            disabled={onlyView}
                            style={{
                                opacity: 0,
                                width: "100",
                                height: 0
                                // position: "absolute"
                            }}
                            value={tableData1[index]?.snreward_voucherid || ''}
                            onChange={e => ''}
                        />
                        {(error && !tableData1[index].snreward_voucherid) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Sender Reward is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div style={{width:'100%', padding:'10px 0 0 0'}}>
                <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        ClassName='wid-100'
                        classNamePrefix='select'
                        value={ voucherList.find(i => i.value === tableData1[index]?.rxreward_voucherid) }
                        onChange={(e) => {
                            tableData1[index] = { ...tableData1[index], rxreward_voucherid: e.value }
                            setTableData1([...tableData1])
                        }}
                        style={(error && !tableData1[index].rxreward_voucherid) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        options={voucherList}
                        menuPlacement={index > 3 ? "top" : "bottom"}
                        captureMenuScroll={true}
                        closeMenuOnSelect={true}
                        closeMenuOnScroll={true}
                        hideSelectedOptions={true}
                        defaultValue={
                            tableData1.length >= (index + 1) ? voucherList.find(({ value }) => (+value) === (+tableData1[index]['rxreward_voucherid'])) : null
                        }
                        isDisabled={onlyView}
                    />
                    <Input
                       required
                       disabled={onlyView}
                       style={{
                           opacity: 0,
                           width: "100",
                           height: 0
                       }}
                       value={tableData1[index]?.rxreward_voucherid || ''}
                       onChange={e => ''}
                   />
                    {(error && !tableData1[index].rxreward_voucherid) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Receiver Reward is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Start Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="startRange"
                        id={`${index}startRange`}
                        value={tableData1[index].startRange}
                        onChange={e => handleChange2(e, index)}
                        required
                        style={(error && !tableData1[index].startRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={index === 0 ? 1 : (+tableData1[index - 1].endRange + 0.01)}
                        step={0.01}
                        disabled={onlyView}
                    />
                    {(error && !tableData1[index].startRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Start Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'End Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="endRange"
                        id={`${index}endRange`}
                        value={tableData1[index].endRange}
                        onChange={e => handleChange2(e, index)}
                        required
                        style={(error && !tableData1[index].endRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={index === 0 ? 1 : tableData1[index].startRange}
                        step={0.01}
                        disabled={onlyView}

                    />
                    {(error && !tableData1[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',

            cell: (row, index) => {
                return !onlyView && <>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (tableData1[index].startRange && tableData1[index].endRange && tableData1[index].snreward_voucherid && tableData1[index].rxreward_voucherid) {
                                    setTableData1([...tableData1, { startRange: parseFloat(tableData1[index].endRange) + 0.01 }])
                                    setError(false)
                                } else { setError(true) }
                            }}
                        />
                    </span>
                    {index !== 0 && <span title="remove">
                        <Minus size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                tableData1.splice(index, 1)
                                setTableData1([...tableData1])
                                setError(false)
                            }}
                        />
                    </span>}
                </>
            }
        }
    ], [tableData1.length, userInput.commissionType, error, isVoucherListLoading, needRefresh])
    //  data-pack...
    const column2 = useMemo(() => [
        {
            name: 'Sender Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div style={{width:'100%', padding:'10px 0 0 0'}}>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={150}
                        ClassName='wid-100 react-select'
                        classNamePrefix='select'
                        onChange={(e) => {
                            tableData2[index] = { ...tableData2[index], snreward_datapack_groupid: e.value }
                            setTableData2([...tableData2])
                        }}
                        style={(error && !tableData2[index].snreward_datapack_groupid) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        options={datapackList}
                        menuPlacement={index > 3 ? "top" : "bottom"}
                        captureMenuScroll={true}
                        closeMenuOnSelect={true}
                        closeMenuOnScroll={true}
                        hideSelectedOptions={true}
                        defaultValue={
                            tableData2.length >= (index + 1) ? datapackList.find(({ value }) => (+value) === (+tableData2[index]['snreward_datapack_groupid'])) : null
                        }
                        isDisabled={onlyView}
                    />
                    <Input
                       required
                       disabled={onlyView}
                       style={{
                           opacity: 0,
                           width: "100",
                           height: 0
                       }}
                       value={tableData2[index]?.snreward_datapack_groupid || ''}
                       onChange={e => ''}
                   />
                    
                    {(error && !tableData2[index].snreward_datapack_groupid) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Sender Reward is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div style={{width:'100%', padding:'10px 0 0 0'}}>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='wid-100 react-select'
                        classNamePrefix='select'
                        onChange={(e) => {
                            tableData2[index] = { ...tableData2[index], rxreward_datapack_groupid: e.value }
                            setTableData2([...tableData2])
                        }}
                        style={(error && !tableData2[index].rxreward_datapack_groupid) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        options={datapackList}
                        menuPlacement={index > 3 ? "top" : "bottom"}
                        captureMenuScroll={true}
                        closeMenuOnSelect={true}
                        closeMenuOnScroll={true}
                        hideSelectedOptions={true}
                        defaultValue={
                            tableData2.length >= (index + 1) ? datapackList.find(({ value }) => (+value) === (+tableData2[index]['rxreward_datapack_groupid'])) : null
                        }
                        isDisabled={onlyView}

                    />
                    <Input
                       required
                       disabled={onlyView}
                       style={{
                           opacity: 0,
                           width: "100",
                           height: 0
                       }}
                       value={tableData2[index]?.rxreward_datapack_groupid || ''}
                       onChange={e => ''}
                   />
                    {(error && !tableData2[index].rxreward_datapack_groupid) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Receiver Reward is Required!!!</h6>}
                    </div>
            }
        },
        {
            name: 'Start Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="startRange"
                        id={`${index}startRange`}
                        value={tableData2[index].startRange}
                        onChange={e => handleChange3(e, index)}
                        required
                        style={(error && !tableData2[index].startRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        step={0.01}
                        min={index === 0 ? 1 : (+tableData2[index - 1].endRange + 0.01)}
                        disabled={onlyView}

                    />
                    {(error && !tableData2[index].startRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Start Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'End Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="endRange"
                        id={`${index}endRange`}
                        value={tableData2[index].endRange}
                        onChange={e => handleChange3(e, index)}
                        required
                        style={(error && !tableData2[index].endRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        step={0.01}
                        min={index === 0 ? 1 : tableData2[index].startRange}
                        disabled={onlyView}
                    />
                    {(error && !tableData2[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',

            cell: (row, index) => {
                return !onlyView && <>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (tableData2[index].startRange && tableData2[index].endRange && tableData2[index].snreward_datapack_groupid && tableData2[index].rxreward_datapack_groupid) {
                                    setTableData2([...tableData2, { startRange: parseFloat(tableData2[index].endRange) + 0.01 }])
                                    setError(false)
                                } else { setError(true) }
                            }}
                        />
                    </span>
                    {index !== 0 && <span title="remove">
                        <Minus size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                tableData2.splice(index, 1)
                                setTableData2([...tableData2])
                                setError(false)
                            }}
                        />
                    </span>}
                </>
            }
        }
    ], [tableData2.length, userInput.commissionType, error, isDatapackLoading, needRefresh])
    // point..
    const column3 = useMemo(() => [
        {
            name: 'Sender Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="snAmount"
                        id={`${index}snAmount`}
                        value={tableData3[index].snAmount}
                        onChange={e => {
                            handleChange4(e, index)
                        }}
                        required
                        style={(error && !tableData3[index].snAmount) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder='0'
                        onWheel={(e) => e.target.blur()}
                        step={1}
                        min={1}
                        disabled={onlyView}
                    />
                    {(error && !tableData3[index].snAmount) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Sender Amount is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="rxAmount"
                        id={`${index}rxAmount`}
                        value={tableData3[index].rxAmount}
                        onChange={e => {
                            handleChange4(e, index)
                        }}
                        required
                        style={(error && !tableData3[index].rxAmount) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder='0'
                        onWheel={(e) => e.target.blur()}
                        step={1}
                        min={1}
                        disabled={onlyView}

                    />
                    {(error && !tableData3[index].rxAmount) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Receiver Amount is Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Start Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="startRange"
                        id={`${index}startRange`}
                        value={tableData3[index].startRange}
                        onChange={e => handleChange4(e, index)}
                        required
                        style={(error && !tableData3[index].startRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={index === 0 ? 1 : (+tableData3[index - 1].endRange + 0.01)}
                        step={0.01}
                        disabled={onlyView}

                    />
                    {(error && !tableData3[index].startRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Start Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'End Range',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
                    <Input type="number"
                        name="endRange"
                        id={`${index}endRange`}
                        value={tableData3[index].endRange}
                        onChange={e => handleChange4(e, index)}
                        required
                        style={(error && !tableData3[index].endRange) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        min={index === 0 ? 1 : tableData3[index].startRange}
                        step={0.01}
                        disabled={onlyView}

                    />
                    {(error && !tableData3[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            cell: (row, index) => {
                return !onlyView && <>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (
                                    tableData3[index].snAmount && 
                                    tableData3[index].rxAmount && 
                                    tableData3[index].startRange && 
                                    tableData3[index].endRange
                                    
                            ) {
                                    setTableData3([
                                        ...tableData3, 
                                        { 
                                            startRange: parseFloat(tableData3[index].endRange) + 0.01, 
                                            isPercentage: false 
                                        }
                                    ])
                                    setError(false)
                                } else { setError(true) }
                            }}
                        />
                    </span>
                    {index !== 0 && <span title="remove">
                        <Minus size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                tableData3.splice(index, 1)
                                setTableData3([...tableData3])
                                setError(false)
                            }}
                        />
                    </span>}
                </>
            }
        }
    ], [tableData3.length, userInput.commissionType, error, needRefresh])

    return (
        <Fragment> 
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="commissionRuleName">Campaign Rule Name<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="textarea"
                                        name="commissionRuleName"
                                        id='commissionRuleName'
                                        rows='2'
                                        value={userInput.commissionRuleName}
                                        onChange={handleChange}
                                        required
                                        maxLength="100"
                                        placeholder="rule name here..."
                                        disabled={onlyView}
                                    />
                                    <p className='text-right' style={userInput.commissionRuleName.length === 100 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{100 - userInput.commissionRuleName.length} characters remaining</p>
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <Row>
                                    <Col sm="12" > 
                                        <FormGroup>
                                        <Label for="campaign-reward-type">Campaign Reward Type <Info size={14} id='CampaignRewardType'/></Label>
                                        <UncontrolledPopover trigger='hover' placement='top' target='CampaignRewardType'>
                                           <PopoverHeader>Details</PopoverHeader>
                                            <PopoverBody> Campaign reward type allows you to choose the type of reward for the designed campaign. The reward can be a data pack, loyalty points, cashback, or a subscription voucher. </PopoverBody>
                                        </UncontrolledPopover>
                                        <Select
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={campaignRewardTypeValueOption}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, reward_type: selected.value })
                                                setcampaignRewardTypeValueOption(selected)
                                            }}
                                            options={campaignRewardType}
                                            ref={rewardTypeRef}
                                            isDisabled={onlyView}
                                        />
                                         <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => rewardTypeRef.current.select.focus()}
                                            value={userInput.reward_type || ''}
                                            onChange={e => ''} />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                {
                                    userInput.reward_type === 3 && <Row>
                                    <Col sm="12"  className='fade-in'> 
                                        <FormGroup>
                                            <Label for="pointExpireDays">Point Expire Days<span style={{ color: 'red' }}>*</span>  <Info size={14} id='pointexpirydays'/></Label>
                                        <UncontrolledPopover trigger='hover' placement='top' target='pointexpirydays'>
                                           <PopoverHeader>Details</PopoverHeader>
                                            <PopoverBody> Points earned during the campaign will expire after a specified period. </PopoverBody>
                                        </UncontrolledPopover>
                                            <Input type="number"
                                                min='1'
                                                name="pointExpireDays"
                                                id='pointExpireDays'
                                                value={userInput.pointExpireDays}
                                                onChange={handleChange}
                                                required
                                                placeholder="0"
                                                onWheel={(e) => e.target.blur()}
                                                disabled={onlyView}

                                            />
                                        </FormGroup>
                                    </Col>
                                  </Row>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Fragment>
                    <Row>
                        <Col sm='6'>
                                <Card>
                                    <CardHeader>
                                        <span>Add Transaction Reachable Target?
                                          &nbsp; <Info size={14} id='transactionreachabletarget'/>
                                        </span>
                                        <UncontrolledPopover trigger='hover' placement='top' target='transactionreachabletarget'>
                                           <PopoverHeader>Details</PopoverHeader>
                                            <PopoverBody> Set the campaign target based on the total transaction amount or count. The campaign will deactivate when the targeted transaction is reached. </PopoverBody>
                                        </UncontrolledPopover>

                                        <CustomInput
                                            type='switch'
                                            id='isFinBasedOffer'
                                            name='isFinBasedOffer'
                                            checked={userInput.isFinBasedOffer}
                                            disabled={onlyView}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setUserInput({ ...userInput, isFinBasedOffer: true, offer_type: conditionTypes[0].value })
                                                } else {
                                                    setUserInput({ ...userInput, isFinBasedOffer: false, offerCount: 0, offerAmount: 0 })
                                                }
                                             }
                                            }
                                        />
                                    </CardHeader>
                                    {
                                        userInput.isFinBasedOffer &&  <CardBody>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup className='fade-in'>
                                                    <Label for="tragetTransactionType">Type</Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        defaultValue={
                                                            userInput.offer_type > 0 ? conditionTypes.find(({ value }) => value === userInput.offer_type) : conditionTypes[0]
                                                        }
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, offer_type: selected.value })
                                                        }}
                                                        options={conditionTypes}
                                                        isDisabled={onlyView}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.offer_type !== 2 && <Col md="6" className={userInput.offer_type === 3 || userInput.offer_type === 4 ? 'fade-in mt-1' : 'fade-in'}>
                                                        <FormGroup>
                                                            <Label for="offerCount">Define Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="offerCount"
                                                                id='offerCount'
                                                                value={userInput.offerCount}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                                onWheel={(e) => e.target.blur()}
                                                                min={1}
                                                                disabled={onlyView}

                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.offer_type !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="offerAmount">Define Minimum Total Transaction Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="offerAmount"
                                                                    id='offerAmount'
                                                                    value={userInput.offerAmount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
                                                                    onWheel={(e) => e.target.blur()}
                                                                    min={0.01}
                                                                    step={0.01}
                                                                    disabled={onlyView}

                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    }
                                                </Row>
                                           </Col>
                                        </Row>
                                    </CardBody>
                                    }
                                   
                                </Card>
                        </Col>

                        <Col sm='6'>
                                <Card>
                                    <CardHeader>
                                        
                                        <span> Set Cumulative Target?
                                            &nbsp; <Info size={14} id='cumulativetarget'/>
                                        </span>
                                        <UncontrolledPopover trigger='hover' placement='top' target='cumulativetarget'>
                                            <PopoverHeader>Details</PopoverHeader>
                                            <PopoverBody> To set the campaign conditions i.e. minimum amount or exact amount or count or hybrif in cumulative manner. </PopoverBody>
                                        </UncontrolledPopover>
                                        <CustomInput
                                            type='switch'
                                            id='cumulative-target'
                                            name='cumulative-target'
                                            checked={userInput.target}
                                            disabled={onlyView}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setUserInput({ ...userInput, target: true, target_type: conditionTypes[0].value })
                                                } else {
                                                    setUserInput({ ...userInput, target: false})
                                                }
                                            }
                                            }
                                        />
                                    </CardHeader>
                                    {
                                        userInput.target &&  <CardBody>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup className='fade-in'>
                                                    <Label for="comulativetragetTransactionType">Type</Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        defaultValue={
                                                            userInput.target_type > 0 ? cumulativeConditionTypes.find(({ value }) => value === userInput.target_type) : cumulativeConditionTypes[0]
                                                        }
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, target_type: selected.value })
                                                        }}
                                                        options={cumulativeConditionTypes}
                                                        isDisabled={onlyView}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.target_type !== 2 && <Col md="6" className={userInput.target_type === 5 ? "fade-in" : "fade-in mt-1"}>
                                                        <FormGroup>
                                                            <Label for="terget_typeCount">Define {userInput.target_type === 6 ? "Top" : null} Number Of Transactions<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="target_count"
                                                                id='terget_typeCount'
                                                                value={userInput.target_count}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                                onWheel={(e) => e.target.blur()}
                                                                min={1}
                                                                disabled={onlyView}
                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.target_type !== 1 && <Col md="6" className="fade-in">
                                                            <FormGroup>
                                                                <Label for="target_amount">Define {userInput.target_type === 5 ? "Per" : userInput.target_type === 7 ? "Exact Total" : "Minimum Total"} Transaction Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="target_amount"
                                                                    id='target_amount'
                                                                    value={userInput.target_amount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
                                                                    onWheel={(e) => e.target.blur()}
                                                                    min={0.01}
                                                                    step={0.01}
                                                                    disabled={onlyView}

                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    }
                                                </Row>
                                           </Col>
                                        </Row>
                                    </CardBody>
                                    }
                                   
                                </Card>
                        </Col>
                    </Row>
                </Fragment>

                <Fragment>
                    <Row>
                        <Col sm='6'>
                                <Card>
                                    <CardHeader>
                                
                                         <span>Set Campaign Reward Quota?
                                          &nbsp; <Info size={14} id='campaignrewardquota'/>
                                        </span>
                                        <UncontrolledPopover trigger='hover' placement='top' target='campaignrewardquota'>
                                           <PopoverHeader>Details</PopoverHeader>
                                            <PopoverBody> You can set the number of rewards or the total reward amount (if it's cashback or points) for a specific campaign. When the reward limit is exceeded, the campaign will be deactivated. It's a kind of campaign budget. </PopoverBody>
                                        </UncontrolledPopover>
                                         <CustomInput
                                            type='switch'
                                            id='isQuota'
                                            name='isQuota'
                                            disabled={onlyView}
                                            checked={userInput.isQuota}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setUserInput({ ...userInput, isQuota: true, quotaType: quotaConditionTypes[0].value })
                                                } else {
                                                    setUserInput({ ...userInput, isQuota: false, quotaCount: 0, quotaAmount: 0 })
                                                }
                                            }
                                            }
                                        />
                                    </CardHeader>
                                    {
                                        userInput.isQuota &&  <CardBody>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup className='fade-in'>
                                                    <Label for="tragetTransactionType">Type</Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        // defaultValue={
                                                        //     userInput.quotaType > 0 ? quotaConditionTypes.find(({ value }) => value === userInput.quotaType) : quotaConditionTypes[0]
                                                        // }
                                                        value={campaignQuotaValue}
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, quotaType: selected.value })
                                                            setcampaignQuotaValue(selected)
                                                        }}
                                                        options={quotaConditionTypes}
                                                        isDisabled={onlyView}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.quotaType !== 2 && <Col md="6" className='fade-in'>
                                                        <FormGroup>
                                                            <Label for="quotaCount">Define Number Of Reward<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="quotaCount"
                                                                id='quotaCount'
                                                                value={userInput.quotaCount}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                                onWheel={(e) => e.target.blur()}
                                                                min={1}
                                                                disabled={onlyView}

                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.quotaType !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="quotaAmount">Define Reward Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="quotaAmount"
                                                                    id='quotaAmount'
                                                                    value={userInput.quotaAmount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
                                                                    onWheel={(e) => e.target.blur()}
                                                                    min={userInput.reward_type === 3 ? 1 : 0.01}
                                                                    step={0.01}
                                                                    disabled={onlyView}

                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    }
                                                </Row>
                                           </Col>
                                        </Row>
                                    </CardBody>
                                    }
                                   
                                </Card>
                        </Col>

                        <Col sm='6'>
                                <Card>
                                    <CardHeader>
                                        
                                        <span>Set Receiver Reward Quota?
                                          &nbsp; <Info size={14} id='campaignreceiverrewardquota'/>
                                        </span>
                                        <UncontrolledPopover trigger='hover' placement='top' target='campaignreceiverrewardquota'>
                                           <PopoverHeader>Details</PopoverHeader>
                                            <PopoverBody> Receiver's quota means the no. of times or amount an eligible individulas will get reward under specific campaign. </PopoverBody>
                                        </UncontrolledPopover>
                                        <CustomInput
                                            type='switch'
                                            id='isRxQuota'
                                            name='isRxQuota'
                                            checked={userInput.isRxQuota}
                                            disabled={onlyView}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setUserInput({ ...userInput, isRxQuota: true })
                                                } else {
                                                    setUserInput({ ...userInput, isRxQuota: false, rxQuotaCount: 0, rxQuotaAmount: 0 })
                                                }
                                            }
                                            }
                                        />
                                    </CardHeader>
                                    {
                                        userInput.isRxQuota &&  <CardBody>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup className='fade-in'>
                                                    <Label for="comulativetragetTransactionType">Type</Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        // defaultValue={quotaConditionTypes[0]}
                                                        value={campaignReceiverQuotaValue}
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, rxQuotaType: selected.value })
                                                            setcampaignReceiverQuotaValue(selected)
                                                        }}
                                                        options={quotaConditionTypes}
                                                        isDisabled={onlyView}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.rxQuotaType !== 2 && <Col md="6" className='fade-in'>
                                                        <FormGroup>
                                                            <Label for="rxQuotaCount">Define Number Of Reward<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="rxQuotaCount"
                                                                id='rxQuotaCount'
                                                                value={userInput.rxQuotaCount}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                                onWheel={(e) => e.target.blur()}
                                                                min={1}
                                                                disabled={onlyView}

                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.rxQuotaType !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="rxQuotaAmount">Define Reward Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="rxQuotaAmount"
                                                                    id='rxQuotaAmount'
                                                                    value={userInput.rxQuotaAmount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
                                                                    onWheel={(e) => e.target.blur()}
                                                                    min={userInput.reward_type === 3 ? 1 : 0.01}
                                                                    step={0.01}

                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    }
                                                </Row>
                                           </Col>
                                        </Row>
                                    </CardBody>
                                    }
                                   
                                </Card>
                        </Col>
                    </Row>
                </Fragment>
                
                <Fragment>
                    <Row>
                        <Col sm='6'>
                        <Card>
                            <CardHeader>
                                
                                <span>Set Recurring Timeline?
                                    &nbsp; <Info size={14} id='recurringtimeline'/>
                                </span>
                                <UncontrolledPopover trigger='hover' placement='top' target='recurringtimeline'>
                                    <PopoverHeader>Details</PopoverHeader>
                                    <PopoverBody> You can set the campaign to be active within specific timeframe i.e. weekly, monthly, daily manner. </PopoverBody>
                                </UncontrolledPopover>
                                <CustomInput
                                    type='switch'
                                    id='isCertainTimeline'
                                    name='isCertainTimeline'
                                    checked={userInput.isCertainTimeline}
                                    disabled={onlyView}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ 
                                                ...userInput, 
                                                timelineType:'m', 
                                                staticTimeline:1,
                                                isCertainTimeline: true, 
                                                isTimelineRange: false,
                                                outsideHourCommissionId: 0, 
                                                returnCertainTimelineId: 0
                                            })
                                        } else {
                                            setUserInput({ 
                                                ...userInput, 
                                                returnCertainTimelineId: 0, 
                                                isCertainTimeline: false, 
                                                timelineType: ' ', 
                                                isTimelineRange: false,
                                                staticTimeline: 0, 
                                                startTimeline: 0, 
                                                endTimeline: 0,  
                                                outsideHourCommissionId: 0
                                            })
                                        }
                                    }
                                    }
                                />
                            </CardHeader>
                            <CardBody>
                                {
                                    userInput.isCertainTimeline && <>
                                        <FormGroup>
                                            <Label for="Businesses">Select Off-hour Rule</Label>
                                            { !isCommissionRuleListLoading ? <Select
                                                ref={ref1}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={
                                                    userInput.returnCertainTimelineId > 0 ? commissionRuleList.find(({ value }) => (+value) === (+userInput.returnCertainTimelineId)) : null
                                                }
                                                onChange={(selected) => {
                                                    setUserInput({ 
                                                        ...userInput, 
                                                        returnCertainTimelineId: selected ? selected.value : 0 
                                                    })
                                                }}
                                                options={commissionRuleList}
                                                isClearable
                                                isDisabled={onlyView}
                                              /> : <BeatLoader color="#6610f2" size={10}/>
                                            }
                                        </FormGroup>
    
                                        <FormGroup className='fade-in'>
                                            <Label for="Businesses">Recurring Type<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                defaultValue={
                                                    userInput.timelineType === 'w' ? { value: 'w', label: 'Weekly' } : (userInput.timelineType === 'm' ? { value: 'm', label: 'Monthly' } : null)
                                                }
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={(selected) => recurringTypeOnChange(selected)}
                                                options={[
                                                    { value: 'w', label: 'Weekly' }, 
                                                    { value: 'm', label: 'Monthly' }
                                                ]}
                                                isDisabled={onlyView}
                                            />
                                        </FormGroup>
                                    </>
                                }
                                {
                                    userInput.timelineType === 'w' && userInput.isCertainTimeline && <Fragment>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' name='day' id='day' checked={!userInput.isTimelineRange}
                                                    onChange={() => {
                                                        setUserInput({ ...userInput, isTimelineRange: false })
                                                    }}
                                                    disabled={onlyView}
                                                /> Specific Day
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' name='range' id='range' checked={userInput.isTimelineRange}
                                                    onChange={() => {
                                                        setUserInput({ ...userInput, isTimelineRange: true })
                                                    }}
                                                    disabled={onlyView}
                                                /> Day Range
                                            </Label>
                                        </FormGroup>
                                    </Fragment>
                                }
                                {
                                    userInput.timelineType === 'm' && userInput.isCertainTimeline && <Fragment>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' name='date' id='date' checked={!userInput.isTimelineRange}
                                                    onChange={() => {
                                                        setUserInput({ ...userInput, isTimelineRange: false })
                                                    }}
                                                    disabled={onlyView}
                                                /> Specific Date
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' name='range' id='daterange' checked={userInput.isTimelineRange}
                                                    onChange={() => {
                                                        setUserInput({ ...userInput, isTimelineRange: true })
                                                    }}
                                                    disabled={onlyView}
                                                /> Date Range
                                            </Label>
                                        </FormGroup>
                                    </Fragment>
                                }
                                {
                                    userInput.timelineType === 'w' && !userInput.isTimelineRange && userInput.isCertainTimeline && <FormGroup className='mt-1 fade-in'>
                                        <Label for="staticTimeline">Select day<span style={{ color: 'red' }}>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            defaultValue={
                                                userInput.staticTimeline > 0 ? weekDaysName.find(({ value }) => value === userInput.staticTimeline) : null
                                            }
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, staticTimeline: selected.value })
                                            }}
                                            options={weekDaysName}
                                            ref={recurringSpecificDateRef}
                                            isDisabled={onlyView}
                                        />
                                         <Input
                                            required
                                            disabled={onlyView}
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => recurringSpecificDateRef.current.select.focus()}
                                            value={userInput.staticTimeline || ''}
                                            onChange={e => ''} />
                                    </FormGroup>
                                }
                                <Row>
                                    {
                                        userInput.timelineType === 'w' && userInput.isTimelineRange && userInput.isCertainTimeline && <Col sm="6" className='mt-1 fade-in'>
                                            <FormGroup>
                                                <Label for="startTimeline">Start day<span style={{ color: 'red' }}>*</span></Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    defaultValue={
                                                        userInput.startTimeline > 0 ? weekDaysName.find(({ value }) => value === userInput.startTimeline) : null
                                                    }
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, startTimeline: selected.value })
                                                    }}
                                                    options={weekDaysName}
                                                    ref={recurringStartDateRef}
                                                    isDisabled={onlyView}
                                                />
                                                <Input
                                                    required
                                                    disabled={onlyView}
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => recurringStartDateRef.current.select.focus()}
                                                    value={userInput.startTimeline || ''}
                                                    onChange={e => ''} />
                                                
                                            </FormGroup>
                                        </Col>
                                    }
                                    {
                                        userInput.timelineType === 'w' && userInput.isTimelineRange && userInput.isCertainTimeline && <Col sm="6" className='mt-1 fade-in'>
                                            <FormGroup>
                                                <Label for="endTimeline">End day<span style={{ color: 'red' }}>*</span></Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    defaultValue={
                                                        userInput.endTimeline > 0 ? weekDaysName.find(({ value }) => value === userInput.endTimeline) : null
                                                    }
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, endTimeline: selected.value })
                                                    }}
                                                    options={weekDaysName}
                                                    ref={recurringEndDateRef}
                                                    isDisabled={onlyView}

                                                />
                                                <Input
                                                    required
                                                    disabled={onlyView}
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => recurringEndDateRef.current.select.focus()}
                                                    value={userInput.endTimeline || ''}
                                                    onChange={e => ''} />
                                            </FormGroup>
                                        </Col>
                                    }
                                </Row>
                                {
                                    userInput.timelineType === 'm' && !userInput.isTimelineRange && userInput.isCertainTimeline && <FormGroup className='mt-1 fade-in'>
                                        <Label for="staticTimeline">Select Date<span style={{ color: 'red' }}>*</span></Label>
                                        <Select
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            defaultValue={
                                                userInput.staticTimeline > 0 ? monthDays.find(({ value }) => value === userInput.staticTimeline) : { value: 1, label: '1' }
                                            }
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, staticTimeline: selected.value })
                                            }}
                                            options={monthDays}
                                            isDisabled={onlyView}

                                        />
                                    </FormGroup>
                                }
                                <Row>
                                    {
                                        userInput.timelineType === 'm' && userInput.isTimelineRange && userInput.isCertainTimeline && <Col md='6' className='mt-1 fade-in'>
                                            <FormGroup>
                                                <Label for="startTimeline">Start Date<span style={{ color: 'red' }}>*</span></Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    defaultValue={
                                                        userInput.startTimeline > 0 ? monthDays.find(({ value }) => value === userInput.startTimeline) : null
                                                    }
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, startTimeline: selected.value })
                                                    }}
                                                    options={monthDays}
                                                    ref={recurringStartDateRef}
                                                    isDisabled={onlyView}

                                                />
                                                <Input
                                                    required
                                                    disabled={onlyView}
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => recurringStartDateRef.current.select.focus()}
                                                    value={userInput.startTimeline || ''}
                                                    onChange={e => ''} />
                                            </FormGroup>
                                        </Col>
                                    }
                                    {
                                        userInput.timelineType === 'm' && userInput.isTimelineRange && userInput.isCertainTimeline && <Col md='6' className='mt-1 fade-in'>
                                            <FormGroup>
                                                <Label for="endTimeline">End Date<span style={{ color: 'red' }}>*</span></Label>
                                                <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    defaultValue={
                                                        userInput.endTimeline > 0 ? monthDays.find(({ value }) => value === userInput.endTimeline) : null
                                                    }
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, endTimeline: selected.value })
                                                    }}
                                                    options={monthDays}
                                                    ref={recurringEndDateRef}
                                                    isDisabled={onlyView}

                                                />
                                                <Input
                                                    required
                                                    disabled={onlyView}
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => recurringEndDateRef.current.select.focus()}
                                                    value={userInput.endTimeline || ''}
                                                    onChange={e => ''} />
                                            </FormGroup>
                                        </Col>
                                    }
                                </Row>
                            </CardBody>
                        </Card>
                        </Col>
                        <Col sm='6'>
                        <Card>
                            <CardHeader>
                               
                                <span> Include Time?
                                    &nbsp; <Info size={14} id='includetimeline'/>
                                </span>
                                <UncontrolledPopover trigger='hover' placement='top' target='includetimeline'>
                                    <PopoverHeader>Details</PopoverHeader>
                                    <PopoverBody> You can set the campaign to be active within specific hours of each timeframe. Also known as happy hour. </PopoverBody>
                                </UncontrolledPopover>
                                <CustomInput
                                    type='switch'
                                    id='isTime'
                                    name='isTime'
                                    disabled={onlyView}
                                    checked={userInput.isTime}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ 
                                                ...userInput, 
                                                isTime: true, 
                                                outsideHourCommissionId: 0
                                            })
                                        } else {
                                            setUserInput({ 
                                                ...userInput, 
                                                isTime: false, 
                                                startHour: '', 
                                                endHour: '', 
                                                outsideHourCommissionId: 0 
                                            })
                                        }
                                    }
                                    }
                                />
                            </CardHeader>
                            <CardBody>
                                {
                                    userInput.isTime && <Row className='fade-in'>
                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="startHour">Start Hour<span style={{ color: 'red' }}>*</span></Label>
                                                {/* <Flatpickr
                                                    className='form-control'
                                                    // value={userInput.startHour}
                                                    id='timepicker'
                                                    options={{
                                                        defaultDate: Date.now(),
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: 'H:i',
                                                        time_24hr: false
                                                    }}
                                                    onChange={date => {
                                                        console.log(date)
                                                        console.log(new Date(new Date(date[0]).setHours(new Date(date[0]).getHours() + 1)).toString())
                                                        setUserInput({ ...userInput, startHour: flatpickr.formatDate(date[0], 'H : i'), endHour: new Date(new Date(date[0]).setHours(new Date(date[0]).getHours() + 1)).toString() })
                                                    }}
                                                /> */}
                                                <Input type="time"
                                                    name="startHour"
                                                    id='startHour'
                                                    value={userInput.startHour}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={onlyView}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="endHour">End Hour<span style={{ color: 'red' }}>*</span></Label>
                                                {/* <Flatpickr
                                                    className='form-control'
                                                    // value={userInput.endHour}
                                                    id='timepicker'
                                                    options={{
                                                        defaultDate: new Date(Date.now()).setHours(new Date(Date.now()).getHours() + 1),
                                                        // minDate: new Date(userInput.startHour).setHours(new Date(userInput.startHour).getHours() + 1), 
                                                        minDate: new Date(new Date(userInput.startHour).setHours(new Date(userInput.startHour).getHours() + 1)),
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: 'H:i',
                                                        time_24hr: false
                                                    }}
                                                    onChange={date => setUserInput({ ...userInput, endHour: flatpickr.formatDate(date[0], 'H : i') })}
                                                /> */}
                                                <Input
                                                    type="time"
                                                    min={userInput.startHour}
                                                    name="endHour"
                                                    id='endHour'
                                                    value={userInput.endHour}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={onlyView}
                                                // placeholder='0'
                                                />
                                            </FormGroup>
                                        </Col>
                                        {
                                            !userInput.isCertainTimeline && <Col sm="12" >
                                                <FormGroup>
                                                    <Label for="Businesses">Select Off-hour Rule</Label>
                                                    { !isCommissionRuleListLoading ? <Select
                                                        ref={ref1}
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        defaultValue={
                                                            userInput.outsideHourCommissionId > 0 ? commissionRuleList.find(({ value }) => (+value) === (+userInput.outsideHourCommissionId)) : null
                                                        }
                                                        onChange={(selected) => {
                                                            setUserInput({ 
                                                                ...userInput, 
                                                                outsideHourCommissionId: selected ? selected.value : 0 
                                                            })
                                                        }}
                                                        isDisabled={onlyView}
                                                        options={commissionRuleList}
                                                        isClearable                                                    
                                                     /> : <BeatLoader color="#6610f2" size={10}/>
                                                    }
                                                </FormGroup>
                                                {/* <Input
                                                    required
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => ref1.current.select.focus()}
                                                    value={userInput.outsideHourCommissionId || ''}
                                                    onChange={e => ''}
                                                /> */}
                                            </Col>
                                        }
                                    </Row>}
                            </CardBody>
                        </Card>
                        </Col>
                    </Row>
                </Fragment>

                {/* Campaign Rule Type  */}
                <Fragment>
                        <Row>
                            <Col md="12">
                              <Card>
                                <CardBody>
                                    <Row>
                                        <Col md="12" >
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <Label for="commissionType">Campaign Rule Type<span style={{ color: 'red' }}>*</span><Info size={14} id='campaignruletype'/></Label>
                                                        <UncontrolledPopover trigger='hover' placement='top' target='campaignruletype'>
                                                            <PopoverHeader>Details</PopoverHeader>
                                                            <PopoverBody> To set the campaign eligibility amount to be fixed-any amount, flexible for threshold. </PopoverBody>
                                                        </UncontrolledPopover>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            maxMenuHeight={200}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            defaultValue={
                                                                userInput.commissionType === 'fixed' ? { value: 'fixed', label: 'Fixed' } : (userInput.commissionType === 'flexible' ? { value: 'flexible', label: 'Flexible' } : null)
                                                            }
                                                            onChange={(selected) => {
                                                                if (selected.value === 'flexible') {
                                                                    setUserInput({ ...userInput, commissionType: selected.value, isPercentage: false, amount: 0 })
                                                                    // setneedRefresh(needRefresh + 1)
                                                                } else {
                                                                    setUserInput({ ...userInput, commissionType: selected.value })
                                                                    setTableData([{}])
                                                                    setTableData1([{}])
                                                                    // setneedRefresh(needRefresh + 1)
                                                                }
                                                            }}
                                                            isDisabled={onlyView}
                                                            options={[{ value: 'fixed', label: 'Fixed' }, { value: 'flexible', label: 'Flexible' }]}
                                                        />
                                                     </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {
                                            userInput.commissionType === 'fixed' && <Col sm = "12" md="12">
                                            {/* Cash-back reward*/}
                                            {
                                                userInput.reward_type === 4 && <Row>
                                                            <Col sm="12" className='mt-1'>
                                                                <Row>
                                                                    <Col md="12">
                                                                        <Label className='d-block'><h6>Campaign Rule Condition<span style={{ color: 'red' }}>*</span></h6></Label>
                                                                    </Col>
                                                                    <Col md="1">
                                                                        <FormGroup check inline  className='mt-1' >
                                                                        {/* <Label check> */}
                                                                            <CustomInput type='radio' name='flat' id='flat' label="Flat" checked={!userInput.isPercentage}
                                                                                onChange={() => {
                                                                                    setUserInput({ ...userInput, isPercentage: false, min: 0, max: 0 })
                                                                                }}
                                                                                disabled={onlyView}
                                                                            />
                                                                        {/* </Label> */}
                                                                    </FormGroup>
                                                                    </Col>
                                                                    <Col md="1">
                                                                            <FormGroup check inline  className='mt-1'>
                                                                            {/* <Label check> */}
                                                                                <CustomInput type='radio' label="Percentage" name='percentage' id='percentage' checked={userInput.isPercentage}
                                                                                    onChange={() => {
                                                                                        setUserInput({ ...userInput, isPercentage: true })
                                                                                    }}
                                                                                    disabled={onlyView}
                                                                                />
                                                                            {/* </Label> */}
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            
                                                            </Col>
                                                            <Col sm="3"  className='mt-1'>
                                                                <FormGroup>
                                                                    <Label for="snAmount">Sender Reward{userInput.isPercentage && <span> %</span>}<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Input type="number"
                                                                        name="snAmount"
                                                                        id='snAmount'
                                                                        value={userInput.snAmount}
                                                                        onChange={handleChange}
                                                                        required
                                                                        placeholder="0"
                                                                        onWheel={(e) => e.target.blur()}
                                                                        step={0.01}
                                                                        min={0.01}
                                                                        disabled={onlyView}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="3"  className='mt-1'>
                                                                <FormGroup>
                                                                    <Label for="rxAmount">Receiver Reward{userInput.isPercentage && <span> %</span>}<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Input type="number"
                                                                        name="rxAmount"
                                                                        id='rxAmount'
                                                                        value={userInput.rxAmount}
                                                                        onChange={handleChange}
                                                                        required
                                                                        placeholder="0"
                                                                        onWheel={(e) => e.target.blur()}
                                                                        step={0.01}
                                                                        min={0.01}
                                                                        disabled={onlyView}

                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            {
                                                                userInput.isPercentage === true && <Row className='fade-in'>
                                                                    <Col sm="6"  className='mt-1' >
                                                                        <FormGroup>
                                                                            <Label for="min">Minimum Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Input type="number"
                                                                                name="min"
                                                                                id='min'
                                                                                value={userInput.min}
                                                                                onChange={handleChange}
                                                                                required
                                                                                placeholder="0"
                                                                                onWheel={(e) => e.target.blur()}
                                                                                step={0.01}
                                                                                min={0.01}
                                                                                disabled={onlyView}

                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col sm="6"  className='mt-1'>
                                                                        <FormGroup>
                                                                            <Label for="max">Maximum Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Input type="number"
                                                                                name="max"
                                                                                id='max'
                                                                                value={userInput.max}
                                                                                onChange={handleChange}
                                                                                required
                                                                                placeholder="0"
                                                                                onWheel={(e) => e.target.blur()}
                                                                                step={0.01}
                                                                                min={0.01}
                                                                                disabled={onlyView}

                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            }
                                                        </Row>
                                            }
                                            {/* Voucher reward*/}
                                            {
                                                userInput.reward_type === 1 && <Row>
                                                            <Col sm="5" >
                                                                <FormGroup className='fade-in'>
                                                                    <Label for="snreward_voucherid">Sender Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    { !isVoucherListLoading ? <Fragment> <Select
                                                                        ref={srRef}
                                                                        theme={selectThemeColors}
                                                                        maxMenuHeight={200}
                                                                        className='wid-100 react-select'
                                                                        classNamePrefix='select'
                                                                        defaultValue={
                                                                            userInput.snreward_voucherid ? voucherList.find(({ value }) => (value) === userInput.snreward_voucherid) : null
                                                                        }
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, snreward_voucherid: selected.value })
                                                                        }}
                                                                        options={voucherList}
                                                                        isDisabled={onlyView}

                                                                    />
                                                                    <Input
                                                                        required
                                                                        disabled={onlyView}
                                                                        style={{
                                                                            opacity: 0,
                                                                            width: "100%",
                                                                            height: 0
                                                                            // position: "absolute"
                                                                        }}
                                                                        onFocus={e => srRef.current.select.focus()}
                                                                        value={userInput.snreward_voucherid || ''}
                                                                        onChange={e => ''}
                                                                    /></Fragment> : <BeatLoader color="#6610f2" size={10}/>
                                                                }
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="5" >
                                                                <FormGroup className='fade-in'>
                                                                    <Label for="rxreward_voucherid">Receiver Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    { !isVoucherListLoading ? <Fragment><Select
                                                                        theme={selectThemeColors}
                                                                        ref={rrRef}
                                                                        maxMenuHeight={200}
                                                                        className='wid-100 react-select'
                                                                        classNamePrefix='select'
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, rxreward_voucherid: selected.value })
                                                                        }}
                                                                        defaultValue={
                                                                            userInput.rxreward_voucherid ? voucherList.find(({ value }) => (value) === userInput.rxreward_voucherid) : null
                                                                        }
                                                                        options={voucherList}
                                                                        isDisabled={onlyView}

                                                                    />
                                                                    <Input
                                                                        required
                                                                        disabled={onlyView}
                                                                        style={{
                                                                            opacity: 0,
                                                                            width: "100%",
                                                                            height: 0
                                                                            // position: "absolute"
                                                                        }}
                                                                        onFocus={e => rrRef.current.select.focus()}
                                                                        value={userInput.rxreward_voucherid || ''}
                                                                        onChange={e => ''}
                                                                    /></Fragment> : <BeatLoader color="#6610f2" size={10}/>
                                                                    }
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                            }
                                            {/* Data-pack reward */}
                                            {
                                                 userInput.reward_type === 2 && <Row>
                                                        
                                                            <Col sm="5" >
                                                                <FormGroup className='fade-in'>
                                                                    <Label for="snreward_datapack_groupid">Sender Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    { !isDatapackLoading ? <Fragment><Select
                                                                        theme={selectThemeColors}
                                                                        ref={srRef}
                                                                        maxMenuHeight={200}
                                                                        className='wid-100 react-select'
                                                                        classNamePrefix='select'
                                                                        defaultValue={
                                                                            userInput.snreward_datapack_groupid > 0 ? datapackList.find(({ value }) => (+value) === (+userInput.snreward_datapack_groupid)) : null
                                                                        }
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, snreward_datapack_groupid: selected.value })
                                                                        }}
                                                                        options={datapackList}
                                                                        menuPlacement="top"
                                                                        isDisabled={onlyView}
                                                                    />
                                                                    <Input
                                                                        required
                                                                        disabled={onlyView}
                                                                        style={{
                                                                            opacity: 0,
                                                                            width: "100%",
                                                                            height: 0
                                                                            // position: "absolute"
                                                                        }}
                                                                        onFocus={e => srRef.current.select.focus()}
                                                                        value={userInput.snreward_datapack_groupid || ''}
                                                                        onChange={e => ''}
                                                                    /></Fragment> : <BeatLoader color="#6610f2" size={10}/>
                                                                }
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="5" >
                                                                <FormGroup className='fade-in'>
                                                                    <Label for="rxreward_datapack_groupid">Receiver Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    { !isDatapackLoading ? <Fragment><Select
                                                                        theme={selectThemeColors}
                                                                        ref={rrRef}
                                                                        maxMenuHeight={200}
                                                                        className='wid-100 react-select'
                                                                        classNamePrefix='select'
                                                                        defaultValue={
                                                                            userInput.rxreward_datapack_groupid > 0 ? datapackList.find(({ value }) => (+value) === (+userInput.rxreward_datapack_groupid)) : null
                                                                        }
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, rxreward_datapack_groupid: selected.value })
                                                                        }}
                                                                        options={datapackList}
                                                                        menuPlacement="top"
                                                                        isDisabled={onlyView}
                                                                    />
                                                                    <Input
                                                                        required
                                                                        style={{
                                                                            opacity: 0,
                                                                            width: "100%",
                                                                            height: 0
                                                                            // position: "absolute"
                                                                        }}
                                                                        onFocus={e => rrRef.current.select.focus()}
                                                                        value={userInput.rxreward_datapack_groupid || ''}
                                                                        onChange={e => ''}
                                                                        disabled={onlyView}
                                                                    /></Fragment> : <BeatLoader color="#6610f2" size={10}/>
                                                                }
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                            }
                                            {/* point reward */}
                                            {
                                                userInput.reward_type === 3 && <Row>
                                                  
                                                            <Col sm="3" >
                                                                <FormGroup>
                                                                    <Label for="snAmount">Sender Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Input type="number"
                                                                        name="snAmount"
                                                                        id='snAmount'
                                                                        value={userInput.snAmount}
                                                                        onChange={handleChange}
                                                                        required
                                                                        placeholder="0"
                                                                        onWheel={(e) => e.target.blur()}
                                                                        step={1}
                                                                        min={1}
                                                                        disabled={onlyView}

                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="3" >
                                                                <FormGroup>
                                                                    <Label for="rxAmount">Receiver Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Input type="number"
                                                                        name="rxAmount"
                                                                        id='rxAmount'
                                                                        value={userInput.rxAmount}
                                                                        onChange={handleChange}
                                                                        required
                                                                        placeholder="0"
                                                                        onWheel={(e) => e.target.blur()}
                                                                        step={1}
                                                                        min={1}
                                                                        disabled={onlyView}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>
                                            }
                                        </Col>
                                        }

                                    </Row>
                                </CardBody>
                              </Card>  
                            </Col>
                          
                        </Row>
                </Fragment>

                {
                    userInput.commissionType === 'flexible' && <Fragment>
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardBody>
                                    {/* Cash-Back Reward*/}
                                    {
                                        userInput.reward_type === 4 && <CommonDataTable column={column} TableData={tableData} />
                                    }

                                    {/* Voucher Reward*/}
                                    {
                                       userInput.reward_type === 1 && (!isVoucherListLoading ? <CommonDataTable column={column1} TableData={tableData1} /> : <BeatLoader color="#6610f2" size={10}/>)
                                    }

                                    {/* Data-Pack reward*/}
                                    {
                                        userInput.reward_type === 2 && (!isDatapackLoading ? <CommonDataTable column={column2} TableData={tableData2} /> : <BeatLoader color="#6610f2" size={10}/>)
                                    }
                                    {/* Point reward */}
                                    {
                                        userInput.reward_type === 3 && <CommonDataTable column={column3} TableData={tableData3} />
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Fragment>
                }
        </Fragment>
    )
}

export default RealTimeCommisionRuleLogic