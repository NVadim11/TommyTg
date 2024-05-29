import React from 'react';
import sadIdle from '../img/1_idle.gif';
import star from '../img/Star.svg';
import orangeEllipse from '../img/orangeEllipse.webp';
import scullGlow from '../img/scullGlow.png';
import violettEllipse from '../img/violetEllipse/webp';

const Maintenance = () => {
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
				background: 'linear-gradient(180deg, #0b1f46 0%, #000 100%)',
			}}
		>
			<div
				style={{
					scale: '60%',
					margin: '-100px 0 0 0',
					zIndex: '1000',
				}}
			>
				<img src={sadIdle} />
			</div>
			<div
				className='scullGlow'
				style={{
					position: 'absolute',
					boxSizing: 'border-box',
					overflow: 'hidden',
				}}
			>
				<img src={scullGlow} alt='glow' />
			</div>
			<h1
				style={{
					zIndex: '1000',
					width: 'fit-content',
					marginTop: '-75px',
					fontWeight: '900',
					fontSize: '24px',
					lineHeight: '100%',
					textAlign: 'center',
					lineHeight: '110%',
					letterSpacing: '0.03em',
				}}
			>
				Repairs and upgrades are underway
			</h1>
			<div
				className='mainContent__animation'
				style={{
					zIndex: '1000',
				}}
			>
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
				className='orangeEllipse'
				style={{
					zIndex: '100',
				}}
			>
				<img src={orangeEllipse} alt='orangeEllipse' />
			</div>
			<div
				className='violettEllipse'
				style={{
					zIndex: '100',
				}}
			>
				<img src={violettEllipse} alt='violettEllipse' />
			</div>
		</div>
	);
};

export default Maintenance;
