import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useEffect, useState } from 'react'
import { Edit, Eye, File, FileText, Grid, Plus, Share, Trash, MoreVertical, Trash2, Archive } from 'react-feather'

import { Link, useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledButtonDropdown, Table, UncontrolledDropdown, DropdownItem } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import DetailsModal from './DetailsModal'
import PendingRealTimeCommisionRuleList from './PendingRealTimeCommisionRuleList'
import MyPendingRealTimeCommisionRuleList from './MyPendingRealTimeCommisionRuleList'
import EditRealTimeCommisionRule from './EditRealTimeCommisionRule'
import ServerSideDataTable from '../../ServerSideDataTable'
const MySwal = withReactContent(Swal)

const RealTimeCommisionRuleList = () => {
    const history = useHistory()
    const username = localStorage.getItem('username')
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const [pendingRealtimeRuleList, setpendingRealtimeRuleList] = useState([])
    const [otherpendingRealtimeRuleList, setotherpendingRealtimeRuleList] = useState([])

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [mainTableDataLoading, setMainTableDataLoading] = useState(true)
    const [campaignRewardType, setcampaignRewardType] = useState([])

    const [resetData, setReset] = useState(true)
    const [resetAllData, setAllReset] = useState(false)

    const [realtimeRuleList, setrealtimeRuleList] = useState([])
    const [commisionInfo, setCommisionInfo] = useState({})
    const [modal, setModal] = useState(false)
    const [editModal, seteditModal] = useState(false)
    // const toggleModal = () => setModal(!modal)
    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        Promise.all([
            useJwt2.campaignRewardType().then(res => {
               setcampaignRewardType(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.commissionruleCount().then(res => {
                setRowCount(+res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.commissionruleList({ page: 1, limit: rowsPerPage}).then(res => {
                setrealtimeRuleList(res.data.payload)
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setMainTableDataLoading(false)
            setTableDataLoading(false)
        })
    }, [])

    useEffect(() => {
        setTableDataLoading(true)
        Promise.all([
            useJwt2.pendingCommissionruleList().then(res => {
                setpendingRealtimeRuleList(res.data.payload['myPendingList'])
                setotherpendingRealtimeRuleList(res.data.payload['otherPendingList'])
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setMainTableDataLoading(false)
            setTableDataLoading(false)
        })
    }, [resetData])

    useEffect(() => {
        setMainTableDataLoading(true)
        setTableDataLoading(true)
        Promise.all([
            useJwt2.commissionruleCount().then(res => {
                setRowCount(+res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.commissionruleList({ page: 1, limit: rowsPerPage}).then(res => {
                setrealtimeRuleList(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.pendingCommissionruleList().then(res => {
                setpendingRealtimeRuleList(res.data.payload['myPendingList'])
                setotherpendingRealtimeRuleList(res.data.payload['otherPendingList'])
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setMainTableDataLoading(false)
            setTableDataLoading(false)
        })
    }, [resetAllData])

    const handlePagination = page => {
        setMainTableDataLoading(true)
        useJwt2.commissionruleList({ page: page.selected + 1, limit: rowsPerPage}).then(res => {
            console.log(res)
            setrealtimeRuleList(res.data.payload)
            setMainTableDataLoading(false)
        }).catch(err => {
            setMainTableDataLoading(false)
            Error(err)
        })
        setCurrentPage(page.selected)
        console.log('selected', page.selected)
    }

    const getRewardTypeName = (campaignRewardType, row) => {
        const filteredItem = campaignRewardType.filter(item => (+item['reward_id']) === (+row.reward_type))
        return filteredItem.length > 0 ? filteredItem[0]['reward_type_name'] : "--"
    }

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = realtimeRuleList.filter(item => {
                const startsWith =
                    item.commissionRuleName?.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.amount?.toString()?.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.commissionType?.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.commissionRuleName?.toLowerCase().includes(value.toLowerCase()) ||
                    item.amount?.toString()?.toLowerCase().includes(value.toLowerCase()) ||
                    item.commissionType?.toLowerCase().includes(value.toLowerCase())

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
        // setCommisionInfo(row)
        const flexibleRules = row.flexiblerules.map(item => {
            return {
                startRange: item['start_range'], 
                snAmount: item['sn_amount'], 
                rxAmount: item['rx_amount'], 
                endRange: item['end_range'],

                isPercentage: item['is_percentage'],
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
    const editDetailsInfo = (row) => {
        // setCommisionInfo(row)
        const flexibleRules = row.flexiblerules.map(item => {
            return {
                startRange: item['start_range'], 
                snAmount: item['sn_amount'], 
                rxAmount: item['rx_amount'], 
                endRange: item['end_range'],

                isPercentage: item['is_percentage'],
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

            commission_id: row['commission_id'],
            created_by: row['create_by'],
            create_date: row['create_date'],
            rule_id: row['commission_id'],
          
            flexibleRules
        }
        setCommisionInfo(data)
        seteditModal(true)
    }

    const deleteDetailsInfo = async(e, row) => {
        return MySwal.fire({
            title: 'Do you want to Delete',
            text: `If you delete this rule, Campaigns with this rule also will be deleted. You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return useJwt2.commissionruleDelete({commission_id: row['commission_id']}).then(res => {
                    Success(res)
                    setReset(!resetData)
                }).catch(err => {
                    Error(err)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })
    }

    const column = [
        {
            name: 'Rule Name',
            minWidth: '250px',
            sortable: true,
            selector: 'commission_rule_name',
            wrap: true
        }, {
            name: 'Reward Type',
            minWidth: '30px',
            sortable: true,
            selector: (row) => {
                return getRewardTypeName(campaignRewardType, row)
            }
        },
        {
            name: 'Transaction Amount',
            minWidth: '200px',
            sortable: true,
            selector: row => {
                if (row.commission_type === 'flexible') {
                    return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e.start_range === e.end_range ? `${e.start_range}` : `${e.start_range} - ${e.end_range}`}
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
                            return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['snreward_voucherid'] || '--'}</div>)
                        } else {
                            return row['snreward_voucherid'] || 'N/A'
                        }
                        break

                    case 2 :
                        if (row.commission_type === 'flexible') {
                            return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['snreward_datapack_groupid'] ? `GroupId-${e['snreward_datapack_groupid']}` : '--'}</div>)
                        } else {
                            return row['snreward_datapack_groupid'] ? `GroupId-${row['snreward_datapack_groupid']}` : "--"
                        }
                        break

                        // Point or cashback..
                    default : 
                    if (row.commission_type === 'flexible') {
                        return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{`${e.sn_amount}${e.is_percentage ? '%' : ''}` || '--'}</div>)
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
                            return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['rxreward_voucherid'] || '--'}</div>)
                        } else {
                            return row['rxreward_voucherid'] || 'N/A'
                        }
                        break

                    case 2 :
                        if (row.commission_type === 'flexible') {
                            return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e['rxreward_datapack_groupid'] ? `GroupId-${e['rxreward_datapack_groupid']}` : '--'}</div>)
                        } else {
                            return row['rxreward_datapack_groupid'] ? `GroupId-${row['rxreward_datapack_groupid']}` : "--"
                        }
                        break

                        // Point or cashback..
                    default : 
                    if (row.commission_type === 'flexible') {
                        return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{`${e.rx_amount}${e.is_percentage ? '%' : ''}` || '--'}</div>)
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
                    return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e?.is_percentage ? 'Percentage' : 'Flat'}</div>)
                } else {
                    return row?.is_percentage ? 'Percentage' : 'Flat'
                }
            }
        },
        {
            name: 'Reward Range',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                if (row.commission_type === 'flexible') {
                    return row.flexiblerules.map(e => <div style={{ padding: '5px 0', borderBottom: '1px solid #E0E0E0', width: '100px' }}>{e?.is_percentage ? `${e.min} - ${e.max}` : '---'}</div>)
                } else if (row.commission_type === 'fixed' && row?.is_percentage) {
                    return `${row.min} - ${row.max}`
                } else {
                    return '---'
                }
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            cell: row => (
                <UncontrolledDropdown>
                  <DropdownToggle tag='div' className='btn btn-sm'>
                    <MoreVertical size={14} className='cursor-pointer' />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      className='w-100'
                      onClick={(e) => viewDetailsInfo(row)}
                    >
                      <FileText size={14} className='mr-50' />
                      <span className='align-middle'>Details</span>
                    </DropdownItem>
                    <DropdownItem
                      className='w-100'
                      onClick={(e) => editDetailsInfo(row)}
                    >
                      <Archive size={14} className='mr-50' />
                      <span className='align-middle'>Edit</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' 
                     onClick={(e) => deleteDetailsInfo(e, row)}
                    >
                      <Trash2 size={14} className='mr-50' />
                      <span className='align-middle'>Delete</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )
        }
    ]
    const [activeTab, setActiveTab] = useState('1')

    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    return (
        !modal && !editModal ? <Card>
            <CardBody className='pt-2'>
                <Nav pills>
                    <NavItem>
                        <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                            <span className='align-middle d-none d-sm-block'>Online Rules</span>
                        </NavLink>
                    </NavItem>
                    {subMenuIDs.includes(21) && <NavItem>
                        <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                            <span className='align-middle d-none d-sm-block'>My Pending</span>
                        </NavLink>
                    </NavItem>}
                    <NavItem>
                        <NavLink
                            active={activeTab === '3'}
                            onClick={() => { toggle('3') }}
                        >Approve
                        </NavLink>
                    </NavItem>

                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId='1'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Online Campaign Rules</CardTitle>
                                <div>
                                    {subMenuIDs.includes(20) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createRealtimeComRule' >
                                        <div className='d-flex align-items-center'>
                                            <Plus size={17} style={{ marginRight: '5px' }} />
                                            <span >Add Online Rule</span>
                                        </div>
                                    </Button.Ripple>}
                                </div>
                            </CardHeader>
                            {/* <Row className='justify-content-end mx-0'>
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
                            </Row> */}
                            {/* <CommonDataTable column={column} TableData={searchValue.length ? filteredData : realtimeRuleList} TableDataLoading={TableDataLoading} /> */}
                            <ServerSideDataTable
                                currentPage={currentPage}
                                handlePagination={handlePagination}
                                RowCount={RowCount}
                                column={column}
                                TableData={searchValue.length ? filteredData : realtimeRuleList}
                                RowLimit={rowsPerPage}
                                TableDataLoading={mainTableDataLoading} />
                        </Card>
                    </TabPane>
                    <TabPane tabId='2'>
                        <MyPendingRealTimeCommisionRuleList 
                            setCommisionInfo={setCommisionInfo} 
                            setModal={setModal}  
                            modal={modal} 
                            getRewardTypeName={getRewardTypeName} 
                            campaignRewardType={campaignRewardType} 
                            resetData={resetData} 
                            setReset={setReset} 
                            TableDataLoading={TableDataLoading} 
                            pendingRealtimeRuleList={pendingRealtimeRuleList} 
                            setpendingRealtimeRuleList={setpendingRealtimeRuleList} 
                        />
                    </TabPane>
                    <TabPane tabId='3'>
                        <PendingRealTimeCommisionRuleList 
                            setCommisionInfo={setCommisionInfo} 
                            commisionInfo={commisionInfo}
                            setModal={setModal}  
                            modal={modal} 
                            getRewardTypeName={getRewardTypeName} 
                            campaignRewardType={campaignRewardType} 
                            resetData={resetAllData} 
                            setReset={setAllReset} 
                            TableDataLoading={TableDataLoading} 
                            pendingRealtimeRuleList={otherpendingRealtimeRuleList} 
                            setpendingRealtimeRuleList={setotherpendingRealtimeRuleList} 
                        />
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card> : modal ? <DetailsModal
                    modal={modal}
                    setModal={setModal}
                    resetData={resetData}
                    setReset={setReset}
                    commisionInfo={commisionInfo}
                    getRewardTypeName={getRewardTypeName}
                    campaignRewardType={campaignRewardType}
            /> : <EditRealTimeCommisionRule 
                    setModal={setModal}
                    editModal={editModal}
                    seteditModal={seteditModal}
                    commisionInfo={commisionInfo}
                    setReset={setReset}
                    resetData={resetData}

            />
    )
}

export default RealTimeCommisionRuleList