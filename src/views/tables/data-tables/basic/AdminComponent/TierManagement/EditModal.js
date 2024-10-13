import useJwt from '@src/auth/jwt/useJwt'
import { useState, useRef } from 'react'
import { Button, CustomInput, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const EditModal = ({ modal, toggleModal, tierInfo, setTierInfo, setReset, resetData, serviceList }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const serviceRef = useRef()
    const handleChange = (e) => {
        setTierInfo({ ...tierInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        seteditPointRuleloading(true)
        useJwt.updateTier({ ...tierInfo}).then(res => {
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
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={toggleModal}>Edit Tier</ModalHeader>
            <ModalBody>
            <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="tier">Tier Name<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="text"
                                name="tier"
                                id='tier'
                                value={tierInfo.tier}
                                onChange={handleChange}
                                required
                                placeholder="tier name"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="point_required">Required Point<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="number"
                                name="point_required"
                                id='point_required'
                                min={0}
                                value={tierInfo.point_required}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="num_of_transaction">Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="number"
                                name="num_of_transaction"
                                id='num_of_transaction'
                                min={0}
                                value={tierInfo.num_of_transaction}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="amount_of_transaction">Amount Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="number"
                                name="amount_of_transaction"
                                id='amount_of_transaction'
                                min={0}
                                value={tierInfo.amount_of_transaction}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="months">Months<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="number"
                                name="months"
                                id='months'
                                min={0}
                                value={tierInfo.months}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="4" ></Col>
                    <Col sm="3" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Is Service Type?'
                                    id='is_service_type'
                                    checked={tierInfo.is_service_type}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, is_service_type: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, is_service_type: false, service_type: '' })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                        {
                            tierInfo.is_service_type && <Col sm="4" >
                                <FormGroup>
                                    <Label for="serviceId">Service Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={serviceRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: tierInfo.service_type, label: serviceList.find(s => parseInt(s.serviceId) === parseInt(tierInfo.service_type))?.serviceKeyword || 'select...'}}
                                        onChange={(selected) => {
                                            setTierInfo({ ...tierInfo, service_type: selected.value})
                                        }}
                                        options={serviceList?.map(d => { return {value: d.serviceId, label: d.serviceKeyword} })}
                                        isLoading={serviceList.length === 0}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => serviceRef.current.select.focus()}
                                        value={tierInfo.service_type || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                    <Col sm="4" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Is Point Required?'
                                    id='is_point_required'
                                    checked={tierInfo.is_point_required}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, is_point_required: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, is_point_required: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                    <Col sm="4" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Is Number Of Transaction?'
                                    id='is_num_of_transaction'
                                    checked={tierInfo.is_num_of_transaction}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, is_num_of_transaction: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, is_num_of_transaction: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                    <Col sm="4" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Is Amount Of Transaction?'
                                    id='is_amount_of_transaction'
                                    checked={tierInfo.is_amount_of_transaction}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, is_amount_of_transaction: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, is_amount_of_transaction: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                    <Col sm="4" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Is Month Sustained?'
                                    id='is_month_sustained'
                                    checked={tierInfo.is_month_sustained}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, is_month_sustained: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, is_month_sustained: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                    <Col sm="4" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Status'
                                    id='status'
                                    checked={tierInfo.status}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, status: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, status: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                    <Col sm="4" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Frequency'
                                    id='frequency'
                                    checked={tierInfo.frequency}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setTierInfo({ ...tierInfo, frequency: true })
                                        } else {
                                            setTierInfo({ ...tierInfo, frequency: false })
                                        }
                                    }
                                    }
                                />
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