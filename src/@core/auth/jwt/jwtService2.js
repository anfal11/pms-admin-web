import axios2  from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

const instance = axios2.create()

export default class JwtService2 {

  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }
  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    console.log('jwtOverrideConfig ', jwtOverrideConfig)
    // ** Request Interceptor
    instance.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        console.log('config ', config)
        const accessToken = this.getToken()

        config.headers.Module = this.jwtConfig.HeaderModule

        if (!config.headers.Authorization) {

            config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    instance.interceptors.response.use(
      response => response,
      error => {

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

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  refreshToken() {
    // return instance.post(this.jwtConfig.refreshEndpoint, {
    //   RefreshToken: this.getRefreshToken(),
    //   Id: ((getUserData()).userData.Id)
    // })
  }
  
  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName) || null
  }

  AdminUsersAssignedMenus(...args) {
    const {accessToken} = args[0]
    const Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
    return instance.get(this.jwtConfig.AdminUsersAssignedMenus, { headers: { Authorization}})
  }

  AdminUsersList(...args) {
    return instance.get(this.jwtConfig.AdminUsersList)
  }

  logout(...args) {
    return instance.post(this.jwtConfig.logoutEndpoint, {}, ...args)
  }

  /*
  headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVyYXRvcl9pZCI6MTMsImlkIjoxMywicm9sZWlkIjoiMTIiLCJzdG9yZWlkIjoiMTYxNjUwMDY2NzgzNyIsIm1vYmlsZW5vIjpudWxsLCJ1c2VybmFtZSI6Im1lZW5hIiwibG9naW5fZGF0ZXRpbWUiOiIyMDIzLTA0LTIwVDA1OjQzOjA4Ljk1OFoiLCJpYXQiOjE2ODE5NjkzODksImV4cCI6MTY4MjE0MjE4OX0.6dM8PiUNs_poHCqMhbCH_q9LvZO3-YNn2wDxOjx7b1M"
        }
         */

  // Poll management start..
  pollFormList(...args) {
    return instance.get(this.jwtConfig.pollFormList, ...args)
  }
  pollLogs(...args) {
    return instance.get(this.jwtConfig.pollLogs, ...args)
  }
  deletePollForm(...args) {
    return instance.post(this.jwtConfig.deletePollForm, ...args)
  }
  createPoll(...args) {
    return instance.post(this.jwtConfig.createPoll, ...args)
  }

  FormQAsByID(...args) {
    return instance.post(this.jwtConfig.FormQAsByID, ...args)
  }

  updatePoll(...args) {
    return instance.post(this.jwtConfig.updatePoll, ...args)
  }

  // report...
  pollReportUsers(...args) {
    return instance.post(this.jwtConfig.pollReportUsers, ...args)
  }

  pollReportingList(...args) {
    return instance.post(this.jwtConfig.pollReportingList, ...args)
  }

  analyzeMultipleQuestion(...args) {
    return instance.post(this.jwtConfig.analyzeMultipleQuestion, ...args)
  }
  analyzeSingleQuestion(...args) {
    return instance.post(this.jwtConfig.analyzeSingleQuestion, ...args)
  }
  analyzeDateTimeQuestion(...args) {
    return instance.post(this.jwtConfig.analyzeDateTimeQuestion, ...args)
  }
  analyzeTimeSeries(...args) {
    return instance.post(this.jwtConfig.analyzeTimeSeries, ...args)
  }
  responseCount(...args) {
    return instance.post(this.jwtConfig.responseCount, ...args)
  }
  // Poll management end....

  //pms-admin-service start....
  pmsVoucher() {
    return instance.get(this.jwtConfig.pmsSystemVoucherListEndpoint)
  }

  pmsVoucherList(...args) {
    return instance.get(this.jwtConfig.pmsVoucherListEndpoint, ...args)
  }


  //http://localhost:5001/pmsadsapi/voucher/v1/details?voucherid=PD00206
  pmsVoucherDetail(...args) {
    const { voucherid } = args[0]
    const url = `${this.jwtConfig.pmsVoucherDetailEndpoint}?voucherid=${voucherid}`
    return instance.get(url, ...args)
  }

  pmsTempVoucherDetail(...args) {
    const { voucherid } = args[0]
    const url = `${this.jwtConfig.pmsTempVoucherDetailEndpoint}?voucherid=${voucherid}`
    return instance.get(url, ...args)
  }

  pmsVoucherCreate(...args) {
    return instance.post(this.jwtConfig.pmsVoucherCreateEndpoint, ...args)
  }

  pmsVoucherEdit(...args) {
    return instance.post(this.jwtConfig.pmsVoucherEditEndpoint, ...args)
  }

  pmsVoucherDelete(...args) {
    return instance.post(this.jwtConfig.pmsVoucherDeleteEndpoint, ...args)
  }

  pmsVoucherRelease(...args) {
    return instance.post(this.jwtConfig.pmsVoucherReleaseEndpoint, ...args)
  }

  pmsVoucherReportList(...args) {
    return instance.get(this.jwtConfig.pmsVoucherReportListEndpoint, ...args)
  }

  pmsVoucherUnusedcodecsvDownload(...args) {
    return instance.post(this.jwtConfig.pmsVoucherUnusedcodecsvDownloadEndpoint, ...args)
  }

  pmsVoucherPurchaseReportList(...args) {
    const { voucherid } = args[0]
    const url = `${this.jwtConfig.pmsVoucherPurchaseReportListEndpoint}?voucherid=${voucherid}`
    return instance.get(url, ...args)
  }

  getApprovalEntryforVoucher(id) {
    return instance.get(`${this.jwtConfig.pmsVoucherActionEndpoint}/${id}`)
  }

  pmsVoucherAction(...args) {
    return instance.post(this.jwtConfig.pmsVoucherActionEndpoint, ...args)
  }

  pmsVoucherBulkPurchaseList(...args) {
    return instance.get(this.jwtConfig.pmsVoucherBulkPurchaseListEndpoint, ...args)
  }

  pmsVoucherBulkPurchaseRequest(...args) {
    return instance.post(this.jwtConfig.pmsVoucherBulkPurchaseRequestEndpoint, ...args)
  }

  pmsVoucherBulkPurchaseAction(...args) {
    return instance.post(this.jwtConfig.pmsVoucherBulkPurchaseActionEndpoint, ...args)
  }

  pmsPointRuleList(...args) {
    const { rule_type } = args[0]
    const url = `${this.jwtConfig.pmsPointRuleListEndpoint}?rule_type=${rule_type}`
    return instance.get(url, ...args)
  }

  pmsPointRuleDetail(...args) {
    console.log('args ', args)
    const { rule_id } = args[0]
    const url = `${this.jwtConfig.pmsPointRuleDetailEndpoint}?rule_id=${rule_id}`
    return instance.get(url, ...args)
  }

  pmsTempPointRuleDetail(...args) {
    const { rule_id } = args[0]
    const url = `${this.jwtConfig.pmsTempPointRuleDetailEndpoint}?rule_id=${rule_id}`
    return instance.get(url, ...args)
  }

  pmsPointRuleCreate(...args) {
    return instance.post(this.jwtConfig.pmsPointRuleCreateEndpoint, ...args)
  }

  pmsPointRuleEdit(...args) {
    return instance.post(this.jwtConfig.pmsPointRuleEditEndpoint, ...args)
  }

  pmsPointRuleDelete(...args) {
    return instance.post(this.jwtConfig.pmsPointRuleDeleteEndpoint, ...args)
  }
// from
  getApprovalEntryforSku(id) {
    return instance.get(`${this.jwtConfig.pmsSKUActionEndpoint}/${id}`)
  }
  pmsSKUAction(...args) {
    return instance.post(this.jwtConfig.pmsSKUActionEndpoint, ...args)
  }

  getApprovalEntryforGlobal(id) {
    return instance.get(`${this.jwtConfig.pmsGlobalActionEndpoint}/${id}`)
  }
  pmsGlobalAction(...args) {
    return instance.post(this.jwtConfig.pmsGlobalActionEndpoint, ...args)
  }

  getApprovalEntryforServiceRule(id) {
    return instance.get(`${this.jwtConfig.pmsServiceRuleActionEndpoint}/${id}`)
  }
  pmsServiceRuleAction(...args) {
    return instance.post(this.jwtConfig.pmsServiceRuleActionEndpoint, ...args)
  }

  getApprovalEntryforTier(id) {
    return instance.get(`${this.jwtConfig.tierActionEndpoint}/${id}`)
  }
  pmsTierAction(...args) {
    return instance.post(this.jwtConfig.tierActionEndpoint, ...args)
  }

  pointConvertDetails(...args) {
    return instance.get(this.jwtConfig.pointConvertDetailsEndpoint, ...args)
  }

  pointConvertInfoUpdate(...args) {
    return instance.post(this.jwtConfig.pointConvertInfoUpdateEndpoint, ...args)
  }

  pointConvertAction(...args) {
    return instance.post(this.jwtConfig.pointConvertActionEndpoint, ...args)
  }

  countryList(...args) {
    return instance.get(this.jwtConfig.countryListEndpoint, ...args)
  }

  cityList(...args) {
    return instance.post(this.jwtConfig.cityListEndpoint, ...args)
  }
  //pms-admin-service end....

  customerBusinessList(...args) {
    return instance.post(this.jwtConfig.customerbusinesslistEndpoint, ...args)
  }

  getCentralGroup() {
    return instance.get(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_group_list`)
  }
  getContactList(page, limit, groupId) {
    return instance.get(`${this.jwtConfig.group_contact_list_endpoint}?page=${page}&limit=${limit}&group_id=${groupId}`)
  }
  pendingGetContactList(page, limit, group_id) {
    return instance.get(`${this.jwtConfig.pending_group_contact_list_endpoint}?group_id=${group_id}&page=${page}&limit=${limit}`)
  }
  inputInGroup(...args) {
    return instance.post(`${this.jwtConfig.inputInGroup}`, ...args)
  }

  getGroupRules(...args) {
    return instance.get(`${this.jwtConfig.getGroupRulesEndpoint}`, ...args)
  }
  createGroupV3(...args) {
    return instance.post(`${this.jwtConfig.createGroupV3Endpoint}`, ...args)
  }

  groupV3TempDetails(...args) {
    return instance.post(`${this.jwtConfig.groupV3TempDetailsEndpoint}`, ...args)
  }

  groupV3Details(...args) {
    return instance.post(`${this.jwtConfig.groupV3DetailsEndpoint}`, ...args)
  }
  deleteCentralGroupV3(...args) {
    return instance.post(`${this.jwtConfig.groupV3DeleteEndpoint}`, ...args)
  }
  approveRejectCentralGroupV3(...args) {
    return instance.post(`${this.jwtConfig.approveRejectCentralGroupV3Endpoint}`, ...args)
  }


  //tier_management_service start...
  tierList() {
    return instance.get(this.jwtConfig.tierListEndpoint)
  }

  //tier_management_service end...

  singleFileupload(...args) {
    return instance.post(this.jwtConfig.singlefileuploadEndpoint, ...args)
  }

  singleVoucherCustomCodeFileupload(...args) {

    return instance.post(this.jwtConfig.singleVoucherCustomCodeFileupload, ...args)
  }

  datapackGroupList() {
    return instance.get(this.jwtConfig.datapackGroupListEndpoint)
  }
  
  // rilac report service..
  getDashboardCounts() {

    return instance.get(this.jwtConfig.dashboardCountEndpoint)
  }
  notificationTimeSeries(...args) {
    return instance.post(this.jwtConfig.notificationTimeSeriesEndpoint, ...args)
  }

  getNotificationReport(...args) {
    return instance.post(this.jwtConfig.notificationByGroupReport, ...args)
  }

  //ad management...
  adCampaignList() {
    return instance.get(this.jwtConfig.adCampaignListEndpoint)
  }

  //multi rolebase approval.. start
  rilacModuleList() {
    return instance.get(this.jwtConfig.rilacModuleListEndpoint)
  }

  getCentralGroup() {
    return instance.get(`${this.jwtConfig.group_management_endpoint}/campaign_group_list`)
  }

  createCentralGroupV2(...args) {
    return instance.post(`${this.jwtConfig.group_management_endpoint}/v2/create_campaign_group`, ...args)
  }

  approveRejectCentralGroupV2(...args) {
    return instance.post(`${this.jwtConfig.group_management_endpoint}/v2/campaign_group_approve_reject_delete`, ...args)
  }

  singleImageUpload(...args) {
    return instance.post(this.jwtConfig.singlefileuploadEndpoint, ...args)
  }
  getCampaignChannelList() {
    return instance.get(this.jwtConfig.getCampaignChannelsEndpoint)
  }
  getFbpageCategory() {
    return instance.get(this.jwtConfig.getFbpageCategoryEndpoint)
  }
  adRuleList(...args) {
    return instance.get(`${this.jwtConfig.ad_grop_campaignEndpoint}/campaign_rule_list`, ...args)
  }
  createBulkNotification(...args) {
    return instance.post(this.jwtConfig.createBulkNotificationEndpoint, ...args)
  }

  datapackGroupMyPendingList(...args) {
    return instance.get(this.jwtConfig.datapackGroupMyPendingListEndpoint, ...args)
  }

  datapackGroupOtherPendingList(...args) {
    return instance.get(this.jwtConfig.datapackGroupOthersPendingListEndpoint, ...args)
  }

  //service management..
  getServiceList() {
    return instance.get(this.jwtConfig.createServiceEnpoint)
  }
  getPendingServiceList() {
    return instance.get(this.jwtConfig.tempServiceEnpoint)
  }
  updateServiceKeyword(...args) {
    return instance.put(`${this.jwtConfig.updateServiceEnpoint}/${args[0]['serviceId']}/name/${args[0]['action_by']}`, ...args)
  }
  deleteServiceKeyword(...args) {
    return instance.delete(`${this.jwtConfig.deleteServiceEnpoint}/${args[0]['serviceId']}`, ...args)
  }

  createService(...args) {
    return instance.post(this.jwtConfig.createServiceKeywordEnpoint, ...args)
  }

  approveRejectService(...args) {
    return instance.post(this.jwtConfig.approverejectServiceKeywordEnpoint, ...args)
  }
  campaignRewardType(...args) {
    return instance.get(this.jwtConfig.campaignRewardTypeEndpoint, ...args)

  }
  commissionListDropdown(...args) {
    return instance.get(this.jwtConfig.commissionListDropdownEndpoint, ...args)

  }

  commissionruleCreate(...args) {
    return instance.post(this.jwtConfig.commissionruleCreateEndPoint, ...args)
  }

  commissionruleCount(...args) {
    return instance.get(this.jwtConfig.commissionruleCountEndPoint, ...args)

  }
  commissionruleList(...args) {
    const { page, limit } = args[0]
    return instance.get(`${this.jwtConfig.commissionruleListEndPoint}?page=${page}&limit=${limit}`, ...args)

  }
  commissionruleDetails(...args) {
    return instance.post(this.jwtConfig.commissionruleDetailsEndPoint, ...args)

  }
  pendingCommissionruleList(...args) {
    return instance.get(this.jwtConfig.pendingCommissionruleListEndPoint, ...args)

  }

  actionCommissionrule(...args) {
    return instance.post(this.jwtConfig.actionCommissionruleEndPoint, ...args)

  }

  commissionruleEdit(...args) {
    return instance.post(this.jwtConfig.commissionruleEditEndPoint, ...args)

  }

  commissionruleDelete(...args) {
    return instance.post(this.jwtConfig.commissionruleDeleteEndPoint, ...args)

  }

  onlineCampaignCreate(...args) {
    return instance.post(this.jwtConfig.onlineCampaignCreateEndPoint, ...args)
  }
  onlineCampaignListCount(...args) {
    return instance.get(this.jwtConfig.onlineCampaignListCountEndPoint, ...args)
  }
  onlineCampaignList(...args) {
    const { page, limit } = args[0]
    return instance.get(`${this.jwtConfig.onlineCampaignListEndPoint}?page=${page}&limit=${limit}`, ...args)
  }

  runningcampaignList(...args) {
    return instance.get(this.jwtConfig.runningcampaignListEndPoint, ...args)
  }

  onlineCampaignDetails(...args) {
    return instance.post(this.jwtConfig.onlineCampaignDetailsEndPoint, ...args)
  }

  onlineCampaignEdit(...args) {
    return instance.post(this.jwtConfig.onlineCampaignEditEndPoint, ...args)
  }

  onlineCampaignDelete(...args) {
    return instance.post(this.jwtConfig.onlineCampaignDeleteEndPoint, ...args)
  }

  onlineCampaignStatusChange(...args) {
    return instance.post(this.jwtConfig.onlineCampaignStatusChangeEndPoint, ...args)
  }

  onlineTempCampaignDetails(...args) {
    return instance.post(this.jwtConfig.onlineTempCampaignDetailsEndPoint, ...args)
  }

  onlinePendingCampaignList(...args) {
    return instance.get(this.jwtConfig.onlinePendingCampaignListEndPoint, ...args)
  }

  actionCampaign(...args) {
    return instance.post(this.jwtConfig.onlineCampaignActionEndPoint, ...args)
  }

  notificationReportCount(...args) {
    return instance.post(this.jwtConfig.notificationReportCountEndpoint, ...args)
  }

  notificationReport(...args) {
    return instance.post(this.jwtConfig.notificationReportEndpoint, ...args)
  }

  misBonusStatus(...args) {
    return instance.post(this.jwtConfig.misBonusStatusEndpoint, ...args)
  }
  onlineCampaignReport(...args) {
    return instance.post(this.jwtConfig.onlineCampaignReportEndpoint, ...args)
  }
  onlineCampaignReportCount(...args) {
    return instance.post(this.jwtConfig.onlineCampaignReportCountEndpoint, ...args)
  }
  onlineCampaignReportCountAll(...args) {
    return instance.post(this.jwtConfig.onlineCampaignReportCountAllEndpoint, ...args)
  }

  // url-shortnere---start
  urlshortenerLiveList(...args) {
    return instance.get(this.jwtConfig.urlshortenerLiveListEndpoint, ...args)
  }
  urlshortenerHistoryList(...args) {
    const { page, limit } = args[0]
    return instance.get(`${this.jwtConfig.urlshortenerHistoryListEndpoint}?page=${page}&limit=${limit}`, ...args)
  }
  urlshortenerHistoryListCount(...args) {
    return instance.get(this.jwtConfig.urlshortenerHistoryListCountEndpoint, ...args)
  }
  urlshortenerCreate(...args) {
    return instance.post(this.jwtConfig.urlshortenerCreateEndpoint, ...args)
  }
  // url-shortnere---end

  allBlackList() {
    return instance.get(this.jwtConfig.blackListEndpoint)
  }
}
