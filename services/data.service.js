let accountDetails =
{
    1000: { acno: 1000, name: "userone", balance: 5000, password: "user1" },
    1001: { acno: 1001, name: "usertwo", balance: 3500, password: "user2" },
    1002: { acno: 1002, name: "userthree", balance: 6000, password: "user3" },
    1003: { acno: 1003, name: "userfour", balance: 7000, password: "user4" },
    1004: { acno: 1004, name: "userfive", balance: 5200, password: "user5" },
}

let currentuser;
const register = (acno, name, password) => {
    console.log("register called");

    if (acno in accountDetails) {

        return {
            status: false,
            statusCode: 422,
            message: "User already exist. Please Login.."
        }
    }
    accountDetails[acno] =
    {
        acno,
        name,
        balance: 0,
        password
    };
    console.log(accountDetails);
    return {

        status: true,
        statusCode: 200,
        message: "Registration Successful"
    }
}


const login = (req,acno, password) => {
    let dataset = accountDetails;
    if (acno in dataset) {
        var pass = dataset[acno].password;
        if (password == pass) {
            req.session.currentuser = dataset[acno];
            //saveDetails();

            return {
                status: true,
                statusCode: 200,
                message: "login Successful"
            }
        }
        else {

            return {
                status: false,
                statusCode: 422,
                message: "Invalid password"
            }
        }
    }
    else {

        return {
            status: false,
            statusCode: 422,
            message: "User does not exist with provided account number"
        }
    }
}


const deposit = (accno, psw, amount) => {
   
    var amt = parseInt(amount);
    let dataset = accountDetails;
    if (accno in dataset) {
        var pswd1 = dataset[accno].password;

        if (pswd1 == psw) {
            var bal = dataset[accno].balance += amt;
            return {
                status: true,
                statusCode: 200,
                message: "Deposit successful. Balance is ",
                balance: bal
            }
        }
        else {
            return {
                status: true,
                statusCode: 422,
                message: "invalid password"
            }
        }
    }
    else {
        return {
            status: true,
            statusCode: 422,
            message: "invalid account number"
        }

    }

}

const withdraw = (accno, pwd, amount) => {
    
    var amt = parseInt(amount);
    let dataset = accountDetails;
    if (accno in dataset) {
        var pswd1 = dataset[accno].password;
        if (pswd1 == pwd) {
            if (dataset[accno].balance > amount) {
                dataset[accno].balance -= amt;
                return {
                    status: true,
                    statusCode: 200,
                    message: "Account has been debited",
                    balance: dataset[accno].balance
                }
            }
            else {
                return {
                    status: false,
                    statusCode: 422,
                    message: "Insufficient balance",
                    balance: dataset[accno].balance
                }
            }
        }
        else{
            return {
                status: false,
                statusCode: 422,
                message: "invalid password"
            }
        }
    }
    else {
        return {
            status: false,
            statusCode: 422,
            message: "invalid account number"
        }

    }
}

module.exports =
{
    register,
     login,
      deposit, withdraw
}