import { lazy } from 'react'

const CustomiseRoutes = [
  //for admin..access..only
  {
    path: '/resetPassInside',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ResetPassword/ResetPassword')),
    component: lazy(() => import('../../views/AdminComponents/ResetPassword')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/dashboard',
    component: lazy(() => import('../../views/VendorComponents/Dashboard')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/url-shortener',
    component: lazy(() => import('../../views/AdminComponents/Url-Shortener')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/business',
    component: lazy(() => import('../../views/custom/AllBusinessList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/addnewbusiness',
    component: lazy(() => import('../../views/custom/addnewbusiness')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/businessdetails/:businessid',
    component: lazy(() => import('../../views/custom/viewbusinessinfo')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/pendingbusinessdetails/:businessid',
    component: lazy(() => import('../../views/custom/viewpendingbusinessinfo')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editbusiness/:businessid',
    component: lazy(() => import('../../views/custom/editbusiness')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adlist',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADManagement/AdList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/taxList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Settings/TaxList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/creatAd',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADManagement/CreateAd')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adCampaignlist',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADCampaignMgt/AdCampaignList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/creatAdCampaign',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADCampaignMgt/CreateAdCampaign')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/notificationPlanlist',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanNotificationManagement/NotificationPlanList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createNotificationPlan',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanNotificationManagement/CreateNotificationPlan')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editNotificationPlan/:planId',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanNotificationManagement/CreateNotificationPlan')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/notifiPlanDetails',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanNotificationManagement/notifiPlanDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editAdCampaign',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADCampaignMgt/editAdCampaign')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/planlist',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanManagement/PlanList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createPlan',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanManagement/CreatePlan')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editPlan/:planId',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanManagement/CreatePlan')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/planDetails',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PlanManagement/viewPlanDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/promolist',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/PromoList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createPromo',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/CreatePromo')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/updatePromo/:promo_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/EditModal')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/viewPromo/:promo_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/viewPromotion')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allproduct',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ProductManagement/VendorProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/EditProduct/:productID',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ProductManagement/EditProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/ProductDetails/:productID',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ProductManagement/ProductDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/UpdateProduct/:productID',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ProductManagement/UpdateProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/admin/addNewProduct',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ProductManagement/AddProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/complainListAdmin',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ComplainManagement/ComplainList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/settings',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Settings/Settings')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/settings/cost',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Settings/CostSettings')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/PollReporting',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PollManagement/PollReporting/PollReporting')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/PollReportDetails/:pollID',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PollManagement/PollReporting/DetailsPollReport')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AllTiers',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/TierManagement/TierList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/CreateTier',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/TierManagement/CreateTier')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AllPolls',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PollManagement/List')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/CreatePolls',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PollManagement/Create')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/EditPoll/:form_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PollManagement/Edit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AllCentralGroups',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CentralGroupManagement/GroupList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createCentralGroup',
    // component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CentralGroupManagement/CreateGroup')),
    component: lazy(() => import('../../views/AdminComponents/GroupManagement/GroupCreate')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editCentralGroup',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CentralGroupManagement/GroupEdit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AllVouchersADMIN',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/VoucherManagement/AllVoucherList')),
    component: lazy(() => import('../../views/AdminComponents/VoucherManagement-V2/AllVoucherList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/CreateVoucherADMIN',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/VoucherManagement/CreateVoucher')),
    component: lazy(() => import('../../views/AdminComponents/VoucherManagement-V2/CreateVoucher')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/UpdateVoucherADMIN',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/VoucherManagement/EditVouchers')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  // {
  //   path: '/bulkPurchaseVoucherADMIN',
  //   component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/VoucherManagement/BulkPurchaseVoucher')),
  //   exact: true,
  //   meta: {
  //     action: 'manage',
  //     resource: 'ADMIN'
  //   }
  // },
  {
    path: '/VoucherBulkPurchaseList',
    component: lazy(() => import('../../views/AdminComponents/VoucherManagement-V2/Voucher-bulk-purchase/bulk-purchase')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allBulkNotifications',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/NotificationList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createBulkNotification',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/CreateBulkNotification')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  { 
    path: '/createBulkNotificationv2',
    component: lazy(() => import('../../views/AdminComponents/BulkNotification/BulkNotificationCreate/index')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/detailsBulkNotification',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BulkNotificationDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allQuota',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/QuotaManagement/QuotaList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allBulkSMS',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BulkSms/BulkSmsList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createBulkSMS',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BulkSms/CreateBulkSMS')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/bulkCustomizeNotificationList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BulkCustomizeNotification/bulkCustomizeNotificationList.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createCustomizeNotification',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BulkCustomizeNotification/createCustomizeNotification.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/blackList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BlackList/BlackList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createBlackList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BlackList/CreateBlackList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editBlackList/:id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BlackList/CreateBlackList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createQuota',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/QuotaManagement/CreateQuota')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/Quotas/Approve',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/QuotaManagement/ApproveQuotas')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createAdRule',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/AdRuleManagement/AdRuleForm')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editAdRule',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/AdRuleManagement/EditAdRuleForm')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adRuleList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/AdRuleManagement/AdRulesList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createService',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ServiceManagement/CreateService')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allServices',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ServiceManagement/ServiceList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createRealtimeComRule',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/RealTimeCommisionRule/CreateRealTimeCommisionRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/updateRealtimeComRule',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/RealTimeCommisionRule/EditRealTimeCommisionRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allRealtimeComRule',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/RealTimeCommisionRule/RealTimeCommisionRuleList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allCampaigns',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CampaignManagement/CampaignList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createCampaigns',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CampaignManagement/SelectOrCreateRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editCampaign',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CampaignManagement/editCampaign')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/campaignDetails',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CampaignManagement/viewCampaign')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/campaignReport/:id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CampaignManagement/CampaignReport')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/realTimeTransactionLogs',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/RealtimeTranLogs/RealtimeTranLogs')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/offlineTransactionLogs',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/OfflineTranLogs/OfflineTranLogs')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/allOfflineRules',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/OfflineCommisionRule/OfflineCommisionRuleList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createOfflineRules',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/OfflineCommisionRule/CreateOfflineCommisionRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editOfflineRules',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/OfflineCommisionRule/EditOfflineCommisionRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createPointRuleForAdmin',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PointRuleManagement/CreatePointRule')),
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointRuleManagement/Sku/CreateSkuRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/pointRuleListForAdmin',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PointRuleManagement/PointRuleList')),
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointRuleManagement/Sku/SkuRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createServicePointRule',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ServicePointRuleManagement/CreateServicePointRule')),
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointRuleManagement/ServicePointRule/CreateServicePointRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/servicePointRuleList',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ServicePointRuleManagement/AllTabs')),
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointRuleManagement/ServicePointRule/ServicePointRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/pendingServicePointRule/:rule_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ServicePointRuleManagement/DetailsView')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/updateServicePointRule/:rule_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ServicePointRuleManagement/Update')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createOverallPointRuleForAdmin',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/OverallPointRuleManagement/CreateOverallPointRule')),
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointRuleManagement/Global/CreateGlobalRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/overallPointRuleListForAdmin',
    //component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/OverallPointRuleManagement/OverallPointRuleList')),
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointRuleManagement/Global/GlobalRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/PointConversion',
    component: lazy(() => import('../../views/AdminComponents/LoyltyManagement-V2/PointConversionRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/MerchantPayment',
    component: lazy(() => import('../../views/MerchantPayment.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/trolly',
    component: lazy(() => import('../../views/tables/data-tables/basic/TrollyTable')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/user',
    component: lazy(() => import('../../views/tables/data-tables/basic/UserTable')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/addNewUser',
    component: lazy(() => import('../../views/tables/data-tables/basic/AddNewUser')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/userDetails/:userID',
    component: lazy(() => import('../../views/custom/viewUserDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/EditUserInfo/:userID',
    component: lazy(() => import('../../views/custom/editUserInfo')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/category',
    component: lazy(() => import('../../views/tables/data-tables/basic/CategoryTable')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/ChildSubcategory',
    component: lazy(() => import('../../views/tables/data-tables/basic/ChildSubcategory')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  // {
  //   path: '/EditChildSubcategory/:ChildSubCategoryID',
  //   component: lazy(() => import('../../views/tables/data-tables/basic/EditChildSubcategory')),
  //   exact: true,
  //   meta: {
  //     action: 'manage',
  //     resource: 'ADMIN'
  //   }
  // },
  {
    path: '/subcategory',
    component: lazy(() => import('../../views/tables/data-tables/basic/SubCategoryTable')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/products',
    component: lazy(() => import('../../views/tables/data-tables/advance/ProductDataTableWithServerSidePagination')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/addNewProduct',
    component: lazy(() => import('../../views/tables/data-tables/advance/AddNewProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editproductdetails/:productid',
    component: lazy(() => import('../../views/tables/data-tables/advance/EditProductDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {

    path: '/OffersPromotions',
    component: lazy(() => import('../../views/tables/data-tables/advance/OffersPromotions')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AddHotDeal',
    component: lazy(() => import('../../views/tables/data-tables/advance/AddHotDeal')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/EditHotDeal/:productID',
    component: lazy(() => import('../../views/tables/data-tables/advance/EditHotDeal')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AppUserAccess/:businessId',
    component: lazy(() => import('../../views/custom/AppUserAccess')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/AppUserEdit/:mobileNo',
    component: lazy(() => import('../../views/custom/AppUserEdit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/DirectDebitSet',
    component: lazy(() => import('../../views/tables/data-tables/cashier/DirectDebit/DirectDebitSet')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adminUserList',
    component: lazy(() => import('../../views/AdminComponents/UserManagement/AllUserList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/EditUser/:username',
    component: lazy(() => import('../../views/AdminComponents/UserManagement/Edit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adminUserCreate',
    component: lazy(() => import('../../views/AdminComponents/UserManagement/Create')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/roleBasePermission',
    component: lazy(() => import('../../views/AdminComponents/RolebasedPermission')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  // shovan
  {
    path: '/roleBasePending',
    component: lazy(() => import('../../views/AdminComponents/RolebasedPermission/pendingView.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adminUserRoleList',
    component: lazy(() => import('../../views/AdminComponents/UserRole')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createUserRole',
    component: lazy(() => import('../../views/AdminComponents/UserRole/Create')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editUserRole/:id',
    component: lazy(() => import('../../views/AdminComponents/UserRole/edit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/viewUserRole/:id',
    component: lazy(() => import('../../views/AdminComponents/UserRole/view')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/viewUserPendingRole/:id',
    component: lazy(() => import('../../views/AdminComponents/UserRole/pendingView')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/notificationReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/Notification')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/campaignPerformanceReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/campaignPerformanceReport')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/detailsCampaignPerformanceReport/:name',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/DetailsFbPerformance')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/fbPagePostReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/fbPostReport')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/detailsFbPagePost/:notification_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/DetailsFbPagePost')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/campaignReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/campaignReport')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/detailsNotificationReport/:notification_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/DetailsNotification')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/notification/template',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Settings/NotifTemplate')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  }, 
  {
    path: '/voucherReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/Voucher')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/voucherperformanceReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/VoucherPerformance')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/loyaltyReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/Loyalty')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/adReport',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/Reporting/ad')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/onlineRuleHistory',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/HistoryLog/onlineRuleHistory')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/campaignHistory',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/HistoryLog/campaignHistory')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/campaignAlert',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/CampaignAlert/CampAlertScreen')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/servicePoinRuleHistory',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/HistoryLog/servicePoinRuleHistory')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/datapackList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackList/DatapackListMain.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createDatapackList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackList/CreateDatapackList.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editDatapackList',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackList/EditDatapackList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/datapackGroup',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackGrouping/DatapackGroup.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/createDatapack',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackGrouping/CreateDatapack.js')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  {
    path: '/editDatapack',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackGrouping/EditDatapackGroup')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'ADMIN'
    }
  },
  // {
  //   path: '/myGroupPendingList',
  //   component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/DatapackManagement/DatapackGrouping/MyPendingGroupList')),
  //   exact: true,
  //   meta: {
  //     action: 'manage',
  //     resource: 'ADMIN'
  //   }
  // },

  //for cashier access only..

  {
    path: '/payment',
    component: lazy(() => import('../../views/tables/data-tables/cashier/Payment')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/Payment/:payID',
    component: lazy(() => import('../../views/tables/data-tables/cashier/Pay4')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  /*{
    path: '/cashNotesSubmit',
    component: lazy(() => import('../../views/tables/data-tables/cashier/CashNotes')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },*/
  {
    path: '/CustomerIOUList',
    component: lazy(() => import('../../views/tables/data-tables/cashier/CustomerIOUList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/CustomerIOUSetting/:customerID',
    component: lazy(() => import('../../views/tables/data-tables/cashier/CustomerIOUSetting')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/InvoiceList',
    component: lazy(() => import('../../views/tables/data-tables/cashier/InvoiceList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/InvoiceListProducts/:receipt_id',
    component: lazy(() => import('../../views/tables/data-tables/cashier/InvoiceListProducts')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/depositmanagment',
    component: lazy(() => import('../../views/tables/data-tables/cashier/balancetransfer')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/CashDeposit',
    component: lazy(() => import('../../views/tables/data-tables/cashier/CashDeposit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/SafeDeposit',
    component: lazy(() => import('../../views/tables/data-tables/cashier/SafeDeposit')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/SafeDepositToBank',
    component: lazy(() => import('../../views/tables/data-tables/cashier/SafeDepoToBank')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'CASHIER'
    }
  },
  {
    path: '/vendordashboard',
    component: lazy(() => import('../../views/VendorComponents/Dashboard')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/planMigration',
    component: lazy(() => import('../../views/VendorComponents/PlanMigration/planMigration')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/vendor/allproduct',
    component: lazy(() => import('../../views/VendorComponents/ProductManage/VendorProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/vendor/EditProduct/:productID',
    component: lazy(() => import('../../views/VendorComponents/ProductManage/EditProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/vendor/ProductDetails/:productID',
    component: lazy(() => import('../../views/VendorComponents/ProductManage/ProductDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/vendor/UpdateProduct/:productID',
    component: lazy(() => import('../../views/VendorComponents/ProductManage/UpdateProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/vendor/addNewProduct',
    component: lazy(() => import('../../views/VendorComponents/ProductManage/AddProduct')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/profile',
    component: lazy(() => import('../../views/VendorComponents/Profile')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createSubUser',
    component: lazy(() => import('../../views/VendorComponents/UserManagement/CreateUser')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/SubUserList',
    component: lazy(() => import('../../views/VendorComponents/UserManagement/MysubUserList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/allBulkNotificationsVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/NotificationList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createBulkNotificationVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/CreateBulkNotification')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/detailsBulkNotificationVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/BulkNotification/BulkNotificationDetails')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createPointRule',
    component: lazy(() => import('../../views/VendorComponents/LoyltyManagement-V2/PointRuleManagement/Sku/CreateSkuRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/pointRuleList',
    component: lazy(() => import('../../views/VendorComponents/LoyltyManagement-V2/PointRuleManagement/Sku/SkuRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createOverallPointRule',
    component: lazy(() => import('../../views/VendorComponents/LoyltyManagement-V2/PointRuleManagement/Global/CreateGlobalRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/overallPointRuleList',
    component: lazy(() => import('../../views/VendorComponents/LoyltyManagement-V2/PointRuleManagement/Global/GlobalRule')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createNotification',
    component: lazy(() => import('../../views/VendorComponents/Notifications/CreateNotification')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/notificationList',
    component: lazy(() => import('../../views/VendorComponents/Notifications/NotificationList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/AllVouchers',
    component: lazy(() => import('../../views/VendorComponents/VoucherManagement-V2/AllVoucherList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/CreateVoucher',
    component: lazy(() => import('../../views/VendorComponents/VoucherManagement-V2/CreateVoucher')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/UpdateVoucher',
    component: lazy(() => import('../../views/VendorComponents/VoucherManagement/EditVouchers')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/bulkPurchaseVoucher',
    component: lazy(() => import('../../views/VendorComponents/VoucherManagement-V2/Voucher-bulk-purchase/bulk-purchase')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/complainList',
    component: lazy(() => import('../../views/VendorComponents/ComplainManagement/ComplainList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createComplain',
    component: lazy(() => import('../../views/VendorComponents/ComplainManagement/CreateComplain')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/settingsVendor',
    component: lazy(() => import('../../views/VendorComponents/Settings/SettingsVendor')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/quotas',
    component: lazy(() => import('../../views/VendorComponents/QuotaManage')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/quotas-request',
    component: lazy(() => import('../../views/VendorComponents/QuotaManage/QuotaRequest')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/quotas-submit-test',
    component: lazy(() => import('../../views/VendorComponents/QuotaManage/PayPalCardHolder')),
    layout: 'BlankLayout',
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/allQuotaVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/QuotaManagement/QuotaList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createQuotaVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/QuotaManagement/CreateQuota')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/adlistVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADManagement/AdList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/creatAdVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADManagement/CreateAd')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createAdRuleVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/AdRuleManagement/AdRuleForm')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/adRuleListVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/AdRuleManagement/AdRulesList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/adCampaignlistVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADCampaignMgt/AdCampaignList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/creatAdCampaignVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADCampaignMgt/CreateAdCampaign')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/editAdCampaignVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/ADCampaignMgt/editAdCampaign')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/promolistVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/PromoList')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/createPromoVendor',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/CreatePromo')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/updatePromoVendor/:promo_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/EditModal')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },
  {
    path: '/viewPromoVendor/:promo_id',
    component: lazy(() => import('../../views/tables/data-tables/basic/AdminComponent/PromoManagement/viewPromotion')),
    exact: true,
    meta: {
      action: 'manage',
      resource: 'VENDOR'
    }
  },

  {
    
    path: '/logout',
    component: lazy(() => import('../../views/logout')),
    className: 'logout'
  
  }
]
export default CustomiseRoutes
