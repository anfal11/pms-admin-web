import { Fragment, useState, useEffect } from 'react'
import { Card, CardHeader,  Modal, ModalHeader, ModalBody, Spinner, CardTitle, CardBody, Row, Col, CustomInput  } from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'

const ViewModal = ({ menuSubmenus, modal, toggleModal, userInfo}) => {

const [ismenuloading, setmenuloading] = useState(true)
const [featureIDs, setFeatureIDs] = useState([])
const [sub_menu_ids, setSubmenuIDs] = useState([])

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
    }
}, [userInfo['roleid']])

    return (
        <Modal size="xl" isOpen={modal} toggle={toggleModal} >
            <ModalHeader toggle={toggleModal}>User Details</ModalHeader>
            <ModalBody>
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

            </ModalBody>
        </Modal>
    )
}
export default ViewModal