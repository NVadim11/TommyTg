import React, { useState } from 'react';
import sadIdle from '../img/1_idle.gif';

const NotFound = () => {
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
			<h1
				style={{
					width: 'fit-content',
					margin: '150px 0 0 0',
					fontWeight: '900',
					fontSize: '24px',
					lineHeight: '100%',
					textAlign: 'center',
				}}
			>
				Something went wrong
			</h1>
			<p
				style={{
					width: 'fit-content',
					margin: '15px 30px 0 30px',
					fontWeight: '400',
					fontSize: '14px',
					lineHeight: '130%',
					textAlign: 'center',
				}}
			>
				Brace yourself till we get the error fixed. You may also refresh the page or try
				again later
			</p>
			<div
				style={{
					scale: '60%',
					margin: '-50px 0 0 0',
				}}
			>
				<img src={sadIdle} />
			</div>
		</div>
	);
};

export default NotFound;
