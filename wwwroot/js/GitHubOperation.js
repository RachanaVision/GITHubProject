function getAllRepository(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/Home/GetAllRepository', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var repolist = JSON.parse(xhr.responseText);
                var setdata = document.getElementById('setrepo');
               
                for (var i = 0; i < repolist.length; i++) {
                    var deleteButton = "<input type='button' value='Delete' class='btn btn-default btn-danger' onclick='DeleteRepo(\"" + escape(repolist[i].name) + "\")'>";
                    var getUserButton = "<input type='button' value='GetUsers' class='btn btn-default btn-primary' onclick='GetUsers(\"" + escape(repolist[i].name) + "\")'>";
                    var editButton = "<input type='button' value='Edit' class='btn btn-default btn-info' onclick='GetRepoByName(\"" + escape(repolist[i].name) + "\")'>";
                                     
                        var data = "<tr>" +
                        "<td>" + repolist[i].name + "</td>" +
                        "<td>" + repolist[i].description + "</td>" +
                        "<td>" + repolist[i].htmlUrl + "</td>" +
                        "<td>" + getUserButton + "</td>" +
                        "<td>" + editButton + "</td>" +
                        "<td>" + deleteButton + "</td>"
                        "</tr>";

                    setdata.insertAdjacentHTML('beforeend', data);
                }
            }
        }
    }
    xhr.send();
}

function CreateRepository() {
    window.location.href = "Repository";
}

function CancelClick() {
    window.location.href = "Index";
}

function AddRepository() {

    var requestData = {
        RepoName: document.getElementById('reponame').value,
        Description: document.getElementById('description').value
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/Home/CreateRepository', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
   
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                alert("Repository Added Successfully..!!")
                window.location.href = "Index";
            }
        }
    }
    xhr.send(JSON.stringify(requestData));
}

function GetRepoByName(name) {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/Home/GetRepositoryByName?name=' + name, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var repo = JSON.parse(xhr.responseText);
                sessionStorage.setItem('RepoInformation', JSON.stringify(repo));
                console.log(repo);
                
                window.location.href = "/Home/Edit"
            }
        }
    }
    xhr.send();
}

function GetRepoDetails() {
    var repoInformation = sessionStorage.getItem('RepoInformation');   
    var repoInformations = JSON.parse(repoInformation);
    var description = repoInformations.description;

    document.getElementById('description').value = description;
}

function EditRepositoryDescription() {
    var repoInfo = sessionStorage.getItem('RepoInformation');
    var repoInformations = JSON.parse(repoInfo);
    var description = document.getElementById('description').value;
    var name = repoInformations.name;

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', '/Home/EditRepository?name=' + name + '&description=' + description, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                alert("Description updated Successfully..!!");
                window.location.href = "Index";
            }
        }
    }
    xhr.send();
}

function DeleteRepo(name) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/Home/DeleteRepository?name=' + name, true);
   
    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                alert("Repository Deleted Successfully..!!");
                document.getElementById('setrepo').innerHTML = '';
                getAllRepository();
            }
        }
    }
    xhr.send();
}

function GetUsers(name) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/Home/GetAllUsersInRepository?name=' + name, true);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var userlist = JSON.parse(xhr.responseText);
               
                sessionStorage.setItem('UserList', JSON.stringify(userlist));               
                window.location.href = "User";               
            }
        }
    }
    xhr.send();
}


function GetallUsers() {
    var userslist = sessionStorage.getItem('UserList');
    var userlist = JSON.parse(userslist);   
    var setdata = document.getElementById('setuser');  

    for (var i = 0; i < userlist.length; i++) {
        var removeButton = "<input type='button' value='Remove' class='btn btn-default btn-danger' onclick='RemoveUser(\"" + escape(userlist[i].userName) + "\")'>";

        var data = "<tr>" +
            "<td>" + userlist[i].id + "</td>" +
            "<td>" + userlist[i].userName + "</td>" +
            "<td>" + removeButton + "</td>"
        "</tr>";

        setdata.insertAdjacentHTML('beforeend', data);
    }
}

function AddUserButtonClick() {
    window.location.href = "AddUser";
}

function Cancel() {
    window.location.href = "User";
}

function AddUser() {
    var userslist = sessionStorage.getItem('UserList');    
    var userlist = JSON.parse(userslist);
    var repoName = userlist[0].repoName;
  
    var requestData = {
        RepoName: repoName,
        Username: document.getElementById('username').value
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/Home/AddUserInRepository', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                alert("User Added Successfully & Pending for Accept Invitation..!!");
                window.location.href = "User";
            }
        }
    }
    xhr.send(JSON.stringify(requestData));
}

function RemoveUser(userName) {
    var userslist = sessionStorage.getItem('UserList');
    var userlist = JSON.parse(userslist);
    var repoName = userlist[0].repoName;

    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/Home/DeleteUserFromRepository?userName=' + userName + '&repoName=' + repoName, true);

    xhr.onload = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                alert("User Removed Successfully..!!");
                // Call GetallUsers only after successful deletion
                xhrGetUsers.onload = function () {
                    if (xhrGetUsers.readyState == XMLHttpRequest.DONE && xhrGetUsers.status == 200) {
                        document.getElementById('setuser').innerHTML = '';
                        GetallUsers();
                    }
                };
                xhrGetUsers.send();
            }
        }
    }
    xhr.send();
}


