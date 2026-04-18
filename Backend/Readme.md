

{
    "firstName": "sumit",
    "emailId": "sumit.sharma0018",  // we can registered wrong email id 
    "password": "Sumit@123"
}

Validator is used to to validate our data like, valid email and strong password

    validator.isEmail(data.emailId)
    validator.isStrongPassword(data.password)

when we login then first validate the user data because they save our DB request.

12345678

