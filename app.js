const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({apiKey: "ea0c1df2285365689c17eda089828ad3-us1", server: "us1"});

app.post("/", function (req, res) {
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const emaill = req.body.email;
    const listId = "58abbc1fa1";

    const data = {
        members: [
            {
                email_address: emaill,
                status: "subscribed",
                merge_fields: {
                    fname: firstname,
                    lname: lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/58abbc1fa1"
    const options = {
        method: "POST",
        auth: "GkBoii:ea0c1df2285365689c17eda089828ad3-us1"
    }


    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        } response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3300, function () {
    console.log("Server is running on port 3300");
})
