import React, { useEffect } from 'react';
import "./login.css";

function Login({ setShowLogin }) {
    useEffect(() => {
        const container = document.getElementById("container");
        const registerBtn = document.getElementById("register");
        const loginBtn = document.getElementById("login");

        const handleRegisterClick = () => {
            container.classList.add("active");
        };

        const handleLoginClick = () => {
            container.classList.remove("active");
        };

        registerBtn.addEventListener("click", handleRegisterClick);
        loginBtn.addEventListener("click", handleLoginClick);

        // Cleanup function to remove event listeners
        return () => {
            registerBtn.removeEventListener("click", handleRegisterClick);
            loginBtn.removeEventListener("click", handleLoginClick);
        };
    }, []);

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <button
                    className="close-login-modal"
                    onClick={() => setShowLogin(false)}
                >
                    &times;
                </button>

                <div className="container" id="container">
                    <div className="form-container sign-up">
                        <form>
                            <h1>Create Account</h1>
                            <div className="social-icons">
                                <a href="#" className="icon"><i className="bx bxl-google"></i></a>
                                <a href="#" className="icon"><i className="bx bxl-facebook"></i></a>
                                <a href="#" className="icon"><i className="bx bxl-github"></i></a>
                                <a href="#" className="icon"><i className="bx bxl-linkedin"></i></a>
                            </div>
                            <span>Register with E-mail</span>
                            <input type="text" placeholder="Name" />
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
                            <button>Sign Up</button>
                        </form>
                    </div>

                    <div className="form-container sign-in">
                        <form>
                            <h1>Sign In</h1>
                            <div className="social-icons">
                                <a href="#" className="icon"><i className="bx bxl-google"></i></a>
                                <a href="#" className="icon"><i className="bx bxl-facebook"></i></a>
                                <a href="#" className="icon"><i className="bx bxl-github"></i></a>
                                <a href="#" className="icon"><i className="bx bxl-linkedin"></i></a>
                            </div>
                            <span>Login With Email & Password</span>
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
                            <a href="#">Forgot Password?</a>
                            <button>Sign In</button>
                        </form>
                    </div>

                    <div className="toggle-container">
                        <div className="toggle">
                            <div className="toggle-panel toggle-left">
                                <h1>Welcome To <br />MyAuto</h1>
                                <p>Sign in with your account</p>
                                <button className="hidden" id="login">Sign In</button>
                            </div>
                            <div className="toggle-panel toggle-right">
                                <h1>Welcome to MyAuto</h1>
                                <p>Register your new account</p>
                                <button className="hidden" id="register">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;