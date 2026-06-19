import { UserProfile } from "@clerk/clerk-react";

export default function Profile() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <UserProfile />
    </div>
  );
}