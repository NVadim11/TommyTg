import axios from 'axios'
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

    const id_telegram = '111222333';

  //   const handleSubmit = async (event) => {
  //     event.preventDefault(); // Prevent default form submission behavior

  //     try {
  //         const response = await axios.post('https://admin.prodtest1.space/api/update-balance', {
  //             score: coins,
  //             wallet_address: walletAddress,
  //             id_telegram: id_telegram
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

    useEffect(() => {
        const timer = setInterval(() => {
            if (isCoinsChanged) {
                submitData(accumulatedCoinsRef.current);
                setIsCoinsChanged(false);
                accumulatedCoinsRef.current = 0;
            }
        }, 4900);
    
        return () => clearInterval(timer);
    }, [isCoinsChanged]);

    const submitData = async (coins) => {
        // try {
        //     const response = await axios.post('https://admin.prodtest1.space/api/update-balance', {
        //         score: coins,
        //         wallet_address: wallet_address
        //     });
    
        //     console.log('Coins submitted successfully:', response.data);
        // } catch (error) {
        //     console.error('Error submitting coins:', error);
        // }
        if (id_telegram !== null) {
          try {
            const response = await axios.post('https://admin.prodtest1.space/api/update-balance', {
                score: coins,
                id_telegram: id_telegram
            });
    
            console.log('Coins submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting coins:', error);
        }
        }
    };
    
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
                                opacity: 1
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
                                      opacity: [0, 1]
                                    }}
                                    transition={{
                                      duration: 4,
                                      repeat: Infinity,
                                      repeatType: "mirror",
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
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
              />
                </div>
                </motion.div>
                </motion.div>
                  ) : null}
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