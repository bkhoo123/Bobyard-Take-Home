"use client"
import Image from 'next/image';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CommentModal from '@/components/commentModal';

export default function Home() {
  const [comments, setComments] = useState([]);
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    id: null,
    text: '',
    likes: null,
    image: ''
  });

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get('http://localhost:5000/comments');
      setComments(response.data);
    };
    fetchComments();
  }, []);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + date.toLocaleTimeString();
  };

  const toggleModal = () => {
    setModal(!modal)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'likes' ? parseInt(value) : value
    });
  };

  const postComment = async (e) => {
    e.preventDefault(); 
  
    try {
      let response;
      
      if (form.id) {
        response = await axios.patch('http://localhost:5000/comments', {
          id: form.id,
          text: form.text,
          likes: form.likes,
          image: form.image
        });
      } else {
        response = await axios.post('http://localhost:5000/comments', {
          text: form.text,
          likes: form.likes,
          image: form.image
        });
      }
      console.log(response.data);

      const fetchComments = async () => {
        const response = await axios.get('http://localhost:5000/comments');
        setComments(response.data);
      };
      
      fetchComments();
    } catch (error) {
      console.error('Error:', error);
    }
  
    setForm({ text: '', likes: 0, image: '' });
    setModal(false);
  };

  const editComment = (comment) => {
    setForm({
      id: comment.id, 
      text: comment.text,
      likes: comment.likes,
      image: comment.image
    });
    setModal(true);
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/comments`, { data: { id: commentId } });
  
      console.log(response.data);

      const fetchComments = async () => {
        const response = await axios.get('http://localhost:5000/comments');
        setComments(response.data);
      };

      
      fetchComments();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  

  return (
    <main className="my-12 mx-20">
      <h3 className="flex items-center justify-center text-2xl font-bold my-4">Bobyard Full Stack Project</h3>
      <div className="flex justify-center my-4">
        <button onClick={toggleModal} className="px-6 py-2 bg-teal-500 text-white font-bold rounded hover:bg-stone-500 transition duration-300">
          Post Comment
        </button>

        {modal && 
          (
            <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-lg shadow-lg w-1/2 ">
                <h2 className="font-bold text-lg mb-4 text-center">Post a Comment</h2>
                <form onSubmit={postComment}
                  className="flex flex-col gap-6"
                >
                  <textarea
                    type="textarea"
                    name="text"
                    rows="5"
                    cols="50"
                    value={form.text}
                    onChange={handleInputChange}
                    placeholder="Enter your comment in here"
                    className="p-4 border-2 border-teal-600 rounded-md"
                  />
                  <input
                    type="number"
                    name="likes"
                    value={form.likes}
                    onChange={handleInputChange}
                    placeholder="Enter the amount of likes the comment has received. It will default at 0"
                    className="p-2 border-2 border-teal-600 rounded-md"
                  />
                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleInputChange}
                    placeholder="Place your Image URL here if you have one"
                    className="p-2 border-2 border-teal-600 rounded-md"
                  />
                  <div className="flex space-x-8 items-center justify-center">
                    <button onClick={() => setModal(false)} className="p-2 bg-rose-500 text-white font-semibold rounded-md hover:bg-stone-500 transition duration-300 ">
                      Close
                    </button>
                    <button type="submit" className="p-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-stone-500 transition duration-300">Post</button>
                  </div>

                </form>

              </div>
            </div>
          )        
        }
      </div>
      <div className="flex flex-wrap -mx-2">
        {comments.map((comment, index) => (
          <div key={index} className="w-1/2 p-12 h-[500px] border-2 border-teal-600 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex space-x-10 items-center">
                  <p className="text-2xl font-bold">{comment.author}</p>
                  {comment.image && (
                    <img 
                      src={comment.image}
                      alt={`${comment.author}'s post image`}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                  )}
                </div>
            
                <div className="flex space-x-4">
                  <button onClick={() => editComment(comment)} className="p-2 text-teal-400 font-semibold hover:bg-stone-200 rounded-md text-lg">Edit</button>
                  <button onClick={() => deleteComment(comment.id)} className="p-2 text-rose-400 font-semibold text-lg hover:bg-stone-200 rounded-md">Delete</button>
                </div>
              </div>
              
              <p className="py-4">{comment.text}</p>

              <div className="space-y-4">

                <div className="font-semibold">❤️ {comment.likes} Likes</div>
                <div><span className="font-semibold">Posted:</span> {formatDate(comment.date)}</div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </main>
  );
}


// Part 2: Frontend setup 
// Please create a simple React.js page displaying these comments. We are judging the code quality/readability and design of the page. 

// Requirements:
// Get the data from the backend
// Need to display the text, author, date, likes, and images for the comments 
// Clean design

// Part 3: Frontend edit, add, and delete 
// Now add edit, add, and delete functionality to comments (pretend that the user is the admin and can change any of the comments). Use the APIs you just made in the backend. 

// Requirements:
// Edit text of existing comments 
// Add a comment with new text (from “Admin” user), with the current time
// Delete comments 
