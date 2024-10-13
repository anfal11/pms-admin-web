import { Fragment } from "react"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'

const SetScheduled = ({
    userInput,
    setUserInput,
    adRuleList,
    selectedAdRule,
    setSelectedAdRule,
    handleChange,
    AdRef,
    RptRef,
    MonthRef,
    DayRef
}) => {

    console.log('userInput.repeat_start_date ==> ', userInput.repeat_start_date)
    return (
        <Fragment>
            <Col sm="3" className='mb-1 mt-1'>
                <FormGroup>
                    <CustomInput type='switch' onChange={(e) => {
                        if (e.target.checked) {
                            setUserInput({ ...userInput, is_Ad: true, isScheduled: false, isRepeat: false })
                        } else {
                            setUserInput({ ...userInput, is_Ad: false, isAdScheduled: false })
                            setSelectedAdRule({})
                        }
                    }
                    } id='is_Ad' label='Is AD?' />
                </FormGroup>
            </Col>
            {userInput.is_Ad && false && <Col sm="4">
                <FormGroup>
                    <Label for="ad_rule">Select Ad Rule<span style={{ color: 'red' }}>*</span></Label>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        classNamePrefix='select'
                        value={{ value: selectedAdRule.value, label: selectedAdRule.label ? selectedAdRule.label : 'select...' }}
                        onChange={(selected) => {
                            setSelectedAdRule({ value: selected.value, label: selected.label })
                        }}
                        options={adRuleList?.map(g => { return { value: g.id, label: g.rule_name } })}
                        ref={AdRef}
                    />
                    <Input
                        required
                        style={{
                            opacity: 0,
                            width: "100%",
                            height: 0
                            // position: "absolute"
                        }}
                        onFocus={e => AdRef.current.select.focus()}
                        value={selectedAdRule?.value || ''}
                        onChange={e => ''}
                    />
                </FormGroup>
            </Col>}
            <Col sm='12' />
            {userInput.is_Ad && <Col sm="3" className='mb-1 mt-1'>
                <FormGroup>
                    <CustomInput type='switch' onChange={(e) => {
                        if (e.target.checked) {
                            setUserInput({ ...userInput, isAdScheduled: true })
                        } else {
                            setUserInput({ ...userInput, isAdScheduled: false, startDate: null, endDate: null })
                        }
                    }
                    } id='isAdScheduled' label='Is Ad Scheduled?' />
                </FormGroup>
            </Col>}
            {
                userInput.isAdScheduled && <Col md='4' >
                    <FormGroup>
                        <Label for="startDate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="datetime-local"
                            min={new Date().toLocaleDateString('fr-CA')}
                            name="startDate"
                            id='startDate'
                            value={userInput.startDate}
                            onChange={handleChange}
                            required
                            placeholder='0'
                        />
                    </FormGroup>
                </Col>
            }
            {
                userInput.isAdScheduled && <Col md='4' >
                    <FormGroup>
                        <Label for="endDate">End Date<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="datetime-local"
                            min={new Date().toLocaleDateString('fr-CA')}
                            name="endDate"
                            id='endDate'
                            value={userInput.endDate}
                            onChange={handleChange}
                            required
                            placeholder='0'
                        />
                    </FormGroup>
                </Col>
            }
            <Col sm="3" className='mb-1 mt-1'>
                <FormGroup>
                    <CustomInput type='switch' onChange={(e) => {
                        if (e.target.checked) {
                            setUserInput({ ...userInput, isScheduled: true, isRepeat: false })
                        } else {
                            setUserInput({ ...userInput, isScheduled: false, effective_date: null })
                        }
                    }
                    } id='isScheduled' checked={userInput.isScheduled} label='Is Scheduled?' />
                </FormGroup>
            </Col>
            {
                userInput.isScheduled && <Col md='4' >
                    <FormGroup>
                        <Label for="effective_date">Scheduled Date<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="datetime-local"
                            min={new Date().toLocaleDateString('fr-CA')}
                            name="effective_date"
                            id='effective_date'
                            value={userInput.effective_date}
                            onChange={handleChange}
                            required
                            placeholder='0'
                        />
                    </FormGroup>
                </Col>
            }
            <Col sm='12' />
            <Col sm="3" className='mb-1 mt-1'>
                <FormGroup>
                    <CustomInput type='switch' onChange={(e) => {
                        if (e.target.checked) {
                            setUserInput({ ...userInput, isRepeat: true, isScheduled: false })
                        } else {
                            setUserInput({ ...userInput, isRepeat: false, expiry_date: null, repeat_type: '', repeat_time: null })
                        }
                    }
                    } id='isRepeat' checked={userInput.isRepeat} label='Is Repeat?' />
                </FormGroup>
            </Col>
            {
                userInput.isRepeat && <Col md='4' >
                    <FormGroup>
                        <Label for="startDate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="date"
                            min={new Date().toLocaleDateString('fr-CA')}
                            name="repeat_start_date"
                            id='repeat_start_date'
                            value={userInput.repeat_start_date}
                            onChange={handleChange}
                            required
                            placeholder='0'
                        />
                    </FormGroup>
                </Col>
            }
            {
                userInput.isRepeat && <Col md='4' >
                    <FormGroup>
                        <Label for="expiry_Date">Expiry Date<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="date"
                            min={new Date().toLocaleDateString('fr-CA')}
                            name="expiry_date"
                            id='expiry_date'
                            value={userInput.expiry_date}
                            onChange={handleChange}
                            required
                            placeholder='0'
                        />
                    </FormGroup>
                </Col>
            }
            {
                userInput.isRepeat && <Col sm='4'>
                    <FormGroup>
                        <Label for="repeat_type">Repeat Type<span style={{ color: 'red' }}>*</span></Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            onChange={(selected) => {
                                setUserInput({ ...userInput, repeat_type: selected.value })
                            }}
                            options={[{ value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }]}
                            ref={RptRef}
                        />
                        <Input
                            required
                            style={{
                                opacity: 0,
                                width: "100%",
                                height: 0
                                // position: "absolute"
                            }}
                            onFocus={e => RptRef.current.select.focus()}
                            value={userInput?.repeat_type || ''}
                            onChange={e => ''}
                        />
                    </FormGroup>
                </Col>
            }
            {
                (userInput.isRepeat && userInput.repeat_type === 'Monthly') && <Col md='3' >
                    <FormGroup>
                        <Label for="startDate">Date of Month<span style={{ color: 'red' }}>*</span></Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            // defaultValue={{ value: 1, label: '1' }}
                            onChange={(e) => {
                                if (!e) {
                                    setUserInput({ ...userInput, repeat_month_day: '' })
                                } else {
                                    const a = e.map(ee => ee.label)
                                    setUserInput({ ...userInput, repeat_month_day: a.toString() })
                                }
                            }}
                            options={[
                                { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' },
                                { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 10, label: '10' }, { value: 11, label: '11' }, { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' },
                                { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' }, { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' },
                                { value: 22, label: '22' }, { value: 23, label: '23' }, { value: 24, label: '24' }, { value: 25, label: '25' }, { value: 26, label: '26' }, { value: 27, label: '27' }, { value: 28, label: '28' }, { value: 29, label: '29' }, { value: 30, label: '30' }, { value: 31, label: '31' }
                            ]}
                            menuPlacement='auto'
                            ref={MonthRef}
                            isMulti
                        />
                        <Input
                            required
                            style={{
                                opacity: 0,
                                width: "100%",
                                height: 0
                                // position: "absolute"
                            }}
                            onFocus={e => MonthRef.current.select.focus()}
                            value={userInput?.repeat_month_day || ''}
                            onChange={e => ''}
                        />
                    </FormGroup>
                </Col>
            }
            {
                (userInput.isRepeat && userInput.repeat_type === 'Weekly') && <Col md='3' >
                    <FormGroup>
                        <Label for="startDate">Day<span style={{ color: 'red' }}>*</span></Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            onChange={(e) => {
                                if (!e) {
                                    setUserInput({ ...userInput, repeat_day: '' })
                                } else {
                                    const a = e.map(ee => ee.label)
                                    setUserInput({ ...userInput, repeat_day: a.toString() })
                                }
                            }}
                            options={[{ value: 'Saturday', label: 'Saturday' }, { value: 'Sunday', label: 'Sunday' }, { value: 'Monday', label: 'Monday' }, { value: 'Tuesday', label: 'Tuesday' }, { value: 'Wednesday', label: 'Wednesday' }, { value: 'Thursday', label: 'Thursday' }, { value: 'Friday', label: 'Friday' }]}
                            menuPlacement='auto'
                            ref={DayRef}
                            isMulti
                        />
                        <Input
                            required
                            style={{
                                opacity: 0,
                                width: "100%",
                                height: 0
                                // position: "absolute"
                            }}
                            onFocus={e => DayRef.current.select.focus()}
                            value={userInput?.repeat_day || ''}
                            onChange={e => ''}
                        />
                    </FormGroup>
                </Col>
            }
            {
                (userInput.isRepeat && (userInput.repeat_type === 'Daily' || userInput.repeat_type === 'Weekly' || userInput.repeat_type === 'Monthly')) && <Col md='3' >
                    <FormGroup>
                        <Label for="startDate">Time<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="time"
                            min={new Date().toLocaleDateString('fr-CA')}
                            name="repeat_time"
                            id='repeat_time'
                            value={userInput.repeat_time}
                            onChange={handleChange}
                            required
                            placeholder='0'
                        />
                    </FormGroup>
                </Col>
            }
        </Fragment>
    )
}

export default SetScheduled