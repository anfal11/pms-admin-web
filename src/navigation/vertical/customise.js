import { PlayLessonOutlined } from '@mui/icons-material'
import { Target, Activity, Award, BarChart, Bell, Box, Briefcase, Clipboard, Clock, CreditCard, Gift, Layers, List, Package, Paperclip, Plus, Settings, User, Users, Volume1, Smartphone, Slash, DollarSign } from 'react-feather'

// const userData = JSON.parse(localStorage.getItem('userData'))
const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
const userInfo = JSON.parse(localStorage.getItem('userData')) || {}
const menuIDs = AssignedMenus.map(x => x.id)
const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
const subMenuIDs = [].concat(...Array2D)
console.log("menuIDs", AssignedMenus)

export default [

  //for admin....
  {
    id: 1,
    title: 'Dashboard',
    icon: <Activity size={20} />,
    accessible: menuIDs.includes(1),
    navLink: '/dashboard',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 2,
    title: 'User Management',
    icon: <User size={20} />,
    accessible: menuIDs.includes(2),
    children: [
      {
        id: 'u8',
        accessible: subMenuIDs.includes(8),
        title: 'User List',
        icon: <User size={12} />,
        navLink: '/adminUserList',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'u5',
        accessible: subMenuIDs.includes(5),
        title: 'Add New',
        icon: <Plus size={12} />,
        navLink: '/adminUserCreate',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'umrole',
        accessible: subMenuIDs.includes(68),
        title: 'User Role',
        icon: <User size={12} />,
        navLink: '/adminUserRoleList',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 'tinyurl',
    title: 'Url-Shortener',
    icon: <Activity size={20} />,
    accessible: menuIDs.includes(19),
    navLink: '/url-shortener',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 3,
    title: 'Voucher Management',
    icon: <Gift size={20} />,
    accessible: menuIDs.includes(3),
    children: [
      {
        id: 'u10',
        accessible: subMenuIDs.includes(10),
        title: 'Create Voucher',
        icon: <Plus size={12} />,
        navLink: '/CreateVoucherADMIN',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'u9',
        accessible: subMenuIDs.includes(9),
        title: 'All Vouchers',
        icon: <List size={12} />,
        navLink: '/AllVouchersADMIN',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'u12',
        accessible: subMenuIDs.includes(77),
        title: 'Bulk Purchase',
        icon: <List size={12} />,
        navLink: '/VoucherBulkPurchaseList',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 4,
    title: 'Loyalty Management',
    icon: <Award size={20} />,
    accessible: menuIDs.includes(4),
    children: [
      {
        id: 47,
        accessible: subMenuIDs.includes(47),
        title: 'Product Management',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/allproduct',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 13,
        accessible: subMenuIDs.includes(13),
        title: 'SKU Rules',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/PointRuleListForAdmin',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 14,
        accessible: subMenuIDs.includes(14),
        title: 'Global Rule',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/overallPointRuleListForAdmin',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 15,
        accessible: subMenuIDs.includes(15),
        title: 'Service Point Rule',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/servicePointRuleList',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'PointConversionRule',
        title: 'Point Conversion Rule',
        icon: <List size={20} className="ml-1" />,
        navLink: `/PointConversion`,
        action: 'manage',
        resource: 'ADMIN',
        accessible: subMenuIDs.includes(15)
    },
      {
        id: 48,
        accessible: subMenuIDs.includes(48),
        title: 'Tier Management',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/AllTiers',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 5,
    title: 'Campaign Management',
    icon: <BarChart size={20} />,
    accessible: menuIDs.includes(5),
    children: [
      {
        id: 19,
        accessible: subMenuIDs.includes(19),
        title: 'Service',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/allServices',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 22,
        accessible: subMenuIDs.includes(22),
        title: 'Online Campaign Rule',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/allRealtimeComRule',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 24,
        accessible: subMenuIDs.includes(24),
        title: 'Online Campaign Map',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/allCampaigns',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 23,
        accessible: subMenuIDs.includes(23),
        title: 'Offline Campaign',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/allOfflineRules',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 63,
        accessible: subMenuIDs.includes(63),
        title: 'Campaign Alert',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/campaignAlert',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 6,
    title: 'Ad management',
    icon: <Volume1 size={20} />,
    accessible: menuIDs.includes(6),
    children: [
      {
        id: 66,
        accessible: subMenuIDs.includes(66),
        title: 'Ad Campaign management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/adCampaignlist',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 49,
        accessible: subMenuIDs.includes(49),
        title: 'Ad rule management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/adRuleList',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 50,
        accessible: subMenuIDs.includes(50),
        title: 'Ad content management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/adlist',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 18,
    title: 'Data pack management',
    icon: <Volume1 size={20} />,
    accessible: menuIDs.includes(18),
    children: [
      {
        id: 'datapack01',
        accessible: subMenuIDs.includes(96),
        title: 'Data pack',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/datapackList',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'datapack02',
        accessible: subMenuIDs.includes(100),
        title: 'Data pack grouping',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/datapackGroup',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 17,
    accessible: menuIDs.includes(17),
    title: 'Mobile App Promotion management',
    icon: <Smartphone size={20}/>,
    navLink: '/promolist',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 7,
    title: 'Outreach Campaign',
    icon: <Bell size={20} />,
    accessible: menuIDs.includes(7),
    children: [
      {
        id: 43,
        accessible: subMenuIDs.includes(43),
        title: 'Generalized',
        icon: <Bell size={12} className="ml-2" />,
        navLink: '/allBulkNotifications',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 44,
        accessible: subMenuIDs.includes(43),
        title: 'Personalized',
        icon: <Bell size={12} className="ml-2" />,
        navLink: '/bulkCustomizeNotificationList',
        action: 'manage',
        resource: 'ADMIN'
      },
      // {
      //   id: 43,
      //   accessible: subMenuIDs.includes(43),
      //   title: 'Bulk SMS',
      //   icon: <Bell size={12} className="ml-2" />,
      //   navLink: '/allBulkSMS',
      //   action: 'manage',
      //   resource: 'ADMIN'
      // },
      {
        id: 45,
        accessible: subMenuIDs.includes(43),
        title: 'DND List',
        icon: <Slash size={12} className="ml-2" />,
        navLink: '/blackList',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 8,
    accessible: menuIDs.includes(8),
    title: 'Settings',
    icon: <Settings size={20} />,
    children: [
      {
        id: 'settings1',
        accessible: subMenuIDs.includes(46),
        title: 'Credential Settings',
        icon: <List size={12} className="ml-2" />,
        navLink: '/settings',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'settings2',
        accessible: subMenuIDs.includes(105),
        title: 'Cost Management',
        icon: <List size={12} className="ml-2" />,
        navLink: '/settings/cost',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'settings3',
        accessible: subMenuIDs.includes(33),
        title: 'Budget Management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/allQuota',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'settings4',
        accessible: subMenuIDs.includes(34),
        title: 'Approve Quotas',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/Quotas/Approve',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'settings5',
        accessible: subMenuIDs.includes(59),
        title: 'Notification Management',
        icon: <Bell size={12} className="ml-2" />,
        navLink: '/notification/template',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'settings6',
        accessible: subMenuIDs.includes(67),
        title: 'Tax Management',
        icon: <Target size={12} className="ml-2" />,
        navLink: '/taxList',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'settings7',
        // accessible: subMenuIDs.includes(104),
        accessible: userInfo?.roleid === "12",
        title: 'Role Base Permission',
        icon: <Target size={12} className="ml-2" />,
        navLink: '/roleBasePermission',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 9,
    title: 'Business Management',
    icon: <Briefcase size={20} />,
    accessible: menuIDs.includes(9),
    children: [
      {
        id: 'b2',
        accessible: subMenuIDs.includes(2),
        // accessible: true,
        title: 'Business List',
        icon: <List size={12} />,
        navLink: '/business',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'u1',
        accessible: subMenuIDs.includes(1),
        title: 'Add New',
        icon: <Plus size={12} />,
        navLink: '/addnewbusiness',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 15,
    accessible: menuIDs.includes(15),
    title: 'Plan Management',
    icon: <Package size={20} />,
    navLink: '/planlist',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 16,
    accessible: menuIDs.includes(16),
    title: 'Notification Plan Management',
    icon: <Package size={20} />,
    navLink: '/notificationPlanlist',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 10,
    accessible: menuIDs.includes(10),
    title: 'Group Management',
    icon: <Users size={20} />,
    navLink: '/AllCentralGroups',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 11,
    accessible: menuIDs.includes(11),
    title: 'Poll Management',
    icon: <Clipboard size={20} />,
    children: [
      {
        id: 51,
        accessible: subMenuIDs.includes(51),
        title: 'Poll List',
        icon: <List size={12} className="ml-2" />,
        navLink: '/AllPolls',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 52,
        accessible: subMenuIDs.includes(52),
        title: 'Poll Reporting',
        icon: <List size={12} className="ml-2" />,
        navLink: '/PollReporting',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 12,
    accessible: menuIDs.includes(12),
    title: 'Complain Management',
    icon: <Box size={20} />,
    navLink: '/complainListAdmin',
    action: 'manage',
    resource: 'ADMIN'
  },
  {
    id: 13,
    accessible: menuIDs.includes(13),
    title: 'Reporting',
    icon: <Paperclip size={20} />,
    children: [
      {
        id: 'reporting1',
        accessible: subMenuIDs.includes(53),
        title: 'Notification Report',
        icon: <List size={12} className="ml-2" />,
        navLink: '/notificationReport',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting20',
        accessible: subMenuIDs.includes(54),
        title: 'Voucher Report',
        icon: <List size={12} className="ml-2" />,
        navLink: '/voucherReport',
        action: 'manage',
        resource: 'ADMIN'
      },
      // {
      //   id: 'reporting2',
      //   accessible: subMenuIDs.includes(54),
      //   title: 'Voucher performance',
      //   icon: <List size={12} className="ml-2" />,
      //   navLink: '/voucherperformanceReport',
      //   action: 'manage',
      //   resource: 'ADMIN'
      // },
      {
        id: 'reporting3',
        accessible: subMenuIDs.includes(55),
        title: 'Loyalty Report',
        icon: <List size={12} className="ml-2" />,
        navLink: '/loyaltyReport',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting4',
        accessible: subMenuIDs.includes(106),
        title: 'AD Publication Report',
        icon: <List size={12} className="ml-2" />,
        navLink: '/adReport',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting5',
        accessible: subMenuIDs.includes(57),
        title: 'Realtime Transaction Logs',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/realTimeTransactionLogs',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting6',
        accessible: subMenuIDs.includes(65),
        title: 'Campaign Report',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/campaignReport',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting7',
        accessible: subMenuIDs.includes(58),
        title: 'Offline Transactions',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/offlineTransactionLogs',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting8',
        accessible: subMenuIDs.includes(73),
        title: 'Campaign Performance Report',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/campaignPerformanceReport',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'reporting9',
        accessible: subMenuIDs.includes(107),
        title: 'FB Page Post Report',
        icon: <BarChart size={12} className="ml-2" />,
        navLink: '/fbPagePostReport',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  {
    id: 'log',
    accessible: menuIDs.includes(14),
    title: 'History Log',
    icon: <Clock size={20} />,
    children: [
      {
        id: 'log1',
        accessible: subMenuIDs.includes(60),
        title: 'Online Rule History',
        icon: <List size={12} className="ml-2" />,
        navLink: '/onlineRuleHistory',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'log2',
        accessible: subMenuIDs.includes(61),
        title: 'Campaign History',
        icon: <List size={12} className="ml-2" />,
        navLink: '/campaignHistory',
        action: 'manage',
        resource: 'ADMIN'
      },
      {
        id: 'log3',
        accessible: subMenuIDs.includes(62),
        title: 'Service Poin Rule History',
        icon: <List size={12} className="ml-2" />,
        navLink: '/servicePoinRuleHistory',
        action: 'manage',
        resource: 'ADMIN'
      }
    ]
  },
  // {
  //   id: 'dttrolly',
  //   title: 'Trolley',
  //   icon: <ShoppingCart size={20} />,
  //   navLink: '/trolly',
  //   action: 'manage',
  //   resource: 'ADMIN'
  // },
  // {
  //   id: 'dtBasic3',
  //   title: 'Staff Access Control',
  //   icon: <Users size={20} />,
  //   navLink: '/user',
  //   action: 'manage',
  //   resource: 'ADMIN'
  // },
  // {
  //   id: 'dtBasic4',
  //   title: 'Stock',
  //   icon: <Layers size={20} />,
  //   children: [
  //     {
  //       id: 'dtBasic41',
  //       title: 'Category',
  //       icon: <AlignJustify size={12} />,
  //       navLink: '/category',
  //       action: 'manage',
  //       resource: 'ADMIN'
  //     },
  //     {
  //       id: 'dtBasic42',
  //       title: 'Subcategory',
  //       icon: <AlignJustify size={12} />,
  //       navLink: '/subcategory',
  //       action: 'manage',
  //       resource: 'ADMIN'
  //     },
  //     {
  //       id: 'dtBasic44',
  //       title: 'Child Subcategory',
  //       icon: <AlignJustify size={12} />,
  //       navLink: '/ChildSubcategory',
  //       action: 'manage',
  //       resource: 'ADMIN'
  //     },
  //     {
  //       id: 'dtBasic43',
  //       title: 'Product',
  //       icon: <AlignJustify size={12} />,
  //       navLink: '/products',
  //       action: 'manage',
  //       resource: 'ADMIN'
  //     }
  //   ]
  // },
  // {
  //   id: 'dtBasic5',
  //   title: 'Offers & Promotions',
  //   icon: <Percent size={20} />,
  //   navLink: '/OffersPromotions',
  //   action: 'manage',
  //   resource: 'ADMIN'
  // },
  // {
  //   id: 'DirectDebitSet',
  //   title: 'Direct Debit Set',
  //   icon: <CreditCard size={20} />,
  //   navLink: '/DirectDebitSet',
  //   action: 'manage',
  //   resource: 'ADMIN'
  // },

  //for cashier access..only..
  {
    id: 'cashierPayment',
    title: 'Payment',
    icon: <CreditCard size={20} />,
    navLink: '/payment',
    action: 'manage',
    resource: 'CASHIER'
  },
  /*{
    id: 'cashNotesSubmit',
    title: 'Daily Cash Notes',
    icon: <DollarSign size={20} />,
    navLink: '/cashNotesSubmit',
    action: 'manage',
    resource: 'CASHIER'
  },*/
  {
    id: 'CustomerIOUList',
    title: 'Customer IOU List',
    icon: <Users size={20} />,
    navLink: '/CustomerIOUList',
    action: 'manage',
    resource: 'CASHIER'
  },
  {
    id: 'InvoiceList',
    title: 'Invoice List',
    icon: <List size={20} />,
    navLink: '/InvoiceList',
    action: 'manage',
    resource: 'CASHIER'
  },
  {
    id: 'Balance Transfer',
    title: 'Deposit Managment',
    icon: <Layers size={20} />,
    navLink: '/depositmanagment',
    action: 'manage',
    resource: 'CASHIER'
  },
  {
    id: 'Dashboard3',
    title: 'Dashboard',
    icon: <Activity size={20} />,
    navLink: '/vendordashboard',
    action: 'manage',
    resource: 'VENDOR'
  },
  {
    id: 'planMigration',
    title: 'Plan Migration',
    icon: <Package size={20} />,
    navLink: '/planMigration',
    action: 'manage',
    resource: 'VENDOR'
  },
  {
    id: 'planRecharge',
    title: 'Plan Recharge',
    icon: <DollarSign size={20} />,
    navLink: '/quotas-request',
    action: 'manage',
    resource: 'VENDOR'
  },
  // {
  //   id: 'orderId',
  //   title: 'Order',
  //   icon: <Briefcase size={20} />,
  //   children: [
  //     {
  //       id: 'allid',
  //       title: 'Business List',
  //       icon: <List size={12} />,
  //       navLink: '/allbusiness',
  //       action: 'allbusiness',
  //       resource: 'VENDOR'
  //     },
  //     {
  //       id: 'pendingid',
  //       title: 'Pending',
  //       icon: <List size={12} />,
  //       // icon: <Plus size={12} />,
  //       navLink: '/pendingbusiness',
  //       action: 'pendingbusiness',
  //       resource: 'VENDOR'
  //     },
  //     {
  //       id: 'processing',
  //       title: 'Processing',
  //       icon: <List size={12} />,
  //       navLink: '/processingbusiness',
  //       action: 'procesing',
  //       resource: 'VENDOR'
  //     },
  //     {
  //       id: 'delivered',
  //       title: 'Delivered',
  //       icon: <List size={12} />,
  //       navLink: '/alldbussiness',
  //       action: 'delivered',
  //       resource: 'VENDOR'
  //     },
  //     {
  //       id: 'returned',
  //       title: 'Returned',
  //       icon: <List size={12} />,
  //       navLink: '/allreturned',
  //       action: 'returned',
  //       resource: 'VENDOR'
  //     },
  //     {
  //       id: 'failedid',
  //       title: 'Failed',
  //       icon: <List size={12} />,
  //       navLink: '/allfaield',
  //       action: 'all failed',
  //       resource: 'VENDOR'
  //     }
  //   ]
  // },
  {
    id: 'productID',
    title: 'Products',
    icon: <Briefcase size={20} />,
    children: [
      {
        id: 'productsID',
        title: 'Product List',
        icon: <List size={12} className="ml-2" />,
        navLink: '/vendor/allproduct',
        action: 'allproduct',
        resource: 'VENDOR'
      }
      // {
      //   id: 'bulkimport',
      //   title: 'Bulk Import',
      //   icon: <List size={12} />,
      //   // icon: <Plus size={12} />,
      //   navLink: '/bulkimport',
      //   action: 'bulkimport',
      //   resource: 'VENDOR'
      // },
      // {
      //   id: 'Bulkexport',
      //   title: 'Bulk Export',
      //   icon: <List size={12} />,
      //   navLink: '/bulkexport',
      //   action: 'bulkexport',
      //   resource: 'VENDOR'
      // }
    ]
  },
  // {
  //   id: 'demo',
  //   title: 'Merchant Payment',
  //   icon: <CreditCard size={20} />,
  //   navLink: '/MerchantPayment',
  //   action: 'manage',
  //   resource: 'ADMIN'
  // },
  {
    id: 'usermanage',
    title: 'User Management',
    icon: <Users size={20} />,
    children: [
      {
        id: 'usermanage1',
        title: 'Create User',
        icon: <User size={12} className="ml-2" />,
        navLink: '/createSubUser',
        action: 'allproduct',
        resource: 'VENDOR'
      },
      {
        id: 'usermanage2',
        title: 'My User List',
        icon: <Users size={12} className="ml-2" />,
        navLink: '/SubUserList',
        action: 'allproduct',
        resource: 'VENDOR'
      }
    ]
  },
  {
    id: 'Voucher',
    title: 'Voucher Management',
    icon: <Gift size={20} />,
    children: [
      {
        id: 'Voucher1',
        title: 'Create Voucher',
        icon: <Gift size={12} className="ml-2" />,
        navLink: '/CreateVoucher',
        action: 'allproduct',
        resource: 'VENDOR'
      },
      {
        id: 'Voucher2',
        title: 'All Vouchers',
        icon: <Gift size={12} className="ml-2" />,
        navLink: '/AllVouchers',
        action: 'allproduct',
        resource: 'VENDOR'
      },
      {
        id: 'Voucher3',
        title: 'Bulk Purchase',
        icon: <List size={12} className="ml-2" />,
        navLink: '/bulkPurchaseVoucher',
        action: 'allproduct',
        resource: 'VENDOR'
      }
    ]
  },
  {
    id: 'Point Rule',
    title: 'Loyalty Management',
    icon: <Award size={20} />,
    children: [
      {
        id: 'Point Rule1',
        title: 'SKU Rules',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/PointRuleList',
        action: '',
        resource: 'VENDOR'
      },
      {
        id: 'Point Rule2',
        title: 'Global Rule',
        icon: <Award size={12} className="ml-2" />,
        navLink: '/overallPointRuleList',
        action: '',
        resource: 'VENDOR'
      }
    ]
  },
  {
    id: 'admgt',
    title: 'Ad management',
    icon: <Volume1 size={20} />,
    accessible: menuIDs.includes(6),
    children: [
      {
        id: 66,
        accessible: subMenuIDs.includes(66),
        title: 'Ad Campaign management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/adCampaignlistVendor',
        action: 'manage',
        resource: 'VENDOR'
      },
      {
        id: 49,
        accessible: subMenuIDs.includes(49),
        title: 'Ad rule management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/adRuleListVendor',
        action: 'manage',
        resource: 'VENDOR'
      },
      {
        id: 50,
        accessible: subMenuIDs.includes(50),
        title: 'Ad content management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/adlistVendor',
        action: 'manage',
        resource: 'VENDOR'
      },
      {
        id: 64,
        accessible: subMenuIDs.includes(64),
        title: 'Promotion management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/promolistVendor',
        action: 'manage',
        resource: 'VENDOR'
      }
    ]
  },
  {
    id: 'notification',
    title: 'Notification',
    icon: <Bell size={20} />,
    children: [
      {
        id: 'notification2',
        title: 'Bulk Notification',
        icon: <List size={12} className="ml-2" />,
        navLink: '/allBulkNotificationsVendor',
        action: 'manage',
        resource: 'VENDOR'
      }
    ]
  },
  {
    id: 'complain',
    title: 'Complain Management',
    icon: <Box size={20} />,
    navLink: '/complainList',
    action: 'manage',
    resource: 'VENDOR'
  },
  {
    id: 'settings',
    accessible: menuIDs.includes(8),
    title: 'Settings',
    icon: <Settings size={20} />,
    children: [
      {
        id: 'settings1',
        accessible: subMenuIDs.includes(46),
        title: 'Credential Settings',
        icon: <List size={12} className="ml-2" />,
        navLink: '/settingsVendor',
        action: 'manage',
        resource: 'VENDOR'
      },
      {
        id: 'settings2',
        accessible: subMenuIDs.includes(34),
        title: 'Quota Management',
        icon: <List size={12} className="ml-2" />,
        navLink: '/quotas',
        action: 'manage',
        resource: 'VENDOR'
      },
      {
        id: 'settings3',
        accessible: subMenuIDs.includes(33),
        title: 'Budget Management',
        icon: <Volume1 size={12} className="ml-2" />,
        navLink: '/allQuotaVendor',
        action: 'manage',
        resource: 'VENDOR'
      }
    ]
  }
  // {
  //   id: 'notification',
  //   title: 'Notification',
  //   icon: <Bell size={20} />,
  //   children: [
  //     {
  //       id: 'notification2',
  //       title: 'Create Notification',
  //       icon: <Bell size={12} className="ml-2" />,
  //       navLink: '/createNotification',
  //       action: '',
  //       resource: 'VENDOR'
  //     },
  //     {
  //       id: 'notification1',
  //       title: 'All Notifications',
  //       icon: <Bell size={12} className="ml-2" />,
  //       navLink: '/notificationList',
  //       action: '',
  //       resource: 'VENDOR'
  //     }
  //   ]
  // }
  // {
  //   id: 'Vendor Dashboard',
  //   title: 'Product Reviews',
  //   icon: <Layers size={20} />,
  //   navLink: '/productreview',
  //   action: 'manage',
  //   resource: 'VENDOR'
  // }
  // {
  //   id: 'MyBankInfo',
  //   title: 'My Bank Info',
  //   icon: <Layers size={20} />,
  //   navLink: '/mybankinfo',
  //   action: 'manage',
  //   resource: 'VENDOR'
  // },
  // {
  //   id: 'MyShop',
  //   title: 'My Shop',
  //   icon: <Layers size={20} />,
  //   navLink: '/myshop',
  //   action: 'manage',
  //   resource: 'VENDOR'
  // }
  /*
  {
    id: 'CashDeposit',
    title: 'Cash Deposit',
    icon: <Layers size={20} />,
    navLink: '/CashDeposit',
    action: 'manage',
    resource: 'CASHIER'
  },
  {
    id: 'SafeDeposit',
    title: 'Deposit to Safe',
    icon: <Shield size={20} />,
    navLink: '/SafeDeposit',
    action: 'manage',
    resource: 'CASHIER'
  },
  {
    id: 'SafeDepoToBank',
    title: 'Safe To Bank',
    icon: <Home size={20} />,
    navLink: '/SafeDepositToBank',
    action: 'manage',
    resource: 'CASHIER'
  }*/


]
