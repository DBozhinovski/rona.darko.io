import React from "react"
import styled from "styled-components"
import tw from "tailwind.macro"
import { Link } from "gatsby"

const NavContainer = styled.ul`
  ${tw`flex items-center justify-center`};
`

const NavItem = styled.li`
  ${tw`flex p-2`};
`

const NavLink = styled(Link)`
`

const Navigation: React.FunctionComponent = () => {
  return (
    <NavContainer>
      <NavItem>
        <NavLink to="/">[home]</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/manual-search">[search]</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/about">[about]</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/datasets">[datasets]</NavLink>
      </NavItem>
    </NavContainer>
  );
};

export default Navigation;
