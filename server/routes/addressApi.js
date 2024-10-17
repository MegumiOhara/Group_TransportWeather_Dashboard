const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); //to use environment variables.

const app = express();
const port = 3000;

//Middleware