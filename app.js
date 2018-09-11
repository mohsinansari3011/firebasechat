

   var config = {
    apiKey: "AIzaSyBHqGLvtjhzMmnVOMid1NvrcthkY54TkuM",
    authDomain: "pushnotify-f265d.firebaseapp.com",
    databaseURL: "https://pushnotify-f265d.firebaseio.com",
    projectId: "pushnotify-f265d",
    storageBucket: "", //pushnotify-f265d.appspot.com
    messagingSenderId: "157796024602"
  };
  firebase.initializeApp(config);
  

var db = firebase.firestore();
var auth = firebase.auth();


  const messaging = firebase.messaging();
  //messaging.usePublicVapidKey("BKagOny0KF_2pCJQ3m....moL0ewzQ8rZu");
  messaging.requestPermission().then(function() {
     //getToken(messaging);
     return messaging.getToken();
  }).then(function(currentToken){
  console.log(currentToken,"token");
  //displayNotification();
  //localStorageService.set('fcmtoken',currentToken);
  
  

  })
.catch(function(err) {
  console.log('Permission denied', err);
});


function signUp() {
    var name = document.getElementById('txtusername').value;
    var email = document.getElementById('txtemail').value;
    var pwd = document.getElementById('txtpassword').value;

    var status = "free";
    var time = Date.now();

    console.log(email, pwd);

auth.createUserWithEmailAndPassword(email, pwd)
    .then(function (res) {
                alert('Registered Successfully!');
                console.log('res =>', res.user.uid);

                db.collection('tblusers').doc(res.user.uid).set({name, email,pwd,status,time})
                .then(() => {
                    console.log('Added in db');
                    getUsers();
                })
                .catch((e) => {
                    console.log('error Adding in db');
                })
    })
    .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                // ...
    });
}



function getUsers()
{

var table = document.getElementById('usersdata');
table.innerHTML = '';
db.collection('tblusers')
    .onSnapshot((docs) => {
        docs.forEach((doc) => {
            console.log('Users collection', doc.data());
           
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            //var td6 = document.createElement('input');
            var td5 = document.createElement('button');
            
            td1.innerHTML = doc.data().name;
            td2.innerHTML = doc.data().email;
            td3.innerHTML = doc.data().status;
            //td6.type = 'text';
            //td6.placeholder = 'text';
            //td6.id = 'txtadminid'+`${doc.id}`;
            td5.setAttribute('onclick', `initChaat('${doc.id}')`)
            td5.innerHTML = 'Start Chat'


            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            //tr.appendChild(td6);
            tr.appendChild(td5);

            table.appendChild(tr);

        })
    })


}

getUsers();






var currentRoomId = '';
function initChaat(adUserId) {
    //Creating room info

    //var adAdminId =  document.getElementById('Admin-'+adUserId).value;
var adAdminId = 'Admin-'+adUserId;
   var hiduser = document.getElementById('hiduser');
   var hidadmin =  document.getElementById('hidadmin');

   hiduser.value = adUserId;
   hidadmin.value = 'Admin-'+adUserId;

    db.collection('tblrooms').add({
        
        adAdminId: adAdminId,
        adUserId: adUserId,
        status: 'busy',
        createdAt: Date.now()
    }).then(res => {
        console.log('res id***', res.id);
        currentRoomId = res.id;

        var hidroom =  document.getElementById('hidroom');
        hidroom.value = currentRoomId;
        //Sending message!
        // db.collection('rooms').doc(currentRoomId).collection('messages').add({message: 'hello world', sender: '8pGa0Yl4ThP2qGbJU2j2jYWdiOt1', receiver: adUserId})    })
    })
}




function ChatAdmin(){

  var message = document.getElementById('txtmessageadmin').value;
  var senderid = document.getElementById('hidadmin').value;
   var currentRoom = document.getElementById('hidroom').value;
  var sender = 'Admin';
var time = Date.now();
  db.collection('tblmessages').add({currentRoom,message, senderid,sender,time})
                .then(() => {
                    console.log('Admin Message sent ');
                })
                .catch((e) => {
                    console.log('error Adding in db');
                })

getMessages(senderid);

}

