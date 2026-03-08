# Realtime Collaborative Spreadsheet

This project is my submission for the **Trademarkia Frontend Engineering Assignment**.

The goal was to build a lightweight real-time collaborative spreadsheet similar to a simplified Google Sheets. The focus of this project was not just features, but thoughtful decisions around **state management, realtime synchronization, and user experience**.

The application is built using **Next.js (App Router), TypeScript, Tailwind CSS, and Firebase Firestore**.

## Live Demo

Live URL  
https://realtime-spreadsheet.vercel.app

Demo Video  
(Insert Loom link here)

GitHub Repository  
https://github.com/Gargi-155/realtime-spreadsheet

# Features

## Document Dashboard
The home screen lists all spreadsheets available in the system.

Users can:
- Create new sheets
- Rename existing sheets
- Delete sheets

Each sheet displays:
- Title
- Author
- Last modified timestamp

Firestore is used to store the document metadata.


## Spreadsheet Editor

The editor is a scrollable grid with:

- numbered rows
- lettered columns
- editable cells

Cells can contain raw values or formulas.

Example:
A1 = 10
A2 = 20
A3 = =SUM(A1:A2)


The formula engine supports:

- `=SUM(range)`
- arithmetic expressions
- cell references

The formula parser is intentionally lightweight and focuses on the minimal functionality required for spreadsheet behavior.


## Real-Time Collaboration

Real-time editing is powered by **Firestore snapshot listeners**.

When a user edits a cell:

1. The change is written to Firestore.
2. Firestore broadcasts the update to all connected clients.
3. All open sessions update instantly.

This allows multiple users to edit the same spreadsheet simultaneously.

A write-state indicator also informs users whether their changes have been saved.


## Presence System

Users currently viewing the same document are displayed in the interface.

Each user has:
- a unique name
- a persistent color

Presence information is stored in a document-specific Firestore collection:
presence/{docId}/users 


When a user opens a spreadsheet they are registered in this collection.  
When they leave, their presence record is removed.


## Identity

When a user first opens the application they are prompted to enter a display name.

The name and color are stored in **localStorage** and persist for the session.

This approach avoids the complexity of authentication while still enabling user identity during collaboration.


# Bonus Features

In addition to the required functionality, several bonus features were implemented to improve the usability of the spreadsheet.

### Keyboard Navigation
Users can navigate the grid using:

- Arrow keys
- Tab
- Enter

This mimics standard spreadsheet interaction.


### Column Resizing

Columns can be resized by dragging the column boundary.

Column widths are stored in Firestore so they persist across refreshes and across collaborators.


### Row Resizing

Rows can also be resized using drag handles.

Row heights are stored similarly to column widths.


### Infinite Rows

The grid expands automatically when the user scrolls near the bottom.

This allows the spreadsheet to grow dynamically without fixed limits.


### CSV Export

Users can export the spreadsheet contents as a `.csv` file.

This allows the data to be opened in Excel, Google Sheets, or other spreadsheet software.


# Architecture Decisions

### Why Firestore?

Firestore provides built-in real-time listeners through `onSnapshot`, which greatly simplifies collaborative applications.

Instead of managing WebSocket infrastructure manually, Firestore handles:

- state synchronization
- event broadcasting
- conflict resolution

This allows the frontend to remain relatively simple.

### Data Model

Documents are stored in the following structure:
documents/{documentId}
title
author
cells
colWidths
rowHeights
lastModified


Cells are stored in a key-value format:
cells: {
"A1": "10",
"A2": "20",
"A3": "=SUM(A1:A2)"
}


This structure allows easy lookup and updates without complex nested objects.


### Grid Rendering

The spreadsheet grid is implemented as a React component responsible for:

- rendering rows and columns
- tracking the active cell
- handling keyboard navigation
- syncing cell updates with Firestore

The grid state is kept minimal to ensure predictable updates.

# Tech Stack

Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend / Realtime
- Firebase Firestore

Deployment
- Vercel

# Running Locally

Clone the repository: 
git clone https://github.com/Gargi-155/realtime-spreadsheet


Install dependencies:

Run development server:
npm run dev

Open: 
Local host 



# Future Improvements

Some additional features that could be implemented:

- richer formula support
- cell formatting (bold, color, etc.)
- drag-reordering of columns
- authentication with Google


# Final Thoughts

This project focuses on building a clean, minimal collaborative spreadsheet while keeping the architecture simple and understandable.

The goal was to demonstrate:

- thoughtful frontend architecture
- real-time synchronization
- user-friendly spreadsheet interactions


