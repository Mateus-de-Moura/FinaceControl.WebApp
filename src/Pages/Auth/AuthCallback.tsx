import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Api from "@/Api";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      Api.post("/Auth/LoginGithub", { code })
        .then((res) => {
          const data = res.data;
          localStorage.setItem("loginData", JSON.stringify(data.value));
          navigate("/home");
        })
        .catch((err) => {
          console.error("Erro na chamada ao backend:", err);       
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
}
