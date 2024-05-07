import {useState, useEffect} from "react"
import Note from "../components/Note.jsx"
import api from "../api"
import "../styles/Home.css"

function Home() {
    const [notes, setNotes] = useState([])
    const [users, setUser] = useState([])
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    useEffect(() => {
        getNotes();
        getUsers()
    }, [])
    
    const getUsers = () => {
        api
            .get("api/users/")
            .then((res) => res.data)
            .then((data) => {setUser(data); console.log(data)})
            .catch((err) => alert("getUsers Error:"+err))
    }

    const getNotes = () => {
        api
            .get("api/notes/")
            .then((res) => res.data)
            .then((data) => {setNotes(data); console.log(data)})
            .catch((err) => alert("getNotes Error:"+err))
    }

    const deleteNote = (id) => {
        api
            .delete(`api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!")
                else alert("Failed to delete notes")
                getNotes()
            }).catch((error) => alert(error))
    }

    const createNote = (e) => {
        e.preventDefault()
        api
            .post("api/notes/", {content, title})
            .then((res) => {
                if (res.status === 201) alert("Created Note")
                else alert("Failed to create note")
                getNotes()
            })
            .catch((err) => alert(err))
    }


    return (
    <div>
        <div>
            <h2>Users</h2>
            {users.map((user) => (
                <p>{user.username}</p>
            ))}
        </div>
        <div>
            <h2>Notes</h2>
            {notes.map((note) => (
                <Note note={note} onDelete={deleteNote} key={note.id} />
            ))}
        </div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
            <label htmlFor="title">Title: </label>
            <br/>
            <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label htmlFor="content">Content: </label>
            <br/>
            <textarea
                id="content"
                name="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <br/>
            <input
                type="submit"
                value="submit"/>
        </form>
    </div>)
}

export default Home