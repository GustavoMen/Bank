// modulos externos
const inquerer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs')
const inquirer = require('inquirer');
const { Console } = require('console');

operation();


function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Finalizar Sistema'
        ]
    }]).then((answer) => {
        const action = answer['action']

        if (action === 'Criar Conta') {

            createAccount();

        } else if (action === 'Depositar') {

            deposit()

        } else if (action === 'Consultar Saldo') {

            getAccountBalance()

        } else if (action === 'Sacar') {

            widthdraw()

        } else if (action === 'Finalizar Sistema') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }
    })
        .catch(err => { console.log(err) })
}

// create an account

function createAccount() {
    console.log(chalk.bgGreen.black('Parabens por escolher o nosso Banco'))
    console.log(chalk.green('Defina as opçoes da sua conta a seguir'))

    buildAccount();
}

function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite seu nome'
    }]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Está conta ja existe.'))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        },
        )

        console.log(chalk.green('Parabens a sua conta foi criada'))
        operation();
    })
        .catch((err) => {
            console.log(err)
        })
}

// add an amount to user account

function deposit() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o accountName da sua conta?'
    }]).then((answer => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return operation();
        }
        inquirer.prompt([{
            name: 'amount',
            message: ' Quanto você deseja depositar?',
        }]).then((answer) => {
            const amount = answer['amount']

            addAmount(accountName, amount);
            operation();
        })

    }))
        .catch(err => { console.log(err) })
}

// verify if account exists

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente.'))
        return false
    }
    return true
}


function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(
            chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
        )
        return operation()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(
        chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`),
    )
}


function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

//show account balance

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o seu accountName?'
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]

        //verify
        if(!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `Você possui R$${accountData.balance} em sua conta`
        ))
            operation()
    }).catch(err => console.log(err))
}



// widthdraw an amount from user account
function widthdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message:'Qual o seu AccountName?'
        }
    ]).then((answer) =>{

        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return widthdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) =>{

            const amount = answer['amount']

            removeAmount(accountName, amount)
            
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente.'))
        return widthdraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponivel'))
        return widthdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))
operation();
}