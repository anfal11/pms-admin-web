import React, { Fragment, useState } from 'react'
import CommonDataTable from '../../ClientSideDataTable'
import { CheckSquare, XSquare } from 'react-feather'
import DetailsModal from './ViewDetails'
import { Badge } from 'reactstrap'
import { formatReadableDate } from '../../../../../../helper'
import { Success, Error } from '../../../../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const NeedApproveDatapackList = ({datapackList, TableDataLoading, refresh, setrefresh}) => {

    // const viewDetails = (e, item) => {
    //     setref_id(item.ref_id)
    //     datapackGroupList(item.id)
    // }

const [action, setAction] = useState(0)
const [datapackListInfo, setDatapackListInfo] = useState({})
const [modal, setModal] = useState(false)
const toggleModal = () => setModal(!modal)

    
    // const handlePoPupActions = (id, status, message) => {
    //     return MySwal.fire({
    //         title: message,
    //         text: `You won't be able to revert this`,
    //         icon: 'warning',
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes',
    //         customClass: {
    //             confirmButton: 'btn btn-primary',
    //             cancelButton: 'btn btn-danger ml-1'
    //         },
    //         showLoaderOnConfirm: true,
    //         preConfirm: () => {
    //             const data = {
    //                 id,
    //                 action_id: status
    //             }
    //             return useJwt.datapackAction(data).then(res => {
    //                 Success(res)
    //                 console.log(res)
    //                 setrefresh(!refresh)
    //             }).catch(err => {
    //                 console.log(err)
    //                 Error(err)
    //             })
    //         },
    //         buttonsStyling: false,
    //         allowOutsideClick: () => !Swal.isLoading()
    //     }).then(function (result) {
    //         if (result.isConfirmed) {

    //         }
    //     })

    // }
    const column = [
        {
            name: 'Name',
            minWidth: '250px',
            sortable: true,
            selector: 'name',
            wrap: true
        },
        {
            name: 'Operator',
            minWidth: '100px',
            sortable: true,
            selector: 'operator'
        },
        {
            name: 'Volume In MB',
            minWidth: '100px',
            sortable: true,
            selector: 'volumeInMB'
        },
        {
            name: 'Pack Code',
            minWidth: '100px',
            sortable: true,
            selector: 'packcode',
            wrap: true
        },
        {
            name: 'Operation',
            minWidth: '150px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Modified By',
            minWidth: '150px',
            sortable: true,
            selector: 'modifiedBy',
            wrap: true
        },
        {
            name: 'Modified At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.modifiedAt) - new Date(a.modifiedAt)
              },
            selector: 'created_at',
            cell: (item) => {
                return item.modifiedAt ? formatReadableDate(item.modifiedAt) : null
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
                            // onClick={() => handlePoPupActions(row.id, 1, 'Are you sure?')}
                            onClick={() => {
                                setDatapackListInfo(row)
                                setModal(true)
                                setAction(1)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={() => handlePoPupActions(row.id, 2, 'Are you sure?')}
                            onClick={() => {
                                setDatapackListInfo(row)
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

            <CommonDataTable column={column} TableData={ datapackList} TableDataLoading={TableDataLoading} />
            <DetailsModal 
                modal={modal}
                toggleModal={toggleModal}
                datapackListInfo={datapackListInfo} 
                refresh={refresh}
                setRefresh={setrefresh}
                action={action}  
            /> 
        </Fragment>
    )
}

export default NeedApproveDatapackList