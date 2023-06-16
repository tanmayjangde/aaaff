/* Importing dependencies */
//const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');


const app = express();

/*-------------------------------------*/
/* Connect to Database */
//connectDB();
/*------------------------------------*/


/*Importing Routes*/
app.get('/', (req, res) => {
    res.send('Woohooo!')
})
const chatbotRoute = require('./Routes/chatbotRoute');

/*-------------------------------------*/

/* Middle wares */
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/chatbot', chatbotRoute);
/*-------------------------------------*/

/* Starting server */

app.listen(3000, () => {
    console.log("Server started at PORT : 3000");
});