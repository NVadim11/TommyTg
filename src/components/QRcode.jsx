import React from 'react';
import star from '../img/Star.svg';
import QRimg from '../img/qr.png';
const TelegramLinking = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				height: '100%',
				width: '100%',
				position: 'absolute',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				flexDirection: 'column',
				justifyContent: 'center',
				backgroundColor: '#000',
				background: 'linear-gradient(180deg, #0b1f46 0%, #000 100%)',
			}}
		>
			<div
				className='orangeEllipse'
				style={{
					zIndex: '100',
				}}
			>
				<svg
					width='390'
					height='754'
					viewBox='0 0 655 754'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g opacity='0.3' filter='url(#filter0_f_5127_4548)'>
						<circle
							cx='-29.3449'
							cy='684.466'
							r='384.234'
							transform='rotate(60 -29.3449 684.466)'
							fill='url(#paint0_linear_5127_4548)'
						/>
					</g>
					<defs>
						<filter
							id='filter0_f_5127_4548'
							x='-713.643'
							y='0.16748'
							width='1368.6'
							height='1368.6'
							filterUnits='userSpaceOnUse'
							color-interpolation-filters='sRGB'
						>
							<feFlood flood-opacity='0' result='BackgroundImageFix' />
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='BackgroundImageFix'
								result='shape'
							/>
							<feGaussianBlur
								stdDeviation='150'
								result='effect1_foregroundBlur_5127_4548'
							/>
						</filter>
						<linearGradient
							id='paint0_linear_5127_4548'
							x1='-334.146'
							y1='353.187'
							x2='202.181'
							y2='1068.7'
							gradientUnits='userSpaceOnUse'
						>
							<stop stop-color='#FFD600' />
							<stop offset='1' stop-color='#FF004D' stop-opacity='0.2' />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div
				className='violetEllipse'
				style={{
					zIndex: '100',
				}}
			>
				<svg
					width='329'
					height='452'
					viewBox='0 0 329 452'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g filter='url(#filter0_f_5127_4227)'>
						<circle cx='344' cy='344' r='195' fill='url(#paint0_linear_5127_4227)' />
					</g>
					<defs>
						<filter
							id='filter0_f_5127_4227'
							x='0'
							y='0'
							width='688'
							height='688'
							filterUnits='userSpaceOnUse'
							color-interpolation-filters='sRGB'
						>
							<feFlood flood-opacity='0' result='BackgroundImageFix' />
							<feBlend
								mode='normal'
								in='SourceGraphic'
								in2='BackgroundImageFix'
								result='shape'
							/>
							<feGaussianBlur
								stdDeviation='74.5'
								result='effect1_foregroundBlur_5127_4227'
							/>
						</filter>
						<linearGradient
							id='paint0_linear_5127_4227'
							x1='-21.7531'
							y1='13.4221'
							x2='364.597'
							y2='583.901'
							gradientUnits='userSpaceOnUse'
						>
							<stop stop-color='#FF00A8' stop-opacity='0' />
							<stop offset='0.9999' stop-color='#2723FE' />
							<stop offset='1' stop-color='#23A7FE' />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className='mainContent__animation'>
				<div className='mainContent__coinOne'>
					<img src={star} alt='' />
				</div>
				<div className='mainContent__coinTwo'>
					<img src={star} alt='' />
				</div>
				<div className='mainContent__coinThree'>
					<img src={star} alt='' />
				</div>
				<div className='mainContent__coinFour'>
					<img src={star} alt='' />
				</div>
				<div className='mainContent__coinFive'>
					<img src={star} alt='' />
				</div>
				<div className='mainContent__coinSix'>
					<img src={star} alt='' />
				</div>
				<div className='mainContent__coinSeven'>
					<img src={star} alt='' />
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<h1
					style={{
						display: 'flex',
						width: 'fit-content',
						margin: '30px 0 30px 0',
						fontWeight: '900',
						fontSize: '24px',
						lineHeight: '100%',
						textAlign: 'center',
					}}
				>
					Leave the desktop. <br />
					Mobile gaming rocks!
				</h1>
				<div
					style={{
						display: 'flex',
						scale: '90%',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<img
						src={QRimg}
						alt='QR redirect'
						style={{
							borderRadius: '20px',
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default TelegramLinking;
