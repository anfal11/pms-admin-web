import React from 'react'
import useJwt from '@src/auth/jwt/useJwt'
import {
  CheckSquare,
  Eye,
  File,
  FileText,
  Grid,
  Plus,
  Share, Trash, XSquare
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
const MySwal = withReactContent(Swal)

const NeedApproveList = ({ pendingApproveList, TableDataLoading, setTableDataLoading, resetData, setReset }) => {

  const handlePoPupActions = (row, status, message) => {
    if (row.notification_type === 'sms') {
      return MySwal.fire({
        title: message,
        text: `You won't be able to revert this`,
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
          const data = {
            id: row.id,
            action_id: status
          }
          return useJwt.actionBulkSMS(data).then(res => {
            Success(res)
            console.log(res)
            setReset(!resetData)
          }).catch(err => {
            console.log(err)
            Error(err)
          })
        },
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading()
      }).then(function (result) {
        if (result.isConfirmed) {

        }
      })

    } else {
      return MySwal.fire({
        title: message,
        text: `You won't be able to revert this`,
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
          const data = {
            id: row.id,
            action_id: status
          }
          return useJwt.actionBulkEmail(data).then(res => {
            Success(res)
            console.log(res)
            setReset(!resetData)
          }).catch(err => {
            console.log(err)
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
  }
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
    },
    {
      name: 'Action',
      minWidth: '150px',
      // sortable: true,
      selector: row => {
        return <>
          <span title="Approve">
            <CheckSquare size={15}
              color='teal'
              style={{ cursor: 'pointer' }}
              onClick={() => handlePoPupActions(row, 1, 'Are you sure?')}
            />
          </span>&nbsp;&nbsp;
          <span title="Reject">
            <XSquare size={15}
              color='red'
              style={{ cursor: 'pointer' }}
              onClick={() => handlePoPupActions(row, 2, 'Are you sure?')}
            />
          </span>
        </>
      }
    }
  ]
  return (
    <div>
      <CommonDataTable column={column} TableData={pendingApproveList} TableDataLoading={TableDataLoading} />
    </div>
  )
}

export default NeedApproveList