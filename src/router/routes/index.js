// ** Routes Imports
import nav from '../../navigation/vertical/customise'
import AppRoutes from './Apps'
import ChartMapsRoutes from './ChartsMaps'
import CustomiseRoutes from './Customise'
import DashboardRoutes from './Dashboards'
import ExtensionsRoutes from './Extensions'
import FormRoutes from './Forms'
import PageLayoutsRoutes from './PageLayouts'
import PagesRoutes from './Pages'
import TablesRoutes from './Tables'
import UiElementRoutes from './UiElements'


// ** Document title
const TemplateTitle = 'RILAC'
const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
// ** Default Route
//const DefaultRoute = '/dashboard/ecommerce'
const DefaultRoute = nav.find(an => an.id === AssignedMenus[0]?.id)?.navLink ? nav.find(an => an.id === AssignedMenus[0]?.id)?.navLink : nav.find(an => an.id === AssignedMenus[0]?.id)?.children[0]?.navLink || '/home'
const CashierDefaultRoute = '/payment'
const VendorDefaultRoute = '/vendordashboard'

// ** Merge Routes
const Routes = [
  ...CustomiseRoutes,
  ...DashboardRoutes,
  ...AppRoutes,
  ...PagesRoutes,
  ...UiElementRoutes,
  ...ExtensionsRoutes,
  ...PageLayoutsRoutes,
  ...FormRoutes,
  ...TablesRoutes,
  ...ChartMapsRoutes
]

export { DefaultRoute, CashierDefaultRoute, TemplateTitle, Routes, VendorDefaultRoute }

