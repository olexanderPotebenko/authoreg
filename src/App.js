import React from 'react';
import './App.css';
import {authApi, userApi, followApi} from './api/api';
import {first_names, last_names} from './templates/templates';

const password = '111111';

let getRandomItemNumber = (arr) => {
    return arr[Math.floor(arr.length * Math.random())];
};

let getRandomUsers = (users) => {
    return users.filter(user => Math.random() * 100 < 5);
};

let styles = {};

class App extends React.Component {

    state = {
        users: null,
    }

    onSetUsers = () => {
        userApi.getUsersNoData()
            .then(data => {
                console.log(
                `-------------------------------\n
                ---GETING USERS SUCCESSFULLY---\n
                -------------------------------`);
                this.setState({users: data.items});
            });
    }

    onSignIn = () => {
        Promise.all(this.state.users.map(({email}) => {
            return authApi.signIn({email, password})
                .then(user => {
                    console.log(user);
                    return user
                });
        }) ).then(data => {
            console.log(`\n ----SINGN IN ACKS SUCCESSFULLY---`);
            this.setState({auth_users: data.map(data => data.data)});
        });
    }

    onCreateAcks = async () => {

        for(let i = 0; i < 100; i++){
            let first_name = getRandomItemNumber(first_names);
            let last_name = getRandomItemNumber(last_names);
            let email = `${first_name}.${last_name}@gmail.com`.toLowerCase();
            let options = {
                first_name,
                last_name,
                password, 
                email,
            };

            let user = await authApi.signUp(options);
            console.log(user);
        };
    };

    onSubscription = () => {
        /*
        this.state.auth_users.forEach((email, token, id) => {
            getRandomUsers(this.state.users).forEach( async (user) => {
                let data = await followApi.follow({email, token, id, user_id: user.id})
                console.log(data);
            });
        })
        */

        this.state.auth_users.forEach(async user => {
            await getRandomUsers(this.state.users).forEach( async (item_user) => {
                await followApi.follow({...user, user_id: item_user.id})
                    .then(resolve => {
                        console.log(resolve);
                        return Promise.resolve(resolve);
                    });
            })
        })
    }


    render() {

        return (
            <div className="App">
                social network authoreg
                <nav>
                    <div className={styles.button_wrp}>
                        <button onClick={this.onSetUsers}>
                            get users 
                        </button>
                    </div>
                    <div className={styles.button_wrp}>
                        <button onClick={this.onSignIn}>
                           authorization 
                        </button>
                    </div>
                    <div className={styles.button_wrp}>
                        <button onClick={this.onCreateAcks}>
                            create acks
                        </button>
                    </div>
                    <div className={styles.button_wrp}>
                        <button onClick={this.onSubscription}>
                            subscription
                        </button>
                    </div>
                    <div className={styles.button_wrp}>
                        <button>nothing</button>
                    </div>
                    <div className={styles.button_wrp}>
                        <button>nothing</button>
                    </div>
                    <div className={styles.button_wrp}>
                        <button>nothing</button>
                    </div>
                </nav>
            </div>
        );
    }
}

export default App;
