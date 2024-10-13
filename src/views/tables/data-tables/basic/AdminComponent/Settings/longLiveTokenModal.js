import { Fragment, useState, useEffect, useRef } from 'react'
import {
    X, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const LongLiveTokenModal = ({ modal, toggleModal, setReset, resetData }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [user_token, setToken] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        seteditPointRuleloading(true)
        useJwt.updatelongLiveToken({ user_token }).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(false)
            console.log(res)
            toggleModal()
            Success(res)
        }).catch(err => {
            seteditPointRuleloading(false)
            Error(err)
            console.log(err.response)
        })
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Update Token</ModalHeader>
            <ModalBody>
                <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Row>
                    <Col sm='12'>
                        <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Update Facebook User Token</CardTitle>
                        </CardHeader>
                        <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="12" >
                                    <FormGroup>
                                        <Label for="user_token">User Token</Label>
                                        <Input type="textarea"
                                            name="user_token"
                                            id="user_token"
                                            onChange={e => setToken(e.target.value)}
                                            required
                                            placeholder="user token..."
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>

                    <Col sm="12" className='text-center'>
                        {
                            editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Update</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    )
}
export default LongLiveTokenModal