import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Eye, Edit, Trash, CheckSquare, XSquare} from 'react-feather'
import CommonDataTable from '../../../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { subMenuIDs } from '../../../../../utility/Utils'
import { formatReadableDate } from '../../../../helper'
import { Badge } from 'reactstrap'
import { Error, Success, ErrorMessage } from '../../../../viewhelper'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { OperationStatusSet } from '../../../../statusdb'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import DetailsModal from './ViewDetails'

const NeedApproveRuleList = ({setruleidforview, pointRuleList, rule_type, TableDataLoading, refresh, setrefresh, setref_id}) => {

    const viewDetails = (e, item) => {

        setref_id(item.ref_id)
        setruleidforview(item.id)
    }

    const [action, setAction] = useState(0)
    const [globalRuleInfo, setGlobalRuleInfo] = useState({})
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const column = [

        {
            name: 'Rule Name',
            minWidth: '150px',
            sortable: true,
            selector: 'rule_name'
        },
        {
            name: 'Business Name',
            minWidth: '150px',
            sortable: true,
            selector: 'businessname'
        },
        {
            name: 'Is Range',
            minWidth: '70px',
            sortable: true,
            selector: row => {
                return row.is_range ? <Badge pill color='success' className='badge-center'>
                True
              </Badge> : <Badge pill color='danger' className='badge-center'>
                False
              </Badge>
            }
        },
        {
            name: 'Start Range',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row.map_item.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.start_range}</div>)
            }
        },
        {
            name: 'End Range',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row.map_item.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.end_range || '--'}</div>)
            }
        },
        {
            name: 'Reward Point',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row.map_item.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.sender_reward_point || '--'}</div>)
            }
        },
        {
            name: 'Start Date',
            minWidth: '150px',
            sortable: true,
            selector: (item) => {

                if (item.start_date) {

                    return (item.start_date).split('T')[0]
                } else {
                    return '--'
                }
              
            }
        },
        {
            name: 'End Date',
            minWidth: '150px',
            sortable: true,
            selector: (item) => {

                if (item.end_date) {

                    return (item.end_date).split('T')[0]
                } else {
                    return '--'
                }
              
            }
        },
        {
            name: 'Tier Name',
            minWidth: '150px',
            sortable: true,
            selector: 'tier_name'
        },
        {
            name: 'Point Expiry Interval(days)',
            minWidth: '70px',
            sortable: true,
            selector: 'point_expiry_interval_days'
        },

        {
            name: 'Active',
            minWidth: '80px',
            sortable: true,
            selector: row => {
                return row.is_active ? <Badge pill color='success' className='badge-center'>
                True
              </Badge> : <Badge pill color='danger' className='badge-center'>
                False
              </Badge>
            }
        },

        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: (item) => <Badge color={OperationStatusSet(item['action']).color} pill className='px-1'> {OperationStatusSet(item['action']).title} </Badge>
        },
        {
            name: 'Operation By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Operation At',
            minWidth: '200px',
            sortable: true,
            selector: row => { return row.created_at ? formatReadableDate(row.created_at) : 'N/A' }
        },

        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => viewDetails(e, row) }
                        />
                    </span> &nbsp;&nbsp;
                        <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 'Do you want to approve?', 1)}
                            onClick={() => {
                                setGlobalRuleInfo(row)
                                setModal(true)
                                setAction(1)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 'Do you want to reject?', 2)}
                            onClick={() => {
                                setGlobalRuleInfo(row)
                                setModal(true)
                                setAction(2)
                            }}
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Fragment>

           <CommonDataTable column={column} TableData={ pointRuleList} TableDataLoading={TableDataLoading} />
           <DetailsModal 
                modal={modal}
                toggleModal={toggleModal}
                globalRuleInfo={globalRuleInfo} 
                refresh={refresh}
                setRefresh={setrefresh}
                action={action}  
            /> 
        </Fragment>
    )
}

export default NeedApproveRuleList