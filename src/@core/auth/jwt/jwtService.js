import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {

  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }
  userName = localStorage.getItem("username")
  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()
        const BMSCall = localStorage.getItem("BMSCall")
      
        // ** If token is present add it to request's Authorization Header
        const PMStoken = localStorage.getItem("PMStoken")
        const usePMStoken = localStorage.getItem("usePMStoken")
        const BMStoken = localStorage.getItem("BMStoken")
        const useBMStoken = localStorage.getItem("useBMStoken")
        const Akashtoken = localStorage.getItem("Akashtoken")
        const useAkashtoken = localStorage.getItem("useAkashtoken")

        // config.headers.contentType = 'application/json'

        if (BMSCall === 'true' || useBMStoken === 'true') {
          // config.headers.Module = null
        } else if (useAkashtoken === 'true') {
          config.headers.Module = 'JW9tc0BBZWRsdGQl'
        } else {
          config.headers.Module = this.jwtConfig.HeaderModule
        }

        if (usePMStoken === 'true') {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${PMStoken}`
        } else if (useBMStoken === 'true') {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${BMStoken}`
        } else if (useAkashtoken === 'true') {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${Akashtoken}`
        } else if (BMSCall === 'true') {
          //do nothing
        } else {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // ** if (status === 401) {
        /* if (response && response.status === 401) {
           if (!this.isAlreadyFetchingAccessToken) {
             this.isAlreadyFetchingAccessToken = true
             this.refreshToken().then(r => {
               this.isAlreadyFetchingAccessToken = false
 
               // ** Update accessToken in localStorage
               this.setToken(r.data.accessToken)
               this.setRefreshToken(r.data.refreshToken)
 
               this.onAccessTokenFetched(r.data.accessToken)
             })
           }
           const retryOriginalRequest = new Promise(resolve => {
             this.addSubscriber(accessToken => {
               // ** Make sure to assign accessToken according to your response.
               // ** Check: https://pixinvent.ticksy.com/ticket/2413870
               // ** Change Authorization header
               originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
               resolve(this.axios(originalRequest))
             })
           })
           return retryOriginalRequest
         }*/
        return Promise.reject(error)
      }
    )
  }
  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName) || null
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  checkMobile(...args) {
    return axios.post(this.jwtConfig.checkMobileEndpoint, ...args)
  }
  checkOtp(...args) {
    return axios.post(this.jwtConfig.checkOtpEndpoint, ...args)
  }

  merchentlogin(...args) {
    return axios.post(this.jwtConfig.merchentloginEndpoint, ...args)
  }

  getPasswordConfig() {
    return axios.get(this.jwtConfig.getPasswordConfigEndpoint)
  }
  changepassword(...args) {
    return axios.post(this.jwtConfig.changepasswordEndpoint, ...args)
  }

  merchentregister(...args) {
    return axios.post(this.jwtConfig.merchentregisterEndpoint, ...args)
  }

  merchentsetpassword(...args) {
    return axios.post(this.jwtConfig.merchentsetpassword, ...args)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  //my...
  storeList(...args) {
    return axios.get(this.jwtConfig.companystorelistEndpoint, ...args)
  }

  businesscategoryList(...args) {
    return axios.get(this.jwtConfig.businesscategorylistEndpoint, ...args)
  }
  useSymbolGroup(...args) {
    return axios.get(this.jwtConfig.useSymbolGroup, ...args)
  }
  businessmarketingpreferanceList(...args) {
    return axios.get(this.jwtConfig.businessmarketingpreferancelistEndpoint, ...args)
  }

  businessTagList(...args) {
    return axios.get(this.jwtConfig.businesstaglistEndpoint, ...args)
  }
  storesizeList(...args) {
    return axios.get(this.jwtConfig.storesizelistEndpoint, ...args)
  }
  postCodeSearch(...args) {
    return axios.post(this.jwtConfig.getaddressbypostcodeEndpoint, ...args)
  }

  stlCustomerRegistration(...args) {
    return axios.post(this.jwtConfig.stlcustomerregistration, ...args)
  }
  customerBusinessAdd(...args) {
    return axios.post(this.jwtConfig.businessAddEndpoint, ...args)
  }
  PendingBusiness(...args) {
    return axios.post(this.jwtConfig.pendingBusinessEndpoint, ...args)
  }
  ApproveRejectBusiness(...args) {
    return axios.post(this.jwtConfig.approveRejectBusinessEndpoint, ...args)
  }

  customerBusinessList(...args) {
    return axios.post(this.jwtConfig.customerbusinesslistEndpoint, ...args)
  }
  customerBusinessDetails(...args) {
    return axios.post(this.jwtConfig.customerbusinessdetailsEndpoint, ...args)
  }
  PendingBusinessDetails(...args) {
    return axios.post(this.jwtConfig.pendingCustomerbusinessdetailsEndpoint, ...args)
  }
  customerBusinessUpdate(...args) {
    return axios.post(this.jwtConfig.updatebusinessEndpoint, ...args)
  }
  customerBusinessDelete(...args) {
    return axios.post(this.jwtConfig.businessdeleteEndpoint, ...args)
  }
  customerBusinessRegistration(...args) {
    return axios.post(this.jwtConfig.registercustomerbusinessEndpoint, ...args)                 // new customerBusinessRegistration needs test
  }
  trollyAdd(...args) {
    return axios.post(this.jwtConfig.trollyaddEndpoint, ...args)
  }
  trollyDelete(...args) {
    return axios.post(this.jwtConfig.trollydeleteEndpoint, ...args)
  }
  trollyEdit(...args) {
    return axios.post(this.jwtConfig.trollyEditEndpoint, ...args)
  }
  singleFileupload(...args) {
    return axios.post(this.jwtConfig.singlefileuploadEndpoint, ...args)
  }

  trollyList(...args) {
    return axios.post(this.jwtConfig.trollylistEndpoint, ...args)
  }
  userRoleList(...args) {
    return axios.get(this.jwtConfig.userRoleList, ...args)
  }
  roleList() {
    return axios.get(this.jwtConfig.roleListEndpoint)
  }
  // shovan rolebased 
  roleBasedApprovedList(...args) {
    return axios.get(this.jwtConfig.roleBasedApprovedListEndpoint, ...args)
  }
  roleBasedUpdate(...args) {
    return axios.post(this.jwtConfig.roleBasedUpdateEndpoint, ...args)
  }
  roleBasedPending(...args) {
    return axios.get(this.jwtConfig.roleBasedPendingEndpoint, ...args)
  }
  roleBasedAction(...args) {
    return axios.post(this.jwtConfig.roleBasedActionEndpoint, ...args)
  }
  getAdminroleDetails(...args) {
    return axios.post(this.jwtConfig.getAdminroleDetails, ...args)
  }
  getAdminroleTempDetails(...args) {
    return axios.post(this.jwtConfig.getAdminroleTempDetails, ...args)
  }
  getRoleListForAssign(...args) {
    return axios.get(this.jwtConfig.getRoleListForAssign, ...args)
  }
  createRole(...args) {
    return axios.post(this.jwtConfig.createRoleEndpoint, ...args)
  }
  getApprovalEntryforRole(id) {
    return axios.get(`${this.jwtConfig.actionRoleEndpoint}/${id}`)
  }
  actionRole(...args) {
    return axios.post(this.jwtConfig.actionRoleEndpoint, ...args)
  }
  updateRole(...args) {
    return axios.post(this.jwtConfig.updateRoleEndpoint, ...args)
  }
  deleteRole(...args) {
    return axios.post(this.jwtConfig.deleteRoleEndpoint, ...args)
  }
  userTitleList(...args) {
    return axios.get(this.jwtConfig.userTitleList, ...args)
  }
  addAdminUser(...args) {
    return axios.post(this.jwtConfig.addAdminUser, ...args)
  }
  adminUserList(...args) {
    return axios.get(this.jwtConfig.adminUserList, ...args)
  }
  adminUserdelete(...args) {
    return axios.post(this.jwtConfig.adminUserdelete, ...args)
  }
  adminUserBlock(...args) {
    return axios.post(this.jwtConfig.adminUserBlock, ...args)
  }
  adminUserDetails(...args) {
    return axios.post(this.jwtConfig.adminUserDetails, ...args)
  }
  adminUserEdit(...args) {
    return axios.post(this.jwtConfig.adminUserEdit, ...args)
  }
  adminUserSearch(...args) {
    return axios.post(this.jwtConfig.adminUserSearch, ...args)
  }

  productcategorylist(...args) {
    return axios.post(this.jwtConfig.productcategoryEndpoint, ...args)
  }
  productlistSearch(...args) {
    return axios.post(this.jwtConfig.productlistSearch, ...args)
  }
  productcategoryAdd(...args) {
    return axios.post(this.jwtConfig.productcategoryaddEndpoint, ...args)
  }

  categoryDelete(...args) {
    return axios.post(this.jwtConfig.productcategorydeleteEndpoint, ...args)
  }
  categoryUpdate(...args) {
    return axios.post(this.jwtConfig.productcategoryupdateEndpoint, ...args)
  }
  productsubcategorylist(...args) {
    return axios.post(this.jwtConfig.productsubcategoryEndpoint, ...args)
  }
  productsubcategorydelete(...args) {
    return axios.post(this.jwtConfig.productsubcategorydeleteEndpoint, ...args)
  }

  productsubcategoryedit(...args) {
    return axios.post(this.jwtConfig.productsubcategoryeditEndpoint, ...args)
  }

  productsubcategoryadd(...args) {
    return axios.post(this.jwtConfig.productsubcategoryaddEndpoint, ...args)
  }

  productList(...args) {
    return axios.post(this.jwtConfig.productlistEndpoint, ...args)
  }
  addProduct(...args) {
    return axios.post(this.jwtConfig.addProduct, ...args)
  }
  singleproductdetails(...args) {
    return axios.post(this.jwtConfig.singleproductdetailsEndpoint, ...args)
  }
  productdelete(...args) {
    return axios.post(this.jwtConfig.productdeleteEndpoint, ...args)
  }
  productupdate(...args) {
    return axios.post(this.jwtConfig.updateproductEndpoint, ...args)
  }
  allDeals(...args) {
    return axios.post(this.jwtConfig.allDeals, ...args)
  }
  addNewHotDeal(...args) {
    return axios.post(this.jwtConfig.addNewHotDeal, ...args)
  }
  deleteHotDeal(...args) {
    return axios.post(this.jwtConfig.deleteHotDeal, ...args)
  }
  viewHotDealDetails(...args) {
    return axios.post(this.jwtConfig.viewHotDealDetails, ...args)
  }
  editHotDeal(...args) {
    return axios.post(this.jwtConfig.editHotDeal, ...args)
  }
  appUserList(...args) {
    const { business_id, customer_idx } = args[0]
    const url = `${this.jwtConfig.appUserList}?business_id=${business_id}&customer_idx=${customer_idx}`
    return axios.get(url, ...args)
  }
  appUserType(...args) {
    return axios.get(this.jwtConfig.appUserType, ...args)
  }
  appAddNewUser(...args) {
    return axios.post(this.jwtConfig.appAddNewUser, ...args)
  }
  appDeleteUser(...args) {
    return axios.post(this.jwtConfig.appDeleteUser, ...args)
  }
  appEditUser(...args) {
    return axios.post(this.jwtConfig.appEditUser, ...args)
  }
  getAllCashNotes(...args) {
    return axios.post(this.jwtConfig.getAllCashNotes, ...args)
  }
  dailyCashNotesSubmit(...args) {
    return axios.post(this.jwtConfig.dailyCashNotesSubmit, ...args)
  }
  getAllPaymentType(...args) {
    return axios.post(this.jwtConfig.getAllPaymentType, ...args)
  }
  customerCheckedInvoicesSummaryList(...args) {
    return axios.post(this.jwtConfig.customerCheckedInvoicesSummaryList, ...args)
  }
  cashierServedSummeryInfo(...args) {
    return axios.post(this.jwtConfig.cashierServedSummeryInfo, ...args)
  }
  customerinvoicedetailswithsubpaymentinfo(...args) {
    return axios.post(this.jwtConfig.customerinvoicedetailswithsubpaymentinfo, ...args)
  }
  customerIOUsettingInfo(...args) {
    return axios.post(this.jwtConfig.customerIOUsettingInfo, ...args)
  }
  customerIOUmanage(...args) {
    return axios.post(this.jwtConfig.customerIOUmanage, ...args)
  }

  subPayment(...args) {
    return axios.post(this.jwtConfig.subpayment, ...args)
  }
  deleteSubPayment(...args) {
    return axios.post(this.jwtConfig.deletesubpayment, ...args)
  }
  totalInvoicePayment(...args) {
    return axios.post(this.jwtConfig.totalinvoicepayment, ...args)
  }

  invoiceList(...args) {
    return axios.post(this.jwtConfig.invoiceList, ...args)
  }
  invoiceDetails(...args) {
    return axios.post(this.jwtConfig.invoiceDetails, ...args)
  }
  submitDeposit(...args) {
    return axios.post(this.jwtConfig.submitDeposit, ...args)
  }
  depositDelete(...args) {
    return axios.post(this.jwtConfig.depositDelete, ...args)
  }
  depositLogList(...args) {
    return axios.post(this.jwtConfig.depositLogList, ...args)
  }
  depositFromTo(...args) {
    return axios.post(this.jwtConfig.depositFromTo, ...args)
  }
  cashDepositLogList(...args) {
    return axios.post(this.jwtConfig.cashDepositLogList, ...args)
  }
  getMerchantDetails(...args) {
    return axios.get(this.jwtConfig.getMerchantDetails, ...args)
  }
  setgocardlessdirectdebit(...args) {
    return axios.post(this.jwtConfig.setgocardlessdirectdebit, ...args)
  }
  customerbusinesslistbycustomerid(...args) {
    return axios.post(this.jwtConfig.customerbusinesslistbycustomerid, ...args)
  }
  customerpaymentinfolistbybusinessid(...args) {
    return axios.post(this.jwtConfig.customerpaymentinfolistbybusinessid, ...args)
  }

  resendnotificationforpay(...args) {
    return axios.post(this.jwtConfig.resendnotificationforpay, ...args)
  }

  ChildSubcategoryListAPi(...args) {
    return axios.post(this.jwtConfig.ChildSubcategoryListAPi, ...args)
  }
  AddChildSubcategoryAPi(...args) {
    return axios.post(this.jwtConfig.AddChildSubcategoryAPi, ...args)
  }
  EditChildSubcategoryAPi(...args) {
    return axios.post(this.jwtConfig.EditChildSubcategoryAPi, ...args)
  }
  DeleteChildSubcategoryAPi(...args) {
    return axios.post(this.jwtConfig.DeleteChildSubcategoryAPi, ...args)
  }
  ProductTypeListAPi(...args) {
    return axios.post(this.jwtConfig.ProductTypeListAPi, ...args)
  }
  customerbusinesslistbymobileno(...args) {
    return axios.post(this.jwtConfig.customerbusinesslistbymobileno, ...args)
  }
  SingleProductDetailsApi(...args) {
    return axios.post(this.jwtConfig.SingleProductDetailsApi, ...args)
  }
  VendorOrderListApi(...args) {
    return axios.post(this.jwtConfig.VendorOrderListApi, ...args)
  }
  VendorDashboardDataApi(...args) {
    return axios.post(this.jwtConfig.VendorDashboardDataApi, ...args)
  }
  updateproductApi(...args) {
    return axios.post(this.jwtConfig.updateproductApi, ...args)
  }
  merchent_pay(...args) {
    return axios.post(this.jwtConfig.merchent_pay, ...args)
  }
  SubUserListVendor(...args) {
    return axios.get(this.jwtConfig.SubUserListVendor, ...args)
  }
  createSubUserVendor(...args) {
    return axios.post(this.jwtConfig.createSubUserVendor, ...args)
  }
  editSubUserVendor(...args) {
    return axios.post(this.jwtConfig.editSubUserVendor, ...args)
  }
  deleteSubUserVendor(...args) {
    return axios.post(this.jwtConfig.deleteSubUserVendor, ...args)
  }
  getPMStoken(...args) {
    return axios.post(this.jwtConfig.getPMStoken, ...args)
  }
  getBMStoken(...args) {
    return axios.post(this.jwtConfig.getBMStoken, ...args)
  }
  allVouchersList(param) {
    return axios.get(this.jwtConfig.allVouchersListEndPoint, {
      params: {
        merchantid: param
      }
    })
  }
  pendingVouchersList(param) {
    return axios.get(this.jwtConfig.pendingVouchersListEndPoint, {
      params: {
        merchantid: param
      }
    })
  }
  getTierList() {
    return axios.get(this.jwtConfig.getTierListEndpoint)
  }
  deleteVoucher(...args) {
    return axios.post(this.jwtConfig.deleteVoucherEndPoint, ...args)
  }
  approveVoucher(...args) {
    return axios.post(this.jwtConfig.approveVoucherEndPoint, ...args)
  }
  rejectVoucher(...args) {
    return axios.post(this.jwtConfig.rejectVoucherEndPoint, ...args)
  }
  createVoucher(...args) {
    return axios.post(this.jwtConfig.createVoucherEndPoint, ...args)
  }
  bulkVoucherPurchase(...args) {
    return axios.post(this.jwtConfig.BulkVoucherPurchaseEndpoint, ...args)
  }
  editVoucher(...args) {
    return axios.post(this.jwtConfig.editVoucherEndPoint, ...args)
  }
  //point rules
  setMyRules(merchantid, ...args) {
    return axios.post(this.jwtConfig.setPointRuleEndPoint, ...args, {
      params: { merchantid }
    }
    )
  }
  getMyRules(merchantid) {
    return axios.get(this.jwtConfig.getPointRuleEndPoint, { params: { merchantid } }
    )
  }
  getPendingRules(merchantid) {
    return axios.get(this.jwtConfig.pendingPointRuleEndPoint, { params: { merchantid } }
    )
  }
  getAllPointRules(...args) {
    return axios.get(this.jwtConfig.getAllPointRuleEndPoint, ...args)
  }
  deleteMyRule(merchantid, ...args) {
    return axios.post(this.jwtConfig.deletePointRuleEndPoint, ...args, { params: { merchantid } }
    )
  }
  updateMyRule(merchantid, ...args) {
    return axios.post(this.jwtConfig.editPointRuleEndPoint, ...args, { params: { merchantid } }
    )
  }
  skuruleAction(merchantid, ...args) {
    return axios.post(this.jwtConfig.skuruleActionEndPoint, ...args, { params: { merchantid } }
    )
  }
  //overall point rules
  setOverallRules(merchantid, ...args) {
    return axios.post(this.jwtConfig.setOverallPointRuleEndPoint, ...args, { params: { merchantid } })
  }
  getOverallRules(merchantid) {
    return axios.get(this.jwtConfig.getOverallPointRuleEndPoint, { params: { merchantid } })
  }
  getAllOverallRules(...args) {
    return axios.get(this.jwtConfig.getAllOverallPointRuleEndPoint, ...args)
  }
  deleteOverallRule(merchantid, ...args) {
    return axios.post(this.jwtConfig.deleteOverallPointRuleEndPoint, ...args, { params: { merchantid } }
    )
  }
  updateOverallRule(merchantid, ...args) {
    return axios.post(this.jwtConfig.editOverallPointRuleEndPoint, ...args, { params: { merchantid } }
    )
  }

  //service poin rule
  setServicePointRule(...args) {
    return axios.post(this.jwtConfig.setServicePointRuleEndPoint, ...args)
  }
  getServicePointRules() {
    return axios.get(this.jwtConfig.getServicePointRuleEndPoint)
  }
  deleteServicePointRule(...args) {
    return axios.post(this.jwtConfig.deleteServicePointRuleEndPoint, ...args)
  }

  //service
  getServiceList() {
    return axios.get(this.jwtConfig.createServiceEnpoint)
  }
  approveOrRejectService(id, status) {
    return axios.get(`${this.jwtConfig.serviceListEndpoint}/id/${id}/name/${this.userName}/status/${status}`)
  }
  getPendingServiceList() {
    return axios.get(`${this.jwtConfig.createServiceEnpoint}/temp`)
  }
  createService(...args) {
    return axios.post(`${this.jwtConfig.createServiceEnpoint}/name/${this.userName}`, ...args)
  }
  deleteService(id) {
    return axios.delete(`${this.jwtConfig.deleteServiceEndpoint}/${id}/name/${this.userName}`)
  }
  editService(id, ...args) {
    return axios.put(`${this.jwtConfig.createServiceEnpoint}/service-id/${id}/name/${this.userName}`, ...args)
  }
  checkDeleteAvailability(id) {
    return axios.get(`${this.jwtConfig.serviceListEndpoint}/check/service-id/${id}`)
  }
  checkEditDeleteAvailability(id, opType) { //opType 2 for update and 3 for delete
    return axios.get(`${this.jwtConfig.serviceListEndpoint}/check?serviceId=${id}&operationType=${opType}`)
  }

  //service logic
  getServiceLogicList() {
    return axios.get(this.jwtConfig.serviceLogicEndpoint)
  }
  createServiceLogic(...args) {
    return axios.post(`${this.jwtConfig.serviceLogicEndpoint}/name/${this.userName}`, ...args)
  }
  getPendingServiceLogicList() {
    return axios.get(`${this.jwtConfig.serviceLogicEndpoint}/temp`)
  }
  approveOrRejectServiceLogic(id, status) {
    return axios.get(`${this.jwtConfig.serviceLogicEndpoint}/id/${id}/name/${this.userName}/status/${status}`)
  }
  deleteServiceLogic(id) {
    return axios.delete(`${this.jwtConfig.serviceLogicEndpoint}/id/${id}/name/${this.userName}`)
  }
  editServiceLogic(id, ...args) {
    return axios.put(`${this.jwtConfig.serviceLogicEndpoint}/id/${id}/name/${this.userName}`, ...args)
  }
  getServiceLogicByServiceId(id) {
    return axios.get(`${this.jwtConfig.serviceLogicEndpoint}/serviceId/${id}`)
  }

  //campaign_budget
  createCampaignBudget(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/create_campaign_budget`, ...args)
  }
  campaign_budget_approve_reject_delete(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_budget_approve_reject_delete`, ...args)
  }
  campaignBudgetList() {
    return axios.get(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_budget_list`)
  }
  campaignBudgetPendingList() {
    return axios.get(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_budget_pending_list`)
  }

  //group profile map
  checkGroupAssignment(id) {
    return axios.get(`${this.jwtConfig.groupProfileMapEndpoint}/check/id/${id}`)
  }

  //central group
  csvDownloadPending(...args) {
    return axios.post(this.jwtConfig.csvDownloadPendingEndpoint, ...args)
  }
  contactCSVDownload(...args) {
    return axios.post(`${this.jwtConfig.group_management_endpoint}/contact_import_csv`, ...args)
  }
  // createCentralGroup(...args) {
  //   return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/create_campaign_group`, ...args)
  // }
  // editCampaignGroup(...args) {
  //   return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/edit_campaign_group`, ...args)
  // }
  createCentralGroup(...args) {
    return axios.post(`${this.jwtConfig.group_management_endpoint}/create_campaign_group`, ...args)
  }
  editCampaignGroup(...args) {
    return axios.post(`${this.jwtConfig.group_management_endpoint}/edit_campaign_group`, ...args)
  }
  getCentralGroup() {
    return axios.get(`${this.jwtConfig.group_management_endpoint}/campaign_group_list`)
  }
  getPendingCentralGroup() {
    return axios.get(`${this.jwtConfig.group_management_endpoint}/campaign_group_pending_list`)
  }

  deleteCentralGroup(...args) {
    return axios.post(`${this.jwtConfig.group_management_endpoint}/campaign_group_approve_reject_delete`, ...args)
  }
  approveRejectCentralGroup(...args) {
    return axios.post(`${this.jwtConfig.gropActionEndpoint}`, ...args)
  }
  getApproveRejectList(id) {
    return axios.get(`${this.jwtConfig.gropActionEndpoint}/${id}`)
  }

  //rilac reporting

  getDetailsNotificationReport(...args) {
    return axios.post(this.jwtConfig.notificationDetailsReport, ...args)
  }
  
  getAdPublicationReport(...args) {
    return axios.post(this.jwtConfig.adPublicationReport, ...args)
  }
  //rilac history
  campaignHistory(...args) {
    return axios.post(this.jwtConfig.campaignHistoryEndpoint, ...args)
  }
  onlineRuleHistory(...args) {
    return axios.post(this.jwtConfig.onlineRuleHistoryEndpoint, ...args)
  }
  servicePoinRuleHistory(...args) {
    return axios.post(this.jwtConfig.servicePoinRuleHistoryEndpoint, ...args)
  }

  //realtime commision rule
  realtimeRuleList() {
    return axios.get(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/all`)
  }
  currentRealtimeRuleList() {
    return axios.get(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/current`)
  }
  getPendingRealtimeRuleList() {
    return axios.get(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/temp`)
  }
  createRealtimeRule(...args) {
    return axios.post(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/name/${this.userName}`, ...args)
  }
  approveOrRejectRealtimeRule(id, status) {
    return axios.get(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/id/${id}/name/${this.userName}/status/${status}`)
  }
  checkRealtimeRule(id, opType) {
    return axios.get(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/check?commissionId=${id}&operationType=${opType}`)
  }
  deleteRealtimeRule(id, type) {
    return axios.delete(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/commission-id/${id}/name/${this.userName}`)
  }
  editRealtimeRule(id, ...args) {
    return axios.put(`${this.jwtConfig.realtimeCommisionRuleEndpoint}/commission-id/${id}/name/${this.userName}`, ...args)
  }

  //Offline commision rule
  offlineRuleList() {
    return axios.get(`${this.jwtConfig.oflineCommisionRuleEndpoint}`)
  }
  pendingOfflineRuleList() {
    return axios.get(`${this.jwtConfig.oflineCommisionRuleEndpoint}/temp`)
  }
  createOfflineRule(...args) {
    return axios.post(`${this.jwtConfig.oflineCommisionRuleEndpoint}/name/${this.userName}`, ...args)
  }
  approveOrRejectOfflineRule(id, status) {
    return axios.get(`${this.jwtConfig.oflineCommisionRuleEndpoint}/id/${id}/name/${this.userName}/status/${status}`)
  }
  checkOfflineRule(id, opType) {
    return axios.get(`${this.jwtConfig.oflineCommisionRuleEndpoint}/check?id=${id}&operationType=${opType}`)
  }
  deleteOfflineRule(id) {
    return axios.delete(`${this.jwtConfig.oflineCommisionRuleEndpoint}/id/${id}/name/${this.userName}`)
  }
  editOfflineRule(id, ...args) {
    return axios.put(`${this.jwtConfig.oflineCommisionRuleEndpoint}/id/${id}/name/${this.userName}`, ...args)
  }

  //bms campaign management
  campaignList() {
    return axios.get(`${this.jwtConfig.campaignEndpoint}`)
  }
  getPendingCampaignList() {
    return axios.get(`${this.jwtConfig.campaignEndpoint}/temp`)
  }
  createCampaign(...args) {
    return axios.post(`${this.jwtConfig.campaignEndpoint}/name/${this.userName}`, ...args)
  }
  updateCampaign(id, ...args) {
    return axios.put(`${this.jwtConfig.campaignEndpoint}/id/${id}/name/${this.userName}`, ...args)
  }
  approveOrRejectCampaign(id, status) {
    return axios.get(`${this.jwtConfig.campaignEndpoint}/id/${id}/name/${this.userName}/status/${status}`)
  }
  checkCampaign(id, opType) {
    return axios.get(`${this.jwtConfig.campaignEndpoint}/check?id=${id}&operationType=${opType}`)
  }
  deleteCampaign(id) {
    return axios.delete(`${this.jwtConfig.campaignEndpoint}/id/${id}/name/${this.userName}`)
  }
  activeCampaignList() {
    return axios.get(`${this.jwtConfig.campaignEndpoint}/active`)
  }

  //realtime transaction logs
  realtimeTranLogs(page, size, startDate, endDate) {
    return axios.get(`${this.jwtConfig.realtimeTranLogsEndpoint}?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`)
  }
  grossCampaignReport(startDate, endDate) {
    return axios.get(`${this.jwtConfig.realtimeTranLogsEndpoint}/report?startDate=${startDate}&endDate=${endDate}`)
  }
  campaignBaseRealtimeLog(id, page, size, startDate, endDate) {
    return axios.get(`${this.jwtConfig.realtimeTranLogsEndpoint}/campaign_id/${id}?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`)
  }
  //offline transaction logs
  offlineTranLogs(page, size, startDate, endDate) {
    return axios.get(`${this.jwtConfig.offlineTranLogsEndpoint}?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`)
  }

  //ad management
  getCampaignSettings() {
    return axios.get(this.jwtConfig.getCampaignSettingsEndpoint)
  }
  getMerchentCampaignSettings() {
    return axios.get(this.jwtConfig.getMerchentCampaignSettingsEndpoint)
  }
  updateFacebookPageCrd(...args) {
    return axios.post(this.jwtConfig.updateFacebookPageCrdEndpoint, ...args)
  }
  updateCampaignSettings(...args) {
    return axios.post(this.jwtConfig.updateCampaignSettingsEndpoint, ...args)
  }
  updateCampaignSettingsNotFb(...args) {
    return axios.post(this.jwtConfig.updateCampaignSettingsNotFbEndpoint, ...args)
  }
  getQuotaList() {
    return axios.get(this.jwtConfig.quotaListEndpoint)
  }
  createQuotaList(...args) {
    return axios.post(this.jwtConfig.createQuotaEndpoint, ...args)
  }
  quotaApproveRejectDelete(...args) {
    return axios.post(this.jwtConfig.quotaApproveRejectDeleteEndpoint, ...args)
  }
  osList(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/get_userOs_list`, ...args)
  }
  lifeEventList(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/get_lifeEvent_list`, ...args)
  }
  interestList(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/get_interest_list`, ...args)
  }
  behaviorList(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/get_behaviour_list`, ...args)
  }
  countryList(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/get_country_list`, ...args)
  }
  regionList(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/get_region_by_country_list`, ...args)
  }
  createAdRule(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/create_campaign_rule`, ...args)
  }
  editAdRule(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/edit_campaign_rule`, ...args)
  }
  adRuleList(...args) {
    return axios.get(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_rule_list`, ...args)
  }
  singleAdRule(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/single_campaign_rule`, ...args)
  }
  approveRejectDeleteAdRule(...args) {
    return axios.post(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_rule_approve_reject_delete`, ...args)
  }
  createAd(...args) {
    return axios.post(this.jwtConfig.createadEndpoint, ...args)
  }
  editAd(...args) {
    return axios.post(this.jwtConfig.editadEndpoint, ...args)
  }
  adList(...args) {
    return axios.get(this.jwtConfig.adListEndpoint, ...args)
  }
  approveRejectDeleteAd(...args) {
    return axios.post(this.jwtConfig.adApproveRejectDeleteEndpoint, ...args)
  }
  getImageHash(...args) {
    return axios.post(this.jwtConfig.imageHashEndpoint, ...args)
  }
  updatelongLiveToken(...args) {
    return axios.post(this.jwtConfig.longLiveTokenEndpoint, ...args)
  }

  //complain
  complainList(...args) {
    return axios.get(`${this.jwtConfig.complainEndpoint}/complain_list`, ...args)
  }
  deleteComplain(...args) {
    return axios.post(`${this.jwtConfig.complainEndpoint}/delete_complain`, ...args)
  }
  createComplain(...args) {
    return axios.post(`${this.jwtConfig.complainEndpoint}/create_complain`, ...args)
  }
  editComplain(...args) {
    return axios.post(`${this.jwtConfig.complainEndpoint}/edit_complain`, ...args)
  }

  //bulk Notification
  getBulkNotificationWithoutGroup() {
    return axios.get(this.jwtConfig.getBulkNotificationWithoutGroupEndpoint)
  }
  getBulkNotificationList() {
    return axios.get(this.jwtConfig.getBulkNotificationEndpoint)
  }
  getCampaignChannelList() {
    return axios.get(this.jwtConfig.getCampaignChannelsEndpoint)
  }
  createBulkNotification(...args) {
    return axios.post(this.jwtConfig.createBulkNotificationEndpoint, ...args)
  }
  bulkNotificationApproveRejectDelete(...args) {
    return axios.post(this.jwtConfig.notificationApproveRejectDeleteEndpoint, ...args)
  }

  //notifications
  getNotifications(...args) {
    return axios.get(this.jwtConfig.getNotificationsEndpoint, ...args)
  }
  createNotifications(...args) {
    return axios.post(this.jwtConfig.createNotificationsEndpoint, ...args)
  }
  deleteNotifications(...args) {
    return axios.post(this.jwtConfig.deleteNotificationsEndpoint, ...args)
  }

  // UMS apis
  getMerchantPlanMenuList(...args) {
    return axios.get(this.jwtConfig.getMerchantPlanMenu)
  }
  getAdminMenuSubmenuList(...args) {
    return axios.get(this.jwtConfig.getAdminMenuSubmenuList)
  }
  getUsertittleList() {
    return axios.get(this.jwtConfig.getUsertittleList)
  }
  createAdminUser(...args) {
    return axios.post(this.jwtConfig.createAdminUser, ...args)
  }
  AdminUsersList(...args) {
    return axios.get(this.jwtConfig.AdminUsersList, ...args)
  }
  getApprovalEntryforAdminUser(id) {
    return axios.get(`${this.jwtConfig.approveRejectAdminUsers}/${id}`)
  }
  approveRejectAdminUsers(...args) {
    return axios.post(this.jwtConfig.approveRejectAdminUsers, ...args)
  }
  AdminUsersAssignedMenus(...args) {
    return axios.get(this.jwtConfig.AdminUsersAssignedMenus, ...args)
  }
  adminUserDelete(...args) {
    return axios.post(this.jwtConfig.adminUserDelete, ...args)
  }
  editAdminUser(...args) {
    return axios.post(this.jwtConfig.editAdminUser, ...args)
  }
  userMenusForEdit(...args) {
    return axios.post(this.jwtConfig.userMenusForEdit, ...args)
  }
  PendingUserMenusForEdit(...args) {
    return axios.post(this.jwtConfig.pendingUserMenusForEdit, ...args)
  }

  BDAddressList() {
    return axios.get(this.jwtConfig.getBDAddressList)
  }

  tierList() {
    return axios.get(this.jwtConfig.tierListEndpoint)
  }
  pendingTierList() {
    return axios.get(this.jwtConfig.pendingTierListEndpoint)
  }
  tierCreate(...args) {
    return axios.post(this.jwtConfig.tierCreateUpdateDeleteEndpoint, ...args)
  }
  tierAction(...args) {
    return axios.post(this.jwtConfig.tierApproveRejectEndpoint, ...args)
  }
  deleteTier(id) {
    return axios.delete(`${this.jwtConfig.tierCreateUpdateDeleteEndpoint}/${id}`)
  }
  updateTier(...args) {
    return axios.put(this.jwtConfig.tierCreateUpdateDeleteEndpoint, ...args)
  }

  campaignAlertList() {
    return axios.get(this.jwtConfig.campaignAlertListEndpoint)
  }
  campaignAlertCreate(...args) {
    return axios.post(this.jwtConfig.campaignAlertCreateEndpoint, ...args)
  }
  deleteCampaignAlert(...args) {
    return axios.post(this.jwtConfig.campaignAlertDeleteEndpoint, ...args)
  }
  updateCampaignAlert(...args) {
    return axios.post(this.jwtConfig.campaignAlertUpdateEndpoint, ...args)
  }

  getCustomerAgentFilter(...args) {
    return axios.post(this.jwtConfig.customerAgentFilter, ...args)
  }
  getSmsRate(...args) {
    return axios.get(this.jwtConfig.getSmsRate, ...args)
  }
  updateSmsRate(...args) {
    return axios.post(this.jwtConfig.updateSmsRate, ...args)
  }
  get_global_commission_rate(...args) {
    return axios.get(this.jwtConfig.get_global_commission_rate, ...args)
  }
  edit_global_commission_rate(...args) {
    return axios.post(this.jwtConfig.edit_global_commission_rate, ...args)
  }

  get_merchant_commission_rate(...args) {
    return axios.post(this.jwtConfig.get_merchant_commission_rate, ...args)
  }
  create_merchant_commission_rate(...args) {
    return axios.post(this.jwtConfig.create_merchant_commission_rate, ...args)
  }
  edit_merchant_commission_rate(...args) {
    return axios.post(this.jwtConfig.edit_merchant_commission_rate, ...args)
  }
  delete_merchant_commission_rate(...args) {
    return axios.post(this.jwtConfig.delete_merchant_commission_rate, ...args)
  }
  notificationTemplateList() {
    return axios.get(this.jwtConfig.notificationTemplateList)
  }
  notificationTemplateLogs() {
    return axios.get(this.jwtConfig.notificationTemplateLogs)
  }
  notificationTemplateEdit(...args) {
    return axios.post(this.jwtConfig.notificationTemplateEdit, ...args)
  }
  serviceRuleAction(...args) {
    return axios.post(this.jwtConfig.serviceRuleAction, ...args)
  }
  updateServiceRule(...args) {
    return axios.post(this.jwtConfig.updateServiceRule, ...args)
  }
  pendingServicePointRules(rule_id) {
    if (rule_id) {
      return axios.get(`${this.jwtConfig.pendingServicePointRules}?rule_id=${rule_id}`)
    } else return axios.get(this.jwtConfig.pendingServicePointRules)
  }
  createPromotion(...args) {
    return axios.post(this.jwtConfig.createPromotion, ...args)
  }
  campgnPromotionAprvRjctDlt(...args) {
    return axios.post(this.jwtConfig.campgnPromotionAprvRjctDlt, ...args)
  }
  updatePromotion(...args) {
    return axios.post(this.jwtConfig.updatePromotion, ...args)
  }
  campgnPromotionList() {
    return axios.get(this.jwtConfig.campgnPromotionList)
  }
  campgnPromotionPendingList() {
    return axios.get(this.jwtConfig.campgnPromotionPendingList)
  }

  createAdCampaign(...args) {
    return axios.post(this.jwtConfig.createAdCampaignEndpoint, ...args)
  }
  editAdCampaign(...args) {
    return axios.post(this.jwtConfig.editAdCampaignEndpoint, ...args)
  }
  actionAdCampaign(...args) {
    return axios.post(this.jwtConfig.actionAdCampaignEndpoint, ...args)
  }
  currencyList() {
    return axios.get(this.jwtConfig.currencyListEndpoint)
  }
  campaignClientList() {
    return axios.get(this.jwtConfig.campaignClientListEndpoint)
  }
  campaignClientCreate(...args) {
    return axios.post(this.jwtConfig.campaignClientCreateEndpoint, ...args)
  }
  notificationPlansList() {
    return axios.get(this.jwtConfig.notificationPlansListEndpoint)
  }
  createNotificationPlan(...args) {
    return axios.post(this.jwtConfig.createNotificationPlansEndpoint, ...args)
  }
  editNotificationPlans(...args) {
    return axios.post(this.jwtConfig.editNotificationPlansEndpoint, ...args)
  }
  notificationPlansAction(...args) {
    return axios.post(this.jwtConfig.notificationPlansActionEndpoint, ...args)
  }
  adCostUpdate(...args) {
    return axios.post(this.jwtConfig.adCostUpdateEndpoint, ...args)
  }
  getAdCost() {
    return axios.get(this.jwtConfig.getAdCostEndpoint)
  }
  planList() {
    return axios.get(this.jwtConfig.planListEndpoint)
  }
  planListDescription(id) {
    return axios.get(`${this.jwtConfig.planListEndpoint}/${id}`)
  }
  allSidePanelFeature() {
    return axios.post(this.jwtConfig.allSidePanelFeatureEndpoint)
  }
  pricingAndDetails() {
    return axios.post(this.jwtConfig.pricingAndDetailsEndpoint)
  }
  planListAllFeatures() {
    return axios.post(this.jwtConfig.planListAllFeaturesEndpoint)
  }
  planListWithFeatures() {
    return axios.post(this.jwtConfig.planListFeaturesEndpoint)
  }
  pricingFormDataInput(...args) {
    return axios.post(this.jwtConfig.pricingFormDataEndpoint, ...args)
  }
  planTaxList() {
    return axios.get(this.jwtConfig.planTaxListEndpoint)
  }
  createPlanTax(...args) {
    return axios.post(this.jwtConfig.planTaxListEndpoint, ...args)
  }
  editPlanTax(...args) {
    return axios.put(this.jwtConfig.planTaxListEndpoint, ...args)
  }
  deletePlanTax(data) {
    return axios.delete(`${this.jwtConfig.planTaxListEndpoint}/${data.id}`)
  }
  userPlan(...args) {
    return axios.post(`${this.jwtConfig.planListEndpoint}/user-plan`, ...args)
  }
  planMigration(...args) {
    return axios.post(this.jwtConfig.planMigrationEndpoint, ...args)
  }
  createPlanList(...args) {
    return axios.post(this.jwtConfig.planListEndpoint, ...args)
  }
  updatePlanList(...args) {
    return axios.put(this.jwtConfig.planListEndpoint, ...args)
  }
  approveOrRejectPlan(...args) {
    return axios.post(`${this.jwtConfig.planListEndpoint}/action`, ...args)
  }
  deletePlan(data) {
    return axios.delete(`${this.jwtConfig.planListEndpoint}/${data.plan_id}`)
  }
  myPendingPlan() {
    return axios.get(`${this.jwtConfig.planListEndpoint}/pending/my`)
  }
  pendingPlan() {
    return axios.get(`${this.jwtConfig.planListEndpoint}/pending/others`)
  }
  payAsGoCharges() {
    return axios.get(this.jwtConfig.payAsGoChargesEndpoint)
  }
  goCardLessPaymentSuccess(...args) {
    return axios.post(this.jwtConfig.goCardLessPaymentSuccessEndpoint, ...args)
  }
  stripeData(...args) {
    return axios.get(this.jwtConfig.stripeDataEndpoint, ...args)
  }
  payByStripe(...args) {
    return axios.post(this.jwtConfig.payByStripeEndpoint, ...args)
  }
  quotaRequestPayByStripe(...args) {
    return axios.post(this.jwtConfig.quotaRequestPayByStripe, ...args)
  }
  googleCampaignAdvertisingChannelType() {
    return axios.get(this.jwtConfig.googleCampaignAdvertisingChannelTypeEndpoint)
  }
  facebookCampaignSpecialAdCategories() {
    return axios.get(this.jwtConfig.facebookCampaignSpecialAdCategoriesEndpoint)
  }
  facebookCampaignObjectives() {
    return axios.get(this.jwtConfig.facebookCampaignObjectivesEndpoint)
  }
  googleTimezoneList() {
    return axios.get(this.jwtConfig.googleTimezoneListEndpoint)
  }
  getFbpageCategory() {
    return axios.get(this.jwtConfig.getFbpageCategoryEndpoint)
  }
  
  fbPagePostBonusCampSummary() {
    return axios.get(this.jwtConfig.fbPagePostBonusCampSummaryEndpoint)
  }
  fbPagePostBonusCamp(...args) {
    return axios.post(this.jwtConfig.fbPagePostBonusCampEndpoint, ...args)
  }
  fbPagePostCmnt(...args) {
    return axios.post(this.jwtConfig.fbPagePostCmntEndpoint, ...args)
  }
  fbPagePostReaction(...args) {
    return axios.post(this.jwtConfig.fbPagePostReactionEndpoint, ...args)
  }
  fbPagePostReplyCmnt(...args) {
    return axios.post(this.jwtConfig.fbPagePostReplyCmntEndpoint, ...args)
  }
  fbPagePostReplyList(...args) {
    return axios.post(this.jwtConfig.fbPagePostReplyListEndpoint, ...args)
  }

  allBlackList() {
    return axios.get(this.jwtConfig.blackListEndpoint)
  }
  pendingBlackList() {
    return axios.get(`${this.jwtConfig.blackListEndpoint}/pending`)
  }
  blackListById(id) {
    return axios.get(`${this.jwtConfig.blackListEndpoint}/${id}`)
  }
  deleteBlackList(id) {
    return axios.delete(`${this.jwtConfig.blackListEndpoint}/${id}`)
  }
  createBlackList(...args) {
    return axios.post(this.jwtConfig.blackListEndpoint, ...args)
  }
  actionBlackList(...args) {
    return axios.post(`${this.jwtConfig.blackListEndpoint}/action`, ...args)
  }
  editBlackList(...args) {
    return axios.put(this.jwtConfig.blackListEndpoint, ...args)
  }
  exportBlackListCSV(...args) {
    return axios.post(`${this.jwtConfig.blackListEndpoint}/export-csv`, ...args)
  }
  
  bulkSMSList() {
    return axios.get(this.jwtConfig.bulkSMSEndpoint)
  }
  pendingBulkSMS() {
    return axios.get(`${this.jwtConfig.bulkSMSEndpoint}/pending`)
  }
  bulkSMSById(id) {
    return axios.get(`${this.jwtConfig.bulkSMSEndpoint}/${id}`)
  }
  deleteBulkSMS(id) {
    return axios.delete(`${this.jwtConfig.bulkSMSEndpoint}/${id}`)
  }
  createBulkSMS(...args) {
    return axios.post(this.jwtConfig.bulkSMSEndpoint, ...args)
  }
  actionBulkSMS(...args) {
    return axios.post(`${this.jwtConfig.bulkSMSEndpoint}/action`, ...args)
  }
  // bulk email
  bulkEmailList() {
    return axios.get(this.jwtConfig.bulkEmailListEndpoint)
  }
  createBulkEmail(...args) {
    return axios.post(this.jwtConfig.createBulkEmailEndpoint, ...args)
  }
  actionBulkEmail(...args) {
    return axios.post(`${this.jwtConfig.bulkEmailListEndpoint}/action`, ...args)
  }
  deleteBulkEmail(id) {
    return axios.delete(`${this.jwtConfig.bulkEmailListEndpoint}/${id}`)
  }
  // campaign management
  campServiceAction(...args) {
    return axios.post(this.jwtConfig.campServiceActionEndpoint, ...args)
  }
  campServiceViewApproval(id) { 
    return axios.get(`${this.jwtConfig.campServiceViewApprovalEndpoint}/${id}`)
  }
  campMapAction(...args) {
    return axios.post(this.jwtConfig.campMapActionEndpoint, ...args)
  }
  campMapViewApproval(id) {
    return axios.get(`${this.jwtConfig.campMapViewApprovalEndpoint}/${id}`)
  }
  campRoleAction(...args) {
    return axios.post(this.jwtConfig.campRoleActionEndpoint, ...args)
  }
  campRoleViewApproval(id) {
    return axios.get(`${this.jwtConfig.campRoleViewApprovalEndpoint}/${id}`)
  }
  campOfflineAction(...args) {
    return axios.post(this.jwtConfig.campOfflineActionEndpoint, ...args)
  }
  campOfflineViewApproval(id) {
    return axios.get(`${this.jwtConfig.campOfflineViewApprovalEndpoint}/${id}`)
  }
  // ad management - shovan
  adCampaignAction(...args) {
    return axios.post(this.jwtConfig.adCampaignActionEndpoint, ...args)
  }
  adCampaignViewApproval(id) {
    return axios.get(`${this.jwtConfig.adViewApprovalEndpoint}/${id}`)
  }
  adRoleAction(...args) {
    return axios.post(this.jwtConfig.adRoleActionEndpoint, ...args)
  }
  adRoleViewApproval(id) {
    return axios.get(`${this.jwtConfig.adRoleViewApprovalEndpoint}/${id}`)
  }
  adContentAction(...args) {
    return axios.post(this.jwtConfig.adCampaignContentActionEndpoint, ...args)
  }
  adContentViewApprovalContent(id) {
    return axios.get(`${this.jwtConfig.adViewApprovalContentEndpoint}/${id}`)
  }
  // operator api for datalist
  operatorList() {
    return axios.get(this.jwtConfig.operatorListEndpoint)
  }
  // datapack system function
  datapackList() {
    return axios.get(this.jwtConfig.datapackListEndpoint)
  }
  datapackPendingList() {
    return axios.get(this.jwtConfig.datapackPendingListEndpoint)
  }
  datapackCreate(...args) {
    return axios.post(this.jwtConfig.datapackCreateEndpoint, ...args)
  }
  datapackUpdate(...args) {
    return axios.post(this.jwtConfig.datapackUpdateEndpoint, ...args)
  }
  datapackDelete(...args) {
    return axios.post(this.jwtConfig.datapackDeleteEndpoint, ...args)
  }
  datapackAction(...args) {
    return axios.post(this.jwtConfig.datapackActionEndpoint, ...args)
  }
