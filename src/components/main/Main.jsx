import { motion } from "framer-motion"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useMediaQuery } from 'react-responsive'
import sadIdle from '../../img/1_idle.gif'
import sadSpeak from '../../img/1talk.gif'
import normalIdle from '../../img/2_idle.gif'
import normalSpeak from '../../img/2talk.gif'
import smileIdle from '../../img/3_idle.gif'
import smileSpeak from '../../img/3talk.gif'
import happyIdle from '../../img/4_idle.gif'
import happySpeak from '../../img/4talk.gif'
import boostCoin from '../../img/boost_coin_side.png'
import catFace from '../../img/catFace.png'
import catCoinMove from '../../img/cat_coin_move.png'
import finalForm from '../../img/finalForm.gif'
import goldForm from '../../img/gold.gif'
import smile from '../../img/smile.png'
import { playBoostCatClick, playSadCatClick } from '../../utility/Audio'
import { useClickCount } from '../clickContext'
import { AuthContext } from '../helper/contexts'
import './Main.scss'

function Main() {
    const isMobile = useMediaQuery({ maxWidth: '1439.98px' });
    const {value} = useContext(AuthContext);
    const [idleState, setidleState] = useState(true);
    const [currentImage, setCurrentImage] = useState(true);
    const [coinState, setCoinState] = useState(false);
    const [currCoins, setCurrCoins] = useState(0);
    const [currEnergy, setCurrEnergy] = useState(0);
    const [isCoinsChanged, setIsCoinsChanged] = useState(false);
    const [catIdle, setCatIdle] = useState(sadIdle);
    const [catSpeak, setCatSpeak] = useState(sadSpeak);
    const timeoutRef = useRef(null);
    const coinRef = useRef(null);
    const accumulatedCoinsRef = useRef(0);
    // const { publicKey, connected } = useWallet();
    // const wallet_address = publicKey?.toBase58();
    // const location = useLocation();
    // const formRef = useRef(null);

    const [position, setPosition] = useState({ x: '50%', y: '50%' });   
    const [boostPhase, setBoostPhase] = useState(false);
    const [visible, setVisible] = useState(false);    

    let [happinessVal, setHappinessVal] = useState(1)
    let [clickNewCoins, setClickNewCoins] = useState(1)    

    const [gamePaused, setGamePaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [walletAddress, setWalletAddress] = useState('');
    const [coins, setCoins] = useState('');

  //   const handleSubmit = async (event) => {
  //     event.preventDefault(); // Prevent default form submission behavior

  //     try {
  //         const response = await axios.post('https://admin.prodtest1.space/api/update-balance', {
  //             score: coins,
  //             wallet_address: walletAddress
  //         });

  //         console.log('Coins submitted successfully:', response.data);
  //     } catch (error) {
  //         console.error('Error submitting coins:', error);
  //     }
  // };

    // const pauseGame = () => {
    //   const currentTimeStamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    //   const futureTimestamp = currentTimeStamp + (30 * 60); // 30 minutes from now
    //   // const futureTimestamp = currentTimeStamp + (Math.random() * (2 * 60 * 60 - 30 * 60) + 30 * 60); // Random between 30 minutes and 2 hours
  
    //   fetch('https://admin.prodtest1.space/api/set-activity', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       wallet_address: wallet_address,
    //       timestamp: futureTimestamp,
    //     }),
    //   })
    //   .then(response => {
    //     if (response.ok) {
    //       setGamePaused(true);
    //     } else {
    //       console.error('Failed to pause game');
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error pausing game:', error);
    //   });
    // };

    // useEffect(() => {
    //   if (currEnergy === 1000) {
    //     const timeoutId = setTimeout(() => {
    //       pauseGame();
    //       setGamePaused(true);
    //       setVisible(false);
    //       setCurrEnergy(0);
    //     }, 10000);
    //     return () => {
    //       clearTimeout(timeoutId);
    //     };
    //   }
    // }, [currEnergy]);

  // useEffect(() => {
  //   const checkGameStatus = () => {
  //     fetch(`https://admin.prodtest1.space/api/users/${wallet_address}`)
  //       .then(response => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           throw new Error('Failed to fetch game status');
  //         }
  //       })
  //       .then(data => {
  //         const currentTimeStamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  //         const remainingTime = data.active_at - currentTimeStamp;
  //         if (remainingTime <= 0) {
  //           setGamePaused(false);
  //           setTimeRemaining(0);
  //         } else {
  //           setGamePaused(true);
  //           setTimeRemaining(remainingTime);
  //         }
  //       })
  //       .catch(error => {
  //         console.error('Error checking game status:', error);
  //       });
  //   };
  //   checkGameStatus();

  //   const timer = setInterval(() => {
  //     checkGameStatus();
  //   }, 10000);

  //   return () => clearInterval(timer);
  // }, [connected]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}`;
  };

    let catIdleImage = catIdle;
    let catSpeakImage = catSpeak;

    const { incrementClickCount } = useClickCount();

    const handleCoinClick = () => {
      incrementClickCount();
    };

    // const connectSubmitHandler = async () => {
    //     try {
    //       const response = await axios.post(
    //         'https://admin.prodtest1.space/api/users',
    //         {
    //           wallet_address: wallet_address,
    //         },
    //         {
    //           headers: {
    //             'Content-Type': 'application/json',
    //           }
    //         }
    //       );
    //       if (response.status !== 201) {
    //         throw new Error('Failed to submit data');
    //       }
    //       console.log('Data submitted successfully');
    //     } catch (error) {
    //       console.error('Error submitting data:', error.message);
    //     }
    //   };
    //   useEffect(() => {
    //     if (connected === true) {
    //       connectSubmitHandler();
    //     }
    //   }, [connected]);

      const boostClickedHandler = () => {
        handleBoostClick();
    };

    const handleBoostClick = () => {
      const prevHappinessVal = happinessVal;
      const prevClickNewCoins = clickNewCoins;
  
      setBoostPhase(true);
      setVisible(false);
      setHappinessVal(2);
      setClickNewCoins(6);
  
      setTimeout(() => {
          setHappinessVal(prevHappinessVal);
          setClickNewCoins(prevClickNewCoins);
          setBoostPhase(false);
          setVisible(true);
      }, 10000);
  };

const randomizePosition = () => {
    const elementWidth = 850;
    const elementHeight = 850;
    const maxX = Math.max(0, window.innerWidth - elementWidth);
    const maxY = Math.max(0, window.innerHeight - elementHeight);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    setPosition({ x, y });
};

useEffect(() => {
  if (!gamePaused) {
      if (!visible) {
        randomizePosition();
          const showBoostTimeout = setTimeout(() => {
              randomizePosition();
              setVisible(true);
          }, Math.random() * (60000 - 15000) + 15000); 

          return () => clearTimeout(showBoostTimeout);
      } else {
          const hideBoostTimeout = setTimeout(() => {
              setVisible(false);
          }, 8300);

          return () => clearTimeout(hideBoostTimeout);
      }
  }
}, [visible, gamePaused]);

    const [bgImages] = useState({
        bgImageFirst: 'img/bgFirst.webp',
        bgImageSecond: 'img/bgSecond.webp',
        bgImageThird: 'img/bgThird.webp',
        bgImageFourth: 'img/bgFourth.webp',
        bgImageFives: 'img/bgFives.webp'
      });
    
    let activeImage = bgImages.bgImageFirst;
    let opacityFirst = 0;
    let opacitySecond = 0;
    let opacityThird = 0;
    let opacityFourth = 0;
    let opacityFives = 0;


      if (currEnergy >= 0 && currEnergy <= 250) {
        activeImage = bgImages.bgImageFirst;
        opacityFirst = 1;
      } else if (currEnergy >= 251 && currEnergy <= 500) {
        activeImage = bgImages.bgImageSecond;
        opacitySecond = 1;
      } else if (currEnergy >= 501 && currEnergy <= 750) {
        activeImage = bgImages.bgImageThird;
        opacityThird = 1;
      } else if (currEnergy >= 751 && currEnergy <= 990) {
        activeImage = bgImages.bgImageFourth;
        opacityFourth = 1;
      } else if (currEnergy >= 991 && currEnergy <= 1000) {
        activeImage = bgImages.bgImageFives;
        opacityFives = 1;
      }

    // const executeScroll = () => formRef.current.scrollIntoView();

    useEffect(() => {
        if (currEnergy <= 0) {
            setCurrEnergy(0);
        }
    }, [currEnergy]); 

    const updateCurrCoins = () => {  
        if (currEnergy >= 0 && currEnergy <= 250) {
            catIdleImage = sadIdle;
            catSpeakImage = sadSpeak;
        } else if (currEnergy >= 251 && currEnergy <= 500) {
            catIdleImage = normalIdle;
            catSpeakImage = normalSpeak;
        } else if (currEnergy >= 501 && currEnergy <= 750) {
            catIdleImage = smileIdle;
            catSpeakImage = smileSpeak;
        } else if (currEnergy >= 751 && currEnergy <= 990) {
            catIdleImage = happyIdle;
            catSpeakImage = happySpeak;
        } else if (currEnergy >= 991 && currEnergy <= 1000) {
            catIdleImage = happyIdle;
            catSpeakImage = finalForm;
        } 
        setCatIdle(catIdleImage);
        setCatSpeak(catSpeakImage);
        setIsCoinsChanged(true);
        return clickNewCoins;
    };

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         if (isCoinsChanged) {
    //             submitData(accumulatedCoinsRef.current);
    //             setIsCoinsChanged(false);
    //             accumulatedCoinsRef.current = 0;
    //         }
    //     }, 4900);
    
    //     return () => clearInterval(timer);
    // }, [isCoinsChanged]);

    // const submitData = async (coins) => {
    //     try {
    //         const response = await axios.post('https://admin.prodtest1.space/api/update-balance', {
    //             score: coins,
    //             wallet_address: wallet_address
    //         });
    
    //         console.log('Coins submitted successfully:', response.data);
    //     } catch (error) {
    //         console.error('Error submitting coins:', error);
    //     }
    // //     if (id_telegram !== null) {
    // //       try {
    // //         const response = await axios.post('https://admin.prodtest1.space/api/update-balance', {
    // //             score: coins,
    // //             id_telegram: id_telegram
    // //         });
    
    // //         console.log('Coins submitted successfully:', response.data);
    // //     } catch (error) {
    // //         console.error('Error submitting coins:', error);
    // //     }
    // //     }
    // };
    
    const coinClicker = (event) => {
        if (!event.isTrusted) return;
        if (currEnergy >= 991 && currEnergy <= 1000 || boostPhase === true) {
            playBoostCatClick()
          } else {
        playSadCatClick();
        }
        setCurrentImage(false);
        setCoinState(true);
        handleCoinClick();
        setCurrEnergy(prevEnergy => Math.min(prevEnergy + happinessVal, 1000));
        clearTimeout(timeoutRef.current);
        clearTimeout(coinRef.current);
        timeoutRef.current = setTimeout(() => setCurrentImage(true), 1100);
        coinRef.current = setTimeout(() => setCoinState(false), 4000);
        const clickNewCoins = updateCurrCoins();
        setCurrCoins(prevCoins => prevCoins + clickNewCoins);
        accumulatedCoinsRef.current += clickNewCoins;
    };

    // useEffect(() => {
    //     if (!connected) {
    //         setCurrCoins(0);
    //     }
    // }, [connected]);

    // const startFarm = () => {
    //     setCurrentImage(true);
    //     setidleState(prevState => !prevState);
    // };

    // const stopFarm = () => {
    //     setCurrentImage(false);
    //     setBoostPhase(false)
    //     setCoinState(false);
    //     setidleState(prevState => !prevState);
    //     setCoinState(false);
    //     setBoostPhase(false);
    //     setVisible(false)
    // };

    // const loginTwitter = async () => {
    //     try {
    //       // const res = await requestAuth().unwrap();
    //       window.location.href = `https://api.prodtest1.space/twitter/auth`;
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   };
      
    //   useEffect(() => {
    //     if (location.state && location.state?.auth) {
    //       executeScroll();
    //       window.history.replaceState({}, "");
    //     }
    //   }, []);

return (
        <div className="mainContent">
        <div className="bgImage" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFirst})`, opacity: opacityFirst }}></div>
        <div className="bgImage" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageSecond})`, opacity: opacitySecond }}></div>
        <div className="bgImage" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageThird})`, opacity: opacityThird }}></div>
        <div className="bgImage" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFourth})`, opacity: opacityFourth }}></div>
        <div className="bgImage" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFives})`, opacity: opacityFives }}></div>
            <div className="mainContent__container">
                {/* {idleState ? ( */}
          {/* <div className="mainContent__phaseOne">
                    <div className="mainContent__infoBlock">
                    <div className="mainContent__title">
                        <h4>Tomo The Cat</h4>
                    </div>
                    <div className="mainContent__descr">
                        <p>
                        Play With The Next-Gen Tamagotchi <br/> And Get Rewards
                        </p>
                    </div>
                    <div className="mainContent__descrMob">
                        <p>
                        Play With The Next-Gen Tamagotchi
                            <span>And Get Rewards</span>
                        </p>
                    </div>
                    </div>                 
                    <div className="mainContent__catBox">
                        <img className="mainContent__catIdle" draggable="false" src={catIdle} alt="cat animation"/>                
                    </div>
                    <div className="mainContent__form" ref={formRef}> 
                        <div id="steps" aria-hidden="true" className="steps">
                        <div>
      {connected && value.twitter !==0 ? (
        <div className="steps__header">
          <p>
            You've met requirements,
            <br />
            start farming now
          </p>       
        </div>
      ) : (
        <div className="steps__header">
        <p>
        Connect your wallet
        </p> 
        </div>
      )}
    </div> */}
    {/* <div className="steps__items"style={{ display: connected ? 'block' : 'none' }}>
    {value.twitter !==1 && (
    <div className="steps__item">
          <p>@TomoCatSol <span>on Twitter</span></p>
      {value.twitter !== 1 && (
          <button className="steps__item-btn" onClick={loginTwitter}>
              Follow
          </button>
      )}
      </div>
      )}
    {value.twitter !==1 && (
    <div className="steps__item"style={{ display: !connected ? 'none' : 'flex' }}>
        <p>
        @tomo_cat
            <span>Telegram</span>
        </p>
        <a href="https://t.me/tomo_cat" className="steps__item-btn">
            Join
        </a>
      </div>
      )}
    </div> */}
    {/* </div>    
        <WalletMultiButton style={{
          display: !connected ? 'flex' : 'none',
          border: '2px solid #fff',
          borderRadius: '60px',
          marginTop: '0',
          padding: '1.4063rem 20px 1.3438rem 20px',
          fontSize: '1rem',
          width: 'fit-content',
          background: 'linear-gradient(87deg, #c09aff 0%, #691ee2 90.83%)',
          transition: 'background-color 0.3s'
      }}>Select Wallet                                
         <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '10px'}}>
             <circle cx="11" cy="11.5" r="10" stroke="white" stroke-width="2" />
             <path
               d="M16.7333 11.9536C16.8536 11.8333 16.9211 11.6701 16.9211 11.5C16.9211 11.3298 16.8536 11.1666 16.7333 11.0463L13.1034 7.4164C13.0442 7.35511 12.9734 7.30623 12.8951 7.2726C12.8168 7.23897 12.7326 7.22127 12.6474 7.22053C12.5622 7.21979 12.4777 7.23602 12.3988 7.26829C12.32 7.30055 12.2483 7.3482 12.1881 7.40844C12.1278 7.46869 12.0802 7.54034 12.0479 7.61919C12.0157 7.69805 11.9994 7.78255 12.0002 7.86775C12.0009 7.95295 12.0186 8.03715 12.0522 8.11543C12.0859 8.19372 12.1348 8.26452 12.196 8.32371L14.7306 10.8583H6.23304C6.06286 10.8583 5.89964 10.9259 5.77931 11.0462C5.65897 11.1666 5.59137 11.3298 5.59137 11.5C5.59137 11.6701 5.65897 11.8334 5.77931 11.9537C5.89964 12.074 6.06286 12.1416 6.23304 12.1416H14.7306L12.196 14.6762C12.0792 14.7972 12.0145 14.9593 12.0159 15.1276C12.0174 15.2958 12.0849 15.4567 12.2039 15.5757C12.3228 15.6947 12.4838 15.7622 12.652 15.7636C12.8203 15.7651 12.9823 15.7004 13.1034 15.5835L16.7333 11.9536Z"
               fill="white" />
         </svg>
            </WalletMultiButton> */}
    {/* <button className="mainContent__startBtn" onClick={startFarm} disabled={value.twitter !== 1} style={{ display: !connected ? 'none' : 'flex',
    opacity: value.twitter !== 1 ? '0.5' : '1' }}>Play now!
       <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
           <circle cx="11" cy="11.5" r="10" stroke="white" stroke-width="2" />
           <path
               d="M16.7333 11.9536C16.8536 11.8333 16.9211 11.6701 16.9211 11.5C16.9211 11.3298 16.8536 11.1666 16.7333 11.0463L13.1034 7.4164C13.0442 7.35511 12.9734 7.30623 12.8951 7.2726C12.8168 7.23897 12.7326 7.22127 12.6474 7.22053C12.5622 7.21979 12.4777 7.23602 12.3988 7.26829C12.32 7.30055 12.2483 7.3482 12.1881 7.40844C12.1278 7.46869 12.0802 7.54034 12.0479 7.61919C12.0157 7.69805 11.9994 7.78255 12.0002 7.86775C12.0009 7.95295 12.0186 8.03715 12.0522 8.11543C12.0859 8.19372 12.1348 8.26452 12.196 8.32371L14.7306 10.8583H6.23304C6.06286 10.8583 5.89964 10.9259 5.77931 11.0462C5.65897 11.1666 5.59137 11.3298 5.59137 11.5C5.59137 11.6701 5.65897 11.8334 5.77931 11.9537C5.89964 12.074 6.06286 12.1416 6.23304 12.1416H14.7306L12.196 14.6762C12.0792 14.7972 12.0145 14.9593 12.0159 15.1276C12.0174 15.2958 12.0849 15.4567 12.2039 15.5757C12.3228 15.6947 12.4838 15.7622 12.652 15.7636C12.8203 15.7651 12.9823 15.7004 13.1034 15.5835L16.7333 11.9536Z"
               fill="white" />
       </svg>
    </button> */}
                    {/* </div> 
                    <div className="mainContent__guideItems">
                        <motion.div
                            initial={{
                            y: 7,
                            rotate: 0
                            }}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [0, 3, -7, 0],
                            }}
                            transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                            }} style={{ position: 'absolute' }}>
                                    <div className="mainContent__refFriends">
                                    <svg width="37" height="27" viewBox="0 0 37 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M29.9966 6.75658C29.7623 10.0083 27.349 12.5132 24.7174 12.5132C22.0858 12.5132 19.6686 10.0091 19.4382 6.75658C19.1983 3.37379 21.5475 1 24.7174 1C27.8874 1 30.2366 3.43535 29.9966 6.75658Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M24.717 17.1182C19.6105 17.1182 14.7 19.6471 13.4698 24.5721C13.3068 25.2236 13.7166 25.8682 14.3881 25.8682H35.0466C35.7181 25.8682 36.1255 25.2236 35.9649 24.5721C34.7347 19.5682 29.8242 17.1182 24.717 17.1182Z" stroke="white" strokeWidth="2" strokeMiterlimit="10" />
                                        <path d="M14.3425 8.13317C14.1601 10.5832 12.2594 12.5127 10.2107 12.5127C8.1619 12.5127 6.25815 10.5839 6.07884 8.13317C5.89252 5.58436 7.74248 3.7627 10.2107 3.7627C12.6788 3.7627 14.5288 5.63112 14.3425 8.13317Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14.8158 17.5424C13.3827 16.9038 11.8043 16.6582 10.1314 16.6582C6.00277 16.6582 2.02499 18.6545 1.02857 22.5429C0.897561 23.0572 1.22944 23.5661 1.77251 23.5661H10.6872" stroke="white" strokeWidth="2" strokMiterlimit="10" strokeLinecap="round" />
                                    </svg>
                                    <p>Invite Friends</p>
                                    </div>
                        </motion.div>
                        <motion.div
              initial={{
                y: 7,
                rotate: 0
              }}
              animate={{
                y: [0, 15, 0],
                rotate: [0, 2, -4, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}style={{ position: 'absolute' }}>
                        <div className="mainContent__petCat">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_3524_231)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1894 0.835443C12.9587 0.835443 12.7717 1.02247 12.7717 1.25316V5.23317C12.7717 5.42771 12.7264 5.61957 12.6394 5.79359L10.5183 10.0357C10.4893 10.0937 10.4742 10.1577 10.4742 10.2225V13.9937H9.63876V10.2225C9.63876 10.028 9.68408 9.83613 9.77105 9.66211L11.8922 5.41998C11.9211 5.36196 11.9362 5.298 11.9362 5.23317V1.25316C11.9362 0.561063 12.4973 0 13.1894 0H28.6451C29.3372 0 29.8983 0.561063 29.8983 1.25316V5.23317C29.8983 5.298 29.9134 5.36196 29.9424 5.41998L32.0689 9.67301C32.1506 9.83651 32.1956 10.0159 32.2007 10.1987L32.7983 31.712C32.8179 32.4175 32.2514 33 31.5456 33H19.2464H1.25357C0.465496 33 -0.126974 32.2812 0.0234447 31.5076L1.16058 25.6595C1.27507 25.0707 1.79082 24.6456 2.3907 24.6456H3.00885C3.10097 24.4367 3.15068 24.2352 3.18772 24.027C3.20029 23.9563 3.21315 23.8712 3.22681 23.7808C3.24975 23.629 3.27495 23.4623 3.30481 23.3241C3.35939 23.0715 3.44617 22.805 3.62091 22.5379C3.79534 22.2714 4.04351 22.0254 4.39439 21.7915L4.85781 22.4866C4.58211 22.6704 4.42154 22.8402 4.31999 22.9954C4.21874 23.1501 4.1623 23.3113 4.12141 23.5006C4.09436 23.6257 4.07878 23.7322 4.06106 23.8532C4.04745 23.9462 4.03255 24.048 4.01025 24.1733C3.98387 24.3215 3.94986 24.4795 3.89873 24.6456H16.6053C16.5003 24.4292 16.3497 24.1429 16.1619 23.8486C15.9692 23.5465 15.7438 23.2465 15.4965 23.0062C15.2466 22.7636 14.9972 22.6044 14.7582 22.5441C14.3784 22.4484 14.0862 22.5488 13.6903 22.7318C13.6516 22.7497 13.6116 22.7686 13.5704 22.7881C13.204 22.9612 12.734 23.1834 12.1451 23.1834C11.1926 23.1834 10.5667 22.9679 9.83329 22.7155C9.66365 22.6571 9.48825 22.5968 9.30174 22.5366C8.99083 22.4364 8.7072 22.2637 8.46233 22.0935C8.33847 22.0075 8.21871 21.9179 8.10751 21.8343L8.07886 21.8127C7.97673 21.7359 7.88291 21.6653 7.79197 21.6009C7.5834 21.4533 7.44217 21.3777 7.34304 21.3547C7.30165 21.3451 7.28277 21.3486 7.27596 21.3504C7.27082 21.3518 7.25198 21.3571 7.21894 21.3901L6.6282 20.7994C6.75184 20.6758 6.89725 20.5861 7.06359 20.5424C7.22829 20.4991 7.38807 20.5075 7.53219 20.541C7.80408 20.6042 8.06098 20.7678 8.27456 20.919C8.37607 20.9908 8.47975 21.0688 8.57983 21.1441L8.6097 21.1666C8.72111 21.2504 8.8295 21.3314 8.93899 21.4074C9.16076 21.5615 9.3644 21.679 9.55809 21.7415L9.60526 21.7568L9.63876 21.7677V15.8734H10.4742V22.0496C11.0227 22.2314 11.4715 22.3479 12.1451 22.3479C12.5375 22.3479 12.8394 22.2069 13.2203 22.029C13.2592 22.0109 13.299 21.9923 13.3398 21.9734C13.7658 21.7766 14.287 21.5637 14.9624 21.734C15.2338 21.8024 15.4818 21.9316 15.7047 22.0916L16.0257 21.9313L16.0248 21.9319L15.7047 22.0916L15.7129 22.0975C15.7865 22.0625 15.8896 22.0097 16.0248 21.9319L19.2621 20.3153C19.0392 20.6296 18.7818 20.953 18.4656 21.2101C17.5541 21.9515 16.9099 22.3823 16.4857 22.6303C16.4401 22.657 16.3971 22.6815 16.3564 22.7041C16.5492 22.9296 16.7199 23.1699 16.8663 23.3993C17.0805 23.7351 17.2492 24.0579 17.3643 24.296C17.422 24.4155 17.4666 24.5146 17.4971 24.5845C17.5124 24.6195 17.5242 24.6472 17.5323 24.6667L17.5417 24.6895L17.5443 24.696L17.5451 24.698C17.5451 24.698 17.5455 24.6989 17.5399 24.7012L17.5065 24.7147C17.8863 24.8465 18.1876 25.1567 18.3009 25.5552C18.3769 25.4874 18.4635 25.4177 18.5617 25.3485C19.0801 24.9826 19.8964 24.6456 21.1261 24.6456C21.6543 24.6456 22.1487 24.8358 22.5764 25.0381C22.7443 25.1175 22.9118 25.2039 23.07 25.2853L23.1248 25.3135L23.2002 25.3522C23.3999 25.4544 23.5835 25.545 23.7589 25.6158C24.1167 25.7603 24.3741 25.7945 24.5863 25.7241C24.7923 25.6558 25.059 25.4532 25.3474 24.8764C25.6425 24.2863 25.7134 23.8917 25.6863 23.6137C25.6604 23.3492 25.5404 23.1356 25.3234 22.912C25.1359 22.7189 24.9037 22.5442 24.6236 22.3336C24.5578 22.2841 24.489 22.2322 24.4178 22.178C24.0586 21.9044 23.6583 21.5801 23.3082 21.1493C23.0861 20.876 22.8951 20.5651 22.7209 20.2703C22.6836 20.2072 22.6472 20.145 22.6114 20.0838C22.4748 19.8505 22.3465 19.6313 22.2084 19.4271C21.8574 18.908 21.5294 18.6199 21.095 18.5874C20.6361 18.5532 20.2995 18.83 19.8861 19.402C19.7863 19.5401 19.6878 19.687 19.5841 19.8423L19.5657 19.8698C19.469 20.0148 19.3675 20.1668 19.2621 20.3153L16.0257 21.9313C16.0382 21.9241 16.0509 21.9167 16.064 21.9091C16.4436 21.6871 17.0525 21.2825 17.9385 20.562C18.1666 20.3765 18.3721 20.126 18.5808 19.8319C18.679 19.6934 18.7742 19.5507 18.8726 19.4034L18.8893 19.3784C18.9922 19.2243 19.0988 19.0651 19.209 18.9126C19.6357 18.3222 20.2167 17.6841 21.1572 17.7543C21.9933 17.8167 22.5168 18.3917 22.9005 18.9592C23.0553 19.1881 23.2013 19.4377 23.3394 19.6736L23.3399 19.6746C23.3621 19.7124 23.384 19.75 23.4058 19.787C23.4173 19.8066 23.4288 19.8261 23.4402 19.8454C23.6128 20.1375 23.777 20.4014 23.9566 20.6225C24.2418 20.9734 24.5768 21.2489 24.9241 21.5135C24.983 21.5583 25.0433 21.6036 25.1043 21.6494C25.3876 21.862 25.6854 22.0856 25.9228 22.3301C26.2257 22.6421 26.468 23.023 26.5178 23.5324C26.5662 24.0284 26.4261 24.5871 26.0947 25.2501C25.7565 25.9265 25.3518 26.3505 24.8492 26.5171C24.3527 26.6818 23.8641 26.5593 23.4461 26.3905C23.2336 26.3047 23.0218 26.1994 22.8197 26.096C22.7731 26.0722 22.7271 26.0485 22.6817 26.0251L22.68 26.0243C22.5239 25.9438 22.373 25.8661 22.2192 25.7933C21.8189 25.604 21.463 25.481 21.1261 25.481C20.0584 25.481 19.4126 25.7705 19.0434 26.0311C18.8565 26.163 18.7341 26.292 18.6611 26.3825C18.6246 26.4279 18.6004 26.4637 18.5867 26.4853C18.5799 26.4962 18.5757 26.5035 18.5739 26.5066L18.5747 26.505L18.5752 26.5041C18.5752 26.5041 18.5756 26.5033 18.4806 26.4557L19.5907 32.1646H31.5456C31.7809 32.1646 31.9697 31.9704 31.9632 31.7352L31.3656 10.2219C31.3639 10.161 31.3489 10.1011 31.3216 10.0467L29.1951 5.79359C29.1081 5.61957 29.0628 5.42771 29.0628 5.23317V1.25316C29.0628 1.02247 28.8758 0.835443 28.6451 0.835443H13.1894ZM18.7396 32.1646L17.5057 25.819C17.4676 25.6227 17.2956 25.481 17.0957 25.481H2.3907C2.19074 25.481 2.01883 25.6227 1.98066 25.819L0.84353 31.6671C0.793387 31.925 0.990881 32.1646 1.25357 32.1646H18.7396ZM27.2211 18.7515L27.6624 16.9243C27.7413 16.5973 27.5403 16.2682 27.2132 16.1892C26.8862 16.1102 26.557 16.3113 26.4781 16.6383L26.0368 18.4655C25.9579 18.7925 26.159 19.1217 26.486 19.2007C26.813 19.2796 27.1422 19.0785 27.2211 18.7515ZM27.4093 15.3771C26.6338 15.1898 25.8532 15.6667 25.666 16.4422L25.2247 18.2694C25.0375 19.0449 25.5143 19.8255 26.2899 20.0127C27.0654 20.2 27.8459 19.7231 28.0332 18.9476L28.4744 17.1204C28.6618 16.3449 28.1848 15.5643 27.4093 15.3771ZM14.4426 2.50633C14.2118 2.50633 14.0248 2.69335 14.0248 2.92405C14.0248 3.15475 14.2118 3.34177 14.4426 3.34177H22.3793C22.61 3.34177 22.797 3.15475 22.797 2.92405C22.797 2.69335 22.61 2.50633 22.3793 2.50633H14.4426ZM23.6324 2.92405C23.6324 2.69335 23.8194 2.50633 24.0501 2.50633H27.6008C27.8315 2.50633 28.0185 2.69335 28.0185 2.92405C28.0185 3.15475 27.8315 3.34177 27.6008 3.34177H24.0501C23.8194 3.34177 23.6324 3.15475 23.6324 2.92405ZM25.0945 29.2405C24.8637 29.2405 24.6767 29.4275 24.6767 29.6582C24.6767 29.8889 24.8637 30.0759 25.0945 30.0759H28.8539C29.0847 30.0759 29.2717 29.8889 29.2717 29.6582C29.2717 29.4275 29.0847 29.2405 28.8539 29.2405H25.0945ZM19.1593 15.4745L19.0694 13.5969C19.0533 13.2609 18.7679 13.0015 18.4318 13.0176C18.0958 13.0337 17.8364 13.3191 17.8525 13.6552L17.9424 15.5328C17.9585 15.8688 18.2439 16.1282 18.58 16.1121C18.9161 16.096 19.1754 15.8105 19.1593 15.4745ZM18.3919 12.1831C17.5949 12.2213 16.9798 12.8982 17.018 13.6952L17.1079 15.5727C17.1461 16.3696 17.823 16.9847 18.62 16.9466C19.4169 16.9084 20.032 16.2314 19.9938 15.4345L19.9039 13.5569C19.8657 12.76 19.1887 12.145 18.3919 12.1831ZM23.6643 13.5969L23.7543 15.4745C23.7704 15.8105 23.511 16.096 23.1749 16.1121C22.8389 16.1282 22.5535 15.8688 22.5373 15.5328L22.4474 13.6552C22.4313 13.3191 22.6907 13.0337 23.0267 13.0176C23.3628 13.0015 23.6483 13.2609 23.6643 13.5969ZM21.613 13.6952C21.5748 12.8982 22.1899 12.2213 22.9868 12.1831C23.7837 12.145 24.4607 12.76 24.4988 13.5569L24.5888 15.4345C24.6269 16.2314 24.0118 16.9084 23.2149 16.9466C22.418 16.9847 21.741 16.3696 21.7028 15.5727L21.613 13.6952ZM15.2698 16.7012L15.7369 18.5219C15.8205 18.8478 15.6241 19.1797 15.2983 19.2634C14.9724 19.3469 14.6404 19.1505 14.5568 18.8247L14.0897 17.0039C14.0061 16.678 14.2025 16.3461 14.5284 16.2625C14.8543 16.1789 15.1862 16.3753 15.2698 16.7012ZM13.2805 17.2115C13.0822 16.4387 13.548 15.6515 14.3208 15.4532C15.0936 15.255 15.8808 15.7207 16.0791 16.4936L16.5462 18.3143C16.7444 19.0871 16.2786 19.8743 15.5059 20.0726C14.733 20.2709 13.9458 19.8051 13.7476 19.0323L13.2805 17.2115Z" fill="white" />
                            </g>
                            <defs>
    <clipPath id="clip0_3524_231">
      <rect width="33" height="33" fill="white" />
    </clipPath>
  </defs>
                            </svg>
                            <p>Pet Tomo</p>
                        </div>
                        </motion.div>
                        <motion.div
              initial={{
                y: 7,
                rotate: 0
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 4, 4, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }} style={{ position: 'absolute' }}>
                        <div className="mainContent__earnPoins">
                            <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M36.5703 17.7393V24.0163C36.5703 26.7364 30.0128 30.2934 21.9238 30.2934C13.8348 30.2934 7.27734 26.7364 7.27734 24.0163V18.7854" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M7.89209 19.3271C9.70198 21.7292 15.299 23.9826 21.9234 23.9826C30.0124 23.9826 36.5699 20.6223 36.5699 17.7349C36.5699 16.1133 34.5047 14.3369 31.2637 13.0898" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M30.2929 7.27734V13.5544C30.2929 16.2745 23.7355 19.8315 15.6465 19.8315C7.55743 19.8315 1 16.2745 1 13.5544V7.27734" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6465 13.5206C23.7355 13.5206 30.2929 10.1603 30.2929 7.27287C30.2929 4.38333 23.7355 1 15.6465 1C7.55743 1 1 4.38333 1 7.27287C1 10.1603 7.55743 13.5206 15.6465 13.5206Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Earn Points</p>
                        </div>
                        </motion.div>
                    </div>
          </div> */}
          {/* ) : ( */}
          <div className="mainContent__phaseTwo">
            <div className="gameContentBox">
              <div className="gameContentBox__box">
                {gamePaused && timeRemaining > 0 && (
                <>
                <p style={{
                  fontSize: '22px',
                  textAlign: 'center',
                  alignContent: 'center'
                }}>Time remaining: {formatTime(timeRemaining)} minutes</p>
                <img src={catFace} alt="cat face" style={{
                  width: '275px',
                  marginTop: '15px'}}/>
                  <p style={{
                  fontSize: '16px',
                  textAlign: 'center',
                  alignContent: 'center',
                  marginTop: '15px'}}>
                    Tomo is tired, comeback when timer is over.
                  </p>
                </>
                )}
              </div>

              {!gamePaused && timeRemaining <= 0 && (
              <>
              {currentImage ? (
                <div className="mainContent__catBox" onClick={coinClicker}>
              <img id="catGif" className="mainContent__catIdle" src={boostPhase ? goldForm : catIdle} draggable="false" alt="cat animation" />
                </div>
                ) : (
                <div className="mainContent__catBox" onClick={coinClicker}>
              <img id="catGif" className="mainContent__catMeow" src={boostPhase ? goldForm : catSpeak} draggable="false" alt="cat animation" />
                </div>
                )}
              </>
                )}
              </div>
                <div style={{ position: 'absolute'}}>
                </div>
                <motion.div
                        initial={{
                        y: 70,
                        rotate: 0
                        }}
                            animate={{
                            y: [0, 15, 0],
                            rotate: [0, 2, -4, 0],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              repeatType: "mirror",
                              ease: "easeInOut"
                            }}style={{ position: 'absolute', top: '340px', right: '140px', width: '100px' }}>
                        {!gamePaused && timeRemaining <= 0 && (
                            <div className="mainContent__tapCat">
                            <p>Tap the</p>
                            <img src={smile} alt="cat icon"/>
                            </div>
                        )}
                  </motion.div>                    
                <div className="mainContent__energyBox">
                        <div className="mainContent__energyContainer">
                            <img src={smile} alt=""/>
                            <div className="mainContent__energyValue">
                                <p className="energyCount" id="energyCount">{currEnergy}</p>
                                <span>/</span>
                                <p className="maximumEnergy" id="maximumEnergy">1000</p>
                            </div>
                        </div>
                        <div className="mainContent__energyBar">
                            <progress className="filledBar" id="filledBar" max="1000" value={currEnergy}>                                
                            </progress>
                        </div>
                        <div className="mainContent__energyHint">
                            <p>
                            The happier the cat — the more you get!
                            Make it purr and get rewards
                            </p>
                        </div>
                </div>                  
                  {visible ? (
                            <motion.div
                                initial={{
                                y: 7,
                                rotate: 0,
                                opacity: 1 // Initial opacity set to 0
                                }}
                                animate={{
                                  y: [0, -10, 0],
                                  rotate: [0, 3, -7, 0]
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  repeatType: "mirror",
                                  ease: "easeInOut" 
                                }}
                                    style={{ position: 'absolute', top: '50%', left: 0, zIndex: 1500 }}
                                    >
                                    <motion.div
                                    animate={{
                                      opacity: [0, 1] // Transition from 0 to 1 opacity
                                    }}
                                    transition={{
                                      duration: 4,
                                      repeat: Infinity,
                                      repeatType: "mirror", // Apply mirror effect to opacity animation
                                      ease: "easeInOut"
                                    }}
                            >
        <div
          className='boost-element'
          style={{
            position: 'absolute',
            overflow: 'hidden',
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: 'pointer',
            width: '150px',
            height: '150px',
            borderRadius: '150px',
            zIndex: 1500,
            ...(isMobile && {
                scale: '50%' })
          }}
          onClick={boostClickedHandler}
        >
            <motion.img
            src={boostCoin}
            alt="Boost coin"
            style={{
                width: '100%',
                height: '100%',
                userSelect: 'none',              
            }}
            initial={{ opacity: 0, rotate: 0 }} // Initial opacity set to 0 and rotation set to 0 degrees
            animate={{ opacity: 1, rotate: 360 }} // Animate opacity to 1 and rotate 360 degrees
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror", // Apply mirror effect to image opacity and rotation animation
              ease: "easeInOut"
            }}
                />
                                </div>
                                </motion.div>
                            </motion.div>
                  ) : null}
                {/* <div className="mainContent__backBtn-box">
                    <div className="mainContent__backBtn" onClick={stopFarm}>
                <button>
                        <span>
                        &lt; Stop
                        </span>
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L11 11.5M1 11.5L11 1.5" stroke="white" strokeOpacity="0.5" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                        </div>
                    </div>                   */}
                    <div className="mainContent__coins">
                        <div className="mainContent__coinBox">
                        <div className="mainContent__coinImg" draggable="false"><img src={catCoinMove} alt="coin animation" draggable="false"/></div>
                            <div className="mainContent__coinAmount"><span id="coinAmount">{currCoins}</span></div>
                        </div>
                    </div>
                    {coinState && (
                    <div className="mainContent__animation">
                        <div className="mainContent__coinOne">
                            <img src={catCoinMove} alt=""/>
                        </div>
                        <div className="mainContent__coinTwo">
                            <img src={catCoinMove} alt=""/>
                        </div>
                        <div className="mainContent__coinThree">
                            <img src={catCoinMove} alt=""/>
                        </div>
                </div>
                )}
          </div>
         {/* )} */}
    </div>
</div>
)
}

export default Main;