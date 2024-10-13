import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { divIcon } from 'leaflet'

const CreateComplain = () => {
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [selectRuleProvider, setRuleProvider] = useState({})
    const [file, setFile] = useState(null)
    const [filePrevw, setFilePrevw] = useState(null)
    const [userInput, setUserInput] = useState({
        complain_title: '',
        complain_description: '',
        complain_priority: '',
        image_url: '',
        category: ''
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
  
    const onSubmit = async (e) => {
        e.preventDefault()
        setPointRuleloading(true)
        let { image_url } = userInput
        const formData = new FormData()
        formData.append('image', file)
        await useJwt.singleFileupload(formData)
            .then(res => {
                console.log(res)
                image_url = res.data.payload
            }).catch(err => {
                console.log(err.response)
                Error(err)
            })

        useJwt.createComplain({ ...userInput, image_url }).then((response) => {
            setPointRuleloading(false)
            console.log(response)
            Success(response)
          }).catch((error) => {
            Error(error)
            setPointRuleloading(false)
            console.log(error)
          })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/complainList' >
                    <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                    </div>
                    </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Create Complain</CardTitle>
                    
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col sm="4" >
                            <FormGroup>
                                <Label for="ruleProvider">Complain Category</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: userInput.category, label: userInput.category ? userInput.category : 'select a category'}}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, category: selected.value })
                                    }}
                                    options={[{value: 'category_1', label: 'category_1'}, {value: 'category_2', label: 'category_2'}]}
                                />
                            </FormGroup>
                        </Col> 
                    <Col sm="4" >
                            <FormGroup>
                                <Label for="ruleProvider">Priority</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: userInput.complain_priority, label: userInput.complain_priority ? userInput.complain_priority : 'select a priority'}}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, complain_priority: selected.value })
                                    }}
                                    options={[{value: 'major', label: 'major'}, {value: 'high', label: 'high'}, {value: 'general', label: 'general'}]}
                                />
                            </FormGroup>
                        </Col> 
                    <Col sm="4" >  </Col> 
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="complain_title">Complain Title</Label>
                            <Input type="text"
                                name="complain_title"
                                id='complain_title'
                                value={userInput.complain_title}
                                onChange={handleChange}
                                required
                                placeholder="your title..."
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="12" >
                        <FormGroup>
                            <Label for="complain_description">Complain Description</Label>
                            <Input type="textarea"
                                name="complain_description"
                                id='complain_description'
                                value={userInput.complain_description}
                                onChange={handleChange}
                                required
                                placeholder="description here..."
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12' >
                        <Label for="voucherImage">Complain Image</Label>
                        <div className='d-flex'>
                            {filePrevw && <img src={filePrevw} alt='voucher img' height='100px' className="mr-2"></img>}
                            <div className="file position-relative overflow-hidden">
                                <div className='text-center p-1' style={{
                                    height: '102px',
                                    width: '102px',
                                    border: '1px dashed #d9d9d9',
                                    backgroundColor: "#fafafa"
                                }}>
                                    <span ><Plus size={20} className='my-1' /></span> <br />
                                    <span>Upload</span>
                                </div>
                                <Input
                                    // style={{ width: '300px' }}
                                    style={{
                                        position: 'absolute',
                                        opacity: '0',
                                        left: '0',
                                        top: '0',
                                        height: '102px',
                                        width: '102px',
                                        cursor: 'pointer'
                                    }}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    required
                                    name="voucherImage"
                                    id='voucherImage'
                                    onChange={e => {
                                        if (e.target.files.length !== 0) {
                                            setFilePrevw(URL.createObjectURL(e.target.files[0]))
                                        }
                                        setFile(e.target.files[0])
                                    }}
                                />
                            </div>
                        </div>
                    </Col>

                        <Col sm="12" className='text-center'>
                            {
                                pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span >Submit</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default CreateComplain