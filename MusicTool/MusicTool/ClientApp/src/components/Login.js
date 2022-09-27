import React, { Component } from 'react';
import http from '../httpFetch';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: '',
            isLoading: false,       // load login/signup action
            isLogin: false,         // old user
            isSignup: false,        // new user
            showReminder: false,    // show delete account reminder box
            showReminder_DeleteProj: false,    // show delete reminder box
            showShare: false,       // show share project dialog
            // array = [{projectID, projectName}, {projectID, projectName}, ...]
            // projectList: [{ id: '1', name: 'scene1' }, { id: '2', name: 'scene2' }, { id: '3', name: 'scene3' }, { id: '4', name: 'scene4' }]
            projectList: []

        };
    }

    setEmail = (email) => {
        this.setState({ email })
    }
    setPassword = (password) => {
        this.setState({ password });
    }
    setError = (error) => {
        this.setState({ error })
    }
    setIsLoading = (isLoading) => {
        this.setState({ isLoading })
    }
    setIsLogin = (isLogin) => {
        //this.setState({ isLogin: isLogin })
        this.setState({ isLogin })
    }
    setIsSignup = (isSignup) => {
        this.setState({ isSignup })
    }
    setShowReminder = (showReminder) => {
        this.setState({ showReminder })
    }
    setShowReminder_DeleteProj = (showReminder_DeleteProj) => {
        this.setState({ showReminder_DeleteProj })
    }
    setShowShare = (showShare) => {
        this.setState({ showShare })
    }
    setProjectList = (projectList) => {
        this.setState({ projectList })
    }

    // Accept login
    login = async ({ email, password }) => {
        return http.post('/user/login', { data: { email, password } }).then((res) => {
            // console.log(res);
            return res;
        })
    }

    // load or create account in Users db
    handleLogin = async (e) => {
        e.preventDefault();
        const { isSignup, email, password, projectList } = this.state;
        this.setIsLoading(true)
        try {
            http.post(isSignup ? '/user/signup' : '/user/login', { data: { email, password } }).then((res) => {
                http.setUserId(res.userID);
                http.setUserEmail(email)
                http.setProjectList(projectList)
                //console.log(http.getUserEmail())
                //console.log(http.getUserId())

                this.setEmail(email)
                this.setPassword(password)
                this.setError('')
                this.setIsLoading(false)
                this.setIsLogin(true)
                this.setIsSignup(true)
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
 

    // delete account in Users db
    handleDelete = () => {
        const { email } = this.state;
        try {
            http.delete('/user/delete', { data: { email } }).then((res) => {
                http.setUserId(null)
                http.setUserEmail(null)
                http.setProjectList(null)

                this.setEmail(null)
                this.setPassword(null)
                this.setError('')
                this.setIsLogin(false)
                this.setIsSignup(false)
                this.setProjectList([])
                console.log('Delete successful')
            }).catch((ex) => {
                console.log('Delete not successful')
                window.location.reload()
            })
        } catch (error) {
        }
    }

    // delete project info in Application db using creationID
    handleDelete_Proj = ({id}) => {
        // get creationID
        let creationID = id
        // console.log('' + creationID)

        // delete from Access table
        // delete from Creation table
        // delete from CreationObject table
        // delete from Sequencer table

        this.setShowReminder_DeleteProj(false)
        console.log('Delete project successful')
    }

    // reminder box: ask if delete account
    handleCloseReminder = () => this.setShowReminder(false);
    handleShowReminder = () => this.setShowReminder(true);
    // reminder box: ask if delete project
    handleCloseReminder_DeleteProj = () => this.setShowReminder_DeleteProj(false);
    handleShowReminder_DeleteProj = () => this.setShowReminder_DeleteProj(true);
    // dialog: show link of project
    handleCloseShare = () => this.setShowShare(false);
    handleShowShare = () => this.setShowShare(true);

    // Get a list of projectID and projectName based on uerID from Application db
    // 1. Use UserID get CreationID from Access db_table
    // 2. Use CreationID get Name from Creation db_table
    handleProjectList = () => {
        const { projectList } = this.state;
        this.setProjectList([])
        http.get('/access/getCreationID/with_userID/' + http.getUserId()).then((res) => {
            res.map(i => {
                //console.log(i)
                // get name based on creationID
                http.get('/creations/' + i).then((res) => {
                    // console.log(res.name)
                    // add { id: 'i', name: 'name' } to projectList
                    this.addItem({ id: '' + i, name: '' + res.name })
                }).catch((ex) => {
                    console.log('Get name not successful')
                })
            })
            //console.log(res.length)
            //console.log(http.getUserId())
        }).catch((ex) => {
            console.log('Get CreationID list not successful')
        })
        // console.log(projectList)
        http.setProjectList(projectList)
    }

    // helper function that adds item to list
    addItem = (item) => {
        const { projectList } = this.state;
        this.setProjectList(
            [...projectList, item]
        )
        //console.log(projectList)
    }

    // cleanup data after logout/delete account
    handleCleanUp = () => {
        this.setIsLogin(false)
        this.setIsSignup(false)
        this.setProjectList([])
        http.setUserId(null)
        http.setUserEmail(null)
        http.setProjectList(null)
    }


    render() {
        const { isLogin, email, password, isLoading, error, showReminder, showReminder_DeleteProj, showShare, projectList } = this.state;

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
                                onClick={this.handleCleanUp}
                                className='btn btn-primary'>
                                Logout
                            </button>

                            <br></br>

                            <h5>My Projects</h5>

                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Project ID</th>
                                        <th>Project Workspace</th>
                                        <th>Share Project</th>
                                        <th>Delete Project</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    projectList.length == 0 & http.getProjectList().length != 0 ?
                                    <>
                                        {http.getProjectList().map(({ id, name }) => (
                                            <tr>
                                                <td>{name}</td>

                                                <td>{id}</td>

                                                <td><a href={"/scene/" + {id}} className="btn btn-primary">
                                                    Go to Project
                                                </a></td>

                                                <td>
                                                    <Button variant="primary" onClick={this.handleShowShare}>
                                                        My Project
                                                    </Button>

                                                    <Modal show={showShare} onHide={this.handleCloseShare}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>My Project</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Place holder for project link or something else</Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="primary" onClick={this.handleCloseShare}>
                                                                Close
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </td>

                                                <td><Button variant="danger" onClick={() => (null)}>
                                                    Delete
                                                </Button></td>
                                            </tr>))
                                        }
                                    </>
                                    :
                                    <>
                                        {projectList.map(({ id, name }) => (
                                            <tr>
                                                <td>{name}</td>

                                                <td>{id}</td>

                                                <td><a href={"/scene/" + {id}} className="btn btn-primary">
                                                    Go to Project
                                                </a></td>

                                                <td>
                                                    <Button variant="primary" onClick={this.handleShowShare}>
                                                        My Project
                                                    </Button>

                                                    <Modal show={showShare} onHide={this.handleCloseShare}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>My Project</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Place holder for project link or something else</Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="primary" onClick={this.handleCloseShare}>
                                                                Close
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </td>

                                                <td>
                                                    <Button variant="danger" onClick={() => (this.handleShowReminder_DeleteProj(), http.setIDToDelete({id}))}>
                                                    Delete
                                                    </Button>

                                                    <Modal show={showReminder_DeleteProj} onHide={this.handleCloseReminder_DeleteProj}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Warning</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Are you sure to delete your project?</Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="danger"
                                                                onClick={() => this.handleDelete_Proj(http.getIDToDelete())}>
                                                                Yes
                                                            </Button>
                                                            <Button variant="primary" onClick={() => (this.handleCloseReminder_DeleteProj(), http.setIDToDelete(null))}>
                                                                No
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </td>
                                            </tr>))
                                        }
                                        {http.setProjectList(projectList)}
                                    </>
                                }
                                </tbody>
                            </table>

                            <br></br>

                            <button
                                onClick={this.handleProjectList}
                                className='btn btn-primary'>
                                Get My Projects
                            </button>

                            <br></br>

                            <div>{/* TODO: change link*/}</div>
                            <a href="/scene/1" className="btn btn-primary">
                                Create A New Project
                            </a>

                            <br></br>

                            <Button variant="danger" onClick={this.handleShowReminder}>
                                Delete My Account
                            </Button>

                            <Modal show={showReminder} onHide={this.handleCloseReminder}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Warning</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure to delete your account?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger"
                                        onClick={() => (this.handleCloseReminder, this.handleDelete, this.handleCleanUp)}>
                                        Yes
                                    </Button>
                                    <Button variant="primary" onClick={this.handleCloseReminder}>
                                        No
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <br></br>
                            <br></br>
                        </>
                        :
                        <div className="card-body">
                            <h2 className="card-title">Music Tool</h2>

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