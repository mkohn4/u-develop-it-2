const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//404 error for all non-defined responses
app.use((req,res) => {
    res.status(404).end();
});

//start express middleware
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})