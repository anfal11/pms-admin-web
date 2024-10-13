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

const EditModal = ({ modal, toggleModal, adInfo, setAdInfo, setReset, resetData, campaignList }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [file, setFile] = useState(null)
    const campRef = useRef()
    const catRef = useRef()
    const [filePrevw, setFilePrevw] = useState(adInfo.image)
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const handleChange = (e) => {
        setAdInfo({ ...adInfo, [e.target.name]: e.target.value })
    }
    useEffect(async () => {
        console.log(adInfo)
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', false)
        useJwt.getFbpageCategory().then(res => {
            setbusinesscategorylist(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        const { id } = adInfo
        seteditPointRuleloading(true)
        console.log(adInfo)
        useJwt.editAd(adInfo).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(false)
            console.log(res)
            toggleModal()
            Success(res)
        }).catch(err => {
            seteditPointRuleloading(false)
            Error(err)
            console.log(err)
        })
    }
    const handleChangeFBCategory = (selected) => {
        const dataPush = [], fb_page_post_category_ids = []
        console.log('selected ', selected)
        if (selected.length && selected[selected.length - 1].value.subcategory) {
            selected.map(item => {
                item.value.subcategory.map(item2 => {
                    dataPush.push(item2)
                })
                fb_page_post_category_ids.push(item.value.id)
            })
        }

        if (selected.length === 0) {
            setSubCategory([])
            setAdInfo({...adInfo, fb_page_post_category_ids: []})

        } else {
            setSubCategory(dataPush.length ? dataPush : subCategory)
            setAdInfo({...adInfo, fb_page_post_category_ids})
        }
       
    }

    const handleChangeFBSubCategory = (selected) => {
        setAdInfo({...adInfo, facebookpage_subcategory_localuids: selected.map(item => item.value)})
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={toggleModal}>Edit Ad</ModalHeader>
            <ModalBody>
                <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <h4 className='m-1'>AD Info</h4>
                    <Row className='match-height'>
                        <Col sm='6'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm="12" >
                                            <FormGroup>
                                                <Label for="title">Title<span className='text-danger'>*</span></Label>
                                                <Input type="text"
                                                    name="title"
                                                    id='title'
                                                    value={adInfo.title}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="title here..."
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm="12" >
                                            <FormGroup>
                                                <Label for="body">Body<span className='text-danger'>*</span></Label>
                                                <Input type="textarea"
                                                    rows="4"
                                                    name="body"
                                                    id='body'
                                                    value={adInfo.body}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="body"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm='6'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col sm="12" >
                                            <FormGroup>
                                                <Label for="effective_instagram_media_id">Effective Instagram Media ID<span className='text-danger'>*</span></Label>
                                                <Input type="text"
                                                    name="effective_instagram_media_id"
                                                    id='effective_instagram_media_id'
                                                    value={adInfo.effective_instagram_media_id}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="effective instagram media id"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm="12" >
                                            <FormGroup>
                                                <Label for="type">Select Campaign<span style={{ color: 'red' }}>*</span></Label>
                                                <Select
                                                    ref={campRef}
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    value={campaignList?.map(x => { return { value: x.id, label: x.campaignName } }).find(y => y.value === adInfo.campaign_id)}
                                                    onChange={(selected) => {
                                                        // setAdInfo({ ...adInfo, [e.target.name]: e.target.value })
                                                        setAdInfo({ ...adInfo, campaign_id: selected.value })
                                                    }}
                                                    options={campaignList.map(x => { return { value: x.id, label: x.campaignName } })}
                                                    menuPlacement='auto'
                                                />
                                                <Input
                                                    required
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => campRef.current.select.focus()}
                                                    value={adInfo.campaign_id || ''}
                                                    onChange={e => ''}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>`
                        </Col>
                    </Row>
                    <Card>
                    <CardBody>
                        <Row>
                            <Col sm="4" >
                                <FormGroup>
                                    <CustomInput type='switch' onChange={(e) => {
                                        if (e.target.checked) {
                                            setAdInfo({...adInfo, is_fb_page_post: true})
                                        } else {
                                            setAdInfo({...adInfo, is_fb_page_post: false})
                                            setSubCategory([])
                                        }
                                    }
                                    } id='is_fb_page_post' label='Is Facebook Page Post?' checked={adInfo.is_fb_page_post} />
                                </FormGroup>
                            </Col>
                            {
                                adInfo?.is_fb_page_post && <Col md='4' sm='6'>
                                <FormGroup>
                                    <Label for='fb_page_post_category_ids'>Facebook Page Category <span style={{ color: 'red' }}>*</span></Label>
                                    {
                                        businesscategorylist.length ? <Select
                                            ref={catRef}
                                            theme={selectThemeColors}
                                            className='basic-multi-select'
                                            classNamePrefix='select'
                                            name="businesscategories"
                                            // defaultValue={businesscategorylist[0]}
                                            options={businesscategorylist}
                                            onChange={(selected) => handleChangeFBCategory(selected)}
                                            isMulti
                                            isClearable={false}
                                        
                                        /> : <Spinner color='primary' />
                                    }
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => catRef.current.select.focus()}
                                        value={adInfo.fb_page_post_category_ids || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            }
                            {
                                (subCategory?.length !== 0) && <Col sm="4" >
                                <FormGroup>
                                    <Label for="facebookpage_subcategory_localuid">Facebook Page Sub Category</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(selected) => handleChangeFBSubCategory(selected)}
                                        isMulti
                                        isClearable={false}
                                        options={subCategory?.map(item => { return { value: item.uid, label: item.name } })}
                                        
                                    />
                                </FormGroup>
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Image info</CardTitle>
                        </CardHeader>
                        <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="thumbnail_height">Thumbnail Height</Label>
                                        <Input type="number"
                                            name="thumbnail_height"
                                            id='thumbnail_height'
                                            value={adInfo.thumbnail_height}
                                            onChange={handleChange}
                                            placeholder="thumbnail height here..."
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="thumbnail_width">Thumbnail Width</Label>
                                        <Input type="number"
                                            name="thumbnail_width"
                                            id='thumbnail_width'
                                            value={adInfo.thumbnail_width}
                                            onChange={handleChange}
                                            placeholder="thumbnail width here..."
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="link_url">Link URL</Label>
                                        <Input type="text"
                                            name="link_url"
                                            id='link_url'
                                            value={adInfo.link_url}
                                            onChange={handleChange}
                                            placeholder="link url"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="image_url">Image URL</Label>
                                        <Input type="text"
                                            name="image_url"
                                            id='image_url'
                                            value={adInfo.image_url}
                                            onChange={handleChange}
                                            placeholder="image url"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md='12' className='mb-2'>
                                    <Label for="voucherImage">Upload Image</Label>
                                    <div className='d-flex'>
                                        <div className="file position-relative overflow-hidden mr-2">
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
                                        {filePrevw && <img src={filePrevw} alt='voucher img' height='100px'></img>}
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

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