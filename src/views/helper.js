import moment from 'moment'

//Ex-> '1234567891' to '1234 567 891'
export const FormatePhoneNo = (phone) => {
    const phonenoinstring = String(phone)
    return phonenoinstring.replace(/^(.{4})(.*)(.{3})$/, '$1 $2 $3')
}

const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }

export const formatReadableDate = (date) => { return (new Date(date)).toLocaleDateString(undefined, options) }

export const getHumanReadableDate = (datetime) => { 
    // let datetime = '2024-06-18T23:25:06.754Z'
    // let datetime = '2024-07-25 00:05:57.358246+06'

    // Remove the 'Z' at the end if it exists
    if (datetime.endsWith('Z')) {
        datetime = datetime.slice(0, -1)
    }
    // Find the position of the '+' sign
    const plusIndex = datetime.indexOf('+')

    // Remove the time zone offset if it exists
    if (plusIndex !== -1) {
        datetime = datetime.slice(0, plusIndex)
    }

    return moment(datetime).format('MMMM D, YYYY [at] h:mm A')
 }

export const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

export const thousandSeparator = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }

export const handle401 = async (status) => {
    if (status === 401) {
        window.location.href = '/Adminlogin'
        await localStorage.clear()
    }
}

export const ExportCSV = (array, keys, CSVname) => {
    // ** Downloads CSV
    // const keys = ['name', 'email', 'mobile']
    // ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result
        const columnDelimiter = ','
        const lineDelimiter = '\n'
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
            let ctr = 0
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter
                result += item[key]
                ctr++
            })
            result += lineDelimiter
        })
        return result
    }
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return
    const userData = JSON.parse(localStorage.getItem('userData'))
    const filename = `${CSVname}_${new Date().toISOString()}_${userData['fullname'].replaceAll(/\s/g, '')}.csv`

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
}