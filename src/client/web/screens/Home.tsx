import * as React from 'react';
import {
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText
} from 'reactstrap';
import Navbar from '../components/Navbar';
export default class HomeScreen extends React.Component {
  render() {
    return (
      <div>
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
                  <Button className="float-right">Play</Button>
                </CardBody>
              </Card>
              <Card className="my-2">
                <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Placeholder&w=320&h=100" alt="Play now" />
                <CardBody>
                  <CardTitle>News Item</CardTitle>
                  <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. </CardText>
                  <Button className="float-right">Learn More</Button>
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
