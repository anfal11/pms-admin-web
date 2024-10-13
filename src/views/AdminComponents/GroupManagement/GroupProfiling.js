import React, { Fragment, memo } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput,  FormGroup, Input, Label, Row, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import {BeatLoader} from "react-spinners"   
import { X } from 'react-feather'
import { DatePicker, TimePicker } from 'antd'


const SyncTypes = [
    { value: "One-Time", label: 'One-Time' }, 
    { value: "Every-Day", label: 'Every-Day' },
    { value: "Every-Month", label: 'Every-Month First Day' }, 
    { value: "Every-Year", label: 'Every-Year First Day' }
]


const GroupProfiling = ({userInput, handleChange, setUserInput, groupRulesDropdown, groupRules, isserviceLoading}) => {

    return (
        <Fragment>

                <Col sm="4" >
                    <FormGroup>
                        <Label for="group_name">Sync-Type<span style={{ color: 'red' }}>*</span></Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            defaultValue={SyncTypes[0]}
                            onChange={(selected) => setUserInput({...userInput, sync_type: selected.value})}
                            options={SyncTypes}
                        />
                    </FormGroup>
                </Col>
                {
                    userInput.sync_type !== 'One-Time' &&  <Col sm="4" >
                    <FormGroup>
                        <Label for="sync_expire_days">Sync-Expiry Days<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="number"
                            name="sync_expire_days"
                            id='sync_expire_days'
                            value={userInput.sync_expire_days}
                            onChange={handleChange}
                            required
                            placeholder="sync expire days..."
                            onWheel={(e) => e.target.blur()}
                            min={0}
                            step={1}

                        />
                    </FormGroup>
                </Col> 
                }

               <Col sm="8" >
                    <FormGroup>
                        {
                        !isserviceLoading ? <Card className="border p-1">
                                <CardHeader className='border-bottom'>
                                <CardTitle tag='h6' style={{fontSize:14}}>Select Fields<span style={{ color: 'red' }}>*</span></CardTitle>
                                <CardTitle tag='h6'><CustomInput
                                    type='checkbox'
                                    id={'All'}
                                    label={'Select All'}
                                    inline
                                    checked={userInput.multiService.length === groupRulesDropdown.length}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, multiService: groupRulesDropdown.map(sr => sr.value)})
                                        } else {
                                            setUserInput({ ...userInput, multiService: []})
                                        }
                                    }}
                                /></CardTitle>
                            </CardHeader>
                            <CardBody className='pt-1 pb-0 overflow-auto' style={{maxHeight: '130px'}}>
                            {
                                groupRulesDropdown.map(item => <CustomInput
                                        type='checkbox'
                                        id={item.value}
                                        label={item.label}
                                        onChange={ e => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, multiService: [...userInput.multiService, item.value]})
                                            } else {
                                                const newArr = userInput.multiService.filter(i => i !== item.value)
                                                setUserInput({ ...userInput, multiService: [...newArr]})
                                            }
                                        }}
                                        checked={userInput.multiService.includes(item.value)}
                                    />)
                            }
                            </CardBody>
                        </Card> : <BeatLoader color="#6610f2" size={10}/>
                        }
  
                    </FormGroup>
            </Col>

        </Fragment>
    )
}

const NumberField = ({value, onChange, keyword, step}) => <Input type="number"
        name={keyword}
        id={keyword}
        value={value}
        onChange={onChange}
        required
        // placeholder="sync expire days..."
        onWheel={(e) => e.target.blur()}
        min={0}
        step={step}
        onKeyDown={(e) => (step === 1 ? e.key === '.' && e.preventDefault() : e.key)}
    />

const TextField = ({value, onChange, keyword}) => <Input type="text"
        name={keyword}
        id={keyword}
        value={value}
        onChange={onChange}
        required
        // placeholder="sync expire days..."
        onWheel={(e) => e.target.blur()}
   />

// onChange = (date, dateString)
const DateField = ({onChange, className}) =>  <DatePicker className={className} onChange={onChange} />
const TimeField = ({onChange, className}) => <TimePicker onChange={onChange} className={className}/>
// onChange={(value, dateString)
const DateTimeField = ({onChange, className}) =>  <DatePicker showTime onChange={onChange} className={className}/>

// only date..
const DateRange = ({onChange, className}) => <DatePicker.RangePicker onChange={onChange} format="YYYY-MM-DD" className={className}/>
const TimeRange = ({onChange, className}) => <TimePicker.RangePicker onChange={onChange} format="HH:mm:ss" className={className}/>
const DateTimeRange = ({onChange, className}) => <DatePicker.RangePicker onChange={onChange} format="YYYY-MM-DD HH:mm:ss" showTime className={className}/>

const NumberRange = ({step, onChange, onChange2, keyword1, keyword2}) => {
    return   <InputGroup >
        <Input 
            type="number" 
            step={step} 
            onChange={onChange} 
            name={keyword1} 
            min={0}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => (step === 1 ? e.key === '.' && e.preventDefault() : e.key)}
        />
        <InputGroupAddon addonType='append'>
          <InputGroupText>~</InputGroupText>
        </InputGroupAddon>
        <Input 
            type="number" 
            step={step} 
            onChange={onChange2} 
            name={keyword2} 
            min={0}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => (step === 1 ? e.key === '.' && e.preventDefault() : e.key)}
        />  
    </InputGroup>
}

