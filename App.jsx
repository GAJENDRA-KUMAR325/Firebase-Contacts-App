import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import {FiSearch} from "react-icons/fi"
import {AiFillPlusCircle} from "react-icons/ai"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {collection, getDocs, onSnapshot} from 'firebase/firestore'
import { db } from './config/firebase'
import {HiOutlineUserCircle} from "react-icons/hi"
import {IoMdTrash} from "react-icons/io"
import {RiEditCircleLine} from "react-icons/ri"
import ContactCard from './components/ContactCard'
import Model from './components/Model'
import AddAndUpdateContext from './components/AddAndUpdateContext'
import NotFoundContact from './components/NotFoundContact';
const App = () => {
  const [contacts,setContacts] = useState([]);
  const [isOpen,setOpen] = useState(false);
  const onOpen = () =>{
    setOpen(true)
  }
  const onClose = () =>{
    setOpen(false);
  }
  useEffect(()=>{
    const getContacts = async()=>{
      try {
        const contactsRef = collection(db,"contacts");
        const contactSnapshot = await getDocs(contactsRef);
        onClose();
        onSnapshot(contactsRef,(snapshot) =>{
        const contactLists = snapshot.docs.map((doc)=>{
            return {
              id:doc.id,
              ...doc.data(),
            }
          })
          setContacts(contactLists);
          return contactLists;
        })
      } catch (error) {
        
      }
    }
    getContacts();
  },[])
  const filterContacts = (e) =>{
    const value = e.target.value;
    const contactsRef = collection(db,"contacts");
        onSnapshot(contactsRef,(snapshot) =>{
        const contactLists = snapshot.docs.map((doc)=>{
            return {
              id:doc.id,
              ...doc.data(),
            }
          })
          const filteredContacts = contactLists.filter(contact =>contact.name.toLowerCase().includes(value.toLowerCase()))
          setContacts(filteredContacts);

          return filteredContacts;
        });
  };
  return (
    <>
    <div className='max-w-[370px] mx-auto px-4'>
      <Navbar />
      <div className='flex relative items-center'>
        <FiSearch className='text-white text-3xl absolute ml-1'/>
        <input onChange={filterContacts} type="text" className="bg-transparent border border-white rounded-md 
        h-10 flex-grow text-white pl-10"/>
        <div>
          <AiFillPlusCircle onClick={onOpen} className='text-white text-5xl pl-2 cursor-pointer' />
        </div>
      </div>
      <div className='mt-4 gap-3 flex flex-col'>
        { contacts.length<=0 ? <NotFoundContact /> :
          contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact}/>
          ))
        }
      </div>
    </div>
    <AddAndUpdateContext onClose={onClose} isOpen={isOpen}/>
    <ToastContainer position='bottom-center'/>
    </>
  )
}

export default App