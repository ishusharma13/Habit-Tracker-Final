import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

function Notes() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const handleAddNote = () => {
    if (note) {
      setNotes([...notes, note]);
      setNote('');
    }
  };

  return (
    <Paper style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '20px auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Notes
      </Typography>
      <TextField
        label="Write a note"
        variant="outlined"
        fullWidth
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleAddNote}>
        Add Note
      </Button>
      <List>
        {notes.map((n, index) => (
          <ListItem key={index}>
            <ListItemText primary={n} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default Notes;
