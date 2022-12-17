import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./components/Authentication/SignIn/SignIn";
import Cart from "./components/Cart/Cart";
import Products from "./components/Products/Products";
import PublicLayout from "./components/PublicLayout/PublicLayout";
import { Toaster } from "react-hot-toast";
import Profile from "./components/Profile/Profile";
import RequireAuth from "./components/Authentication/SignIn/RequireAuth";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import RequireAdmin from "./components/Authentication/RequireAdmin";
import AddProduct from "./components/AddProduct/AddProduct";
import ManageProduct from "./components/ManageProduct/ManageProduct";
import EditProduct from "./components/EditProduct/EditProduct";
import MyOrders from "./components/MyOrders/MyOrders";
import AllOrders from "./components/AllOrders/AllOrders";
import AllUsers from "./components/AllUsers/AllUsers";
import Search from "./components/Search/Search";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* -----------PUBLIC ROUTE----------- */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Products />} />
          <Route path="/:category" element={<Products />} />
          <Route path="/search/:searchQuery" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signIn" element={<SignIn />} />

          {/* ---------AUTHORIZED ROUTES--------- */}
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<MyOrders />} />
          </Route>
        </Route>

        {/* --------------ADMIN ROUTES---------------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route element={<RequireAdmin />}>
            <Route index element={<ManageProduct />} />
            <Route path="/admin/manage-product" element={<ManageProduct />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/:_id" element={<EditProduct />} />
            <Route path="/admin/orders" element={<AllOrders />} />
            <Route path="/admin/users" element={<AllUsers />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
