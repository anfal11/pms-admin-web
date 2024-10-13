import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, X } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import MapBox from '../MapBox'

const EditAdRuleForm = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [osList, setOsList] = useState([])
    const [lifeEvents, setlifeEvents] = useState([])
    const [interests, setInterests] = useState([])
    const [behaviors, setBehaviors] = useState([])
    const [countries, setCountries] = useState([])
    const [countryCode, setCountryCode] = useState('')
    const [regions, setRegions] = useState([])
    const [groupList, setgroupList] = useState([])
    const [adCampaignList, setadCampaignList] = useState([])
    const [filteredAdCampaignList, setFilteredadCampaignList] = useState([])
    const [keyword, setKeyword] = useState('')
    const adCampRef = useRef()
    const countryRef = useRef()
    const typeRef = useRef()
    const behaviorRef = useRef()
    const interestRef = useRef()
    const lifeEventRef = useRef()
    const relationshipRef = useRef()
    const platformRef = useRef()
    const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('adRuleInfo')))
    const [location, setLocation] = useState({ lat: userInput.latitude, lng: userInput.longtitude })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt2.adCampaignList().then(res => {
            console.log(res)
            const allAds = []
            for (const q of res.data.payload) {
                if (q.common_data.is_approved === true) {
                    allAds.push({...q.common_data})
                }
            }
            setadCampaignList(allAds)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.osList().then((response) => {
            setOsList(response.data.payload.data)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        useJwt.lifeEventList().then((response) => {
            setlifeEvents(response.data.payload.data)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        useJwt.interestList().then((response) => {
            setInterests(response.data.payload.data)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        useJwt.behaviorList().then((response) => {
            setBehaviors(response.data.payload.data)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        useJwt.countryList().then((response) => {
            setCountries(response.data.payload.data)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        useJwt.getCentralGroup().then(res => {
            console.log(res)
            const allGroup = []
            for (const q of res.data.payload) {
                if (q.is_approved) {
                    allGroup.push(q)
                }
            }
            setgroupList(allGroup)
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })
    }, [])
    useEffect(() => {
        setRegions([])
        useJwt.regionList({ countryCode }).then((response) => {
            console.log(response)
            setRegions(response.data.payload.data)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
    }, [countryCode])
    useEffect(() => {
        setFilteredadCampaignList([])
        setFilteredadCampaignList(adCampaignList.filter(i => userInput.rule_type === i.campaign_type))
    }, [userInput.rule_type])

    const onSubmit = (e) => {
        e.preventDefault()
        const { id } = userInput
        console.log({ ...userInput, longtitude: location.lng, latitude: location.lat })
        setPointRuleloading(true)
        useJwt.editAdRule({ ...userInput, longtitude: location.lng, latitude: location.lat }).then((response) => {
            setPointRuleloading(false)
            Success(response)
            history.push(userData?.role === 'vendor' ? '/adRuleListVendor' : '/adRuleList')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
        })
    }

    return (
        <Fragment>
            <Form style={{ width: '100%', paddingBottom: '100px' }} onSubmit={onSubmit} autoComplete="off">
                <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/adRuleListVendor' : '/adRuleList'} >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Campaign Rule Details</CardTitle>
                            </CardHeader>
                            <CardBody style={{ paddingTop: '15px' }}>
                                <Row>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="campaign_objective">Campaign Objective<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="text"
                                                name="campaign_objective"
                                                id='campaign_objective'
                                                value={userInput?.campaign_objective}
                                                onChange={handleChange}
                                                required
                                                placeholder="campaign objective..."
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="rule_name">Rule Name<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="text"
                                                name="rule_name"
                                                id='rule_name'
                                                value={userInput?.rule_name}
                                                onChange={handleChange}
                                                required
                                                placeholder="rule name"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="start_date">Start Date<span style={{ color: 'red' }}>*</span></Label>
                                            <Input
                                                type="date"
                                                name="start_date"
                                                id='start_date'
                                                value={new Date(userInput?.start_date).toLocaleDateString('fr-CA')}
                                                onChange={handleChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="expired_date">Expiry Date<span style={{ color: 'red' }}>*</span></Label>
                                            <Input
                                                type="date"
                                                name="expired_date"
                                                id='expired_date'
                                                value={new Date(userInput?.expired_date).toLocaleDateString('fr-CA')}
                                                onChange={handleChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm='4'>
                        <FormGroup>
                            <Label for="rule_type">Select Rule Type<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                // isClearable={true}
                                maxMenuHeight={200}
                                ref={typeRef}
                                className='react-select'
                                classNamePrefix='select'
                                menuPlacement='auto'
                                value={[{ value: 'facebook', label: 'Facebook' }, { value: 'google', label: 'Google' }, { value: 'both', label: 'Both' }].find(rt => rt.value === userInput.rule_type)}
                                onChange={e => {
                                    setUserInput({ ...userInput, rule_type: e.value })
                                }}
                                name='interest'
                                options={[{ value: 'facebook', label: 'Facebook' }, { value: 'google', label: 'Google' }, { value: 'both', label: 'Both' }]}
                            />
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                }}
                                onFocus={e => typeRef.current.select.focus()}
                                value={userInput.rule_type || ''}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm='4'>
                        <FormGroup>
                            <Label for="ad_campaign">Select AD Campaign<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                // isClearable={true}
                                maxMenuHeight={200}
                                ref={typeRef}
                                className='react-select'
                                classNamePrefix='select'
                                menuPlacement='auto'
                                value={{ value: adCampaignList.find(ac => ac.id === userInput.ad_campaign)?.id, label: adCampaignList.find(ac => ac.id === userInput.ad_campaign)?.name || 'Select...' }}
                                onChange={e => {
                                    setUserInput({ ...userInput, ad_campaign: e.value })
                                }}
                                name='interest'
                                options={filteredAdCampaignList.map(ac => { return { value: ac.id, label: ac.name } })}
                            />
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                }}
                                onFocus={e => adCampRef.current.select.focus()}
                                value={userInput.ad_campaign || ''}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody style={{ paddingTop: '25px' }}>
                                <Row>
                                    <Col md='5' sm='12'>
                                        <Label className='d-block mb-1'>Gender<span style={{ color: 'red' }}>*</span></Label>
                                        <FormGroup check inline className='mr-2'>
                                            <CustomInput type='radio' name='all' id='all' checked={userInput?.gender === null}
                                                onChange={() => {
                                                    setUserInput({ ...userInput, gender: null })
                                                }} label='All' disabled={userInput.isCustomizeGroup}
                                            />
                                        </FormGroup>
                                        <FormGroup check inline className='mr-2'>
                                            <CustomInput type='radio' name='males' id='males' checked={userInput?.gender === '1'}
                                                onChange={() => {
                                                    setUserInput({ ...userInput, gender: '1' })
                                                }} label='Males'  disabled={userInput.isCustomizeGroup}
                                            />
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <CustomInput type='radio' name='females' id='females' checked={userInput?.gender === '2'}
                                                onChange={() => {
                                                    setUserInput({ ...userInput, gender: '2' })
                                                }} label='Females'  disabled={userInput.isCustomizeGroup}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="5" >
                                        <FormGroup>
                                            <Label for="max_age" className='d-block mb-1'>Age<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="number"
                                                name="max_age"
                                                id='max_age'
                                                value={userInput?.max_age}
                                                onChange={e => setUserInput({ ...userInput, max_age: parseInt(e.target.value) })}
                                                required
                                                placeholder="0"
                                                disabled={userInput.isCustomizeGroup}
                                                style={{ display: 'inline', width: '80px' }}
                                            />
                                            <label className='mr-1 ml-1'>to</label>
                                            <Input type="number"
                                                name="min_age"
                                                id='min_age'
                                                value={userInput?.min_age}
                                                onChange={e => setUserInput({ ...userInput, min_age: parseInt(e.target.value) })}
                                                required
                                                placeholder="0"
                                                disabled={userInput.isCustomizeGroup}
                                                style={{ display: 'inline', width: '80px' }}
                                            />
                                            <label className='mr-1 ml-1'>years</label>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="5" >
                                        <FormGroup>
                                            <CustomInput
                                                type='switch'
                                                id='isCertainTimeline'
                                                name='isCertainTimeline'
                                                label='Customize Group'
                                                checked={userInput?.isCustomizeGroup}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUserInput({ ...userInput, isCustomizeGroup: true })
                                                    } else {
                                                        setUserInput({ ...userInput, isCustomizeGroup: false })
                                                    }
                                                }
                                                }
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        {userInput?.isCustomizeGroup && <FormGroup>
                                            <Label for="max_age">Group</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                // isClearable={true}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                menuPlacement='auto'
                                                // isMulti
                                                value={
                                                    groupList?.map(ser => {
                                                            for (const sser of userInput?.group || []) {
                                                                if (sser === ser.id) {
                                                                    return {value: sser, label: ser.group_name}
                                                                }
                                                            }
                                                        })
                                                }
                                                onChange={e => {
                                                    // const a = e.map(ee => ee.value)
                                                    setUserInput({ ...userInput, group: e.value })
                                                }}
                                                name='user_os'
                                                isLoading={groupList.length === 0}
                                                required
                                                options={groupList?.map(d => { return { value: d.id, label: `${d.id}. ${d.group_name}` } })}
                                            />
                                        </FormGroup>}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row className='match-height'>
                    <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Device Info/Device Platform<span style={{ color: 'red' }}>*</span></CardTitle>
                            </CardHeader>
                            <CardBody style={{ paddingTop: '15px' }}>
                                <FormGroup check inline className='mr-2'>
                                    <CustomInput type='checkbox' name='alld' id='alld' checked={userInput?.device_platform?.length === 2}
                                        onChange={() => {
                                            setUserInput({ ...userInput, device_platform: ['1', '2'] })
                                        }}
                                        label='All'
                                    />
                                </FormGroup>
                                <FormGroup check inline className='mr-2'>
                                    <CustomInput type='checkbox' name='mobile' id='mobile' checked={userInput?.device_platform?.length === 1 && userInput?.device_platform.includes('1')}
                                        onChange={() => {
                                            setUserInput({ ...userInput, device_platform: ['1'] })
                                        }} label='Mobile'
                                    />
                                </FormGroup>
                                <FormGroup check inline>
                                    <CustomInput type='checkbox' name='desktop' id='desktop' checked={userInput?.device_platform?.length === 1 && userInput?.device_platform.includes('2')}
                                        onChange={() => {
                                            setUserInput({ ...userInput, device_platform: ['2'] })
                                        }} label='Desktop'
                                    />
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                    {
                        !userInput?.isCustomizeGroup && <Col sm='6'>
                            <Card>
                                <CardHeader className='border-bottom'>
                                    <CardTitle tag='h4'>OS Version/User OS</CardTitle>
                                </CardHeader>
                                <CardBody style={{ paddingTop: '15px' }}>
                                    <FormGroup>
                                        <Select
                                            theme={selectThemeColors}
                                            isClearable={false}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            menuPlacement='auto'
                                            isMulti
                                            value={userInput.user_os?.map(o => { return { value: o, label: o } })}
                                            onChange={e => {
                                                let a = e.map(ee => ee.value)
                                                if (a.length === 0 || a.includes('all')) {
                                                    a = osList.map(o => o.platform)
                                                }
                                                setUserInput({ ...userInput, user_os: a })
                                            }}
                                            name='user_os'
                                            isLoading={osList.length === 0}
                                            required
                                            options={[{ value: 'all', label: 'All' }, ...osList.map(o => { return { value: o.platform, label: o.platform } })]}
                                        />
                                    </FormGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    }
                </Row>

                <Row>
                    <Col sm="4" >
                        <FormGroup>
                            <Label for="country">Country<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                isClearable={false}
                                maxMenuHeight={200}
                                ref={countryRef}
                                className='react-select'
                                classNamePrefix='select'
                                value={{ value: userInput.country, label: userInput.country }}
                                onChange={e => {
                                    setCountryCode(e.value)
                                    setUserInput({ ...userInput, country: e.label, country_code: e.value })
                                }}
                                isLoading={countries.length === 0}
                                name='colors'
                                options={countries.map(o => { return { value: o.key, label: o.name } })}
                            />
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                }}
                                onFocus={e => countryRef.current.select.focus()}
                                value={userInput?.country || ''}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col>
                    {/* <Col sm="4" >
                        <FormGroup>
                            <Label for="region">Region<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                isClearable={false}
                                maxMenuHeight={200}
                                ref={regionRef}
                                className='react-select'
                                classNamePrefix='select'
                                isLoading={regions.length === 0}
                                isMulti
                                value={userInput.region?.map(o => { return { value: o, label: o } })}
                                onChange={e => {
                                    const a = e.map(ee => ee.value)
                                    setUserInput({ ...userInput, region: a })
                                }}
                                name='region'
                                options={regions.map(o => { return { value: o.name, label: o.name } })}
                            />
                            <Input
                                required
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: 0
                                }}
                                onFocus={e => regionRef.current.select.focus()}
                                value={userInput?.region || ''}
                                onChange={e => ''}
                            />
                        </FormGroup>
                    </Col> */}
                </Row>
                <Row className='match-height'>
                {
                    (userInput.rule_type === 'google' || userInput.rule_type === 'both') && <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Google</CardTitle>
                            </CardHeader>
                            <CardBody style={{ paddingTop: '15px' }}>
                                <Row>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="keyword">Keywords<span style={{ color: 'red' }}>*</span></Label>
                                            <div className='d-flex align-items-center'>
                                                <InputGroup style={{ width: '280px' }}>
                                                    <Input type="text"
                                                        name="keyword"
                                                        id='keyword'
                                                        value={keyword}
                                                        onChange={e => setKeyword(e.target.value)}
                                                        placeholder="your answer"
                                                        disabled={userInput?.keyword?.length > 4}
                                                    />
                                                    <InputGroupAddon addonType='append'>
                                                        <Button style={{ zIndex: '0' }} color='primary' outline onClick={() => {
                                                            if (keyword) {
                                                                setUserInput({ ...userInput, keyword: [...userInput?.keyword, keyword] })
                                                                setKeyword('')
                                                            }
                                                        }}>
                                                            Add
                                                        </Button>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <h6 className='ml-1'>{5 - userInput?.keyword?.length} left</h6>
                                            </div>
                                            <div className='d-flex mt-1'>
                                                {userInput?.keyword?.map((k, index) => <InputGroup key={index} style={{ width: '100px', marginRight: '10px' }}>
                                                    <InputGroupAddon addonType='prepend'>
                                                        <Button style={{ width: '35px', padding: '5px' }} color='primary' outline onClick={() => {
                                                            userInput?.keyword.splice(userInput?.keyword.indexOf(k), 1)
                                                            setUserInput({ ...userInput, keyword: [...userInput?.keyword] })
                                                        }}>
                                                            <X size={12} />
                                                        </Button>
                                                    </InputGroupAddon>
                                                    <Input type="text"
                                                        name="keyword"
                                                        id='keyword'
                                                        style={{ fontSize: '10px', padding: '5px' }}
                                                        value={k}
                                                        disabled
                                                        onChange={() => { }}
                                                    />
                                                </InputGroup>)}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="income">Income Info(yearly)<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="text"
                                                name="income"
                                                id='income'
                                                value={userInput?.income}
                                                onChange={handleChange}
                                                required
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm='12' className='mb-1'>Proximity Info</Col>
                                    <Col sm='12' className='mb-1'>
                                         <MapBox location={location} setLocation={setLocation} />
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="radius_unit">Radius Unit</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                isClearable={true}
                                                maxMenuHeight={200}
                                                ref={behaviorRef}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ label: userInput.radius_unit }}
                                                onChange={selected => {
                                                    setUserInput({ ...userInput, radius_unit: selected?.value })
                                                }}
                                                name='behavior'
                                                options={[{ value: 'UNSPECIFIED', label: 'UNSPECIFIED' }, { value: 'UNKNOWN', label: 'UNKNOWN' }, { value: 'MILES', label: 'MILES' }, { value: 'KILOMETERS', label: 'KILOMETERS' }]}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="radius">Radius</Label>
                                            <Input type="number"
                                                name="radius"
                                                id='radius'
                                                value={userInput?.radius}
                                                onChange={e => setUserInput({ ...userInput, radius: parseInt(e.target.value) })}
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="province_name">Province Name</Label>
                                            <Input type="text"
                                                name="province_name"
                                                id='province_name'
                                                value={userInput?.province_name}
                                                onChange={handleChange}
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="province_code">Province Code</Label>
                                            <Input type="text"
                                                name="province_code"
                                                id='province_code'
                                                value={userInput?.province_code}
                                                onChange={handleChange}
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="postal_code">Postal Code</Label>
                                            <Input type="text"
                                                name="postal_code"
                                                id='postal_code'
                                                value={userInput?.postal_code}
                                                onChange={handleChange}
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="6" >
                                        <FormGroup>
                                            <Label for="city_name">City Name</Label>
                                            <Input type="text"
                                                name="city_name"
                                                id='city_name'
                                                value={userInput?.city_name}
                                                onChange={handleChange}
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="street_address">Street Address</Label>
                                            <Input type="text"
                                                name="street_address"
                                                id='street_address'
                                                value={userInput?.street_address}
                                                onChange={handleChange}
                                                placeholder="your answer"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                }
                 {
                    (userInput.rule_type === 'facebook' || userInput.rule_type === 'both') && <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Facebook/Instagram</CardTitle>
                            </CardHeader>
                            <CardBody style={{ paddingTop: '15px' }}>
                                <Row>
                                    <Col sm="8">
                                        <FormGroup>
                                            <Label for="interest">Select Category<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                isClearable={true}
                                                maxMenuHeight={200}
                                                ref={interestRef}
                                                className='react-select'
                                                classNamePrefix='select'
                                                isMulti
                                                menuPlacement='auto'
                                                value={userInput.interest?.map(o => { return { value: o, label: o } })}
                                                onChange={e => {
                                                    let a = e.map(ee => ee.value)
                                                    let b = e.map(ee => ee.label)
                                                    if (a.length === 0 || a.includes('all')) {
                                                        a = interests.map(o => o.name)
                                                        b = interests.map(o => o.id)
                                                    }
                                                    setUserInput({ ...userInput, interest: a, interest_id: b })
                                                }}
                                                name='interest'
                                                isLoading={interests.length === 0}
                                                options={[{ value: 'all', label: 'All' }, ...interests.map(o => { return { value: o.id, label: o.name } })]}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                }}
                                                onFocus={e => interestRef.current.select.focus()}
                                                value={userInput?.interest || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="8" >
                                        <FormGroup>
                                            <Label for="quotaType">Behavior<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                isClearable={true}
                                                maxMenuHeight={200}
                                                ref={behaviorRef}
                                                className='react-select'
                                                classNamePrefix='select'
                                                isMulti
                                                value={userInput.behavior?.map(o => { return { value: o, label: o } })}
                                                onChange={e => {
                                                    let a = e.map(ee => ee.value)
                                                    if (a.length === 0 || a.includes('all')) {
                                                        a = behaviors.map(o => o.name)
                                                    }
                                                    setUserInput({ ...userInput, behavior: a })
                                                }}
                                                name='behavior'
                                                isLoading={behaviors.length === 0}
                                                options={[{ value: 'all', label: 'All' }, ...behaviors.map(o => { return { value: o.name, label: o.name } })]}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                }}
                                                onFocus={e => behaviorRef.current.select.focus()}
                                                value={userInput?.behavior || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="8" >
                                        <FormGroup>
                                            <Label for="life_event">Life Event<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                isClearable={true}
                                                maxMenuHeight={200}
                                                ref={lifeEventRef}
                                                className='react-select'
                                                classNamePrefix='select'
                                                isMulti
                                                menuPlacement='auto'
                                                value={userInput.life_event?.map(o => { return { value: o, label: o } })}
                                                onChange={e => {
                                                    let a = e.map(ee => ee.value)
                                                    if (a.length === 0 || a.includes('all')) {
                                                        a = lifeEvents.map(o => o.name)
                                                    }
                                                    setUserInput({ ...userInput, life_event: a })
                                                }}
                                                name='life_event'
                                                isLoading={lifeEvents.length === 0}
                                                options={[{ value: 'all', label: 'All' }, ...lifeEvents.map(o => { return { value: o.name, label: o.name } })]}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                }}
                                                onFocus={e => lifeEventRef.current.select.focus()}
                                                value={userInput?.life_event || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='8' sm='8' className='mb-1'>
                                        <Label>Relationship Status<span style={{ color: 'red' }}>*</span></Label>
                                        <Select
                                            isClearable={false}
                                            theme={selectThemeColors}
                                            ref={relationshipRef}
                                            menuPlacement='auto'
                                            value={userInput.relationship_status?.map(o => { return { value: o, label: o.toString() === '1' ? 'Single' : o.toString() === '2' ? 'In Relationship' : o.toString() === '3' ? 'Married' : o.toString() === '4' ? 'Engaged' : o.toString() === '6' ? 'Not specified' : o.toString() === '7' ? 'In a civil union' : o.toString() === '8' ? 'In a domestic partnership' : o.toString() === '9' ? 'In an open relationship' : o.toString() === '10' ? "It's Complicated" : o.toString() === '11' ? 'Separated' : o.toString() === '12' ? 'Divorced' : o.toString() === '13' ? 'Widowed' : 'ALL' } })}
                                            onChange={e => {
                                                let a = e.map(ee => ee.value)
                                                if (a.length === 0 || a.includes('all')) {
                                                    a = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
                                                }
                                                setUserInput({ ...userInput, relationship_status: a })
                                            }}
                                            isMulti
                                            name='relationship_status'
                                            options={[{ value: 'all', label: 'All' }, { value: '1', label: 'Single' }, { value: '2', label: 'In Relationship' }, { value: '3', label: 'Married' }, { value: '4', label: 'Engaged' }, { value: '6', label: 'Not specified' }, { value: '7', label: 'In a civil union' }, { value: '8', label: 'In a domestic partnership' }, { value: '9', label: 'In an open relationship' }, { value: '10', label: "It's Complicated " }, { value: '11', label: 'Separated' }, { value: '12', label: 'Divorced' }, { value: '13', label: 'Widowed' }]}
                                            className='react-select'
                                            classNamePrefix='select'
                                        />
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                            }}
                                            onFocus={e => relationshipRef.current.select.focus()}
                                            value={userInput?.relationship_status || ''}
                                            onChange={e => ''}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    }
                </Row>


                <Col className='text-center'>
                    {
                        pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                            <Spinner color='white' size='sm' />
                            <span className='ml-50'>Loading...</span>
                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                            <span >Update</span>
                        </Button.Ripple>
                    }
                </Col>
            </Form>
        </Fragment>
    )
}

export default EditAdRuleForm