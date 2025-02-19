"use client"

import { Button } from "@/components/ui/button"

export default function ExperienceActions({ experienceId }: { experienceId: string }) {
  async function approveExperience(id: string) {
    try {
      const response = await fetch(`/api/experiences/${id}/approve`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to approve experience")
      // Refresh the data or update the UI as needed
      window.location.reload()
    } catch (error) {
      console.error("Error approving experience:", error)
      // Show an error message to the user
    }
  }

  async function rejectExperience(id: string) {
    try {
      const response = await fetch(`/api/experiences/${id}/reject`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to reject experience")
      // Refresh the data or update the UI as needed
      window.location.reload()
    } catch (error) {
      console.error("Error rejecting experience:", error)
      // Show an error message to the user
    }
  }

  return (
    <>
      <Button variant="default" onClick={() => approveExperience(experienceId)}>
        Approve
      </Button>
      <Button variant="destructive" onClick={() => rejectExperience(experienceId)}>
        Reject
      </Button>
    </>
  )
}