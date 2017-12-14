const mysql = require('mysql');
const admin = require('./admin.js')
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected1")
    whoAreYou();
})

function buying() {
    connection.query(
        'select * from products', (err, results) => {
            if (err) throw err;
            inquirer
                .prompt([{
                        name: 'choices',
                        type: 'list',
                        choices: () => {
                            var choiceArr = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArr.push(results[i].product_name)
                            }
                            return choiceArr
                        },
                        message: "Which Item would you like to buy?"
                    },
                    {
                        name: 'amount',
                        type: 'input',
                        message: 'How many would you like to buy?'
                    }
                ])
                .then((answer) => {
                    var chosenProduct;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].product_name === answer.choices) {
                            chosenProduct = results[i];
                        }
                    }
                    if (chosenProduct.stock_quantity > parseInt(answer.amount)) {
                        connection.query(
                            'update products set ? where ?', [{
                                    stock_quantity: chosenProduct.stock_quantity - answer.amount
                                },
                                {
                                    id: chosenProduct.id
                                }
                            ],
                            (err) => {
                                if (err) throw err;
                                console.log('Your order has been placed')
                                shopAgain();

                            }
                        );
                    }
                });

        });
}

function startShopping() {
    console.log('Here are the current Items available')
    query = connection.query(
        'select * from products',
        (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                console.log(`Id: ${res[i].id}: Name: ${res[i].product_name}: Dep: ${res[i].department_name}: Price: ${res[i].price}: In Stock: ${res[i].stock_quantity}:`)
            }

            buying();
        }
    )

};
var shopAgain = () => {
    inquirer
        .prompt([{
            type: 'confirm',
            name: 'shop',
            message: "Would you Like to start shopping?"
        }]).then((answer) => {
            if (answer.shop === true) {
                startShopping();
            } else {
                console.log('Thank you, Come again!');
                connection.end();
            }
        })
}
var whoAreYou = () => {
    inquirer
        .prompt([{
            type: 'list',
            name: 'user',
            choices: ['Admin', 'Shopper'],
            message: 'Hello, are you a Shopper or and Admin?'
        }])
        .then((answer) => {
            if (answer.user === 'Admin') {
                console.log('admin ran')
                admin();
            } else if (answer.user === 'Shopper') {
                shopAgain();
            }
        })

}