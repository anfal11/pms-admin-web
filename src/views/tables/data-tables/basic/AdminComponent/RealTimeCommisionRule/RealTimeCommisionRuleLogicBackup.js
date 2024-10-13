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
import './rStyle.css'
const MySwal = withReactContent(Swal)

const conditionTypes = [
    { value: 1, label: 'On Transaction Count' }, 
    { value: 2, label: 'On Amount' }, 
    { value: 3, label: 'On Both' },
    { value: 4, label: 'Any Of Them' }
]

const weekDaysName = [
    { value: 6, label: 'Saturday' }, 
    { value: 7, label: 'Sunday' }, 
    { value: 1, label: 'Monday' }, 
    { value: 2, label: 'Tuesday' }, 
    { value: 3, label: 'Wednesday' }, 
    { value: 4, label: 'Thursday' }, 
    { value: 5, label: 'Friday' }
]

const monthDays = [...Array(31)].map((_, i) => {
    return {value: i + 1, label: `${i + 1}`}
})

const RealTimeCommisionRuleLogic = () => {
    const history = useHistory()
    const ref1 = useRef()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [tableData, setTableData] = useState([{ startRange: 0, isPercentage: false }])
    const [tableData1, setTableData1] = useState([{ startRange: 0 }])
    const [tableData2, setTableData2] = useState([{ startRange: 0 }])
    const [tableData3, setTableData3] = useState([{ startRange: 0 }])
    const [defaultCommission, setDefaultCommision] = useState([])
    const [commissionRuleList, setcommissionRuleList] = useState([])
    const [instanceCampaignCheck, setinstanceCampaignCheck] = useState(false)
    const [serviceList, setserviceList] = useState([])
    const [groupList, setgroupList] = useState([])
    const [serviceLogic, setServiceLogic] = useState({})
    const [senderGroup, setSenderGroup] = useState({})
    const [receiverGroup, setReceiverGroup] = useState({})
    const [error, setError] = useState(false)
    const [voucherList, setVoucherList] = useState([])
    const [datapackList, setDatapackList] = useState([])
    const [campaignRewardType, setcampaignRewardType] = useState([])
    const [campaignRewardTypeValueOption, setcampaignRewardTypeValueOption] = useState({})
    const [quotaConditionTypes, setquotaConditionTypes] = useState(conditionTypes)
    const [campaignQuotaValue, setcampaignQuotaValue] = useState({})
    const [campaignReceiverQuotaValue, setcampaignReceiverQuotaValue] = useState({})

    const [userInput, setUserInput] = useState({

        reward_type: 0,

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


        is_voucher_reward: false,
        reward_voucherid: null,
        commissionRuleName: '',
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
        isTime: false,
        startHour: ' ',
        endHour: ' ',
        commissionType: 'fixed',
        snAmount: 0,
        rxAmount: 0,
        isPercentage: false,
        min: 0,
        max: 0,
 
        isRxQuota: false,
        rxQuotaType: 0,
        rxQuotaCount: 0,
        rxQuotaAmount: 0,
        flexibleRules: [],
        returnCommissionId: 0,
        outsideHourCommissionId: 0,
        returnCertainTimelineId: 0,
        isDailyOffer: false,
        pointExpireDays: 365,
        is_voucher_reward: false,
        snreward_voucherid : "",
        rxreward_voucherid : "",
        is_datapack_reward: false,
        snreward_datapack_groupid : "",
        rxreward_datapack_groupid : ""
    })
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

    const [campInput, setCampInput] = useState({
        campaignName: '',
        serviceId: '',
        groupId: 0,
        mapGroupId: 0,
        groupType: 0,
        commissionId: 0,
        receiver: '',
        isActive: true
    })
    const handleCampChange = (e) => {
        setCampInput({ ...campInput, [e.target.name]: e.target.value })
    }

    const getVoucherList = () => {
        useJwt2.pmsVoucher().then(res => {
            setVoucherList(res.data.payload.map(i => { return {value: i.voucherid, label: i.title} }))
        }).catch(err => {
            Error(err)
        })
    }

    const getDatapack = () => {

        useJwt2.datapackGroupList().then(res => {
            setDatapackList(res.data.payload.map(i => { return {value: i.id, label: i.group_title} }))
        }).catch(err => {
            Error(err)
        })
    }

    const getCampaignRule = () => {
        // campaignListDropdown
        useJwt2.commissionListDropdown().then(res => {
            setcommissionRuleList(res.data.payload.map(i => { return {value: i.commission_id, label: i.commission_rule_name} }))
        }).catch(err => {
            Error(err)
        })
    }

    const resetQuotaSelectedValues = () => {
        setcampaignQuotaValue(conditionTypes[0])
        setcampaignReceiverQuotaValue(conditionTypes[0])
        setUserInput({...userInput, quotaType: 1, rxQuotaType: 1})
    }

    // rewardlist....
    useEffect(() => {
        const rewardTypeid = userInput.reward_type
        switch (rewardTypeid) {
            // Voucher...
            case 1 :
                if (!voucherList.length) {
                    getVoucherList()
                }
                setquotaConditionTypes([conditionTypes[0]])
                resetQuotaSelectedValues()
                break

            // Data-pack....
            case 2 :
                if (!datapackList.length) {
                    getDatapack()
                }
                setquotaConditionTypes([conditionTypes[0]])
                resetQuotaSelectedValues()
                break

            // Point....
            case 3 :
                setquotaConditionTypes(conditionTypes)
                resetQuotaSelectedValues()
                break

            // cash-back..
            case 4 : 
                setquotaConditionTypes(conditionTypes)
                resetQuotaSelectedValues()
                break

            // There have no other option..
            default : 
                setquotaConditionTypes(conditionTypes)
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
                const rewardTypeFirstValue = data[0].value 
                setUserInput({ ...userInput, reward_type: rewardTypeFirstValue})
                setcampaignRewardTypeValueOption(data[0])
            }

          }).catch(err => {
            Error(err)
        })
    }, [])

    useEffect(() => {
        if (!commissionRuleList.length) {
            getCampaignRule()
        }
    }, [userInput.isCertainTimeline, userInput.isTime])


    // const onSubmit = (e) => {
    //     e.preventDefault()
    //     // localStorage.setItem('useBMStoken', true)
    //     // setPointRuleloading(true)
    //     // //startDate: '',  endDate: '',
    //     // let { flexibleRules, startDate, endDate } = userInput
    //     // startDate = startDate.replace(/T/, ' ')
    //     // endDate = endDate.replace(/T/, ' ')

    //     // flexibleRules = userInput.is_voucher_reward ? tableData1 : userInput.is_datapack_reward ? tableData2 : tableData
    //     // console.log({ ...userInput, flexibleRules, startDate,  endDate})
    //     // useJwt.createRealtimeRule({ ...userInput, flexibleRules, startDate, endDate }).then((response) => {
    //     //     if (instanceCampaignCheck) {
    //     //         let { groupId, mapGroupId, groupType } = campInput
    //     //         if (serviceLogic.ruleProvider === 's') {
    //     //             mapGroupId = senderGroup.groupId
    //     //             groupType = senderGroup.groupType
    //     //             groupId = receiverGroup.groupId
    //     //         } else if (serviceLogic.ruleProvider === 'r') {
    //     //             mapGroupId = receiverGroup.groupId
    //     //             groupType = receiverGroup.groupType
    //     //             groupId = senderGroup.groupId
    //     //         }
    //     //         useJwt.createCampaign({ ...campInput, mapGroupId, groupType, groupId, commissionId: response.data.id }).then((response) => {
    //     //             Success(response)
    //     //             localStorage.setItem('useBMStoken', false)
    //     //         }).catch((error) => {
    //     //             Error(error)
    //     //             console.log(error.response)
    //     //             localStorage.setItem('useBMStoken', false)
    //     //         })
    //     //     }
    //     //     setPointRuleloading(false)
    //     //     history.push('/allRealtimeComRule')
    //     //     Success(response)
    //     // }).catch((error) => {
    //     //     setPointRuleloading(false)
    //     //     localStorage.setItem('useBMStoken', false)
    //     //     Error(error)
    //     //     console.log(error.response)
    //     // })
    // }

    const column = useMemo(() => [
        {
            name: 'Reward Condition',
            minWidth: '200px',
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
                    options={[{ value: true, label: 'Percentage' }, { value: false, label: 'Flat' }]}
                />
            }
        },
        {
            name: 'Sender Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <div>
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
                    />
                    {(error && !tableData[index].snAmount) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>Sender Amount is Required!!!</h6>}
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
                        value={tableData[index].rxAmount}
                        onChange={e => {
                            handleChange1(e, index)
                        }}
                        required
                        style={(error && !tableData[index].rxAmount) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        placeholder='0'
                    />
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
                        disabled={!tableData[index].isPercentage}
                        placeholder="0"
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
                        disabled={!tableData[index].isPercentage}
                        placeholder="0"
                    />
                    {(error && tableData[index].isPercentage && !tableData[index].max) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-26px' }}>Max commision Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',

            cell: (row, index) => {
                return <>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (tableData[index].snAmount && tableData[index].rxAmount && tableData[index].startRange && tableData[index].endRange && ((!tableData[index].isPercentage && (!tableData[index].min && !tableData[index].max)) || (tableData[index].isPercentage && (tableData[index].min && tableData[index].max)))) {
                                    setTableData([...tableData, { startRange: parseInt(tableData[index].endRange) + 0.01, isPercentage: false }])
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
                </>
            }
        }
    ], [tableData.length, userInput.commissionType, error])
    const column1 = useMemo(() => [
        {
            name: 'Sender Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <Select
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
                    />
            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <Select
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
                    />
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
                    />
                    {(error && !tableData1[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',

            cell: (row, index) => {
                return <>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (tableData1[index].startRange && tableData1[index].endRange) {
                                    setTableData1([...tableData1, { startRange: parseInt(tableData1[index].endRange) + 0.01 }])
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
    ], [tableData1.length, userInput.commissionType, error])
    const column2 = useMemo(() => [
        {
            name: 'Sender Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        ClassName='wid-100'
                        classNamePrefix='select'
                        value={ datapackList.find(i => i.value === tableData2[index]?.snreward_datapack_groupid) }
                        onChange={(e) => {
                            tableData2[index] = { ...tableData2[index], snreward_datapack_groupid: e.value }
                            setTableData2([...tableData2])
                        }}
                        style={(error && !tableData2[index].snreward_datapack_groupid) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        options={datapackList}
                    />
            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            cell: (Row, index) => {
                return <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        ClassName='wid-100'
                        classNamePrefix='select'
                        value={ datapackList.find(i => i.value === tableData2[index]?.rxreward_datapack_groupid) }
                        onChange={(e) => {
                            tableData2[index] = { ...tableData2[index], rxreward_datapack_groupid: e.value }
                            setTableData2([...tableData2])
                        }}
                        style={(error && !tableData2[index].rxreward_datapack_groupid) ? { borderColor: 'red', position: 'relative' } : { color: 'black' }}
                        options={datapackList}
                    />
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
                    />
                    {(error && !tableData2[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',

            cell: (row, index) => {
                return <>
                    <span title="Add">
                        <Plus size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                if (tableData2[index].startRange && tableData2[index].endRange) {
                                    setTableData2([...tableData2, { startRange: parseInt(tableData2[index].endRange) + 0.01 }])
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
    ], [tableData2.length, userInput.commissionType, error])
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
                    />
                    {(error && !tableData3[index].endRange) && <h6 style={{ color: 'red', fontSize: '9px', position: 'absolute', bottom: '-16px' }}>End Range Required!!!</h6>}
                </div>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            cell: (row, index) => {
                return <>
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
                                            startRange: parseInt(tableData3[index].endRange) + 0.01, 
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
    ], [tableData3.length, userInput.commissionType, error])

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allRealtimeComRule' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Add Online Campaign Rule</CardTitle>
                </CardHeader>
            </Card>

            <Form  style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="commissionRuleName">Campaign Rule Name<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="textarea"
                                        name="commissionRuleName"
                                        id='commissionRuleName'
                                        rows='1'
                                        value={userInput.commissionRuleName}
                                        onChange={handleChange}
                                        required
                                        maxlength="100"
                                        placeholder="rule name here..."
                                    />
                                    <p className='text-right' style={userInput.commissionRuleName.length === 100 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{100 - userInput.commissionRuleName.length} characters remaining</p>
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <Row>
                                    <Col sm="12" > 
                                        <FormGroup>
                                        <Label for="campaign-reward-type">Campaign Reward Type</Label>
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
                                        />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                {
                                    userInput.reward_type === 3 && <Row>
                                    <Col sm="12"  className='fade-in'> 
                                        <FormGroup>
                                            <Label for="pointExpireDays">Point Expire Days<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="number"
                                                min='1'
                                                name="pointExpireDays"
                                                id='pointExpireDays'
                                                value={userInput.pointExpireDays}
                                                onChange={handleChange}
                                                required
                                                placeholder="0"
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
                                        Add Transaction Condition?
                                        <CustomInput
                                            type='switch'
                                            id='isFinBasedOffer'
                                            name='isFinBasedOffer'
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
                                                        defaultValue={conditionTypes[0]}
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, offer_type: selected.value })
                                                        }}
                                                        options={conditionTypes}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.offer_type !== 2 && <Col md="6" className='fade-in'>
                                                        <FormGroup>
                                                            <Label for="offerCount">Define Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="offerCount"
                                                                id='offerCount'
                                                                value={userInput.offerCount}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.offer_type !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="offerAmount">Define Transaction Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="offerAmount"
                                                                    id='offerAmount'
                                                                    value={userInput.offerAmount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
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
                                        Set Cumulative Target?
                                        <CustomInput
                                            type='switch'
                                            id='cumulative-target'
                                            name='cumulative-target'
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setUserInput({ ...userInput, target: true, terget_type: conditionTypes[0].value })
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
                                                        defaultValue={conditionTypes[0]}
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, terget_type: selected.value })
                                                        }}
                                                        options={conditionTypes}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.terget_type !== 2 && <Col md="6" className='fade-in'>
                                                        <FormGroup>
                                                            <Label for="terget_typeCount">Define Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="target_count"
                                                                id='terget_typeCount'
                                                                value={userInput.target_count}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.terget_type !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="target_amount">Define Transaction Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="target_amount"
                                                                    id='target_amount'
                                                                    value={userInput.target_amount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
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
                                         Set Campaign Reward Quota?
                                         <CustomInput
                                            type='switch'
                                            id='isQuota'
                                            name='isQuota'
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
                                                        defaultValue={quotaConditionTypes[0]}
                                                        value={campaignQuotaValue}
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, quotaType: selected.value })
                                                            setcampaignQuotaValue(selected)
                                                        }}
                                                        options={quotaConditionTypes}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.quotaType !== 2 && <Col md="6" className='fade-in'>
                                                        <FormGroup>
                                                            <Label for="quotaCount">Define Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="quotaCount"
                                                                id='quotaCount'
                                                                value={userInput.quotaCount}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.quotaType !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="quotaAmount">Define Transaction Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="quotaAmount"
                                                                    id='quotaAmount'
                                                                    value={userInput.quotaAmount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
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
                                        Set Receiver Reward Quota?
                                        <CustomInput
                                            type='switch'
                                            id='isRxQuota'
                                            name='isRxQuota'
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
                                                        defaultValue={quotaConditionTypes[0]}
                                                        value={campaignReceiverQuotaValue}
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, rxQuotaType: selected.value })
                                                            setcampaignReceiverQuotaValue(selected)
                                                        }}
                                                        options={quotaConditionTypes}
                                                    />
                                                </FormGroup>
                                            </Col>
                                           <Col md="12">
                                            <Row>
                                                { 
                                                    userInput.rxQuotaType !== 2 && <Col md="6" className='fade-in'>
                                                        <FormGroup>
                                                            <Label for="rxQuotaCount">Define Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                                            <Input type="number"
                                                                name="rxQuotaCount"
                                                                id='rxQuotaCount'
                                                                value={userInput.rxQuotaCount}
                                                                onChange={handleChange}
                                                                required
                                                                placeholder="0"
                                                            />
                                                        </FormGroup>
                                                    </Col> 
                                                    }
                                                    {
                                                    userInput.rxQuotaType !== 1 && <Col md="6" className='fade-in'>
                                                            <FormGroup>
                                                                <Label for="rxQuotaAmount">Define Transaction Amount<span style={{ color: 'red' }}>*</span></Label>
                                                                <Input type="number"
                                                                    name="rxQuotaAmount"
                                                                    id='rxQuotaAmount'
                                                                    value={userInput.rxQuotaAmount}
                                                                    onChange={handleChange}
                                                                    required
                                                                    placeholder="0"
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
                                Set Recurring Timeline?
                                <CustomInput
                                    type='switch'
                                    id='isCertainTimeline'
                                    name='isCertainTimeline'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ 
                                                ...userInput, 
                                                timelineType:'m', 
                                                staticTimeline:1, 
                                                isCertainTimeline: true, 
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
                                            <Select
                                                ref={ref1}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={(selected) => {
                                                    setUserInput({ 
                                                        ...userInput, 
                                                        returnCertainTimelineId: selected ? selected.value : 0 
                                                    })
                                                }}
                                                options={commissionRuleList}
                                                isClearable
                                            />
                                        </FormGroup>
    
                                        <FormGroup className='fade-in'>
                                            <Label for="Businesses">Recurring Type<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                defaultValue={{ value: 'm', label: 'Monthly' }}
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, timelineType: selected.value })
                                                }}
                                                options={[
                                                    { value: 'w', label: 'Weekly' }, 
                                                    { value: 'm', label: 'Monthly' }
                                                ]}
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
                                                /> Specific Day
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' name='range' id='range' checked={userInput.isTimelineRange}
                                                    onChange={() => {
                                                        setUserInput({ ...userInput, isTimelineRange: true })
                                                    }}
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
                                                /> Specific Date
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' name='range' id='daterange' checked={userInput.isTimelineRange}
                                                    onChange={() => {
                                                        setUserInput({ ...userInput, isTimelineRange: true })
                                                    }}
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
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, staticTimeline: selected.value })
                                            }}
                                            options={weekDaysName}
                                        />
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
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, startTimeline: selected.value })
                                                    }}
                                                    options={weekDaysName}
                                                />
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
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, endTimeline: selected.value })
                                                    }}
                                                    options={weekDaysName}
                                                />
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
                                            defaultValue={{ value: 1, label: '1' }}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, staticTimeline: selected.value })
                                            }}
                                            options={monthDays}
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
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, startTimeline: selected.value })
                                                    }}
                                                    options={monthDays}
                                                />
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
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, endTimeline: selected.value })
                                                    }}
                                                    options={monthDays}
                                                />
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
                                Include Time?
                                <CustomInput
                                    type='switch'
                                    id='isTime'
                                    name='isTime'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, isTime: true, outsideHourCommissionId: defaultCommission.find(d => d.isDefault) ? defaultCommission.find(d => d.isDefault)?.commissionId : defaultCommission[0]?.commissionId })
                                        } else {
                                            setUserInput({ ...userInput, isTime: false, startHour: '', endHour: '', outsideHourCommissionId: 0 })
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
                                                // placeholder='0'
                                                />
                                            </FormGroup>
                                        </Col>
                                        {
                                            !userInput.isCertainTimeline && <Col sm="12" >
                                                <FormGroup>
                                                    <Label for="Businesses">Select Off-hour Rule<span style={{ color: 'red' }}>*</span></Label>
                                                    <Select
                                                        ref={ref1}
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        onChange={(selected) => {
                                                            setUserInput({ ...userInput, outsideHourCommissionId: selected ? selected.value : 0 })
                                                        }}
                                                        options={commissionRuleList}
                                                        isClearable                                                    
                                                    />
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
                                                        <Label for="commissionType">Campaign Rule Type<span style={{ color: 'red' }}>*</span></Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            maxMenuHeight={200}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            defaultValue={{ value: 'fixed', label: 'Fixed' }}
                                                            onChange={(selected) => {
                                                                if (selected.value === 'flexible') {
                                                                    setUserInput({ ...userInput, commissionType: selected.value, isPercentage: false, amount: 0 })
                                                                } else {
                                                                    setUserInput({ ...userInput, commissionType: selected.value })
                                                                    setTableData([{}])
                                                                    setTableData1([{}])
                                                                }
                                                            }}
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
                                                            <Col sm="12" className='mb-1'>
                                                                <Label className='d-block'><h6>Campaign Rule Condition<span style={{ color: 'red' }}>*</span></h6></Label>
                                                                <FormGroup check inline >
                                                                    <Label check>
                                                                        <CustomInput type='radio' name='flat' id='flat' checked={!userInput.isPercentage}
                                                                            onChange={() => {
                                                                                setUserInput({ ...userInput, isPercentage: false, min: 0, max: 0 })
                                                                            }}
                                                                        /> Flat
                                                                    </Label>
                                                                </FormGroup>
                                                                <FormGroup check inline>
                                                                    <Label check>
                                                                        <CustomInput type='radio' name='percentage' id='percentage' checked={userInput.isPercentage}
                                                                            onChange={() => {
                                                                                setUserInput({ ...userInput, isPercentage: true })
                                                                            }}
                                                                        /> Percentage
                                                                    </Label>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="3" >
                                                                <FormGroup>
                                                                    <Label for="snAmount">Sender Reward{userInput.isPercentage && <span> %</span>}<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Input type="number"
                                                                        name="snAmount"
                                                                        id='snAmount'
                                                                        value={userInput.snAmount}
                                                                        onChange={handleChange}
                                                                        required
                                                                        placeholder="0"
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="3" >
                                                                <FormGroup>
                                                                    <Label for="rxAmount">Receiver Reward{userInput.isPercentage && <span> %</span>}<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Input type="number"
                                                                        name="rxAmount"
                                                                        id='rxAmount'
                                                                        value={userInput.rxAmount}
                                                                        onChange={handleChange}
                                                                        required
                                                                        placeholder="0"
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            {
                                                                userInput.isPercentage === true && <Row className='fade-in'>
                                                                    <Col sm="6" >
                                                                        <FormGroup>
                                                                            <Label for="min">Minimum Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Input type="number"
                                                                                name="min"
                                                                                id='min'
                                                                                value={userInput.min}
                                                                                onChange={handleChange}
                                                                                required
                                                                                placeholder="0"
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col sm="6" >
                                                                        <FormGroup>
                                                                            <Label for="max">Maximum Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Input type="number"
                                                                                name="max"
                                                                                id='max'
                                                                                value={userInput.max}
                                                                                onChange={handleChange}
                                                                                required
                                                                                placeholder="0"
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
                                                            <Col sm="12" className='mb-1'>
                                                                <Label className='d-block'><h6>Campaign Rule Condition<span style={{ color: 'red' }}>*</span></h6></Label>
                                                            </Col>
                                                            <Col sm="5" >
                                                                <FormGroup className='fade-in'>
                                                                    <Label for="snreward_voucherid">Sender Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Select
                                                                        theme={selectThemeColors}
                                                                        maxMenuHeight={200}
                                                                        className='react-select'
                                                                        classNamePrefix='select'
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, snreward_voucherid: selected.value })
                                                                        }}
                                                                        options={voucherList}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="5" >
                                                                <FormGroup className='mt-1 fade-in'>
                                                                    <Label for="rxreward_voucherid">Receiver Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Select
                                                                        theme={selectThemeColors}
                                                                        maxMenuHeight={200}
                                                                        className='react-select'
                                                                        classNamePrefix='select'
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, rxreward_voucherid: selected.value })
                                                                        }}
                                                                        options={voucherList}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                            }
                                            {/* Data-pack reward */}
                                            {
                                                 userInput.reward_type === 2 && <Row>
                                                            <Col sm="12" className='mb-1'>
                                                                <Label className='d-block'><h6>Campaign Rule Condition<span style={{ color: 'red' }}>*</span></h6></Label>
                                                            </Col>
                                                            <Col sm="5" >
                                                                <FormGroup className='fade-in'>
                                                                    <Label for="snreward_datapack_groupid">Sender Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Select
                                                                        theme={selectThemeColors}
                                                                        maxMenuHeight={200}
                                                                        className='react-select'
                                                                        classNamePrefix='select'
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, snreward_datapack_groupid: selected.value })
                                                                        }}
                                                                        options={datapackList}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col sm="5" >
                                                                <FormGroup className='mt-1 fade-in'>
                                                                    <Label for="rxreward_datapack_groupid">Receiver Reward<span style={{ color: 'red' }}>*</span></Label>
                                                                    <Select
                                                                        theme={selectThemeColors}
                                                                        maxMenuHeight={200}
                                                                        className='react-select'
                                                                        classNamePrefix='select'
                                                                        onChange={(selected) => {
                                                                            setUserInput({ ...userInput, rxreward_datapack_groupid: selected.value })
                                                                        }}
                                                                        options={datapackList}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                            }
                                            {/* point reward */}
                                            {
                                                userInput.reward_type === 3 && <Row>
                                                      <Col sm="12" className='mb-1'>
                                                                <Label className='d-block'><h6>Campaign Rule Condition<span style={{ color: 'red' }}>*</span></h6></Label>
                                                            </Col>
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
                                       userInput.reward_type === 1 && <CommonDataTable column={column1} TableData={tableData1} />
                                    }

                                    {/* Data-Pack reward*/}
                                    {
                                        userInput.reward_type === 2 && <CommonDataTable column={column2} TableData={tableData2} />
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

                <Col sm="12" className='text-center'>
                    {
                        pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                            <Spinner color='white' size='sm' />
                            <span className='ml-50'>Loading...</span>
                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                            <span >Submit</span>
                        </Button.Ripple>
                    }
                </Col>
            </Form>
        </Fragment>
    )
}

export default RealTimeCommisionRuleLogic