import React from 'react';
import {connect} from 'react-redux';
import styles from './App.css';
import {getRandomItems, getRandomItemNumber} from './utils';
import {profileApi} from './api/api';
import * as templates from './templates/templates';
import {getUsers, authUser, createUser, posted, subscribed, likedPost, updateProfile} from './appReducer';

const posts = require.context('./images/posts', true,); //\.png|.jpeg|.jpg$
const avatars = require.context('./images/avatars', true,); //\.png|.jpeg|.jpg$

const postsObjArray = posts.keys()
    .map(key => ({
        path: key,
        file: posts(key),
    })
    );
console.log('postsObjArray length = ' + postsObjArray.length);

const avatarsObjArray = avatars.keys()
    .map(key => ({
        path: key,
        file: avatars(key),
    })
    );
console.log('postsObjArray length = ' + avatars.length);

const password = '111111';

class App extends React.Component {

    onSetUsers = () => {
        this.props.getUsers();
    }

    onSignIn = async () => {

        for(let user of this.props.users){
            await this.props.authUser({email: user.email, password: '111111'});
        }

        console.log('AUTHORIZE ACCESS!!!!!!!!');

        //await this.props.authUsers(this.props.users, '111111');

    }

    onCreateAcks = async () => {

        let options_arr = [];
        for(let i = 0; i < 50; i++){
            let first_name = getRandomItemNumber(templates.first_names);
            let last_name = getRandomItemNumber(templates.last_names);
            let email = `${first_name}.${last_name}@gmail.com`.toLowerCase();
            let options = { first_name, last_name, password, email, };

            options_arr.push(options);
        };

        for(let options of options_arr){
            await this.props.createUser(options);
        };
        console.log(`CREATE ${1000} ACKS SUCCESS!`);
    };

    onSubscription = async () => {

        let users = this.props.auth_users;
        for(let user of users) {

            let target_users = getRandomItems(this.props.users);
            for(let target_user of target_users) {

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
        for(let user of users){

            let posts = getRandomItems(postsObjArray, 1);
            for(let post of posts){

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
                let text = getRandomItems(templates.text.split(' '), 20).join(' ');
                debugger;
                fd.append('text',  text);
                fd.append('image', blob, 'image.png');

                let options = {
                    id: user.id, 
                    token: user.token,
                    post: fd,
                };
                await this.props.posted(options);
                console.log(`User ${user.id}  added post ${post.file}`);
            };
        };

    }

    onUpdatingInfo = async () => {
        let img = document.getElementById('avatar');
        let canvas = document.createElement('canvas');

        let users = this.props.auth_users;
        for(let user of users){

            let avatar = getRandomItemNumber(avatarsObjArray, 1);

            await new Promise( resolve => {
                img.src = avatar.file;
                setTimeout(() => {
                    // создаём <canvas> того же размера
                    resolve();
                }, 150);
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
            let phone = '+380956098733',
                address = 'Lviv',
                age = 25;

            //
            if(phone)
                fd.append('phone', phone);
            if(address)
                fd.append('address', address);
            if(age)
                fd.append('age', age);
            fd.append('image', blob, 'image.png');

            debugger;

            let options = {
                id: user.id, 
                token: user.token,
                formData: fd,
            };
            await this.props.updateProfile(options);
            console.log(`User ${user.id}  added post ${avatar.file}`);
        };

    }

    onLiking = async () => {
        for(let user of this.props.auth_users){
            let target_users = getRandomItems(this.props.users);
            for(let target_user of target_users){
                let target_posts = await profileApi.getPosts({user_id: target_user.id});
                target_posts = target_posts.posts;
                target_posts = getRandomItems(target_posts, 50);
                for(let post of target_posts){
                    let options = {
                        id: user.id,
                        token: user.token,
                        user_id: target_user.id,
                        post_id: post.id,
                    };
                    await this.props.likedPost(options);
                };
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
                            <button onClick={this.onUpdatingInfo}
                                disabled={!this.props.auth_users.length}>
                               change info 
                            </button>
                            {this.props.update_info.length}
                        </div>

                        <div className={styles.button_wrp}>
                            <button onClick={this.onLiking}
                                disabled={!this.props.auth_users.length}>
                                liking
                            </button>
                            {this.props.likes.length}
                        </div>
                        <div id='posted image'>
                            <canvas id='canvas' visibility='hidden'/>
                            <img id='post' style={{ visibility: 'hidden', position: 'absolute' }}/>
                        </div>
                        <div id='update info'>
                            <canvas id='canvas_avatar' 
                                style={{
                                    visibility: 'hidden',
                                    position: 'absolute' }}
                            />
                                    <img id='avatar'
                                        style={{
                                            visibility: 'hidden',
                                            position: 'absolute' }}
                                    />
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
        likes: state.likes,
        update_info: state.update_info,
    }
};

let mapDispatchToProps = {
    getUsers,
    authUser,
    createUser,
    posted,
    subscribed,
    likedPost,
    updateProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
