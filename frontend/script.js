document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('mcqFile')?.files?.[0];
    if (!file) return alert('Please choose a file');

    const fd = new FormData();
    fd.append('mcqFile', file);

    try {
      const res = await fetch('http://localhost:3000/api/upload-mcqs', { method:'POST', body: fd });
      const data = await res.json();
      alert(data.message || 'Uploaded');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('File upload failed.');
    }
  });
});
const token = localStorage.getItem('token');
const res = await fetch('http://localhost:3000/api/upload-mcqs', {
  method: 'POST',
  headers: { 'x-auth-token': token },
  body: fd
});
localStorage.setItem('token', data.token);
localStorage.setItem('userId', data.userId);
localStorage.setItem('role', data.isAdmin ? 'admin' : 'user');

