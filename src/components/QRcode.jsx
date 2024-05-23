import React, { useState } from 'react';
import QRimg from '../img/qr.png';
const TelegramLinking = () => {
	const [bgImages] = useState({
		bgImageFirst: 'img/bgFirst.webp',
	});
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
				backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImages.bgImageFirst})`,
			}}
		>
			<div>
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
					Leave the desktop. Mobile gaming rocks!
				</h1>
				<div
					style={{
						display: 'flex',
						scale: '90%',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<img src={QRimg} alt='QR redirect' />
				</div>
			</div>
		</div>
	);
};

export default TelegramLinking;
