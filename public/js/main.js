const socket = io();
const chat = document.getElementById('chat-form');
const cahtmessages = document.querySelector('.chat-messages');
const roomname = document.getElementById("room-name");
const roomusers = document.getElementById("users");


//bring from query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room)

socket.on('message', message => {
    console.log(message.txt);
    showMsg(message);

    ///scroll down
    cahtmessages.scrollTop = cahtmessages.scrollHeight;
    //clear input
})

socket.emit('joinroom', { username, room })

chat.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    //console.log(msg)
    socket.emit('chatmsg', msg);
})

//changing users of the room list
socket.on('roomInfo', ({ room, users }) => {
    //roomname.innerText = room;
    showusers(users);
})
roomname.innerText = room;

function showusers(users) {
    roomusers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join()}`;
}

function showMsg(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
<p class="meta">${message.username} <span>${message.date}</span></p>
        <p class="text">
            ${message.txt}
        </p >`;
    document.querySelector('.chat-messages').appendChild(div);
}