const DropDownField = ({value, onChange, isMulti}) => <Select
        theme={selectThemeColors}
        maxMenuHeight={200}
        className='react-select'
        classNamePrefix='select'
        onChange={onChange}
        options={value}
        isMulti={isMulti}
    />

const GroupProfilingItems = memo(({userInput, handleChange, groupRules, unselectProfileItems, conditions, setconditions, setneedRefresh, needRefresh}) => {
    return <Fragment>
        <Row id="DynamicGroupProfiling">
            {
                userInput.multiService.map((item) => {
                    const itemmatchvalue = (groupRules.filter(fitem => fitem.id === item))[0]
                    return  <Col sm='4' style={{padding: '5px'}} key={item}>
                    <Card style={{margin: 0}}>
                        <CardBody style={{padding: '.7rem'}}>
                        <div style={{ backgroundColor: '#006496', padding: '6px 15px', marginBottom: '15px' }}><h6 className='m-0 text-white'>{itemmatchvalue['target_column_label_name']} <X onClick={() => unselectProfileItems(item) } size={17} style={{ position: 'absolute', right: '20px', cursor: 'pointer' }} /> </h6></div>
                    <FormGroup>
                            <Label for={itemmatchvalue['input_label_name']}>{itemmatchvalue['input_label_name']}-{itemmatchvalue['condition_type']}-{itemmatchvalue['condition_subtype']}</Label>
                            {(() => {
                                switch (itemmatchvalue['condition_type']) {
                                case 'number':
                                     return  <NumberField 
                                        value={conditions[item] || ""} 
                                        onChange={handleChange} 
                                        keyword={item} 
                                        step={ (itemmatchvalue['condition_subtype'] === 'int' || itemmatchvalue['condition_subtype'] === 'integer') ? 1 : 0.01} 
                                     />
                                case 'text':
                                    return  <TextField 
                                        value={conditions[item] || ""} 
                                        onChange={handleChange} 
                                        keyword={item} 
                                     />
                                case 'dropdown':
                                    return  <DropDownField 
                                        value={itemmatchvalue['condition_value'] || []} 
                                        onChange={(selected) => {
                                            console.log('selected => ', selected)
                                            if (itemmatchvalue['condition_subtype'] === 'multiple') {
                                                if (selected) {
                                                    const ids = selected.map(ii => ii.value)
                                                    setconditions({...conditions, [item]: ids})
                                                    // setneedRefresh(!needRefresh)
                                                } else {
                                                    setconditions({...conditions, [item]: []})
                                                    // setneedRefresh(!needRefresh)
                                                }
                                            } else {
                                                setconditions({...conditions, [item]: selected.value})
                                                // setneedRefresh(!needRefresh)
                                            }
                                        }} 
                                        isMulti={itemmatchvalue['condition_subtype'] === 'multiple'} 
                                    />

                                case 'date-time':
                                     switch (itemmatchvalue['condition_subtype']) {
                                        case 'date' :
                                            return <DateField className="form-control" onChange = {(date, dateString) => setconditions({...conditions, [item]: dateString})}/>
                                        case 'time' :
                                            return <TimeField className="form-control" onChange = {(time, timeString) => setconditions({...conditions, [item]: timeString})}/>
                                        case 'date-time' :
                                            return <DateTimeField className="form-control" onChange = {(datetime, datetimeString) => setconditions({...conditions, [item]: datetimeString})}/>
                                     }

                                case 'range':
                                    switch (itemmatchvalue['condition_subtype']) {
                                        case 'integer' :
                                            return  <NumberRange 
                                                        onChange={(e) => setconditions({...conditions, [item]: {...conditions[item], min : e.target.value}})} 
                                                        onChange2={(e) => setconditions({...conditions, [item]: {...conditions[item], max : e.target.value}})} 
                                                        keyword={`${item}-`} 
                                                        keyword2={`${item}--`} 
                                                        step={1} 
                                                    />
                                        case 'int' :
                                            return  <NumberRange 
                                                        onChange={(e) => setconditions({...conditions, [item]: {...conditions[item], min : e.target.value}})} 
                                                        onChange2={(e) => setconditions({...conditions, [item]: {...conditions[item], max : e.target.value}})} 
                                                        keyword={`${item}-`} 
                                                        keyword2={`${item}--`} 
                                                        step={1} 
                                                    />

                                        case 'number' :
                                            return  <NumberRange 
                                                        onChange={(e) => setconditions({...conditions, [item]: {...conditions[item], min : e.target.value}})} 
                                                        onChange2={(e) => setconditions({...conditions, [item]: {...conditions[item], max : e.target.value}})} 
                                                        keyword={`${item}-`} 
                                                        keyword2={`${item}--`} 
                                                        step={0.01} 
                                                    />
                        
                                        case 'date' :
                                            return <DateRange className="form-control" onChange = {(date, dateString) => setconditions({...conditions, [item]: {min: dateString[0], max: dateString[1]}})}/>
                                        case 'time' :
                                            return <TimeRange className="form-control" onChange = {(time, timeString) => setconditions({...conditions, [item]: {min: timeString[0], max:timeString[1]}})}/>
                                        case 'date-time' :
                                            return <DateTimeRange className="form-control" onChange = {(datetime, datetimeString) => setconditions({...conditions, [item]: {min: datetimeString[0], max:datetimeString[1]}}) }/>

                                     }

                                }
                            })()}
                        </FormGroup>
                        
                        </CardBody>
                    </Card>
                
                  </Col>
                })
                        
            }
        </Row>
    </Fragment>
})

export { GroupProfilingItems, GroupProfiling }