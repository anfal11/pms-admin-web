import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const EditModal = ({ modal, toggleModal, notificationInfo, setnotificationInfo, setReset, resetData }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)

  /*   const handleChange = (e) => {
        setnotificationInfo({ ...notificationInfo, [e.target.name]: e.target.value })
    } */

    /* const onSubmit = (e) => {
        e.preventDefault()
        const { Id, SKUAmount, SKUPoints, SKUStartRange, SKUEndRange, IsRange } = notificationInfo
        localStorage.setItem('usePMStoken', true)
        seteditPointRuleloading(true)
        const merchantId = BusinessList[0].pms_merchantid
        let tempSkuPoints = 0
        if (!IsRange) { tempSkuPoints = SKUPoints }
        useJwt.updateMyRule(merchantId, { rule_id:Id, skuamount:SKUAmount, skupoints:tempSkuPoints, skustartrange:SKUStartRange, skuendrange:SKUEndRange, isrange:IsRange }).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(false)
            console.log(res)
            toggleModal()
            Success(res)
        }).catch(err => {
            seteditPointRuleloading(false)
            localStorage.setItem('usePMStoken', false)
            Error(err)
            console.log(err)
        })
    } */
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Notification Details</ModalHeader>
            <ModalBody>
                <Form className="row" style={{ width: '100%' }} /* onSubmit={onSubmit} */ autoComplete="off">
                    <Col sm="12" >
                        <FormGroup>
                            <Label for="Notification_Title">Title</Label>
                            <Input type="text"
                                name="Notification_Title"
                                id='Notification_Title'
                                value={notificationInfo.Notification_Title}
                                /* onChange={handleChange} */
                                disabled
                                placeholder="your title"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="12" >
                        <FormGroup>
                            <Label for="Notification_Body">Message</Label>
                            <Input type="textarea"
                                name="Notification_Body"
                                id='Notification_Body'
                                value={notificationInfo.Notification_Body}
                                /* onChange={handleChange} */
                                disabled
                                placeholder="your message"
                            />
                        </FormGroup>
                    </Col>

                   {/*  <Col sm="12" className='text-center'>
                        {
                            editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col> */}
                </Form>
            </ModalBody>
        </Modal>
    )
}
export default EditModal