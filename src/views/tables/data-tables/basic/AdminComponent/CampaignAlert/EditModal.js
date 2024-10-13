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

const EditModal = ({ modal, toggleModal, campaignAlertInfo, setCampaignAlertInfo, setReset, resetData, campaignList }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [emailReqMsg, setEmailReqMsg] = useState(false)
    const RuleRef = useRef()
    const onSubmit = (e) => {
        e.preventDefault()
        seteditPointRuleloading(true)
        useJwt.updateCampaignAlert(campaignAlertInfo).then(res => {
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
            <ModalHeader toggle={toggleModal}>Edit Campaign Alert</ModalHeader>
            <ModalBody>
            <Form className="row" style={{ width: '100%', marginTop:'15px' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="4" >
                        <FormGroup>
                            <Label for="groups">Select Campaign<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                id='group'
                                classNamePrefix='select'
                                value={{ value: campaignAlertInfo.campaign_id, label: campaignList.find(rl => rl.id === parseInt(campaignAlertInfo.campaign_id))?.campaignName || 'select...' }}
                                onChange={(selected) => {
                                    setCampaignAlertInfo({ ...campaignAlertInfo, campaign_id: selected.value })
                                }}
                                options={campaignList?.map(rl => { return { value: rl.id, label: rl.campaignName } })}
                                ref={RuleRef}
                            />
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                    // position: "absolute"
                                }}
                                onFocus={e => RuleRef.current.select.focus()}
                                value={campaignAlertInfo.campaign_id || ''}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                            <FormGroup>
                                <Label for="keyword">Email<span style={{ color: 'red' }}>*</span></Label>
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
                                            <Button style={{ zIndex: '0' }} color='primary' outline onClick={() => {
                                                if (keyword) {
                                                    setCampaignAlertInfo({ ...campaignAlertInfo, email: [...campaignAlertInfo.email, keyword] })
                                                    setKeyword('')
                                                    setEmailReqMsg(false)
                                                }
                                            }}>
                                                Add
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                {emailReqMsg && <span style={{ fontSize: '12px', color: 'red' }}>This is a required field!</span>}
                                <div className='d-flex mt-1 flex-wrap'>
                                    {campaignAlertInfo.email?.map((k, index) => <InputGroup key={index} style={{ width: '250px', marginBottom: '10px', marginRight: '10px' }}>
                                        <InputGroupAddon addonType='prepend'>
                                            <Button style={{ width: '35px', padding: '5px' }} color='primary' outline onClick={() => {
                                                campaignAlertInfo.email.splice(campaignAlertInfo.email.indexOf(k), 1)
                                                setCampaignAlertInfo({ ...campaignAlertInfo, email: [...campaignAlertInfo.email] })
                                            }}>
                                                <X size={12} />
                                            </Button>
                                        </InputGroupAddon>
                                        <Input type="text"
                                            name="keyword"
                                            id='keyword'
                                            style={{ fontSize: '12px', padding: '5px' }}
                                            value={k}
                                            disabled
                                            onChange={() => { }}
                                        />
                                    </InputGroup>)}
                                </div>
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