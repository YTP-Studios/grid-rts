import * as React from 'react';
import {
  Collapse,
  Navbar as ReactStrapNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component {
  state: {
    isOpen;
  }
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    }
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    return (<ReactStrapNavbar color="dark" dark expand="md" sticky="top">
      <NavbarBrand tag={Link} to="/">GRID-RTS</NavbarBrand>
      <NavbarToggler onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink disabled>Matchmaking</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/lobbies">Lobbies</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled>Editor</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar color="dark">
            <DropdownToggle nav caret>
              Welcome, Player
              </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem disabled>
                Settings
                </DropdownItem>
              <DropdownItem disabled>
                Profile
                </DropdownItem>
              <DropdownItem divider />
              <DropdownItem disabled>
                Log Out
                </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </ReactStrapNavbar>)
  }
}
