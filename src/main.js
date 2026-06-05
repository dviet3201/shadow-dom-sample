import "./styles/tokens.css";
import "./styles/osui.css";

// runtime
import "./runtime/store.js";
import { syncRouteFromHash } from "./runtime/navigation.js";

// base
import "./components/base/ShadowUtils.js";
import "./components/base/OsuiWrapper.js";
import "./components/base/OsBlock.js";
import "./components/base/OsSection.js";
import "./components/base/OsCard.js";
import "./components/base/OsFeedback.js";
import "./components/base/OsSkeleton.js";
import "./components/base/OsTabs.js";
import "./components/base/OsModalHost.js";
import "./components/base/OsModal.js";

// widgets
import "./components/widgets/OsTableRecords.js";
import "./components/widgets/OsPagination.js";
import "./components/widgets/CustomerForm.js";
import "./components/widgets/OrdersTable.js";
import "./components/widgets/OrderForm.js";
import "./components/widgets/UserForm.js";
import "./components/widgets/KPI.js";

// screens
import "./screens/CustomersScreen.js";
import "./screens/CustomerDetailsScreen.js";
import "./screens/OrdersScreen.js";
import "./screens/SettingsScreen.js";

// app
import "./app/Router.js";
import "./app/Layout.js";
import "./app/AppShell.js";

// init routing
syncRouteFromHash();
window.addEventListener("hashchange", syncRouteFromHash);
