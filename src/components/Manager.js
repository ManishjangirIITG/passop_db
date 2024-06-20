import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';
import './Manager.css'


const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setpasswordArray(passwords)

    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('copied to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition: "Bounce",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        if (ref.current.src.includes("/images/eye-crossed-svgrepo-com.svg")) {
            passwordRef.current.type = "password"
            ref.current.src = "/images/eye-svgrepo-com.svg"
        }
        else {
            alert("Show the password")
            passwordRef.current.type = "text"
            ref.current.src = "/images/eye-crossed-svgrepo-com.svg"

        }
    }

    const savePassword = async () => {
        if (form.site.length > 0 && form.username.length > 0 && form.password.length > 0) {

            if (form.id) {
                // Update existing password
                await fetch("http://localhost:3000/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                });

                toast('Password Saved Successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    // transition: "Bounce",
                });

            }
            // const newPassword = {...form, id:uuidv4()};
            // setpasswordArray([...passwordArray, newPassword]);

            // If any such id exists in the db, delete it
            // await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            // setpasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            // await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPassword)});

            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form])

            // Otherwise clear the form and show toast            
            // setform({ site: "", username: "", password: "" })

            else {
                // Add new Password
                const newPassword = { ...form, id: uuidv4() };
                await fetch("http://localhost:3000/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPassword)
                });
                toast('Password Saved Successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    // transition: "Bounce",
                });
            }
            setform({site:"",username:"",password:""}); // clear form after save or update
            getPasswords(); ///Refresh the list
        }
        else {
            toast('Error: Password not saved', {
                theme: "dark",
            })
        }
    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id", id)
        let cfm = confirm("Do you really want to delete this password?")
        if (cfm) {
            setpasswordArray(passwordArray.filter(item => item.id !== id))
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            toast('Password Deleted Successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: "Bounce",
            });
        }
        else {
            console.log("Deletion of the password with id", id, "cancelled")
        }
    }

    const editPassword = async (id) => {
        console.log("Editing password with id", id)
        const passwordToEdit = passwordArray.find(item => item.id === id);
        if (passwordToEdit) {
            setform(passwordToEdit);
        }
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer />
            {/* <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-green-100 bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div> */}

            <div className="p-2 md:p-0 md:mycontainer min-h-[88vh]">
                <h1 className='text-3xl font-bold text-center'>
                    <span className="text-green-500">&lt;</span>
                    <span>Pass</span>
                    <span className="text-green-500">OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg  text-center'>Your own Password Manager</p>
                <div className="text-black flex flex-col p-4 gap-4 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1 text-black' type="text" name="site" id="site" />
                    <div className="flex flex-col md:flex-row w-full gap-3">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1 text-black' type="text" name='username' id='username' />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-6 py-1 text-black ' type="password" name='password' id='password' />
                            <span className='absolute right-[2px] top-[5px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={25} src="/images/eye-svgrepo-com.svg" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center bg-green-400 hover:bg-green-500 rounded-full px-4 py-1 w-fit gap-2'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>

                </div>

                <div className="passwords">
                    <h2 className='text-center font-bold text-xl py-2' >Your Passwords</h2>
                    {passwordArray.length === 0 && <div className='text-center py-4 text-lg font-bold '>No passwords to show</div>}
                    {passwordArray.length != 0 &&
                        <div className="table-responsive">

                            < table className="table-auto w-full overflow-hidden rounded-md my-4">
                                <thead className='bg-green-800 text-white'>
                                    <tr>
                                        <th className='py-2'>Site</th>
                                        <th className='py-2'>Username</th>
                                        <th className='py-2'>Password</th>
                                        <th className='py-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-green-100'>
                                    {passwordArray.map((item, index) => {
                                        return <tr key={index}>
                                            <td className='py-2 border border-white text-center my-4'>
                                                <div className='flex gap-3 items-center justify-center'>
                                                    <a href={item.site} target='_blank'>{item.site}</a>
                                                    <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.site) }}>
                                                        <lord-icon style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-2 border border-white text-center'>
                                                <div className='flex gap-3 items-center justify-center'>
                                                    <span>{item.username}</span>
                                                    <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.username) }}>
                                                        <lord-icon style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-2 border border-white text-center'>
                                                <div className='flex gap-3 items-center justify-center'>
                                                    <span>{"*".repeat(item.password.length)}</span>
                                                    <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.password) }}>
                                                        <lord-icon style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                    </div>
                                                    <div className="showpassword cursor-pointer" >

                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-2 border border-white text-center'>
                                                <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id) }}>
                                                    <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ "width": "20px", "height": "20px" }}>
                                                    </lord-icon>
                                                </span>
                                                <span className="cursor-pointer mx-1" onClick={() => { deletePassword(item.id) }}>
                                                    <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ "width": "20px", "height": "20px" }}>
                                                    </lord-icon>
                                                </span>
                                            </td>
                                        </tr>
                                    })}

                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div >

        </>
    )
}

export default Manager