// multi
datapackListApprove(...args) {
  return axios.post(this.jwtConfig.datapackListApproveEndpoint, ...args)
}
datapackListApprovalById(id) {
  return axios.get(`${this.jwtConfig.datapackListApprovalByIdEndpoint}/${id}`)
}

  datapackGroupList() {
    return axios.get(this.jwtConfig.datapackGroupListEndpoint)
  }
  datapackGroupPendingList() {
    return axios.get(this.jwtConfig.datapackGroupPendingListEndpoint)
  }
  datapackGroupCreate(...args) {
    return axios.post(this.jwtConfig.datapackGroupCreateEndpoint, ...args)
  }
  datapackGroupUpdate(...args) {
    return axios.post(this.jwtConfig.datapackGroupUpdateEndpoint, ...args)
  }
  datapackGroupDelete(...args) {
    return axios.post(this.jwtConfig.datapackGroupDeleteEndpoint, ...args)
  }
  datapackGroupAction(...args) {
    return axios.post(this.jwtConfig.datapackGroupActionEndpoint, ...args)
  }
  // multi
  datapackGroupApprove(...args) {
    return axios.post(this.jwtConfig.datapackGroupApproveEndpoint, ...args)
  }
  datapackGroupApprovalById(id) {
    return axios.get(`${this.jwtConfig.datapackGroupApprovalByIdEndpoint}/${id}`)
  }
  subscriptionList() {
    return axios.get(this.jwtConfig.subscriptionList)
  }

}
