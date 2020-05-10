class ChatEngine{
    constructor(chatBoxId, userEmail,userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect',function(){
            console.log('connection established using sockets...!');
        });

        self.socket.emit('join_room',{
            user_email: self.userEmail,
            chatroom: 'codeial'
        });

        self.socket.on('user_joined',function(data){
            console.log('A user joined!',data);
        });

        // When send button is clicked the message is emit to the server
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg!=''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_name: self.userName,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        // On receiving the message display in the chat-list
        self.socket.on('receive_message',function(data){
            console.log('message received!!!',data.message,data.user_name);

            let newMessage = $('<li>');
            let messageType = 'other-message';

            if(data.user_email == self.userEmail) messageType = 'self-message';

            newMessage.append($('<sup>',{
                'html': "~"+data.user_name
            }));

            newMessage.append($('<span>',{
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);

            $('#chat-message-input').val("");

            var objDiv = document.getElementById("chat-messages-list");
            objDiv.scrollTop = objDiv.scrollHeight;
        });
    }
}