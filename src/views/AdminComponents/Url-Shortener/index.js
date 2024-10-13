import React, { Fragment, useEffect, useState } from 'react'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { tinyurl_baseurl } from '../../../Configurables'
import { formatReadableDate, getHumanReadableDate } from '../../helper'
import { ArrowLeft, ArrowRight } from 'react-feather'

import CommonDataTable from '../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import ServerSideDataTable from '../../tables/data-tables/basic/ServerSideDataTable'

const UrlShortener = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [isloading, setisloading] = useState(true)
    const [ishistoryloading, setishistoryloading] = useState(true)

    const [liveList, setLiveList] = useState([])
    const [historyList, setHistoryList] = useState([])
    const [isSubmitting, setsubmitting] = useState(false)
    const [refresh, setRefresh] = useState(1)

    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [userinput, setuserinput] = useState({
        originalUrl: '',
        alias: ''
    })

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    useEffect(() => {
        setisloading(true)
        setishistoryloading(true)
        setCurrentPage(1)
        Promise.all([
            useJwt2.urlshortenerLiveList().then(res => {
                setLiveList(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.urlshortenerHistoryList({page: 1, limit: rowsPerPage}).then(res => {
                setHistoryList(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.urlshortenerHistoryListCount().then(res => {
                setRowCount(res.data.payload)
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setisloading(false)
            setishistoryloading(false)
        })

    }, [refresh])

    const handlePagination = page => {
        setishistoryloading(true)
        useJwt2.urlshortenerHistoryList({ page: page.selected + 1, limit: rowsPerPage}).then(res => {
            setHistoryList(res.data.payload)
            setishistoryloading(false)
        }).catch(err => {
            Error(err)
            setishistoryloading(false)
        })
        setCurrentPage(page.selected)
    }
    const handleChange = (e) => {
        setuserinput({ ...userinput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!(userinput.originalUrl.trim()).length) {
            return 0
        }
        let alias = userinput.alias
        if (!(userinput.alias.trim()).length) {
            alias = null
        }
        setsubmitting(true)
        useJwt2.urlshortenerCreate({originalUrl: userinput.originalUrl, alias}).then(res => {
            Success(res)
            setsubmitting(false)
            setuserinput({
                originalUrl: '',
                alias: ''
            })
            setRefresh(refresh + 1)
        }).catch(err => {
            Error(err)
            setsubmitting(false)
        })
    }

    const column = [
        {
            name: 'Alias',
            minWidth: '60px',
            selector: 'alias',
            wrap: true
        },
        {
            name: 'Short-Url',
            minWidth: '150px',
            selector:  row => <a target='_blank' href={`${tinyurl_baseurl}/${row.alias}`}>{`${tinyurl_baseurl}/${row.alias}`}</a>,
            wrap: true
        },
        {
            name: 'Long-Url',
            minWidth: '200px',
            selector:  row => <a target='_blank' href={row.long_url}>{row.long_url}</a>,
            wrap: true
        },
        {
            name: 'Created At',
            minWidth: '120px',
            sortable: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: row => {
                return row.created_at ? formatReadableDate(row.created_at) : ''
            }
        }
    ]

    const historyColumn = [
        {
            name: 'Alias',
            minWidth: '60px',
            selector: 'alias',
            wrap: true
        },
        {
            name: 'Short-Url',
            minWidth: '150px',
            selector:  row => <a target='_blank' href={`${tinyurl_baseurl}/${row.alias}`}>{`${tinyurl_baseurl}/${row.alias}`}</a>,
            wrap: true
        },
        {
            name: 'Long-Url',
            minWidth: '200px',
            selector:  row => <a target='_blank' href={row.long_url}>{row.long_url}</a>,
            wrap: true
        },
        {
            name: 'Status',
            minWidth: '60px',
            selector:  row => {
                if (!row.end_time) {
                    return <Badge color="primary" pill>Live</Badge>
                } else {
                    return <Badge color="success" pill>Inactive</Badge>
                }
            }
        },
        // <Badge color="primary" pill>Insert</Badge>
        {
            name: 'End Time',
            minWidth: '120px',
            sortable: true,
            sortType: (a, b) => {
                return new Date(b.end_time) - new Date(a.end_time)
              },
            selector: row => {
                return row.end_time ? formatReadableDate(row.end_time) : '--'
            }
        },
        {
            name: 'Created At',
            minWidth: '120px',
            sortable: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: row => {
                return row.created_at ? formatReadableDate(row.created_at) : ''
            }
        }
    ]

    return (
        <Fragment>

             <Card>
                <CardHeader className="cardHeader" >
                    <CardTitle>
                         Shorten a long URL
                    </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={onSubmit} autoComplete="off"> 
                    <Row>
                      <Col sm="12" >
                        <FormGroup>
                            <Label for="originalUrl">original-Url<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="textarea"
                                rows={2}
                                autoFocus={true}
                                name="originalUrl"
                                id='originalUrl'
                                value={userinput.originalUrl}
                                onChange={handleChange}
                                required
                                placeholder="url here..."
                            />
                        </FormGroup>
                      </Col>
                      <Col sm="4" >
                        <FormGroup>
                            <Label for="alias">Alias(Optinal)</Label>
                            <Input type="text"
                                name="alias"
                                id='alias'
                                minLength='5'
                                value={userinput.alias}
                                onChange={handleChange}
                                placeholder="alias here..."
                            />
                        </FormGroup>
                      </Col>

                      <Col md="4" className="mt-2">
                           {
                                isSubmitting ? <Button.Ripple color='primary' className='mr-1' disabled>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> :  <Button.Ripple color='primary' className='btn-next' type="submit">
                                <span className='align-middle d-sm-inline-block d-none'>Submit</span>
                              </Button.Ripple>
                            }
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <Nav tabs>
                        <><NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Live List
                            </NavLink>
                        </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2') }}
                                >History
                                </NavLink>
                            </NavItem></>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                       <CommonDataTable 
                            column={column} 
                            TableData={liveList} 
                            TableDataLoading={isloading} 
                       />
                    </TabPane>
                    <TabPane tabId="2">
                        <ServerSideDataTable
                            currentPage={currentPage}
                            handlePagination={handlePagination}
                            RowCount={RowCount}
                            column={historyColumn}
                            TableData={historyList}
                            RowLimit={rowsPerPage}
                            TableDataLoading={ishistoryloading} 
                        />
                    </TabPane>
                </TabContent>
            </Card>
        </Fragment>
    )
}

export default UrlShortener