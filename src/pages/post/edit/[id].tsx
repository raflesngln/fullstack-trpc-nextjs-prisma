import React, { useEffect, useState } from 'react';
import NextError from 'next/error';
import Link from 'next/link';
import { inferProcedureInput } from '@trpc/server';

import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { RouterOutput, trpc } from '~/utils/trpc';

type PostByIdOutput = RouterOutput['post']['byId'];

function FormEdit(props: { post: PostByIdOutput }) {
  const router = useRouter();
  const utils = trpc.useContext();

  const updatePost = trpc.post.update.useMutation(); // Create a mutation function for updating a post
  const { post: initialPost } = props; // Destructure the post from props

  const [idPost, setidPost] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  //   const [editingPost, setEditingPost] = useState<{
  //     id: string;
  //     title: string;
  //     text: string;
  //   } | null>(null);

  const fetchPost = async () => {
    try {
      //   const response = await trpc.post.byId({ id: post.id });
      setidPost(post.id);
      setTitle(post.title);
      setText(post.text);
    } catch (error) {
      console.error(error);
    }
    console.log('data PROPSSS' + JSON.stringify(post.id));
  };

  useEffect(() => {
    if (post.id) {
      fetchPost();
    }
  }, [initialPost]);

  const handleEditClick = (post: {
    id: string;
    title: string;
    text: string;
  }) => {
    // setEditingPost(post);
    setidPost(post.id);
    setText(post.text);
    setTitle(post.title);
  };

  const handleUpdatePost = async () => {
    if (!title) return;

    try {
      await updatePost.mutateAsync({
        id: idPost,
        title: title,
        text: text,
      }); // Use the updatePost mutation function
      console.log('Post updated');
      setidPost('');
      setText('');
      setTitle('');
      router.push('/')
    } catch (error) {
      console.error(error);
      // Handle error, show an error notification, etc.
    }
  };

  const { post } = props;
  return (
    <div className="flex flex-col justify-center h-full px-8 ">
      <Link className="text-gray-300 underline mb-4" href="/">
        Home
      </Link>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <em className="text-gray-400">
        Created {post.createdAt.toLocaleDateString('en-us')}
      </em>

      <p className="py-4 break-all">{post.text}</p>

      <h2 className="text-2xl font-semibold py-2">Edit Data</h2>
      <div>
        <input
          className="focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
          id="title"
          value={title}
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
          id="text"
          value={text}
          placeholder="Text"
          rows={6}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-center">
          <button onClick={handleUpdatePost}>Update</button>
        </div>
      </div>
    </div>
  );
}

const PostEdit: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.post.byId.useQuery({ id });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return (
      <div className="flex flex-col justify-center h-full px-8 ">
        <div className="w-full bg-zinc-900/70 rounded-md h-10 animate-pulse mb-2"></div>
        <div className="w-2/6 bg-zinc-900/70 rounded-md h-5 animate-pulse mb-8"></div>

        <div className="w-full bg-zinc-900/70 rounded-md h-40 animate-pulse"></div>
      </div>
    );
  }
  const { data } = postQuery;
  return <FormEdit post={data} />;
};

export default PostEdit;
