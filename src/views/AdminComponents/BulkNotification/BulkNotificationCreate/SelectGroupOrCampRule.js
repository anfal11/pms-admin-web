import { Fragment, useRef } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const SelectGroupOrCampRule1 = ({
    userInput,
    setUserInput,
    setSelectedGroup,
    selectedGroup,
    groupList,
    setSelectedCampaignRule,
    selectedCampaignRule,
    campaignList,
    RuleRef,
    GrpRef,
    BlackList,
    blackListRef
}) => {

    return (
        <Fragment>
            <Col sm="3" className='mb-2 mt-1'>
                <FormGroup>
                    <CustomInput type='switch' onChange={(e) => {
                        if (e.target.checked) {
                            setUserInput({ ...userInput, is_rule_base_notification: true })
                            setSelectedGroup({})
                        } else {
                            setUserInput({ ...userInput, is_rule_base_notification: false })
                            setSelectedCampaignRule({})
                        }
                    }
                    } id='is_rule_base_notification' label='Is Campaign Base Notification?' />
                </FormGroup>
            </Col>
            {
                userInput.is_rule_base_notification && <Col sm="3" >
                    <FormGroup>
                        <Label for="groups">Select Campaign<span style={{ color: 'red' }}>*</span></Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            id='group'
                            classNamePrefix='select'
                            value={{ value: selectedCampaignRule.value, label: selectedCampaignRule.label ? selectedCampaignRule.label : 'select...' }}
                            onChange={(selected) => {
                                setSelectedCampaignRule({ value: selected.value, label: selected.label })
                            }}
                            options={campaignList}
                            ref={RuleRef}
                        />
                        <Input
                            required
                            style={{
                                opacity: 0,
                                width: "100%",
                                height: 0
                                // position: "absolute"
                            }}
                            onFocus={e => RuleRef.current.select.focus()}
                            value={selectedCampaignRule?.value || ''}
                            onChange={e => ''}
                        />
                    </FormGroup>
                </Col>
            }
            {
                !userInput.is_rule_base_notification && <Col sm="3" >
                    <FormGroup>
                        <Label for="groups">Group<span style={{ color: 'red' }}>*</span></Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            id='group'
                            classNamePrefix='select'
                            value={{ value: selectedGroup.value, label: selectedGroup.label ? selectedGroup.label : 'select...' }}
                            onChange={(selected) => {
                                setSelectedGroup({ value: selected.value, label: selected.label })
                            }}
                            options={groupList?.map(g => { return { value: g.id, label: g.group_name } })}
                            ref={GrpRef}
                        />
                        <Input
                            required
                            style={{
                                opacity: 0,
                                width: "100%",
                                height: 0
                                // position: "absolute"
                            }}
                            onFocus={e => GrpRef.current.select.focus()}
                            value={selectedGroup?.value || ''}
                            onChange={e => ''}
                        />
                    </FormGroup>
                </Col>
            }

            <Col sm="4" >
                <FormGroup>
                    <Label for="">Select Black List</Label>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        id='black_list_group_id'
                        classNamePrefix='select'
                        // value={{ value: selectedCampaignRule.value, label: selectedCampaignRule.label ? selectedCampaignRule.label : 'select...' }}
                        onChange={(selected) => {
                            setUserInput({ ...userInput, black_list_group_id: selected ? selected.map(i => i.value) : []})
                        }}
                        options={BlackList?.map(rl => { return { value: rl.id, label: rl.group_name } })}
                        ref={blackListRef}
                        isMulti
                    />
                    <Input

                        style={{
                            opacity: 0,
                            width: "100%",
                            height: 0
                            // position: "absolute"
                        }}
                        onFocus={e => blackListRef.current.select.focus()}
                        value={userInput.black_list_group_id || ''}
                        onChange={e => ''}
                    />
                </FormGroup>
            </Col>
        </Fragment>
    )
}

export default SelectGroupOrCampRule1