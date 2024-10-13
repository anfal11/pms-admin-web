import { Fragment, useState, useEffect, useRef } from 'react'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import {CURRENCY_SYMBOL} from '../../../../../../Configurables'

const EditModal = ({ username, modal, toggleModal, serviceLogicInfo, setserviceLogicInfo, serviceInfo, setserviceInfo, setReset, resetData }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [keyword, setKeyword] = useState('')

    const handleChange = (e) => {
        setserviceInfo({ ...serviceInfo, [e.target.name]: e.target.value })
    }
    const handleChange1 = (e) => {
        setserviceLogicInfo({ ...serviceLogicInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const { id : sid, service_id, service_keyword, is_sub_category, sub_types, keyword_description } = serviceInfo

        seteditPointRuleloading(true)
        useJwt2.updateServiceKeyword({
            serviceId: service_id,  
            serviceKeyword: service_keyword.toLowerCase(), 
            keywordDesc: keyword_description, 
            isSubCategory: is_sub_category, 
            subTypes: sub_types, 
            action_by: username,
            minimum: serviceLogicInfo.minimum || 0,
            maximum: serviceLogicInfo.maximum || 999999,
            is_financial: serviceLogicInfo.is_financial || false
        }).then(res => { 
            setReset(!resetData)
            toggleModal()
            Success(res)
        }).catch(err => {
            Error(err)
        }).finally(() => {
            seteditPointRuleloading(false)
        })
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Edit Service</ModalHeader>
            <ModalBody>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    {/* <Col sm="6" >
                        <FormGroup>
                            <Label for="serviceId">Service ID</Label>
                            <Input type="number"
                                name="serviceId"
                                id='serviceId'
                                value={serviceInfo.service_id}
                                onChange={handleChange}
                                disabled
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col> */}
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="serviceKeyword">Service Keyword</Label>
                            <Input type="text"
                                name="serviceKeyword"
                                id='serviceKeyword'
                                value={serviceInfo?.service_keyword}
                                onChange={handleChange}
                                required
                                placeholder="keyword"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="keywordDesc">Keyword Description<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="text"
                                name="keyword_description"
                                id='keywordDesc'
                                value={serviceInfo.keyword_description || ""}
                                onChange={handleChange}
                                required
                                placeholder="description"
                            />
                        </FormGroup>
                    </Col>
                    {/* <Col sm="12" className='mt-1'>
                        <FormGroup>
                           <CustomInput 
                            type='switch'
                            label='Allow subtype?'
                            id = 'is_sub_category'
                            checked = {serviceInfo?.is_sub_category}
                            onChange={(e) => {
                                if (e.target.checked) { 
                                    setserviceInfo({ ...serviceInfo, is_sub_category: true })
                                } else {
                                    setserviceInfo({ ...serviceInfo, is_sub_category: false, subTypes: [] })
                                }
                            }
                         }
                           />
                        </FormGroup>
                    </Col> */}
                    {/* {
                        serviceInfo.is_sub_category && <Col sm="12" >
                        <FormGroup>
                            <Label for="keyword">Subtypes</Label>
                            <div className='d-flex align-items-center'>
                                <InputGroup>
                                    <Input type="text"
                                        name="keyword"
                                        id='keyword'
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)}
                                        placeholder="your answer"
                                    />
                                    <InputGroupAddon addonType='append'>
                                        <Button style={{zIndex:'0'}} color='primary' outline onClick={() => {
                                            if (keyword) {
                                                setserviceInfo({ ...serviceInfo, sub_types: [...serviceInfo.sub_types, keyword] }) 
                                                setKeyword('')
                                            }
                                        }}>
                                            Add
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div className='d-flex mt-1'>
                                {serviceInfo.sub_types?.map((k, index) =>  <InputGroup key={index} style={{width:'100px', marginRight:'10px'}}>
                                    <InputGroupAddon addonType='prepend'>
                                        <Button style={{width:'35px', padding:'5px'}} color='primary' outline onClick={() => {
                                            serviceInfo.sub_types.splice(serviceInfo.sub_types.indexOf(k), 1)
                                            setserviceInfo({ ...serviceInfo, sub_types: [...serviceInfo.sub_types] })
                                        }}>
                                            <X size={12} />
                                        </Button>
                                    </InputGroupAddon>
                                    <Input type="text"
                                        name="keyword"
                                        id='keyword'
                                        style={{fontSize:'10px', padding:'5px'}}
                                        value={k}
                                        disabled
                                        onChange={() => {}}
                                    />
                                </InputGroup>)}
                            </div>
                        </FormGroup>
                    </Col>
                    } */}
                    <Col sm='12'>
                        <p>Service Logic Info</p>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="minimum">MIN TXN Amount({CURRENCY_SYMBOL})</Label>
                            <Input type="number"
                                name="minimum"
                                id='minimum'
                                value={serviceLogicInfo?.minimum || 0}
                                onChange={handleChange1}
                                max='999999'
                                required
                                placeholder= '0'
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="maximum">MAX TXN Amount({CURRENCY_SYMBOL})</Label>
                            <Input type="number"
                                name="maximum"
                                id='maximum'
                                value={serviceLogicInfo?.maximum || 999999}
                                onChange={handleChange1}
                                max='999999'
                                required
                                placeholder="0"
                                onWheel={(e) => e.target.blur()}

                            />
                        </FormGroup>
                    </Col>
                    {/* <Col sm="6" >
                        <FormGroup>
                            <Label for="senGroupType">Sender Group Type</Label>
                            <Input type="text"
                                name="senGroupType"
                                id='senGroupType'
                                value={[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === serviceLogicInfo?.senGroupType)?.label}
                                onChange={handleChange1}
                                disabled
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="recGroupType">Receiver Group Type</Label>
                            <Input type="text"
                                name="recGroupType"
                                id='recGroupType'
                                value={[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === serviceLogicInfo?.recGroupType)?.label}
                                onChange={handleChange1}
                                disabled
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="ruleProvider">Reward Priority</Label>
                            <Input type="text"
                                name="ruleProvider"
                                id='ruleProvider'
                                value={serviceLogicInfo?.ruleProvider === 's' ? 'Sender' : serviceLogicInfo?.ruleProvider === 'r' ? 'Reciever' : ''}
                                onChange={handleChange1}
                                disabled
                            />
                        </FormGroup>
                    </Col> */}
                    <Col sm="12" >
                            <FormGroup check>
                                <Input 
                                    onChange={(e) => {
                                            if (e.target.checked) { 
                                                setserviceLogicInfo({ ...serviceLogicInfo, is_financial: true })
                                            } else {
                                                setserviceLogicInfo({ ...serviceLogicInfo, is_financial: false })
                                            }
                                        }
                                    } 
                                    type='checkbox' 
                                    id='isFinancial' 
                                    checked = {serviceLogicInfo?.is_financial}
                                />
                                <Label for='isFinancial' check> Is Financial? </Label>
                            </FormGroup>
                        </Col>
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
export default EditModal