import React, { Fragment } from 'react'
import CommonDataTable from '../../ClientSideDataTable'
import { Badge } from 'reactstrap'
import { formatReadableDate } from '../../../../../../helper'

const MypendingDatapackList = ({datapackList, TableDataLoading, refresh, setrefresh}) => {
    const column = [
        {
            name: 'Name',
            minWidth: '250px',
            sortable: true,
            selector: 'name',
            wrap: true
        },
        {
            name: 'Operator',
            minWidth: '100px',
            sortable: true,
            selector: 'operator'
        },
        {
            name: 'Volume In MB',
            minWidth: '100px',
            sortable: true,
            selector: 'volumeInMB'
        },
        {
            name: 'Pack Code',
            minWidth: '100px',
            sortable: true,
            selector: 'packcode',
            wrap: true
        },
        // {
        //     name: 'Status',
        //     minWidth: '100px',
        //     sortable: true,
        //     // selector: 'status'
        //     selector: (row) => {
        //         return <Badge color={row.status === 'active' ? 'light-success' : 'light-danger'}>{row.status}</Badge>
        //     }
        // },
        {
            name: 'Operation',
            minWidth: '150px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Created By',
            minWidth: '150px',
            sortable: true,
            selector: 'createdBy',
            wrap: true
        },
        {
            name: 'Created At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
              },
            selector: 'created_at',
            cell: (item) => {
                return item.createdAt ? formatReadableDate(item.createdAt) : null
            }
        }
    ]
    return (
        <Fragment>
            <CommonDataTable column={column} TableData={ datapackList} TableDataLoading={TableDataLoading} />
        </Fragment>
    )
}

export default MypendingDatapackList