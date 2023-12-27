"use client"
import axios from 'axios';
import { useState } from 'react';

const CommentModal = ({ modal, setModal }) => {
  const [form, setForm] = useState({
    text: '',
    likes: 0,
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'likes' ? parseInt(value) : value
    });
  };

  const postComment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/comments', {
        text: form.text,
        likes: form.likes,
        image: form.image
      });
      // handle response
    } catch (error) {
      console.error(error)
    }
    setModal(false);
  };

  return (
      <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg shadow-lg w-1/2 ">
          <h2 className="font-bold text-lg mb-4 text-center">Post a Comment</h2>
          <form onSubmit={postComment}
            className="flex flex-col gap-20"
          >
            <input
              type="textarea"
              name="text"
              rows="4"
              cols="50"
              value={form.text}
              onChange={handleInputChange}
              placeholder="Comment text"
              className="input-class"
            />
            <input
              type="number"
              name="likes"
              value={form.likes}
              onChange={handleInputChange}
              placeholder="Likes"
              className="input-class"
            />
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleInputChange}
              placeholder="Image URL"
              className=""
            />
            <button type="submit" className="button-class">Post</button>
          </form>
          <button onClick={() => setModal(false)} className="button-class">
            Close
          </button>
        </div>
      </div>
    )
  
};

export default CommentModal;
