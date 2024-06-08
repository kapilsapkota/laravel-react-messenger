import { Head } from '@inertiajs/react';
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {useEffect, useRef, useState} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid/index.js";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
function Home({ selectedConversation = null,  messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messageCtrRef = useRef(null)

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : [])
    }, [messages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className={"w-32 h-32 inline-block"}></ChatBubbleLeftRightIcon>
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader selectedConversation={selectedConversation} />

                    <div ref={messageCtrRef} className={"flex-1 overflow-y-auto p-5"}>
                    {/*    If no messages display no messages */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No Messages Found
                                </div>
                            </div>
                        )}

                    {/*    If Messages found, display them*/}
                        {localMessages.length > 0 && (
                            <div className="flex flex-1 flex-col">
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/*<MessageInput conversation={selectedConversation} />*/}
                </>
            )}
        </>
    );
}

Home.layout = (page) => {
    return <AuthenticatedLayout user={page.props.auth.user}>
        <ChatLayout children={page}></ChatLayout>
    </AuthenticatedLayout>
}

export default Home;
