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

const EditModal = ({ modal, toggleModal, pointRuleInfo, setPointRuleInfo, setReset, resetData }) => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [error, seterror] = useState({
        email: false
    })

    const handleChange = (e) => {
        setPointRuleInfo({ ...pointRuleInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // const { Id, SKUAmount, SKUPoints, SKUStartRange, SKUEndRange, IsRange } = pointRuleInfo
        // localStorage.setItem('usePMStoken', true)
        // seteditPointRuleloading(true)
        // const merchantId = BusinessList[0].pms_merchantid
        // let tempSkuAmounts = 0
        // if (!IsRange) { tempSkuAmounts = SKUAmount }
        // useJwt.updateMyRule(merchantId, { rule_id:Id, skuamount:tempSkuAmounts, skupoints:SKUPoints, skustartrange:SKUStartRange, skuendrange:SKUEndRange, isrange:IsRange, createdby: user.id }).then(res => {
        //     setReset(!resetData)
        //     seteditPointRuleloading(false)
        //     console.log(res)
        //     toggleModal()
        //     Success(res)
        // }).catch(err => {
        //     seteditPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Error(err)
        //     console.log(err)
        // })
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Edit Point Rule</ModalHeader>
            <ModalBody>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="SKUPoints">SKU Points</Label>
                            <Input type="number"
                                name="SKUPoints"
                                id='SKUPoints'
                                value={pointRuleInfo.SKUPoints}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="12" className='mb-1' >
                            <FormGroup check>
                                <Input onChange={(e) => {
                                        if (e.target.checked) { 
                                            setPointRuleInfo({ ...pointRuleInfo, IsRange: true })
                                        } else {
                                            setPointRuleInfo({ ...pointRuleInfo, IsRange: false })
                                        }
                                    }
                                } type='checkbox' id='viaEmail' checked={pointRuleInfo.IsRange}/>
                                <Label for='viaEmail' check>
                                    Is Range
                                </Label>
                            </FormGroup>
                        </Col>
                    {pointRuleInfo.IsRange ?  <Col sm="6" >
                                <FormGroup>
                                    <Label for="SKUStartRange">SKU Start Range</Label>
                                    <Input type="number"
                                        name="SKUStartRange"
                                        id='SKUStartRange'
                                        value={pointRuleInfo.SKUStartRange}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col> : null}
                    { pointRuleInfo.IsRange ? <Col sm="6" >
                                <FormGroup>
                                    <Label for="SKUEndRange">SKU End Range</Label>
                                    <Input type="number"
                                        name="SKUEndRange"
                                        id='SKUEndRange'
                                        value={pointRuleInfo.SKUEndRange}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col> : null}
                    {pointRuleInfo.IsRange ? null : <Col sm="6" >
                            <FormGroup>
                                <Label for="SKUAmount">SKU Amount</Label>
                                <Input type="number"
                                    name="SKUAmount"
                                    id='SKUAmount'
                                    value={pointRuleInfo.SKUAmount}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                    }

                    <Col sm="12" className='text-center'>
                        {
                            editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    )
}
export default EditModal