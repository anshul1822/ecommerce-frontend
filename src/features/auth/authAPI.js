export function createUser(userData) {
  return new Promise(async (resolve) => {
    console.log(userData);
    const response = await fetch(' http://localhost:8080/users', {
      method : 'POST',
      body : JSON.stringify(userData),
      headers : {'content-type' : 'application/json'}
    })  

    const data = await response.json();
    // TODO : on server it will only retrun some info of user (not password)
    resolve({data});
});
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    console.log(update);
    const response = await fetch(' http://localhost:8080/users/' + update.id, {
      method : 'PUT',
      body : JSON.stringify(update),
      headers : {'content-type' : 'application/json'}
    })  

    const data = await response.json();
    // TODO : on server it will only retrun some info of user (not password)
    resolve({data});
});
}

export function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    // console.log(loginInfo);
    const email = loginInfo.email;
    const password = loginInfo.password;

    const response = await fetch(`http://localhost:8080/users?email=${email}`);
    const data = await response.json();

    console.log("data", data);

    if(data.length){
      if(password === data[0].password){
        resolve({data : data[0]});
      }else{
        reject({message : 'User not found'});
      }
      
    }else{
      reject({message : 'User not found'});
    }
    
    // TODO : on server it will only retrun some info of user (not password)  
});
}
