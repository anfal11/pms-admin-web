import { selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from 'react'
import { ChevronLeft, User } from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import {
    Button, Card, CardBody, CardHeader,
    CardTitle, Col, CustomInput, Form,
    FormGroup, Input,
    Label,
    Row
} from 'reactstrap'


import '@styles/react/libs/file-uploader/file-uploader.scss'
import '@uppy/status-bar/dist/style.css'
import 'antd/dist/antd.css'
import 'uppy/dist/uppy.css'

import { Skeleton } from 'antd'

import useJwt from '@src/auth/jwt/useJwt'
import { Error } from '../viewhelper'


const ViewBusiness = (props) => {
    const { businessid } = useParams()
    const history = useHistory()
    const [viewinput, setviewinput] = useState({})
    const [loading, setloading] = useState(true)
    const [businessmarketingpref, setbusinessmarketingpref] = useState([])
    const [businesstagmap, setbusinesstagmap] = useState([])
    const [customercomment, setcustomercomment] = useState([])
    const [customerbusinesstypemap, setcustomerbusinesstypemap] = useState([])
    const [fileuploadinformaton, setfileuploadinformaton] = useState([])
    const [symblegroup, setsymblegroup] = useState('')
    const [currency, setCurrency] = useState([])
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

        const business_id = props.match.params.businessid
        //store list..
        useJwt.customerBusinessDetails({ businessid: business_id }).then(async res => {
            console.log(res.data.payload)
            const payload1 = res.data.payload, fileinfo = []
            let i = 0
            const { customerbusinesstypemap = [],
                businessmarketingpref = [],
                businesstagmap = [],
                customercomment = [],
                campaign_config = {},

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
                customerinfo,
                memberofsymbolgroup

            } = await payload1
           
            const {ad_account_id = null, app_id = null, app_secret = null, business_id = null, email_address = null, email_config_type = null, email_host = null, email_password = null, email_port = null, email_service = null, fcm_server_ring = null, google_customer_id = null, google_managers_client_id = null, instagram_actor_id = null, keyword = null, page_id = null, user_token = null} = campaign_config || {}

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
            setviewinput({ ...payload1, ...customerinfo, ad_account_id, app_id, app_secret, business_id, email_address, email_config_type, email_host, email_password, email_port, email_service, fcm_server_ring, google_customer_id, google_managers_client_id, instagram_actor_id, keyword, page_id, user_token})
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
            console.log(err)
            Error(err)
        })
        useJwt.currencyList().then(res => {
            console.log('currencyList', res)
            setCurrency(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [])
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
            {
                loading ? <Fragment>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </Fragment> : <Form autoComplete="off" className="businessview">
                    <Row>
                        <Col md='2' sm='2'>
                            <h4>Business Details</h4>
                        </Col>
                        <Col sm="5" >
                            <Button.Ripple className='ml-2' color='primary' tag={Link} to='/business'>
                                <ChevronLeft size={10} />
                                <span className='align-middle ml-50'>Back to List</span>
                            </Button.Ripple>
                            <Button.Ripple onClick={() => sessionStorage.setItem("customer_idx", viewinput.customerinfo.idx)} className='ml-2' color='primary' tag={Link} to={`/AppUserAccess/${businessid}`}>
                                <User size={10} />
                                <span className='align-middle ml-50'>App User Access</span>
                            </Button.Ripple>

                        </Col>

                    </Row>

                    <Row style={{ marginTop: '10px' }}>
                        <Col sm='12'>
                            {/*about business start*/}
                            <Card>

                                <CardHeader>
                                    <CardTitle style={{ width: '100%' }} >
                                        <h4 style={{ float: 'left' }}>About Business</h4>
                                        <div style={{ float: 'right', fontSize: '12px' }}>
                                            <p>
                                                Created by : {viewinput['createdby']}, {viewinput['createddate'] ? getTimeStampToDateTime(viewinput['createddate']) : null} <br />
                                                {
                                                    viewinput['updatedby'] ? `Updated by : ${viewinput['updatedby']}, ${viewinput['updateddate'] ? getTimeStampToDateTime(viewinput['updateddate']) : null}` : null
                                                }
                                            </p>
                                        </div>
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
                                        {/* <Col md='3' sm='12'>
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
                                        </Col> */}

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
                                                    value={viewinput['mobile'] || ''}
                                                    onChange={onchange}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>
                                        {/* <Col md='3' sm='12'>
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
                                        </Col> */}
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
                                        {/* <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='primarydepot'>Primary Depot</Label>
                                                <Input type='text'
                                                    name='depot_id'
                                                    id='depot_id'
                                                    value={storeinfo?.storename}
                                                    disabled
                                                />

                                            </FormGroup>
                                        </Col>

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

                                        <Col md='3' sm='12'>
                                            <FormGroup>
                                                <Label for='sizeofstore'>Size of Store</Label>
                                                <Input
                                                    type='text'
                                                    name='sizeofstoreid'
                                                    id='sizeofstoreid'
                                                    value={storesizeinfo?.statusdesc}
                                                    onChange={onchange}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>

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
                                        </Col> */}
                                        <Col md='3' sm='12' className='mt-2'>
                                        <FormGroup>
                                            <CustomInput
                                            type='switch'
                                            id='web_login'
                                            name='web_login'
                                            label='Allow Web Login?'
                                            disabled
                                            checked={viewinput.web_login}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' sm='12' className='mt-2'>
                                        <FormGroup>
                                            <CustomInput
                                            type='switch'
                                            id='allow_subtype'
                                            name='allow_subtype'
                                            label='Allow Subtype?'
                                            disabled
                                            checked={viewinput.allow_subtype}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='6' sm='6'>
                                        <FormGroup>
                                            <Label for='businesscategories'>Business Category</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="businesscategories"
                                                disabled
                                                value={{value: viewinput.businesscategoryid, label: viewinput.businesscategoryid}}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='4' sm='6'>
                                        <FormGroup>
                                            <Label for='service'>Service</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="service"
                                                disabled
                                                value={{value: viewinput.service_type, label: viewinput.service_type}}
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
                                        {/* <Col sm='6' md='6'>
                                            <FormGroup>
                                                {
                                                    viewinput['businesstype'] ? <div>
                                                        <Label for='copid'>Business Type</Label>
                                                        <Input type='text' id='businesstype' disabled name='businesstype' value={viewinput['businesstype']} />
                                                    </div> : null
                                                }
                                            </FormGroup>
                                        </Col> */}
                                        <Col sm='6' md='4'>
                                            <FormGroup>
                                                {
                                                    viewinput['city'] ? <div>
                                                        <Label for='copid'>Division</Label>
                                                        <Input type='text' id='city' disabled name='city' value={viewinput['city']} />
                                                    </div> : null
                                                }
                                            </FormGroup>
                                        </Col>
                                        <Col sm='6' md='4'>
                                            <FormGroup>
                                                {
                                                    viewinput['district'] ? <div>
                                                        <Label for='copid'>District</Label>
                                                        <Input type='text' id='district' disabled name='district' value={viewinput['district']} />
                                                    </div> : null
                                                }
                                            </FormGroup>
                                        </Col>
                                        <Col sm='6' md='4'>
                                            <FormGroup>
                                                {
                                                    viewinput['thana'] ? <div>
                                                        <Label for='copid'>Thana</Label>
                                                        <Input type='text' id='thana' disabled name='thana' value={viewinput['thana']} />
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
                            {/* <Card>
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
                            </Card> */}
                            {/*document up end*/}

                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md='6' sm='12' className='mt-2'>
                                            <FormGroup>
                                                <CustomInput
                                                type='switch'
                                                id='group_select'
                                                name='group_select'
                                                label='Group Select Allow?'
                                                disabled
                                                checked= {viewinput.group_select}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='6' sm='6'>
                                        {
                                            (viewinput.group_select && !viewinput.campaign_select) &&  <FormGroup>
                                            <Label for='city'>Groups</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="group"
                                                disabled
                                                value={ { value: viewinput.selected_receiver_group_name, label: viewinput.selected_receiver_group_name } }
                                            />
                                        </FormGroup>
                                        }
                                        </Col>
                                        <Col md='6' sm='12' className='mt-2'>
                                            <FormGroup>
                                                <CustomInput
                                                type='switch'
                                                id='campaign_select'
                                                name='campaign_select'
                                                label='Campaign Select Allow?'
                                                disabled
                                                checked= {viewinput.campaign_select}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md='6' sm='6'>
                                        {
                                            (!viewinput.group_select && viewinput.campaign_select) &&  <FormGroup>
                                            <Label for='campaigns'>Campaign</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                name="campaigns"
                                                disabled
                                                value={ { value: viewinput.selected_campaign_name, label: viewinput.selected_campaign_name } }
                                            />
                                        </FormGroup>
                                        }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <Card>
                            <CardHeader>
                                <CardTitle>Credential Configurations For Social Media AD</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h4'>Facebook</CardTitle>
                                    </CardHeader>
                                    <CardBody style={{ paddingTop: '15px' }}>
                                        <Row>
                                            <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="app_id">App ID<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="app_id"
                                                        id='app_id'
                                                        value={viewinput?.app_id}
                                                        disabled
                                                        placeholder="app id"
                                                    />
                                                </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="app_secret">App Secret<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="app_secret"
                                                            id='app_secret'
                                                            value={viewinput?.app_secret}
                                                            disabled
                                                            placeholder="app secret"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="pageId">Page ID<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="pageId"
                                                            id='pageId'
                                                            value={viewinput?.pageId}
                                                            disabled
                                                            placeholder="Page id"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="adAccountId">Ad Account ID (required for facebook advertisement.)<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="adAccountId"
                                                            id='adAccountId'
                                                            value={viewinput?.adAccountId}
                                                            disabled
                                                            placeholder="ad account id"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="instagram_actor_id">Instagram Actor ID<span className='text-danger'>*</span></Label>
                                                        <Input type="text"
                                                            name="instagram_actor_id"
                                                            id='instagram_actor_id'
                                                            value={viewinput.instagram_actor_id}
                                                            disabled
                                                            placeholder="instagram actor id"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="user_token">User Token<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="textarea"
                                                            rows = "6"
                                                            name="user_token"
                                                            id='user_token'
                                                            value={viewinput?.user_token}
                                                            disabled
                                                            placeholder="user token"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h4'>Google</CardTitle>
                                    </CardHeader>
                                    <CardBody style={{ paddingTop: '15px' }}>
                                        <Row>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="currency_code">Currency<span style={{ color: 'red' }}>*</span></Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        isDisabled
                                                        value={{value:'', label: viewinput?.currency_code}}
                                                        options={[]}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="time_zone">Time Zone<span style={{ color: 'red' }}>*</span></Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        isDisabled
                                                        value={{value:'', label: viewinput?.time_zone}}
                                                        options={[]}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="google_customer_id">Google Customer Id<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="google_customer_id"
                                                        id='google_customer_id'
                                                        value={viewinput?.google_customer_id}
                                                        disabled
                                                        placeholder="google_customer_id"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="google_managers_client_id">Google Managers Client Id<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="google_managers_client_id"
                                                        id='google_managers_client_id'
                                                        value={viewinput?.google_managers_client_id}
                                                        disabled
                                                        placeholder="google_managers_client_id"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h4'>Email</CardTitle>
                                    </CardHeader>
                                    <CardBody style={{ paddingTop: '15px' }}>
                                        <Row>
                                            <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="email_address">Email Address<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="email_address"
                                                        id='email_address'
                                                        value={viewinput?.email_address}
                                                        disabled
                                                        placeholder="email_address"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="email_password">Email Password<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="email_password"
                                                        id='email_password'
                                                        value={viewinput?.email_password}
                                                        disabled
                                                        placeholder="email_password"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="email_port">Email Port<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="email_port"
                                                        id='email_port'
                                                        value={viewinput?.email_port}
                                                        disabled
                                                        placeholder="email_port"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="email_config_type">Email Configure Type<span style={{ color: 'red' }}>*</span></Label>
                                                    <Select
                                                        theme={selectThemeColors}
                                                        maxMenuHeight={200}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        isDisabled
                                                        value={{ value: 0, label: viewinput?.email_config_type }}
                                                        options={[{ value: 1, label: 'Service' }, { value: 2, label: 'Host'}]}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            { viewinput.email_config_type === 1 && <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="email_service">Email Service<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="email_service"
                                                        id='email_service'
                                                        value={viewinput?.email_service}
                                                        disabled
                                                        placeholder="email_service"
                                                    />
                                                </FormGroup>
                                            </Col> }
                                            { viewinput.email_config_type === 2 && <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="email_host">Email Host<span style={{color:'red'}}>*</span></Label>
                                                    <Input type="text"
                                                        name="email_host"
                                                        id='email_host'
                                                        value={viewinput?.email_host}
                                                        disabled
                                                        placeholder="email_host"
                                                    />
                                                </FormGroup>
                                            </Col> }
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h4'>Push Notification</CardTitle>
                                    </CardHeader>
                                   <CardBody style={{ paddingTop: '15px' }}>
                                        <Row>
                                            <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="fcm_server_ring">FCM Server Key<span style={{color:'red'}}>*</span></Label>
                                                        <Input type="text"
                                                            name="fcm_server_ring"
                                                            id='fcm_server_ring'
                                                            value={viewinput?.fcm_server_ring}
                                                            disabled
                                                            placeholder="fcm server key"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                </Card>
                            </CardBody>
                        </Card>

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
                            {/* <Card>
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
                            </Card> */}
                            {/*customer tag end*/}

                            {/*comment start*/}
                            {/* <Card>
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
                            </Card> */}
                            {/*comment end*/}

                        </Col>

                    </Row>
                </Form>
            }


        </Fragment>
    )
}
export default ViewBusiness
