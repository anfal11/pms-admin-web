import {tinyurl_baseurl,  NJBC_base_url, subscription_BASE_URL, FILE_UPLOAD_BASE_URl, plan_service, tier_management_service, rilac_poll_service, alert_service, API_BASE_URL, BMS_API_BASE_URL, BMS_API_BASE_URL1, PMScore_API_BASE_URL, PMSVietnam2_API_BASE_URL, PMSVietnam_API_BASE_URL, PMS_Notification_Campaign_mgt_service, PMS_Notification_Template, PMS_service, PMS_user_management_service, Rilac_Report_Service, upay_log_service, Vendor_API_BASE_URL, fb_post_service, rilac_payment_service, rilac_registration_service, rilac_bulk_sms_service, multi_role_service, pms_admin_service, BRAC_GROUP_BASE_URL, DATAPACK_BASE_URL, group_management_base_url, download_csv_base_url } from "../../../Configurables"

// ** Auth Endpoints
export default {

  merchentloginEndpoint: `${API_BASE_URL}/auth/login`,
  merchentsetpassword: `${API_BASE_URL}/auth/set_customer_password`,
  merchentregisterEndpoint: `${API_BASE_URL}/auth/check_mobile`,
  loginEndpoint: `${API_BASE_URL}/users/login`,
  checkMobileEndpoint: `${API_BASE_URL}/auth/v2/check_mobile`,
  checkOtpEndpoint: `${API_BASE_URL}/auth/otp_check`,
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: `${API_BASE_URL}/users/logout`,
  companystorelistEndpoint: `${API_BASE_URL}/store/companystorelist`,
  getaddressbypostcodeEndpoint: `${API_BASE_URL}/getaddressbypostcode`,
  storesizelistEndpoint: `${API_BASE_URL}/store/storesizelist`,
  businesscategorylistEndpoint: `${API_BASE_URL}/businesscategorylist`,
  businessmarketingpreferancelistEndpoint: `${API_BASE_URL}/businessmarketingpreferancelist`,
  businesstaglistEndpoint: `${API_BASE_URL}/businesstaglist`,
  useSymbolGroup: `${API_BASE_URL}/adminuser/usersymbolgroup`,
  stlcustomerregistration: `${API_BASE_URL}/stl/customer_registration`,
  businessAddEndpoint: `${API_BASE_URL}/customerbusiness/newcustomerbusinessadd`,
  pendingBusinessEndpoint: `${API_BASE_URL}/customerbusiness/pendingList`,
  approveRejectBusinessEndpoint: `${API_BASE_URL}/customerbusiness/approve_reject`,
  customerbusinesslistEndpoint: `${API_BASE_URL}/customerbusiness/customerbusinesslist`,
  updatebusinessEndpoint: `${API_BASE_URL}/customerbusiness/updatebusiness`,
  businessdeleteEndpoint: `${API_BASE_URL}/customerbusiness/businessdelete`,
  trollylistEndpoint: `${API_BASE_URL}/trolly/trollylist`,
  singlefileuploadEndpoint: `${API_BASE_URL}/fileupload`,
  customerbusinessdetailsEndpoint: `${API_BASE_URL}/customerbusiness/businessdetails`,
  pendingCustomerbusinessdetailsEndpoint: `${API_BASE_URL}/customerbusiness/v2/businessdetails`,
  registercustomerbusinessEndpoint: `${rilac_registration_service}/registration`,        
  trollyaddEndpoint: `${API_BASE_URL}/trolly/addatrolly`,
  trollyEditEndpoint: `${API_BASE_URL}/trolly/trollyupdate`,
  trollydeleteEndpoint: `${API_BASE_URL}/trolly/trollydelete`,
  userRoleList: `${API_BASE_URL}/userrole`,
  userTitleList: `${API_BASE_URL}/adminuser/usertittle`,
  addAdminUser: `${API_BASE_URL}/adminuser/adduser`,
  adminUserList: `${API_BASE_URL}/adminuser/getall`,
  adminUserEdit: `${API_BASE_URL}/adminuser/update`,
  adminUserdelete: `${API_BASE_URL}/adminuser/deleteuser`,
  adminUserBlock: `${API_BASE_URL}/adminuser/updatestatus`,
  adminUserDetails: `${API_BASE_URL}/adminuser/getdetails`,
  adminUserSearch: `${API_BASE_URL}/adminuser/search`,
  addProduct: `${API_BASE_URL}/product/addproduct`,

  productcategoryEndpoint: `${API_BASE_URL}/product/categorylist`,
  productcategoryaddEndpoint: `${API_BASE_URL}/product/addcategory`,
  productcategorydeleteEndpoint: `${API_BASE_URL}/product/deletecategory`,
  productcategoryupdateEndpoint: `${API_BASE_URL}/product/editcategory`,

  getPasswordConfigEndpoint: `${API_BASE_URL}/auth/get_pass_config`,
  changepasswordEndpoint: `${API_BASE_URL}/auth/adminuser/changepassword`,

  productdeleteEndpoint: `${API_BASE_URL}/product/deleteproduct`,
  updateproductEndpoint: `${API_BASE_URL}/product/updateproduct`,
  productsubcategoryEndpoint: `${API_BASE_URL}/product/subcategorylist`,
  productsubcategoryaddEndpoint: `${API_BASE_URL}/product/addsubcategory`,
  productsubcategorydeleteEndpoint: `${API_BASE_URL}/product/deletesubcategory`,
  productsubcategoryeditEndpoint: `${API_BASE_URL}/product/editsubcategory`,
  productlistSearch: `${API_BASE_URL}/product/search`,
  productlistEndpoint: `${API_BASE_URL}/product/getproductlist`,
  singleproductdetailsEndpoint: `${API_BASE_URL}/product/getsingleproductdetails`,

  allDeals: `${API_BASE_URL}/hotdeal/alldeal`,
  addNewHotDeal: `${API_BASE_URL}/hotdeal/add`,
  deleteHotDeal: `${API_BASE_URL}/hotdeal/delete`,
  viewHotDealDetails: `${API_BASE_URL}/hotdeal/product/detail`,
  editHotDeal: `${API_BASE_URL}/hotdeal/update`,

  appUserList: `${API_BASE_URL}/customer/mysubuserlist`,
  appUserType: `${API_BASE_URL}/subusertype`,
  appAddNewUser: `${API_BASE_URL}/customer/addsubuser`,
  appDeleteUser: `${API_BASE_URL}/customer/deletesubuser`,
  appEditUser: `${API_BASE_URL}/customer/editsubuser`,

  getAllCashNotes: `${API_BASE_URL}/invoicepayment/staff/getallcashnotes`,
  getAllPaymentType: `${API_BASE_URL}/invoicepayment/staff/getallpaymentype`,
  dailyCashNotesSubmit: `${API_BASE_URL}/invoicepayment/staff/dailycashnotesubmit`,
  customerCheckedInvoicesSummaryList: `${API_BASE_URL}/invoice/customercheckedinvoicesummerylist`,
  cashierServedSummeryInfo: `${API_BASE_URL}/users/cashierservedsummery`,
  customerinvoicedetailswithsubpaymentinfo: `${API_BASE_URL}/invoice/customerinvoicedetailswithsubpaymentinfo`,

  customerIOUsettingInfo: `${API_BASE_URL}/iou/customeriousettinginfo`,
  customerIOUmanage: `${API_BASE_URL}/iou/customerioumanage`,
  subpayment: `${API_BASE_URL}/invoicepayment/staff/subpayment`,
  resendnotificationforpay: `${API_BASE_URL}/invoicepayment/staff/resendnotificationforpayment`,
  deletesubpayment: `${API_BASE_URL}/invoicepayment/staff/deletesubpayment`,
  totalinvoicepayment: `${API_BASE_URL}/invoicepayment/staff/totalinvoicepayment`,
  invoiceList: `${API_BASE_URL}/invoice/staff/invoices_list_search`,
  invoiceDetails: `${API_BASE_URL}/invoice/staff/invoices_details`,

  submitDeposit: `${API_BASE_URL}/deposit/submit_deposit`,
  depositDelete: `${API_BASE_URL}/deposit/delete_deposit_log`,
  depositLogList: `${API_BASE_URL}/deposit/deposit_log_list`,
  depositFromTo: `${API_BASE_URL}/deposit/from_to`,
  cashDepositLogList: `${API_BASE_URL}/deposit/cash_deposit_log_list`,

  getMerchantDetails: `${API_BASE_URL}/getmerchentdetails`,
  setgocardlessdirectdebit: `${API_BASE_URL}/setgocardlessdirectdebit`,
  customerbusinesslistbycustomerid: `${API_BASE_URL}/customerbusinesslistbycustomerid`,
  customerpaymentinfolistbybusinessid: `${API_BASE_URL}/customerpaymentinfolistbybusinessid`,

  ChildSubcategoryListAPi: `${API_BASE_URL}/product/omschildsubcategorylist`,
  AddChildSubcategoryAPi: `${API_BASE_URL}/product/addomschildsubcategory`,
  EditChildSubcategoryAPi: `${API_BASE_URL}/product/editomschildsubcategory`,
  DeleteChildSubcategoryAPi: `${API_BASE_URL}/product/deleteomschildsubcategory`,

  ProductTypeListAPi: `${API_BASE_URL}/product/admin/producttypelist`,
  customerbusinesslistbymobileno: `${API_BASE_URL}/customerbusinesslistbymobileno`,
  SingleProductDetailsApi: `${API_BASE_URL}/product/getsingleproductdetails`,
  VendorOrderListApi: `${Vendor_API_BASE_URL}/ordermanagment/v1/orderlist`,
  VendorDashboardDataApi: `${Vendor_API_BASE_URL}/vendor/v1/dashboard`,
  updateproductApi: `${API_BASE_URL}/product/updateproduct`,
  merchent_pay: `2010/api/mlajan/merchent_pay`,
  SubUserListVendor: `${API_BASE_URL}/customer/mysubuserlist`,
  createSubUserVendor: `${API_BASE_URL}/customer/addsubuser`,
  editSubUserVendor: `${API_BASE_URL}/customer/editsubuser`,
  deleteSubUserVendor: `${API_BASE_URL}/customer/deletesubuser`,
  allVouchersListEndPoint: `${PMSVietnam_API_BASE_URL}/vouchers`,
  pendingVouchersListEndPoint: `${PMSVietnam_API_BASE_URL}/getPendingVouchersBySpecificMerchent`,

  getPMStoken: `${PMSVietnam2_API_BASE_URL}/token/getAccessToken`,
  deleteVoucherEndPoint: `${PMSVietnam2_API_BASE_URL}/voucher/delete`,
  approveVoucherEndPoint: `${PMSVietnam2_API_BASE_URL}/voucher/approve`,
  rejectVoucherEndPoint: `${PMSVietnam2_API_BASE_URL}/voucher/reject`,
  createVoucherEndPoint: `${PMSVietnam2_API_BASE_URL}/voucher/create`,
  editVoucherEndPoint: `${PMSVietnam2_API_BASE_URL}/voucher/update`,
  getTierListEndpoint: `${PMSVietnam2_API_BASE_URL}/voucher/tierList`,

  // setPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/SetMyRules`,
  setPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/v2/SetMyRules`,
  getPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/GetMyRules`,
  getAllPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/GetRuleList`,
  // deletePointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/deleteMyRules`,
  deletePointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/v2/deleteMyRules`,
  // editPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/updateMyRules`,
  editPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/v2/updateMyRules`,
  pendingPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/pendingskurule`,
  skuruleActionEndPoint: `${PMSVietnam2_API_BASE_URL}/skuruleaction`,

  setOverallPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/SetMyOverallRules`,
  getOverallPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/GetMyOverallRules`,
  getAllOverallPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/GetOverallRuleList`,
  deleteOverallPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/deleteMyOverallRules`,
  editOverallPointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/updateMyOverallRules`,

  getServicePointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/getServiceRules`,
  setServicePointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/v2/setServiceRule`,
  pendingServicePointRules: `${PMSVietnam2_API_BASE_URL}/v2/pendingServiceRule`,
  serviceRuleAction: `${PMSVietnam2_API_BASE_URL}/v2/serviceRuleaction`,
  updateServiceRule: `${PMSVietnam2_API_BASE_URL}/v2/updateServiceRule`,
  deleteServicePointRuleEndPoint: `${PMSVietnam2_API_BASE_URL}/v2/deleteServiceRule`,

  getBMStoken: `${BMS_API_BASE_URL}/crud/v1/token`,
  serviceListEndpoint: `${BMS_API_BASE_URL}/crud/v1/service-keyword`,
  pendingServiceListEndpoint: `${BMS_API_BASE_URL}/crud/v1/service-keyword/temp/name`,
  deleteServiceEndpoint: `${BMS_API_BASE_URL}/crud/v1/service-keyword/service-id`,
  updateServiceEndpoint: `${BMS_API_BASE_URL}/crud/v1/service-keyword/service-id`,

  //new node js service endpoint
  createServiceEnpoint: `${NJBC_base_url}/keword-service/service-keyword`,
  tempServiceEnpoint: `${NJBC_base_url}/keword-service/service-keyword/temp`,
  updateServiceEnpoint: `${NJBC_base_url}/keword-service/service-keyword/service-id`,
  deleteServiceEnpoint: `${NJBC_base_url}/keword-service/service-keyword/service-id`,
  createServiceKeywordEnpoint: `${NJBC_base_url}/keword-service/create`,
  approverejectServiceKeywordEnpoint: `${NJBC_base_url}/keword-service/action`,
  // online rule management start..
  campaignRewardTypeEndpoint: `${NJBC_base_url}/online-campaign-rule-management/campaign-reward-type`,
  commissionListDropdownEndpoint: `${NJBC_base_url}/online-campaign-rule-management/commissionList/dropdown`,
  commissionruleCreateEndPoint: `${NJBC_base_url}/online-campaign-rule-management/create`,
  commissionruleCountEndPoint: `${NJBC_base_url}/online-campaign-rule-management/commissionListCount`,
  commissionruleListEndPoint: `${NJBC_base_url}/online-campaign-rule-management/commissionList`,
  pendingCommissionruleListEndPoint: `${NJBC_base_url}/online-campaign-rule-management/pendingcommissionList`,
  actionCommissionruleEndPoint: `${NJBC_base_url}/online-campaign-rule-management/action`,
  commissionruleDetailsEndPoint: `${NJBC_base_url}/online-campaign-rule-management/commissionDetails`,
  commissionruleEditEndPoint: `${NJBC_base_url}/online-campaign-rule-management/update`,
  commissionruleDeleteEndPoint: `${NJBC_base_url}/online-campaign-rule-management/delete`,

  // online rule management end...

  //online campaign management start....
  onlineCampaignCreateEndPoint: `${NJBC_base_url}/online-campaign-management/createCampaign`,
  onlineCampaignListCountEndPoint: `${NJBC_base_url}/online-campaign-management/campaignListCount`,
  onlineCampaignListEndPoint: `${NJBC_base_url}/online-campaign-management/campaignList`,
  runningcampaignListEndPoint: `${NJBC_base_url}/online-campaign-management/runningcampaignList/dropdown`,
  onlineCampaignDetailsEndPoint: `${NJBC_base_url}/online-campaign-management/campaignDetails`,
  onlineTempCampaignDetailsEndPoint: `${NJBC_base_url}/online-campaign-management/campaignTempDetails`,
  onlinePendingCampaignListEndPoint: `${NJBC_base_url}/online-campaign-management/pendingcampaignList`,
  onlineCampaignActionEndPoint: `${NJBC_base_url}/online-campaign-management/action`,
  onlineCampaignEditEndPoint: `${NJBC_base_url}/online-campaign-management/updateCampaign`,
  onlineCampaignDeleteEndPoint: `${NJBC_base_url}/online-campaign-management/deleteCampaign`,
  onlineCampaignStatusChangeEndPoint: `${NJBC_base_url}/online-campaign-management/activeInactiveCampaign`,

  //online campaign management end....

  serviceLogicEndpoint: `${BMS_API_BASE_URL}/crud/v1/service-logic`,

  groupProfileMapEndpoint: `${BMS_API_BASE_URL}/crud/v1/group-profile-map`,

  realtimeCommisionRuleEndpoint: `${BMS_API_BASE_URL}/crud/v1/infiniti-bonus-main`,

  oflineCommisionRuleEndpoint: `${BMS_API_BASE_URL}/crud/v1/mfs-off-rule`,

  realtimeTranLogsEndpoint: `${BMS_API_BASE_URL}/crud/v1/infiniti-bonus-mis`,
  offlineTranLogsEndpoint: `${BMS_API_BASE_URL}/crud/v1/mfs-off-tran`,

  bmsDashboardEndpoint: `${BMS_API_BASE_URL}/crud/v1/dashboard`,

  campaignEndpoint: `${BMS_API_BASE_URL}/crud/v1/bonus-service-camp`,
  hierarchyEndpoint: `${BMS_API_BASE_URL1}/hierarchy/list`,

  getCampaignSettingsEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/get_campaign_settings`,
  getMerchentCampaignSettingsEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/get_merchent_campaign_settings`,
  updateFacebookPageCrdEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/update_facebook_page_crd`,
  updateCampaignSettingsEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/update_campaign_settings`,
  updateCampaignSettingsNotFbEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/update_campaign_settings_not_fb`,

  getFbpageCategoryEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/get_fbpage_category`,

  quotaListEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_quota_list`,
  createQuotaEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/create_campaign_quota`,
  quotaApproveRejectDeleteEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_quota_approve_reject_delete`,

  adListEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_ad_list`,
  createadEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/create_campaign_ad`,
  editadEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/edit_campaign_ad`,
  adApproveRejectDeleteEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_ad_approve_reject_delete`,
  imageHashEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/getImageHash`,
  longLiveTokenEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/getlongLiveAccessToken`,

  getNotificationsEndpoint: `${PMS_Notification_Campaign_mgt_service}/notifications`,
  createNotificationsEndpoint: `${PMS_Notification_Campaign_mgt_service}/notifications/create_notification`,
  deleteNotificationsEndpoint: `${PMS_Notification_Campaign_mgt_service}/notifications/delete_notification`,

  complainEndpoint: `${PMS_Notification_Campaign_mgt_service}/complain`,

  ad_grop_campaignEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management`,
  group_management_endpoint: `${group_management_base_url}/campaign-management`,
  group_contact_list_endpoint: `${group_management_base_url}/campaign-management/get_group_contacts`,
  pending_group_contact_list_endpoint: `${group_management_base_url}/campaign-management/get_group_contacts_pending`,
  inputInGroup: `${group_management_base_url}/campaign-management/input_in_group`,
  gropActionEndpoint: `${multi_role_service}/group-mangment`,
  csvDownloadPendingEndpoint: `${download_csv_base_url}/group/pending`,
  csvGroupDownloadEndpoint: `${download_csv_base_url}/group/main`,
  getGroupRulesEndpoint: `${group_management_base_url}/group-profile/get_rules`,
  createGroupV3Endpoint: `${group_management_base_url}/group-profile/create`,
  groupV3TempDetailsEndpoint: `${group_management_base_url}/group-profile/pending-details`,
  groupV3DetailsEndpoint: `${group_management_base_url}/group-profile/details`,
  groupV3DeleteEndpoint: `${group_management_base_url}/group-profile/delete`,
  approveRejectCentralGroupV3Endpoint: `${group_management_base_url}/group-profile/action`,


  getBulkNotificationEndpoint: `${PMS_Notification_Campaign_mgt_service}/bulk_notification/notification_list_with_group`, 
  getBulkNotificationWithoutGroupEndpoint: `${PMS_Notification_Campaign_mgt_service}/bulk_notification/notification_list_without_group`,
  createBulkNotificationEndpoint: `${PMS_Notification_Campaign_mgt_service}/bulk_notification/notification_create_with_group`,
  notificationApproveRejectDeleteEndpoint: `${PMS_Notification_Campaign_mgt_service}/bulk_notification/pending_group_notification_approve_reject_delete`,
  getCampaignChannelsEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/get_campaign_channel_list`,

  getSmsRate: `${PMS_Notification_Campaign_mgt_service}/cost-management/get_sms_rate`,
  updateSmsRate: `${PMS_Notification_Campaign_mgt_service}/cost-management/edit_sms_rate`,

  get_global_commission_rate: `${PMS_Notification_Campaign_mgt_service}/cost-management/get_global_commission_rate`,
  edit_global_commission_rate: `${PMS_Notification_Campaign_mgt_service}/cost-management/edit_global_commission_rate`,

  create_merchant_commission_rate: `${PMS_Notification_Campaign_mgt_service}/cost-management/create_merchant_commission_rate`,
  edit_merchant_commission_rate: `${PMS_Notification_Campaign_mgt_service}/cost-management/edit_merchant_commission_rate`,
  delete_merchant_commission_rate: `${PMS_Notification_Campaign_mgt_service}/cost-management/delete_merchant_commission_rate`,
  get_merchant_commission_rate: `${PMS_Notification_Campaign_mgt_service}/cost-management/get_merchant_commission_rate`,

  getBDAddressList: `${PMS_user_management_service}/bd-address/list`,
  
  roleListEndpoint: `${PMS_user_management_service}/role-management/admin/role_list`,
  createRoleEndpoint: `${PMS_user_management_service}/role-management/admin/create_role`,
  // shovan
  roleBasedApprovedListEndpoint: `${PMS_user_management_service}/role-module-mapping/all`,
  roleBasedUpdateEndpoint: `${PMS_user_management_service}/role-module-mapping/update-map`,
  roleBasedPendingEndpoint: `${PMS_user_management_service}/role-module-mapping/pending`,
  roleBasedActionEndpoint: `${PMS_user_management_service}/role-module-mapping/action`,
  rilacModuleListEndpoint: `${PMS_user_management_service}/role-module-mapping/get-rilac-module-list`,
  // actionRoleEndpoint: `${PMS_user_management_service}/role-management/admin/pending_role_approve_reject_delete`,
  actionRoleEndpoint: `${multi_role_service}/user-management/role`,
  updateRoleEndpoint: `${PMS_user_management_service}/role-management/admin/edit_role`,
  deleteRoleEndpoint: `${PMS_user_management_service}/role-management/admin/delete_role`,
  getAdminroleDetails: `${PMS_user_management_service}/role-management/admin/role_details`,
  getAdminroleTempDetails: `${PMS_user_management_service}/role-management/admin/role_temp_details`,
  getRoleListForAssign: `${PMS_user_management_service}/role-management/admin/role_list_for_assign`,

  getAdminMenuSubmenuList: `${PMS_user_management_service}/user-management/menusubmenu_list`,
  getUsertittleList: `${API_BASE_URL}/adminuser/usertittle`,
  getMerchantPlanMenu: `${PMS_user_management_service}/user-management/merchant_plan_functions_menu`,
  createAdminUser: `${PMS_user_management_service}/user-management/admin/create_user`,
  AdminUsersList: `${PMS_user_management_service}/user-management/admin/list`,
  editAdminUser: `${PMS_user_management_service}/user-management/admin/edit`,
  adminUserDelete: `${PMS_user_management_service}/user-management/admin/delete`,
  // approveRejectAdminUsers: `${PMS_user_management_service}/user-management/admin/pending_user_approve_reject_delete`,
  approveRejectAdminUsers: `${multi_role_service}/user-management/user`,
  AdminUsersAssignedMenus: `${PMS_user_management_service}/user-management/admin/assignmenusubmenu`,
  userMenusForEdit: `${PMS_user_management_service}/user-management/adminuser/assignmenusubmenu`,
  pendingUserMenusForEdit: `${PMS_user_management_service}/user-management/adminuser/pendinguser/assignmenusubmenu`,

  BulkVoucherPurchaseEndpoint: `${PMScore_API_BASE_URL}/bulk_purchase`,

  pollFormList: `${rilac_poll_service}/poll/poll-form-list`,
  FormQAsByID: `${rilac_poll_service}/poll/allPollListByForm`,
  createPoll: `${rilac_poll_service}/poll/createPoll`,
  updatePoll: `${rilac_poll_service}/poll/updatePoll`,
  deletePollForm: `${rilac_poll_service}/poll/delete-pollform`,
  pollLogs: `${rilac_poll_service}/poll/log-list`,

  pollReportUsers: `${rilac_poll_service}/poll-report/pollRespondedUsers`,
  pollReportingList: `${rilac_poll_service}/poll-report/pollReportingList`,
  analyzeMultipleQuestion: `${rilac_poll_service}/poll-report/analyzeMultipleQuestion`,
  analyzeSingleQuestion: `${rilac_poll_service}/poll-report/analyzeSingleQuestion`,
  analyzeDateTimeQuestion: `${rilac_poll_service}/poll-report/analyzeDateTimeQuestion`,
  analyzeTimeSeries: `${rilac_poll_service}/poll-report/analyzeTimeSeries`,
  responseCount: `${rilac_poll_service}/poll-report/responseCount`,

  tierListEndpoint: `${tier_management_service}/segmentation/all`,
  pendingTierListEndpoint: `${tier_management_service}/segmentation/pending`,
  tierCreateUpdateDeleteEndpoint: `${tier_management_service}/segmentation`,
  tierApproveRejectEndpoint: `${tier_management_service}/segmentation/action`,

  campaignAlertListEndpoint: `${alert_service}/campaign-alert`,
  campaignAlertCreateEndpoint: `${alert_service}/campaign-alert/create`,
  campaignAlertDeleteEndpoint: `${alert_service}/campaign-alert/delete`,
  campaignAlertUpdateEndpoint: `${alert_service}/campaign-alert/update`,

  customerAgentFilter: `${PMS_service}/user-filter/v1/getUserByFilter`,

  // BulkNotification-Report.. start
  notificationByGroupReport: `${Rilac_Report_Service}/report/notificationByGroup_report`,
  notificationDetailsReport: `${Rilac_Report_Service}/report/notificationReport`,
  adPublicationReport: `${Rilac_Report_Service}/report/adPublicationReport`,
  dashboardCountEndpoint: `${Rilac_Report_Service}/report/dashboard_count`,
  notificationTimeSeriesEndpoint: `${Rilac_Report_Service}/report/notification_timeSeries`,
  notificationReportEndpoint: `${Rilac_Report_Service}/report/v2/notificationReport`,
  notificationReportCountEndpoint: `${Rilac_Report_Service}/report/v2/notificationReportCount`,

  misBonusStatusEndpoint: `${Rilac_Report_Service}/report/misBonusStatus`,
  onlineCampaignReportEndpoint: `${Rilac_Report_Service}/campaign-report/onlineCampaignRewardReportList`,
  onlineCampaignReportCountEndpoint: `${Rilac_Report_Service}/campaign-report/onlineCampaignRewardReportCount`,
  onlineCampaignReportCountAllEndpoint: `${Rilac_Report_Service}/campaign-report/onlineCampaignRewardReportTotalCount`,


  // BulkNotification-Report.. end

  campaignHistoryEndpoint: `${upay_log_service}/campaign_history`,
  onlineRuleHistoryEndpoint: `${upay_log_service}/online_rule_history`,
  servicePoinRuleHistoryEndpoint: `${upay_log_service}/service_poin_rule_history`,

  notificationTemplateList: `${PMS_Notification_Template}/list`,
  notificationTemplateLogs: `${PMS_Notification_Template}/logs`,
  notificationTemplateEdit: `${PMS_Notification_Template}/update`,

  createPromotion: `${PMS_Notification_Campaign_mgt_service}/campaign-management/create_campaign_promotion`,
  updatePromotion: `${PMS_Notification_Campaign_mgt_service}/campaign-management/update_campaign_promotion`,
  campgnPromotionList: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_promotion_list`,
  campgnPromotionPendingList: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_promotion_pending_list`,
  campgnPromotionAprvRjctDlt: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_promotion_approve_reject_delete`,

  adCampaignListEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_google_facebook_rule_list`,
  createAdCampaignEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/create_google_facebook_campaign_rule`,
  editAdCampaignEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/edit_google_facebook_campaign_rule`,
  actionAdCampaignEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/google_facebook_campaign_rule_action`,
  
  currencyListEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/currency_list`,
  campaignClientListEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/campaign_client_list`,
  campaignClientCreateEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/create_campaign_client`,
  googleCampaignAdvertisingChannelTypeEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/google_campaign_advertising_channel_type`,
  facebookCampaignSpecialAdCategoriesEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/facebook_campaign_special_ad_categories`,
  facebookCampaignObjectivesEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/facebook_campaign_objectives`,
  googleTimezoneListEndpoint: `${PMS_Notification_Campaign_mgt_service}/campaign-management/google_timezone_list`,
  
  planListEndpoint: `${plan_service}/plans`,
  // allSidePanelFeatureEndpoint: `${plan_service}/plans/feature-list`,
  allSidePanelFeatureEndpoint: `${plan_service}/plans/v2/feature-list`,
  pricingAndDetailsEndpoint: `${plan_service}/plans/front-plan`,
  planListAllFeaturesEndpoint: `${plan_service}/plans/all`,
  planListFeaturesEndpoint: `${plan_service}/plans/features`,
  pricingFormDataEndpoint: `${plan_service}/plans/form`,
  planMigrationEndpoint: `${plan_service}/plan-migration`,
  planTaxListEndpoint: `${plan_service}/plan-tax`,
  notificationPlansListEndpoint: `${plan_service}/notificationPlans/notification_plan_list`,
  createNotificationPlansEndpoint: `${plan_service}/notificationPlans/create_notification_plan`,
  editNotificationPlansEndpoint: `${plan_service}/notificationPlans/edit_notification_plan`,
  notificationPlansActionEndpoint: `${plan_service}/notificationPlans/notification_plan_approve_reject_delete`,
  adCostUpdateEndpoint: `${plan_service}/smsAdCost/updateSmsAdCost`,
  getAdCostEndpoint: `${plan_service}/smsAdCost/getSmsAdCost`,
  payAsGoChargesEndpoint: `${plan_service}/quota-request/pay-as-go-charges`,

  goCardLessPaymentSuccessEndpoint: `${rilac_payment_service}/go-cardless/payment-success`,
  stripeDataEndpoint: `${rilac_payment_service}/stripe-payment/stripe_configuration`,
  payByStripeEndpoint: `${rilac_payment_service}/stripe-payment/pay`,
  quotaRequestPayByStripe: `${rilac_payment_service}/stripe-payment/quota-request`,

  fbPagePostBonusCampSummaryEndpoint: `${fb_post_service}/post/facebook_pagepost_with_bonus_campaign_summary`,
  fbPagePostBonusCampEndpoint: `${fb_post_service}/post/facebook_pagepost_with_bonus_campaign`,
  fbPagePostCmntEndpoint: `${fb_post_service}/post/facebook_pagepost_comments`,
  fbPagePostReactionEndpoint: `${fb_post_service}/post/facebook_pagepost_reactions`,
  fbPagePostReplyCmntEndpoint: `${fb_post_service}/post/facebook_pagepost_comment_reply`,
  fbPagePostReplyListEndpoint: `${fb_post_service}/post/get_facebook_pagepost_comment_reply`,
  // bulk sms
  blackListEndpoint: `${rilac_bulk_sms_service}/black-list`,
  bulkSMSEndpoint: `${rilac_bulk_sms_service}/bulk-sms`,

  // bulk email
  bulkEmailListEndpoint:  `${rilac_bulk_sms_service}/bulk-email`,
  createBulkEmailEndpoint:  `${rilac_bulk_sms_service}/bulk-email`,
  
  // New service....pms admin...
  pmsSystemVoucherListEndpoint: `${pms_admin_service}/voucher/v1/is_system_voucher`,
  pmsVoucherListEndpoint: `${pms_admin_service}/voucher/v1/list`,
  pmsVoucherDetailEndpoint: `${pms_admin_service}/voucher/v1/details`,
  pmsTempVoucherDetailEndpoint: `${pms_admin_service}/voucher/v1/tempdetails`,
  pmsVoucherCreateEndpoint: `${pms_admin_service}/voucher/v1/create`,
  pmsVoucherEditEndpoint: `${pms_admin_service}/voucher/v1/update`,
  pmsVoucherDeleteEndpoint: `${pms_admin_service}/voucher/v1/delete`,
  pmsVoucherReleaseEndpoint: `${pms_admin_service}/voucher/v1/vouchercodesrelease`,
  pmsVoucherReportListEndpoint: `${pms_admin_service}/voucher/v1/voucherReport`,
  pmsVoucherPurchaseReportListEndpoint: `${pms_admin_service}/voucher/v1/voucherPurchaseReport`,
  // pmsVoucherActionEndpoint: `${pms_admin_service}/voucher/v1/action`,
  pmsVoucherActionEndpoint: `${multi_role_service}/voucher-management/voucher`,
  pmsVoucherUnusedcodecsvDownloadEndpoint: `${download_csv_base_url}/voucher/generate-voucherunusedcustomcode-csv`,


  pmsVoucherBulkPurchaseListEndpoint: `${pms_admin_service}/voucher-bulk-purchase/v1/list`,
  pmsVoucherBulkPurchaseRequestEndpoint: `${pms_admin_service}/voucher-bulk-purchase/v1/request`,
  pmsVoucherBulkPurchaseActionEndpoint: `${pms_admin_service}/voucher-bulk-purchase/v1/action`,

  pmsPointRuleListEndpoint: `${pms_admin_service}/point-rule/v1/list`,
  pmsPointRuleDetailEndpoint: `${pms_admin_service}/point-rule/v1/details`,
  pmsTempPointRuleDetailEndpoint: `${pms_admin_service}/point-rule/v1/tempdetails`,
  pmsPointRuleCreateEndpoint: `${pms_admin_service}/point-rule/v1/create`,
  pmsPointRuleEditEndpoint: `${pms_admin_service}/point-rule/v1/update`,
  pmsPointRuleDeleteEndpoint: `${pms_admin_service}/point-rule/v1/delete`,

  countryListEndpoint: `${pms_admin_service}/address/country/list`,
  cityListEndpoint: `${pms_admin_service}/address/city/list`,

  //point convert......
  pointConvertDetailsEndpoint: `${pms_admin_service}/point-convert/v1/details`,
  pointConvertInfoUpdateEndpoint: `${pms_admin_service}/point-convert/v1/update`,
  pointConvertActionEndpoint: `${pms_admin_service}/point-convert/v1/action`,

  //report...
  singleVoucherReportEndpoint:`${pms_admin_service}/report/v1/voucher/single`,
  allVoucherReportEndpoint:`${pms_admin_service}/report/v1/voucher`,
  
  // pmsPointRuleActionEndpoint: `${pms_admin_service}/point-rule/v1/action`,
  pmsSKUActionEndpoint: `${multi_role_service}/loyalty-management/sku`,
  pmsGlobalActionEndpoint: `${multi_role_service}/loyalty-management/global`,
  pmsServiceRuleActionEndpoint: `${multi_role_service}/loyalty-management/service`,
  tierActionEndpoint: `${multi_role_service}/loyalty-management/tier`,
  // campaign management related api
  campServiceActionEndpoint:`${multi_role_service}/campaign-management/service`,
  campServiceViewApprovalEndpoint:`${multi_role_service}/campaign-management/service`,
  campMapActionEndpoint:`${multi_role_service}/campaign-management/campaign-map`,
  campMapViewApprovalEndpoint:`${multi_role_service}/campaign-management/campaign-map`,
  campRoleActionEndpoint:`${multi_role_service}/campaign-management/campaign-rule`,
  campRoleViewApprovalEndpoint:`${multi_role_service}/campaign-management/campaign-rule`,
  campOfflineActionEndpoint:`${multi_role_service}/campaign-management/offline`,
  campOfflineViewApprovalEndpoint:`${multi_role_service}/campaign-management/offline`,
  
  // Ad management related api
  adCampaignActionEndpoint:`${multi_role_service}/ad-management/campaign`,
  adViewApprovalEndpoint:`${multi_role_service}/ad-management/campaign`,
  adRoleActionEndpoint:`${multi_role_service}/ad-management/rule`,
  adRoleViewApprovalEndpoint:`${multi_role_service}/ad-management/rule`,
  adCampaignContentActionEndpoint:`${multi_role_service}/ad-management/content`,
  adViewApprovalContentEndpoint:`${multi_role_service}/ad-management/content`,

  singlefileuploadEndpoint: `${FILE_UPLOAD_BASE_URl}/image-upload/single`,
  singleVoucherCustomCodeFileupload: `${FILE_UPLOAD_BASE_URl}/voucher-customcode/single`,
  // operator api
  operatorListEndpoint: `${DATAPACK_BASE_URL}/datapack-operator/list`,
  // datapack api
  datapackListEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/datapack-list`,
  datapackPendingListEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/datapack-pending`,
  datapackCreateEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/datapack-create`,
  datapackUpdateEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/datapack-update`,
  datapackDeleteEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/datapack-delete`,
  datapackActionEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/datapack-action`,

  datapackGroupMyPendingListEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/my-pending`,
  datapackGroupOthersPendingListEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/others-pending`,

  // Datapack list multiRole
  datapackListApproveEndpoint:`${multi_role_service}/datapack-management/dApprove`,
  datapackListApprovalByIdEndpoint:`${multi_role_service}/datapack-management/dApprove`,

  datapackGroupListEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/list`,
  datapackGroupPendingListEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/pending`,
  datapackGroupCreateEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/create`,
  datapackGroupUpdateEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/update`,
  datapackGroupDeleteEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/delete`,
  datapackGroupActionEndpoint: `${DATAPACK_BASE_URL}/datapack-grouping/action`,
  // datapack group mutirole
  datapackGroupApproveEndpoint:`${multi_role_service}/datapack-management/datapackGroup`,
  datapackGroupApprovalByIdEndpoint:`${multi_role_service}/datapack-management/datapackGroup`,

  subscriptionList: `${subscription_BASE_URL}/Subscription/GetList`,

  // url-shortnere---start
  urlshortenerLiveListEndpoint: `${tinyurl_baseurl}/url-shortener/web/get_live_urls_data`,
  urlshortenerHistoryListEndpoint: `${tinyurl_baseurl}/url-shortener/web/history`,
  urlshortenerHistoryListCountEndpoint: `${tinyurl_baseurl}/url-shortener/web/historyCount`,
  urlshortenerCreateEndpoint: `${tinyurl_baseurl}/url-shortener`,

  // url-shortnere---end

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  HeaderModule: 'JW9tc0ByZWRsdGQl',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
