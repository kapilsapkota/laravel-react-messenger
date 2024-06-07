import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import TextInput from "@/Components/TextInput.jsx";
import {PencilSquareIcon} from "@heroicons/react/16/solid/index.js";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
const ChartLayout = ({children}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([])
    const [sortedConversations, setSortedConversations] = useState([])
    const [onlineUsers, setOnlineUsers] = useState({})
    const isUserOnline = (userId) => onlineUsers[userId]

    console.log("conversation", conversations)
    console.log("selectedConversation", selectedConversation)

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(conversations.filter((conversation)=>{
            return conversation.name.toLowerCase().includes(search);
        }))
    }

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b) => {
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                }else if (a.blocked_at){
                    return 1;
                }else if(b.blocked_at){
                    return -1;
                }
                if(a.last_message_date && b.last_message_date){
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                }
                else if(a.last_message_date){
                    return -1;
                } else if(b.last_message_date){
                    return 1;
                }else {
                    return 0;
                }
                }
            )
        );
    }, [localConversations])

    useEffect(() => {
        setLocalConversations(conversations)
    }, [conversations]);

    useEffect(() => {
        console.log('ChatLayout Mounted')
        console.log(conversations)
        console.log(selectedConversation)
        Echo.join('online')
            .here((users)=>
            {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user)=> [user.id, user]));

                setOnlineUsers((previousOnlineUsers)=> {
                    return {...previousOnlineUsers, ...onlineUsersObj}
                })
            })
            .joining((user) =>
                setOnlineUsers((previousUsers) => {
                    const updatedUsers = {...previousUsers}
                    updatedUsers[user.id] = user
                    return updatedUsers;
                    }

                ))
            .leaving((user)=>
                setOnlineUsers((previousUsers) => {
                        const updatedUsers = {...previousUsers}
                        delete updatedUsers[user.id]
                        return updatedUsers;
                    }
                ))
            .error((error) => console.log('error', error));

        return () => {
            Echo.leave('online');
        }
    }, []);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800
                flex-col flex overflow-hidden ${selectedConversation ? '-ml-[100%] sm:ml-0' : ''}`}>
                    <div className="flex items-center justify-between text-gray-200 py-2 px-3 text-xl font-medium">
                        My Conversations
                        <div className="tooltip tooltip-left" data-tip={'Create New Group'}>
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2"></PencilSquareIcon>
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter Users"
                            className="w-full">

                        </TextInput>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations && sortedConversations.map((conversation)=>(
                            <ConversationItem
                            key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}`}
                            conversation={conversation}
                            online={!!isUserOnline(conversation.id)}
                            selectedConversation={selectedConversation}>

                            </ConversationItem>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
};

export default ChartLayout;
