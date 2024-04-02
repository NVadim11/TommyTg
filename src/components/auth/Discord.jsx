import { useContext, useEffect } from "react";
import { useDiscordCallbackMutation } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/contexts";

const Twitter = () => {
  const authContext = useContext(AuthContext);
  const [request] = useDiscordCallbackMutation();
  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const auth = async () => {
    try {
      const code = params.get("code");
      if (code) {
        const res = await request({
          code,
          wallet: authContext.wallet_address,
        }).unwrap();
        if (res.status === 201) {
          navigate("/", { state: { auth: true }, preventScrollReset: true });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (authContext && authContext.wallet_address) {
      auth();
    }
  }, [authContext]);
  return <>fflflff</>;
};

export default Twitter;
