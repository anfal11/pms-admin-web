const axios = require('axios')
const Module = 'JW9tc0ByZWRsdGQl'
const Authorization = `Bearer ${sessionStorage.getItem('userToken') || null}`

module.exports = {

    GetData: (url) => {
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                Authorization,
                Module
             }

           axios({
                method: 'GET',
                url,
                headers

                }).then((responseJson) => { 
                         resolve(responseJson.data)
                    }).catch((error) => {
                          reject(error.response)
                        })
            })
    },
    PostData:(url, userData = {}, contenttype = null) => {
        return new Promise((resolve, reject) => { 

            const headers = {
                "Content-Type":"application/json",
                Module,
                Authorization
            }
            if (contenttype) {
                headers['Content-Type'] = contenttype
            }
                 axios({
                      method: 'post',
                      url,
                      data: !contenttype ? JSON.stringify(userData) : userData,
                      headers
                    })
                    .then((responseJson) => { resolve(responseJson) })
                    .catch((error) => {  reject(error.response)  })
                  })
     },
    
    PutData:(url, userData) => { 

          return new Promise((resolve, reject) => { 
                 axios({
                    method: 'PUT',
                    url,
                    data: JSON.stringify(userData),
                    headers: {
                        "Content-Type": "application/json",
                        Module,
                        Authorization
                        }
                })    
                .then((responseJson) => { resolve(responseJson.data) })
                .catch((error) => { reject(error.response) })
            })
    },

   DeleteData:(url, userData = {}) => {

          return new Promise((resolve, reject) => { 
                axios({
                method: 'DELETE',
                url,
                data: JSON.stringify(userData),
                headers: {
                        "Content-Type": "application/json",
                        Module,
                        Authorization
                    }
                })
                .then((responseJson) => { resolve(responseJson.data) })
                .catch((error) => { reject(error) })
            })
   }

 }