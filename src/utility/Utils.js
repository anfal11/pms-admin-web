// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

export const subMenuIDs = [].concat(...((JSON.parse(localStorage.getItem('AssignedMenus')) || []).map(x => x.submenu.map(y => y.id))))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'vendor') return '/vendordashboard'
  if (userRole === 'cashier') return '/payment'
  return '/Adminlogin'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})


//my code..
//convert json data to formdata and return this formdata
export const transformInToFormObject = (data) => {
  const formData = new FormData()
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((obj, index) => {
        const keyList = Object.keys(obj)
        keyList.forEach((keyItem) => {
          const keyName = [key, "[", index, "]", ".", keyItem].join("")
          formData.append(keyName, obj[keyItem])
        })
      })
    } else if (typeof data[key] === "object") { 
      for (const innerKey in data[key]) {
        formData.append(`${key}.${innerKey}`, data[key][innerKey])
      }
    } else {
      formData.append(key, data[key])
    }
  }
  return formData

}

// Works best with new browsers
// Works with all browsers
export const _isEmptyObj = (myEmptyObj) => Object.keys(myEmptyObj).length === 0 && myEmptyObj.constructor === Object

export const _inputSupportDateFormateConvert = (inputDateTime) => {
  // Create a Date object from the input string
  const date = new Date(inputDateTime)

  // Extract components of the date
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')

  // Construct the desired formatted string
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
  return formattedDateTime

}