console.log('admin connected')
const inquirer = require('inquirer')
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected")

})

var adminList = () => {
    inquirer
        .prompt([{
            type: 'list',
            name: 'action',
            choices: ['View Product For Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Products'
            ],
            message: 'What would you like to do today?'
        }]).then((answer) => {
            if (answer.action === 'View Product For Sale') {
                viewProducts();
            } else if (answer.action === 'View Low Inventory') {
                lowInv();
            } else if (answer.action === 'Add to Inventory') {
                addInv();
            } else if (answer.action === 'Add New Products') {
                addProduct();
            } else {
                console.log('Sorry I dont understand what you want to do');
            }

        })
};


var viewProducts = () => {
    connection.query(
        'select * from products',
        (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(`Id: ${res[i].id}: Name: ${res[i].product_name}: Dep: ${res[i].department_name}: Price: ${res[i].price}: In Stock: ${res[i].stock_quantity}:`)
            }
            adminList();
        }
    )
}
var lowInv = () => {
    query = connection.query(
        'select * from products where stock_quantity < 10',
        (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                console.log(`Id: ${res[i].id}: Name: ${res[i].product_name}: Dep: ${res[i].department_name}: Price: ${res[i].price}: In Stock: ${res[i].stock_quantity}:`)
            }
            adminList();
        }
    )

}
var addInv = () => {
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
                        message: "Which Item was in the shippment?"
                    },
                    {
                        name: 'amount',
                        type: 'input',
                        message: 'How many came in?'
                    }
                ])
                .then((answer) => {
                    var chosenProduct;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].product_name === answer.choices) {
                            chosenProduct = results[i];
                        }
                    }
                    connection.query(
                        'update products set ? where ?', [{
                                stock_quantity: parseInt(answer.amount) + chosenProduct.stock_quantity
                            },
                            {
                                id: chosenProduct.id
                            }
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log('The Shipment has been added')
                            adminList();

                        }
                    );
                });

        });
}
var addProduct = () => {
    inquirer
        .prompt([{
                name: 'product',
                type: 'input',
                message: "What is the name of the new product?"
            },
            {
                name: 'amount',
                type: 'input',
                message: 'How many did we get in?'
            },
            {
                name: 'department',
                type: 'input',
                message: 'What department is it in?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'What are we selling it for? ($)'
            }

        ])
        .then((answer) => {
            connection.query(
                'insert into products set ?', {
                    product_name: answer.product,
                    stock_quantity: answer.amount,
                    department_name: answer.department,
                    price: parseInt(answer.price),
                },
                (err) => {
                    if (err) throw err;
                    console.log('New Item added')
                    adminList();

                }
            );

        });

}

module.exports = adminList; // 'admin.js'