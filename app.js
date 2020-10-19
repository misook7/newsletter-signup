const express = require('express');
const bodyParser = require('body-parser');

const mailchimp = require("@mailchimp/mailchimp_marketing");
const { nextTick } = require('process');

mailchimp.setConfig({
  apiKey: "c8ba46fe04d5c769b9719de5b53abcfd-us2",
  server: "us2"
});

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", async (req, res, next) => {
    try {
        const listId = "202cf90f9e";
        const subscribingUser = {
            firstName: req.body.fName,
            lastName: req.body.lName,
            email: req.body.email
        };  
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        //res.send(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);       
        res.sendFile(__dirname + "/success.html");  // send success page as file to be rendered
        
    } catch(error) {
        //console.log(error);
        next(error);
    }  
});

// error handling
app.use((error, req, res, next) => {    
    //res.send('Something broke!');
    res.sendFile(__dirname + "/failure.html");
});

// redirect the user if fails to signing up
app.post("/failure", (req, res) => {
    res.redirect("/"); // redirect to the home route
})
      
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port 3000');
});


// api key
// c8ba46fe04d5c769b9719de5b53abcfd-us2

// list id
// 202cf90f9e