require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Debug logging for environment variables
console.log('Environment Variables Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Present' : 'Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Present' : 'Missing');

// Log the actual values (first few characters for security)
if (process.env.SUPABASE_URL) {
  console.log('SUPABASE_URL starts with:', process.env.SUPABASE_URL.substring(0, 20) + '...');
}
if (process.env.SUPABASE_ANON_KEY) {
  console.log('SUPABASE_ANON_KEY starts with:', process.env.SUPABASE_ANON_KEY.substring(0, 10) + '...');
}

const app = express();
app.use(cors({
  origin: '*',  // For development only
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Initialize Supabase client with explicit options
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
      storage: undefined
    },
    global: {
      headers: {
        'x-my-custom-header': 'my-app-name'
      }
    }
  }
);

// Test Supabase connection with more detailed logging
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('Supabase connection test successful');
      console.log('Session data:', data);
    }
  })
  .catch(err => {
    console.error('Supabase connection test error:', err.message);
    console.error('Full error:', err);
  });

// Sign up endpoint
app.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  const { username, password, userData } = req.body;
  
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: username,
      password: password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          email: username,
          created_at: new Date().toISOString()
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      res.status(400).json({ error: authError.message });
      return;
    }

    // Then, create the user profile in the users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zip_code: userData.zipCode,
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // If profile creation fails, we should probably delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      res.status(400).json({ error: 'Failed to create user profile' });
      return;
    }

    console.log('Signup successful:', { auth: authData, profile: profileData });
    res.json({ 
      user: authData.user,
      profile: profileData,
      message: 'Please check your email for verification link'
    });
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    console.log('Attempting login with Supabase...');
    console.log('Using Supabase URL:', process.env.SUPABASE_URL);
    
    // First, check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', username)
      .single();

    if (userError) {
      console.error('Error checking user existence:', userError);
    } else {
      console.log('User found in database:', userData ? 'Yes' : 'No');
    }

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack,
        details: error.details || 'No additional details'
      });
      
      if (error.message.includes('Email not confirmed')) {
        res.status(400).json({ error: 'Please verify your email before logging in' });
      } else if (error.message.includes('Invalid login credentials')) {
        res.status(400).json({ error: 'Invalid email or password' });
      } else if (error.message.includes('Invalid API key')) {
        console.error('API Key validation failed. Current key starts with:', 
          process.env.SUPABASE_ANON_KEY.substring(0, 10) + '...');
        res.status(500).json({ error: 'Authentication service error' });
      } else {
        res.status(400).json({ error: error.message });
      }
      return;
    }

    if (!data.user) {
      console.error('No user data returned from Supabase');
      res.status(400).json({ error: 'User not found' });
      return;
    }

    console.log('Login successful, user data:', {
      id: data.user.id,
      email: data.user.email,
      email_confirmed: data.user.email_confirmed_at
    });

    // Update last sign in time
    await supabase
      .from('users')
      .update({ last_sign_in: new Date().toISOString() })
      .eq('id', data.user.id);

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    res.json({ 
      user: data.user,
      profile: profileData,
      session: data.session
    });
  } catch (error) {
    console.error('Unexpected error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user data
app.get('/user/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json(data);
});

// Force port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Supabase URL:', process.env.SUPABASE_URL ? 'Configured' : 'Missing');
  console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Configured' : 'Missing');
}); 