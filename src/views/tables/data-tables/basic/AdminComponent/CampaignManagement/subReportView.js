import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    Eye, ChevronLeft
} from 'react-feather'
import {
    Button, Card, CardHeader, CardTitle, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import { formatReadableDate } from '../../../../../helper'

const subReportView = ({ reportIdx, setsubReportView }) => {
    const username = localStorage.getItem('username')

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [subReportList, setSubReportList] = useState([])

    useEffect(() => {
        useJwt2.misBonusStatus({idx: reportIdx}).then(res => {
            console.log(res)
            setSubReportList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
        })
    }, [reportIdx])

    const column = [
        // {
        //     name: 'Txn ID',
        //     minWidth: '200px',
        //     sortable: true,
        //     selector: 'tran_idx',
        //     wrap: true
        // },
        {
            name: 'Response Body',
            minWidth: '800px',
            sortable: true,
            selector: 'response_body',
            wrap: true
        },
        {
            name: 'Reward Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.reward_receiver === 's' ? 'Sender' : row.reward_receiver === 'r' ? 'Reciever' : row.reward_receiver === 'b' ? 'Both' : ''
            }
        },
        {
            name: 'Status',
            minWidth: '100px',
            wrap: true,
            selector: (row) => {
                if (row.status === 0) {
                   return <Badge color="warning" pill>Pending</Badge>
                } else if (row.status === 1) {
                    return <Badge color="success" pill>Success</Badge>
                } else if (row.status === 2) {
                    return <Badge color="danger" pill>Failed</Badge>
                } else {
                    return '--'
                }
            }
        }
        // ,
        // {
        //     name: 'Created At',
        //     minWidth: '170px',
        //     sortable: true,
        //     wrap: true,
        //     selector: (item) => {
        //         return item.created_at ? formatReadableDate(item.created_at) : '---'
        //     }
        // }

    ]
   
    return (
        <Fragment>
              <Button.Ripple className='mb-1' color='primary' tag={Link} onClick={() => setsubReportView(false)}>
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                        <span >Back</span>
                    </div>
                </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    {/* <CardTitle tag='h4'>Sub Report</CardTitle> */}
                    {/* <Button.Ripple className='mb-1' color='primary' tag={Link} onClick={() => setsubReportView(false)}>
                        <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                        </div>
                    </Button.Ripple> */}
                </CardHeader>
                <CommonDataTable 
                    column={column} 
                    TableData={subReportList} 
                    TableDataLoading={TableDataLoading} 
                />
            </Card>
        </Fragment>
  
    )
}

export default subReportView