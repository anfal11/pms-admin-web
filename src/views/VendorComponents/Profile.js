import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, User
} from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
    Label,
    Row,
    Col,
    Badge,
    Form,
    FormGroup,
    UncontrolledDropdown,
    CardBody,
    CustomInput,
    Table,
    Spinner,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    FormFeedback,
    Progress
} from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BusinessFormValidation } from '../formvalidation'

import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'

import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import 'antd/dist/antd.css'

import { Tag, Skeleton } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../viewhelper'


const ViewBusiness = (props) => {
    const { businessid } = useParams()
    const history = useHistory()
    const [CallEffect, setCallEffect] = useState(true)
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [business_id, setbusiness_id] = useState(JSON.parse(localStorage.getItem('customerBusinesses'))[0].id)
    const [viewinput, setviewinput] = useState({})
    const [loading, setloading] = useState(true)
    const [businessmarketingpref, setbusinessmarketingpref] = useState([])
    const [businesstagmap, setbusinesstagmap] = useState([])
    const [customercomment, setcustomercomment] = useState([])
    const [customerbusinesstypemap, setcustomerbusinesstypemap] = useState([])
    const [fileuploadinformaton, setfileuploadinformaton] = useState([])
    const [symblegroup, setsymblegroup] = useState('')
    const [storeinfo, setstoreinfo] = useState({
        storename: ''
    })
    const [storesizeinfo, setstoresizeinfo] = useState({
        statusdesc: ''
    })

    const getTimeStampToDateTime = str => {
        const date = new Date(str)
        return `${date.toDateString()} ${date.toLocaleTimeString()}`
    }
    //api fetching start..
    useEffect(async () => {

        // const business_id = JSON.parse(localStorage.getItem('customerBusinesses'))[0].id
        //store list..
        useJwt.customerBusinessDetails({ businessid: business_id }).then(async res => {
            const payload1 = res.data.payload, fileinfo = []
            let i = 0
            const { customerbusinesstypemap = [],
                businessmarketingpref = [],
                businesstagmap = [],
                customercomment = [],

                EOIDDOC,
                eoiddoc_uploadedby,
                eoiddoc_uploadedtime,

                FIDDOC,
                fiddoc_uploadedby,
                fiddoc_uploadedtime,

                companyregdoc,
                companyregdoc_uploadedby,
                companyregdoc_uploadedtime,

                personaliddoc,
                personaliddoc_uploadedby,
                personaliddoc_uploadedtime,

                vatdoc,
                vatdoc_uploadedby,
                vatdoc_uploadedtime,

                others_doc,
                othersdoc_uploadedby,
                othersdoc_uploadedtime,

                storeinfo,
                storesizeinfo,

                memberofsymbolgroup

            } = payload1
            console.log(payload1)
            // symbol list setvatexempt 
            await useJwt.useSymbolGroup().then(res => {

                res.data.payload.every(x => {
                    if (x.id === memberofsymbolgroup) {
                        setsymblegroup(x.statusdesc)
                        return false
                    }
                    return true
                })
            })

            setloading(false)
            setviewinput(payload1)
            setbusinesstagmap(businesstagmap)
            setcustomercomment(customercomment)
            setcustomerbusinesstypemap(customerbusinesstypemap)
            setbusinessmarketingpref(businessmarketingpref)
            setstoreinfo(storeinfo)
            setstoresizeinfo(storesizeinfo)
            if (EOIDDOC) {
                const filenameaplitarr = EOIDDOC.split('/')
                fileinfo[i++] = {
                    file: 'Economic Operator ID',
                    name: filenameaplitarr[filenameaplitarr.length - 1],
                    uploadby: eoiddoc_uploadedby,
                    uploaddatetime: eoiddoc_uploadedtime ? getTimeStampToDateTime(eoiddoc_uploadedtime) : null,
                    perview: EOIDDOC
                }
            }

            if (FIDDOC) {
                const filenameaplitarr = FIDDOC.split('/')
                fileinfo[i++] = {
                    file: 'Facility ID',
                    name: filenameaplitarr[filenameaplitarr.length - 1],
                    uploadby: fiddoc_uploadedby,
                    uploaddatetime: fiddoc_uploadedtime ? getTimeStampToDateTime(fiddoc_uploadedtime) : null,
                    perview: FIDDOC
                }
            }

            if (companyregdoc) {
                const filenameaplitarr = companyregdoc.split('/')
                fileinfo[i++] = {
                    file: 'Company Documents',
                    name: filenameaplitarr[filenameaplitarr.length - 1],
                    uploadby: companyregdoc_uploadedby,
                    uploaddatetime: companyregdoc_uploadedtime ? getTimeStampToDateTime(companyregdoc_uploadedtime) : null,
                    perview: companyregdoc
                }
            }

            if (personaliddoc) {
                const filenameaplitarr = personaliddoc.split('/')
                fileinfo[i++] = {
                    file: 'Personal ID',
                    name: filenameaplitarr[filenameaplitarr.length - 1],
                    uploadby: personaliddoc_uploadedby,
                    uploaddatetime: personaliddoc_uploadedtime ? getTimeStampToDateTime(personaliddoc_uploadedtime) : null,
                    perview: personaliddoc
                }
            }

            if (vatdoc) {
                const filenameaplitarr = vatdoc.split('/')
                fileinfo[i++] = {
                    file: 'Vat ID',
                    name: filenameaplitarr[filenameaplitarr.length - 1],
                    uploadby: vatdoc_uploadedby,
                    uploaddatetime: vatdoc_uploadedtime ? getTimeStampToDateTime(vatdoc_uploadedtime) : null,
                    perview: vatdoc
                }
            }

            if (others_doc) {
                const filenameaplitarr = others_doc.split('/')
                fileinfo[i++] = {
                    file: 'Others',
                    name: filenameaplitarr[filenameaplitarr.length - 1],
                    uploadby: othersdoc_uploadedby,
                    uploaddatetime: othersdoc_uploadedtime ? getTimeStampToDateTime(vatdoc_uploadedtime) : null,
                    perview: others_doc
                }
            }

            setfileuploadinformaton(fileinfo)

        }).catch(err => {
            console.log(err.response)
            Error(err)
        })

    }, [CallEffect])
    /* {
                   file:'Economic Operator ID',
                   name:file.name,
                   uploadby:username,
                   uploaddatetime:  new Date().toLocaleString(),
                   perview:preview
               }
        */
    const onchange = () => {

    }


    return (
        <Fragment>
            {BusinessList.length > 1 && <Card>
                <CardHeader className='border-bottom mb-1'>
                    <CardTitle tag='h5'>Business Info</CardTitle>
                </CardHeader>
                <CardBody>
                    <Label for="Business">Select a Business</Label>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        classNamePrefix='select'
                        defaultValue={BusinessList.map(x => { return { value: x.id, label: x.businessname } })[0]}
                        onChange={async (selected) => {
                            await setbusiness_id(selected.value)
                            await setCallEffect(!CallEffect)
                        }}
                        options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                    />
                </CardBody>
            </Card>}

            {
                loading ? <Card>
                    <CardBody>
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </CardBody>
                </Card> : <Form autoComplete="off" className="businessview">
                    <Row style={{ marginTop: '10px' }}>
                        <Col sm='12'>
                            {/*about business start*/}
                            <Card>

                                <CardHeader>
                                    <CardTitle style={{ width: '100%' }} >
                                        <h4 style={{ float: 'left' }}>About Business</h4>
                                        {/* <div style={{ float: 'right', fontSize: '12px' }}>
                                            <p>
                                                Created by : {viewinput['createdby']}, {viewinput['createddate'] ? getTimeStampToDateTime(viewinput['createddate']) : null} <br />
                                                {
                                                    viewinput['updatedby'] ? `Updated by : ${viewinput['updatedby']}, ${viewinput['updateddate'] ? getTimeStampToDateTime(viewinput['updateddate']) : null}` : null
                                                }
                                            </p>
                                        </div> */}
                                    </CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row>
                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='bname'>Business Name </Label>
                                                <Input type='text'
                                                    name='businessname'
                                                    id='bname'
                                                    value={viewinput['businessname'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='firstname'>First Name </Label>
                                                <Input type='text'
                                                    name='firstname'
                                                    id='firstname'
                                                    onChange={onchange}
                                                    disabled
                                                    value={viewinput['customerinfo'] ? viewinput['customerinfo']['firstname'] : ''}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='lastname'>Last Name </Label>
                                                <Input type='text'
                                                    name='lastname'
                                                    id='lastname'
                                                    onChange={onchange}
                                                    disabled
                                                    value={viewinput['customerinfo'] ? viewinput['customerinfo']['lastname'] : ''}
                                                />

                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='status'>Status</Label>
                                                <div>
                                                    {
                                                        viewinput['status'] === 1 ? <CustomInput defaultChecked type='radio' id='exampleCustomRadio' disabled name='status' value="1" inline label='Active' /> : null

                                                    }
                                                    {
                                                        viewinput['status'] === 0 ? <CustomInput defaultChecked type='radio' id='exampleCustomRadio2' disabled name='status' value="0" inline label='Pending' /> : null

                                                    }
                                                    {
                                                        viewinput['status'] === 5 ? <CustomInput defaultChecked type='radio' id='exampleCustomRadio3' disabled name='status' value="5" inline label='Stopped' /> : null

                                                    }
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='mobile'>Mobile </Label>
                                                <Input
                                                    type='number'
                                                    name='mobile'
                                                    id='mobile'
                                                    value={viewinput['customerinfo'] ? `${window.PHONE_PREFIX}${viewinput['customerinfo']['mobile']}` : ''}
                                                    onChange={onchange}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='telephone'>Telephone </Label>
                                                <Input type='text'
                                                    name='landline'
                                                    id='telephone'
                                                    value={viewinput['landline'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='postcode'>Post code </Label>

                                                <Input type='text'
                                                    name='postcode'
                                                    id='postcode'
                                                    value={viewinput['postcode'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='email'>Email </Label>
                                                <Input type='text'
                                                    name='email'
                                                    id='email'
                                                    value={viewinput['email'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='sizeofstore'>Size of Store</Label>
                                                <Input
                                                    type='text'
                                                    name='sizeofstoreid'
                                                    id='sizeofstoreid'
                                                    value={storesizeinfo.statusdesc}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        {/* <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='primarydepot'>Primary Depot</Label>
                                                <Input type='text'
                                                    name='depot_id'
                                                    id='depot_id'
                                                    value={storeinfo.storename}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col> */}

                                        <Col md='6' sm='12'>

                                            <FormGroup>
                                                <Label for='baddress'>Business Address</Label>
                                                <Input type='text'
                                                    name='address'
                                                    id='address'
                                                    value={viewinput['address'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='companyregisterno'>Company Register No.</Label>
                                                <Input
                                                    type='text'
                                                    name='companyregno'
                                                    id='companyregisterno'
                                                    value={viewinput['companyregno'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='vatno'>VAT No.</Label>
                                                <Input
                                                    type='text'
                                                    name='vatno'
                                                    id='vatno'
                                                    value={viewinput['vatno'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='country'>Country</Label>
                                                <Input
                                                    type='text'
                                                    name='country'
                                                    id='country'
                                                    value={viewinput['country'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='copid'>Economic Operator ID</Label>
                                                <Input
                                                    type='text'
                                                    name='EOID'
                                                    id='copid'
                                                    value={viewinput['EOID'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='fid'>Facility ID</Label>
                                                <Input
                                                    type='text'
                                                    name='FID'
                                                    id='fid'
                                                    value={viewinput['FID'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md='6' sm='12'>
                                            <FormGroup>
                                                <Label for='premise'>Premise</Label>
                                                {
                                                    viewinput['premise'] ? <div className="customradiocheck">
                                                        <CustomInput type='radio' id='premise' defaultChecked disabled name='premise' value={viewinput['premise']} inline label={viewinput['premise']} />
                                                    </div> : null
                                                }

                                            </FormGroup>
                                        </Col>

                                        {/* <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='sizeofstore'>Size of Store</Label>
                                                <Input
                                                    type='text'
                                                    name='sizeofstoreid'
                                                    id='sizeofstoreid'
                                                    value={storesizeinfo.statusdesc}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col> */}

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='memberofsymbolgroup'>Member of Symbol Group</Label>
                                                <Input
                                                    type='text'
                                                    name='memberofsymbolgroup'
                                                    id='memberofsymbolgroup'
                                                    value={symblegroup}
                                                    onChange={onchange}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>

                                    </Row>

                                </CardBody>
                            </Card>
                            {/*about business end*/}

                            {/*business category start*/}
                            <Card>
                                {/* <CardHeader>
                                    <CardTitle tag='h4'>Business Category</CardTitle>
                                </CardHeader> */}

                                <CardBody>
                                    <Row>
                                        <Col sm='6' md='6'>
                                            <Row>
                                                {
                                                    customerbusinesstypemap.map((item, index) => <Col sm='12' md='12' key={index} style={{ marginBottom: '10px' }}>
                                                        <Label for='copid'>Business Category</Label>
                                                        <Input inline type='text' disabled value={item.typedetails.statusdesc} id={`businesscategory${index}`} />
                                                    </Col>)
                                                }
                                            </Row>
                                        </Col>
                                        <Col sm='6' md='6'>
                                            <FormGroup>
                                                {
                                                    viewinput['businesstype'] ? <div>
                                                        <Label for='copid'>Business Type</Label>
                                                        <Input type='text' id='businesstype' disabled name='businesstype' value={viewinput['businesstype']} />
                                                    </div> : null
                                                }
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            {/*business category end*/}

                            {/*business type start*/}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Business Type</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row>
                                        <Col sm='12' md='12'>
                                            <FormGroup>
                                                {
                                                    viewinput['businesstype'] ? <div>
                                                        <Input type='text' id='businesstype' disabled name='businesstype' value={viewinput['businesstype']} />
                                                    </div> : null
                                                }


                                            </FormGroup>
                                        </Col>

                                    </Row>

                                </CardBody>
                            </Card> */}
                            {/*business type end*/}

                            {/*document up start*/}
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Documents</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm='12' md='12'>
                                            {fileuploadinformaton.length ? <Table borderless>
                                                <thead>
                                                    <tr>
                                                        <th>File</th>
                                                        <th>Name</th>
                                                        <th>Upload By</th>
                                                        <th>Add time</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        fileuploadinformaton.map((item, index) => <tr key={index}>
                                                            <th>{item.file}</th>
                                                            <th>
                                                                {item.name}<br />
                                                            </th>
                                                            <th>{item.uploadby}</th>
                                                            <th>{item.uploaddatetime}</th>
                                                            <th><Fragment>
                                                                <a href={item.perview} target="_blank" ><Eye size={15} /></a>
                                                            </Fragment></th>
                                                        </tr>)
                                                    }
                                                </tbody>
                                            </Table> : null
                                            }
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                            {/*document up end*/}

                            {/*marketing preferance start*/}
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Marketing Preference</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row>
                                        {
                                            businessmarketingpref.length ? businessmarketingpref.map((item, index) => <Col sm='12' md='2' key={index}>
                                                <CustomInput inline type='checkbox' disabled defaultChecked id={`marketingpreference${index}`} value={index} label={item['marketingpref'] ? item['marketingpref']['statusdesc'] : null} />
                                            </Col>) : null
                                        }

                                    </Row>

                                </CardBody>
                            </Card>
                            {/*marketing preferance end*/}

                            {/*customer tag start*/}
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Customer Tags</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    {
                                        businesstagmap.length ? <Fragment>

                                            <Row className="customanttag">
                                                <Col sm='12' md='12'>
                                                    {
                                                        businesstagmap.map((tag, index) => <Tag
                                                            key={index}
                                                        >
                                                            <span>
                                                                {tag['businesstag']['statusdesc'].length > 20 ? `${tag['businesstag']['statusdesc'].slice(0, 20)}...` : tag['businesstag']['statusdesc']}
                                                            </span>
                                                        </Tag>

                                                        )
                                                    }

                                                </Col>

                                            </Row>
                                        </Fragment> : null
                                    }


                                </CardBody>
                            </Card>
                            {/*customer tag end*/}

                            {/*comment start*/}
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Comment</CardTitle>
                                </CardHeader>

                                <CardBody>

                                    <Row className="customanttag">
                                        {
                                            customercomment.map((comment, index) => <Col sm='12' md='12' key={index} >
                                                <Card >
                                                    <CardBody>
                                                        <span>
                                                            {comment['username']} &nbsp; &nbsp; {getTimeStampToDateTime(comment['createdat'])} <br />
                                                        </span>
                                                        <span>
                                                            {comment['comment']}
                                                        </span>
                                                    </CardBody>
                                                </Card>
                                            </Col>)
                                        }

                                    </Row>

                                </CardBody>
                            </Card>
                            {/*comment end*/}

                        </Col>

                    </Row>
                </Form>
            }


        </Fragment>
    )
}
export default ViewBusiness
