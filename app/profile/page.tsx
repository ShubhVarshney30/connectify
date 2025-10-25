"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Camera, MapPin, Link as LinkIcon, Calendar, Award, Edit2, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, useRequireAuth } from "@/hooks/use-auth"
import { ProfileService } from "@/lib/database/services"
import { BadgeService } from "@/lib/database/services"
import type { Badge } from "@/types/database"
import { AppShell } from "@/components/layout/app-shell"

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    website: profile?.website || "",
    phone: profile?.phone || "",
  })
  const [badges, setBadges] = useState<Badge[]>([])

  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        phone: profile.phone || "",
      })
    }
  })

  useState(async () => {
    const allBadges = await BadgeService.getAllBadges()
    setBadges(allBadges)
  })

  const handleSave = async () => {
    if (!user || !profile) return

    setIsSaving(true)
    try {
      const { error } = await updateProfile(formData)
      if (!error) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      website: profile?.website || "",
      phone: profile?.phone || "",
    })
    setIsEditing(false)
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-primary to-primary/80 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-6 text-white">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile"}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-2xl font-bold">{profile.full_name || "Anonymous"}</h1>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 border border-white/50 text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-white/50 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-white/90 mb-2">{profile.email}</p>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {profile.points || 0} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {profile.bio || "No bio added yet."}
                  </p>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4">Community Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.points || 0}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Verified</span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    profile.is_verified ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {profile.is_verified && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification Level</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    profile.verification_level === 'premium' ? 'bg-purple-100 text-purple-800' :
                    profile.verification_level === 'verified' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.verification_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Badges */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Recent Badges</h3>
              {badges.length > 0 ? (
                <div className="space-y-3">
                  {badges.slice(0, 3).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No badges earned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
