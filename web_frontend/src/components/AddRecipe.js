import React, { useState, useEffect } from 'react';
import ErrorMessageModal from '../components/ErrorMessageModal';
import TagSelectionModal from '../components/TagSelectionModal';
import NavBar from '../components/Navbar';
import AIRequestModal from './AIRequestModal';
const cors = require('cors');

function AddRecipe() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [recipeTags, setRecipeTags] = useState([]);
	const [visibility, setVisibility] = useState(false);
	const [AIgenerated, setAIgenerated] = useState(false);


	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [showTagSelectionModal, setShowTagSelectionModal] = useState(false);

	const [showAIModal, setShowAIModal] = useState(false);


	const [userID, setUserID] = useState(null);
	useEffect(() => {
		const fetchUserID = async () => {
			try {
				const storedUser = localStorage.getItem('user_data');

				if (storedUser) {
					const userObject = JSON.parse(storedUser);
					const userId = userObject.id;
					setUserID(userId);
				}

			} catch (error) {
				console.error('Error retrieving userID from cache', error);
			}
		};

		fetchUserID();
	}, []);

	const handleAddRecipe = async event => {
		try {
			const response = await fetch('https://megabytes.app/api/addRecipe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userID,
					recipeName: title,
					recipeContents: content,
					tagList: recipeTags || [],
					likeList: [],
					isPublic: visibility,
					ai_generated: AIgenerated,
				}),
			});

			console.log('Adding Recipe');
			const data = await response.json();

			if (response.ok) {
				console.log('Success');
				window.location.href = '/rec';
			} else {
				console.error('Error adding Recipe');

				setErrorMessage('Error adding Recipe');
				setShowErrorModal(true);
			}
		} catch (error) {
			console.error('ERROR CONNECTING TO DATABASE', error);
		}
	};

	const handleUpdateRecipeTags = (updatedTags) => {
		setRecipeTags(updatedTags);
	}

	const closeErrorModal = () => {
		setShowErrorModal(false);
	}

	const openTagSelectionModal = () => {
		setShowTagSelectionModal(true);
	}

	const toggleVisibility = () => {
		setVisibility(!visibility);
	}

	const closeAIModal = () => {
		setShowAIModal(false);
	}

	const openAIModal = () => {
		setShowAIModal(true);
	}

	const handleAIInput = (updatedTitle, updatedContent) => {
		setTitle(updatedTitle);
		setContent(updatedContent);
		setAIgenerated(true);
	}

	const handleTagSelection = () => {

	}

	const closeTagSelectionModal = () => {
		setShowTagSelectionModal(false);
	}



	return (
		<div id="AddCustomDiv" className='h-screen bg-orange-300'>
			<NavBar />
			<h1 className="text-6xl font-bold leading-9 tracking-tight text-black p-5 bg-orange-300">
				Create a Custom Recipe
			</h1>
			<div className="mt-2 mb-3 flex justify-center">
				{<div className="container mx-auto p-4">
					<div className="mt-4 p-4 bg-white shadow-md rounded-md">

						{showAIModal && (
							<AIRequestModal visible={showAIModal} onClose={closeAIModal} handleAIInput={handleAIInput} />
						)}
						{showTagSelectionModal && (
							<TagSelectionModal visible={showTagSelectionModal} onClose={closeTagSelectionModal} handleTagSelection={handleTagSelection} />
						)}
						<button onClick={openAIModal} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
							Generate with AI
						</button>
						<input
							type="text"
							placeholder="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full h-12 p-2 mb-4 border-b-2 border-black"
						/>

						<textarea
							placeholder="Ingredients and Directions"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full h-32 p-2 mb-4 border-2 border-gray-400 rounded"
							rows="4"
						/>

						<button
							onClick={openTagSelectionModal}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
						>
							Add Tags
						</button>

						<div className="flex items-center mt-4">
							<span className="mr-2 font-bold">Visibility:</span>
							<button onClick={toggleVisibility} className="flex items-center">
								<div className={`w-4 h-4 rounded-full border border-black mr-2 ${visibility ? 'bg-green-500' : 'bg-white'}`} />
								<span>{visibility ? 'Public' : 'Private'}</span>
							</button>
						</div>
						<button onClick={handleAddRecipe} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
							Submit
						</button>
					</div>

					<ErrorMessageModal visible={showErrorModal} message={errorMessage} onClose={closeErrorModal} />
				</div>}
			</div>
		</div >
	);
};
export default AddRecipe;