
import React from "react";
import ReactDOM from "react-dom";

import { Button, Card, Row, Col, Chip, Tag, Icon, Collection, CollectionItem, NavItem, Navbar } from 'react-materialize';

class ActiveUsers extends React.Component {
  constructor(args) {
    super(...args);
    this.fetchAllUsers = this.fetchAllUsers.bind(this);
  }
  //   <div>
  //   <legend>online users</legend>
  //   <ul>
  //     {this.fetchAllUsers(this.props.usersList).map(user => (
  //       <li key={user}>{user}</li>
  //     ))}{' '}
  //   </ul>
  // </div>

  render() {
    return (
      <Row>
        <Col s={10}>
        <Chip key='onlineUeses'>Online Users: </Chip>

          {this.fetchAllUsers(this.props.usersList).map(user => (
                  <Chip key={user}>{user}</Chip>
                ))}{' '}
        
          </Col>
        </Row>
        );
      }

      fetchAllUsers(users) {
          let res = [];
        for (let user in users) {
          res.push(users[user]);
        }
        return res;
      }
}

export{ActiveUsers};
