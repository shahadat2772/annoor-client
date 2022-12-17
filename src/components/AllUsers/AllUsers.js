import {
  Box,
  Button,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../Loading/Loading";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Swal from "sweetalert2";

const AllUsers = () => {
  const { userInfo } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const pageCount = Math.ceil(userCount / 15);
  const navigate = useNavigate();
  const fetchAllUsers = () => {
    if (userInfo) {
      setUsersLoading(true);
      fetch(
        `https://annoor-server-production-af32.up.railway.app/all-users?page=${pageNumber}&search=${searchQuery}&filter=${filterBy}`,
        {
          headers: {
            uid: userInfo.uid,
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            setUsers(result.data);
            setUsersLoading(false);
            setUserCount(result.userCount);
          } else {
            toast.error(result.message);
            setUsersLoading(false);
          }
        });
    }
  };

  const makeAdmin = (uid) => {
    Swal.fire({
      icon: "warning",
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Yes",
      html: "<div><p>Are you sure you wanna <br/> make this user admin?</p></div>",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          "https://annoor-server-production-af32.up.railway.app/make-admin",
          {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              uid: userInfo.uid,
              id: uid,
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              toast.success(result.message);
              fetchAllUsers();
            } else {
              toast.error(result.message);
            }
          });
      }
    });
  };

  const removeAdmin = (uid) => {
    Swal.fire({
      icon: "warning",
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Yes",
      html: "<div><p>Are you sure you wanna <br/> remove this admin?</p></div>",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          "https://annoor-server-production-af32.up.railway.app/remove-admin",
          {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              uid: userInfo.uid,
              id: uid,
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              toast.success(result.message);
              fetchAllUsers();
            } else {
              toast.error(result.message);
            }
          });
      }
    });
  };

  useEffect(() => {
    fetchAllUsers();
  }, [userInfo, pageNumber, filterBy]);

  const handleSearch = (e) => {
    fetchAllUsers();
  };

  return (
    <div>
      <div>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            paddingInline: "5px",
          }}
        >
          <div style={{ paddingBottom: "10px" }} className="cart-header">
            <span>Users</span>
          </div>
          <select
            style={{ marginBottom: "7px" }}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="">Filter</option>
            <option value="Admin">Admins</option>
          </select>
        </Box>
        <div className="product-manage-search-bar-container">
          <form className="search-bar-container">
            <input
              placeholder="Search by email or phone"
              type="text"
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-button-container">
              <Button
                onClick={() => handleSearch()}
                size="small"
                sx={{
                  minWidth: 0,
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  height: "100%",
                }}
              >
                <SearchIcon />
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="manage-users-container">
        {usersLoading && <Loading />}
        {usersLoading === false && users?.length > 0 && (
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Sl.</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((eachUser, index) => (
                <TableRow key={eachUser?._id}>
                  <TableCell align="left" component="th" scope="row">
                    {(pageNumber - 1) * 15 + index + 1}
                  </TableCell>
                  <TableCell align="left">{eachUser?.name}</TableCell>
                  <TableCell align="left">
                    {eachUser?.email ? eachUser?.email : "--"}
                  </TableCell>
                  <TableCell align="center">
                    {eachUser?.phoneNumber ? eachUser?.phoneNumber : "--"}
                  </TableCell>
                  <TableCell align="center">
                    {eachUser.role !== "admin" && (
                      <Button
                        onClick={() => makeAdmin(eachUser.uid)}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      >
                        Make Admin
                      </Button>
                    )}
                    {eachUser.role === "admin" && (
                      <Button
                        onClick={() => removeAdmin(eachUser.uid)}
                        disableElevation
                        color="error"
                        size="small"
                        variant="contained"
                      >
                        Remove Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!usersLoading && !users.length > 0 && (
          <div>
            <Typography textAlign={"center"} marginTop="152px" variant="h5">
              No items found :(
            </Typography>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Pagination
            color="primary"
            onChange={(e, value) => setPageNumber(value)}
            page={pageNumber}
            count={pageCount}
            shape="rounded"
          />
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
