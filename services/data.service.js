
const db = require('./db');

let currentuser;
const register = (acno, name, password) => {
    console.log("register called");

    //db.schema.findOne({...})

    return db.User.findOne({ acno })
        .then(user => {
            console.log(user)
            if (user) {
                return {
                    status: false,
                    statusCode: 422,
                    message: "User already exist. Please Login.."
                }
            }
            else {
                const newUser = new db.User({
                    acno,
                    name,
                    balance: 0,
                    password
                });
                newUser.save();
                return {

                    status: true,
                    statusCode: 200,
                    message: "Registration Successful"
                }
            }
        })


    // if (acno in accountDetails) {

    //     return {
    //         status: false,
    //         statusCode: 422,
    //         message: "User already exist. Please Login.."
    //     }
    // }
    // accountDetails[acno] =
    // {
    //     acno,
    //     name,
    //     balance: 0,
    //     password
    // };
    // console.log(accountDetails);
    // return {

    //     status: true,
    //     statusCode: 200,
    //     message: "Registration Successful"
    // }
}


const login = (req, acno, password) => {
    var acno = parseInt(acno);
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            req.session.currentuser = user.acno;
            return {
                status: true,
                statusCode: 200,
                message: "login Successful",
                name: user.name,
                acno:user.acno
            }
        }
        else {
            return {
                status: false,
                statusCode: 422,
                message: "User does not exist with provided account details"
            }
        }
    })




    // let dataset = accountDetails;
    // if (acno in dataset) {
    //     var pass = dataset[acno].password;
    //     if (password == pass) {
    //         req.session.currentuser = dataset[acno];
    //         //saveDetails();

    //         return {
    //             status: true,
    //             statusCode: 200,
    //             message: "login Successful"
    //         }
    //     }
    //     else {

    //         return {
    //             status: false,
    //             statusCode: 422,
    //             message: "Invalid password"
    //         }
    //     }
    // }
    // else {

    //     return {
    //         status: false,
    //         statusCode: 422,
    //         message: "User does not exist with provided account number"
    //     }
    // }
}


const deposit = (req,accno, psw, amount) => {


    var amt = parseInt(amount);
    return db.User.findOne({
        acno: accno,
        password: psw
    }).then(user => {
        if (!user) {
            return {
                status: false,
                statusCode: 422,
                message: "User does not exist with provided account details"
            }

        }
        if (req.session.currentuser != user.acno) {
            return {
                status: false,
                statusCode: 422,
                message: "You are not accessible to this account",
            }
        }
        else {
        user.balance += amt;
        user.save();
        return {
            status: true,
            statusCode: 200,
            message: "Deposit successful. Balance is ",
            balance: user.balance
        }
    }
    })


    // let dataset = accountDetails;
    // if (accno in dataset) {
    //     var pswd1 = dataset[accno].password;

    //     if (pswd1 == psw) {
    //         var bal = dataset[accno].balance += amt;
    //         return {
    //             status: true,
    //             statusCode: 200,
    //             message: "Deposit successful. Balance is ",
    //             balance: bal
    //         }
    //     }
    //     else {
    //         return {
    //             status: true,
    //             statusCode: 422,
    //             message: "invalid password"
    //         }
    //     }
    // }
    // else {
    //     return {
    //         status: true,
    //         statusCode: 422,
    //         message: "invalid account number"
    //     }

    // }

}

const withdraw = (req,accno, pwd, amount) => {

    // if(!req.session.currentuser==accno)
    // {
    //     return {
    //         status: false,
    //         statusCode: 422,
    //         message: "You are not accessible to this account",
    //         }
    // }
    // else{


    var amt = parseInt(amount);
    return db.User.findOne({
        acno: accno,
        password: pwd
    }).then(user => {
        if (user) {
            console.log(req.session.currentuser);
            console.log(user.acno);
            if (req.session.currentuser != user.acno) {
                return {
                    status: false,
                    statusCode: 422,
                    message: "You are not accessible to this account",
                }
            }
            else {

                if ((user.balance) > amt) {
                    user.balance -= amt;
                    user.save();
                    return {
                        status: true,
                        statusCode: 200,
                        message: "Account has been debited",
                        balance: user.balance
                    }
                }
                else {
                    return {
                        status: false,
                        statusCode: 422,
                        message: "Insufficient balance",
                        balance: user.balance
                    }
                }
            }
        }
        else {
            return {
                status: false,
                statusCode: 422,
                message: "invalid credentials"
            }
        }
    })


    
    // let dataset = accountDetails;
    // if (accno in dataset) {
    //     var pswd1 = dataset[accno].password;
    //     if (pswd1 == pwd) {
    //         if (dataset[accno].balance > amount) {
    //             dataset[accno].balance -= amt;
    //             return {
    //                 status: true,
    //                 statusCode: 200,
    //                 message: "Account has been debited",
    //                 balance: dataset[accno].balance
    //             }
    //         }
    //         else {
    //             return {
    //                 status: false,
    //                 statusCode: 422,
    //                 message: "Insufficient balance",
    //                 balance: dataset[accno].balance
    //             }
    //         }
    //     }
    //     else{
    //         return {
    //             status: false,
    //             statusCode: 422,
    //             message: "invalid password"
    //         }
    //     }
    // }
    // else {
    //     return {
    //         status: false,
    //         statusCode: 422,
    //         message: "invalid account number"
    //     }

    // }
}

const deleteAccDetails=(acno)=>{
    return db.User.deleteOne({
        acno:acno
    }).then(user=>{
        if(!user){
            return{
                status:false,
                statusCode:422,
                message:"Operation failed"
            }
        }
        return{
            status:false,
            statusCode:200,
            message:"Account Number"+acno+"deleted successfully"
        }
    })
}
module.exports =
{
    register,
    login,
    deposit, withdraw,deleteAccDetails
}