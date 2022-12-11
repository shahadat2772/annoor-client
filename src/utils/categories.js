import EggOutlinedIcon from "@mui/icons-material/EggOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";

export const categories = [
  {
    icon: <EggOutlinedIcon />,
    title: "Food",
    to: "/food",
  },
  {
    icon: <LocalGroceryStoreOutlinedIcon />,
    title: "Grocery",
    to: "/grocery",
  },
  {
    icon: <BathtubOutlinedIcon />,
    title: "Personal Care",
    to: "/personal care",
  },
  {
    icon: <ChildCareOutlinedIcon />,
    title: "Baby care",
    to: "/baby care",
  },
  {
    icon: <KitchenOutlinedIcon />,
    title: "Ice & frozen",
    to: "/ice and frozen",
  },
  {
    icon: <TakeoutDiningOutlinedIcon />,
    title: "Candy",
    to: "/candy",
  },
];
