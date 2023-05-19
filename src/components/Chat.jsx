import React, { useContext, useState } from 'react'
import Cam from '../img/cam.png'
import More from '../img/more.png'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'

function Chat() {
	const { data } = useContext(ChatContext)
	const [showModal, setShowModal] = useState(false)
	const { currentUser } = useContext(AuthContext)
	//
	async function handleClear() {
		await updateDoc(doc(db, 'chats', data.chatId), {
			message: [],
		})
		await updateDoc(doc(db, 'userChats', currentUser.uid), {
			[data.chatId + '.lastMessage']: { text: '' },
		})
		await updateDoc(doc(db, 'userChats', data.user.uid), {
			[data.chatId + '.lastMessage']: { text: '' },
		})
		setShowModal(false)
	}

	//
	return (
		<div className='chat'>
			{data.user.uid ? (
				<>
					<div className='chatnInfo'>
						{data.user.photoURL ? (
							<img className='chat-info-img' src={data.user?.photoURL} alt='' />
						) : null}
						<span>{data.user?.displayName}</span>
						<div className='chatIcons'>
							<img src={Cam} alt='' />
							<button
								onClick={() => {
									setShowModal(!showModal)
								}}
								style={
									showModal
										? { transform: 'rotate(90deg)', transition: 'all 0.3s' }
										: { transform: 'rotate(0)', transition: 'all 0.3s' }
								}
								className='chatButton'
							>
								<img src={More} alt='' />
							</button>
							{showModal && (
								<div className='chatModalSet'>
									{data.user.photoURL ? (
										<img src={data.user?.photoURL} alt='' />
									) : null}
									{data.user.displayName ? (
										<p>{data.user.displayName}</p>
									) : null}
									<button onClick={handleClear}>Clear messages</button>
								</div>
							)}
						</div>
					</div>
					<Messages />
					<Input />
				</>
			) : (
				<div className='messagesEd'>
					<h2 style={{ color: '#fff' }}>Welcome to Datr!</h2>
				</div>
			)}
		</div>
	)
}

export default Chat
