import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import { handle401 } from '@src/views/helper'
import { Fragment, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import { formatReadableDate } from '../../../../../helper'

const ViewDetailsModal = ({ modal, toggleModal, commisionInfo, setRefresh, refresh, action }) => {

const [roleWiseApprovedList, setRoleWiseApprovedList] = useState([])
const [addUserloading, setaddUserloading] = useState(false)

useEffect(() => {
    if (commisionInfo.id) {
        useJwt.campRoleViewApproval(commisionInfo.id).then(res => {
            console.log(res)
            const itemArr = []
            for (const item of res.data.payload.module_data.roles) {
                const approvedby = res.data.payload.approved.find(i => i.role_id === item.role_id)
                if (approvedby) {
                    itemArr.push({role_id: item.role_name, approved_by: approvedby.approved_by, approved_at: approvedby.approved_at})
                } else {
                    itemArr.push({role_id: item.role_name, approved_by: '--', approved_at: ''})
                }
            }
            setRoleWiseApprovedList(itemArr)
        }).catch(err => {
            console.log(err)
            Error(err)
        })
    }
}, [commisionInfo.id])

const handleApproveRejectActions = () => {
    setaddUserloading(true)
    useJwt2.actionCommissionrule({ temp_id:commisionInfo.id, action }).then(res => {
                setRefresh(!refresh)
                Success(res)
                setTimeout(() => {
                    setaddUserloading(false)
                    toggleModal()
                }, 1000)
            }).catch(err => {
                setaddUserloading(false)
                toggleModal()
                Error(err)
            })
}
    return (
        <Modal size="lg" isOpen={modal} toggle={toggleModal} style={action === 1 ? {border:'2px solid green'} : action === 2 ? {border:'2px solid red'} : {}} >
             <ModalHeader toggle={toggleModal}>{action === 1 ? 'Approve Rule' : action === 0 ? 'Reject Rule' : 'Rule Details'}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm='12'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Approval Entry</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12" >
                                            <Table>
                                                <tr>
                                                    <th>Role Name</th>
                                                    <th>Approved By</th>
                                                    <th>Approved At</th>
                                                </tr>
                                                {
                                                    roleWiseApprovedList?.length !== 0 ? roleWiseApprovedList?.map((item, index) => <tr key={index}>
                                                        <td>{item.role_id}</td>
                                                        <td>{item.approved_by}</td>
                                                        <td>{item.approved_at ? formatReadableDate(item.approved_at || '') : '--'}</td>
                                                    </tr>) : <Spinner className='text-center'/>
                                                }
                                            </Table>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>`
                        </Col>
                </Row>

                <Row>
                    <Col sm="12" className='text-center'>
                        {
                            addUserloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' onClick={handleApproveRejectActions} type="button" style={{ marginTop: '25px' }}>
                            <span >Confirm</span>
                        </Button.Ripple>
                        }
                    </Col>
                </Row>

            </ModalBody>
        </Modal>
    )
}
export default ViewDetailsModal