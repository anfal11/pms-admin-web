import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Eye, Edit, Trash} from 'react-feather'
import CommonDataTable from '../../../../../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { subMenuIDs } from '../../../../../../../utility/Utils'
import { formatReadableDate } from '../../../../../../helper'
import { Badge } from 'reactstrap'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { OperationStatusSet } from '../../../../../../statusdb'


const MyPendingGroupList = ({datapackGroupList, rule_type, TableDataLoading, setgroupIdForView, setref_id}) => {
    console.log(datapackGroupList)
    const viewDetails = (e, item) => {

        setref_id(item.ref_id)
        setgroupIdForView(item.id)
    }

    const column = [

        {
            name: 'Group Title',
            minWidth: '200px',
            sortable: true,
            selector: 'group_title',
            wrap: true
        },
        {
            name: 'Operator',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_item?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e?.keyword}</div>)
            }
        },
        {
            name: 'Pack Code',
            minWidth: '50px',
            sortable: true,
            wrap: true,
            selector: row => {
                return row?.group_item?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.pack_code || '--'}</div>)
            }
        },
        {
            name: 'Disburse-Unit',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_item?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{`${e.number_of_time_api_hit} X` || '--'}</div>)
            }
        },
        {
            name: 'Operation',
            minWidth: '50px',
            sortable: true,
            selector: 'action'
        },
        // {
        //     name: 'Created By',
        //     minWidth: '150px',
        //     sortable: true,
        //     wrap: true,
        //     selector: 'modified_by'
        // },
        {
            name: 'Created At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.modified_at) - new Date(a.modified_at)
              },
            selector: 'modified_at',
            cell: (item) => {
                return item.modified_at ? formatReadableDate(item.modified_at) : null
            }
        }
    ]

    return (
        <Fragment>

           <CommonDataTable column={column} TableData={ datapackGroupList} TableDataLoading={TableDataLoading} />

        </Fragment>
    )
}

export default MyPendingGroupList