const UserList = ({ users }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-cinzel text-[var(--color-text-primary)] mb-4">
        Online Users
      </h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 text-[var(--color-text-primary)]"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
      {users.length === 0 && (
        <p className="text-[var(--color-text-secondary)] text-sm">
          No users currently online
        </p>
      )}
    </div>
  );
};

export default UserList; 