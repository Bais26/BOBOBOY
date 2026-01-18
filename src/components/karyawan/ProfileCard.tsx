export default function ProfileCard({ profile }: { profile: any }) {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-200" />
      <div>
        <p className="text-xs text-gray-500 uppercase">{profile.role}</p>
        <h2 className="font-semibold text-lg">
          {profile.full_name}
        </h2>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
    </div>
  );
}
