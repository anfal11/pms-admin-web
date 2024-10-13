import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useState, useEffect  } from 'react'
import { ChevronRight } from 'react-feather'
import { Card, CardBody, Col, CustomInput, Row, Spinner, Button, Form } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error, Success } from '../../viewhelper'
const MySwal = withReactContent(Swal)

const ListView = ({ TableDataLoading, setTableDataLoading, roleList, history, setRefresh, refresh, allMenuList }) => {
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [selectedRole, setSelectedRole] = useState([])
    const [approvedList, setApprovedList] = useState([])
    const [oldassignrolelist, setoldassignrolelist] = useState([])
    const [userInput, setUserInput] = useState(
        {
            module_id: '',
            role_id: []
        }
    )

    const handleSelectedMenu = (menuId) => {
        const firstMenuAssignRoles = []
        setSelectedMenu(menuId)
        approvedList.map(item => {
            if (item['module_id'] === menuId) {
                firstMenuAssignRoles.push(item['role_id'])
            }
        })
        setUserInput(prevUserInput => ({
            module_id: menuId,
            role_id: firstMenuAssignRoles
        }))

    }

    useEffect(() => {

        let firstMenuId = 0

        if (allMenuList.length) {
            firstMenuId = allMenuList[0]['id']
            console.log('firstMenuId ', firstMenuId)
            handleSelectedMenu(firstMenuId)
        }
        console.log(' allMenuList ', allMenuList.length)

   }, [allMenuList])


    useEffect(() => {

        let firstMenuId = 0
        const firstMenuAssignRoles = []

        if (allMenuList.length) {
            firstMenuId = allMenuList[0]['id']
            console.log('firstMenuId ', firstMenuId)
        }
        console.log(' allMenuList ', allMenuList.length)

       useJwt.roleBasedApprovedList()
           .then(res => {
              const apprvlist = res.data.payload
               setApprovedList(apprvlist)
               console.log('res ', res.data)

               setSelectedMenu(firstMenuId)
               apprvlist.map(item => {
                   if (item['module_id'] === firstMenuId) {
                       firstMenuAssignRoles.push(item['role_id'])
                   }
               })
               setUserInput(prevUserInput => ({
                   module_id: firstMenuId,
                   role_id: firstMenuAssignRoles
               }))
               
           })
           .catch(err => {
               console.error(err)
           })
   }, [allMenuList, refresh])


    const handleRoleSelection = (roleId) => {
        console.log('roleId ', roleId)
        const oldRoleList = userInput.role_id
        setSelectedRole(prevSelectedRole => [...prevSelectedRole, roleId])

        const index = oldRoleList.indexOf(roleId)
        if (index > -1) { // only splice array when item is found
            oldRoleList.splice(index, 1) // 2nd parameter means remove one item only
        } else {
            oldRoleList.push(roleId)
        }

        setUserInput(prevUserInput => ({
            ...prevUserInput,
            role_id: [...oldRoleList]
        }))
    }
    const handleUpdate = (e) => {
        e.preventDefault()
        if (userInput.module_id === '') {
            Error({response: {status: 400, data:{ message: "Please select a module."}}})
            return 0
        }
        // if (userInput.role_id.length === 0) {
        //     Error({response: {status: 400, data:{ message: "Please select a role."}}})
        //     return 0
        // }
        setTableDataLoading(true)
        useJwt.roleBasedUpdate(userInput).then((res) => {
            setTableDataLoading(false)
            Success(res)
            // setSelectedRole([])
            // setUserInput({
            //     module_id: '',
            //     role_id: []
            // })
            // setSelectedMenu(null)
            setRefresh(!refresh)

        }).catch((error) => {
            setTableDataLoading(false)
            Error(error)
            console.log(error.response)
        })

    }

    console.log('userInput ', userInput)

    return (
        <Fragment>
            <Form onSubmit={handleUpdate} >
                <Card>
                    <CardBody>
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
                                <div style={{ display: 'flex', flexWrap: 'wrap', padding: '20px', border: '1px solid #B2BEB5' }}>
                                    {
                                        roleList.length !== 0 ? roleList.map(item => <div key={item.id} style={{cursor: 'pointer'}}>
                                            <CustomInput
                                                className='mr-3'
                                                type='checkbox'
                                                id={`id${item.id}`}
                                                label={item.role_name}
                                                inline
                                                checked = {userInput.role_id.includes(item.id)}
                                                onChange={() => handleRoleSelection(item.id)}
                                            />
                                        </div>) : <Spinner />
                                    }
                                </div>
                            </Col>
                            <Col sm="12" className='text-right'>
                                {
                                    TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                        <span >Update</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default ListView