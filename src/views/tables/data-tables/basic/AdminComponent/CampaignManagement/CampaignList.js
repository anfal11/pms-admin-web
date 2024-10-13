import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import React, { Fragment, useEffect, useState } from 'react'
import { Edit, Eye, Plus, Trash, MoreVertical, FileText, Trash2, Archive, Radio, EyeOff, Table } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'

import { Button, Card, Badge, CardBody, CardHeader, CardTitle, Col, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import report from '../../../../../../assets/images/icons/report.png'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
import PendingCampaignList from './PendingCampaignList'
import MyPendingCampaignList from './MyPendingCampaignList'
import ServerSideDataTable from '../../ServerSideDataTable'
import DetailsView from './DetailsView'
import EditDetails from './EditDetails'
import CampaignReport from './CampaignReport'
import SubRportView from './subReportView'
import {_inputSupportDateFormateConvert} from '@utils'
import moment from 'moment'

const MySwal = withReactContent(Swal)

const currentDateTime = moment(new Date())

const CampaignList = () => {
    const history = useHistory()
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const username = localStorage.getItem('username')

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [mainTableDataLoading, setMainTableDataLoading] = useState(true)

    const [resetData, setReset] = useState(true)
    const [resetAllData, setAllReset] = useState(true)

    const [campaignList, setcampaignList] = useState([])
    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [pendingCampaignList, setpendingCampaignList] = useState([])
    const [otherpendingCampaignList, setotherpendingCampaignList] = useState([])

    const [groupList, setGroupList] = useState([])
    const [serviceList, setserviceList] = useState([])
    const [campaignInfo, setCampaignInfo] = useState({})
    const [action, setAction] = useState(0)
    const [modal, setModal] = useState(false)
    const [editModal, seteditModal] = useState(false)
    const [isdataloading, setdataloading] = useState(false)

    const [ruleInfo, setruleInfo] = useState({})
    const [reportView, setreportView] = useState(false)
    const [subReportView, setsubReportView] = useState(false)
    const [reportIdx, setreportIdxw] = useState(0)


    const viewDetailsInfo = (e, row) => {
        setdataloading(true)
        setModal(true)
        useJwt2.onlineCampaignDetails({campaign_id: row['campaign_id']}).then(res => {
            const {campaignDetails = {}, commissionDetails = {}} = res.data.payload
            let multiService = campaignDetails['multi_service'] && campaignDetails['multi_service'].length ? campaignDetails['multi_service'] : []
            multiService = multiService.length && (multiService[0] === '1' || multiService[0] === 1) ? [] : multiService
            const campaignData = {
                campaignName: campaignDetails['campaign_name'],
                anyservice: campaignDetails['anyservice'],
                multiService,
        
                receiver: campaignDetails['receiver'],
                anysendergroup: campaignDetails['anysendergroup'],
                sendergroup: campaignDetails['map_group_id'], 
                anyreceivergroup: campaignDetails['anyreceivergroup'],
                receivergroup: campaignDetails['group_id'],
        
                reward_priority: campaignDetails['reward_priority'],
        
                commissionId:  campaignDetails['commission_id'],
        
                startDate:  campaignDetails['start_date'],
                endDate:  campaignDetails['end_date'],
        
                isDynamicCamp: campaignDetails['is_dynamic_camp'],
                dynamicCampExpire: campaignDetails['dynamic_camp_expire']
            }
            const flexible = commissionDetails['flexiblerules'] && commissionDetails['flexiblerules'].length ? commissionDetails['flexiblerules'] : []
            const flexibleRules = flexible.map(item => {
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
            const commissionData = {

                commissionRuleName: commissionDetails['commission_rule_name'],
                reward_type: commissionDetails['reward_type'],
                pointExpireDays: commissionDetails['point_expire_days'],
          
                isFinBasedOffer: commissionDetails['is_fin_based_offer'],
                offer_type: commissionDetails['offer_type'],
                offerCount: commissionDetails['offer_count'],
                offerAmount: commissionDetails['offer_amount'],
          
                target: commissionDetails['is_target'],
                target_type: commissionDetails['target_type'],
                target_count: commissionDetails['target_count'],
                target_amount: commissionDetails['target_amount'],
          
                isQuota: commissionDetails['is_quota'],
                quotaType: commissionDetails['quota_type'],
                quotaCount: commissionDetails['quota_count'],
                quotaAmount: commissionDetails['quota_amount'],
          
                isRxQuota: commissionDetails['is_rx_quota'],
                rxQuotaType: commissionDetails['rx_quota_type'],
                rxQuotaCount: commissionDetails['rx_quota_count'],
                rxQuotaAmount: commissionDetails['rx_quota_amount'],
          
                isCertainTimeline: commissionDetails['is_certain_timeline'],
                returnCertainTimelineId: commissionDetails['return_certain_timeline_id'],
                timelineType: commissionDetails['timeline_type'],
                isTimelineRange: commissionDetails['is_timeline_range'],
                staticTimeline: commissionDetails['static_timeline'],
                startTimeline: commissionDetails['start_timeline'],
                endTimeline: commissionDetails['end_timeline'],

                isTime: commissionDetails['is_time'],
                outsideHourCommissionId: commissionDetails['outside_hour_commission_id'],
                startHour: commissionDetails['start_hour'],
                endHour: commissionDetails['end_hour'],

                commissionType: commissionDetails['commission_type'],
                isPercentage: commissionDetails['is_percentage'],
                snAmount: commissionDetails['sn_amount'],
                rxAmount: commissionDetails['rx_amount'],
                min: commissionDetails['min'],
                max: commissionDetails['max'],
                
                snreward_datapack_groupid: commissionDetails['snreward_datapack_groupid'],
                rxreward_datapack_groupid: commissionDetails['rxreward_datapack_groupid'],

                snreward_voucherid : commissionDetails['snreward_voucherid'],
                rxreward_voucherid : commissionDetails['rxreward_voucherid'],
            
                flexibleRules
            }
            setCampaignInfo(campaignData)
            setruleInfo(commissionData)
            setdataloading(false)

        }).catch(err => {
            Error(err)
            setModal(false)
            setdataloading(false)
        })
    }

    const editDetailsInfo = (e, row) => {
        setdataloading(true)
        seteditModal(true)
        useJwt2.onlineCampaignDetails({campaign_id: row['campaign_id']}).then(res => {
            const {campaignDetails = {}, commissionDetails = {}} = res.data.payload
            let multiService = campaignDetails['multi_service'] && campaignDetails['multi_service'].length ? campaignDetails['multi_service'] : []
            multiService = multiService.length && (multiService[0] === '1' || multiService[0] === 1) ? [] : multiService
            const campaignData = {
                ...campaignDetails,
                campaign_id: row['campaign_id'],
                campaignName: campaignDetails['campaign_name'],
                anyservice: campaignDetails['anyservice'],
                multiService,
        
                receiver: campaignDetails['receiver'],
                anysendergroup: campaignDetails['anysendergroup'],
                sendergroup: campaignDetails['map_group_id'], 
                anyreceivergroup: campaignDetails['anyreceivergroup'],
                receivergroup: campaignDetails['group_id'],
        
                reward_priority: campaignDetails['reward_priority'],
        
                commissionId:  campaignDetails['commission_id'],
        
                startDate:  campaignDetails['start_date'],
                endDate:  campaignDetails['end_date'],
        
                isDynamicCamp: campaignDetails['is_dynamic_camp'],
                dynamicCampExpire: campaignDetails['dynamic_camp_expire']
            }
            const flexible = commissionDetails['flexiblerules'] && commissionDetails['flexiblerules'].length ? commissionDetails['flexiblerules'] : []
            const flexibleRules = flexible.map(item => {
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
            const commissionData = {

                commissionRuleName: commissionDetails['commission_rule_name'],
                reward_type: commissionDetails['reward_type'],
                pointExpireDays: commissionDetails['point_expire_days'],
          
                isFinBasedOffer: commissionDetails['is_fin_based_offer'],
                offer_type: commissionDetails['offer_type'],
                offerCount: commissionDetails['offer_count'],
                offerAmount: commissionDetails['offer_amount'],
          
                target: commissionDetails['is_target'],
                target_type: commissionDetails['target_type'],
                target_count: commissionDetails['target_count'],
                target_amount: commissionDetails['target_amount'],
          
                isQuota: commissionDetails['is_quota'],
                quotaType: commissionDetails['quota_type'],
                quotaCount: commissionDetails['quota_count'],
                quotaAmount: commissionDetails['quota_amount'],
          
                isRxQuota: commissionDetails['is_rx_quota'],
                rxQuotaType: commissionDetails['rx_quota_type'],
                rxQuotaCount: commissionDetails['rx_quota_count'],
                rxQuotaAmount: commissionDetails['rx_quota_amount'],
          
                isCertainTimeline: commissionDetails['is_certain_timeline'],
                returnCertainTimelineId: commissionDetails['return_certain_timeline_id'],
                timelineType: commissionDetails['timeline_type'],
                isTimelineRange: commissionDetails['is_timeline_range'],
                staticTimeline: commissionDetails['static_timeline'],
                startTimeline: commissionDetails['start_timeline'],
                endTimeline: commissionDetails['end_timeline'],

                isTime: commissionDetails['is_time'],
                outsideHourCommissionId: commissionDetails['outside_hour_commission_id'],
                startHour: commissionDetails['start_hour'],
                endHour: commissionDetails['end_hour'],

                commissionType: commissionDetails['commission_type'],
                isPercentage: commissionDetails['is_percentage'],
                snAmount: commissionDetails['sn_amount'],
                rxAmount: commissionDetails['rx_amount'],
                min: commissionDetails['min'],
                max: commissionDetails['max'],
                
                snreward_datapack_groupid: commissionDetails['snreward_datapack_groupid'],
                rxreward_datapack_groupid: commissionDetails['rxreward_datapack_groupid'],

                snreward_voucherid : commissionDetails['snreward_voucherid'],
                rxreward_voucherid : commissionDetails['rxreward_voucherid'],
            
                flexibleRules
            }
            setCampaignInfo(campaignData)
            setruleInfo(commissionData)
            setdataloading(false)

        }).catch(err => {
            Error(err)
            seteditModal(false)
            setdataloading(false)
        })
    }

    const viewTempDetailsInfo = (e, row) => {
        setdataloading(true)
        setModal(true)
        useJwt2.onlineTempCampaignDetails({campaign_id: row['campaign_id']}).then(res => {
            const {campaignDetails = {}, commissionDetails = {}} = res.data.payload
            let multiService = campaignDetails['multi_service'] && campaignDetails['multi_service'].length ? campaignDetails['multi_service'] : []
            multiService = multiService.length && (multiService[0] === '1' || multiService[0] === 1) ? [] : multiService
            const campaignData = {
                campaignName: campaignDetails['campaign_name'],
                anyservice: campaignDetails['anyservice'],
                multiService,
        
                receiver: campaignDetails['receiver'],
                anysendergroup: campaignDetails['anysendergroup'],
                sendergroup: campaignDetails['map_group_id'],
                anyreceivergroup: campaignDetails['anyreceivergroup'],
                receivergroup: campaignDetails['group_id'], 
        
                reward_priority: campaignDetails['reward_priority'],
        
                commissionId:  campaignDetails['commission_id'],
        
                startDate:  campaignDetails['start_date'],
                endDate:  campaignDetails['end_date'],
        
                isDynamicCamp: campaignDetails['is_dynamic_camp'],
                dynamicCampExpire: campaignDetails['dynamic_camp_expire']
            }
            const flexible = commissionDetails['flexiblerules'] && commissionDetails['flexiblerules'].length ? commissionDetails['flexiblerules'] : []
            const flexibleRules = flexible.map(item => {
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
            const commissionData = {

                commissionRuleName: commissionDetails['commission_rule_name'],
                reward_type: commissionDetails['reward_type'],
                pointExpireDays: commissionDetails['point_expire_days'],
          
                isFinBasedOffer: commissionDetails['is_fin_based_offer'],
                offer_type: commissionDetails['offer_type'],
                offerCount: commissionDetails['offer_count'],
                offerAmount: commissionDetails['offer_amount'],
          
                target: commissionDetails['is_target'],
                target_type: commissionDetails['target_type'],
                target_count: commissionDetails['target_count'],
                target_amount: commissionDetails['target_amount'],
          
                isQuota: commissionDetails['is_quota'],
                quotaType: commissionDetails['quota_type'],
                quotaCount: commissionDetails['quota_count'],
                quotaAmount: commissionDetails['quota_amount'],
          
                isRxQuota: commissionDetails['is_rx_quota'],
                rxQuotaType: commissionDetails['rx_quota_type'],
                rxQuotaCount: commissionDetails['rx_quota_count'],
                rxQuotaAmount: commissionDetails['rx_quota_amount'],
          
                isCertainTimeline: commissionDetails['is_certain_timeline'],
                returnCertainTimelineId: commissionDetails['return_certain_timeline_id'],
                timelineType: commissionDetails['timeline_type'],
                isTimelineRange: commissionDetails['is_timeline_range'],
                staticTimeline: commissionDetails['static_timeline'],
                startTimeline: commissionDetails['start_timeline'],
                endTimeline: commissionDetails['end_timeline'],

                isTime: commissionDetails['is_time'],
                outsideHourCommissionId: commissionDetails['outside_hour_commission_id'],
                startHour: commissionDetails['start_hour'],
                endHour: commissionDetails['end_hour'],

                commissionType: commissionDetails['commission_type'],
                isPercentage: commissionDetails['is_percentage'],
                snAmount: commissionDetails['sn_amount'],
                rxAmount: commissionDetails['rx_amount'],
                min: commissionDetails['min'],
                max: commissionDetails['max'],
                
                snreward_datapack_groupid: commissionDetails['snreward_datapack_groupid'],
                rxreward_datapack_groupid: commissionDetails['rxreward_datapack_groupid'],

                snreward_voucherid : commissionDetails['snreward_voucherid'],
                rxreward_voucherid : commissionDetails['rxreward_voucherid'],
            
                flexibleRules
            }
            setCampaignInfo(campaignData)
            setruleInfo(commissionData)
            setdataloading(false)

        }).catch(err => {
            Error(err)
            setModal(false)
            setdataloading(false)
        })
    }

    const deleteDetailsInfo = (e, row) => {
        e.preventDefault()
        return MySwal.fire({
            title: 'Do you want to Delete',
            text: `Information will be delete when another user will approve this operation.`,
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
                return useJwt2.onlineCampaignDelete({foreign_id: row['campaign_id']}).then(response => {
                  
                    setReset(!resetData)
                    Success(response)
                    
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

    const activeDeactiveDetailsInfo = (e, row, isactive) => {
        e.preventDefault()
        return MySwal.fire({
            title: `Do you want to ${isactive ? 'Live' : 'Deactive'}`,
            text: `Status will be change when another user will approve this operation.`,
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
                return useJwt2.onlineCampaignStatusChange({foreign_id: row['campaign_id'], isactive}).then(response => {
                  
                    setReset(!resetData)
                    Success(response)
                    
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

    const viewCampaignReport = (e, row) => {
        e.preventDefault()
        setCampaignInfo(row)
        setreportView(true)
    }

    useEffect(() => {

        setTableDataLoading(true)
        Promise.all([
            useJwt2.onlineCampaignListCount().then(res => {
                setRowCount(+res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.onlineCampaignList({ page: 1, limit: rowsPerPage}).then(res => {
                setcampaignList(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.onlinePendingCampaignList().then(res => {
                setpendingCampaignList(res.data.payload['myPendingList'])
                setotherpendingCampaignList(res.data.payload['otherPendingList'])
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setTableDataLoading(false)
            setMainTableDataLoading(false)
        })

    }, [resetAllData])

    useEffect(() => {
        setTableDataLoading(true)
        Promise.all([
            useJwt2.onlinePendingCampaignList().then(res => {
                setpendingCampaignList(res.data.payload['myPendingList'])
                setotherpendingCampaignList(res.data.payload['otherPendingList'])
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setTableDataLoading(false)
        })

    }, [resetData])

    const handlePagination = page => {
        setMainTableDataLoading(true)
        useJwt2.onlineCampaignList({ page: page.selected + 1, limit: rowsPerPage}).then(res => {
            setcampaignList(res.data.payload)
            setMainTableDataLoading(false)
        }).catch(err => {
            setMainTableDataLoading(false)
            Error(err)
        })
        setCurrentPage(page.selected)
    }

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = campaignList.filter(item => {
            const startsWith =
            item.campaignName.toLowerCase().startsWith(value.toLowerCase()) ||
            item.service_name.toLowerCase().startsWith(value.toLowerCase()) ||
            item.ruleInfo['commissionRuleName'].toLowerCase().startsWith(value.toLowerCase()) 

            const includes =
            item.campaignName.toLowerCase().includes(value.toLowerCase()) ||
            item.service_name.toLowerCase().includes(value.toLowerCase()) ||
            item.ruleInfo['commissionRuleName'].toLowerCase().includes(value.toLowerCase())

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
    const column = [
        {
            name: 'Campaign Name',
            minWidth: '200px',
            sortable: true,
            selector: 'campaign_name',
            wrap: true
        },
        {
            name: 'Rule Name',
            minWidth: '200px',
            sortable: true,
            selector: 'commission_rule_name',
            wrap: true
        },
        {
            name: 'Service Name',
            minWidth: '250px',
            sortable: true,
            wrap: true,
            selector: (row) => {
                if (row.anyservice) {
                   return <Badge color="info" pill>Any</Badge>
                } else {
                    return row.service_keywords.map(item => <Badge color="primary" pill>{item}</Badge>)
                }
            }
        },
        {
            name: 'Reward Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.receiver === 's' ? 'Sender' : row.receiver === 'r' ? 'Reciever' : row.receiver === 'b' ? 'Both' : ''
            }
        },
        {
            name: 'Start Date',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.start_date ? formatReadableDate(item.start_date) : '---'
            }
        },
        {
            name: 'End Date',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.end_date ? formatReadableDate(item.end_date) : '---'
            }
        },
        {
            name: 'Status',
            minWidth: '60px',
            sortable: true,
            wrap: true,
            selector: row => {
                return row.is_active  ?  <Badge color="primary" pill>Live</Badge> : 'Inactive'
            }
        },
        {
            name: 'Action',
            minWidth: '200px',
            cell: row => {
                // const currentDateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                // const currentDateTime = moment(new Date())

                 // Parse the date strings using Moment.js
                const startDate = moment(row.start_date, 'YYYY-MM-DD HH:mm:ss')
                const endDate = moment(row.end_date, 'YYYY-MM-DD HH:mm:ss')

                 // Perform comparisons
                const isAfterStartDate = currentDateTime.isAfter(startDate)
                const isBeforeEndDate = currentDateTime.isBefore(endDate)

                return <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                  <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    className='w-100'
                    onClick={(e) => viewDetailsInfo(e, row)}
                  >
                    <FileText size={14} className='mr-50' />
                    <span className='align-middle'>Details</span>
                  </DropdownItem>
                  <DropdownItem
                    className='w-100'
                    onClick={(e) => editDetailsInfo(e, row)}
                  >
                    <Archive size={14} className='mr-50' />
                    <span className='align-middle'>Edit</span>
                  </DropdownItem>
                  {
                      !row.is_active ? <DropdownItem className='w-100' 
                      onClick={(e) => deleteDetailsInfo(e, row)}
                     >
                       <Trash2 size={14} className='mr-50' />
                       <span className='align-middle'>Delete</span>
                     </DropdownItem> : null
                  }
                  {
                      !row.is_active ? <Fragment>
                         {
                            isAfterStartDate && isBeforeEndDate && <DropdownItem className='w-100' 
                            onClick={(e) => activeDeactiveDetailsInfo(e, row, true)}
                           >
                             <Radio size={14} className='mr-50' />
                             <span className='align-middle'>Live</span>
                           </DropdownItem>
                         }
                     
                      </Fragment> : <DropdownItem className='w-100' 
                          onClick={(e) => activeDeactiveDetailsInfo(e, row, false)}
                      >
                    <EyeOff  size={14} className='mr-50' />
                    <span className='align-middle'>Deactive</span>
                  </DropdownItem>
                  }

                   <DropdownItem
                    className='w-100'
                    onClick={(e) => viewCampaignReport(e, row)}
                  >
                    <Table size={14} className='mr-50' />
                    <span className='align-middle'>Report</span>
                  </DropdownItem>
                
                </DropdownMenu>
              </UncontrolledDropdown>
            }
        }
    ]
    const [activeTab, setActiveTab] = useState('1')

  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)

    return (
        !modal && !editModal && !reportView && !subReportView ? <Card>
          <CardBody className='pt-2'>
            <Nav pills>
              <NavItem>
                <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                  <span className='align-middle d-none d-sm-block'>Campaigns</span>
                </NavLink>
              </NavItem>
              {subMenuIDs.includes(21) && <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                  <span className='align-middle d-none d-sm-block'>My Pending</span>
                </NavLink>
              </NavItem>}
              {subMenuIDs.includes(21) && <NavItem>
                <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                  <span className='align-middle d-none d-sm-block'>Approve</span>
                </NavLink>
              </NavItem>}
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Online Campaign Maps</CardTitle>
                        {subMenuIDs.includes(20) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createCampaigns' >
                        <div className='d-flex align-items-center'>
                                <Plus size={17} style={{marginRight:'5px'}}/>
                                <span >Create Campaign</span>
                        </div>
                        </Button.Ripple>}
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
                        <ServerSideDataTable
                            currentPage={currentPage}
                            handlePagination={handlePagination}
                            RowCount={RowCount}
                            column={column}
                            TableData={searchValue.length ? filteredData : campaignList}
                            RowLimit={rowsPerPage}
                            TableDataLoading={mainTableDataLoading} 
                        />

                </Card>
              </TabPane>
              <TabPane tabId='2'>
                <MyPendingCampaignList 
                    resetData={resetData} 
                    setReset={setReset} 
                    TableDataLoading={TableDataLoading} 
                    pendingCampaignList={pendingCampaignList} 
                    setpendingCampaignList={setpendingCampaignList} 
                    serviceList={serviceList} 
                    groupList={groupList}
                    viewTempDetailsInfo={viewTempDetailsInfo}
                />
              </TabPane>
              <TabPane tabId='3'>
                    <PendingCampaignList 
                        resetData={resetAllData} 
                        setReset={setAllReset} 
                        TableDataLoading={TableDataLoading} 
                        pendingCampaignList={otherpendingCampaignList} 
                        setpendingCampaignList={setotherpendingCampaignList} 
                        serviceList={serviceList} 
                        groupList={groupList}
                        viewTempDetailsInfo={viewTempDetailsInfo}
                    />
                </TabPane>
            </TabContent>
          </CardBody>
        </Card> : subReportView ? <SubRportView 
            setsubReportView={setsubReportView}
            reportIdx={reportIdx}
        /> : !reportView ? modal ? <DetailsView
               model={modal}
               setModal={setModal}
               userInput={campaignInfo}
               setUserInput={setCampaignInfo}
               setruleInfo={setruleInfo}
               ruleInfo={ruleInfo}
               isdataloading={isdataloading}
           /> : <EditDetails
           model={editModal}
           setModal={seteditModal}
           userInput={campaignInfo}
           setUserInput={setCampaignInfo}
           setruleInfo={setruleInfo}
           ruleInfo={ruleInfo}
           isdataloading={isdataloading}
           resetData={resetData} 
           setReset={setReset} 
       /> : <CampaignReport 
             campaign_id = {campaignInfo ? campaignInfo['campaign_id'] : 0}
             setreportView={setreportView}
             setsubReportView={setsubReportView}
             setreportIdxw={setreportIdxw}
             campaignInfo={campaignInfo}
             ruleInfo={ruleInfo}
        />
    )
}

export default CampaignList