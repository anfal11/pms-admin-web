import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import DetailsModal from './DetailsModal'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'
import DetailsModal1 from './ViewDetails'
import { CURRENCY_SYMBOL } from '../../../../../../Configurables'

const MyPendingRealTimeCommisionRuleList = ({ setCommisionInfo, setModal, modal, getRewardTypeName, TableDataLoading, resetData, setReset, pendingRealtimeRuleList, setpendingRealtimeRuleList, campaignRewardType }) => {
    const username = localStorage.getItem('username')
    // const [commisionInfo, setCommisionInfo] = useState({})

    const [action, setAction] = useState(0)
    const [modal1, setModal1] = useState(false)
    const toggleModal1 = () => setModal1(!modal1)

    // const [modal, setModal] = useState(false)
    // const toggleModal = () => setModal(!modal)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = pendingRealtimeRuleList.filter(item => {
                const startsWith =
                    item.commission_rule_name.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.commission_rule_name.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchValue(value)
        }
    }
    const viewDetailsInfo = (row) => {
        row.flexible = row.flexible && row.flexible.length ? row.flexible : []
        const flexibleRules = row.flexible.map(item => {
            return {
                startRange: item['startRange'], 
                snAmount: item['snAmount'], 
                rxAmount: item['rxAmount'], 
                endRange: item['endRange'],

                isPercentage: item['isPercentage'],
                max: item['max'],
                min: item['min'],

                snreward_datapack_groupid: item['snreward_datapack_groupid'], 
                rxreward_datapack_groupid: item['rxreward_datapack_groupid'], 

                snreward_voucherid: item['snreward_voucherid'], 
                rxreward_voucherid: item['rxreward_voucherid']
            }
        })
        const data = {

            commissionRuleName: row['commission_rule_name'],
            reward_type: +row['reward_type'],
            pointExpireDays: +row['point_expire_days'],
    
            isFinBasedOffer: row['is_fin_based_offer'],
            offer_type: +row['offer_type'],
            offerCount: +row['offer_count'],
            offerAmount: +row['offer_amount'],
    
            target: row['is_target'],
            target_type: +row['target_type'],
            target_count: +row['target_count'],
            target_amount: +row['target_amount'],
    
            isQuota: row['is_quota'],
            quotaType: +row['quota_type'],
            quotaCount: +row['quota_count'],
            quotaAmount: +row['quota_amount'],
    
            isRxQuota: row['is_rx_quota'],
            rxQuotaType: +row['rx_quota_type'],
            rxQuotaCount: +row['rx_quota_count'],
            rxQuotaAmount: +row['rx_quota_amount'],
    
            isCertainTimeline: row['is_certain_timeline'],
            returnCertainTimelineId: +row['return_certain_timeline_id'],
            timelineType: row['timeline_type'],
            isTimelineRange: row['is_timeline_range'],
            staticTimeline: row['static_timeline'],
            startTimeline: row['start_timeline'],
            endTimeline: row['end_timeline'],
    
            isTime: row['is_time'],
            outsideHourCommissionId: row['outside_hour_commission_id'],
            startHour: row['start_hour'],
            endHour: row['end_hour'],
    
            commissionType: row['commission_type'],
            isPercentage: row['is_percentage'],
            snAmount: row['sn_amount'],
            rxAmount: row['rx_amount'],
            min: row['min'],
            max: row['max'],
            
            snreward_datapack_groupid: row['snreward_datapack_groupid'],
            rxreward_datapack_groupid: row['rxreward_datapack_groupid'],
    
            snreward_voucherid : row['snreward_voucherid'],
            rxreward_voucherid : row['rxreward_voucherid'],
          
            flexibleRules
        }
        setCommisionInfo(data)
        setModal(true)
    }
    const column = [
        {
            name: 'Rule Name',
            minWidth: '250px',
            sortable: true,
            selector: 'commission_rule_name',
            wrap: true
        }, 
        {
            name: 'Reward Type',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                return getRewardTypeName(campaignRewardType, row)
            }
        },
        {
            name: 'Transaction Amount',
            minWidth: '180px',
            sortable: true,
            selector: row => {
                if (row.commission_type === 'flexible') {
                    return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e.startRange === e.endRange ? e.startRange : `${e.startRange} - ${e.endRange}`}
                    </div>)
                } else {
                    return 'Any'
                }
            }
        },
        {
            name: 'Sender Reward',
            minWidth: '100px',
            sortable: true,
            wrap: true,
            selector: row => {
                //  reward type => 1=voucher,2=datapck,3=point,4=cashback
                switch (+row.reward_type) {
                    case 1 :
                        if (row.commission_type === 'flexible') {
                            return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['snreward_voucherid'] || '--'}</div>)
                        } else {
                            return row['snreward_voucherid'] || 'N/A'
                        }
                        break

                    case 2 :
                        if (row.commission_type === 'flexible') {
                            return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['snreward_datapack_groupid'] ? `GroupId-${e['snreward_datapack_groupid']}` : '--'}</div>)
                        } else {
                            return row['snreward_datapack_groupid'] ? `GroupId-${row['snreward_datapack_groupid']}` : "--"
                        }
                        break

                        // Point or cashback..
                    default : 
                    if (row.commission_type === 'flexible') {
                        return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{`${e.snAmount}${e.isPercentage ? '%' : ''}` || '--'}</div>)
                    } else {
                        return row.sn_amount || 0
                    }
                }

            }
        },
        {
            name: 'Receiver Reward',
            minWidth: '100px',
            sortable: true,
            wrap: true,
            selector: row => {
                //  reward type => 1=voucher,2=datapck,3=point,4=cashback
                switch (+row.reward_type) {
                    case 1 :
                        if (row.commission_type === 'flexible') {
                            return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['rxreward_voucherid'] || '--'}</div>)
                        } else {
                            return row['rxreward_voucherid'] || 'N/A'
                        }
                        break

                    case 2 :
                        if (row.commission_type === 'flexible') {
                            return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['rxreward_datapack_groupid'] ? `GroupId-${e['rxreward_datapack_groupid']}` : '--'}</div>)
                        } else {
                            return row['rxreward_datapack_groupid'] ? `GroupId-${row['rxreward_datapack_groupid']}` : "--"
                        }
                        break

                        // Point or cashback..
                    default : 
                    if (row.commission_type === 'flexible') {
                        return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{`${e.rxAmount}${e.isPercentage ? '%' : ''}` || '--'}</div>)
                    } else {
                        return row.rx_amount || 0
                    }
                }
            }
        },
        {
            name: 'Reward Value',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                if (row.commission_type === 'flexible') {
                    return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e?.isPercentage ? 'Percentage' : 'Flat'}</div>)
                } else {
                    return row?.isPercentage ? 'Percentage' : 'Flat'
                }
            }
        },
        {
            name: 'Reward Range',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                if (row.commission_type === 'flexible') {
                    return row.flexible.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e?.isPercentage ? `${e.min} - ${e.max}` : '---'}</div>)
                } else if (row.commission_type === 'fixed' && row?.isPercentage) {
                    return `${row.min} - ${row.max}`
                } else {
                    return '---'
                }
            }
        },

        {
            name: 'Operation',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row.operation_type === 1 ? <Badge color="primary" pill>Insert</Badge> : row.operation_type === 2 ? <Badge color="success" pill>Update</Badge> : row.operation_type === 3 ? <Badge color="danger" pill>Delete</Badge> : ''
            }
        },
        {
            name: 'Operation At',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (row) => (row.modify_date ? formatReadableDate(row.modify_date) : 'N/A')
        },

        {
            name: 'Action',
            minWidth: '150px',
            wrap: true,
            selector: row => <span title="View">
             <Eye size={15}
                color='teal'
                style={{ cursor: 'pointer' }}
                onClick={(e) => viewDetailsInfo(row)}
            />
        </span>
        }
    ]

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Online Campaign Rules</CardTitle>
            </CardHeader>
            <Row className='justify-content-end mx-0'>
                <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                    <Label className='mr-1' for='search-input'>
                        Search
                    </Label>
                    <Input
                        className='dataTable-filter mb-50'
                        type='text'
                        bsSize='sm'
                        id='search-input'
                        value={searchValue}
                        onChange={handleFilter}
                    />
                </Col>
            </Row>
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingRealtimeRuleList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default MyPendingRealTimeCommisionRuleList