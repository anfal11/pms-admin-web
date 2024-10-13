import React, { useEffect, useState } from 'react'
import { ChevronLeft, Eye, File, FileText, Grid, Plus, Share, Trash } from 'react-feather'
import { useParams, useHistory, Link } from 'react-router-dom'
import { Badge, Button, Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, Table, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const DetailsView = () => {
    const { rule_id } = useParams()
    const createdby = localStorage.getItem("username")
    const history = useHistory()
    const [OldRows, setOldRows] = useState({
        rule_title: '',
        amount: '',
        start_range: '',
        end_range: '',
        user_type: '',
        receiver_point: '',
        sender_point: '',
        service_type: '',
        tire: '',
        is_active: '',
        operation_type: '',
        expiry_date: '',
        expiry_point: '',
        created_by: '',
        created_at: '',
        approved_by: '',
        approved_date: ''
    })
    const [NewRows, setNewRows] = useState({
        rule_title: '',
        amount: '',
        start_range: '',
        end_range: '',
        user_type: '',
        receiver_point: '',
        sender_point: '',
        service_type: '',
        tire: '',
        is_active: '',
        operation_type: '',
        expiry_date: '',
        expiry_point: '',
        created_by: '',
        created_at: '',
        approved_by: '',
        approved_date: ''
    })
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.pendingServicePointRules(rule_id).then(res => {
        //     console.log('details', res.data.data)
        //     const usertTypes = {
        //         s: 'Sender',
        //         r: 'Receiver',
        //         b: 'Both'
        //     }

        //     const { newValue, oldValue } = res.data.data
        //     if (!!newValue) {
        //         const { rule_title, amount, start_range, end_range, user_type, receiver_point, sender_point, service_type, tire, is_active, operation_type, expiry_date, expiry_point, created_by, created_at, approved_by, approved_date } = newValue
        //         setNewRows({ rule_title, amount, start_range, end_range, user_type: usertTypes[user_type], receiver_point, sender_point, service_type, tire, is_active: !!is_active ? 'Yes' : 'No', operation_type, expiry_date: new Date(expiry_date).toLocaleDateString('fr-CA'), expiry_point, created_by, created_at: new Date(created_at).toLocaleDateString('fr-CA'), approved_by, approved_date: !!approved_date ? new Date(approved_date).toLocaleDateString('fr-CA') : '' })
        //     }
        //     if (!!oldValue) {
        //         const { rule_title, amount, start_range, end_range, user_type, receiver_point, sender_point, service_type, tire, is_active, operation_type, expiry_date, expiry_point, created_by, created_at, approved_by, approved_date } = oldValue
        //         setOldRows({ rule_title, amount, start_range, end_range, user_type: usertTypes[user_type], receiver_point, sender_point, service_type, tire, is_active: !!is_active ? 'Yes' : 'No', operation_type, expiry_date: new Date(expiry_date).toLocaleDateString('fr-CA'), expiry_point, created_by, created_at: new Date(created_at).toLocaleDateString('fr-CA'), approved_by, approved_date: !!approved_date ? new Date(approved_date).toLocaleDateString('fr-CA') : '' })
        //     }
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        // }).finally(() => {
        //     localStorage.setItem('usePMStoken', false)
        //     // setTableDataLoading(false)
        // })
    }, [])
    const handlePoPupActions = (rule_id, trigger) => {
       // localStorage.setItem('usePMStoken', true)
        return MySwal.fire({
            title: trigger === 1 ? 'Are you sure to approve?' : 'Are you sure to reject?',
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
                // return useJwt.serviceRuleAction({ rule_id, trigger, createdby }).then(res => {
                //     Success(res)
                //     history.goBack()
                //     console.log(res)
                // }).catch(err => {
                //     Error(err)
                //     console.log(err.response)
                // }).finally(() => {
                //     localStorage.setItem('usePMStoken', false)
                // })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        })
    }
    return (
        <>
            <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/servicePointRuleList' >
                <ChevronLeft size={15} />&nbsp;<span>Back</span>
            </Button.Ripple>
            <Card>
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Old Value</th>
                            <th>New Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(OldRows).map((x, i) => <tr key={i}>
                                <td className='text-capitalize'>{x.replace(/_/g, ' ')} </td>
                                <td> {OldRows[x]} </td>
                                <td className={OldRows[x] !== NewRows[x] ? 'text-primary ' : 'text-black'}> {NewRows[x]} </td>
                            </tr>)
                        }

                    </tbody>
                </Table>
            </Card>
            <Card className="p-1">
                <div className='text-center'>
                    <Button.Ripple className='' color='primary' onClick={() => handlePoPupActions(rule_id, 1)}>
                        Approve
                    </Button.Ripple>&nbsp;&nbsp;
                    <Button.Ripple className='' color='danger' onClick={() => handlePoPupActions(rule_id, 2)}>
                        Reject
                    </Button.Ripple>
                </div>
            </Card>
        </>
    )
}

export default DetailsView