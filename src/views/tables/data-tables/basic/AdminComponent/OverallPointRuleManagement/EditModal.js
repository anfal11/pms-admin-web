import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
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

const EditModal = ({ modal, toggleModal, overallPointRuleInfo, setoverallPointRuleInfo, setReset, resetData }) => {
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)

    const handleChange = (e) => {
        setoverallPointRuleInfo({ ...overallPointRuleInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // const { Id, PointRateSetupName, PurchaseAmount, Points, ExpiryDate, OfferRate, merchantid } = overallPointRuleInfo
        // let { OfferStartDate, OfferEndDate } = overallPointRuleInfo
        // localStorage.setItem('usePMStoken', true)
        // seteditPointRuleloading(true)
        // const merchantId = merchantid
        // if (!OfferRate) { 
        //     OfferStartDate = null 
        //     OfferEndDate = null
        //  }
        //  let ed
        // if (OfferRate === true) {
        //     ed = OfferEndDate
        // } else {
        //     ed = ExpiryDate
        // }
        // useJwt.updateOverallRule(merchantId, { rule_id:Id,  PointRateSetupName, PurchaseAmount, Points, ExpiryDate: ed, OfferRate, OfferStartDate, OfferEndDate }).then(res => {
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
                                <Label for="PointRateSetupName">Point Rate Setup Name</Label>
                                <Input type="text"
                                    name="PointRateSetupName"
                                    id='PointRateSetupName'
                                    value={overallPointRuleInfo.PointRateSetupName}
                                    onChange={handleChange}
                                    placeholder="write a name"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                             <FormGroup>
                                 <Label for="PurchaseAmount">Purchase Amount</Label>
                                 <Input type="number"
                                    name="PurchaseAmount"
                                    id='PurchaseAmount'
                                    value={overallPointRuleInfo.PurchaseAmount}
                                    onChange={handleChange}
                                    
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                             <FormGroup>
                                 <Label for="Points">Points</Label>
                                 <Input type="number"
                                    name="Points"
                                    id='Points'
                                    value={overallPointRuleInfo.Points}
                                    onChange={handleChange}
                                    
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col>
                        {!overallPointRuleInfo.OfferRate && <Col sm="6" >
                            <FormGroup>
                                 <Label for="ExpiryDate">Expiry Date</Label>
                                 <Input type="date"
                                    name="ExpiryDate"
                                    id='ExpiryDate'
                                    value={new Date(overallPointRuleInfo.ExpiryDate).toLocaleDateString('fr-CA')}
                                    onChange={handleChange}
                                    
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col>}
                        <Col sm="12" className='mb-1' >
                         <FormGroup>
                            <CustomInput
                                type='switch'
                                id='OfferRate'
                                name='OfferRate'
                                label='Offer Rate?'
                                checked={overallPointRuleInfo.OfferRate}
                                onChange={(e) => {
                                        if (e.target.checked) { 
                                            setoverallPointRuleInfo({ ...overallPointRuleInfo, OfferRate: true })
                                        } else {
                                            setoverallPointRuleInfo({ ...overallPointRuleInfo, OfferRate: false,  OfferStartDate: null, OfferEndDate: null  })
                                        }
                                    }
                                }
                            />
                         </FormGroup>
                        </Col>
                        { overallPointRuleInfo.OfferRate ? <Col sm="6" >
                             <FormGroup>
                                 <Label for="OfferStartDate">Offer Start Date</Label>
                                 <Input type="date"
                                    name="OfferStartDate"
                                    id='OfferStartDate'
                                    value={new Date(overallPointRuleInfo.OfferStartDate).toLocaleDateString('fr-CA')}
                                    onChange={handleChange}
                                    
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col> : null }
                        { overallPointRuleInfo.OfferRate ? <Col sm="6" >
                             <FormGroup>
                                 <Label for="OfferEndDate">Offer End Date</Label>
                                 <Input type="date"
                                    name="OfferEndDate"
                                    id='OfferEndDate'
                                    value={new Date(overallPointRuleInfo.OfferEndDate).toLocaleDateString('fr-CA')}
                                    onChange={handleChange}
                                    
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col> : null }

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