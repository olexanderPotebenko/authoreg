import React from 'react';
import './App.css';
import {authApi, userApi, followApi, profileApi} from './api/api';
import {first_names, last_names} from './templates/templates';

const posts = require.context('./images', true, /\.png|.jpeg|.jpg$/);

const postsObjArray = posts.keys()
    .map(key => ({
        path: key,
        file: posts(key),
    })
    );

console.log(postsObjArray);

const password = '111111';

let getRandomItemNumber = (arr) => {
    return arr[Math.floor(arr.length * Math.random())];
};

let getRandomItems = (arr, factor = 55) => {
    return arr.filter(item => Math.random() * 100 < factor);
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

        for(let i = 0; i < 10; i++){
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
            getRandomItems(this.state.users).forEach( async (user) => {
                let data = await followApi.follow({email, token, id, user_id: user.id})
                console.log(data);
            });
        })
        */

        this.state.auth_users.forEach(async user => {
            await getRandomItems(this.state.users).forEach( async (item_user) => {
                await followApi.follow({...user, user_id: item_user.id})
                    .then(resolve => {
                        console.log(resolve);
                        return Promise.resolve(resolve);
                    });
            })
        })
    }

    onPosting = () => {
        let img = document.getElementById('post');
        let canvas = document.createElement('canvas');

        this.state.auth_users.forEach(async (user, index) => {

            getRandomItems(postsObjArray, 50).forEach(async (post) => {
                console.log(`User ${user.id} added post ${post.file}`);

                await new Promise( resolve => {
                    img.src = post.file;
                    setTimeout(() => {
                        // создаём <canvas> того же размера
                        resolve();
                    }, 150);
                });

                canvas.width = img.clientWidth;
                canvas.height = img.clientHeight;

                let context = canvas.getContext('2d');

                // копируем изображение в  canvas (метод позволяет вырезать часть изображения)
                context.drawImage(img, 0, 0);
                // мы можем вращать изображение при помощи context.rotate() и делать множество других преобразований

                // toBlob является асинхронной операцией, для которой callback-функция вызывается при завершении

                let blob = await new Promise (resolve => {

                    canvas.toBlob((blob) => {

                        resolve(blob);
                    });
                });
                // после того, как Blob создан, загружаем его
                let fd = new FormData();
                fd.append('text', 'loh lohloh loh loh loh loh');
                fd.append('image', blob, 'image.png');

                let options = {
                    id: user.id, 
                    token: user.token,
                    post: fd,
                };
                await profileApi.createPost(options);

                // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
            }, 'image/png');
        });

    }


    render() {

        return (
            <div className='wrp'>
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
                            <button onClick={this.onPosting} >
                                posting
                            </button>
                        </div>
                        <div className={styles.button_wrp}>
                            <button>nothing</button>
                        </div>
                        <div className={styles.button_wrp}>
                            <button>nothing</button>
                        </div>
                        <div id='posting image'>
                            <canvas id='canvas' visibility='hidden'/>
                            <img id='post' style={{ visibility: 'hidden', position: 'absolute' }}/>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

export default App;
