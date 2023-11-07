#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// bank account
class bankAccount {
    accountName;
    accountNumber;
    Amount;
    constructor(name, accNumber, amount) {
        this.accountName = name;
        this.accountNumber = accNumber;
        this.Amount = amount;
    }
}
class Bank {
    account = [];
    addAccount(obj) {
        this.account.push(obj);
    }
}
let myBank = new Bank();
//create customer array
for (let i = 1; i <= 2; i++) {
    let name = faker.person.fullName();
    let balance = 1000 * i;
    let accA = new bankAccount(name, 1000 + i, balance);
    myBank.addAccount(accA);
}
console.log(myBank);
async function askDetails() {
    let details = await inquirer.prompt({
        type: "input",
        name: "accN",
        message: "Type your Account number "
    });
    let account = myBank.account.find((acc) => acc.accountNumber == details.accN);
    if (!account) {
        console.log(chalk.red.bold(`\n Invalid Account \n`));
    }
    if (account) {
        return account;
    }
}
// bank functionality
async function services(bank) {
    let account = await askDetails();
    while (account?.accountNumber != undefined) {
        console.clear();
        let service = await inquirer.prompt({
            type: "list",
            name: "operation",
            message: "\n What task you want to perform?",
            choices: ["Cash Withdrawal", "Balance Inquiry", "Cash Deposit", "Exit"]
        });
        if (service.operation == "Cash Withdrawal") {
            let reqAmount = await inquirer.prompt({
                type: "number",
                name: "money",
                message: "Write Amount you want to withdraw",
            });
            if (reqAmount.money <= account.Amount) {
                console.log(`\n Your available balance is ${chalk.green.bold(`${account.Amount}`)}`);
                account.Amount -= reqAmount.money;
                console.log(`\n You withdrawn ${chalk.green.bold(`${reqAmount.money}`)}`);
                console.log(`\n Your new balance is ${chalk.yellowBright.bold(`${account.Amount}`)}`);
            }
            else {
                console.log(`\n Your available balance is ${chalk.green.bold(`${account.Amount}`)}`);
                console.log(`${chalk.red(`You don't have enough balance`)}`);
            }
        }
        else if (service.operation == "Cash Deposit") {
            let reqAmount = await inquirer.prompt({
                type: "number",
                name: "money",
                message: "Write Amount you want to deposit",
            });
            console.log(`\n Your available balance is ${chalk.green.bold(`${account.Amount}`)}`);
            account.Amount += reqAmount.money;
            console.log(`\n You deposited ${chalk.green.bold(`${reqAmount.money}`)}`);
            console.log(`\n Your new balance is ${chalk.yellowBright.bold(`${account.Amount}`)}`);
        }
        else if (service.operation == "Balance Inquiry") {
            console.log(`${chalk.green(account.accountName)} your balance is ${chalk.blue(`$ ${account.Amount}`)}`);
        }
        else {
            account = undefined;
        }
    }
}
await services(myBank);
