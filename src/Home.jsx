import React from 'react'
import supabase from './supabase/supabase';
function Home() {
    const currentUrl = window.location.host;
    console.log(currentUrl);
    
  const handleGoogleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:5173/success`,
      },
    });
    
    if (error) {
      console.error('Error logging in:', error.message);
    } else {
      console.log('Logged in user:', user);
      // Redirect or perform other actions after login
    }
};
return (
    <div>
      <h1>Faculty Login</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}

export default Home