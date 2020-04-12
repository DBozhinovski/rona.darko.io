import PropTypes from "prop-types";
import React from "react";
import Logo from "./logo";
import Navigation from './navigation';

const Header: React.FunctionComponent = () => (
  <header>
    <Navigation />
    <Logo />
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
