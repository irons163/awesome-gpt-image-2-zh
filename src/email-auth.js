export async function performEmailAuth(auth, {action, email, password, token, redirect}) {
  switch (action) {
    case 'magic': return auth.signInWithOtp({email, options:{emailRedirectTo:redirect,shouldCreateUser:true}});
    case 'otp': return auth.verifyOtp({email,token,type:'email'});
    case 'password': return auth.signInWithPassword({email,password});
    case 'signup': return auth.signUp({email,password,options:{emailRedirectTo:redirect}});
    case 'reset': return auth.resetPasswordForEmail(email,{redirectTo:redirect});
    case 'update': return auth.updateUser({password});
    default: throw new Error('Unknown authentication action');
  }
}
