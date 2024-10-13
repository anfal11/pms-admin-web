import useJwt2 from '@src/auth/jwt/useJwt2'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import {
    Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap'
import { Error } from '../../../viewhelper'
import PendingList from './PendingList'
import ServicepointConversionRule from './PointConversionRuleList'

const AllTabs = () => {
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [pointConversionRule, setpointConversionRule] = useState({
        point: 0,
        cash_amount: 0,
        min_point_need: 0,
        created_by: ''
    })

    const [pointConversionRuleTemp, setpointConversionRuleTemp] = useState({
        point: 0,
        cash_amount: 0,
        min_point_need: 0,
        created_by: '',
        created_at: "",
        temphave:false
    })
    const toggleReset = () => {
        setReset(!resetData)
    }
 
    useEffect(async () => {
        useJwt2.pointConvertDetails().then(res => {
                const { point, cash_amount, balance_required_min_point} = res.data.payload['main']
                const { point:temppoint = null, cash_amount:tempcash_amount = null, balance_required_min_point:tempbalance_required_min_point = null, created_by = null, created_at = null} = res.data.payload['temp'] || {}

                setpointConversionRule({ ...pointConversionRule, point, cash_amount,  min_point_need: balance_required_min_point})
                setpointConversionRuleTemp({ ...pointConversionRuleTemp, point:temppoint, cash_amount:tempcash_amount,  min_point_need: tempbalance_required_min_point, created_by, created_at, temphave: res.data.payload['temp'] || false})

            }).catch(err => {
                Error(err)
                console.log(err)
            })

    }, [resetData])

    return (
        <>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Conversion Rule
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >Pending Rules
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <ServicepointConversionRule TableDataLoading={TableDataLoading} pointConversionRule={pointConversionRule} setpointConversionRule={setpointConversionRule} toggleReset={toggleReset}/>
                    </TabPane>
                    <TabPane tabId="2">
                        <PendingList TableDataLoading={TableDataLoading} pendingpointConversionRule={pointConversionRuleTemp} setpendingpointConversionRule={setpointConversionRuleTemp} toggleReset={toggleReset}/>
                    </TabPane>
                </TabContent>
            </Card>
        </>
    )
}

export default AllTabs