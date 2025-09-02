import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Login() {
    const CLIENT_ID = "Ov23lies5emdq1zn1jga";
    const REDIRECT_URI = "http://localhost:5173/auth/callback";
    const SCOPE = "read:user user:email";

    const handleLogin = () => {
        window.location.href =
            `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-gray-900 text-white px-6 py-2 mt-4 mb-3 w-full rounded-lg shadow-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
            <GitHubLogoIcon className="w-5 h-5" />
            Login com GitHub
        </button>

    );
}
