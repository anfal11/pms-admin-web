import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Eye, Edit, Trash} from 'react-feather'
import CommonDataTable from '../../../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { subMenuIDs } from '../../../../../utility/Utils'
import { formatReadableDate } from '../../../../helper'
import { Badge } from 'reactstrap'
import { Error, Success, ErrorMessage } from '../../../../viewhelper'
import useJwt2 from '@src/auth/jwt/useJwt2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const RuleList = ({pointRuleList, rule_type, TableDataLoading, setrefresh, refresh, setruleeditdata}) => {


    const editDetails = (e, item) => {

        setruleeditdata(item)

    }

    const deleteDetails = (e, item) => {
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
                return useJwt2.pmsPointRuleDelete({ rule_id: item.id }).then(res => {
                  
                    console.log(res)
                    Success({data: {message : res.data.message}})
                    setrefresh(refresh + 1)
                    
                }).catch(err => {
                    Error(err)
                    console.log(err.response)
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
            name: 'Product Name',
            minWidth: '150px',
            sortable: true,
            selector: (row) => {
                return row.map_item.length ? row.map_item[0]['productname'] : '--'
            }
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
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='#3b3acb'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => editDetails(e, row) }
                        />
                    </span> &nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => deleteDetails(e, row) }
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Fragment>

           <CommonDataTable column={column} TableData={ pointRuleList} TableDataLoading={TableDataLoading} />

        </Fragment>
    )
}

export default RuleList