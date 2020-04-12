import React from "react"
import styled from "styled-components"
import tw from "tailwind.macro"

const NavContainer = styled.ul`
  ${tw`flex items-center justify-center`};
`

const NavItem = styled.li`
  ${tw`flex p-3`};
`

const NavLink = styled.a`
`

const Navigation: React.FunctionComponent = () => {
  return (
    <NavContainer>
      <NavItem>
        <NavLink href="/">home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/about">about</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/datasets">datasets</NavLink>
      </NavItem>
    </NavContainer>
  );
};

export default Navigation;
