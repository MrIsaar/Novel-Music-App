import React, { Component } from 'react';
import http from '../httpFetch';

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: '',
            isLoading: false,
            isLogin: false,
            isSignup: false,

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
    setIsSignup = (isSignup) => {
        this.setState({ isSignup })
    };
    componentDidMount() {
        // call api
        this.setState({ aa: 12 })
    }



    // Accept login
    login = async ({ email, password }) => {
        // const { isSignup } = this.state;
        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         // If new users sign in, add them to database, then login them
        //         if (isSignup) {
        //             // TODO: Add new user to database
        //         }

        //         // TODO: Accept user based on database
        //         // HINT: Object.is() works better than == in ReactJS
        //         let isInDB = false
        //         if (Object.is(email, 'correctEmail@gmail.com') && Object.is(password, 'correctPassword')) {
        //             isInDB = true
        //         }

        //         // login user
        //         if (isInDB) {
        //             resolve()
        //         }
        //         else {
        //             reject()
        //         }
        //     }, 1000) // rescrict 1 second running time
        // })
        // const { email, password } = this.state;
        // http.get('/user/').then((res) => {
        //     console.log(res);
        // })
        return http.post('/user/login', { data: { email, password } }).then((res) => {
            // console.log(res);
            return res;
        })
    }

    handleLogin = async (e) => {
        e.preventDefault();
        const { isSignup, email, password } = this.state;
        this.setIsLoading(true)
        try {
            /*if (http.getUserId() != null & http.getUserEmail() != null) {
                this.setEmail(http.getUserEmail())
                this.setIsLogin(true)
            }*/

            http.post(isSignup ? '/user/signup' : '/user/login', { data: { email, password } }).then((res) => {
                //console.log('res:', res);
                // res.userID
                // sessionStorage.setItem('userId', res.userID);
                http.setUserId(res.userID);
                http.setUserEmail(email)
                //console.log(http.getUserEmail())
                //console.log(http.getUserId())

                this.setEmail(email)
                this.setPassword(password)
                this.setError('')
                this.setIsLoading(false)
                this.setIsLogin(true)
                console.log('Login successful')
            }).catch((ex) => {
                // console.log('ex:', ex);
                console.log('Login not successful')
                window.location.reload()
            })
        } catch (error) {
            this.setEmail('')
            this.setPassword('')
            this.setError('Incorrect username or password.')
            this.setIsLoading(false)

            console.log('Cannot login')
        }
    }

    delete = () => {
        const { email } = this.state;
        try {
            http.delete('/user/delete', { data: { email } }).then((res) => {
                http.setUserId(null);
                http.setUserEmail(null)

                this.setEmail(null)
                this.setPassword(null)
                this.setError('')
                this.setIsLogin(false)
                this.setIsSignup(false)
                console.log('Delete successful')
            }).catch((ex) => {
                console.log('Delete not successful')
                window.location.reload()
            })
        } catch (error) {
        }
    }

    render() {
        const { isLogin, email, password, isLoading, error } = this.state;
        return (
            // use bootstrap card and form styles
            <div className="card container mt-5" >

                <div>{/*Logout and return back to Login page OR Sinin/Logup to API */}</div>
                {
                    isLogin || (http.getUserId() != null & http.getUserEmail() != null) ?
                        <>
                            <br></br>

                            <h3> Welcome, {http.getUserEmail()} </h3>
                            <button
                                onClick={() => (this.delete, this.setIsLogin(false), this.setIsSignup(false), http.setUserId(null), http.setUserEmail(null))}
                                className='btn btn-dark'>
                                Logout
                            </button>

                            <br></br>

                            <h5>My Projects</h5>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Project ID</th>
                                        <th>Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Scene1</td>
                                        <td>000001</td>
                                        <td>www</td>
                                    </tr>
                                    <tr>
                                        <td>Scene2</td>
                                        <td>000002</td>
                                        <td>www</td>
                                    </tr>
                                </tbody>
                            </table>

                            <br></br>

                            <div>{/* TODO: change link based on new project ID ? */}</div>
                            <a href="/scene/1" className="btn btn-dark">Create A New Project</a>

                            <br></br>

                            <button
                                onClick={() => (this.delete(), this.setIsLogin(false), this.setIsSignup(false), http.setUserId(null), http.setUserEmail(null))}
                                className='btn btn-block btn-dark'>
                                Delete My Account
                            </button>

                            <br></br>
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
                                        onClick={() => this.setIsSignup(true)}
                                        disabled={isLoading ? true : false}
                                        type="Sign up"
                                        className="btn btn-block btn-dark">
                                        {isLoading ? 'Submitting' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>
                        </div>
                }
            </div>
        );
    }
}