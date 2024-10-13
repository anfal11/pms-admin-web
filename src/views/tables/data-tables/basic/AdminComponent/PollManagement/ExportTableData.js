// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye } from 'react-feather'
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ExportTableData = ({ DataArray, keys, InvoiceTitle }) => {
    // ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result

        const columnDelimiter = ','
        const lineDelimiter = '\n'
        // const keys = ['customerid', 'storename', 'mobile', 'businessname', 'companyregno', 'status']
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
            let ctr = 0
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter

                // if (key === 'customerid') {
                //     result += item.storemap.customerid
                // } else if (key === 'storename') {
                //     result += item.storeinfo.storename
                // } else if (key === 'mobile') {
                //     result += item.customerinfo.mobile
                // } else {
                // }
                result += item[key]

                ctr++
            })
            result += lineDelimiter
        })

        return result
    }
    // ** Downloads CSV
    function downloadCSV(array) {
        const link = document.createElement('a')
        let csv = convertArrayOfObjectsToCSV(array)
        if (csv === null) return

        const filename = `${InvoiceTitle.replaceAll(/\s/g, '')}.csv`

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`
        }

        link.setAttribute('href', encodeURI(csv))
        link.setAttribute('download', filename)
        link.click()
    }
    // ** Export XL file
    const exportToXL = (arr) => {
        const ws = XLSX.utils.json_to_sheet(arr)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, `${InvoiceTitle.replaceAll(/\s/g, '')}.xlsx`)
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text(InvoiceTitle, 10, 10)
        const flist = list.map(l => {
            return { ...l, ...l.storemap, ...l.storeinfo, ...l.customerinfo }
        })
        doc.autoTable({
            body: [...flist],
            // columns: [
            //     { header: 'Customer ID', dataKey: 'customerid' }, { header: 'Store Name', dataKey: 'storename' }, { header: 'Mobile', dataKey: 'mobile' }, { header: 'Business Name', dataKey: 'businessname' }, { header: 'Reg No.', dataKey: 'companyregno' },
            //     { header: 'Status', dataKey: 'status' }
            // ],
            columns: keys.map(k => { return { header: k, dataKey: k } }),
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save(`${InvoiceTitle.replaceAll(/\s/g, '')}.pdf`)
    }

    return (
        <div>
            <UncontrolledButtonDropdown>
                <DropdownToggle color='secondary' caret outline>
                    <Share size={15} />
                    <span className='align-middle ml-50'>Export</span>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem className='w-100' onClick={() => downloadCSV(DataArray)}>
                        <FileText size={15} />
                        <span className='align-middle ml-50'>CSV</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => exportToXL(DataArray)}>
                        <Grid size={15} />
                        <span className='align-middle ml-50'>Excel</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => exportPDF(DataArray)}>
                        <File size={15} />
                        <span className='align-middle ml-50'>
                            PDF
                        </span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        </div>
    )
}

export default ExportTableData