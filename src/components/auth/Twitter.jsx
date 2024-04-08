import { useEffect } from "react";
import { useTwitterCallbackMutation } from "../../services/auth";
// import { useGetUserByWalletIdMutation } from "../../services/phpService";
import { useNavigate } from "react-router-dom";

const Twitter = () => {
  // const { value, setValue } = useContext(AuthContext);
  const tg = window.Telegram.WebApp;
  const [request] = useTwitterCallbackMutation();
  const params = new URLSearchParams(window.location.search);
  // const [getUser] = useGetUserByWalletIdMutation();
  const navigate = useNavigate();

  const auth = async () => {
    try {
      const twitterAuth = params.get("status");
      if (twitterAuth === "followed") {
        // const res = await request({
        //   wallet_address: value.wallet_address,
        // }).unwrap();
        // if (res.status === 201) {
        // const user = await getUser(value.wallet_address).unwrap();
        // if (user) {
        //   setValue(user);
        // }
        window.location.href = "https://twitter.com/TomoCatSol";
        // }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (tg) {
      auth();
    }
  }, [tg]);
  return <></>;
};

export default Twitter;
