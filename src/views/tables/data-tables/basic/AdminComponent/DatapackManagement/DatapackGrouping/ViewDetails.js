import useJwt from '@src/auth/jwt/useJwt'
import { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap'
import { formatReadableDate } from '../../../../../../helper'
import { Error, Success } from '../../../../../../viewhelper'

const ViewDetailsModal = ({ modal, toggleModal, datapackInfo, setRefresh, refresh, action }) => {

const [roleWiseApprovedList, setRoleWiseApprovedList] = useState([])
const [addUserloading, setaddUserloading] = useState(false)
console.log(datapackInfo)

useEffect(() => {
    if (datapackInfo.id) {
        useJwt.datapackGroupApprovalById(datapackInfo.id).then(res => {
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
}, [datapackInfo.id])

const handleApproveRejectActions = () => {
    setaddUserloading(true)
    useJwt.datapackGroupApprove({ id:datapackInfo.id, action_id: action }).then(res => {
                setRefresh(!refresh)
                Success(res)
                setaddUserloading(false)
                toggleModal()
                console.log(res)
            }).catch(err => {
                // handle401(err.response.status)
                console.log(err.response)
                setaddUserloading(false)
                toggleModal()
                Error(err)
            })
}
    return (
        <Modal size="xl" isOpen={modal} toggle={toggleModal} style={action === 1 ? {border:'2px solid green'} : action === 2 ? {border:'2px solid red'} : {}} >
             <ModalHeader toggle={toggleModal}>{action === 1 ? 'Approve Datapack' : action === 2 ? 'Reject Datapack' : 'Datapack Details'}</ModalHeader>
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