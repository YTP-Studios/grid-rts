import * as React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText
} from 'reactstrap';

export default class HomeScreen extends React.Component {
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
    return (
      <div>
        <Navbar color="dark" dark expand="md" sticky="top">
          <NavbarBrand href="/">GRID-RTS</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="#">Matchmaking</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar>
              <NavItem>
                <NavLink href="#">Custom</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar>
              <NavItem>
                <NavLink href="#">Editor</NavLink>
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
        </Navbar>
        <div className="container pt-3">
          <h1 className="display-4">Home</h1>
          <div className="row">
            <div className="col-8">
              <h2>News</h2>
              <Card className="my-2">
                <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Placeholder&w=320&h=100" alt="Play now" />
                <CardBody>
                  <CardTitle>Play Now</CardTitle>
                  <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. </CardText>
                  <Button className="pull-right">Play</Button>
                </CardBody>
              </Card>
              <Card className="my-2">
                <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Placeholder&w=320&h=100" alt="Play now" />
                <CardBody>
                  <CardTitle>News Item</CardTitle>
                  <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. </CardText>
                  <Button className="pull-right">Learn More</Button>
                </CardBody>
              </Card>
            </div>
            <div className="col-4">
              <h2>
                &nbsp;
              </h2>
              <Card className="my-2">
                <CardBody>
                  <CardTitle>Info</CardTitle>
                  <CardText>
                    0 Online Users <br />
                    0 Active Games <br />
                    Ping: <span className="text-success">0ms</span>
                  </CardText>
                </CardBody>
              </Card>
              <Button size="lg" block>Shortcut</Button>
              <Button size="lg" block>Shortcut</Button>
              <Button size="lg" block>Shortcut</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
