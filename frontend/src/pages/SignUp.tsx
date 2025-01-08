import { Alert, Button, Label, Spinner, TextInput, Select } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  contact: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    contact: ''
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.contact) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Hospital Food
            </span>
          </Link>
          <p className='text-sm mt-5'>
            Sign up to manage hospital food services. Create an account with your work email 
            or use Google sign-in.
          </p>
        </div>

        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your full name' />
              <TextInput
                type='text'
                placeholder='John Doe'
                id='name'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@hospital.com'
                id='email'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Contact number' />
              <TextInput
                type='tel'
                placeholder='Your contact number'
                id='contact'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Select your role' />
              <Select
                id='role'
                onChange={handleChange}
                required
              >
                <option value=''>Select a role</option>
                <option value='manager'>Hospital Manager</option>
                <option value='pantry'>Pantry Staff</option>
                <option value='delivery'>Delivery Staff</option>
              </Select>
            </div>

            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
           
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Already have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>

          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}