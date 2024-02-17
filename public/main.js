const socket = io();
let username = '';
let userList = [];

const loginPage = document.querySelector('#loginPage');
const chatPage = document.querySelector('#chatPage');

const loginInput = document.querySelector('#loginNameInput');
const textInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList() {
  const ul = document.querySelector('.userList');
  ul.innerHTML = '';
  userList.forEach((user) => {
    ul.innerHTML += '<li>' + user + '</li>';
  });
}

function addMessage(type, user, msg) {
  const ul = document.querySelector('.chatList');

  switch (type) {
    case 'status':
      ul.innerHTML += '<li class="m-status">' + msg + '</li>';
      break;
    case 'msg':
      ul.innerHTML +=
        '<li class="m-txt"><span>' + user + ' </span>' + msg + '</li>';
      break;
  }
}

loginInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    const name = loginInput.value.trim();
    if (name != '') {
      username = name;
      document.title = 'Chat (' + username + ')';

      socket.emit('join-request', username);
    }
  }
});

textInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    const txt = textInput.value.trim();
    textInput.value = '';

    if (txt != '') {
      addMessage('msg', username, txt);
      socket.emit('send-msg', txt);
    }
  }
});

socket.on('user-ok', (list) => {
  loginPage.style.display = 'none';
  chatPage.style.display = 'flex';
  textInput.focus();

  addMessage('status', null, username + ' Conectado!');

  userList = list;
  renderUserList();
});

socket.on('list-update', (data) => {
  if (data.joined) {
    addMessage('status', null, data.joined + ' entrou no chat.');
  }

  if (data.left) {
    addMessage('status', null, data.left + ' saiu do chat.');
  }
  userList = data.list;
  renderUserList();
});

socket.on('show-msg', (data) => {
  addMessage('msg', data.username, data.message);
});
