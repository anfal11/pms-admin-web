import { useRTL } from '@hooks/useRTL'
import useJwt from '@src/auth/jwt/useJwt'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Plus } from 'react-feather'
import 'react-rangeslider/lib/index.css'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { Error, Success } from '../../../../../viewhelper'

const CreateAD = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [isRtl, setIsRtl] = useRTL()
    const history = useHistory()
    const ruleRef = useRef()
    const catRef = useRef()
    const campRef = useRef()
    const [campaignList, setcampaignList] = useState([])
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [file, setFile] = useState(null)
    const [adRuleList, setAdRuleList] = useState([])
    const [filePrevw, setFilePrevw] = useState(null)
    const [resetData, setReset] = useState(true)
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])

    const [userInput, setUserInput] = useState({
        title: '',
        body: '',
        thumbnail_height: 0,
        thumbnail_width: 0,
        fb_adset_id: '',
        image_hash: '',
        link_url: '',
        image_url: '',
        image: '',
        effective_instagram_media_id: '',
        is_fb_page_post: false,
        fb_page_post_category_ids: [],
        facebookpage_subcategory_localuids: []
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        const callApi = async () => {
            await useJwt.adRuleList().then(res => {
                console.log(res)
                const allAdRule = []
                for (const q of res.data.payload) {
                    if (q.is_approved === true) {
                        allAdRule.push(q)
                    }
                }
                setAdRuleList(allAdRule.map(ar => { return { value: ar.id, label: ar.rule_name } }))
            }).catch(err => {
                Error(err)
                console.log(err)
            })
            localStorage.setItem('usePMStoken', false) //for token management
            localStorage.setItem('useBMStoken', true)
            await useJwt.campaignList().then(res => {
                console.log('campaignList', res)
                setcampaignList(res.data)
                localStorage.setItem('useBMStoken', false)
            }).catch(err => {
                if (err.response?.status === 401) {
                    localStorage.setItem("BMSCall", true)
                    useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                        localStorage.setItem('BMStoken', res.data.jwtToken)
                        localStorage.setItem("BMSCall", false)
                        setReset(!resetData)
                    }).catch(err => {
                        localStorage.setItem("BMSCall", false)
                        console.log(err)
                    })
                } else {
                    Error(err)
                    console.log(err)
                    localStorage.setItem('useBMStoken', false)
                }
            })
            localStorage.setItem('usePMStoken', false) //for token management
            localStorage.setItem('useBMStoken', false)
            useJwt.getFbpageCategory().then(res => {
                setbusinesscategorylist(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
            }).catch(err => {
                console.log(err.response)
                Error(err)
            })
        }
        callApi()
    }, [resetData])
    const getImageHash = (file) => {
        setPointRuleloading(true)
        const formData = new FormData()
        formData.append('filename', file)
        useJwt.getImageHash(formData).then(res => {
            let hashData
            for (const f in res.data.payload.images) {
                hashData = res.data.payload.images[f].hash
            }
            console.log('ImageHash', res)
            setUserInput({
                ...userInput, image_hash: hashData
            })
            // Success(res)
            setPointRuleloading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setPointRuleloading(false)
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
            setUserInput({...userInput, fb_page_post_category_ids: []})

        } else {
            setSubCategory(dataPush.length ? dataPush : subCategory)
            setUserInput({...userInput, fb_page_post_category_ids})
        }
       
    }

    const handleChangeFBSubCategory = (selected) => {
        setUserInput({...userInput, facebookpage_subcategory_localuids: selected.map(item => item.value)})
    }
    const onSubmit = (e) => {
        e.preventDefault()
        setPointRuleloading(true)
        const { title, body, thumbnail_height, thumbnail_width, fb_adset_id, link_url, image_url, image, effective_instagram_media_id, image_hash, campaign_id, is_fb_page_post, fb_page_post_category_ids, facebookpage_subcategory_localuids } = userInput
        console.log({ title, body, thumbnail_height, thumbnail_width, fb_adset_id, link_url, image_url, image, effective_instagram_media_id, image_hash, campaign_id, is_fb_page_post, fb_page_post_category_ids, facebookpage_subcategory_localuids })
        // return 0
        const formData1 = new FormData()
        formData1.append('image', file)

        useJwt.singleFileupload(formData1).then(async res => {
            console.log(res)
            await useJwt.createAd({ title, body, thumbnail_height, thumbnail_width, fb_adset_id, link_url, image_url, image: await res.data.payload.image_url, effective_instagram_media_id, image_hash, campaign_id, is_fb_page_post, fb_page_post_category_ids, facebookpage_subcategory_localuids }).then((response) => {
                setPointRuleloading(false)
                Success(response)
                console.log(response)
                history.push(userData?.role === 'vendor' ? '/adlistVendor' : '/adlist')
            }).catch((error) => {
                setPointRuleloading(false)
                Error(error)
                console.log(error.response)
            })
        }).catch(e => {
            console.log(e.response)
            setPointRuleloading(false)
        })
    }

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/adlistVendor' : '/adlist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
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
                                                value={userInput.title}
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
                                                value={userInput.body}
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
                                    {/* <Col sm="12" >
                                        <FormGroup>
                                            <Label for="effective_instagram_media_id">Effective Instagram Media ID<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="effective_instagram_media_id"
                                                id='effective_instagram_media_id'
                                                value={userInput.effective_instagram_media_id}
                                                onChange={handleChange}
                                                required
                                                placeholder="effective instagram media id"
                                            />
                                        </FormGroup>
                                    </Col> */}
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="type">AD Rule<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                ref={ruleRef}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, fb_adset_id: selected.value })
                                                }}
                                                options={adRuleList}
                                                menuPlacement='auto'
                                            />
                                        </FormGroup>
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => ruleRef.current.select.focus()}
                                            value={userInput.fb_adset_id || ''}
                                            onChange={e => ''}
                                        />
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
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, campaign_id: selected.value })
                                                }}
                                                options={campaignList.map(x => { return { value: x.id, label: x.campaignName } })}
                                                menuPlacement='auto'
                                            />
                                        </FormGroup>
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => campRef.current.select.focus()}
                                            value={userInput.campaign_id || ''}
                                            onChange={e => ''}
                                        />
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
                                            setUserInput({...userInput, is_fb_page_post: true})
                                        } else {
                                            setUserInput({...userInput, is_fb_page_post: false})
                                            setSubCategory([])
                                        }
                                    }
                                    } id='is_fb_page_post' label='Is Facebook Page Post?' checked={userInput.is_fb_page_post}/>
                                </FormGroup>
                            </Col>
                            {
                                userInput.is_fb_page_post && <Col md='4' sm='6'>
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
                                        value={userInput.fb_page_post_category_ids || ''}
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
                                        value={userInput.thumbnail_height}
                                        onChange={handleChange}
                                        // required
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
                                        value={userInput.thumbnail_width}
                                        onChange={handleChange}
                                        // required
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
                                        value={userInput.link_url}
                                        onChange={handleChange}
                                        // required
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
                                        value={userInput.image_url}
                                        onChange={handleChange}
                                        // required
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
                                            required
                                            name="voucherImage"
                                            id='voucherImage'
                                            onChange={e => {
                                                if (e.target.files.length !== 0) {
                                                    setFilePrevw(URL.createObjectURL(e.target.files[0]))
                                                }
                                                setFile(e.target.files[0])
                                                getImageHash(e.target.files[0])
                                            }}
                                        />
                                    </div>
                                    {filePrevw && <img src={filePrevw} alt='voucher img' height='100px'></img>}
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" className='text-center'>
                                {
                                    pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default CreateAD