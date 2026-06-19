import { UserProfile } from "@clerk/clerk-react";

export default function ProfileScreen() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <UserProfile />
    </div>
  );
}