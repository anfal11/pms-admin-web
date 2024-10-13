import * as yup from 'yup'
import mapValues from 'lodash/mapValues'


export const BusinessFormValidation = yup.object().shape({
        email: yup.string().email()/* .required() */,
        businessname: yup.string().required(),
        // firstname: yup.string().required(),
      //  firstName: yup.string().min(3).required()
        // lastname: yup.string().required(), //.min(1, 'first digit is more then 0 required'),
        mobile: yup.string(/* 'mobile no must be a number' */).required('mobile no is a required field'),
        //   .matches(/^[0-9]+$/, "Must be only digits")
            /*.test({
                name: 'mobile',
                message: 'first digit 0 not allow',
                test: (mobile = '') => parseInt(String(mobile).charAt(0)) !== 0 
              })*/
        //     .test({
        //       name: 'mobile',
        //       message: 'mobile no is invalid',
        //       test: (mobile = '') => {
        //         if (parseInt(String(mobile).charAt(0)) === 0) {

        //              return mobile.length === 11

        //         } else if (mobile.length === 10) {
                        
        //           return true

        //         } else {

        //            return false
        //         }
        //       }
        //     }),
        // landline: yup.string('telephone no must be a number').required('telephone is a required field')
        //   .matches(/^[0-9]+$/, "Must be only digits")
          /*.test({
            name: 'landline',
            message: 'first digit 0 not allow',
            test: (landline = '') => parseInt(String(landline).charAt(0)) !== 0 
          })*/
          // .test({
          //   name: 'landline',
          //   message: 'telephone no is invalid',
          //   test: (landline = '') => {
          //     if (parseInt(String(landline).charAt(0)) === 0) {

          //          return landline.length === 11

          //     } else if (landline.length === 10) {
                      
          //       return true
                
          //     } else {

          //        return false
          //     }
          //   }
          // }),
        // postcode: yup.string().required().min(6, 'must be 6 or 8 characters').max(8, 'must be 6 or 8 characters'),
        // companyregno: yup.string().required().test(
        //   'companyregno',
        //   'must be 7 characters',
        //   companyregnoo => {
        //           if (!companyregnoo) {
        //             return true
        //           } else if (companyregnoo.length !== 7) {
        //           return false
        //           } else {
        //           return true
        //           }
        //   } 
        // ),
        // .required().min(7, 'must be 7 characters').max(7, 'must be 7 characters')
           /* .test(
              'companyregno',
              'must be 7 characters',
              companyregnoo => {
                      if (!companyregnoo) {
                        return true
                      } else if (companyregnoo.length !== 7) {
                      return false
                      } else {
                      return true
                      }
              } 
            ),*/

        vatno: yup.string()
            .test(
               'vatno',
               'must be 9 characters',
               vatnoo => {
                       if (!vatnoo) {
                         return true
                       } else if (vatnoo.length !== 9) {
                        return false
                       } else {
                        return true
                       }
               } //!vatnoo //|| vatnoo.length !== 9  //false return will show error
            ),

        FID: yup.string()
              .test(
                'FID',
                'must be 6 characters',
                fid => {
                        if (!fid) {
                          return true
                        } else if (fid.length !== 6) {
                        return false
                        } else {
                        return true
                        }
                } 
            ),
        
            EOID: yup.string()
            .test(
              'FID',
              'must be 6 characters',
              eid => {
                      if (!eid) {
                        return true
                      } else if (eid.length !== 6) {
                      return false
                      } else {
                      return true
                      }
              } 
          )
    })

    export const AddProductFormValidation = yup.lazy(obj =>  yup.object( 
       mapValues(obj, (value, key) => {
          if (key === 'quantity') {
            return yup.string().required()
          }
          if (key.includes('productsize')) {
            return yup.string().required()
          }
          if (key.includes('productname')) {
            return yup.string().required()
          }
          if (key.includes('productdetails')) {
            return yup.string().required()
          }
          if (key.includes('RRP')) {
            return yup.string().required()
          }
          if (key.includes('tillprice')) {
            return yup.string().required()
          }
          if (key.includes('unitvolume')) {
            return yup.string().required()
          }
          if (key.includes('location')) {
            return yup.string().required()
          }
          if (key.includes('Barcode1')) {
            return yup.string().required()
          }
          if (key.includes('Barcode2')) {
            return yup.string().required()
          }
          if (key.includes('Barcode3')) {
            return yup.string().required()
          }
        })
      )
    )
    
  /*  
    
    yup.object().shape({
      quantity: yup.string().required(),
      productsize: yup.string().required(),
      productname: yup.string().required(),
      productdetails: yup.string().required(),
      RRP: yup.string().required(),
      tillprice: yup.string().required(),
      unitvolume: yup.string().required(),
      location: yup.string().required(),
      Barcode1: yup.string().required(),
      Barcode2: yup.string().required(),
      Barcode3: yup.string().required()
  })
*/