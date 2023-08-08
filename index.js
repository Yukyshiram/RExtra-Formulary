//librerias
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const path = require('path');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');

//tiempo mexico
const mexico = moment().tz("America/Mexico_City");
const date = mexico.format('DD/MM/YYYY');
const hour = mexico.format('HH:mm:ss');

//numero de telefono de whatsapp 
const numeroTelWhatsapp = '5213322200796'; //telefono al que mandara que esta activo el bot

//esto es para whatsapp
const sofi = require('./sofi');

sofi.on('authenticated', (session) => {
    console.clear()
});

//iniciar cliente
sofi.initialize();
sofi.on("qr", qr => {
    qrcode.generate(qr, { small: true });
})

const send_message = [
    numeroTelWhatsapp
]

//Ejecutar cliente
sofi.on("ready", () => {
    console.log("Wa: Empecemos este dia como si fuera una nueva aventura...\n")

    send_message.map(value => {
        const chatId = value + "@c.us"
        message = `Sofia architecture is online, \nTime: ${hour}\nSegun moment-timezone`
        sofi.sendMessage(chatId, message);
    })


    // Tambien se inicia el servidor de express
    app.listen(3000, () => {
        console.log('Ex: Servidor iniciado en http://localhost:3000/\n');
    });

});

//crear un objeto de transporte
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'Example651@gmail.com', // ingrese el gmail al que tendra acceso el programa
        pass: 'dfghjkl' // ingrese la clave de autorizacion para que pueda ingresar al gmail para enviar mails
    }
});

/*Esto es parte de express */
app.use(express.static(path.join(__dirname, 'public')));
// Configura el middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: false }));
// Muestra el formulario en la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
// Procesa los datos del formulario
app.post('/', (req, res) => {
    const nombre = req.body.nombre; // Nombre de quien envia
    const correo = req.body.correo; // Correo de quien envia
    const numUser = req.body.numero; // Numero de telefono de quien envia
    const mensaje = req.body.mensaje; // Mensaje de quien envia, puede ser el problema o el bug que este presentando
    const peticion = req.body.peticion; // Es un fallo o peticion?

    // Aquí podrías agregar código para procesar los datos del formulario,
    // enviar un correo electrónico
    res.send(`
    <script>
      alert('Formulario enviado exitosamente, recuerda que se te enviara una copia de tu solicitud por correo(en caso de que no aparezca revisa tu carpeta de spam)');
      window.location.href = '/';
    </script>
  `);

    //esto lo envia hacia whatsapp
    send_message.map(value => {
        const chatId = value + "@c.us"
        message = `*Nueva falla/sugerencia*\n\nTiempo: ${hour}\nFecha: ${date}\n\nDatos del usuario\n\nNombre: ${nombre}\nCorreo: ${correo}\nNumero: ${numUser}\n\nPeticion tipo: _${peticion}_\nMensaje: ${mensaje}`
        
        sofi.sendMessage(chatId, message);

        console.log('\n' + message + '\n');
    });

    // configurar los datos del correo electrónico
    let mailOptions = {
        from: 'ejemplo123@gmail.com', // quien envia?
        to: correo, // a que correo se envia
        subject: 'Formulario RExtra',  //sujeto
        text: `Nombre: ${nombre}\n\nFormulario tipo: ${peticion}\n\n Mensaje: ${mensaje}\n\n\nSu petición será revisada en un lapso estimado de 3 días hábiles, en los cuales cuando se revise se le enviara un correo electrónico de regreso\nSi no recibes un correo, revisa tu carpeta de spam\n\nAtte: Equipo de Soporte RExtra` //mensaje
    };

    // enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
        }
    });

});
/*Fin de express */