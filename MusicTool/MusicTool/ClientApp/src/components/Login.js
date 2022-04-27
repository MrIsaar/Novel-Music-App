import React, { Component } from 'react';

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: '',
            isLoading: false,
            isLogin: false,
            isSignin: false,

        };
    }

    setEmail = (email) => {
        this.setState({ email })
    };
    setPassword = (password) => {
        this.setState({ password });
    };
    setError = (error) => {
        this.setState({ error })
    };
    setIsLoading = (isLoading) => {
        this.setState({ isLoading })
    };
    setIsLogin = (isLogin) => {
        //this.setState({ isLogin: isLogin })
        this.setState({ isLogin })
    };
    setIsSignin = (isSignin) => {
        this.setState({ isSignin })
    };
    componentDidMount() {
        // call api
        this.setState({ aa: 12 })
    }



    // Accept login
    login = ({ email, password }) => {
        const { isSignin } = this.state;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // If new users sign in, add them to database, then login them
                if (isSignin) {
                    // TODO: Add new user to database
                }

                // TODO: Accept user based on database
                // HINT: Object.is() works better than == in ReactJS
                let isInDB = false
                if (Object.is(email, 'correctEmail@gmail.com') && Object.is(password, 'correctPassword')) {
                    isInDB = true
                }

                // login user
                if (isInDB) {
                    resolve()
                }
                else {
                    reject()
                }
            }, 1000) // rescrict 1 second running time
        })
    }

    handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        this.setIsLoading(true)
        try {
            await this.login({ email, password })

            this.setEmail(email)
            this.setPassword(password)
            this.setError('')
            this.setIsLoading(false)
            this.setIsLogin(true)

            console.log('Login successful')

            // TODO: Switch to Music Tool API window here
        } catch (error) {
            this.setEmail('')
            this.setPassword('')
            this.setError('Incorrect username or password.')
            this.setIsLoading(false)

            console.log('Cannot login')
        }
    }

    render() {
        const { isLogin, email, password, isLoading, error } = this.state;
        return (
            // use bootstrap card and form styles
            <div className="card container mt-5" >

                <div>{/*Logout and return back to Login page OR Sinin/Login to API */}</div>
                {
                    isLogin ?
                        <><h1> Welcome, {email} </h1>
                            <button onClick={() => this.setIsLogin(false)} className='btn btn-dark'> Logout </button>
                        </>
                        :
                        <div className="card-body">
                            <h2 className="card-title">Music Tool</h2>

                            <div>{/* Report Error Message */}</div>
                            {error && <h3 className='text-danger'> {error} </h3>}

                            <form onSubmit={this.handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        aria-describedby="emailHelp"
                                        value={email}
                                        onChange={e => this.setEmail(e.currentTarget.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        value={password}
                                        onChange={e => this.setPassword(e.currentTarget.value)}
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        disabled={isLoading ? true : false}
                                        type="Login"
                                        className="btn btn-block btn-dark">
                                        {isLoading ? 'Submitting' : 'Login'}
                                    </button>

                                    <button
                                        onClick={() => this.setIsSignin(true)}
                                        disabled={isLoading ? true : false}
                                        type="Sign in"
                                        className="btn btn-block btn-dark">
                                        {isLoading ? 'Submitting' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                }
            </div>
        );
    }
}