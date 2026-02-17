'use client'

import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 5;

  
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  
  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user, page]);

  const fetchBookmarks = async () => {
    if (!user) return;

    setActionLoading(true);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error.message);
    } else {
      setBookmarks(data || []);
    }

    setActionLoading(false);
  };

 
  const saveBookmark = async () => {
    if (!title || !url) {
      showToast("Enter title & URL");
      return;
    }

    if (!user) return;

    setActionLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from('bookmarks')
        .update({ title, url })
        .eq('id', editingId)
        .eq('user_id', user.id);

      if (error) showToast(error.message);
      else showToast("Updated!");
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert([{ title, url, user_id: user.id }]);

      if (error) showToast(error.message);
      else showToast("Added!");
    }

    cancelEdit();
    fetchBookmarks();
  };

  
  const deleteBookmark = async (id: string) => {
    if (!user) return;

    setActionLoading(true);

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) showToast(error.message);
    else showToast("Deleted");

    fetchBookmarks();
  };

  
  const editBookmark = (b: Bookmark) => {
    setTitle(b.title);
    setUrl(b.url);
    setEditingId(b.id);

    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  const cancelEdit = () => {
    setTitle('');
    setUrl('');
    setEditingId(null);
  };

 
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
  };

  
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch {
      return '';
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}

      {!user ? (
        <div className="flex flex-col items-center justify-center h-screen text-center px-6">

          <h1 className="text-4xl font-bold mb-4">
            🔖 Bookmark Manager
          </h1>

          <p className="text-gray-600 mb-6 max-w-md">
            Save, organize and access your favorite websites anytime, anywhere.
          </p>

          <button
            onClick={signIn}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded shadow-lg"
          >
            Login with Google
          </button>

        </div>
      ) : (

        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

       
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
            <h2 className="font-semibold text-lg">
              Welcome!! {user.email}
            </h2>

            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>

          
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />

          
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 flex-1 rounded"
            />

            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-2 flex-1 rounded"
            />

            <button
              onClick={saveBookmark}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Add"}
            </button>

          
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>

         
          {actionLoading && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          
          {bookmarks.length === 0 ? (
            <p>No bookmarks</p>
          ) : (
            <div className="space-y-3">
              {bookmarks
                .filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
                .map((b) => (
                  <div key={b.id} className="border p-3 flex justify-between items-center rounded">

                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={getFavicon(b.url)} className="w-5 h-5" />

                      <a
                        href={b.url.startsWith('http') ? b.url : `https://${b.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 truncate"
                      >
                        {b.title}
                      </a>
                    </div>

                    <div className="flex gap-2">

  <button
    onClick={() => editBookmark(b)}
    className="border border-green-500 text-green-600 px-3 py-1 rounded hover:bg-green-500 hover:text-white transition"
  >
    Edit
  </button>

  <button
    onClick={() => deleteBookmark(b.id)}
    className="border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
  >
    Delete
  </button>

</div>


                  </div>
                ))}
            </div>
          )}

          
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Prev
            </button>

            <span>Page {page}</span>

            <button
              onClick={() => setPage(prev => prev + 1)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Next
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
