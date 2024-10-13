import useJwt from '@src/auth/jwt/useJwt'
import { handle401 } from '@src/views/helper'
import { Fragment, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap'
import { Error, Success } from '../../viewhelper'
import { formatReadableDate } from '../../helper'

const ViewDetailsModal = ({ modal, toggleModal, userInfo, setRefresh, refresh, action, menuSubmenus }) => {

const [ismenuloading, setmenuloading] = useState(true)
const [featureIDs, setFeatureIDs] = useState([])
const [sub_menu_ids, setSubmenuIDs] = useState([])
const [roleWiseApprovedList, setRoleWiseApprovedList] = useState([])
const [addUserloading, setaddUserloading] = useState(false)
console.log(userInfo)
const getRolemenusubmenulist = (role_id) => {

    setmenuloading(true)
    setFeatureIDs([])
    setSubmenuIDs([])

    useJwt.getAdminroleDetails({role_id}).then(res => {
        // setaddUserloading(false)
        console.log('get role details', res)
        if (res.data['payload']) {
            const { rolemenudata } = res.data['payload']
            const menu_ids = [], submenuids = []
            rolemenudata.map(item => {
                menu_ids.push(item.id)
                if (item.submenu && item.submenu.length) {
                    item.submenu.map(item2 => submenuids.push(item2.id)) 
                }
            })

            setFeatureIDs(menu_ids)
            setSubmenuIDs(submenuids)
            //setUserInput({ role_name, menu_ids, sub_menu_ids: submenuids})
        }
        setmenuloading(false)
    }).catch(err => {
        //Error(err)
        setmenuloading(false)
        console.log(err)
    })
}

useEffect(() => {
    if (userInfo['roleid']) {
        getRolemenusubmenulist(userInfo['roleid'])
        useJwt.getApprovalEntryforAdminUser(userInfo.id).then(res => {
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
}, [userInfo['roleid']])

const handleApproveRejectActions = () => {
    setaddUserloading(true)
    useJwt.approveRejectAdminUsers({ id:userInfo.id, action_id: action }).then(res => {
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
             <ModalHeader toggle={toggleModal}>{action === 1 ? 'Approve User' : action === 2 ? 'Reject User' : 'User Details'}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm='4'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <h6 style={{margin:'0'}}></h6><h5 style={{margin:'0'}}>User Info</h5><h6 style={{margin:'0'}}></h6>
                            </CardHeader>
                            <div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{margin:'0'}}>User Name</h6>
                                    <h6 style={{margin:'0'}}><b>{userInfo.username}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{margin:'0'}}>Full Name</h6>
                                    <h6 style={{margin:'0'}}><b>{userInfo.fullname}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{margin:'0'}}>User Status</h6>
                                    <h6 style={{margin:'0'}}><b>{userInfo.userstatus === 1 ? 'Active' : 'Inactive'} </b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{margin:'0'}}>Email</h6>
                                    <h6 style={{margin:'0'}}><b>{userInfo.emailid}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{margin:'0'}}>Role Name</h6>
                                    <h6 style={{margin:'0'}}><b>{userInfo['role_info'] ? userInfo['role_info']['role_name'] : ""}</b></h6>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col sm='8'>
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
                
                {
                    ismenuloading ? <Fragment> <Spinner /> </Fragment> : <Card >
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Permissions</CardTitle>
                    </CardHeader>
                    <CardBody className='pt-1 pb-0'>
                    <Row className='match-height'>
                            {
                                menuSubmenus.filter(m => m.submenu.length === 0).map((menuItem, index) => {

                                    const ischecked = featureIDs.includes(menuItem.id)

                                    return <Col md='3' key={menuItem.id}>
                                    <Card className="border p-1">
                                        <CustomInput
                                            type='checkbox'
                                            id={menuItem.id}
                                            label={menuItem.name}
                                            onChange={(e) => e.preventDefault()}
                                            inline
                                            disabled={!ischecked}
                                            checked={ischecked}
                                        />
                                    </Card>
                                </Col>
                                })
                            }
                        </Row>
                        <Row className='match-height'>
                            {
                                menuSubmenus.filter(m => m.submenu.length !== 0).map((menuItem, index) => <Col md='3' key={menuItem.id}>
                                    <Card className="border pb-1">
                                        <b className="border-bottom p-1 mb-1">{menuItem.name}</b>
                                        {
                                            menuItem.submenu.map((subMenuItem, index) => {

                                                const ischecked = sub_menu_ids.includes(subMenuItem.id)

                                                return <div className='px-1' key={`sub-${subMenuItem.id}`}>
                                                <CustomInput
                                                    type='checkbox'
                                                    id={subMenuItem.id + 1000}
                                                    label={subMenuItem.name}
                                                    inline
                                                    onChange={(e) => e.preventDefault()}
                                                    disabled={!ischecked}
                                                    checked={ischecked}
                                                />

                                            </div>
                                            })
                                        }
                                    </Card>
                                </Col>
                                )
                            }
                        </Row>
                    </CardBody>
                </Card>
                }

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