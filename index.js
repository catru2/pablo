require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const mqtt = require('mqtt');
const io = require('socket.io-client');

app.use(cors())
//middlewares
app.use(express.json());

//rutas
const cachorrosRouter = require('./src/routes/cachorros.route');
const dueniosRouter = require('./src/routes/duenios.route');
const authRouter = require('./src/routes/auth.route');
const usuariosRouter = require('./src/routes/usuarios.route');

app.use('/cachorros', cachorrosRouter);
app.use('/duenios', dueniosRouter);
app.use('/auth', authRouter);
app.use('/usuarios', usuariosRouter);


app.listen(PORT, () => {
    console.log('API escuchando')
});

//MQTT
//Configuración del cliente MQTT
const mqttBroker = "mqtt://54.198.85.178"; 
const mqttOptions = {
    username: "esp32",
    password: "1234"
};

const mqttClient = mqtt.connect(mqttBroker, mqttOptions);

//Configuración del cliente Socket.IO
const socket = io("http://localhost:3001" , {
    transports: ['websocket'],
}); 

//Manejar eventos de conexión MQTT
mqttClient.on('connect', () => {
    console.log('Conectado al servidor MQTT');

    //suscribirse a un tema MQTT
    mqttClient.subscribe('temperatura');
});

//Manejar mensajes recibidos en el tema suscrito MQTT
mqttClient.on('message', (topic, message) => {
    let dataString = message.toString()
    const jsonData = JSON.parse(dataString);
    console.log(jsonData)

    //Emitir mensaje al servidor socket.io
    socket.emit('esp32', jsonData);

    //Manejar eventos de conexión y desconexión del cliente socket.io
    socket.on('connect', () => {
         console.log(`Conecatdo al servidor Socket.IO`)  
    });

    socket.on('disconnect', () =>{
        console.log('Desconectado del servidor Socket.IO')
    })
})
//Terminación de MQTT
