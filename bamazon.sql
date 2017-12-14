create database bamazon;

use bamazon;

create table products(
	id integer(50)auto_increment not null,
    product_name varchar(25) not null,
    department_name varchar(25) not null,
    price decimal(8, 2) not null,
    stock_quantity integer(10) not null

);

insert into products(product_name, department_name, price, stock_quantity)
values ("Oranges", "Produce", 3.99, 20);

insert into products(product_name, department_name, price, stock_quantity)
values ("Apples", "Produce", 1.99, 15);

insert into products(product_name, department_name, price, stock_quantity)
values ("Phone Charger", "Electronics", 15.00, 25);

insert into products(product_name, department_name, price, stock_quantity)
values ("Graphics Card", "Electronics", 699.99, 5);

insert into products(product_name, department_name, price, stock_quantity)
values ("Computer Case", "Electronics", 109.99, 15);

insert into products(product_name, department_name, price, stock_quantity)
values ("Bamazon Balexa", "Home Improvement", 34.99, 35);

insert into products(product_name, department_name, price, stock_quantity)
values ("Toilet", "Home Improvement", 199.95, 10);




