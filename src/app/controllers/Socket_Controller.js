const message = require('./MessageController')
const call = require('./CallController')
module.exports.start = (io) => {
    var arr = new Array();
    var listConnect = new Array();

    io.on('connection', (socket) => {
        //-------------------Chat----------------
        arr.push(socket.id);
        socket.on('join-room-chat', (idRoom) => {
            socket.join(idRoom);
        });

        socket.on('on-chat', (data, idRoom) => {
            const d = new Date();
            let hour = d.getHours();
            let minute = d.getMinutes();
            let day = d.getDate();
            let month = d.getMonth();
            let year = d.getFullYear();
            data.time =
                hour + ':' + minute + '   ' + day + '/' + month + '/' + year;
            io.to(idRoom).emit('user-chat', data);
            message.pushMessage(idRoom, data);
        });
        socket.on('on-chat-call', (data, idRoom) => {
            const d = new Date();
            let hour = d.getHours();
            let minute = d.getMinutes();
            let day = d.getDate();
            let month = d.getMonth();
            let year = d.getFullYear();
            data.time =
                hour + ':' + minute + '   ' + day + '/' + month + '/' + year;
            io.to(idRoom).emit('user-chat-call', data);
        });

        socket.on('disconnect', () => {    
            try {
                var obj = listConnect.find(
                    (element) => element.socketId == socket.id,
                );
                if (obj) {
                    io.emit('user-disconnected', obj.username);
                }
                var index = listConnect.indexOf(
                    listConnect.find((element) => element.socketId == socket.id),
                );
                if (index !== -1) {                    
                    var node = listConnect.find((element) => element.socketId == socket.id);
                    console.log("disconnect: "+ node.idRoom+"  "+node.useID)
                    call.popCall(node.idRoom, node.useID);                   
                    listConnect.splice(index, 1);
                    console.log(listConnect);
                }
                else {
                    arr.splice(arr.indexOf(socket.id), 1);
                    io.emit('mang', arr);
                    
                }
                console.log('done');
            }
            catch(Error) {
                if (arr.indexOf(socket.id) !== -1) {
                    
                    
                    
                }
                console.log(Error.message);
            }
        });

        //-------------------Call----------------
        socket.on('join-room', (roomId, objId) => {
            listConnect.push(objId);
            call.pushCall(roomId, objId.useID);
            socket.emit('list-obj', listConnect);
            socket.join(roomId);
            socket.broadcast.to(roomId).emit('user-connected', objId);
        });
    });
};
