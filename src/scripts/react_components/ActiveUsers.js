
import React from "react";
import ReactDOM from "react-dom";


 class ActiveUsers extends React.Component {
    constructor(args) {
        super(...args);
        this.fetchAllUsers= this.fetchAllUsers.bind(this);
    }


    render() {
        return (
          <fieldset>
            <legend>online users</legend>
            <ul>
              {this.fetchAllUsers(this.props.usersList).map(user => (
                <li key={user}>{user}</li>
              ))}{' '}
            </ul>
          </fieldset>
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
