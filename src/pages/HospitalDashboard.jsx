// ─────────────────────────────────────────────────────────────────────────────
// HospitalDashboard.jsx
//
// The main page for a logged-in hospital user.
// Responsibilities:
//   1. Show a summary of all blood requests raised by this hospital
//   2. Allow the hospital to raise a new blood request
//   3. Allow the hospital to cancel a pending request
//
// Flow:
//   Hospital fills the form → POST /hospital/{id}/request
//   → Backend finds eligible donors within radiusKm using Haversine formula
//   → Donors get email notifications
//   → Hospital sees updated request list with status badges
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// ─── Constants ───────────────────────────────────────────────────────────────

// All 8 blood types — must match the backend BloodType enum exactly
const BLOOD_TYPES = [
  'A_POSITIVE',  'A_NEGATIVE',
  'B_POSITIVE',  'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE',
  'O_POSITIVE',  'O_NEGATIVE',
]

// Urgency levels — must match the backend UrgencyLevel enum exactly
const URGENCY_LEVELS = ['LOW', 'MEDIUM', 'HIGH']

// Slider range constants — makes the math readable and easy to change
const RADIUS_MIN     = 1   // km
const RADIUS_MAX     = 20  // km
const RADIUS_DEFAULT = 5   // km

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts a blood type enum string to a short display label.
 * Used inside the blood type badge on each request card.
 *
 * Examples:
 *   AB_POSITIVE → AB+
 *   O_NEGATIVE  → O−
 *   B_POSITIVE  → B+
 */
const btShort = (bt) =>
  bt.replace('_POSITIVE', '+').replace('_NEGATIVE', '−').replace('_', '')

/**
 * Converts a slider value to a percentage position along the track.
 * Used to align the scale labels (1km / 5km / 10km / 20km) directly
 * under their correct position on the slider.
 *
 * Formula: (value - min) / (max - min) * 100
 * Examples with min=1 max=20:
 *   value=1  → 0%
 *   value=5  → 21%
 *   value=10 → 47%
 *   value=20 → 100%
 */
const sliderPercent = (value) =>
  ((value - RADIUS_MIN) / (RADIUS_MAX - RADIUS_MIN)) * 100

/**
 * Returns a Tailwind CSS class string for the urgency badge color.
 * HIGH   → red
 * MEDIUM → yellow
 * LOW    → green
 */
const urgencyColor = (urgency) => ({
  HIGH:   'bg-red-100 text-red-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW:    'bg-green-100 text-green-700',
})[urgency] ?? 'bg-gray-100 text-gray-600'

/**
 * Returns a Tailwind CSS class string for the status badge color.
 * PENDING   → yellow
 * FULFILLED → green
 * CANCELLED → gray
 */
const statusColor = (status) => ({
  PENDING:   'bg-yellow-100 text-yellow-800',
  FULFILLED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
})[status] ?? 'bg-gray-100 text-gray-500'

// ─── Component ───────────────────────────────────────────────────────────────

