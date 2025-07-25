'use client'

export function ShopView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">🛍️ Present Shop</h2>
      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-white">Present shop functionality will be implemented here with:</p>
        <ul className="text-green-100 mt-2 space-y-1">
          <li>• Spend 100 jinglebells to open animated presents</li>
          <li>• Random cosmetic rewards with different rarities</li>
          <li>• Inventory management for unlocked items</li>
          <li>• Christmas-themed animations and effects</li>
        </ul>
      </div>
    </div>
  )
}

export function ChallengeView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">🎮 Daily Challenges</h2>
      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-white">Challenge system will be implemented here with:</p>
        <ul className="text-green-100 mt-2 space-y-1">
          <li>• 6 different challenge types (Photo, Trivia, Wordle, Crossword, Text, Custom)</li>
          <li>• Daily challenge progression (Dec 13-24)</li>
          <li>• Submission forms with media upload</li>
          <li>• Automatic scoring and jinglebell rewards</li>
          <li>• View other participants' submissions</li>
        </ul>
      </div>
    </div>
  )
}

export function ProfileView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">👤 Profile</h2>
      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-white">Profile functionality will be implemented here with:</p>
        <ul className="text-green-100 mt-2 space-y-1">
          <li>• Editable nickname and display preferences</li>
          <li>• Cosmetic inventory and nameplate customization</li>
          <li>• Badge collection and achievement tracking</li>
          <li>• Game statistics and performance history</li>
        </ul>
      </div>
    </div>
  )
}

export function AdminView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">👑 Admin Dashboard</h2>
      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-white">Admin functionality will be implemented here with:</p>
        <ul className="text-green-100 mt-2 space-y-1">
          <li>• Participant progress tracking and statistics</li>
          <li>• Custom challenge creation and editing</li>
          <li>• Manual scoring for text-response challenges</li>
          <li>• Game settings and configuration management</li>
          <li>• Free access code generation</li>
        </ul>
      </div>
    </div>
  )
}
