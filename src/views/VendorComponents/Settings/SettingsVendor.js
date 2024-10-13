import useJwt from '@src/auth/jwt/useJwt'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner, Alert } from 'reactstrap'
import { Error, Success } from '../../viewhelper'
import FacebookCustomLogin from '../../tables/data-tables/basic/AdminComponent/Settings/FacebookLogin'
import TukitakiLoader from '../DashBoardUI/TukitakiLoader'

const Settings = () => {
    const ref1 = useRef()
    const categoryRef = useRef()
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [reset, setReset] = useState()
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [category, setCategory] = useState([])
    const [haveFacebookResponse, setHaveFacebookResponse] = useState(false)
    const [facebookpageerror, setfacebookpageerror] = useState(null)
    const [subCategory, setSubCategory] = useState([])
    const [dataLoading, setDataLoading] = useState(true)
    const [userInput, setUserInput] = useState({
            pageId: "",
            instagram_actor_id: '',
            allow_admin_facebook_page_post: false,
            allow_other_merchant_facebook_page_post: false,
            facebook_pagepost_page_id: '',
            facebook_user_id: '', 
            user_access_token: '',
            facebook_page_category_localuid: '', 
            facebookpage_subcategory_localuid: '',
            page_name: null,
            page_access_token: null
    })
    const [collaps, setCollaps] = useState({fb_page: true})
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const callApi = async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.getFbpageCategory().then(res => {
            console.log(res)
            setCategory(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })
        await useJwt.getMerchentCampaignSettings().then(res => {
            console.log(res)
            if (res.data.payload.facebook_page_category_localuid && res.data.payload.facebookpage_subcategory_localuid) {
                setSubCategory(category.find(i => i.value.id === res.data.payload?.facebook_page_category_localuid)?.value.subcategory)
            }
            setUserInput({
                    pageId: res.data.payload?.page_id,
                    instagram_actor_id: res.data.payload?.instagram_actor_id,
                    allow_admin_facebook_page_post: res.data.payload?.allow_admin_facebook_page_post,
                    allow_other_merchant_facebook_page_post: res.data.payload?.allow_other_merchant_facebook_page_post,
                    facebook_pagepost_page_id: res.data.payload?.global_facebook_page_id,
                    user_access_token: res.data.payload?.user_access_token,
                    facebook_page_category_localuid: res.data.payload?.facebook_page_category_localuid,
                    facebookpage_subcategory_localuid: res.data.payload?.facebookpage_subcategory_localuid,
                    facebook_user_id: res.data.payload?.facebook_user_id,
                    page_name: res.data.payload?.page_name || null,
                    page_access_token: res.data.payload?.page_access_token || null
            })

            if (!res.data.payload?.global_facebook_page_id) {
                setfacebookpageerror('This feature will active after create a facebook app by this site admin!')
            }

            setDataLoading(false)

        }).catch(err => {
            setDataLoading(false)
            Error(err)
            console.log(err.response)
        })
    }

    useEffect(() => {
       callApi()
    }, [])

    const onSubmit2 = (e) => {
        e.preventDefault()
        const {facebook_pagepost_page_id, allow_admin_facebook_page_post, allow_other_merchant_facebook_page_post, facebook_user_id, app_secret,  user_access_token, pageId, facebook_page_category_localuid, facebookpage_subcategory_localuid} = userInput
        setPointRuleloading(true)
        useJwt.updateFacebookPageCrd({allow_admin_facebook_page_post, allow_other_merchant_facebook_page_post, app_secret, facebook_pagepost_page_id, facebook_user_id, user_access_token, pageId, facebook_page_category_localuid, facebookpage_subcategory_localuid}).then((response) => {
            console.log(response)
            setPointRuleloading(false)
            Success(response)
          }).catch((error) => {
            setfacebookpageerror(error.response?.data?.message || "Error Occurred !")
            console.log(error.response)
            setPointRuleloading(false)
            //Error(error)
          })
    }

    return (
        <Fragment>
            {dataLoading && <Card className="p-2 position-relative" style={{ height: '80vh' }}>
        <TukitakiLoader style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50% ,-50%)' }} />
      </Card>}

      {!dataLoading &&   <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Facebook Page</CardTitle>
                    <CustomInput onChange={(e) => {
                        if (e.target.checked) {
                            setCollaps({...collaps, fb_page: true})
                            setfacebookpageerror(null)
                            setHaveFacebookResponse(false)
                        } else {
                            setCollaps({...collaps, fb_page: false})
                        }
                    }} type='switch' id='fb_page' inline label='' defaultChecked/>
                </CardHeader>
                <Form style={{ width: '100%' }} onSubmit={onSubmit2} autoComplete="off">
                    {
                        collaps.fb_page && <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            {
                                facebookpageerror ? <Col md="12" sm="12" >
                                    <Alert color='danger'>
                                        <div className='alert-body'> {facebookpageerror} </div>
                                    </Alert>
                                </Col> : null
                            }

                            {
                                !haveFacebookResponse ? <Fragment>
                                    <Col sm="3" className='d-flex justify-content-right' >
                                    <FacebookCustomLogin 
                                            appId={userInput.facebook_pagepost_page_id} 
                                            userInput={userInput}
                                            setUserInput={setUserInput}
                                            setHaveFacebookResponse={setHaveFacebookResponse}
                                            />
                                    </Col>
                                </Fragment> : <Fragment>
                                        <Col sm="4">
                                        <FormGroup>
                                            <Label for="pageId">Page Id<span style={{color:'red'}}>*</span></Label>
                                            <Input type="text"
                                                name="pageId"
                                                id='pageId'
                                                value={userInput?.pageId || ""}
                                                onChange={handleChange}
                                                required
                                                placeholder="page id"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebook_page_category_localuid">Facebook Page Category<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                ref={categoryRef}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.facebook_page_category_localuid, label: category.find(i => i.value.id === userInput.facebook_page_category_localuid)?.label || 'select a category'}}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, facebook_page_category_localuid: selected.value.id})
                                                    setSubCategory(selected?.value.subcategory)
                                                }}
                                                options={category}
                                                isLoading={category.length === 0}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                    // position: "absolute"
                                                }}
                                                onFocus={e => categoryRef.current.select.focus()}
                                                value={userInput.facebook_page_category_localuid || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {
                                        (subCategory?.length !== 0) && <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebookpage_subcategory_localuid">Facebook page Sub Category</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.facebookpage_subcategory_localuid, label: subCategory?.find(i => i.uid === userInput.facebookpage_subcategory_localuid)?.name || 'select a subcategory'}}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, facebookpage_subcategory_localuid: selected.value})
                                                }}
                                                isClearable
                                                options={subCategory?.map(item => { return { value: item.uid, label: item.name } })}
                                                isLoading={subCategory?.length === 0}
                                            />
                                        </FormGroup>
                                    </Col>
                                    }

                                       <Col sm="4" className='mb-2 mt-1'>
                                    <FormGroup>
                                        <CustomInput type='switch' onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, allow_admin_facebook_page_post: true })
                                            } else {
                                                setUserInput({ ...userInput, allow_admin_facebook_page_post: false })
                                            }
                                        }
                                        } id='allow_admin_facebook_page_post' label='Allow admin facebook page post?' checked={userInput?.allow_admin_facebook_page_post} />
                                    </FormGroup>
                                </Col>

                                <Col sm="4" className='mb-2 mt-1'>
                                    <FormGroup>
                                        <CustomInput type='switch' onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, allow_other_merchant_facebook_page_post: true })
                                            } else {
                                                setUserInput({ ...userInput, allow_other_merchant_facebook_page_post: false })
                                            }
                                        }
                                        } id='allow_other_merchant_facebook_page_post' label='Allow other merchant facebook page post?' checked={userInput?.allow_other_merchant_facebook_page_post}  />
                                    </FormGroup>
                                </Col>

                                    <Col sm="12" className='text-center mt-2'>
                                        {
                                            pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                                <Spinner color='white' size='sm' />
                                                <span className='ml-50'>Loading...</span>
                                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                                <span >{userInput.page_access_token ? "Update" : "Submit"}</span>
                                            </Button.Ripple>
                                        }
                                    </Col>
                                </Fragment>
                            }

                            </Row>
                        </CardBody>
                    }
                </Form>
            </Card>
         }

        </Fragment>
    )
}

export default Settings