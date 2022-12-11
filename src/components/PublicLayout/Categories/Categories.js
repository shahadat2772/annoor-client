import { Collapse, Icon, List } from "@mui/material";
import React, { useState } from "react";
import { categories } from "../../../utils/categories";
import "./Categories.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link, NavLink } from "react-router-dom";

const Categories = ({ handleMobileDrawerToggle }) => {
  return (
    <ul className="categories-container">
      {categories.map((category, key) => (
        <EachCategory
          handleMobileDrawerToggle={handleMobileDrawerToggle}
          key={key}
          category={category}
        />
      ))}
    </ul>
  );
};
export default Categories;

const EachCategory = ({ category, handleMobileDrawerToggle }) => {
  const Component = category.items ? MultiLevelCategory : SingleLevelCategory;
  return (
    <Component
      handleMobileDrawerToggle={handleMobileDrawerToggle}
      category={category}
    />
  );
};

const SingleLevelCategory = ({ category, handleMobileDrawerToggle }) => {
  return (
    <li
      onClick={() =>
        handleMobileDrawerToggle ? handleMobileDrawerToggle() : ""
      }
      className="each-single-level-category"
    >
      <NavLink
        className={({ isActive }) => (isActive ? "active-category" : "")}
        to={category?.to}
      >
        {category.icon && (
          <Icon color="primary" size="small">
            {category.icon}
          </Icon>
        )}
        <span className="category-title">{category.title}</span>
      </NavLink>
    </li>
  );
};

const MultiLevelCategory = ({ category, handleMobileDrawerToggle }) => {
  const { items: subCategories } = category;

  const [categoryOpen, setCategoryOpen] = useState(false);
  const handleCategoryToggle = () => {
    setCategoryOpen(!categoryOpen);
  };
  return (
    <>
      <li onClick={handleCategoryToggle} className="each-single-level-category">
        <NavLink to={category?.to}>
          {category.icon && (
            <Icon color="primary" size="small">
              {category.icon}
            </Icon>
          )}
          <span className="category-title">{category.title}</span>
          {categoryOpen ? (
            <KeyboardArrowDownIcon htmlColor="grey" fontSize="small" />
          ) : (
            <KeyboardArrowRightIcon htmlColor="grey" fontSize="small" />
          )}
        </NavLink>
      </li>
      <Collapse
        sx={{ marginLeft: "20px", borderLeft: "1px solid #80808047" }}
        in={categoryOpen}
      >
        <List disablePadding component="ul">
          {subCategories.map((eachSubCategory) => (
            <EachCategory category={eachSubCategory} />
          ))}
        </List>
      </Collapse>
    </>
  );
};
