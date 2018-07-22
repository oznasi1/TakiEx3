



function fetchAllUser(){
    fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
    .then(response => {
        if (!response.ok) {
            console.log(`failed to fetch all users `, response);                
        }
    })
}