export default function HospitalDashboard() {

  // useAuth gives us the logged-in hospital's id, name, role from the JWT context
  const { user } = useAuth()

  // Full list of blood requests raised by this hospital, fetched from backend
  const [requests, setRequests] = useState([])

  // Whether the "New Blood Request" form is visible
  const [showForm, setShowForm] = useState(false)

  // Feedback message shown after raise/cancel actions
  // e.g. "✅ Request raised!" or "❌ Failed to raise request"
  const [message, setMessage] = useState('')

  // Form state — these fields map 1:1 to the BloodRequestDTO sent to backend
  const [form, setForm] = useState({
    bloodType:    'A_POSITIVE',    // which blood type the hospital needs
    urgencyLevel: 'HIGH',          // how urgent the request is
    unitsNeeded:  1,               // number of blood units needed
    notes:        '',              // optional extra info for donors
    radiusKm:     RADIUS_DEFAULT,  // search radius — donors within this distance get notified
  })

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  /**
   * Fetches all blood requests for this hospital from the backend.
   * Called on mount and after every raise/cancel action to keep the list fresh.
   *
   * GET /hospital/{id}/requests
   * Returns: BloodRequest[]
   */
  const fetchRequests = async () => {
    try {
      const res = await api.get(`/hospital/${user.id}/requests`)
      setRequests(res.data)
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    }
  }

  // Fetch on initial page load
  useEffect(() => {
    fetchRequests()
  }, [])

  // ─── Actions ────────────────────────────────────────────────────────────────

  /**
   * Submits a new blood request to the backend.
   *
   * POST /hospital/{id}/request
   * Body: BloodRequestDTO { bloodType, urgencyLevel, unitsNeeded, notes, radiusKm }
   *
   * On success:
   *   - Backend triggers donor matching + email notifications
   *   - Form is hidden
   *   - Request list is refreshed
   *   - Success message is shown for 4 seconds
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/hospital/${user.id}/request`, form)
      setMessage('✅ Request raised! Donors are being notified.')
      setShowForm(false)
      fetchRequests()
      setTimeout(() => setMessage(''), 4000)
    } catch {
      setMessage('❌ Failed to raise request. Please try again.')
    }
  }

  /**
   * Cancels a PENDING blood request.
   * Only PENDING requests can be cancelled — FULFILLED ones are locked.
   *
   * PUT /hospital/{id}/request/{requestId}/cancel
   * On success: refreshes the list, shows success message for 3 seconds
   */
  const cancelRequest = async (requestId) => {
    try {
      await api.put(`/hospital/${user.id}/request/${requestId}/cancel`)
      setMessage('✅ Request cancelled.')
      fetchRequests()
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('❌ Failed to cancel request.')
    }
  }

  /**
   * Resets the form back to its default values.
   * Called when the hospital clicks "Cancel" on the form.
   */
  const resetForm = () => {
    setForm({
      bloodType:    'A_POSITIVE',
      urgencyLevel: 'HIGH',
      unitsNeeded:  1,
      notes:        '',
      radiusKm:     RADIUS_DEFAULT,
    })
    setShowForm(false)
  }

  // ─── Derived Stats ──────────────────────────────────────────────────────────

  // Count requests by status for the summary cards at the top
  const stats = {
    total:     requests.length,
    pending:   requests.filter(r => r.status === 'PENDING').length,
    fulfilled: requests.filter(r => r.status === 'FULFILLED').length,
    cancelled: requests.filter(r => r.status === 'CANCELLED').length,
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 w-full">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      {/*    Left: title + today's date   Right: "Raise Request" toggle button  */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Blood Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year:    'numeric',
              month:   'long',
              day:     'numeric',
            })}
          </p>
        </div>

        {/* Clicking this toggles the New Request form below */}
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <span className="text-base leading-none">+</span>
          Raise Request
        </button>
      </div>

      {/* ── Feedback Message ────────────────────────────────────────────────── */}
      {/*    Shown after raise or cancel actions, auto-clears after a few seconds */}
      {message && (
        <div className="mb-4 text-sm px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700">
          {message}
        </div>
      )}

      {/* ── New Blood Request Form ───────────────────────────────────────────── */}
      {/*    Only rendered when showForm is true (toggled by the header button)  */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">New Blood Request</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

            {/* Blood Type ── which blood type the hospital needs */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Blood Type</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                value={form.bloodType}
                onChange={e => setForm({ ...form, bloodType: e.target.value })}
              >
                {BLOOD_TYPES.map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>

            {/* Urgency Level ── how critical the need is */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Urgency</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                value={form.urgencyLevel}
                onChange={e => setForm({ ...form, urgencyLevel: e.target.value })}
              >
                {URGENCY_LEVELS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* Units Needed ── how many blood units are required */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Units Needed</label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                value={form.unitsNeeded}
                onChange={e => setForm({ ...form, unitsNeeded: parseInt(e.target.value) })}
              />
            </div>

            {/* Notes ── optional message visible to donors */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
              <input
                type="text"
                placeholder="e.g. Required for surgery at 3pm"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {/* ── Search Radius Slider ───────────────────────────────────────── */}
            {/*                                                                   */}
            {/*   Controls how far to search for eligible donors.                */}
            {/*   This value (radiusKm) is sent to the backend.                  */}
            {/*   Backend uses the Haversine formula to check each donor's       */}
            {/*   distance from the hospital and only notifies those within       */}
            {/*   this radius.                                                    */}
            {/*                                                                   */}
            {/*   Range: 1km → 20km   Default: 5km                               */}
            {/*                                                                   */}
            {/*   Scale label positioning:                                        */}
            {/*   Labels are placed using absolute % positions, NOT justify-      */}
            {/*   between, because the range is 1–20 (not 0–20), so equal        */}
            {/*   spacing would put labels in the wrong place visually.           */}
            {/*                                                                   */}
            {/*   Formula: (value - min) / (max - min) * 100                     */}
            {/*     1km  → 0%    (left edge)                                      */}
            {/*     5km  → 21%   ((5-1)/(20-1)*100)                              */}
            {/*     10km → 47%   ((10-1)/(20-1)*100)                             */}
            {/*     20km → 100%  (right edge)                                    */}
            {/* ────────────────────────────────────────────────────────────────  */}
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">
                Search Radius
                <span className="text-gray-400 font-normal ml-1">
                  (default {RADIUS_DEFAULT}km)
                </span>
              </label>

              {/* Slider row: [track] [live value] [reset button] */}
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={RADIUS_MIN}
                  max={RADIUS_MAX}
                  step="1"
                  className="flex-1 accent-red-600"
                  value={form.radiusKm}
                  onChange={e =>
                    setForm({ ...form, radiusKm: parseInt(e.target.value) })
                  }
                />

                {/* Live readout of the currently selected radius */}
                <span className="text-sm font-medium text-red-600 w-16 text-center">
                  {form.radiusKm} km
                </span>

                {/* Resets radius back to 5km without clearing other fields */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, radiusKm: RADIUS_DEFAULT })}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Reset
                </button>
              </div>

              {/* Scale labels — absolutely positioned to match actual slider values */}
              <div className="relative h-4 mt-1 text-xs text-gray-300">
                {/* 1km — anchored to the left edge */}
                <span
                  className="absolute"
                  style={{ left: `${sliderPercent(1)}%` }}
                >
                  1km
                </span>
                {/* 5km — centered at 21% */}
                <span
                  className="absolute -translate-x-1/2"
                  style={{ left: `${sliderPercent(5)}%` }}
                >
                  5km
                </span>
                {/* 10km — centered at 47% */}
                <span
                  className="absolute -translate-x-1/2"
                  style={{ left: `${sliderPercent(10)}%` }}
                >
                  10km
                </span>
                {/* 20km — anchored to the right edge */}
                <span
                  className="absolute -translate-x-full"
                  style={{ left: `${sliderPercent(20)}%` }}
                >
                  20km
                </span>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Summary Stats ───────────────────────────────────────────────────── */}
      {/*    Four cards showing request counts by status                        */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Requests', value: stats.total,     color: 'text-gray-900'  },
          { label: 'Pending',        value: stats.pending,   color: 'text-red-600'   },
          { label: 'Fulfilled',      value: stats.fulfilled, color: 'text-green-600' },
          { label: 'Cancelled',      value: stats.cancelled, color: 'text-gray-400'  },
        ].map(card => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="text-xs text-gray-500 mb-1">{card.label}</div>
            <div className={`text-2xl font-medium ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ── Requests List ───────────────────────────────────────────────────── */}
      {/*    Shows all requests as rows sorted by most recent first             */}
      {/*    Each row shows: blood type badge, date, urgency, status, cancel    */}
      <div className="bg-white border border-gray-200 rounded-xl">

        {/* List header */}
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Recent Requests</h2>
        </div>

        {/* Empty state — shown when no requests exist yet */}
        {requests.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            No requests yet. Raise your first request!
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map(req => (
              <div
                key={req.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >

                {/* Left: blood type icon + meta info */}
                <div className="flex items-center gap-4">

                  {/* Blood type badge e.g. "AB+" or "O−" */}
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xs font-medium text-red-600">
                    {btShort(req.bloodType)}
                  </div>

                  {/* Request title + date + optional notes */}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {req.bloodType} — {req.unitsNeeded} unit{req.unitsNeeded > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day:    'numeric',
                        month:  'short',
                        hour:   '2-digit',
                        minute: '2-digit',
                      })}
                      {/* Append notes inline if present */}
                      {req.notes && ` · ${req.notes}`}
                    </div>
                  </div>
                </div>

                {/* Right: urgency badge + status badge + cancel button */}
                <div className="flex items-center gap-2">

                  {/* Urgency badge — color coded by severity */}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyColor(req.urgencyLevel)}`}>
                    {req.urgencyLevel}
                  </span>

                  {/* Status badge — shows current lifecycle state */}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(req.status)}`}>
                    {req.status}
                  </span>

                  {/* Cancel button — only available while request is still PENDING */}
                  {req.status === 'PENDING' && (
                    <button
                      onClick={() => cancelRequest(req.id)}
                      className="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}