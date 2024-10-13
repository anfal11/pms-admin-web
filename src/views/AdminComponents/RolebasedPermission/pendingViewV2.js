import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useState, useEffect  } from 'react'
import { ChevronRight } from 'react-feather'
import { Card, CardBody, Col, CustomInput, Row, Spinner, Button, Form } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error, Success } from '../../viewhelper'
const MySwal = withReactContent(Swal)

const ListView = ({ TableDataLoading, setTableDataLoading, roleList, history, setRefresh, refresh }) => {
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [selectedRole, setSelectedRole] = useState([])
    const [approvedList, setApprovedList] = useState([])
    const [oldassignrolelist, setoldassignrolelist] = useState([])
    const [allMenuList, setallMenuList] = useState([])
    const [ApproveLoading, setApproveLoading] = useState(false)
    const [RejectLoading, setRejectLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [otherObj, setotherObj] = useState({
        created_by: "",
        created_at: null
    })
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))

    const [userInput, setUserInput] = useState(
        {
            module_id: '',
            role_id: []
        }
    )

    const handlePoPupActions = (id, status) => {
        return Swal.fire({
            title: `Are you sure?`,
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
                    module_id:id,
                    action:status
                }
                // if (status === 'approve') {
                //     //setApproveLoading(true)

                // } else {
                //     //setRejectLoading(true)
                // }

                return useJwt.roleBasedAction(data).then(res => {
                    Success(res)
                    console.log(res)
                    //setOthersPendingMenu(othersPendingMenu.filter(x => x.id !== id))
                    setRefresh(!refresh)
                    // setReset(!reset)

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
    const handleSelectedMenu = (menuId) => {
        console.log('call handleSelectedMenu ')
        const firstMenuAssignRoles = [], Oobj = { created_by: "", created_at: null }
        setSelectedMenu(menuId)
        console.log('approvedList approvedList ', approvedList)
        approvedList.map(item => {
            if (item['module_id'] === menuId) {
                firstMenuAssignRoles.push(item['role_id'])
                Oobj['created_by'] = item['created_by']
                Oobj['created_at'] = item['created_at']
            }
        })
        setUserInput(prevUserInput => ({
            module_id: menuId,
            role_id: firstMenuAssignRoles
        }))
        setotherObj(Oobj)

    }
    useEffect(() => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)
        setIsLoading(true)
        useJwt.roleBasedPending().then(res => {
            // setaddUserloading(false)
            console.log('getAdminMenuSubmenuList', res)
            const array = res.data.payload, Oobj = { created_by: "", created_at: null }
            const arrayUniqueByKey = [...new Map(array.map(item => [item['module_id'], item])).values()]

            const moduleRoleMaps = arrayUniqueByKey.map(item => {
                return {
                    id: item['module_id'],
                    name: item['module']['module_name']
                }
            })
            setallMenuList(prevInput => (moduleRoleMaps))
            setApprovedList(prevInput => (array))

            if (moduleRoleMaps.length) {
                const firstMenuAssignRoles = [], menuId = moduleRoleMaps[0]['id']
                setSelectedMenu(menuId)
                console.log('approvedList approvedList ', approvedList)
                array.map(item => {
                    if (item['module_id'] === menuId) {
                        firstMenuAssignRoles.push(item['role_id'])
                        Oobj['created_by'] = item['created_by']
                        Oobj['created_at'] = item['created_at']
                    }
                })
                setUserInput(prevUserInput => ({
                    module_id: menuId,
                    role_id: firstMenuAssignRoles
                }))

                setotherObj(Oobj)
            }
            
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            Error(err)
            console.log(err)
        })
    }, [refresh])

    const handleRoleSelection = (roleId) => {
        setSelectedRole(prevSelectedRole => [...prevSelectedRole, roleId])

        setUserInput(prevUserInput => ({
            ...prevUserInput,
            role_id: [...prevUserInput.role_id, roleId]
        }))
    }

    return (
        <Fragment>
            <Form  >
                <Card>
                    <CardBody>
                        {
                            !isLoading && !allMenuList.length ? null : <Fragment>

                                <Row>
                                    <Col sm='6' style={{ padding: '20px 30px' }}>
                                        {
                                            allMenuList?.length !== 0 ? allMenuList?.map(item => <div key={item.id} style={{ padding: '20px', border: '1px solid #B2BEB5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: selectedMenu === item.id ? '#e1f3ff' : 'transparent', cursor: 'pointer' }}
                                                onClick={() => handleSelectedMenu(item.id)}
                                            >
                                                <h5 className='m-0'>{item?.name}</h5>
                                                <ChevronRight />
                                            </div>) : <Spinner />
                                        }
                                    </Col>
                                    <Col sm='6' style={{ padding: '20px 30px 0 0px' }}>
                                        <div style={{flexWrap: 'wrap', padding: '20px', border: '1px solid #B2BEB5' }}>
                                      
                                        <div style={{textAlign: 'right'}}>
                                            <p style={{margin: 0}}><b>Created By:</b> {otherObj.created_by}</p>
                                            <p><b>Created At:</b> {otherObj.created_at}</p>
                                        </div>

                                            <div>
                                            {
                                                roleList.length !== 0 ? roleList.map(item => <div>
                                                    <CustomInput
                                                        className='mr-3'
                                                        type='checkbox'
                                                        id={`id${item.id}`}
                                                        label={item.role_name}
                                                        inline
                                                        checked = {userInput.role_id.includes(item.id)}
                                                        onChange={() => handleRoleSelection(item.id)}
                                                        disabled = {true}
                                                    />
                                                </div>) : <Spinner />
                                            }
                                            </div>
                                        </div>
                                    </Col>

                                    {
                                        otherObj.created_by !== userData['username'] ? <Col sm="12" className='text-right'>
                                        {
                                            ApproveLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                                <Spinner color='white' size='sm' />
                                                <span className='ml-50'>Loading...</span>
                                            </Button.Ripple> : <Button.Ripple disabled = { ApproveLoading || RejectLoading } className='ml-2' color='primary' onClick={() => { handlePoPupActions(selectedMenu, 'approve') }} style={{ marginTop: '25px' }}>
                                                <span >Approve</span>
                                            </Button.Ripple>
                                            
                                        }

                                        {
                                            RejectLoading ? <Button.Ripple color='danger' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                                <Spinner color='white' size='sm' />
                                                <span className='ml-50'>Loading...</span>
                                            </Button.Ripple> : <Button.Ripple disabled = { ApproveLoading || RejectLoading } className='ml-2' color='danger'  onClick={(e) => { handlePoPupActions(selectedMenu, 'reject') }} style={{ marginTop: '25px' }}>
                                                <span >Reject</span>
                                            </Button.Ripple>
                                            
                                        }
                                    </Col> : null
                                    }
                                    
                                </Row>

                            </Fragment>
                        }
                       

                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default ListView