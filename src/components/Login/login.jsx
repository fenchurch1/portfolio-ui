import React, { useState } from 'react';
import styles from './Login.module.css';
import { apiClient } from '../../API/apiservises';
import APIEndpoints from '../../API/profile/APIEndpoints';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const LoginBody = {
            "username": username
        }
        if (username && password) {
            try {
                const Response = await apiClient.post(APIEndpoints.login,"", LoginBody,)
                if(Response.status){
                    onLoginSuccess?.(Response?.user);
                }
            } catch {

            }
        }
    };

    return (
        <div className={styles.MainDiv}>
            <div className={styles.wrapper}>
                <div id="logo" className={styles.logo}>
                    <h1><i>MachineSP Portfolio Managment</i></h1>
                </div>

                <section className={styles.starkLogin}>
                    <form onSubmit={handleSubmit}>
                        <div id="fade-box" className={styles.fadeBox}>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Log In</button>
                        </div>
                    </form>

                    <div className={styles.hexagons}>
                        {[...Array(60)].map((_, i) => (
                            <span key={i}>&#x2B22;</span>
                        ))}
                    </div>
                </section>

                <div id="circle1" className={styles.circle1}>
                    <div id="inner-circle1" className={styles.innerCircle1}>
                        <h2></h2>
                    </div>
                </div>

                <ul className={styles.decorativeList}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>

    );
};

export default Login;
