import axios from 'axios'
import useJwt from '@src/auth/jwt/useJwt'
// ** Get table Data
export const getData = params => {
  return async dispatch => {
    await axios.get('/api/datatables/data', params).then(response => {
      dispatch({
        type: 'GET_DATA',
        allData: response.data.allData,
        data: response.data.invoices,
        totalPages: response.data.total,
        params
      })
    })
  }
}

export const getProducts = params => {
  return async dispatch => {
     await useJwt.productList(params).then(res => {
        const data = res.data.payload  
       // console.log('data ', data)
        dispatch({
          type: 'GET_DATA',
          allData: data.data,
          data: data.data,
          totalPages: data.total,
          params
        })
      })
  }
}
export const getProductsBySearch = params => {
  return async dispatch => {
     await useJwt.productlistSearch(params).then(res => {
        const data = res.data.payload  
       // console.log('SearchedData ', data)
        dispatch({
          type: 'GET_DATA',
          allData: data,
          data,
          totalPages: 1,
          params
        })
      })
  }
}