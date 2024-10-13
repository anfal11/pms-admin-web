import React from 'react'
import {
  Eye,
  File,
  FileText,
  Grid,
  Plus,
  Share, Trash
} from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader, CardTitle,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input, Label,
  Nav, NavItem, NavLink,
  Row,
  TabContent, TabPane,
  UncontrolledButtonDropdown
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../../helper'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import CommonDataTable from '../../ClientSideDataTable'

const myCustomizePendingList = ({ pendingBulkSMS, TableDataLoading }) => {

  const column = [
    {
      name: 'SL',
      width: '50px',
      sortable: true,
      cell: (row, index) => index + 1  //RDT provides index by default
    },
    {
      name: 'Title',
      minWidth: '200px',
      sortable: true,
      selector: 'title',
      wrap: true
    },
    {
      name: 'Notification Type',
      minWidth: '100px',
      sortable: true,
      selector: 'notification_type',
      wrap: true
    },
    // {
    //   name: 'Is Repeat?',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: row => {
    //     return row.isRepeat ? 'True' : 'False'
    //   }
    // },
    // {
    //   name: 'Is Rule Base Notification?',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: row => {
    //     return row.is_rule_base_notification ? 'True' : 'False'
    //   }
    // },
    {
      name: 'Is Repeat?',
      minWidth: '100px',
      sortable: true,
      selector: row => (
        <div style={{ transform: 'scale(0.6)' }}>
          <CustomInput
            type='switch'
            disabled={true} // Set to true to make it read-only
            id='isRepeat'
            checked={row.isRepeat}
          />
        </div>
      )
    },
    {
      name: 'Is Scheduled?',
      minWidth: '100px',
      sortable: true,
      selector: row => (
        <div style={{ transform: 'scale(0.6)' }}>
          <CustomInput
            type='switch'
            disabled={true} // Set to true to make it read-only
            id='isScheduled'
            checked={row.isScheduled}
          />
        </div>
      )
    },
    // {
    //   name: 'Is Scheduled?',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: row => {
    //     return row.isScheduled ? 'True' : 'False'
    //   }
    // },
    // {
    //   name: 'Schedule Date',
    //   minWidth: '200px',
    //   sortable: true,
    //   selector: row => {
    //     return row.isScheduled ? formatReadableDate(row.effective_date) : '-'
    //   },
    //   wrap: true
    // },
    {
      name: 'Schedule Date',
      minWidth: '200px',
      sortable: true,
      wrap: true,
      sortType: (a, b) => {
        return new Date(b.effective_date) - new Date(a.effective_date)
      },
      selector: 'effective_date',
      cell: (item) => {
        return item.effective_date ? formatReadableDate(item.effective_date) : '--'
      }
    },
    {
      name: 'Target Individual',
      minWidth: '100px',
      sortable: true,
      selector: row => row.count || 0
    },
    {
      name: 'Created By',
      minWidth: '150px',
      sortable: true,
      selector: 'created_by_name',
      wrap: true
    },
    {
      name: 'Created At',
      minWidth: '200px',
      sortable: true,
      wrap: true,
      sortType: (a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      },
      selector: 'created_at',
      cell: (item) => {
        return item.created_at ? formatReadableDate(item.created_at) : null
      }
    }
  ]
  return (
    <div>
      <CommonDataTable column={column} TableData={pendingBulkSMS} TableDataLoading={TableDataLoading} />
    </div>
  )
}

export default myCustomizePendingList