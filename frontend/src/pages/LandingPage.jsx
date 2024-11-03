import LoginButton from '../components/Auth/LoginButton';
import RegisterButton from '../components/Auth/RegisterButton';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Welcome to Our Platform
          </h1>
          <div className="space-x-4">
            <LoginButton />
            <RegisterButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 