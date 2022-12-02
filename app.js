
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const bodyParser = require('body-parser'); //body-parser is used to get elements from the body
const request = require('request');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static('public')); // to make the css file and Pics work staticlly

app.use(bodyParser.urlencoded({extended: true})); // for body-parser to work

// setting mailchimp
mailchimp.setConfig({
  apiKey: '***********',
  server: '******',
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});
app.post('/', (req, res) => {

  fN = req.body.firstName;
  lN = req.body.lastName;
  email = req.body.email;

  console.log(fN, lN, email);

  // add member
  const listId = '*******';  // you can access it on Audience Page and it's unique for me
  const subscribingUser = {
    firstName: fN,
    lastName: lN,
    email: email
  };

//this function to upload the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
       //If all goes well logging the contact's id
    console.log(`Successfully added and the ID is ${response.id}`);
    res.sendFile(__dirname + "/success.html");
  }
  // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server is running on port 3000');
});
