import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput, Modal, ModalHeader, ModalBody
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { formatReadableDate } from '../../../../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import 'jspdf-autotable'

const MrchntCmsnTable = ({ TableDataLoading, MerchantCmsnList, setMerchantCmsnList, setTableDataRefresh }) => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [modal, setmodal] = useState(false)
    const toggleModal = () => setmodal(m => !m)

    const [rowID, setrowID] = useState(0)
    const [MerchantList, setMerchantLists] = useState([])
    const [SelectedMerchantList, setSelectedMerchantList] = useState([])
    const [SelectedMerchantLoading, setSelectedMerchantLoading] = useState(false)
    const [merchant_commission_percentage, setmerchant_commission_percentage] = useState(1)

    useEffect(async () => {
        await useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            console.log(payload)
            setMerchantLists(payload.map(x => { return { value: x.id, label: x.businessname } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])

    const handlePoPupActions = (id, message = 'Do you want to delete?') => {
        // localStorage.setItem('useBMStoken', true)
        return MySwal.fire({
            title: message,
            text: ``,
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
                return useJwt.delete_merchant_commission_rate({ id }).then(res => {
                    setMerchantCmsnList(x => x.filter(y => y.id !== id))
                    Success(res)
                    console.log(res)
                }).catch(err => {
                    console.log(err.response)
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const column = [
        {
            name: 'Merchant Name',
            minWidth: '250px',
            sortable: true,
            selector: row => row.merchant_name?.toString()
        },
        {
            name: 'Commission Percentage',
            minWidth: '100px',
            sortable: true,
            selector: 'commission_percentage'
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Created At',
            minWidth: '100px',
            sortable: true,
            selector: row => formatReadableDate(row.created_at)
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setrowID(row.id)
                                setmerchant_commission_percentage(row.commission_percentage)
                                console.log(MerchantList.filter(merchant => row.merchant_id.includes(merchant.value)))
                                setSelectedMerchantList(MerchantList.filter(merchant => row.merchant_id.includes(merchant.value)))
                                toggleModal()
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Edit">
                        <Trash size={15}
                            color='crimson'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                handlePoPupActions(row.id)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                </>
            }
        }
    ]


    const onSelectedMerchantSubmit = (e) => {
        e.preventDefault()
        const body = {
            id: rowID,
            merchant_id: SelectedMerchantList.map(x => x.value),
            merchant_name: SelectedMerchantList.map(x => x.label),
            commission_percentage: +merchant_commission_percentage
        }
        console.log(body)
        // return 0
        setSelectedMerchantLoading(true)
        useJwt.edit_merchant_commission_rate(body).then((response) => {
            setTableDataRefresh(r => !r)
            setSelectedMerchantLoading(false)
            Success(response)
            toggleModal()
        }).catch((error) => {
            setSelectedMerchantLoading(false)
            Error(error)
            console.log(error)
        })
    }
    return (
        <>
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : MerchantCmsnList} TableDataLoading={TableDataLoading} />
            <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
                <ModalHeader toggle={toggleModal}>Edit Merchant Based Commission</ModalHeader>
                <ModalBody>
                    <Form style={{ width: '100%' }} onSubmit={onSelectedMerchantSubmit} autoComplete="off">
                        <Row>
                            <Col md='12'>
                                <FormGroup>
                                    <Label>Select Merchants</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        name=""
                                        maxMenuHeight={100}
                                        value={SelectedMerchantList}
                                        onChange={(selected) => {
                                            setSelectedMerchantList(selected)
                                        }}
                                        options={MerchantList}
                                        isClearable
                                        isMulti
                                        isLoading={false}
                                    />
                                </FormGroup>
                            </Col>
                            {
                                !!SelectedMerchantList.length && <Col md='12'>
                                    <FormGroup>
                                        <Label>Commission (%) </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            step='0.01'
                                            name={merchant_commission_percentage}
                                            id={merchant_commission_percentage}
                                            value={merchant_commission_percentage}
                                            onChange={e => {
                                                setmerchant_commission_percentage(e.target.value)
                                            }}
                                            required
                                            placeholder="1"
                                        />
                                    </FormGroup>
                                </Col>
                            }
                            {!!SelectedMerchantList.length && <Col md='12' className='text-center' style={{ paddingTop: '23px' }}>
                                {
                                    SelectedMerchantLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>}
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default MrchntCmsnTable