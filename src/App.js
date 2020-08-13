import React from 'react';
import {connect} from 'react-redux';
import styles from './App.css';
import {getRandomItems, getRandomItemNumber} from './utils';
import {first_names, last_names} from './templates/templates';
import {getUsers, authUser, createUser, posted, subscribed} from './appReducer';

const posts = require.context('./images', true,); //\.png|.jpeg|.jpg$

const postsObjArray = posts.keys()
    .map(key => ({
        path: key,
        file: posts(key),
    })
    );
console.log('postsObjArray length = ' + postsObjArray.length);

const password = '111111';

class App extends React.Component {

    onSetUsers = () => {
        this.props.getUsers();
    }

    onSignIn = async () => {

        await new Promise(async resolve => {
        for(let i = 0; i < this.props.users.length; i++) {
            await this.props.authUser({
                email: this.props.users[i].email, password: '111111'
            });
            if(i == this.props.users.length - 1) resolve();
        };
        });

        await console.log(`\n ----SINGN IN ACKS SUCCESSFULLY---`);
    }

    onCreateAcks = async () => {

        for(let i = 0; i < 1000; i++){
            let first_name = getRandomItemNumber(first_names);
            let last_name = getRandomItemNumber(last_names);
            let email = `${first_name}.${last_name}@gmail.com`.toLowerCase();
            let options = {
                first_name,
                last_name,
                password, 
                email,
            };

            await this.props.createUser(options);
        };
    };

    onSubscription = async () => {

        let users = this.props.auth_users;
        for(let i = 0; i < users.length; i++) {
            let user = users[i];

            let target_users = getRandomItems(this.props.users);
            for(let j = 0; j < target_users.length; j++) {
                let target_user = target_users[j];

                let options = {
                    id: user.id,
                    token: user.token,
                    user_id: target_user.id,
                };

                await this.props.subscribed(options);
           };
        };
    }

    onPosting = async () => {
        let img = document.getElementById('post');
        let canvas = document.createElement('canvas');

        let users = this.props.auth_users;
        for(let i = 0; i< users.length; i++){
            let user = users[i];

            let posts = getRandomItems(postsObjArray, 2);
            for(let j = 0; j < posts.length; j ++){
                let post = posts[j];

                await new Promise( resolve => {
                    img.src = post.file;
                    setTimeout(() => {
                        // создаём <canvas> того же размера
                        resolve();
                    }, 50);
                })

                canvas.width = img.clientWidth;
                canvas.height = img.clientHeight;

                let context = canvas.getContext('2d');

                context.drawImage(img, 0, 0);

                let blob = await new Promise (resolve => {
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    });
                });

                let fd = new FormData();
                fd.append('text', 'loh lohloh loh loh loh loh');
                fd.append('image', blob, 'image.png');

                let options = {
                    id: user.id, 
                    token: user.token,
                    post: fd,
                };
                await this.props.posted(options);
                console.log(`User ${user.id} i = ${i} j = ${j}  added post ${post.file}`);
            };
        };

    }

    render() {

        return (
            <div className='wrp'>
                <div className="App">
                    social network authoreg
                    <nav>
                        <div className={styles.button_wrp}>
                            <button onClick={this.onSetUsers} >
                                get users 
                            </button>
                            {this.props.users.length}
                        </div>
                        <div className={styles.button_wrp}>
                            <button onClick={this.onSignIn}
                                disabled={!this.props.users.length}>
                                authorization 
                            </button>
                            {this.props.auth_users.length}
                        </div>
                        <div className={styles.button_wrp}>
                            <button onClick={this.onCreateAcks}>
                                create acks
                            </button>
                            {this.props.created_users.length}
                        </div>
                        <div className={styles.button_wrp}>
                            <button onClick={this.onSubscription}
                                disabled={!this.props.auth_users.length}>
                                subscription
                            </button>
                            {this.props.subscriptions.length}
                        </div>
                        <div className={styles.button_wrp}>
                            <button onClick={this.onPosting}
                                disabled={!this.props.auth_users.length}>
                                posted
                            </button>
                            {this.props.posts.length}
                        </div>
                        <div className={styles.button_wrp}>
                            <button>nothing</button>
                        </div>
                        <div id='posted image'>
                            <canvas id='canvas' visibility='hidden'/>
                            <img id='post' style={{ visibility: 'hidden', position: 'absolute' }}/>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

let mapStateToProps = state => {

    return {
        users: state.users,
        auth_users: state.auth_users,
        subscriptions: state.subscriptions,
        posts: state.posts,
        created_users: state.created_users,
    }
};

let mapDispatchToProps = {
    getUsers,
    authUser,
    createUser,
    posted,
    subscribed,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