function ChatUser(){

  var message = document.getElementById('txtmessageuser').value;
  var senderid = document.getElementById('hiduser').value;
  var currentRoom = document.getElementById('hidroom').value;

  var sender = 'User';
var time = Date.now();
  db.collection('tblmessages').add({currentRoom,message, senderid,sender,time})
                .then(() => {
                    console.log('User Message sent ');
                })
                .catch((e) => {
                    console.log('error Adding in db');
                })


getMessages(senderid);

}



function getMessages(o_senderid){

alert('1');
var table = document.getElementById('messages');
table.innerHTML = '';
  db.collection('tblmessages')
    .onSnapshot((docs) => {
        docs.forEach((doc) => {

          var aDsender = o_senderid.replace("Admin-", "");
          if (doc.data().senderid == aDsender || doc.data().senderid == o_senderid) 
          {
              console.log('message collection', doc.data());
             
              var tr = document.createElement('tr');
              var td1 = document.createElement('td');
              var td2 = document.createElement('td');
              var td3 = document.createElement('td');
             
              
              td1.innerHTML = doc.data().sender;
              td2.innerHTML = doc.data().message;
              td3.innerHTML = doc.data().time;


              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(td3);

              table.appendChild(tr);
          }
            

        })
    })

}



const functions = require('firebase-functions');


exports.makeUppercase = functions.firestore
//messages/{messageId}
.document('users/{userId}').onWrite((change, context) => {
  console.log('change***', change.after.data());
  // Then return a promise of a set operation to update the count
  return change.after.ref.set({
    name: change.after.data().name.toUpperCase()
  }, {merge: true});
  //opponent userId notification push
});





//getServices();


// function getServices() {
//     var table = document.getElementById('services');

//     db.collection('services')
//     .onSnapshot((docs) => {
//         docs.forEach((doc) => {
//             console.log('services collection', doc.data());
//             var tr = document.createElement('tr');
//             var td1 = document.createElement('td');
//             var td2 = document.createElement('td');
//             var td3 = document.createElement('td');
//             var td4 = document.createElement('td');
            
//             var td5 = document.createElement('button');

//             td1.innerHTML = doc.data().name;
//             td2.innerHTML = doc.data().country;
//             td3.innerHTML = doc.data().uid;
//             td5.setAttribute('onclick', `initChat('${doc.data().uid}', '${doc.id}')`)
//             td5.innerHTML = 'Send Message'

//             tr.appendChild(td1);
//             tr.appendChild(td2);
//             tr.appendChild(td3);


//             db.collection('users').doc(doc.data().uid).get()
//             .then((res) => {
//                 console.log('users collection ***',res.data());
//                 td4.innerHTML = res.data().name;
//                 tr.appendChild(td4);
                
//                 tr.appendChild(td5);
//             })

//             table.appendChild(tr);
//         })
//     })
// }



// var currentRoomId = '';
// function initChat(adUserId, adId) {
//     //Creating room info
//     db.collection('rooms').add({
//         createdAt: Date.now(),
//         users: ['8pGa0Yl4ThP2qGbJU2j2jYWdiOt1', adUserId],
//         ad_id: adId
//     }).then(res => {
//         console.log('res id***', res.id);
//         currentRoomId = res.id;

//         //Sending message!
//         // db.collection('rooms').doc(currentRoomId).collection('messages').add({message: 'hello world', sender: '8pGa0Yl4ThP2qGbJU2j2jYWdiOt1', receiver: adUserId})    })
//     })
// }



function displayNotification1() {

  
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      reg.showNotification(dmessage);
    });
  }
}

function displayNotification() {

  var dmessage = document.getElementById("message").value;

  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
        body: dmessage,
        icon: 'logo.jpg',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      reg.showNotification("Olx Notification", options);
    });
  }
}
