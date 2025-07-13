import React from 'react';

const CitizenAccount = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-8 text-center">My Account</h1>
      <div className="bg-card border border-border rounded-lg shadow-government-lg p-6 mb-8">
        <h2 className="text-xl font-heading font-semibold mb-4">User Info</h2>
        {/* TODO: Display and edit user info here */}
        <div className="text-muted-foreground font-body mb-2">User details will appear here.</div>
        <button className="bg-primary text-white px-4 py-2 rounded mt-2" disabled>Edit / Save</button>
      </div>
      <div className="bg-card border border-border rounded-lg shadow-government-lg p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">My Grievances</h2>
        {/* TODO: Display user's grievances here */}
        <div className="text-muted-foreground font-body">List of grievances will appear here.</div>
      </div>
    </div>
  );
};

export default CitizenAccount; 