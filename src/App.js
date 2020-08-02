import React from 'react';
import './App.css';
import {authApi} from './api/api';
import {first_names, last_names} from './templates/templates';

let getRandom = (arr) => {
    return arr[Math.floor(arr.length * Math.random())];
};

function App() {

    let styles = {};

    let onCreateAcks = async () => {

        for(let i = 0; i < 1000; i++){
            let first_name = getRandom(first_names);
            let last_name = getRandom(last_names);
            let email = `${first_name}.${last_name}@gmail.com`.toLowerCase();
            let password = '111111';
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

  return (
    <div className="App">
          social network authoreg
        <nav>
            <div className={styles.button_wrp}>
                <button onClick={onCreateAcks}>
                    create acks
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
            <div className={styles.button_wrp}>
                <button>nothing</button>
            </div>
        </nav>
    </div>
  );
}

export default App;
