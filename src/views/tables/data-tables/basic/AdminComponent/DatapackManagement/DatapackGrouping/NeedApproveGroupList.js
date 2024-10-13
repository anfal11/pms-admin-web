import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Eye, Edit, Trash, CheckSquare, XSquare} from 'react-feather'
import { subMenuIDs } from '../../../../../../../utility/Utils'
import { formatReadableDate } from '../../../../../../helper'
import { Badge } from 'reactstrap'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { OperationStatusSet } from '../../../../../../statusdb'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import DetailsModal from './ViewDetails'
import CommonDataTable from '../../ClientSideDataTable'

const NeedApproveGroupList = ({datapackGroupList, rule_type, TableDataLoading, refresh, setrefresh, setref_id}) => {
    console.log(datapackGroupList)
    const viewDetails = (e, item) => {

        setref_id(item.ref_id)
        datapackGroupList(item.id)
    }

    const [action, setAction] = useState(0)
    const [datapackInfo, setDatapackInfo] = useState({})
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const column = [
        {
            name: 'Group Title',
            minWidth: '200px',
            sortable: true,
            selector: 'group_title',
            wrap: true
        },
        {
            name: 'Operator',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_item?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e?.keyword}</div>)
            }
        },
        {
            name: 'Pack Code',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_item?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.pack_code || '--'}</div>)
            }
        },
        {
            name: 'Disburse-Unit',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_item?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{`${e.number_of_time_api_hit} X` || '--'}</div>)
            }
        },
        {
            name: 'Operation',
            minWidth: '50px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Modified By',
            minWidth: '150px',
            sortable: true,
            selector: 'modified_by',
            wrap: true
        },
        {
            name: 'Modified At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.modified_at) - new Date(a.modified_at)
              },
            selector: 'modified_at',
            cell: (item) => {
                return item.modified_at ? formatReadableDate(item.modified_at) : null
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                        <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 'Do you want to approve?', 1)}
                            onClick={() => {
                                setDatapackInfo(row)
                                setModal(true)
                                setAction(1)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 'Do you want to reject?', 2)}
                            onClick={(e) => {
                                setDatapackInfo(row)
                                setModal(true)
                                setAction(2)
                            }}
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Fragment>

           <CommonDataTable column={column} TableData={ datapackGroupList} TableDataLoading={TableDataLoading} />
           <DetailsModal 
                modal={modal}
                toggleModal={toggleModal}
                datapackInfo={datapackInfo} 
                refresh={refresh}
                setRefresh={setrefresh}
                action={action}  
            /> 
        </Fragment>
    )
}

export default NeedApproveGroupList