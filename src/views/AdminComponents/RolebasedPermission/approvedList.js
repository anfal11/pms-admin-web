import { useEffect, useState } from "react"
import useJwt from '@src/auth/jwt/useJwt'
import CommonDataTable from "../../VendorComponents/ClientSideDataTable"

const ApprovedList = () => {
    const [approvedList, setApprovedList] = useState([])
    const [approvedLoading, setApprovedLoading] = useState(true)

    useEffect(() => {
         setApprovedLoading(true)
        useJwt.roleBasedApprovedList()
            .then(res => {
                setApprovedList(res.data.payload)
                console.log(res)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setApprovedLoading(false)
            })
    }, [])

    const columns = [
        {
            name: 'Module Name',
            minWidth: '250px',
            sortable: true,
            selector: 'module.module_name'
        },
        {
            name: 'Role Id',
            minWidth: '150px',
            sortable: true,
            selector: 'role_id'
        },
        {
            name: 'Role Name',
            minWidth: '150px',
            sortable: true,
            selector: row => {
                return row.role?.role_name
            }
        }
    ]

    return (
        <div>
            <CommonDataTable column={columns} TableData={approvedList} TableDataLoading={approvedLoading} />
        </div>
    )
}

export default ApprovedList