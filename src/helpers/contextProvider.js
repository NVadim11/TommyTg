import { useState } from "react";
import { GameInfoСontext } from "./context";

export const GameInfoProvider = ({ children }) => {
	const [state, setState] = useState(null);

	// Function to update state
	const updateState = (newValue) => {
		setState(newValue);
	};

	return (
		<GameInfoСontext.Provider value={{ state, updateState }}>
			{children}
		</GameInfoСontext.Provider>
	);
};