
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
/*
class ActiveUsers extends React.Component {
    constructor(args) {
        super(args);
        //this.fetchAllUsers= this.fetchAllUsers.bind(this);
    }

    // fetchAllUsers(){
    //     fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
    //     .then(response => {
    //         if (!response.ok) {
    //             throw response;              
    //         }
    //         return response.json();
    //     })
    // }

render(){
    // let response =fetchAllUsers(); 
     let nameList=[]; 
    // for (let i = 0; i < response.length; i++) {
    //     alert(response[i]);
    //     alert(response[i].name);
    //     nameList.push(<div>{response[i].name}</div>);
    // }
    return (
        <div id="activeUsers">
            amit 
        </div>
        
         )
    }
}

        
    
 
*/

// export {ActiveUsers};
/*
userElems=[];
for (let i = 0; i < this.props.usersList.length; i++) {
    userElems.push(<div>{this.props.usersList[i]}</div>)
}*/