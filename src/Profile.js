import React, { useState } from "react";
import Link from 'react-router-dom';
import api from "./api";

const Profile = ({auth, updateAuth, bookmarks})=>{
    const [editUsername, setEditUsername] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [newUsername, setNewUsername] = useState(auth.username);
    const [newEmail, setNewEmail] = useState(auth.email);
    const [newPassword, setNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState(null);

    const updateUsername = async()=> {
        await api.updateProfile(newUsername, auth.email);
        setEditUsername(false);
        updateAuth({ ...auth, username: newUsername });
    };

    const updateEmail = async()=> {
        await api.updateProfile(auth.username, newEmail);
        setEditEmail(false);
        updateAuth({ ...auth, email: newEmail });
    };

    const updatePassword = async () => {
        try {
          await api.updatePassword(newPassword);
          console.log('Password updated successfully');
          setPasswordStatus('success');
          setNewPassword('');
        } catch (error) {
          console.error('Password update failed:', error);
          setPasswordStatus('error');
          throw error;
        }
      };

    return(
        <div>
            <h3>Username: { auth.username } {' '}
            { !editUsername && (
                 <button onClick={ ()=> setEditUsername(true) }>Edit</button>
            )}
            </h3>
            { editUsername && (
                <>
                    <input
                        type="text"
                        placeholder="new username"
                        value={ newUsername }
                        onChange={ ev => setNewUsername(ev.target.value)}
                    />
                    {' '} <button onClick={ updateUsername }>Save</button> {' '}
                    <button onClick={ ()=> setEditUsername(false) }>Cancel</button>
                </>
            )}

            <h3>Email: { auth.email } {' '}
            { !editEmail && (
                <button onClick={ ()=> setEditEmail(true) }>Edit</button>   
            )}            
            </h3>
            { editEmail && (
                <>
                    <input
                        type="email"
                        placeholder="new email"
                        value={ newEmail }
                        onChange={ ev => setNewEmail(ev.target.value)}
                    />
                    {' '} <button onClick={ updateEmail }>Save</button> {' '}
                    <button onClick={ ()=> setEditEmail(false) }>Cancel</button>
                </>
            )}

            <h3>Password: ***** {' '}
            { !editPassword && (
                <button onClick={ ()=> setEditPassword(true) }>Edit</button>  
            )}            
            </h3>
            { editPassword && (
                <>
                    <input
                        type="password"
                        placeholder="new password"
                        value={ newPassword }
                        onChange={ ev => setNewPassword(ev.target.value)}
                    />
                    {' '} <button onClick={ updatePassword }>Save</button> {' '}
                    <button onClick={ ()=> setEditPassword(false) }>Cancel</button>
                    { passwordStatus === 'success' && <div>Password updated successfully!</div> }
                    { passwordStatus === 'error' && <div>Password update failed.</div> }
                </>
            )}
            <hr/>
            <h4>Bookmarked Items</h4>
            <ul>
                {
                    bookmarks.map(bookmark =>{
                        return(
                            <li key = { bookmark.id }>
                             { bookmark.product_name}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default Profile;