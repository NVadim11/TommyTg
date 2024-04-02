import React, { useState } from "react"
import { toggleMuteAllSounds } from '../../utility/Audio'
import './Footer.scss'

function Footer() {
	const [isVisible, setIsVisible] = useState(true);
      
	const toggleVisibility = () => {
		toggleMuteAllSounds();
		setIsVisible(!isVisible);
	};

	return (
	<footer className="footerMain">
		<div className="footerMain__container">
		<div className="soundToggler">
		{isVisible ? (
			<div className="soundToggler__itemOn" onClick={toggleVisibility}>
				<button>
					<svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M19.697 4.80667C19.697 4.80667 21.2996 6.37109 21.2996 8.97844C21.2996 11.5858 19.697 13.1502 19.697 13.1502" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M1 11.4367V7.56325C1 7.01003 1.22512 6.47948 1.62584 6.0883C2.02656 5.69712 2.57006 5.47736 3.13676 5.47736H6.23507C6.44396 5.47731 6.64825 5.41748 6.82267 5.30527L13.233 1.17939C13.394 1.07585 13.5808 1.01679 13.7735 1.00849C13.9661 1.00019 14.1575 1.04295 14.3273 1.13223C14.497 1.22152 14.6389 1.354 14.7378 1.51563C14.8367 1.67725 14.8889 1.86199 14.8889 2.05025V16.9497C14.8889 17.138 14.8367 17.3227 14.7378 17.4844C14.6389 17.646 14.497 17.7785 14.3273 17.8677C14.1575 17.957 13.9661 17.9998 13.7735 17.9915C13.5808 17.9832 13.394 17.9241 13.233 17.8206L6.82267 13.6947C6.64825 13.5825 6.44396 13.5227 6.23507 13.5226H3.13676C2.57006 13.5226 2.02656 13.3029 1.62584 12.9117C1.22512 12.5205 1 11.9899 1 11.4367Z" stroke="white" stroke-width="2" />
					  </svg>
				</button>
			</div>
				) : (
			<div className="soundToggler__itemOff" onClick={toggleVisibility}>
				<button>
					<svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M20.1947 11.5865L22.2812 9.50001M22.2812 9.50001L24.3677 7.41351M22.2812 9.50001L20.1947 7.41351M22.2812 9.50001L24.3677 11.5865" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M1.6322 11.4373V7.56269C1.6322 7.00932 1.85203 6.47861 2.24332 6.08732C2.63462 5.69602 3.16533 5.4762 3.7187 5.4762H6.74412C6.9481 5.47614 7.14758 5.4163 7.31791 5.30406L13.5774 1.17697C13.7347 1.0734 13.917 1.01432 14.1052 1.00602C14.2933 0.997715 14.4802 1.04049 14.646 1.1298C14.8118 1.21911 14.9503 1.35163 15.0468 1.5133C15.1434 1.67497 15.1944 1.85977 15.1944 2.04808V16.9519C15.1944 17.1402 15.1434 17.325 15.0468 17.4867C14.9503 17.6484 14.8118 17.7809 14.646 17.8702C14.4802 17.9595 14.2933 18.0023 14.1052 17.994C13.917 17.9857 13.7347 17.9266 13.5774 17.823L7.31791 13.6959C7.14758 13.5837 6.9481 13.5239 6.74412 13.5238H3.7187C3.16533 13.5238 2.63462 13.304 2.24332 12.9127C1.85203 12.5214 1.6322 11.9907 1.6322 11.4373Z" stroke="white" stroke-width="2" />
					</svg>
				</button>
			</div>
				)}
		</div>
		<div className="footerMain__socials">
			<div className="footerMain__twBtn">
				<a href="https://twitter.com/TimCatSol">TW</a>
			</div>
			<div className="footerMain__tgBtn">
				<a href="https://t.me/tomo_cat">TG</a>
			</div>
		</div>
	</div>
</footer>
	)
}

export default Footer;