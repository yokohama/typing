import { signIn } from 'next-auth/react';

export const GoogleSignInButton = () => {

  const googleIcon = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";

  return (
    <div>
      <button 
         onClick={() => signIn('google')}
         className="
           flex items-center justify-center
           px-2 py-2 sm:px-4
           bg-white 
           text-gray-600 
           font-bold
           shadow
           rounded-md 
           hover:bg-gray-100
      ">
         <img 
           src={googleIcon}
           alt="Google logo" 
           className="h-4 sm:h-5 w-4 sm:w-5 mr-2" 
         />
         Sign in
      </button>
    </div>
  )
}
