import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register, login } from '../api';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const BASE_URL=import.meta.env.VITE_API_BASE_URL;
const URL = `${BASE_URL?BASE_URL:''}/api/v1/auth`;

function Login() {
  const [values, setValues] = useState(initialState);
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  function validatePassword(password) {
    if (password.length < 6) {
      return false;
    }
    return true;
  }
  const handleRegister = async () => {
    const { name, email, password, isMember } = values;
    if (isMember) {
      return await login(email,password);
    }
    if (name.length<2) {
      toast.error('Name should have atleast 2 characters');
      return;
    }
    if (!validatePassword(password)) {
      toast.error('Password should have atleast 6 characters');
      return;
    }
    return await register(name, email, password);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      console.log('Please fill out all fields');
      toast.error('Please fill out all fields');
      return;
    }
    const data = await handleRegister();
    if (data.msg) {
      toast.error(data.msg);
    }
    if (data.token) {
      // After receiving the token from the server, store it in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.name);
      // Redirect the user back to the previous page
      history.replace(location.state?.from || '/');
      window.location.reload();
    }
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };
  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('username')) {
      toast.success('You are already logged in!');
      setUser(localStorage.getItem('username'));
      setTimeout(() => {
        history.replace('/');
      }, 3000);
    }
  }, []);
  return (
    <>
      {user && <h2>Already logged in as {user}</h2>}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {!user &&
        <div>
          <form className='form' onSubmit={onSubmit}>
            <h3>{values.isMember ? 'Login' : 'Register'}</h3>
            {/* name field */}
            {!values.isMember && (
              <div className='form-row'>
                <label htmlFor='name' className='form-label'>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  className='form-input'
                />
              </div>
            )}
            {/* email field */}
            <div className='form-row'>
              <label htmlFor='email' className='form-label'>
                email
              </label>
              <input
                id='email'
                type='email'
                name='email'
                value={values.email}
                onChange={handleChange}
                className='form-input'
              />
            </div>
            {/* password field */}
            <div className='form-row'>
              <label htmlFor='password' className='form-label'>
                password
              </label>
              <input
                id='password'
                type='password'
                name='password'
                value={values.password}
                onChange={handleChange}
                className='form-input'
              />
            </div>
            <button type='submit' className='btn btn-block' >
              submit
            </button>
            <p>
              {values.isMember ? 'Not a member yet?' : 'Already a member?'}
              <button type='button' onClick={toggleMember} className='btn single-mode'>
                {values.isMember ? 'Register' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      }
    </>
  );
}
export default Login;