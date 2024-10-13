import { useRTL } from '@hooks/useRTL'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState, useMemo } from 'react'
import { ChevronLeft, FileText, Search, UploadCloud, X } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner, Table } from 'reactstrap'
import XLSX from "xlsx"
import { Error, Success } from '../../viewhelper'
import { Upload } from "antd"
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import "antd/dist/antd.css"
import UploadCsvGroup from './UploadCsvGroup'
import {GroupProfiling, GroupProfilingItems} from './GroupProfiling'


const CreateGroup = () => {
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const typeRef = useRef()
    const createtypeRef = useRef()
    const history = useHistory()

    const [rowNumber, setRowNumber] = useState(0)
    const [groupRules, setgroupRules] = useState([])
    const [groupRulesDropdown, setgroupRulesDropdown] = useState([])
    const [isserviceLoading, setisserviceLoading] = useState(true)
    const [needRefresh, setneedRefresh] = useState(false)

    const [customcodecsvurl, setcustomcodecsvurl] = useState(null)
    const [conditions, setconditions] = useState({})
    const [userInput, setUserInput] = useState({
        group_name: '',
        type: 1,
        creation_type: null,
        member_list: [],
        csv_file_name: '',
        sync_type: "One-Time",
        sync_expire_days: 15,
        multiService: []

    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const handleChange2 = (e) => {
        setconditions({ ...conditions, [e.target.name]: e.target.value })
        // setneedRefresh(!needRefresh)
    }

    const unselectProfileItems = (id) => {
        const data = userInput.multiService.filter(item => id !== item)
        setUserInput({ ...userInput, multiService: data })
        const modifyObj = {...conditions}
        delete modifyObj[id]
        setconditions(modifyObj)
    }

    useEffect(() => {
  
        useJwt2.getGroupRules().then(res => {
            setgroupRules(res.data.payload)
            const dropdownData = res.data.payload.map(item => {
                return {
                    label: `${item.target_column_label_name} (${item.target_column})`,
                    value: item.id
                }
            })
            setgroupRulesDropdown(dropdownData)
            setisserviceLoading(false)
        }).catch(err => {
            setisserviceLoading(false)
            Error(err)
        })
        // useJwt.customerBusinessList().then(async res => {
        //     const { payload } = await res.data
        //     console.log(payload)
        //     setBusinessList(payload)
        // }).catch(err => {
        //     console.log(err.response)
        //     Error(err)
        // })
    }, [])


    const handleFile = (file /*:File*/) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader()
        const rABS = !!reader.readAsBinaryString
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" })
            /* Get first worksheet */
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {
                header: 1
            })
            setRowNumber(data.length - 1)
            console.log(
                "data",
                data.map((x) => { return { MSISDN: x[0] } }).filter(y => !!y).splice(1)
            )
            // setModalMSISDN(data.map((x) => { return { MSISDN: x[0] } }).filter(y => !!y).splice(1))
            /* Update state */
            //   this.setState({ data: data, cols: make_cols(ws["!ref"]) })
        }
        if (rABS) reader.readAsBinaryString(file)
        else reader.readAsArrayBuffer(file)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!customcodecsvurl && userInput.creation_type === 1) {
            Error({response: { status : 404, data: { message: 'Please wait for file upload'} }})
            return 0
        }
        // Convert keys to an array
        const keysArray = Object.keys(conditions)
        const conditionData = keysArray.map(item => {
            return {
                rilac_dynamic_group_profiling_rule_id: item,
                data_values: conditions[item]
            }
        }) 
        setPointRuleloading(true)
        useJwt2.createGroupV3({ ...userInput, report_file: customcodecsvurl, conditions: conditionData }).then((response) => {
            setPointRuleloading(false)
            Success(response)
            history.push('/AllCentralGroups')
        }).catch((error) => {
            Error(error)
            setPointRuleloading(false)
        })
    }
   
    const uploadCsvGroupMemo = useMemo(() => {

        return  userInput.creation_type === 1 ? <Col md="12">
            <UploadCsvGroup setcustomcodecsvurl={setcustomcodecsvurl} handleFile={handleFile}/>
        </Col> : null
      }, [userInput.creation_type, setcustomcodecsvurl])

    const GroupProfilingItemMemo = useMemo(() => <GroupProfilingItems 
               userInput = {userInput} 
               handleChange = {handleChange2}
               groupRules = {groupRules}
               unselectProfileItems = {unselectProfileItems}
               conditions = {conditions}
               setconditions = {setconditions}
               needRefresh = {needRefresh}
               setneedRefresh = {setneedRefresh}
            />, [userInput.creation_type, conditions, userInput.multiService])


    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/AllCentralGroups' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Create Group</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="group_name">Group Name<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="group_name"
                                        id='group_name'
                                        value={userInput.group_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="group name..."
                                    />
                                </FormGroup>
                            </Col>
        
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="type">Group Creation Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={createtypeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(selected) => setUserInput({...userInput, creation_type: selected.value})}
                                        options={[{ value: 2, label: 'Group Profiling' }, { value: 1, label: 'Bulk Upload' }]}
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
                                    onFocus={e => createtypeRef.current.select.focus()}
                                    value={userInput.type || ''}
                                    onChange={e => ''}
                                />
                            </Col>
                    
                            {
                                userInput.creation_type === 2 && <GroupProfiling 
                                    userInput={userInput} 
                                    handleChange={handleChange} 
                                    setUserInput={setUserInput} 
                                    groupRules={groupRules}
                                    groupRulesDropdown={groupRulesDropdown}
                                    isserviceLoading={isserviceLoading}
                                />
                            }
                       
                            {
                                userInput.creation_type === 1 && uploadCsvGroupMemo
                            }

                       
                        </Row>
                    </CardBody>
                </Card>

                {
                   userInput.creation_type === 2 && GroupProfilingItemMemo
                }
                <Row>
                    <Col sm="12" className='text-center'>
                        {
                            pointRuleloading ? <Button.Ripple color='primary' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Row>

            </Form>
        </Fragment>
    )
}

export default CreateGroup