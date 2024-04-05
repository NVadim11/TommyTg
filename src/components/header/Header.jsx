// import { useWallet } from '@solana/wallet-adapter-react'
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from "react"
import copy from "../../img/copy.svg"
import envelope from "../../img/envelope.svg"
import link from "../../img/link.svg"
// import logo from "../../img/logo.png"
import leaderboard_icon from '../../img/leaderboard_icon.svg'
import money from "../../img/money.svg"
import people from "../../img/people-icon.svg"
import referral_icon from '../../img/referral_icon.svg'
import {
  useGenerateCodeMutation
} from "../../services/phpService"
import { toggleMuteAllSounds } from "../../utility/Audio"
import { useClickCount } from '../clickContext'
import { AuthContext } from '../helper/contexts'
import "./Header.scss"

function Header() {
  const {value} = useContext(AuthContext);
  // const { connected, publicKey } = useWallet();
  const [isToggled, setIsToggled] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [totalPoints, setTotalPoints] = useState(null);
  const [totalReferrals, setTotalReferrals] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [isElementPresent, setIsElementPresent] = useState(false);
  const initLeadersRef = useRef(null);
  // const wallet_address = publicKey?.toBase58();

  const popupClsTgl = isLeaderboardOpen ? "popupLeaderboard_show" : null;
  const popupClasses = `popupLeaderboard ${popupClsTgl}`;

  const popupInvTgl = isInviteOpen ? "popupInvite_show" : null;
  const popupInvite = `popupInvite ${popupInvTgl}`;

  const { clickCount } = useClickCount();
  const [inviteAlreadySent, setInviteAlreadySent] = useState(false);

  // const containerRef = useRef(null);
  // const [getLeaderboard] = useGetLeaderboardMutation();

  // const connectSubmitHandler = async () => {
  //   try {
  //     const response = await axios.post(
  //       'https://admin.prodtest1.space/api/users',
  //       {
  //         wallet_address: wallet_address,
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  //     if (response.status !== 201) {
  //       throw new Error('Failed to submit data');
  //     }
  //     console.log('Data submitted successfully');
  //   } catch (error) {
  //     console.error('Error submitting data:', error.message);
  //   }
  // };
  // useEffect(() => {
  //   if (connected === true) {
  //     connectSubmitHandler();
  //   }
  // }, [connected]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const targetElement = document.getElementById("header__totalScore");
          if (targetElement) {
            setIsElementPresent(true);
          }
        } else if (
          mutation.type === "childList" &&
          mutation.removedNodes.length > 0
        ) {
          const targetElement = document.getElementById("header__totalScore");
          if (!targetElement) {
            setIsElementPresent(false);
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const toggleVisibilitySound = () => {
    toggleMuteAllSounds();
    setIsVisible(!isVisible);
  };

  const fetchTotalPoints = async () => {
    try {
      const response = await axios.get(`https://admin.prodtest1.space/api/telegram-id/111222333`); //telegram-id/<TG_ID>
      setTotalPoints(response.data?.wallet_balance);
      // setTotalReferrals(response.data?.referral_balance);
    } catch (error) {
      console.error('Error fetching total points:', error.message);
    }    
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get(`https://admin.prodtest1.space/api/liders`);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error.message);
    }
  };

  useEffect(() => {
      fetchLeaderboardData();
      fetchTotalPoints();
      initLeadersRef.current = setInterval(() => {
        fetchLeaderboardData();
        fetchTotalPoints();
      }, 10000); 
    return () => {
      clearInterval(initLeadersRef.current);
    };
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (Object.keys(value).length) {
  //       const res = await getLeaderboard(value.wallet_address).unwrap();
  //       setLeaderboardData(res);
  //       fetchTotalPoints();    
  //       console.log("fetched connected DB")
  //       const intervalId = setInterval(() => {
  //         fetchTotalPoints();    
  //         getLeaderboard(value.wallet_address)
  //           .unwrap()
  //           .then((data) => setLeaderboardData(data))
  //           .catch((error) => console.error('Error refreshing leaderboard:', error));
  //           console.log("fetched connected DB with interval")
  //       }, 10000);
  //       return intervalId;
  //     }
  //   };

  //   let intervalId;

  //   if (connected) {
  //     fetchData().then((id) => {
  //       intervalId = id;
  //     });
  //   }

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [value, connected]);

  // useEffect(() => {
  //   if (!connected) {
  //     setTotalPoints(null);
  //   }
  // }, [connected]);

  const toggleVisibility = () => {
    setIsShown(!isShown);
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest(".header__mobileBurger")) return;
      setIsShown(false);
      setIsToggled(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const leaderBordBtn = () => {
    setLeaderboardOpen(true);
    fadeShow();
    setIsShown(false);
  };

  const inviteCloseToggler = () => {
    setInviteOpen(false);
    const htmlTag = document.getElementById("html");
    if (htmlTag) htmlTag.classList.remove("popupInvite-show");
  };

  const inviteFriendsBtn = () => {
    setInviteOpen(true);
    fadeShowInvite();
    setIsShown(false);  
  }

  useEffect(() => {
    if (clickCount >= 100 && !inviteAlreadySent) {
      setInviteAlreadySent(true);
      setTimeout(() => {
        inviteFriendsBtn();
      }, 5000);
    }
  }, [clickCount, inviteAlreadySent]);

  const fadeShow = () => {
    const htmlTag = document.getElementById("html");
    if (htmlTag) htmlTag.classList.add("popupLeaderboard-show");
  };

  const fadeShowInvite = () => {
    const htmlTag = document.getElementById("html");
    if (htmlTag) htmlTag.classList.add("popupInvite-show");
  };

  const leaderboardCloseToggler = () => {
    setLeaderboardOpen(false);
    const htmlTag = document.getElementById("html");
    if (htmlTag) htmlTag.classList.remove("popupLeaderboard-show");
  };

  const [code, setCode] = useState("");
  const [generateCode] = useGenerateCodeMutation();

  useEffect(() => {
    if (value && value.referral_code) {
      setCode(value.referral_code);
    }
  }, [value]);

  const copyLink = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(`${window.location.href}${code}`);
    } else {
      return document.execCommand('copy', true, `${window.location.href}${code}`);
    }
  }

  const generateCodeCallback = async () => {
    try {
      if(value.wallet_address){
        const res = await generateCode(value.wallet_address).unwrap();
        res && res.code && setCode(res.code);
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <header className="header">
        <div className="header__container">
          {/* <div className="header__logo">
            <a href="#">
              <img src={logo} alt={logo} />
            </a>
          </div> */}
          <div className="header__mobileBtns">
            {/* {value && totalPoints !== null && (
              <div id="header__totalScore" className="header__totalScore">
                Total Points: <span>{totalPoints}</span>
              </div>
            )} */}
            <div className="header__leaderboard">
            <button onClick={leaderBordBtn}>Leaderboard<img src={leaderboard_icon}/></button>
          </div>
            <div className="soundToggler">
              {isVisible ? (
                <div
                  className="soundToggler__itemOn"
                  onClick={toggleVisibilitySound}
                >
                  <button>
                    <svg
                      width="23"
                      height="19"
                      viewBox="0 0 23 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.697 4.80667C19.697 4.80667 21.2996 6.37109 21.2996 8.97844C21.2996 11.5858 19.697 13.1502 19.697 13.1502"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 11.4367V7.56325C1 7.01003 1.22512 6.47948 1.62584 6.0883C2.02656 5.69712 2.57006 5.47736 3.13676 5.47736H6.23507C6.44396 5.47731 6.64825 5.41748 6.82267 5.30527L13.233 1.17939C13.394 1.07585 13.5808 1.01679 13.7735 1.00849C13.9661 1.00019 14.1575 1.04295 14.3273 1.13223C14.497 1.22152 14.6389 1.354 14.7378 1.51563C14.8367 1.67725 14.8889 1.86199 14.8889 2.05025V16.9497C14.8889 17.138 14.8367 17.3227 14.7378 17.4844C14.6389 17.646 14.497 17.7785 14.3273 17.8677C14.1575 17.957 13.9661 17.9998 13.7735 17.9915C13.5808 17.9832 13.394 17.9241 13.233 17.8206L6.82267 13.6947C6.64825 13.5825 6.44396 13.5227 6.23507 13.5226H3.13676C2.57006 13.5226 2.02656 13.3029 1.62584 12.9117C1.22512 12.5205 1 11.9899 1 11.4367Z"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  className="soundToggler__itemOff"
                  onClick={toggleVisibilitySound}
                >
                  <button>
                    <svg
                      width="26"
                      height="19"
                      viewBox="0 0 26 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1947 11.5865L22.2812 9.50001M22.2812 9.50001L24.3677 7.41351M22.2812 9.50001L20.1947 7.41351M22.2812 9.50001L24.3677 11.5865"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.6322 11.4373V7.56269C1.6322 7.00932 1.85203 6.47861 2.24332 6.08732C2.63462 5.69602 3.16533 5.4762 3.7187 5.4762H6.74412C6.9481 5.47614 7.14758 5.4163 7.31791 5.30406L13.5774 1.17697C13.7347 1.0734 13.917 1.01432 14.1052 1.00602C14.2933 0.997715 14.4802 1.04049 14.646 1.1298C14.8118 1.21911 14.9503 1.35163 15.0468 1.5133C15.1434 1.67497 15.1944 1.85977 15.1944 2.04808V16.9519C15.1944 17.1402 15.1434 17.325 15.0468 17.4867C14.9503 17.6484 14.8118 17.7809 14.646 17.8702C14.4802 17.9595 14.2933 18.0023 14.1052 17.994C13.917 17.9857 13.7347 17.9266 13.5774 17.823L7.31791 13.6959C7.14758 13.5837 6.9481 13.5239 6.74412 13.5238H3.7187C3.16533 13.5238 2.63462 13.304 2.24332 12.9127C1.85203 12.5214 1.6322 11.9907 1.6322 11.4373Z"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
              <div className="header__inviteBtn">
               <button onClick={inviteFriendsBtn}>
                 Referral<img src={referral_icon}/>
               </button>
              </div>
          </div>
        </div>
      </header>
      {isLeaderboardOpen && (
        <div id="leaderboard" aria-hidden="true" className={popupClasses}>
          <div className="popupLeaderboard__wrapper">
            <div className="popupLeaderboard__content">
              <button
                onClick={leaderboardCloseToggler}
                type="button"
                className="popupLeaderboard__close"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 9.5L2 2M9.5 9.5L17 17M9.5 9.5L17 2M9.5 9.5L2 17"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="popupLeaderboard__title">
                <h4>Leaderboard</h4>
              </div>
              <div className="popupLeaderboard__crownIcon">
                <svg
                  width="39"
                  height="30"
                  viewBox="0 0 39 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M38.4225 8.61694C38.174 8.39826 37.8666 8.25901 37.5394 8.21688C37.2122 8.17474 36.88 8.23161 36.585 8.38028L28.0134 12.6902L20.9292 0.815487C20.7806 0.566685 20.5707 0.360855 20.32 0.21797C20.0692 0.0750856 19.7861 0 19.4981 0C19.2101 0 18.927 0.0750856 18.6763 0.21797C18.4255 0.360855 18.2157 0.566685 18.067 0.815487L10.9828 12.6902L2.41456 8.38195C2.11957 8.23341 1.78756 8.17631 1.46042 8.21787C1.13329 8.25944 0.825693 8.39779 0.576441 8.61547C0.327189 8.83316 0.147451 9.12043 0.0599063 9.44103C-0.0276385 9.76163 -0.0190678 10.1012 0.0845371 10.4169L6.19879 29.3097C6.24484 29.4523 6.32209 29.5826 6.42484 29.691C6.52759 29.7994 6.6532 29.8831 6.79236 29.9359C6.93153 29.9888 7.08069 30.0093 7.22881 29.9961C7.37693 29.9829 7.5202 29.9363 7.64803 29.8597C7.6596 29.8597 8.73207 29.2197 10.7217 28.5964C12.5576 28.0197 15.5668 27.3331 19.4981 27.3331C23.4294 27.3331 26.4386 28.0197 28.2762 28.5964C30.2592 29.2197 31.3383 29.853 31.3465 29.858C31.4743 29.935 31.6176 29.9819 31.7659 29.9954C31.9141 30.0089 32.0634 29.9885 32.2028 29.9359C32.3421 29.8832 32.4679 29.7996 32.5709 29.6912C32.6738 29.5828 32.7513 29.4524 32.7974 29.3097L38.9117 10.4202C39.0183 10.1048 39.0286 9.76434 38.9414 9.44289C38.8542 9.12145 38.6735 8.83374 38.4225 8.61694ZM31.2689 27.5881C29.4511 26.7681 25.419 25.3331 19.4981 25.3331C13.5772 25.3331 9.5451 26.7681 7.72735 27.5881L2.19974 10.5086L10.3548 14.6084C10.7313 14.7956 11.1636 14.8338 11.5667 14.7157C11.9697 14.5976 12.3144 14.3316 12.5328 13.9701L19.4981 2.30378L26.4634 13.9785C26.6818 14.3395 27.0261 14.6052 27.4288 14.7233C27.8315 14.8414 28.2634 14.8034 28.6397 14.6168L36.7965 10.5152L31.2689 27.5881Z"
                    fill="#FFF500"
                  />
                </svg>
              </div>
              <div className="popupLeaderboard__playerList">
                <ul className="popupLeaderboard__table">
                  {leaderboardData.map((player, index) => (
                    <li className="popupLeaderboard__tableItem" key={index}>
                      <div className="popupLeaderboard__itemData">
                        <div className="popupLeaderboard__id">
                          <span>{player.position}</span>
                        </div>
                        <div className="popupLeaderboard__playerName">
                          <span>
                            {player.wallet_address.slice(0, 4) +
                              ".." +
                              player.wallet_address.slice(-4)}
                          </span>
                        </div>
                        <div className="popupLeaderboard__coins">
                          <span>{player.wallet_balance}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
        {isInviteOpen && (
          <div id="popupInvite" aria-hidden="true" className={popupInvite}>
          <div className="popupInvite__wrapper">
            <div className="popupInvite__content">
              <button onClick={inviteCloseToggler} type="button" className="popupInvite__close"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 9.5L2 2M9.5 9.5L17 17M9.5 9.5L17 2M9.5 9.5L2 17"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h3>
                Invite friends. 
                <br />
                Get rewards together.
              </h3>
              <div className="popupInvite__header">
                <h6>
                  How it Works
                </h6>
                <div className="popupInvite__refInfo">
                <div className="popupInvite__headerDescr">
                  <h6>
                    Your Bonus:
                  </h6>
                  <div className="popupInvite__headerItem">
                    <h3>%</h3>
                      <h3>10</h3>
                  </div>
                </div>
                {totalReferrals >= 1 && (
                    <div className="popupInvite__headerDescr">
                    <h6>
                      Referred Friends:
                    </h6>
                    <div className="popupInvite__headerItem">
                      <img src={people} alt="people"/>
                        <h3>{totalReferrals}</h3>
                    </div>
                  </div>
                )}
                </div>
              </div>
              <div className="popupInvite__grid">
                <div className="popupInvite__gridItem">
                  <ul className="popupInvite__list">
                    <li className="popupInvite__list-item">
                      <img src={envelope} alt="" className="popupInvite__icon" />
                      <div className="popupInvite__list-itemDescr">
                        <h5>Sign up</h5>
                        <p>Get your referral link and code</p>
                      </div>
                    </li>
                    <li className="popupInvite__list-item">
                      <img src={link} alt="" className="popupInvite__icon" />
                      <div className="popupInvite__list-itemDescr">
                        <h5>Invite</h5>
                        <p>Friends via the referral link</p>
                      </div>
                    </li>
                    <li className="popupInvite__list-item">
                      <img src={money} alt="" className="popupInvite__icon" />
                      <div className="popupInvite__list-itemDescr">
                        <h5>Get rewards</h5>
                        <p>Receive up to 2k$ for your friends' staking CRO</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="popupInvite__gridItem">
                  <div className="popupInvite__item-box">
                    <div className="popupInvite__item-group">
                      <p>Your link</p>
                      <p className="popupInvite__input">
                        {code.length ? `${(window.location.href).slice(8,(window.location.href).length)}${code}` : "link"}
                        <button onClick={() => copyLink()} className="popupInvite__input-btn">
                            <img src={copy} alt=""/>
                            {/* <span></span> */}
                        </button>
                      </p>
                    </div>
                    <div className="popupInvite__item-group">
                      <button className="popupInvite__submit" onClick={generateCodeCallback}>
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      }
    </>
  );
}

export default Header;
